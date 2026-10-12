/* Гео-Динозавр — категории результатов и мемы.
   Каждая категория: свой мем (пиксель-арт в SVG), описание,
   акцентный цвет и фраза сравнения. Шкала очков определена в README:
   1 пройденное препятствие = 1 очко, верх шкалы — 100. */
(function (ns) {
  'use strict';

  var Sprites = ns.Sprites;

  /* ---------- помощники для сборки SVG ---------- */

  function pxSvg(rows, colors, scale) {
    var out = '';
    for (var y = 0; y < rows.length; y++) {
      var row = rows[y];
      for (var x = 0; x < row.length; x++) {
        var c = colors[row.charAt(x)];
        if (c) {
          out += '<rect x="' + x * scale + '" y="' + y * scale +
                 '" width="' + scale + '" height="' + scale + '" fill="' + c + '"/>';
        }
      }
    }
    return out;
  }

  function caption(text, y, size) {
    if (!text) return '';
    return '<text x="160" y="' + y + '" text-anchor="middle" ' +
      'font-family="Impact,\'Arial Black\',\'Franklin Gothic Bold\',sans-serif" ' +
      'font-size="' + (size || 30) + '" font-weight="900" fill="#ffffff" ' +
      'stroke="#000000" stroke-width="7" paint-order="stroke" ' +
      'letter-spacing="1.5">' + text + '</text>';
  }

  function memeSvg(bg, inner, top, bottom) {
    return '<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Мем: ' + top + ' ' + bottom + '">' +
      '<rect width="320" height="240" fill="' + bg + '"/>' + inner +
      caption(top, 36) + caption(bottom, 218) + '</svg>';
  }

  /* ступенчатая пиксельная гора */
  function mountSvg(cx, baseY, w, h, color, step) {
    var s = '', n = Math.round(h / step);
    for (var i = 0; i < n; i++) {
      var bw = w * (1 - i / n);
      s += '<rect x="' + Math.round(cx - bw / 2) + '" y="' + Math.round(baseY - (i + 1) * step) +
           '" width="' + Math.round(bw) + '" height="' + step + '" fill="' + color + '"/>';
    }
    return s;
  }

  /* ---------- пиксель-арт персонажей мемов ---------- */

  var CAT = [
    '##........##',
    '############',
    '############',
    '@@@@@@@@@@@@',
    '@@@w@@@@w@@@',
    '############',
    '#####pp#####',
    '############',
    '############',
    '############',
    '############'
  ];
  var CAT_COLORS = { '#': '#7d7d85', '@': '#17191d', w: '#ffffff', p: '#e59aa0' };

  var CROWN = ['#.#.#', '#####', '#####'];
  var CROWN_COLORS = { '#': '#e8c11c' };

  var OWL = [
    '##........##',
    '############',
    '#www####www#',
    '#wpw####wpw#',
    '############',
    '#####pp#####',
    '############',
    '############',
    '############',
    '.##########.',
    '..########..'
  ];
  var OWL_COLORS = { '#': '#8a6d3b', w: '#ffffff', p: '#17191d' };

  var GLOBE = [
    '..######..',
    '.##@@#####',
    '.#@@@#####',
    '###@@@@###',
    '#####@@@##',
    '##@@######',
    '###@@@@###',
    '.#####@@#.',
    '.########.',
    '..######..'
  ];
  var GLOBE_COLORS = { '#': '#3f7fd6', '@': '#4caf50' };

  var MAP = [
    '############',
    '#..........#',
    '#..@@......#',
    '#...@......#',
    '#...@@@....#',
    '#..@..@....#',
    '#..@..@@...#',
    '#..@...@..x#',
    '#..........#',
    '############'
  ];
  var MAP_COLORS = { '#': '#d9c98f', '.': '#f4e9c8', '@': '#d9534f', x: '#b03a37' };

  var DINO_FULL = null; // тело + ноги «стоя», инициализируется ниже
  var INK = { '#': '#2a2d33' };

  function dinoFull() {
    if (!DINO_FULL) DINO_FULL = Sprites.DINO_BODY.concat(Sprites.LEGS.stand);
    return DINO_FULL;
  }

  function dinoUpright(scale, x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' + pxSvg(dinoFull(), INK, scale) + '</g>';
  }

  /* ---------- мемы по категориям ---------- */

  var TIERS = [
    {
      min: 0, max: 9,
      title: 'Новичок-путешественник',
      accent: '#d9534f',
      bg: '#f3e3e3',
      desc: 'Даже Магеллан когда-то путал лево и право. Начни с материков — и мир станет ближе!',
      compare: 'Ну, бывает! География только ждёт тебя.',
      captions: ['ГЕОГРАФИЯ', 'ЭТО СЛОЖНО'],
      art: function () {
        return '<g transform="rotate(97 150 130)">' + dinoUpright(6, 84, 70) + '</g>' +
          '<text x="230" y="70" font-size="26" fill="#d9534f" font-family="Impact,\'Arial Black\',sans-serif" stroke="#fff" stroke-width="4" paint-order="stroke">@</text>' +
          pxSvgG(150, 150) +
          '<rect x="40" y="170" width="240" height="5" fill="#c9c9cf"/>';
      }
    },
    {
      min: 10, max: 24,
      title: 'Юный турист',
      accent: '#e8912d',
      bg: '#f6ecdc',
      desc: 'Уже отличаешь Австралию от Австрии. Почти. Глобус одобрительно кивает.',
      compare: 'Ты знаешь географию лучше, чем 20% людей!',
      captions: ['Я НА КАРТЕ', 'ГДЕ-ТО ЗДЕСЬ'],
      art: function () {
        return dinoUpright(6, 70, 70) +
          '<g transform="translate(196,84)">' + pxSvg(MAP, MAP_COLORS, 8) + '</g>' +
          '<rect x="40" y="196" width="240" height="5" fill="#c9c9cf"/>';
      }
    },
    {
      min: 25, max: 49,
      title: 'Путешественник',
      accent: '#5cb85c',
      bg: '#e4f3e4',
      desc: 'Неплохо для первого раза! Карту мира можно уже вешать на стену.',
      compare: 'Ты знаешь географию лучше, чем 50% людей!',
      captions: ['НЕ ПЛОХО,', 'ДЛЯ ПЕРВОГО РАЗА'],
      art: function () {
        return '<g transform="translate(100,70)">' + pxSvg(CAT, CAT_COLORS, 10) + '</g>' +
          '<rect x="40" y="188" width="240" height="5" fill="#c9c9cf"/>';
      }
    },
    {
      min: 50, max: 74,
      title: 'Исследователь',
      accent: '#2e9ca8',
      bg: '#e0eff1',
      desc: 'Горы и реки тебе почти родня. Осталось освоить океанские течения.',
      compare: 'Ты знаешь географию лучше, чем 75% людей!',
      captions: ['ВИЖУ ГОРЫ', 'И ЗНАЮ, КАК ИХ ЗОВУТ'],
      art: function () {
        return mountSvg(120, 172, 120, 90, '#a9bfc4', 10) +
          mountSvg(215, 172, 90, 64, '#c2d4d8', 8) +
          dinoUpright(5, 60, 102) +
          '<rect x="40" y="172" width="240" height="5" fill="#9aa7ac"/>';
      }
    },
    {
      min: 75, max: 99,
      title: 'Географ',
      accent: '#4a7bd0',
      bg: '#e3eaf8',
      desc: 'Глобус — твой лучший друг. Можно работать экскурсоводом!',
      compare: 'Ты знаешь географию лучше, чем 90% людей!',
      captions: ['ГЛОБУС', 'МОЙ ЛУЧШИЙ ДРУГ'],
      art: function () {
        return '<g transform="translate(76,74)">' + pxSvg(OWL, OWL_COLORS, 10) + '</g>' +
          '<g transform="translate(196,88)">' + pxSvg(GLOBE, GLOBE_COLORS, 7) + '</g>' +
          '<rect x="40" y="188" width="240" height="5" fill="#c9c9cf"/>';
      }
    },
    {
      min: 100, max: Infinity,
      title: 'Магистр географии',
      accent: '#c9a227',
      bg: '#f6f0da',
      desc: 'Легенда! Карта мира снимает шляпу. Можно идти спасать заблудившихся туристов.',
      compare: 'Ты знаешь географию лучше, чем 99% людей!',
      captions: ['ЛЕГЕНДА', 'ГЕОГРАФИИ'],
      art: function () {
        return '<g transform="translate(100,96)">' + pxSvg(CAT, CAT_COLORS, 10) + '</g>' +
          '<g transform="translate(132,66)">' + pxSvg(CROWN, CROWN_COLORS, 12) + '</g>' +
          '<text x="240" y="90" font-size="24" fill="#c9a227" stroke="#fff" stroke-width="3" paint-order="stroke" font-family="Impact,\'Arial Black\',sans-serif">&#9733;</text>' +
          '<text x="256" y="120" font-size="18" fill="#c9a227" stroke="#fff" stroke-width="3" paint-order="stroke" font-family="Impact,\'Arial Black\',sans-serif">&#9733;</text>' +
          '<rect x="40" y="206" width="240" height="5" fill="#c9c9cf"/>';
      }
    }
  ];

  /* маленький кактус для первого мема — переиспользуем спрайт игры */
  function pxSvgG(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
      pxSvg(Sprites.CACTUS_SMALL, INK, 4) + '</g>';
  }

  function tierFor(score) {
    for (var i = TIERS.length - 1; i >= 0; i--) {
      if (score >= TIERS[i].min) return TIERS[i];
    }
    return TIERS[0];
  }

  function buildMemeSvg(score) {
    var t = tierFor(score);
    return memeSvg(t.bg, t.art(), t.captions[0], t.captions[1]);
  }

  function memeAssetFor(score) {
    var ranges = [
      { min: 0, max: 20 },
      { min: 20, max: 30 },
      { min: 30, max: 40 },
      { min: 40, max: 50 },
      { min: 60, max: 70 },
      { min: 80, max: 90 },
      { min: 90, max: 100 }
    ];
    var percentage = Math.max(0, Math.min(Math.floor(score), 100));
    for (var i = 0; i < ranges.length; i++) {
      if (percentage >= ranges[i].min && percentage < ranges[i].max) {
        return 'png/' + ranges[i].min + '-' + ranges[i].max + '.png';
      }
    }
    if (percentage === 100) return 'png/90-100.png';
    return null;
  }

  ns.MemeCatalog = {
    TIERS: TIERS,
    tierFor: tierFor,
    buildMemeSvg: buildMemeSvg,
    memeAssetFor: memeAssetFor
  };
})(window.GeoDino = window.GeoDino || {});
