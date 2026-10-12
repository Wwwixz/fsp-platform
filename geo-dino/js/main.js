/* Гео-Динозавр — сборка: создаёт мир, банк вопросов, звук, интерфейс
   и игру, связывает кнопки, клавиатуру и тапы. Единственная точка входа. */
(function (ns) {
  'use strict';

  var world = new ns.World(document.getElementById('canvas'));
  var sounds = new ns.SoundFX(ns.Storage);
  var ui = new ns.UI();
  var bank = new ns.QuestionBank(ns.QUESTIONS);
  var game = new ns.Game({ world: world, ui: ui, bank: bank, sounds: sounds, storage: ns.Storage });

  var S = ns.Game.STATE;
  var stage = document.getElementById('stage');

  ui.setSoundOn(sounds.enabled);

  /* после клика по кнопке убираем с неё фокус, чтобы пробел
     управлял прыжком, а не «нажимал» кнопку повторно */
  function blurActive() {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  /* ---------- кнопки ---------- */

  document.getElementById('btn-start').addEventListener('click', function () {
    sounds.unlock();
    game.startRun();
    blurActive();
  });

  document.getElementById('btn-next').addEventListener('click', function () {
    game.playResultVideo();
    blurActive();
  });

  document.getElementById('btn-skip-video').addEventListener('click', function () {
    game.restart();
    blurActive();
  });

  document.getElementById('btn-retry-video').addEventListener('click', function () {
    ui.showResultVideo();
    blurActive();
  });

  document.getElementById('result-video').addEventListener('ended', function () {
    game.restart();
  });

  document.getElementById('result-video').addEventListener('error', function () {
    ui.showVideoError();
  });

  document.getElementById('btn-sound').addEventListener('click', function () {
    sounds.unlock();
    ui.setSoundOn(sounds.toggle());
  });

  /* ---------- прыжок тапом или кликом по полю ---------- */

  stage.addEventListener('pointerdown', function (e) {
    // клики по кнопкам интерфейса — не прыжок
    if (e.target.closest && e.target.closest('button')) return;
    if (game.state === S.RUNNING) {
      e.preventDefault();
      sounds.unlock();
      game.tryJump();
    }
  });

  /* ---------- клавиатура ---------- */

  document.addEventListener('keydown', function (e) {
    // не перехватываем клавиши, когда фокус на кнопке — пусть работает Enter
    if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, select, video')) return;

    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      sounds.unlock();
      if (game.state === S.MENU) game.startRun();
      else if (game.state === S.RUNNING) game.tryJump();
      else if (game.state === S.RESULTS) game.playResultVideo();
      return;
    }

    if (e.code === 'Enter') {
      sounds.unlock();
      if (game.state === S.MENU) game.startRun();
      else if (game.state === S.RESULTS) game.playResultVideo();
      return;
    }

    // ответы клавишами 1–4 во время вопроса
    if (game.state === S.QUESTION && e.key >= '1' && e.key <= '4') {
      sounds.unlock();
      ui.answerByIndex(parseInt(e.key, 10) - 1);
    }
  });

  /* ---------- разблокировка звука первым действием пользователя ---------- */

  var unlockOnce = function () {
    sounds.unlock();
    window.removeEventListener('pointerdown', unlockOnce);
    window.removeEventListener('keydown', unlockOnce);
  };
  window.addEventListener('pointerdown', unlockOnce);
  window.addEventListener('keydown', unlockOnce);

  /* отладочный доступ для тестов (не используется игровыми модулями) */
  ns.debug = { game: game, world: world, ui: ui, sounds: sounds };

  /* остановка анимации счёта при скрытии вкладки не требуется:
     requestAnimationFrame браузер останавливает сам, dt в цикле ограничен */
})(window.GeoDino);
