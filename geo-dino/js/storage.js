/* Гео-Динозавр — сохранение рекорда и настроек (localStorage).
   В приватном режиме браузера хранилище может быть недоступно —
   тогда играем без сохранения, без падения. */
(function (ns) {
  'use strict';

  var KEYS = {
    best: 'geodino:best',
    sound: 'geodino:sound'
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* игнорируем: рекорд просто не переживёт перезагрузку */
    }
  }

  ns.Storage = {
    getBest: function () { return Math.max(0, read(KEYS.best, 0) | 0); },
    setBest: function (v) { write(KEYS.best, v); },
    getSound: function () { return read(KEYS.sound, true) !== false; },
    setSound: function (v) { write(KEYS.sound, !!v); }
  };
})(window.GeoDino = window.GeoDino || {});
