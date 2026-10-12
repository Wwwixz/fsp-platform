/* Гео-Динозавр — интерфейс: экраны, HUD, карточка вопроса, тост,
   экран окончания и итоговый экран. Только DOM, никакой игровой логики. */
(function (ns) {
  'use strict';

  var CONFIG = ns.CONFIG;

  function $(id) { return document.getElementById(id); }

  /* русская плюрализация: формы для 1 / 2–4 / 5+ */
  function plural(n, forms) {
    var n10 = n % 10, n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
    return forms[2];
  }

  function UI() {
    this.el = {
      stage: $('stage'),
      hudScore: $('hud-score'),
      hudBest: $('hud-best'),
      menu: $('screen-menu'),
      qcard: $('qcard'),
      qChip: $('q-chip'),
      qCount: $('q-count'),
      qText: $('q-text'),
      answers: $('answers'),
      toast: $('toast'),
      toastText: $('toast-text'),
      results: $('results'),
      resultsGrid: $('results').querySelector('.results-grid'),
      videoScreen: $('video-screen'),
      resultVideo: $('result-video'),
      videoError: $('video-error'),
      retryVideo: $('btn-retry-video'),
      resScore: $('res-score'),
      resMax: $('res-max'),
      resCompare: $('res-compare'),
      resBest: $('res-best'),
      pbarFill: $('pbar-fill'),
      recordBadge: $('record-badge'),
      memeCol: $('res-meme-col'),
      statsList: $('stats-list'),
      btnSound: $('btn-sound')
    };

    this.currentQuestion = null;
    this._toastTimer = 0;
    this._cardTimer = 0;
    this._answerHandler = null;
  }

  /* ---------- HUD ---------- */

  UI.prototype.setScore = function (n, animate) {
    this.el.hudScore.textContent = n;
    if (animate) {
      this.el.hudScore.classList.remove('bump');
      void this.el.hudScore.offsetWidth; // перезапуск анимации
      this.el.hudScore.classList.add('bump');
    }
  };

  UI.prototype.setBest = function (n) {
    this.el.hudBest.textContent = n;
  };

  UI.prototype.setSoundOn = function (on) {
    this.el.btnSound.textContent = on ? '🔊' : '🔇';
    this.el.btnSound.setAttribute('aria-pressed', String(on));
    this.el.btnSound.setAttribute('aria-label', on ? 'Выключить звук' : 'Включить звук');
  };

  /* ---------- меню ---------- */

  UI.prototype.showMenu = function () { this.el.menu.hidden = false; };
  UI.prototype.hideMenu = function () { this.el.menu.hidden = true; };

  UI.prototype.resetForRun = function () {
    this.hideMenu();
    this.hideQuestion(true);
    this.hideToast();
    this.hideResults(true);
    this.hideResultVideo();
    this.el.stage.classList.remove('shake');
  };

  /* ---------- карточка вопроса ---------- */

  UI.prototype.showQuestion = function (q, count, onAnswer) {
    var self = this;
    this.currentQuestion = q;
    this._answered = false;
    this._answerHandler = onAnswer;

    window.clearTimeout(this._cardTimer);
    this.el.qcard.classList.remove('out');
    this.el.qChip.textContent = q.tag;
    this.el.qCount.textContent = 'Вопрос ' + count;
    this.el.qText.textContent = q.q;

    var box = this.el.answers;
    box.textContent = '';
    q.options.forEach(function (text, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer';
      var num = document.createElement('span');
      num.className = 'a-num';
      num.textContent = idx + 1;
      var label = document.createElement('span');
      label.textContent = text;
      btn.appendChild(num);
      btn.appendChild(label);
      btn.addEventListener('click', function () {
        if (self._answered || self.currentQuestion !== q) return;
        self._answered = true;
        onAnswer(idx);
      });
      box.appendChild(btn);
    });

    this.el.qcard.hidden = false;
  };

  UI.prototype.lockAnswers = function () {
    this._answered = true;
    var buttons = this.el.answers.querySelectorAll('.answer');
    for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
  };

  UI.prototype.markAnswer = function (idx, kind) {
    var buttons = this.el.answers.querySelectorAll('.answer');
    if (!buttons[idx]) return;
    buttons[idx].classList.add(kind);
    for (var i = 0; i < buttons.length; i++) {
      if (i !== idx && !buttons[i].classList.contains('correct') && !buttons[i].classList.contains('wrong')) {
        buttons[i].classList.add('dimmed');
      }
    }
  };

  /* ответ по клавишам 1–4 — вызывает тот же обработчик, что и клик */
  UI.prototype.answerByIndex = function (idx) {
    var q = this.currentQuestion;
    if (!q || this._answered || !this._answerHandler) return;
    if (idx < 0 || idx >= q.options.length) return;
    this.lockAnswers();
    this._answerHandler(idx);
  };

  UI.prototype.hideQuestion = function (instant) {
    var self = this;
    window.clearTimeout(this._cardTimer);
    if (instant || this.el.qcard.hidden) {
      this.el.qcard.hidden = true;
      this.el.qcard.classList.remove('out');
      return;
    }
    this.el.qcard.classList.add('out');
    this._cardTimer = window.setTimeout(function () {
      self.el.qcard.hidden = true;
      self.el.qcard.classList.remove('out');
    }, 180);
  };

  /* ---------- тост ---------- */

  UI.prototype.showToast = function () {
    var self = this;
    window.clearTimeout(this._toastTimer);
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    this.el.toastText.textContent = coarse
      ? 'Правильно! Тапни для прыжка!'
      : 'Правильно! Пробел — прыжок!';
    this.el.toast.classList.remove('out');
    this.el.toast.hidden = false;
    this._toastTimer = window.setTimeout(function () { self.hideToast(); }, 1300);
  };

  UI.prototype.hideToast = function () {
    var self = this;
    window.clearTimeout(this._toastTimer);
    if (this.el.toast.hidden) return;
    this.el.toast.classList.add('out');
    this._toastTimer = window.setTimeout(function () {
      self.el.toast.hidden = true;
      self.el.toast.classList.remove('out');
    }, 220);
  };

  /* ---------- тряска ---------- */

  UI.prototype.shakeStage = function () {
    var st = this.el.stage;
    st.classList.remove('shake');
    void st.offsetWidth;
    st.classList.add('shake');
  };

  /* ---------- итоговый экран ---------- */

  UI.prototype.showResults = function (data) {
    var score = data.score;
    var tier = data.tier;

    this.hideResultVideo();
    // счёт: при выходе за шкалу показываем фактическое число без «/ 100»
    this.el.resMax.textContent = score <= CONFIG.SCORE_SCALE_MAX ? '/ 100' : '· выше шкалы 100';
    this.el.resCompare.textContent = 'Твой результат — ' +
      Math.min(score, CONFIG.SCORE_SCALE_MAX) + '%.';
    this.el.resBest.textContent = data.best;
    this.el.recordBadge.hidden = !data.isNewRecord;

    // мем категории + описание
    var col = this.el.memeCol;
    col.textContent = '';
    col.hidden = false;
    this.el.resultsGrid.classList.remove('results-grid--no-meme');
    var title = document.createElement('p');
    title.className = 'tier-title';
    title.style.color = tier.accent;
    title.textContent = tier.title;
    var frame = document.createElement('div');
    frame.className = 'meme-frame';
    var memeAsset = ns.MemeCatalog.memeAssetFor(score);
    if (memeAsset) {
      var image = document.createElement('img');
      image.src = memeAsset;
      image.alt = 'Мем для результата ' + Math.min(score, CONFIG.SCORE_SCALE_MAX) + ' из 100';
      frame.appendChild(image);
    } else {
      frame.innerHTML = ns.MemeCatalog.buildMemeSvg(score);
    }
    col.appendChild(title);
    col.appendChild(frame);
    var desc = document.createElement('p');
    desc.className = 'tier-desc';
    desc.textContent = tier.desc;
    col.appendChild(desc);

    // статистика
    var list = this.el.statsList;
    list.textContent = '';
    [
      score + ' ' + plural(score, ['географический вопрос', 'географических вопроса', 'географических вопросов']),
      score + ' ' + plural(score, ['прыжок через кактус', 'прыжка через кактус', 'прыжков через кактусы']),
      'проверил свои знания о мире'
    ].forEach(function (text) {
      var li = document.createElement('li');
      var tick = document.createElement('span');
      tick.className = 'tick';
      tick.textContent = '✓';
      var span = document.createElement('span');
      span.textContent = text;
      li.appendChild(tick);
      li.appendChild(span);
      list.appendChild(li);
    });

    this.el.results.hidden = false;

    // анимация полосы: от нуля к заполнению
    var fill = this.el.pbarFill;
    fill.style.transition = 'none';
    fill.style.width = '0%';
    void fill.offsetWidth;
    fill.style.transition = '';
    fill.style.width = Math.min(100, score) + '%';

    this.el.resScore.textContent = score;
  };
  UI.prototype.showResultVideo = function () {
    var self = this;
    this.el.results.hidden = true;
    this.el.videoError.hidden = true;
    this.el.retryVideo.hidden = true;
    this.el.videoScreen.hidden = false;
    this.el.resultVideo.currentTime = 0;

    if (window.location.protocol === 'file:') {
      this.el.videoError.textContent =
        'Браузер блокирует видео при открытии index.html напрямую. Запусти node serve.cjs 8099 и открой http://localhost:8099.';
      this.el.videoError.hidden = false;
      return;
    }

    var playback = this.el.resultVideo.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(function () { self.showVideoError(); });
    }
  };

  UI.prototype.showVideoError = function () {
    this.el.videoError.hidden = false;
    this.el.retryVideo.hidden = false;
  };

  UI.prototype.hideResultVideo = function () {
    this.el.resultVideo.pause();
    this.el.resultVideo.currentTime = 0;
    this.el.videoScreen.hidden = true;
    this.el.videoError.hidden = true;
    this.el.retryVideo.hidden = true;
  };

  UI.prototype.hideResults = function (instant) {
    this.el.results.hidden = true;
  };

  ns.UI = UI;
})(window.GeoDino = window.GeoDino || {});
