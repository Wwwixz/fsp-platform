/* Гео-Динозавр — звуковые эффекты на Web Audio API.
   Никаких внешних файлов: все звуки синтезируются осцилляторами.
   AudioContext создаётся только после первого действия пользователя
   (требование браузеров), есть переключатель вкл/выкл с сохранением. */
(function (ns) {
  'use strict';

  function SoundFX(storage) {
    this.storage = storage;
    this.enabled = storage.getSound();
    this.ctx = null;
  }

  /* вызвать при первом взаимодействии пользователя с игрой */
  SoundFX.prototype.unlock = function () {
    if (!this.ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        try { this.ctx = new AC(); } catch (e) { this.ctx = null; }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  };

  SoundFX.prototype.setEnabled = function (v) {
    this.enabled = !!v;
    this.storage.setSound(this.enabled);
  };

  SoundFX.prototype.toggle = function () {
    this.setEnabled(!this.enabled);
    return this.enabled;
  };

  /* один тон: частота, длительность, тип волны, скольжение, задержка старта */
  SoundFX.prototype._tone = function (freq, dur, opts) {
    if (!this.enabled || !this.ctx) return;
    opts = opts || {};
    var t0 = this.ctx.currentTime + (opts.at || 0);
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();
    osc.type = opts.type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slide) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + opts.slide), t0 + dur);
    }
    gain.gain.setValueAtTime(opts.vol || 0.12, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  };

  /* шумовой удар для столкновения */
  SoundFX.prototype._noise = function (dur, vol) {
    if (!this.enabled || !this.ctx) return;
    var len = Math.floor(this.ctx.sampleRate * dur);
    var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    var src = this.ctx.createBufferSource();
    src.buffer = buf;
    var gain = this.ctx.createGain();
    gain.gain.value = vol;
    var filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();
  };

  /* ---- эффекты игры ---- */

  SoundFX.prototype.jump = function () {
    this._tone(340, 0.14, { type: 'square', vol: 0.10, slide: 300 });
  };

  SoundFX.prototype.correct = function () {
    this._tone(620, 0.08, { type: 'triangle', vol: 0.14 });
    this._tone(830, 0.12, { type: 'triangle', vol: 0.14, at: 0.08 });
  };

  SoundFX.prototype.wrong = function () {
    this._tone(190, 0.30, { type: 'sawtooth', vol: 0.12, slide: -120 });
  };

  SoundFX.prototype.crash = function () {
    this._noise(0.25, 0.22);
    this._tone(95, 0.3, { type: 'triangle', vol: 0.2, slide: -55 });
  };

  SoundFX.prototype.over = function () {
    this._tone(392, 0.15, { type: 'triangle', vol: 0.13 });
    this._tone(330, 0.15, { type: 'triangle', vol: 0.13, at: 0.16 });
    this._tone(262, 0.28, { type: 'triangle', vol: 0.13, at: 0.32 });
  };

  SoundFX.prototype.milestone = function () {
    this._tone(988, 0.09, { type: 'square', vol: 0.08 });
    this._tone(1319, 0.10, { type: 'square', vol: 0.08, at: 0.09 });
  };

  ns.SoundFX = SoundFX;
})(window.GeoDino = window.GeoDino || {});
