/* Гео-Динозавр — мир игры на canvas: земля, горы, облака, кактусы,
   динозавр и частицы пыли. Отвечает только за отрисовку и простую
   кинематику; правила игры (состояния, вопросы, очки) — в game.js.
   Рендер учитывает devicePixelRatio и работает в CSS-пикселях. */
(function (ns) {
  'use strict';

  var CONFIG = ns.CONFIG;
  var Sprites = ns.Sprites;
  var COL = Sprites.COLORS;

  function World(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.W = 0;
    this.H = 0;
    this.groundY = 0;
    this.px = CONFIG.PX;

    this.dist = 0;        // пройденный путь (для прокрутки земли и гор)
    this.speed = 0;
    this.obstacles = [];  // активные кактусы
    this.clouds = [];
    this.particles = [];  // пыль при столкновении
    this.dino = {
      y: 0, vy: 0,        // y — высота над землёй (0 = стоит)
      frame: 'stand',
      frameT: 0,
      dead: false
    };

    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', this._onResize);
    this.resize();
    this._initClouds();
  }

  World.prototype.destroy = function () {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('orientationchange', this._onResize);
  };

  World.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.W = Math.max(1, Math.round(rect.width));
    this.H = Math.max(1, Math.round(rect.height));
    this.canvas.width = Math.round(this.W * dpr);
    this.canvas.height = Math.round(this.H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.groundY = this.H - CONFIG.GROUND_OFFSET;
    this.px = this.W < CONFIG.MOBILE_W ? CONFIG.PX_MOBILE : CONFIG.PX;
  };

  World.prototype._initClouds = function () {
    this.clouds = [];
    var n = 3 + Math.floor(Math.random() * 2);
    for (var i = 0; i < n; i++) {
      this.clouds.push({
        x: Math.random() * this.W,
        y: 24 + Math.random() * (this.H * 0.35),
        s: 0.7 + Math.random() * 0.6   // масштаб облака
      });
    }
  };

  /* сброс к состоянию «бег начался заново» */
  World.prototype.resetRun = function () {
    this.dist = 0;
    this.speed = 0;
    this.obstacles = [];
    this.particles = [];
    this.dino.y = 0;
    this.dino.vy = 0;
    this.dino.frame = 'stand';
    this.dino.frameT = 0;
    this.dino.dead = false;
  };

  /* ---- кактусы ---- */

  var KINDS = {
    small:  { map: 'small', count: 1 },
    double: { map: 'small', count: 2 },
    triple: { map: 'small', count: 3 },
    big:    { map: 'big', count: 1 }
  };

  World.prototype.addObstacle = function (kind, x) {
    var spec = KINDS[kind];
    var colsOne = spec.map === 'big' ? 12 : 10;
    var gapCols = 2;
    var totalCols = spec.count * colsOne + (spec.count - 1) * gapCols;
    this.obstacles.push({
      kind: kind,
      spec: spec,
      x: x,
      cols: totalCols,
      scored: false,
      questionDone: false
    });
  };

  World.prototype.obstacleWidth = function (ob) {
    return ob.cols * this.px;
  };

  World.prototype.obstacleHeight = function (ob) {
    var rows = ob.spec.map === 'big' ? 28 : 20;
    return rows * this.px;
  };

  /* ---- пыль столкновения ---- */

  World.prototype.burstDust = function () {
    var dinoX = CONFIG.DINO_X;
    for (var i = 0; i < 14; i++) {
      this.particles.push({
        x: dinoX + Math.random() * 66,
        y: this.groundY - Math.random() * 10,
        vx: -60 - Math.random() * 120,
        vy: -40 - Math.random() * 130,
        life: 0.5 + Math.random() * 0.4,
        t: 0,
        size: (2 + Math.random() * 3) * (this.px / 3)
      });
    }
  };

  /* ---- обновление мира ----
     moving — движется ли полоса препятствий (бег / роковой пролёт кактуса) */

  World.prototype.update = function (dt, moving, speed, dinoRunning) {
    this.speed = speed;

    if (moving) {
      this.dist += speed * dt;
      for (var i = 0; i < this.obstacles.length; i++) {
        this.obstacles[i].x -= speed * dt;
      }
    }

    // облака плывут всегда — сцена «живая» даже на паузе вопроса
    var cloudDrift = 9 + (moving ? speed * 0.12 : 0);
    for (var c = 0; c < this.clouds.length; c++) {
      var cl = this.clouds[c];
      cl.x -= cloudDrift * dt * cl.s;
      if (cl.x < -20 * this.px * cl.s) {
        cl.x = this.W + 20;
        cl.y = 24 + Math.random() * (this.H * 0.35);
      }
    }

    // физика прыжка динозавра: vy>0 — движение вверх, гравитация его гасит
    var d = this.dino;
    if (d.y > 0 || d.vy !== 0) {
      d.vy -= CONFIG.GRAVITY * dt;
      d.y += d.vy * dt;
      if (d.y <= 0) { d.y = 0; d.vy = 0; }
    }

    // анимация ног
    var airborne = d.y > 0;
    if (airborne) {
      d.frame = 'jump';
    } else if (dinoRunning) {
      d.frameT += dt;
      if (d.frameT >= 0.09) {
        d.frameT = 0;
        d.frame = d.frame === 'runA' ? 'runB' : 'runA';
      }
    } else if (!d.dead) {
      d.frame = 'stand';
    }

    // частицы
    for (var p = this.particles.length - 1; p >= 0; p--) {
      var pt = this.particles[p];
      pt.t += dt;
      if (pt.t >= pt.life) { this.particles.splice(p, 1); continue; }
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 500 * dt;
    }
  };

  /* ---- отрисовка ---- */

  World.prototype.render = function () {
    var ctx = this.ctx;
    var px = this.px;
    ctx.fillStyle = '#ececec';
    ctx.fillRect(0, 0, this.W, this.H);

    this._renderMountains(ctx);
    this._renderClouds(ctx);
    this._renderGround(ctx);
    this._renderObstacles(ctx);
    this._renderDino(ctx);
    this._renderParticles(ctx);
  };

  World.prototype._renderMountains = function (ctx) {
    var layers = [
      { color: COL.mountFar, factor: 0.16, period: 210, h: 74, seed: 3 },
      { color: COL.mountNear, factor: 0.30, period: 260, h: 96, seed: 7 }
    ];
    for (var l = 0; l < layers.length; l++) {
      var L = layers[l];
      var offset = (this.dist * L.factor) % L.period;
      var startI = Math.floor((this.dist * L.factor) / L.period);
      ctx.fillStyle = L.color;
      for (var i = -1; i <= Math.ceil(this.W / L.period) + 1; i++) {
        var x0 = i * L.period - offset;
        var rnd = Math.abs(Math.sin((startI + i) * L.seed)) ;
        var h = L.h * (0.55 + rnd * 0.45);
        var w = L.period * (0.55 + rnd * 0.3);
        this._stairs(ctx, x0 + L.period * 0.5 - w / 2, this.groundY, w, h, 8);
      }
    }
  };

  /* ступенчатый треугольник-гора */
  World.prototype._stairs = function (ctx, x, baseY, w, h, step) {
    var n = Math.max(2, Math.round(h / step));
    for (var i = 0; i < n; i++) {
      var bw = w * (1 - i / n);
      ctx.fillRect(
        Math.round(x + (w - bw) / 2),
        Math.round(baseY - (i + 1) * step),
        Math.round(bw),
        step
      );
    }
  };

  World.prototype._renderClouds = function (ctx) {
    for (var i = 0; i < this.clouds.length; i++) {
      var cl = this.clouds[i];
      Sprites.drawMap(ctx, Sprites.CLOUD, cl.x, cl.y, Math.round(this.px * cl.s), COL.cloud);
    }
  };

  World.prototype._renderGround = function (ctx) {
    var px = this.px;
    var y = this.groundY;
    ctx.fillStyle = COL.ground;
    // сплошная линия
    ctx.fillRect(0, y, this.W, Math.max(2, Math.round(px * 0.66)));
    // пунктир ниже
    var dash = 4 * px, gap = 4 * px;
    var off = this.dist % (dash + gap);
    for (var x = -off; x < this.W; x += dash + gap) {
      ctx.fillRect(Math.round(x), y + 2 * px, dash, Math.max(2, Math.round(px * 0.5)));
    }
    // камешки — детерминированные точки, прокручиваются вместе с землёй
    var period = 90;
    var poff = this.dist % period;
    for (var k = -1; k < this.W / period + 1; k++) {
      var bx = k * period - poff;
      var seed = Math.abs(Math.sin(Math.floor(this.dist / period) + k) * 12.9898) % 1;
      ctx.fillRect(Math.round(bx + seed * 40), y + Math.round(1.4 * px), px, Math.round(px * 0.66));
    }
  };

  World.prototype._renderObstacles = function (ctx) {
    var px = this.px;
    for (var i = 0; i < this.obstacles.length; i++) {
      var ob = this.obstacles[i];
      var map = ob.spec.map === 'big' ? Sprites.CACTUS_BIG : Sprites.CACTUS_SMALL;
      var colsOne = ob.spec.map === 'big' ? 12 : 10;
      var h = this.obstacleHeight(ob);
      var y = this.groundY - h;
      for (var c = 0; c < ob.spec.count; c++) {
        var cx = ob.x + c * (colsOne + 2) * px;
        Sprites.drawMap(ctx, map, cx, y, px, COL.ink);
      }
    }
  };

  World.prototype._renderDino = function (ctx) {
    var px = this.px;
    var d = this.dino;
    var w = Sprites.DINO_COLS * px;
    var h = Sprites.DINO_ROWS * px;
    var x = CONFIG.DINO_X;
    var y = this.groundY - h - d.y;

    if (d.dead) {
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(0.22); // завалился набок
      Sprites.drawDino(ctx, -w / 2, -h / 2, px, 'stand', true);
      ctx.restore();
    } else {
      Sprites.drawDino(ctx, x, y, px, d.frame, false);
    }
  };

  World.prototype._renderParticles = function (ctx) {
    ctx.fillStyle = COL.dust;
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var a = 1 - p.t / p.life;
      ctx.globalAlpha = a;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.ceil(p.size), Math.ceil(p.size));
    }
    ctx.globalAlpha = 1;
  };

  ns.World = World;
})(window.GeoDino = window.GeoDino || {});
