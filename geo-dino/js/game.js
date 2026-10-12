/* Гео-Динозавр — правила игры: конечный автомат состояний и единственный
   игровой цикл на requestAnimationFrame.

   Состояния:
     menu     — заставка, динозавр стоит
     running  — бег: земля, облака и кактусы движутся
     question — мир заморожен, игрок обязан ответить на вопрос
     doom     — ответ неверный: кактус доезжает и сталкивается с динозавром
     crashed  — момент столкновения (тряска, пыль, звук)
     results  — итоговый экран с мемом и статистикой
*/
(function (ns) {
  'use strict';

  var CONFIG = ns.CONFIG;

  var STATE = {
    MENU: 'menu', RUNNING: 'running', QUESTION: 'question',
    DOOM: 'doom', CRASHED: 'crashed', RESULTS: 'results',
    VIDEO: 'video'
  };

  function Game(deps) {
    this.world = deps.world;
    this.ui = deps.ui;
    this.bank = deps.bank;
    this.sounds = deps.sounds;
    this.storage = deps.storage;

    this.state = STATE.MENU;
    this.score = 0;
    this.best = this.storage.getBest();
    this.questionsAsked = 0;
    this.jumpUnlocked = false; // верный ответ открывает прыжок на текущее препятствие

    this.timers = [];
    this.rafId = 0;
    this.lastTs = 0;

    this.ui.setBest(this.best);

    this._loop = this.loop.bind(this);
    this.rafId = requestAnimationFrame(this._loop);
  }

  Game.prototype.destroy = function () {
    cancelAnimationFrame(this.rafId);
    this.clearTimers();
  };

  /* таймеры, которые чистятся при любом перезапуске */
  Game.prototype.after = function (ms, fn) {
    var self = this;
    var id = window.setTimeout(function () {
      self.timers = self.timers.filter(function (t) { return t !== id; });
      fn();
    }, ms);
    this.timers.push(id);
    return id;
  };

  Game.prototype.clearTimers = function () {
    this.timers.forEach(function (id) { window.clearTimeout(id); });
    this.timers = [];
  };

  /* ---------- производные величины ---------- */

  Game.prototype.speed = function () {
    return Math.min(CONFIG.MAX_SPEED, CONFIG.BASE_SPEED + this.score * CONFIG.SPEED_ACCEL);
  };

  Game.prototype._dinoFront = function () {
    return CONFIG.DINO_X + ns.Sprites.DINO_COLS * this.world.px;
  };

  /* прыжок по действию игрока (пробел / стрелка / тап): доступен,
     пока не пройдено текущее препятствие и динозавр на земле */
  Game.prototype.tryJump = function () {
    if (this.state !== STATE.RUNNING) return false;
    if (!this.jumpUnlocked || this.world.dino.y !== 0) return false;
    this.world.dino.vy = CONFIG.JUMP_V;
    this.sounds.jump();
    return true;
  };

  /* столкновение динозавра с кактусом (AABB с небольшим «прощением») */
  Game.prototype._checkCollision = function () {
    var px = this.world.px;
    var dinoW = ns.Sprites.DINO_COLS * px;
    var left = CONFIG.DINO_X + 6;
    var right = CONFIG.DINO_X + dinoW - 6;
    var rise = this.world.dino.y; // высота подъёма ног над землёй
    var obs = this.world.obstacles;
    for (var i = 0; i < obs.length; i++) {
      var ob = obs[i];
      var w = this.world.obstacleWidth(ob);
      if (right <= ob.x || left >= ob.x + w) continue; // горизонтально не пересекаем
      if (rise < this.world.obstacleHeight(ob) - 6) {  // не взлетел выше кактуса
        this._crash();
        return true;
      }
    }
    return false;
  };

  Game.prototype._firstObstacle = function () {
    return this.world.obstacles[0] || null;
  };

  /* ---------- запуск и рестарт ---------- */

  Game.prototype.startRun = function () {
    this.clearTimers();
    this.score = 0;
    this.questionsAsked = 0;
    this.jumpUnlocked = false;
    this.world.resetRun();
    this.ui.resetForRun();
    this.ui.setScore(0, false);
    this.state = STATE.RUNNING;
    // первое препятствие — всегда простое, чтобы игрок освоился
    this.world.addObstacle('small', this.world.W + 140);
  };

  Game.prototype.restart = function () {
    this.ui.hideResults(true);
    this.startRun();
  };

  Game.prototype.playResultVideo = function () {
    if (this.state !== STATE.RESULTS) return;
    this.state = STATE.VIDEO;
    this.ui.showResultVideo();
  };

  /* ---------- цикл ---------- */

  Game.prototype.loop = function (ts) {
    this.rafId = requestAnimationFrame(this._loop);
    var dt = (ts - this.lastTs) / 1000;
    this.lastTs = ts;
    if (!(dt > 0) || dt > 0.05) dt = Math.min(dt, 0.05) || 0.016; // клэмп после сворачивания вкладки

    this.update(dt);
    this.world.render();
  };

  Game.prototype.update = function (dt) {
    var moving = this.state === STATE.RUNNING || this.state === STATE.DOOM;
    var v = this.speed();

    this.world.update(dt, moving, moving ? v : 0, this.state === STATE.RUNNING);

    if (this.state === STATE.RUNNING) {
      this._updateRunning(v);
    } else if (this.state === STATE.DOOM) {
      this._updateDoom();
    }
  };

  Game.prototype._updateRunning = function (v) {
    // врезался, не успев прыгнуть, — попытка заканчивается
    if (this._checkCollision()) return;

    var ob = this._firstObstacle();
    if (!ob) return;
    var xf = this._dinoFront();
    var obsW = this.world.obstacleWidth(ob);

    // очередь вопроса: кактус достаточно близко — игра останавливается
    if (!ob.questionDone && this.world.dino.y === 0) {
      var trigger = Math.min(CONFIG.QUESTION_TRIGGER, this.world.W * 0.55);
      if (ob.x - xf <= trigger) {
        this._askQuestion(ob);
        return;
      }
    }

    // препятствие пройдено — очко, прыжок снова закрыт до следующего ответа
    if (!ob.scored && ob.x + obsW < CONFIG.DINO_X) {
      ob.scored = true;
      this.jumpUnlocked = false;
      this._addScore();
      this._spawnNext();
    }

    // уборка уехавших препятствий
    if (ob.x + obsW < -60) {
      this.world.obstacles.shift();
    }
  };

  Game.prototype._updateDoom = function () {
    var ob = this._firstObstacle();
    if (!ob) { this.state = STATE.RUNNING; return; }
    var obsW = this.world.obstacleWidth(ob);
    var dinoLeft = CONFIG.DINO_X + 8;
    var dinoRight = this._dinoFront() - 8;
    if (ob.x < dinoRight && ob.x + obsW > dinoLeft) {
      this._crash();
    }
  };

  Game.prototype._spawnNext = function () {
    var v = this.speed();
    // широкие кактусы — только на достаточной скорости, иначе прыжок не успеет
    var pool;
    if (v < 480) pool = ['small', 'small', 'double', 'small', 'double'];
    else if (v < 520) pool = ['small', 'double', 'triple', 'double', 'triple'];
    else pool = ['small', 'double', 'triple', 'big', 'double', 'big'];
    var kind = pool[Math.floor(Math.random() * pool.length)];
    var gap = 80 + Math.random() * 200;
    this.world.addObstacle(kind, this.world.W + gap);
  };

  Game.prototype._addScore = function () {
    this.score++;
    this.ui.setScore(this.score, true);
    if (this.score % 10 === 0) this.sounds.milestone();
  };

  /* ---------- вопросы ---------- */

  Game.prototype._askQuestion = function (ob) {
    ob.questionDone = true;
    this.state = STATE.QUESTION;
    var q = this.bank.next();
    this.questionsAsked++;
    var self = this;
    this.ui.showQuestion(q, this.questionsAsked, function (idx) {
      self.answer(idx);
    });
  };

  Game.prototype.answer = function (idx) {
    if (this.state !== STATE.QUESTION) return;
    var q = this.ui.currentQuestion;
    if (!q || idx < 0 || idx >= q.options.length) return;

    this.ui.lockAnswers();
    if (idx === q.correct) {
      this.ui.markAnswer(idx, 'correct');
      this.sounds.correct();
      this.ui.showToast();
      this.ui.hideQuestion();
      this.jumpUnlocked = true;  // правильный ответ разрешает прыжок
      this.state = STATE.RUNNING;
    } else {
      this.ui.markAnswer(idx, 'wrong');
      this.ui.markAnswer(q.correct, 'correct');
      this.sounds.wrong();
      this.state = STATE.DOOM;   // неверный ответ — попытка завершится столкновением
      var self = this;
      this.after(950, function () { self.ui.hideQuestion(); });
    }
  };

  /* ---------- столкновение и финал ---------- */

  Game.prototype._crash = function () {
    this.state = STATE.CRASHED;
    this.sounds.crash();
    this.world.dino.dead = true;
    this.world.burstDust();
    this.ui.shakeStage();
    this._gameOver();
  };

  Game.prototype._gameOver = function () {
    var isNew = this.score > this.best;
    if (isNew) {
      this.best = this.score;
      this.storage.setBest(this.best);
      this.ui.setBest(this.best);
    }
    this.sounds.over();
    this.state = STATE.RESULTS;
    this.ui.showResults({
      score: this.score,
      best: this.best,
      isNewRecord: isNew && this.score > 0,
      speed: this.speed(),
      tier: ns.MemeCatalog.tierFor(this.score)
    });
  };

  Game.STATE = STATE;
  ns.Game = Game;
})(window.GeoDino = window.GeoDino || {});
