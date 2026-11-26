/* Garden v3: Vaqt plants, decorations and garden themes, drawn as SVG strings with light from the upper left.
   Shared by the site and the app. No gradients or ids, so any number of copies can live on one page. */
(function () {
  'use strict';
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 1.7); }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function f(n) { return Math.round(n * 10) / 10; }
  function rnd(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 10000) / 10000; }; }
  function L(en, uz, ru) { return { en: en, uz: uz, ru: ru }; }

  var TIERS = {
    common: { c: '#9AA6C8', name: L('Common', 'Oddiy', 'Обычный'), min: 10 },
    uncommon: { c: '#3DDC97', name: L('Uncommon', 'Kamyob emas', 'Необычный'), min: 20 },
    rare: { c: '#5B9BFF', name: L('Rare', 'Kamyob', 'Редкий'), min: 30 },
    epic: { c: '#B07BFF', name: L('Epic', 'Ajoyib', 'Эпический'), min: 45 },
    legendary: { c: '#F5C04A', name: L('Legendary', 'Afsonaviy', 'Легендарный'), min: 60 }
  };
  function S(id, tier, cost, name, note) { return { id: id, tier: tier, cost: cost, min: TIERS[tier].min, name: name, note: note }; }
  var SPECIES = [
    S('lola', 'common', 0, L('Tulip', 'Lola', 'Тюльпан'), L('Uzbekistan’s spring flower.', 'O‘zbekiston bahor guli.', 'Весенний цветок Узбекистана.')),
    S('paxta', 'common', 0, L('Cotton', 'Paxta', 'Хлопок'), L('White gold of the valley.', 'Vodiyning oq oltini.', 'Белое золото долины.')),
    S('rayhon', 'common', 40, L('Basil', 'Rayhon', 'Базилик'), L('Purple rayhon in a clay pot.', 'Sopol tuvakdagi binafsharang rayhon.', 'Фиолетовый райхон в глиняном горшке.')),
    S('binafsha', 'common', 60, L('Violet', 'Binafsha', 'Фиалка'), L('Small, shy, and the first smell of spring.', 'Kichik, uyatchan, bahorning ilk hidi.', 'Маленькая, скромная, первый запах весны.')),
    S('kungaboqar', 'common', 80, L('Sunflower', 'Kungaboqar', 'Подсолнух'), L('Always facing the light.', 'Doim yorug‘likka qaraydi.', 'Всегда смотрит на свет.')),
    S('nargiz', 'common', 100, L('Narcissus', 'Nargiz', 'Нарцисс'), L('White stars with a golden cup.', 'Oltin kosali oq yulduzlar.', 'Белые звёзды с золотой чашечкой.')),
    S('qizgaldoq', 'common', 120, L('Poppy', 'Lolaqizg‘aldoq', 'Мак'), L('Turns the spring foothills red.', 'Bahorgi adirlarni qizartiradi.', 'Красит весенние предгорья в красный.')),
    S('atirgul', 'uncommon', 150, L('Rose', 'Atirgul', 'Роза'), L('A courtyard rose bush.', 'Hovlidagi atirgul butasi.', 'Розовый куст во дворе.')),
    S('sumbul', 'uncommon', 180, L('Hyacinth', 'Sunbul', 'Гиацинт'), L('A tower of tiny blue bells.', 'Mitti ko‘k qo‘ng‘iroqchalar minorasi.', 'Башенка из крошечных синих колокольчиков.')),
    S('anor', 'uncommon', 200, L('Pomegranate', 'Anor', 'Гранат'), L('A small tree with red crowns.', 'Qizil tojli kichik daraxt.', 'Небольшое дерево с красными коронами.')),
    S('olma', 'uncommon', 240, L('Apple', 'Olma', 'Яблоня'), L('Round, red and generous.', 'Yumaloq, qizil va saxiy.', 'Круглая, красная и щедрая.')),
    S('shaftoli', 'uncommon', 270, L('Peach', 'Shaftoli', 'Персик'), L('Pink in spring, velvet in summer.', 'Bahorda pushti, yozda baxmal.', 'Розовый весной, бархатный летом.')),
    S('gilos', 'uncommon', 300, L('Cherry', 'Gilos', 'Черешня'), L('Blossoms, then twin cherries.', 'Avval gul, keyin qo‘sh gilos.', 'Сначала цветы, потом парные ягоды.')),
    S('behi', 'uncommon', 340, L('Quince', 'Behi', 'Айва'), L('Golden, fragrant, best in jam.', 'Oltinrang, xushbo‘y, murabbosi zo‘r.', 'Золотая, душистая, лучше всего в варенье.')),
    S('orik', 'rare', 400, L('Apricot', 'O‘rik', 'Урюк'), L('Blossoms first, then fruit.', 'Avval gullaydi, keyin meva beradi.', 'Сначала цветёт, потом плодоносит.')),
    S('bodom', 'rare', 450, L('Almond', 'Bodom', 'Миндаль'), L('The first tree to bloom in spring.', 'Bahorda birinchi gullaydigan daraxt.', 'Первым цветёт весной.')),
    S('nok', 'rare', 500, L('Pear', 'Nok', 'Груша'), L('Sweet, and patient to ripen.', 'Shirin, sabr bilan pishadi.', 'Сладкая и терпеливо зреет.')),
    S('qovun', 'rare', 550, L('Melon', 'Qovun', 'Дыня'), L('Sweet gold from the fields.', 'Daladan kelgan shirin oltin.', 'Сладкое золото с полей.')),
    S('uzum', 'rare', 600, L('Grapevine', 'Uzum', 'Виноград'), L('Climbs a courtyard trellis.', 'Hovli so‘risiga chirmashadi.', 'Вьётся по шпалере во дворе.')),
    S('tarvuz', 'rare', 650, L('Watermelon', 'Tarvuz', 'Арбуз'), L('Summer, sliced on the tapchan.', 'So‘rida so‘yilgan yoz.', 'Лето, нарезанное на топчане.')),
    S('anjir', 'rare', 700, L('Fig', 'Anjir', 'Инжир'), L('Big leaves, honey inside.', 'Katta barglar, ichi asal.', 'Большие листья, внутри мёд.')),
    S('xurmo', 'rare', 760, L('Persimmon', 'Xurmo', 'Хурма'), L('Orange lanterns in autumn.', 'Kuzdagi to‘q sariq chiroqlar.', 'Оранжевые фонарики осени.')),
    S('tut', 'epic', 900, L('Mulberry', 'Tut', 'Шелковица'), L('Wide shade, dark berries.', 'Keng soya, to‘q mevalar.', 'Широкая тень, тёмные ягоды.')),
    S('yongoq', 'epic', 1000, L('Walnut', 'Yong‘oq', 'Грецкий орех'), L('Deep shade and strong wood.', 'Quyuq soya va mustahkam yog‘och.', 'Густая тень и крепкое дерево.')),
    S('tol', 'epic', 1100, L('Willow', 'Majnuntol', 'Ива'), L('Hangs over the ariq.', 'Ariq ustiga egilgan.', 'Склоняется над арыком.')),
    S('terak', 'epic', 1200, L('Poplar', 'Terak', 'Тополь'), L('Tall and straight, like a good habit.', 'Yaxshi odat kabi baland va tik.', 'Высокий и прямой, как хорошая привычка.')),
    S('zarang', 'epic', 1300, L('Maple', 'Zarang', 'Клён'), L('Burns red every autumn.', 'Har kuzda qip-qizil yonadi.', 'Каждую осень горит красным.')),
    S('archa', 'epic', 1400, L('Juniper', 'Archa', 'Арча'), L('Mountain evergreen. Patient.', 'Tog‘ archasi. Sabrli.', 'Горный вечнозелёный. Терпеливый.')),
    S('jiyda', 'epic', 1500, L('Oleaster', 'Jiyda', 'Джида'), L('Silver leaves and a sweet scent.', 'Kumushrang barglar, shirin hid.', 'Серебристые листья и сладкий аромат.')),
    S('saksovul', 'epic', 1600, L('Saxaul', 'Saksovul', 'Саксаул'), L('Holds the desert sand together.', 'Cho‘l qumini ushlab turadi.', 'Удерживает пески пустыни.')),
    S('chinor', 'legendary', 2000, L('Plane tree', 'Chinor', 'Чинара'), L('The great tree of the mahalla.', 'Mahallaning ulug‘ daraxti.', 'Великое дерево махалли.')),
    S('nilufar', 'legendary', 2500, L('Lotus', 'Nilufar', 'Лотос'), L('Rises clean from still water.', 'Sokin suvdan pok bo‘lib ko‘tariladi.', 'Поднимается чистым из тихой воды.')),
    S('oltinlola', 'legendary', 3000, L('Golden tulip', 'Oltin lola', 'Золотой тюльпан'), L('For the truly devoted.', 'Chinakam sodiqlar uchun.', 'Для по-настоящему преданных.')),
    S('yulduzgul', 'legendary', 4000, L('Star flower', 'Yulduzgul', 'Звёздоцвет'), L('Blooms an eight-point star. Rarest of all.', 'Sakkiz qirrali yulduz bo‘lib ochiladi. Eng nodiri.', 'Распускается восьмиконечной звездой. Самый редкий.'))
  ];

  /* ---------------------------------------------------------------- palettes: [shadow, base, light, highlight] */
  var FOL = {
    green: ['#1C5733', '#2B7D45', '#46A055', '#A6DB7E'], green2: ['#1A4F35', '#286F47', '#3F915A', '#97D38A'], deep: ['#123D27', '#1F5A39', '#2F7A4A', '#7DBF76'],
    tulip: ['#285A40', '#3A7A55', '#5A9C6E', '#A9D6A8'], cotton: ['#1F5230', '#2E7340', '#4C9654', '#A3D58A'], basil: ['#245E2A', '#3A8A3A', '#5FB04E', '#B6E58C'],
    sun: ['#2E5A1E', '#46802C', '#68A440', '#BEE07A'], sage: ['#3E5E4A', '#5A7E66', '#7FA088', '#C8DDCC'], pom: ['#1C4E2E', '#2A6E3E', '#3F8E50', '#9FD27E'],
    peach: ['#2F5E22', '#467F2E', '#66A040', '#BEDC80'], olive: ['#34502A', '#4E7038', '#6E924E', '#C2D894'], persim: ['#4A4E1C', '#6E7A26', '#9EA23A', '#E6D47A'],
    walnut: ['#2A4824', '#3F6632', '#5E8A48', '#B2D28A'], willow: ['#3E6A1E', '#5E9030', '#86B848', '#D2EE8A'], juniper: ['#163E3A', '#22594F', '#337563', '#86C2A6'],
    silver: ['#4C6458', '#6C8878', '#94AE9F', '#DCEBE2'], saxaul: ['#4E6436', '#6E8A48', '#94AE62', '#CFE09A'], chinor: ['#1A5230', '#287444', '#3E9656', '#9ED880'],
    vine: ['#2A5E26', '#3E8034', '#5EA448', '#B6E084'], fig: ['#264E22', '#3A7030', '#589446', '#AED67E'], star: ['#123A44', '#1C5560', '#2A7480', '#7FF5E0'],
    purple: ['#3B1A4A', '#5B2C6F', '#8A4FA3', '#C79BE0'], blossom: ['#B97A94', '#E6AFC4', '#FFD9E7', '#FFFFFF'], dry: ['#4A3A24', '#6B5534', '#8E7448', '#BDA678'],
    maple: [['#6E1A14', '#A82A1E', '#D9452A', '#FF9A6A'], ['#7A3410', '#C25A18', '#E8862A', '#FFD08A'], ['#7A5A10', '#B88A1C', '#E0B830', '#FFF0A0']]
  };
  var BARK = { brown: ['#3B2416', '#5C3B25', '#8C6142'], grey: ['#3E3B38', '#68625C', '#9A938A'], pale: ['#6A6052', '#A99E8A', '#DCD3C0'], dark: ['#2A1C14', '#45301F', '#6B4C34'], plane: ['#4E4A3A', '#8C8670', '#C9C2A2'], dry: ['#40372E', '#625548', '#8A7C6C'] };
  var WP = ['#5E4638', '#7E6050', '#9C7E6C', '#BBA08E'];
  function mix(a, b, t) {
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), o = [16, 8, 0].map(function (s) { var u = x >> s & 255, v = y >> s & 255; return Math.round(u + (v - u) * t); });
    return '#' + o.map(function (v) { return (v < 16 ? '0' : '') + v.toString(16); }).join('');
  }

  /* ---------------------------------------------------------------- primitives */
  function P2(x, y) { return f(x) + ' ' + f(y); }
  function poly(pts) { return 'M' + pts.map(function (q) { return P2(q[0], q[1]); }).join(' L') + 'Z'; }
  function g(tr, inner) { return '<g transform="' + tr + '">' + inner + '</g>'; }
  function op(v) { return ' opacity="' + v + '"'; }
  function circ(x, y, r, fill, extra) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(Math.max(r, 0)) + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function ell(x, y, rx, ry, rot, fill, extra) { return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(Math.max(rx, 0)) + '" ry="' + f(Math.max(ry, 0)) + '"' + (rot ? ' transform="rotate(' + f(rot) + ' ' + f(x) + ' ' + f(y) + ')"' : '') + ' fill="' + fill + '"' + (extra || '') + '/>'; }
  function path(d, fill, stroke, sw, extra) { return '<path d="' + d + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + f(sw) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + (extra || '') + '/>'; }

  /* a pointed leaf from its base: lit left half, shaded right half, a pale midrib */
  function leaf(x, y, len, wid, ang, c, cd, vein) {
    if (len < .4) return '';
    var w = wid / 2;
    return g('translate(' + P2(x, y) + ') rotate(' + f(ang) + ')',
      path('M0 0 C' + P2(-w, -len * .22) + ' ' + P2(-w * .85, -len * .72) + ' 0 ' + f(-len) + ' C' + P2(w * .85, -len * .72) + ' ' + P2(w, -len * .22) + ' 0 0Z', c) +
      path('M0 0 C' + P2(w, -len * .22) + ' ' + P2(w * .85, -len * .72) + ' 0 ' + f(-len) + ' L0 0Z', cd) +
      (vein ? path('M0 ' + f(-len * .06) + ' L0 ' + f(-len * .84), null, vein, Math.max(.35, wid * .06), op(.65)) : ''));
  }
  /* a long curving strap leaf (tulip, narcissus, hyacinth) */
  function blade(x, y, len, wid, ang, cv, c, cd, vein) {
    if (len < .4) return '';
    var w = wid / 2;
    return g('translate(' + P2(x, y) + ') rotate(' + f(ang) + ')',
      path('M' + P2(-w, 0) + ' C' + P2(-w * 1.05, -len * .45) + ' ' + P2(cv * .55 - w * .45, -len * .82) + ' ' + P2(cv, -len) + ' C' + P2(cv * .55 + w * .3, -len * .78) + ' ' + P2(w, -len * .42) + ' ' + P2(w, 0) + 'Z', c) +
      path('M0 0 C' + P2(0, -len * .45) + ' ' + P2(cv * .55, -len * .8) + ' ' + P2(cv, -len) + ' C' + P2(cv * .55 + w * .3, -len * .78) + ' ' + P2(w, -len * .42) + ' ' + P2(w, 0) + 'Z', cd) +
      (vein ? path('M0 ' + f(-len * .05) + ' C' + P2(0, -len * .45) + ' ' + P2(cv * .5, -len * .78) + ' ' + P2(cv * .95, -len * .93), null, vein, Math.max(.35, wid * .07), op(.55)) : ''));
  }
  /* a scalloped, cloud-like outline: the silhouette of a clump of leaves */
  function bumps(cx, cy, rx, ry, n, amp, r) {
    var ph = r() * 6.283, pts = [], k, d;
    for (k = 0; k < n; k++) { var a = ph + k / n * 6.283, j = 1 + (r() - .5) * .16; pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]); }
    d = 'M' + P2(pts[0][0], pts[0][1]);
    for (k = 0; k < n; k++) { var b = ph + (k + .5) / n * 6.283, q = pts[(k + 1) % n], m = 1 + amp * (.8 + r() * .5); d += ' Q' + P2(cx + Math.cos(b) * rx * m, cy + Math.sin(b) * ry * m) + ' ' + P2(q[0], q[1]); }
    return d + 'Z';
  }
  /* one clump of foliage: shadow, body, sunlit top, and leaf flecks for texture */
  function clump(cx, cy, R, F, r, fl) {
    if (R < .5) return '';
    var n = 8 + Math.floor(r() * 3), s = '', k, m = fl == null ? 4 : fl;
    s += path(bumps(cx + R * .1, cy + R * .12, R, R * .88, n, .16, r), F[0]);
    s += path(bumps(cx - R * .05, cy - R * .06, R * .86, R * .74, n, .16, r), F[1]);
    s += path(bumps(cx - R * .28, cy - R * .3, R * .46, R * .38, n - 2, .2, r), F[2]);
    for (k = 0; k < m; k++) {
      var a = r() * 6.283, d = Math.sqrt(r()) * R * .7, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .85, up = y < cy - R * .05 && x < cx + R * .25;
      s += ell(x, y, R * .17, R * .065, r() * 180, up ? F[3] : F[0], op(up ? .7 : .5));
    }
    return s;
  }
  /* a whole crown: a dark core mass, then clumps from the bottom up so the top catches the light */
  function crown(cx, cy, W, H, F, r, n, fl) {
    if (W < 1) return '';
    var multi = Array.isArray(F[0]), base = multi ? F[0] : F, s = path(bumps(cx + W * .05, cy + H * .1, W, H, 13, .1, r), base[0]), cl = [], k;
    n = n || 7;
    for (k = 0; k < n; k++) { var a = -Math.PI / 2 + (k / n) * 6.283 + (r() - .5) * .5, d = .5 + r() * .22; cl.push([cx + Math.cos(a) * W * d, cy + Math.sin(a) * H * d * .85, Math.min(W, H) * (.46 + r() * .14)]); }
    cl.push([cx - W * .12, cy - H * .18, Math.min(W, H) * .58]);
    cl.sort(function (a, b) { return b[1] - a[1]; });
    cl.forEach(function (c) { s += clump(c[0], c[1], c[2], multi ? F[Math.floor(r() * F.length)] : F, r, fl); });
    return s;
  }
  /* a tapered trunk with root flare, a shaded right side, a lit stripe and a few bark marks */
  function trunk(h, w0, w1, bend, B, r) {
    var N = 10, Lp = [], Rp = [], M = [], i;
    for (i = 0; i <= N; i++) {
      var t = i / N, x = bend * (3 * t * t - 2 * t * t * t), y = -h * t, w = (w0 + (w1 - w0) * t) / 2 * (1 + Math.max(0, .18 - t) * 3.2);
      Lp.push([x - w, y]); Rp.push([x + w, y]); M.push([x + w * .3, y]);
    }
    var s = path(poly(Lp.concat(Rp.slice().reverse())), B[1]);
    s += path(poly(M.concat(Rp.slice().reverse())), B[0]);
    var Hl = Lp.map(function (q, k) { return [q[0] + (Rp[k][0] - q[0]) * .26, q[1]]; });
    s += path(poly(Lp.concat(Hl.slice().reverse())), B[2], null, null, op(.55));
    for (i = 0; i < 3; i++) { var k = Math.round((.15 + r() * .65) * N), q = M[k], ww = Rp[k][0] - Lp[k][0]; s += path('M' + P2(q[0] - ww * .35, q[1]) + ' q' + P2(ww * .2, -2.5) + ' ' + P2(ww * .35, -5), null, B[0], .6, op(.55)); }
    return s;
  }
  function branch(x0, y0, x1, y1, w, B) {
    var mx = (x0 + x1) / 2 - (y1 - y0) * .1, my = (y0 + y1) / 2 - Math.abs(x1 - x0) * .12;
    return path('M' + P2(x0, y0) + ' Q' + P2(mx, my) + ' ' + P2(x1, y1), null, B[1], w) + path('M' + P2(x0 + w * .22, y0) + ' Q' + P2(mx + w * .22, my) + ' ' + P2(x1 + w * .12, y1), null, B[0], w * .42, op(.8));
  }
  /* round fruit with a shadow, a lit side and a glint */
  function fruit(x, y, rad, c, stem) {
    if (rad < .3) return '';
    return (stem ? path('M' + P2(x, y - rad * .8) + ' l' + P2(.6, -rad * .7), null, '#5A3A1E', Math.max(.5, rad * .2)) : '') + circ(x + rad * .12, y + rad * .1, rad, c[0]) + circ(x - rad * .06, y - rad * .06, rad * .86, c[1]) +
      ell(x - rad * .34, y - rad * .36, rad * .32, rad * .22, -35, c[2], op(.85)) + circ(x - rad * .42, y - rad * .45, rad * .1, '#FFFFFF', op(.7));
  }
  function bloom(x, y, s, c, c2, cc) {
    var o = circ(x + s * .25, y + s * .25, s * .95, c2), k;
    for (k = 0; k < 5; k++) { var a = k / 5 * 6.283 - 1.57; o += circ(x + Math.cos(a) * s * .52, y + Math.sin(a) * s * .52, s * .5, c); }
    return o + circ(x, y, s * .3, cc);
  }
  function star(cx, cy, R, n, inner, rot) {
    var p = [], k; rot = rot || 0;
    for (k = 0; k < n * 2; k++) { var a = rot - Math.PI / 2 + k * Math.PI / n, rr = k % 2 ? R * inner : R; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    return poly(p);
  }
  function hang(T, r, n, fn, low) {
    var s = '', k, pts = [];
    for (k = 0; k < n; k++) { var a = r() * 6.283, d = Math.sqrt(.15 + r() * .85) * .78; pts.push([T.cx + Math.cos(a) * T.W * d, T.cy + Math.sin(a) * T.H * d * .78 + T.H * (low == null ? .12 : low)]); }
    pts.sort(function (a, b) { return a[1] - b[1]; });
    pts.forEach(function (q, i) { s += fn(q[0], q[1], i); });
    return s;
  }
  function litter(r, n, F) { var s = '', k; for (k = 0; k < n; k++) { var x = (r() - .5) * 34, y = (r() - .5) * 3; s += ell(x, y, 2.2, 1, r() * 180, k % 2 ? F[1] : F[2]); } return s; }
  function sprout(s, w, F) {
    s = clamp(s, .15, 1);
    return path('M0 0 Q' + P2(.8, -6 * s) + ' ' + P2(0, -11 * s), null, w ? '#7D6A48' : '#4E8A3A', 1.4 + s) + leaf(0, -10 * s, 10 * s, 7 * s, -64, F[2], F[1], F[3]) + leaf(0, -10.5 * s, 9 * s, 6.5 * s, 60, F[2], F[1], F[3]);
  }
  function stem(x0, y0, x1, y1, bend, c, hi, w) {
    var d = 'M' + P2(x0, y0) + ' Q' + P2(x0 + bend, (y0 + y1) / 2) + ' ' + P2(x1, y1);
    return path(d, null, c, w) + (hi ? path('M' + P2(x0 - w * .25, y0) + ' Q' + P2(x0 + bend - w * .25, (y0 + y1) / 2) + ' ' + P2(x1 - w * .25, y1), null, hi, w * .35, op(.7)) : '');
  }

  /* ---------------------------------------------------------------- generic tree */
  function tree(p, w, r, o) {
    var F = w ? FOL.dry : o.F, B = w ? BARK.dry : o.B || BARK.brown, e = ease(p), out = '';
    if (p < .1) return { s: sprout(p * 10, w, Array.isArray(F[0]) ? F[1] : F), sprout: true, cs: 0 };
    var h = o.h * (.22 + .78 * e), cs = ease(seg(p, .12, .88)), bend = (o.bend || 0) * e, tw = o.tw * (.35 + .65 * e);
    out += trunk(h, tw, tw * (o.taper || .45), bend, B, r);
    var W = o.W * cs * (w ? .78 : 1), H = o.H * cs * (w ? .72 : 1), cx = bend + (o.cx || 0) * cs, cy = -h - H * (o.lift || .42);
    if (cs > .25) (o.br || [[-.7, -.15], [.65, -.25], [-.1, -.6]]).forEach(function (b) { out += branch(bend, -h + 2, cx + b[0] * W, cy + b[1] * H, tw * .42, B); });
    out += crown(cx, cy, W, H, F, r, w ? Math.max(3, (o.n || 7) - 3) : o.n || 7, o.fl);
    if (o.after) out += o.after(cx, cy, W, H, B);
    if (w) out += litter(r, 5, FOL.dry);
    return { s: out, h: h, W: W, H: H, cx: cx, cy: cy, e: e, cs: cs };
  }
  function fruitTree(p, w, r, o, fruitFn, n, from) {
    var T = tree(p, w, r, o), s = T.s;
    if (T.sprout || w) return s;
    var fr = ease(seg(p, from || .7, 1));
    if (fr > 0) s += hang(T, r, n, function (x, y, i) { return fruitFn(x, y, fr, i); });
    return s;
  }

  /* ---------------------------------------------------------------- flowers */
  var RED = ['#9E1630', '#D7263D', '#FF5A6E', '#FFB0B8'], GOLDP = ['#A86F0C', '#E8A92A', '#FFD35A', '#FFF1B8'];
  function lola(p, w, r, gold) {
    var F = w ? FOL.dry : FOL.tulip, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 10 + 44 * e, bend = w ? 12 : 2, lf = ease(seg(p, .08, .6));
    o += blade(-1.5, 0, 36 * lf, 12 * lf, -26 - (w ? 22 : 0), -5, F[1], F[0], F[3]);
    o += stem(0, 0, bend, -h, bend * .15, w ? '#6E5C3C' : '#2F6E3E', w ? '#8E7A55' : '#5FA05A', 2.6);
    o += blade(1.5, 0, 31 * lf, 11 * lf, 22 + (w ? 25 : 0), 5, F[2], F[1], F[3]);
    var fs = ease(seg(p, .45, .95));
    if (fs > 0) {
      var c = w ? WP : gold ? GOLDP : RED;
      o += g('translate(' + P2(bend, -h + 1) + ') rotate(' + (w ? 75 : -3) + ') scale(' + f(.4 + .6 * fs) + ')',
        path('M-7.5 0 C-10 -8 -7 -19 0 -22 C7 -19 10 -8 7.5 0Z', c[0]) +
        path('M0 1.5 C-7 1 -11 -7 -9.5 -16 C-8.5 -20 -5 -21 -3 -19.5 C-1.5 -12 -.5 -5 0 1.5Z', c[1]) +
        path('M0 1.5 C7 1 11 -7 9.5 -16 C8.5 -20 5 -21 3 -19.5 C1.5 -12 .5 -5 0 1.5Z', c[0]) +
        path('M0 2 C-5.5 .5 -6.5 -9 -4.5 -16.5 C-2.5 -21 2.5 -21 4.5 -16.5 C6.5 -9 5.5 .5 0 2Z', c[1]) +
        path('M0 2 C3 .8 5.5 -4 5.5 -10 C5 -6 3 -2 0 2Z', c[0], null, null, op(.6)) +
        path('M-2.6 -3 C-3.8 -8 -3.4 -13 -1.8 -17', null, c[2], 1.6, op(.9)) + path('M-2.2 -6 C-2.6 -9 -2.3 -12 -1.4 -14', null, c[3], .8, op(.8)));
    }
    return o;
  }
  function oltinlola(p, w, r) { var s = lola(p, w, r, true); if (!w && p > .6) s += sparkles(2, -52, 20, r); return s; }
  function paxta(p, w, r) {
    var F = w ? FOL.dry : FOL.cotton, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 10 + 32 * e, st = w ? '#6B5847' : '#7A3E2A', bs = ease(seg(p, .15, .7));
    o += path('M0 0 C' + P2(-1, -h * .4) + ' ' + P2(1, -h * .7) + ' ' + P2(0, -h), null, st, 2.6);
    var br = [[-.38, -15, -9], [-.55, 14, -7], [-.75, -12, -6], [-.9, 10, -5]];
    br.forEach(function (b) { var y = h * b[0], x2 = b[1] * bs, y2 = y + b[2] * bs; o += path('M0 ' + f(y) + ' Q' + P2(x2 * .5, y - 1) + ' ' + P2(x2, y2), null, st, 1.5); });
    o += leaf(0, -h * .3, 10 * bs, 8 * bs, 58, F[1], F[0], F[3]) + leaf(0, -h * .62, 9 * bs, 7 * bs, -56, F[2], F[1], F[3]);
    var spots = br.map(function (b) { return [b[1] * bs, h * b[0] + b[2] * bs]; }).concat([[0, -h]]);
    spots.forEach(function (q, i) { var s = bs * (i === 4 ? 1.05 : .9); o += leaf(q[0], q[1], 11 * s, 8 * s, -42, F[1], F[0], F[3]) + leaf(q[0], q[1], 12 * s, 9 * s, 38, F[1], F[0], F[3]) + leaf(q[0], q[1], 13 * s, 9.5 * s, -2, F[2], F[1], F[3]); });
    var bo = ease(seg(p, .55, 1));
    if (bo > 0) {
      var wh = w ? ['#9E927A', '#BFB39A', '#D6CCB6'] : ['#C9CCC4', '#F2F3EE', '#FFFFFF'];
      spots.forEach(function (q, i) {
        if (i / spots.length > bo + .15) return;
        var x = q[0] + (i % 2 ? 3.5 : -3.5), y = q[1] - 5, s = 4.2 * bo;
        o += path(star(x, y + 2.6, s * 1.4, 4, .35, .4), w ? '#5E4A36' : '#6B4426') + circ(x - s * .7, y + .5, s, wh[0]) + circ(x + s * .75, y + .5, s, wh[0]) +
          circ(x - s * .55, y - .2, s * .9, wh[1]) + circ(x + s * .6, y - .3, s * .85, wh[1]) + circ(x, y - s * .7, s * .95, wh[1]) + circ(x - s * .3, y - s * .9, s * .5, wh[2]);
      });
    }
    return o;
  }
  function pot(rx, h, c) {
    var t = -h;
    return path('M' + P2(-rx * .72, 0) + ' L' + P2(-rx, t + 3) + ' L' + P2(rx, t + 3) + ' L' + P2(rx * .72, 0) + 'Z', c[1]) +
      path('M' + P2(rx * .18, 0) + ' L' + P2(rx * .3, t + 3) + ' L' + P2(rx, t + 3) + ' L' + P2(rx * .72, 0) + 'Z', c[0]) +
      path('M' + P2(-rx * .6, -1.5) + ' L' + P2(-rx * .84, t + 4), null, c[2], 1.4, op(.7)) +
      path('M' + P2(-rx * 1.1, t) + ' L' + P2(rx * 1.1, t) + ' L' + P2(rx * 1.05, t + 4) + ' L' + P2(-rx * 1.05, t + 4) + 'Z', c[1]) +
      path('M' + P2(rx * .3, t) + ' L' + P2(rx * 1.1, t) + ' L' + P2(rx * 1.05, t + 4) + ' L' + P2(rx * .3, t + 4) + 'Z', c[0]) +
      ell(0, t, rx * 1.1, rx * .26, 0, c[2]) + ell(0, t + .3, rx * .94, rx * .2, 0, '#3B2414') + path('M' + P2(-rx * .9, t + 3.8) + ' L' + P2(rx * 1.02, t + 3.8), null, c[0], .6, op(.6));
  }
  function rayhon(p, w, r) {
    var POT = ['#8F4A2A', '#C0683E', '#E39A6E'], Pp = w ? FOL.dry : FOL.purple, Fg = w ? FOL.dry : FOL.basil, top = -14, o = pot(9, 14, POT), e = ease(p), s = .25 + .75 * e, k;
    if (p < .1) return o + g('translate(0 ' + top + ')', sprout(p * 10, w, Fg));
    for (k = 0; k < 5; k++) { var a0 = (-56 + k * 28) * Math.PI / 180; o += path('M0 ' + top + ' Q' + P2(Math.sin(a0) * 6 * s, top - 8 * s) + ' ' + P2(Math.sin(a0) * 13 * s, top - Math.cos(a0) * 20 * s), null, Pp[0], 1.1); }
    var L2 = [];
    o += path(bumps(0, top - 11 * s, 13 * s, 10 * s, 9, .15, r), Pp[0]);
    for (k = 0; k < 16; k++) { var t = k / 15, a = -84 + 168 * t + (r() - .5) * 16, d = (4 + r() * 11) * s, ar = a * Math.PI / 180; L2.push([Math.sin(ar) * d, top - 4 * s - Math.cos(ar) * d * 1.05 - (1 - Math.abs(t - .5) * 2) * 6 * s, a, k % 4 === 0 ? Fg : Pp]); }
    L2.sort(function (A, B2) { return A[1] - B2[1]; });
    L2.forEach(function (q) { var ln = (8 + r() * 2.5) * s; o += leaf(q[0], q[1] + 3, ln, ln * 1.02, q[2] * .85, q[3][1], q[3][0], q[3][3]) + ell(q[0] + Math.sin(q[2] * Math.PI / 180) * ln * .4 - ln * .12, q[1] + 3 - Math.cos(q[2] * Math.PI / 180) * ln * .5, ln * .16, ln * .08, q[2], '#FFFFFF', op(.25)); });
    if (p > .6 && !w) [[-6, -30], [2, -36], [9, -29]].forEach(function (q) {
      var x = q[0] * s, y = q[1] * s + top * .2; o += path('M' + P2(x, y + 7) + ' L' + P2(x, y - 3), null, Pp[0], .9);
      for (var j = 0; j < 4; j++) o += circ(x + (j % 2 ? .9 : -.9), y + 5 - j * 2.4, 1.1, j === 3 ? '#FFFFFF' : '#F3D7F7');
    });
    return o;
  }
  function binafsha(p, w, r) {
    var F = w ? FOL.dry : FOL.deep, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var s = .4 + .6 * e, V = w ? WP : ['#3E1F7A', '#6A3FC2', '#9B74E8', '#D9C8FF'];
    [[-95, 10], [-70, 13], [82, 11], [58, 13], [-38, 15], [24, 15], [-8, 14]].forEach(function (q, i) { o += leaf(0, 0, q[1] * s, q[1] * .95 * s, q[0], i % 2 ? F[1] : F[2], F[0], F[3]); });
    var fs = ease(seg(p, .4, .95));
    if (fs > 0) [[-2, -15, -4, .8], [-9, -20, -14, 1], [12, -17, 20, 1], [3, -24, 6, 1]].forEach(function (q) {
      var x = q[0] * s, y = q[1] * s, z = (.45 + .55 * fs) * q[3];
      o += path('M0 -2 Q' + P2(x * .3, y * .5) + ' ' + P2(x, y + 2), null, w ? '#7D6A48' : '#3F6E3A', .9);
      o += g('translate(' + P2(x, y) + ') rotate(' + (w ? 80 : q[2]) + ') scale(' + f(z) + ')',
        ell(-3, -3.5, 3, 4.2, -20, V[0]) + ell(3, -3.5, 3, 4.2, 20, V[0]) + ell(-3.6, .3, 3.2, 2.6, -10, V[1]) + ell(3.6, .3, 3.2, 2.6, 10, V[1]) + ell(0, 3, 3.6, 3, 0, V[2]) +
        path('M-1.2 2.2 L0 4.6 L1.2 2.2', null, V[0], .6) + circ(0, .5, 1.2, w ? '#A89270' : '#F5C04A') + ell(-1, 2.3, 1.2, .8, 0, '#FFFFFF', op(.55)) + ell(-2.2, -4.5, 1, 2, -20, V[3], op(.5)));
    });
    return o;
  }
  function kungaboqar(p, w, r) {
    var F = w ? FOL.dry : FOL.sun, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 14 + 74 * e, bend = w ? 10 : -3, ls = ease(seg(p, .1, .7)), k;
    o += stem(0, 0, bend, -h, bend * .3, w ? '#7D6A48' : '#4E7A2E', w ? '#9C8660' : '#79A84A', 3.4);
    [[.2, -1, 18], [.3, 1, 17], [.48, -1, 15], [.62, 1, 13], [.78, -1, 10]].forEach(function (q) { var y = -h * q[0], x = bend * q[0] * q[0]; o += leaf(x, y, q[2] * ls, q[2] * .82 * ls, q[1] * (w ? 125 : 70 + q[0] * 12), q[1] < 0 ? F[2] : F[1], F[0], F[3]); });
    var fs = ease(seg(p, .5, 1));
    if (fs > 0) {
      var R = 14 * (.35 + .65 * fs), Y = w ? ['#6E5636', '#8E7048', '#A88A5C'] : ['#D98A0E', '#F5B819', '#FFD84A'], hd = '';
      for (k = 0; k < 16; k++) hd += g('rotate(' + f((k + .5) / 16 * 360) + ')', ell(0, -R * .98, R * .2, R * .46, 0, Y[0]));
      for (k = 0; k < 16; k++) hd += g('rotate(' + f(k / 16 * 360) + ')', ell(0, -R * .9, R * .17, R * .44, 0, Y[1]) + ell(-R * .04, -R * .98, R * .065, R * .26, 0, Y[2], op(.8)));
      hd += circ(R * .05, R * .05, R * .58, w ? '#2E2218' : '#3A1F0A') + circ(-R * .04, -R * .04, R * .5, w ? '#5A4630' : '#6B3E16') + circ(-R * .04, -R * .04, R * .36, w ? '#4A3A28' : '#55300F');
      for (k = 0; k < 16; k++) { var aa = k * 2.4, dd = Math.sqrt(k / 16) * R * .44; hd += circ(Math.cos(aa) * dd - R * .04, Math.sin(aa) * dd - R * .04, R * .045, w ? '#2E2218' : '#2A1505'); }
      hd += ell(-R * .2, -R * .22, R * .16, R * .08, -30, '#FFFFFF', op(.16));
      o += g('translate(' + P2(bend, -h) + ') rotate(' + (w ? 125 : -14) + ') scale(1 .9)', hd);
    }
    return o;
  }
  function nargiz(p, w, r) {
    var F = w ? FOL.dry : FOL.tulip, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var ls = ease(seg(p, .08, .6)), fs = ease(seg(p, .45, .95));
    o += blade(-2, 0, 30 * ls, 5 * ls, -18, -6, F[1], F[0]) + blade(2, 0, 34 * ls, 5 * ls, 12, 7, F[1], F[0]);
    var P = w ? WP : ['#C9CDBF', '#F3F4EC', '#FFFFFF', '#FFFFFF'], Cc = w ? ['#6E5636', '#8E7048', '#A88A5C'] : ['#C2580C', '#F59A1E', '#FFD24A'];
    [[-7, 40, -24], [7, 46, 18], [0, 33, -4]].forEach(function (q, i) {
      var h = q[1] * (.3 + .7 * e), x = q[0] * e;
      o += stem(0, 0, x, -h, x * .2, w ? '#7D6A48' : '#3E7A44', null, 1.5);
      if (fs <= 0 || (i === 2 && fs < .5)) return;
      var fl = '', k;
      for (k = 0; k < 6; k++) fl += g('rotate(' + (k * 60 + 30) + ')', ell(0, -5.4, 3, 5.2, 0, P[0]));
      for (k = 0; k < 6; k++) fl += g('rotate(' + (k * 60) + ')', ell(0, -5, 2.8, 5, 0, P[1]) + ell(-.8, -6, .8, 2.6, 0, P[3], op(.9)));
      fl += circ(.4, .4, 3.5, Cc[0]) + circ(0, 0, 3, Cc[1]) + circ(0, 0, 1.6, Cc[0]) + circ(-1, -1, .8, Cc[2]);
      o += g('translate(' + P2(x, -h) + ') rotate(' + (w ? 95 : q[2]) + ') scale(' + f((.4 + .6 * fs) * (i === 2 ? .85 : 1)) + ')', fl);
    });
    return o + blade(0, 0, 25 * ls, 4.5 * ls, -2, 3, F[2], F[1]);
  }
  function fern(x, y, len, ang, F) {
    var o = path('M0 0 L0 ' + f(-len), null, F[0], .9), k;
    for (k = 1; k < 5; k++) { var t = k / 5, yy = -len * t, s = len * .3 * (1 - t * .5); o += leaf(0, yy, s, s * .5, -55, F[2], F[1]) + leaf(0, yy, s, s * .5, 55, F[1], F[0]); }
    return g('translate(' + P2(x, y) + ') rotate(' + f(ang) + ')', o);
  }
  function qizgaldoq(p, w, r) {
    var F = w ? FOL.dry : FOL.sage, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var ls = ease(seg(p, .08, .5)), fs = ease(seg(p, .45, .95)), Rr = w ? WP : ['#8E0F12', '#D61F1F', '#F2493B', '#FF9B85'];
    [-75, -45, -15, 20, 50, 80].forEach(function (a, i) { o += fern(0, 0, (13 + (i % 2) * 4) * ls, a, F); });
    [[16, 34, 28, 0], [-10, 46, -14, 1], [7, 52, 10, 1], [-2, 38, -4, 1]].forEach(function (q) {
      var h = q[1] * (.3 + .7 * e), x = q[0] * e, st = w ? '#7D6A48' : '#4D7A3A';
      o += path('M0 0 C' + P2(x * .2, -h * .4) + ' ' + P2(x * .9, -h * .7) + ' ' + P2(x, -h), null, st, 1.2);
      if (!q[3]) { o += g('translate(' + P2(x, -h) + ') rotate(140)', ell(0, -3, 2.6, 4, 0, st) + ell(-.8, -3.5, .8, 2.4, 0, '#B8D69A', op(.5))); return; }
      if (fs <= 0) return;
      o += g('translate(' + P2(x, -h) + ') rotate(' + (w ? 115 : q[2] * .5) + ') scale(' + f(.4 + .6 * fs) + ')',
        path('M0 1 C-9 2 -11 -8 -5 -11 C-2 -12.5 2 -12.5 5 -11 C11 -8 9 2 0 1Z', Rr[0]) +
        path('M0 2 C-8 2 -10.5 -5 -7 -9 C-4 -11 -1 -8 0 -4Z', Rr[1]) + path('M0 2 C8 2 10.5 -5 7 -9 C4 -11 1 -8 0 -4Z', Rr[1]) +
        path('M0 2 C6 1.6 8 -2 7 -6 C5 -2 3 0 0 2Z', Rr[0], null, null, op(.5)) +
        path('M0 2.5 C-6 2.5 -7.5 -2 -5 -5.5 C-2 -7 2 -7 5 -5.5 C7.5 -2 6 2.5 0 2.5Z', Rr[2]) +
        ell(0, -3.2, 3.2, 1.6, 0, '#1A1416') + circ(0, -4, 1.4, w ? '#5E5036' : '#2F4A2E') + path('M-4.2 -1 C-3 -3 -1.5 -4 0 -4.3', null, Rr[3], .9, op(.8)));
    });
    return o;
  }
  function rose(x, y, R, c) {
    return circ(x + R * .1, y + R * .1, R, c[0]) + ell(x - R * .35, y + R * .1, R * .7, R * .62, -20, c[1]) + ell(x + R * .4, y + R * .12, R * .62, R * .58, 25, c[0]) + ell(x, y - R * .2, R * .66, R * .5, 0, c[1]) + circ(x - R * .05, y - R * .15, R * .42, c[2]) +
      path('M' + P2(x - R * .25, y - R * .1) + ' a' + P2(R * .25, R * .22) + ' 0 1 1 ' + P2(R * .4, R * .05) + ' a' + P2(R * .15, R * .14) + ' 0 1 1 ' + P2(-R * .22, -R * .12), null, c[0], R * .09) + ell(x - R * .45, y - R * .35, R * .2, R * .1, -30, c[3], op(.7));
  }
  function atirgul(p, w, r) {
    var F = w ? FOL.dry : FOL.deep, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var s = .3 + .7 * e, st = w ? '#6B5847' : '#2F5A2A', Rc = w ? WP : ['#8E1238', '#D02A55', '#F25C7D', '#FFB3C4'];
    [[-16, -34], [-6, -44], [6, -42], [15, -32], [0, -50]].forEach(function (c) { o += path('M0 0 Q' + P2(c[0] * .3 * s, c[1] * .5 * s) + ' ' + P2(c[0] * s, c[1] * s), null, st, 1.6); });
    [[-10, -14], [10, -12], [-14, -26], [14, -24], [0, -22], [-4, -36], [8, -34], [-16, -38], [16, -38], [0, -46]].forEach(function (q, i) {
      var x = q[0] * s, y = q[1] * s, k; for (k = 0; k < 3; k++) o += leaf(x, y, 7.5 * s, 5 * s, -60 + k * 60 + (r() - .5) * 20, k === 1 ? F[2] : F[1], F[0], F[3]);
    });
    var fs = ease(seg(p, .45, 1));
    if (fs > 0) [[-17, -22, .45], [12, -22, .45], [-4, -28, .8], [15, -34, .9], [-14, -38, 1], [6, -48, 1]].forEach(function (q) {
      var z = fs * q[2] * s * (w ? .8 : 1), x = q[0] * s, y = q[1] * s;
      o += q[2] < .5 ? ell(x, y - z * 3, z * 2.4, z * 3.6, 0, Rc[1]) + ell(x + z * .8, y - z * 2.6, z * 1.2, z * 2.8, 0, Rc[0]) + path('M' + P2(x - z * 2.4, y - z) + ' L' + P2(x, y + z * 1.2) + ' L' + P2(x + z * 2.4, y - z), w ? '#6B5847' : '#2F6A35') : rose(x, y, 6.2 * z, Rc);
    });
    return o;
  }
  function sumbul(p, w, r) {
    var F = w ? FOL.dry : FOL.tulip, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var ls = ease(seg(p, .08, .6)), fs = ease(seg(p, .35, 1)), h = 14 + 26 * e, Bl = w ? WP : ['#2A2A8A', '#4B4BD0', '#7C7CF0', '#C9C9FF'], k;
    o += blade(-3, 0, 26 * ls, 6.5 * ls, -26, -4, F[1], F[0], F[3]) + blade(3, 0, 24 * ls, 6.5 * ls, 24, 4, F[1], F[0], F[3]);
    o += path('M0 0 L' + P2(w ? 4 : 0, -h), null, w ? '#7D6A48' : '#3E7A44', 2.6);
    if (fs > 0) {
      var rows = 8, y0 = -h * .45, y1 = -h - 7 * fs, fl = '';
      for (k = rows - 1; k >= 0; k--) {
        var t = k / (rows - 1), y = y0 + (y1 - y0) * (1 - t), wd = (3 + t * 4.5) * fs, j;
        for (j = -1; j <= 1; j++) { var x = j * wd + (k % 2 ? 1 : -1) * fs, rr = 2.5 * fs * (.8 + t * .3); fl += circ(x + rr * .15, y + rr * .15, rr, Bl[0]) + circ(x - rr * .05, y - rr * .05, rr * .86, j > 0 ? Bl[1] : Bl[2]) + path(star(x - rr * .05, y - rr * .05, rr * .55, 3, .4), Bl[3], null, null, op(.55)); }
      }
      o += w ? g('rotate(28 0 ' + f(-h * .5) + ')', fl) : fl;
    }
    return o + blade(0, 0, 20 * ls, 6 * ls, -4, 2, F[2], F[1], F[3]);
  }

  /* ---------------------------------------------------------------- fruit trees and shrubs */
  function anor(p, w, r) {
    var F = w ? FOL.dry : FOL.pom, B = w ? BARK.dry : BARK.brown, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 8 + 30 * e, cs = ease(seg(p, .12, .85)), wd = 2.4 * e + 1;
    o += branch(0, 0, -7 * e, -h, wd, B) + branch(0, 0, 8 * e, -h * .95, wd, B) + branch(0, 0, 1, -h * 1.05, wd * 1.1, B);
    var T = { cx: 0, cy: -h - 24 * cs * .45, W: 30 * cs * (w ? .8 : 1), H: 24 * cs * (w ? .75 : 1) };
    o += crown(T.cx, T.cy, T.W, T.H, F, r, w ? 4 : 8, 8);
    if (w) return o + litter(r, 5, FOL.dry);
    var fl = seg(p, .45, .8), fr = ease(seg(p, .7, 1));
    if (fl > 0 && fr < .6) o += hang(T, r, 6, function (x, y) { return ell(x, y, 1.6 * fl, 2.6 * fl, 0, '#B8241E') + ell(x, y - 2.2 * fl, 2.6 * fl, 1.3 * fl, 0, '#F2552C'); });
    if (fr > 0) o += hang(T, r, 6, function (x, y) { var R = 4.4 * fr, c = ['#8A1520', '#C7272F', '#F0605A']; return fruit(x, y, R, c) + path(star(x, y - R * .9, R * .45, 5, .45), c[0]); });
    return o;
  }
  var APPLE = ['#9C1E1C', '#D3332D', '#FF7A6B'], APPLE2 = ['#A33A12', '#E0592A', '#FFB070'];
  function olma(p, w, r) { return fruitTree(p, w, r, { F: FOL.green, h: 40, tw: 8, W: 36, H: 32, n: 8 }, function (x, y, fr, i) { return fruit(x, y, 3.7 * fr, i % 3 ? APPLE : APPLE2, true); }, 8); }
  function shaftoli(p, w, r) {
    var T = tree(p, w, r, { F: FOL.peach, h: 34, tw: 7.5, W: 40, H: 28, n: 8, bend: 3, fl: 6 }), s = T.s;
    if (T.sprout || w) return s;
    var bl = seg(p, .45, .85), fr = ease(seg(p, .78, 1));
    if (bl > 0 && fr < .5) s += hang(T, r, 12, function (x, y) { return bloom(x, y, 2.2 * bl, '#FFC9DA', '#E58AA8', '#C2406A'); }, 0);
    if (fr > 0) s += hang(T, r, 7, function (x, y) { var R = 3.8 * fr; return fruit(x, y, R, ['#C2532C', '#F59A5C', '#FFD6A8']) + circ(x + R * .3, y + R * .25, R * .55, '#E5604A', op(.45)) + path('M' + P2(x - R * .1, y - R * .8) + ' q' + P2(R * .3, R * .6) + ' ' + P2(R * .1, R * 1.4), null, '#B8462A', .4, op(.6)); });
    return s;
  }
  function gilos(p, w, r) {
    var T = tree(p, w, r, { F: FOL.green2, h: 42, tw: 7.5, W: 33, H: 34, n: 8 }), s = T.s;
    if (T.sprout || w) return s;
    var bl = seg(p, .45, .8), fr = ease(seg(p, .72, 1)), C = ['#5A0A16', '#A3142A', '#E0485A'];
    if (bl > 0 && fr < .5) s += hang(T, r, 12, function (x, y) { return bloom(x, y, 2.1 * bl, '#FFFFFF', '#E6D9DE', '#E8B23A'); }, 0);
    if (fr > 0) s += hang(T, r, 6, function (x, y) { var R = 2.4 * fr; return path('M' + P2(x, y - 6 * fr) + ' Q' + P2(x - 2 * fr, y - 3 * fr) + ' ' + P2(x - 2.2 * fr, y) + ' M' + P2(x, y - 6 * fr) + ' Q' + P2(x + 1.5 * fr, y - 2.4 * fr) + ' ' + P2(x + 2.4 * fr, y + 1), null, '#4E6A22', .6) + fruit(x - 2.2 * fr, y + R * .6, R, C) + fruit(x + 2.4 * fr, y + 1 + R * .6, R, C); });
    return s;
  }
  function behi(p, w, r) {
    return fruitTree(p, w, r, { F: FOL.olive, h: 32, tw: 7, W: 32, H: 27, n: 7, bend: -2 }, function (x, y, fr) { var R = 4.2 * fr, c = ['#B8921C', '#E8C43A', '#FFF0A0']; return circ(x + R * .5, y - R * .55, R * .5, c[0]) + fruit(x, y, R, c) + ell(x + R * .3, y - R * .55, R * .4, R * .3, 0, c[1]) + circ(x - R * .1, y + R * .2, R * .7, '#FFFFFF', op(.12)); }, 6);
  }
  function orik(p, w, r) { return fruitTree(p, w, r, { F: FOL.green, h: 46, tw: 8.5, W: 38, H: 33, n: 9, bend: -3 }, function (x, y, fr) { var R = 3.3 * fr; return fruit(x, y, R, ['#C2621A', '#F59A2E', '#FFD27A']) + circ(x + R * .32, y + R * .3, R * .5, '#E0552A', op(.4)); }, 10); }
  function bodom(p, w, r) {
    var T = tree(p, w, r, { F: FOL.blossom, h: 40, tw: 7, W: 36, H: 30, n: 9, fl: 0, br: [[-.85, -.1], [.8, -.2], [-.3, -.75], [.4, -.7]] }), s = T.s;
    if (T.sprout || w) return s;
    var k; for (k = 0; k < 5; k++) { var a = -2.6 + k * .55, x1 = T.cx + Math.cos(a) * T.W * 1.05, y1 = T.cy + Math.sin(a) * T.H * 1.05; s += path('M' + P2(T.cx + Math.cos(a) * T.W * .7, T.cy + Math.sin(a) * T.H * .7) + ' L' + P2(x1, y1), null, '#4A2E22', .9); s += bloom(x1, y1, 1.8 * T.cs, '#FFFFFF', '#F2C6D6', '#C2406A'); }
    s += hang(T, r, 16, function (x, y, i) { return bloom(x, y, 2 * T.cs, i % 3 ? '#FFFFFF' : '#FFD9E7', '#E6AFC4', '#B8305E'); }, -.05);
    return s + hang(T, r, 5, function (x, y) { return leaf(x, y, 5, 2.4, 140, FOL.peach[2], FOL.peach[1]); }, .2);
  }
  function nok(p, w, r) {
    return fruitTree(p, w, r, { F: FOL.green2, h: 46, tw: 7.5, W: 27, H: 42, lift: .5, n: 9 }, function (x, y, fr) {
      var R = 3.2 * fr, c = ['#7E8A1A', '#C9D44A', '#F4F7B0'];
      return path('M' + P2(x, y - R * 2.2) + ' l' + P2(.5, -R * .6), null, '#5A3A1E', .6) + circ(x + R * .2, y + R * .15, R, c[0]) + path('M' + P2(x - R * .9, y) + ' C' + P2(x - R * .9, y - R * .9) + ' ' + P2(x - R * .45, y - R * 2.2) + ' ' + P2(x, y - R * 2.2) + ' C' + P2(x + R * .45, y - R * 2.2) + ' ' + P2(x + R * .9, y - R * .9) + ' ' + P2(x + R * .9, y) + ' A' + P2(R * .9, R * .9) + ' 0 0 1 ' + P2(x - R * .9, y) + 'Z', c[1]) +
        ell(x - R * .35, y - R * .6, R * .25, R * .55, 0, c[2], op(.8)) + circ(x + R * .3, y + R * .2, R * .45, '#E07A3A', op(.3));
    }, 7);
  }
  function xurmo(p, w, r) {
    return fruitTree(p, w, r, { F: FOL.persim, h: 42, tw: 8, W: 37, H: 31, n: 7, fl: 6 }, function (x, y, fr) { var R = 3.9 * fr; return fruit(x, y, R, ['#B8480E', '#F28A1E', '#FFC26A']) + path(star(x, y - R * .8, R * .55, 4, .35), '#5E5A1E'); }, 9, .65);
  }
  function tut(p, w, r) {
    return fruitTree(p, w, r, { F: FOL.green2, h: 40, tw: 12, W: 42, H: 29, n: 9, bend: -4, lift: .35, br: [[-.8, -.05], [.75, -.1], [-.3, -.55], [.35, -.5]] }, function (x, y, fr, i) {
      var c = i % 3 ? ['#1E0A1E', '#4A1846', '#9A4A90'] : ['#C9BFA8', '#EDE6D8', '#FFFFFF'], R = 1.9 * fr; return fruit(x, y, R, c) + fruit(x + .4, y + R * 1.3, R * .9, c) + fruit(x - .2, y + R * 2.4, R * .75, c);
    }, 10);
  }
  function yongoq(p, w, r) {
    return fruitTree(p, w, r, { F: FOL.walnut, B: BARK.grey, h: 46, tw: 12, W: 39, H: 36, n: 10 }, function (x, y, fr) { var R = 3.4 * fr; return fruit(x, y, R, ['#4E7A2A', '#7DAA3E', '#BEDD7A']) + circ(x + R * .3, y + R * .1, R * .12, '#4E6A22', op(.6)) + circ(x - R * .1, y + R * .45, R * .1, '#4E6A22', op(.6)); }, 7, .75);
  }
  function zarang(p, w, r) {
    var T = tree(p, w, r, { F: FOL.maple, B: BARK.grey, h: 44, tw: 9, W: 40, H: 34, n: 9, fl: 5 }), s = T.s;
    if (T.sprout || w) return s;
    if (T.cs > .6) [[-24, -6, 30], [20, -14, -20], [30, -3, 60], [-12, -2, -40]].forEach(function (q, i) { var c = FOL.maple[i % 3]; s += path(star(q[0], q[1], 2.6, 5, .45, q[2] * Math.PI / 180), c[1]) + path('M' + P2(q[0], q[1]) + ' l' + P2(.8, 2), null, c[0], .5); });
    return s;
  }
  function jiyda(p, w, r) {
    return fruitTree(p, w, r, { F: FOL.silver, B: BARK.grey, h: 36, tw: 9, W: 36, H: 27, n: 8, bend: 9, cx: -4, fl: 7 }, function (x, y, fr, i) {
      return i % 2 ? ell(x, y, 1.6 * fr, 2.3 * fr, 10, '#B9782E') + ell(x - .5 * fr, y - .7 * fr, .6 * fr, 1 * fr, 10, '#F0C27A', op(.8)) : bloom(x, y, 1.6 * fr, '#F5DB5A', '#C9A82A', '#A8781E');
    }, 12, .65);
  }
  function chinor(p, w, r) {
    var T = tree(p, w, r, { F: FOL.chinor, B: BARK.plane, h: 50, tw: 17, taper: .5, W: 39, H: 39, n: 12, lift: .4, br: [[-.75, -.05], [.7, -.1], [-.35, -.55], [.4, -.6], [0, -.8]],
      after: null }), s = T.s;
    if (T.sprout) return s;
    if (!w && T.e > .4) { var k, rr = rnd(5); for (k = 0; k < 6; k++) { var yy = -T.h * (.15 + rr() * .6), xx = (rr() - .5) * 17 * T.e * .45; s += ell(xx, yy, 2.4 * T.e, 1.6 * T.e, rr() * 60 - 30, k % 2 ? '#D8D0B0' : '#6E6A52', op(.75)); } }
    if (!w && T.cs > .7) s += hang(T, r, 5, function (x, y) { return path('M' + P2(x, y - 4) + ' L' + P2(x, y), null, '#4A3A28', .5) + fruit(x, y + 1.4, 1.6, ['#5E4A2A', '#8A7040', '#C2A868']); }, .25);
    return s;
  }
  function terak(p, w, r) {
    var F = w ? FOL.dry : ['#1E4F33', '#2D6E44', '#468F57', '#A2D58C'], B = w ? BARK.dry : BARK.pale, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 10 + 22 * e, cs = ease(seg(p, .1, .9)), k;
    o += trunk(h + 12 * cs, 6 + 4 * e, 3.5, 0, B, r);
    for (k = 0; k < 4; k++) o += ell(-.8 + (k % 2) * 1.6, -h * (.25 + k * .2), 1.3, .5, 0, '#3E3A34', op(.7));
    var H = 46 * cs * (w ? .75 : 1), W = 16 * cs * (w ? .8 : 1), cy = -h - H * .9, rows = 7;
    o += path(bumps(1, cy + 2, W * 1.05, H, 15, .07, r), F[0]);
    for (k = 0; k < rows; k++) { var t = k / (rows - 1), y = cy + H * .8 - t * H * 1.6, wd = W * (1 - Math.pow(Math.abs(t - .45) * 1.6, 2) * .55); o += clump(-wd * .3, y, wd * .72, F, r, 3) + clump(wd * .38, y + 2, wd * .6, [F[0], mix(F[0], F[1], .5), F[1], F[2]], r, 2); }
    o += clump(0, cy - H * .82, W * .45, F, r, 2);
    return o + (w ? litter(r, 4, FOL.dry) : '');
  }
  function archa(p, w, r) {
    var F = w ? FOL.dry : FOL.juniper, B = w ? BARK.dry : BARK.dark, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 10 + 96 * e, cs = ease(seg(p, .1, .9)), base = -(10 * e + 3), top = -h, k, tiers = 8, Fs = [F[0], mix(F[0], F[1], .5), F[1], F[2]];
    o += trunk(14 * e + 4, 4 + 6 * e, 3 + 3 * e, 0, B, r);
    o += path('M' + P2(-23 * cs, base) + ' C' + P2(-25 * cs, base - (base - top) * .4) + ' ' + P2(-6 * cs, top + 14 * cs) + ' ' + P2(0, top) + ' C' + P2(6 * cs, top + 14 * cs) + ' ' + P2(25 * cs, base - (base - top) * .4) + ' ' + P2(23 * cs, base) + ' Q' + P2(0, base + 6 * cs) + ' ' + P2(-23 * cs, base) + 'Z', F[0]);
    for (k = 0; k < tiers; k++) { var t = k / (tiers - 1), y = base - (base - top) * t * .84 - 3, wd = (1 - t) * 19 * cs + 4.5 * cs; o += clump(-wd * .38, y, wd * .6, F, r, 3) + clump(wd * .42, y + 1.2, wd * .52, Fs, r, 2); }
    o += clump(-1, top + 6 * cs, 5 * cs, F, r, 1);
    if (!w && p > .6) { var rr = rnd(13); for (k = 0; k < 9; k++) { var yy = base - (base - top) * (.15 + rr() * .7), xx = (rr() - .5) * 30 * cs * (1 - (base - yy) / (base - top)); o += circ(xx, yy, 1.4, '#4E6E9E') + circ(xx - .4, yy - .4, .6, '#C8DAF0'); } }
    return o + (w ? litter(r, 4, FOL.dry) : '');
  }
  function tol(p, w, r) {
    var F = w ? FOL.dry : FOL.willow, B = w ? BARK.dry : BARK.brown, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 12 + 38 * e, bend = 6 * e, cs = ease(seg(p, .12, .9)), top = -h - 16 * cs, cx = bend, N = 18, k, back = '', front = '';
    o += trunk(h, 4 + 7 * e, 3 + 2 * e, bend, B, r);
    [[-30, -4], [-14, -12], [12, -12], [28, -2]].forEach(function (b) { o += branch(cx, -h + 3, cx + b[0] * cs, top + b[1] * cs * .4, 2.2 * e + .6, B); });
    N = 24;
    for (k = 0; k < N; k++) {
      var t = k / (N - 1), x0 = cx + (t - .5) * 60 * cs, y0 = top + Math.pow(Math.abs(t - .5) * 2, 2) * 14 * cs + 3 * cs, len = Math.min((26 + r() * 26) * cs * (w ? .6 : 1) + (1 - Math.abs(t - .5) * 2) * 10 * cs, -4 - y0), dx = (t - .5) * 12 * cs + (r() - .5) * 3;
      var col = k % 3 === 0 ? F[2] : k % 3 === 1 ? F[1] : F[0], j, M2 = 9, s2 = path('M' + P2(x0, y0) + ' C' + P2(x0 + dx * .5, y0 + len * .3) + ' ' + P2(x0 + dx, y0 + len * .7) + ' ' + P2(x0 + dx, y0 + len), null, col, .9 * cs + .3);
      for (j = 1; j <= M2; j++) { var u = j / (M2 + 1), px = x0 + dx * (1.5 * u * (1 - u) * (1 - u) + 3 * u * u * (1 - u) + u * u * u), py = y0 + len * (u * (.9 + u * .1)), sd = j % 2 ? 1 : -1, lc = j % 3 === 0 ? F[3] : col === F[0] ? F[1] : F[2]; s2 += ell(px + sd * 1.1 * cs, py, (.7 + u * .3) * cs + .2, (2 + u * .6) * cs + .3, sd * 24, lc, op(.9)); }
      if (k % 2) front += s2; else back += s2;
    }
    return o + back + crown(cx, top + 2 * cs, 27 * cs, 11 * cs, F, r, 7, 6) + front + (w ? litter(r, 5, FOL.dry) : '');
  }
  function saksovul(p, w, r) {
    var F = w ? FOL.dry : FOL.saxaul, B = w ? BARK.dry : BARK.pale, e = ease(p), o = '';
    o += ell(0, 1, 30, 7, 0, '#A87E46') + ell(-3, -.5, 26, 5.5, 0, '#D9B377') + ell(-9, -2, 12, 2.4, 0, '#F0D39A', op(.7)) + path('M-20 1 q6 -2 12 0 M6 2 q5 -1.6 10 0', null, '#B48A50', .6, op(.7));
    if (p < .1) return o + sprout(p * 10, w, F);
    var cs = ease(seg(p, .1, .9)), tw = 1.4 + 2.4 * e, ends = [], k;
    function limb(x0, y0, x1, y1, x2, y2, wd) {
      var d = 'M' + P2(x0, y0) + ' Q' + P2(x1, y1) + ' ' + P2(x2, y2);
      o += path(d, null, B[0], wd + .8) + path(d, null, B[1], wd) + path('M' + P2(x0 - .5, y0) + ' Q' + P2(x1 - .7, y1) + ' ' + P2(x2 - .4, y2), null, B[2], wd * .35, op(.8));
      ends.push([x2, y2]);
    }
    [[-1, -10, -14, -4, -24, -30], [1, 10, -12, 6, -26, -28], [0, -4, -20, 6, -30, -46], [-2, -16, -6, -24, -16, -22], [2, 18, -8, 26, -18, -20]].forEach(function (L2, i) {
      var wd = tw * (i < 3 ? 1 : .7); limb(L2[0], 0, L2[1] * cs, L2[2] * cs, L2[3] * cs, L2[4] * cs, wd);
      limb(L2[3] * cs, L2[4] * cs, (L2[3] + (i % 2 ? 8 : -8)) * cs, (L2[4] - 6) * cs, (L2[3] + (i % 2 ? 12 : -12)) * cs, (L2[4] - 10) * cs, wd * .5);
    });
    /* an airy crown of drooping green-grey shoots */
    var cy = -38 * cs, W = 34 * cs, H = 15 * cs;
    o += path(bumps(0, cy + 2 * cs, W, H, 11, .22, r), F[1], null, null, op(.45));
    var shoots = [];
    for (k = 0; k < 70; k++) { var a = r() * 6.283, d = Math.sqrt(r()); shoots.push([Math.cos(a) * W * d, cy + Math.sin(a) * H * d - 2 * cs, (4 + r() * 6) * cs, (r() - .5) * 3]); }
    shoots.sort(function (A, B2) { return A[1] - B2[1]; });
    shoots.forEach(function (q, i) { var c = i % 4 === 0 ? F[3] : i % 3 === 0 ? F[0] : i % 2 ? F[1] : F[2]; o += path('M' + P2(q[0], q[1]) + ' q' + P2(q[3], q[2] * .4) + ' ' + P2(q[3] * 1.4, q[2]), null, c, .8) + (i % 3 === 0 ? circ(q[0] + q[3] * .7, q[1] + q[2] * .45, .5, F[3], op(.8)) : ''); });
    return o;
  }
  function vineLeaf(x, y, s, ang, F, k) {
    return g('translate(' + P2(x, y) + ') rotate(' + f(ang) + ')', leaf(0, 0, s, s * .8, -55, F[k % 2 ? 1 : 2], F[0]) + leaf(0, 0, s, s * .8, 55, F[1], F[0]) + leaf(0, 0, s * 1.2, s, 0, F[2], F[1], F[3]));
  }
  function uzum(p, w, r) {
    var F = w ? FOL.dry : FOL.vine, B = w ? BARK.dry : BARK.brown, WD = ['#5E3E24', '#8A6040', '#B8885E'], o = '', e = ease(p), k;
    o += path('M-31 0 L-31 -60 L-27 -61 L-27 1Z', WD[1]) + path('M-29 0 L-29 -60 L-27 -61 L-27 1Z', WD[0]) + path('M27 1 L27 -61 L31 -60 L31 0Z', WD[1]) + path('M29 1 L29 -61 L31 -60 L31 0Z', WD[0]);
    o += path('M-36 -64 L36 -64 L36 -60 L-36 -60Z', WD[1]) + path('M-36 -64 L36 -64 L36 -63 L-36 -63Z', WD[2]) + path('M-36 -61 L36 -61 L36 -60 L-36 -60Z', WD[0]);
    if (p < .1) return o + sprout(p * 10, w, F);
    var vs = ease(seg(p, .1, .85));
    o += path('M-2 0 C-6 -14 4 -24 -1 -36 C-5 -46 3 -54 0 ' + f(-36 - 26 * vs), null, B[0], 3.2 * e + .8) + path('M-2.6 0 C-6.6 -14 3.4 -24 -1.6 -36 C-5.6 -46 2.4 -54 -.6 ' + f(-36 - 26 * vs), null, B[2], 1 * e + .3, op(.6));
    o += path('M0 -60 C-12 -66 -22 -60 ' + P2(-34 * vs, -62) + ' M0 -60 C12 -66 22 -60 ' + P2(34 * vs, -62), null, B[1], 1.4);
    var leaves = [];
    for (k = 0; k < 13; k++) leaves.push([(-34 + k * 5.7 + (r() - .5) * 3) * vs, -62 + (r() - .5) * 12 - (k % 2) * 3, (r() - .5) * 60, 7 + r() * 3]);
    leaves.sort(function (a, b) { return a[1] - b[1]; });
    var fr = ease(seg(p, .6, 1)), gr = '';
    if (fr > 0 && !w) [[-24, -57], [-9, -55], [6, -56], [20, -57]].forEach(function (q, i) {
      var c = i % 3 === 1 ? ['#6E8A1E', '#A8C23A', '#E2F08A'] : ['#2E1048', '#5B2A86', '#9C6ACF'], rows = [4, 3, 3, 2, 1], y = q[1], j;
      gr += path('M' + P2(q[0], q[1] - 4) + ' L' + P2(q[0], q[1]), null, '#5E4A2A', .7);
      rows.forEach(function (n, rI) { for (j = 0; j < n; j++) gr += fruit(q[0] + (j - (n - 1) / 2) * 3.1 * fr, y + rI * 2.8 * fr, 1.7 * fr, c); });
    });
    leaves.forEach(function (q, i) { o += vineLeaf(q[0], q[1] + 4, q[3] * vs, q[2], F, i); if (i === 6) o += gr; });
    return o;
  }
  function anjir(p, w, r) {
    var F = w ? FOL.dry : FOL.fig, B = w ? BARK.dry : BARK.grey, e = ease(p), o = '', k;
    if (p < .1) return sprout(p * 10, w, F);
    var h = 8 + 26 * e, cs = ease(seg(p, .12, .88)), wd = 2.6 * e + 1;
    o += branch(0, 0, -15 * e, -h, wd, B) + branch(0, 0, 13 * e, -h * .9, wd, B) + branch(0, 0, 2, -h * 1.1, wd * 1.1, B);
    var cy = -h - 10 * cs;
    o += path(bumps(0, cy, 32 * cs * (w ? .8 : 1), 19 * cs, 11, .12, r), F[0]);
    var spots = [];
    for (k = 0; k < 9; k++) { var a = -Math.PI + k / 8 * Math.PI * 1.1 + (r() - .5) * .3, d = .55 + r() * .4; spots.push([Math.cos(a) * 28 * cs * d, cy + Math.sin(a) * 18 * cs * d + 6 * cs, (a + Math.PI / 2) * 50 + (r() - .5) * 20]); }
    spots.sort(function (a, b) { return a[1] - b[1]; });
    spots.forEach(function (q, i) { var z = 11 * cs * (w ? .7 : 1); o += figLeaf(q[0], q[1], z, q[2] * .8, i % 2 ? F[1] : F[2], F[0], F[3]); });
    if (w) return o + litter(r, 5, FOL.dry);
    var fr = ease(seg(p, .65, 1));
    if (fr > 0) o += hang({ cx: 0, cy: cy + 6, W: 24 * cs, H: 14 * cs }, r, 6, function (x, y) { var R = 2.6 * fr; return path('M' + P2(x - R, y) + ' C' + P2(x - R, y - R * 1.2) + ' ' + P2(x - R * .3, y - R * 1.8) + ' ' + P2(x, y - R * 2) + ' C' + P2(x + R * .3, y - R * 1.8) + ' ' + P2(x + R, y - R * 1.2) + ' ' + P2(x + R, y) + ' A' + P2(R, R) + ' 0 0 1 ' + P2(x - R, y) + 'Z', '#5A2E4A') + ell(x - R * .35, y - R * .6, R * .3, R * .6, 0, '#9A5A86', op(.8)); });
    return o;
  }
  function figLeaf(x, y, z, ang, c, cd, v) {
    var L1 = 'M0 0 C' + P2(-z * .3, -z * .1) + ' ' + P2(-z * .68, -z * .12) + ' ' + P2(-z * .78, -z * .45) + ' C' + P2(-z * .88, -z * .78) + ' ' + P2(-z * .52, -z * .8) + ' ' + P2(-z * .34, -z * .62) + ' C' + P2(-z * .46, -z * .98) + ' ' + P2(-z * .22, -z * 1.18) + ' 0 ' + f(-z * 1.22);
    var R1 = ' C' + P2(z * .22, -z * 1.18) + ' ' + P2(z * .46, -z * .98) + ' ' + P2(z * .34, -z * .62) + ' C' + P2(z * .52, -z * .8) + ' ' + P2(z * .88, -z * .78) + ' ' + P2(z * .78, -z * .45) + ' C' + P2(z * .68, -z * .12) + ' ' + P2(z * .3, -z * .1) + ' 0 0Z';
    return g('translate(' + P2(x, y) + ') rotate(' + f(ang) + ')', path(L1 + R1, c) + path('M0 0 L0 ' + f(-z * 1.22) + R1, cd) + path('M0 0 L0 ' + f(-z * 1.05) + ' M0 ' + f(-z * .15) + ' L' + P2(-z * .6, -z * .5) + ' M0 ' + f(-z * .15) + ' L' + P2(z * .6, -z * .5), null, v, .5, op(.6)));
  }
  function groundVine(s, F, r, n) {
    var o = path('M0 0 C-8 2 -18 -2 ' + P2(-30 * s, 1) + ' M0 0 C8 -2 18 2 ' + P2(30 * s, -1), null, F[0], 1.3), k, pts = [];
    for (k = 0; k < n; k++) pts.push([(-28 + k * 56 / (n - 1)) * s + (r() - .5) * 4, (r() - .5) * 4, (r() - .5) * 80]);
    pts.sort(function (a, b) { return a[1] - b[1]; });
    return { s: o, pts: pts };
  }
  function qovun(p, w, r) {
    var F = w ? FOL.dry : FOL.vine, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var s = .35 + .65 * e, V = groundVine(s, F, r, 6), fr = ease(seg(p, .55, 1));
    o += V.s;
    V.pts.slice(0, 4).forEach(function (q, i) { o += leaf(q[0] * 1.15, q[1] - 1, 18 * s, 17 * s, q[2] * .6, i % 2 ? F[1] : F[2], F[0], F[3]); });
    o += path('M-24 -2 c-3 -2 -1 -5 1 -4 c2 1 0 3 -1 2 M22 -3 c3 -2 1 -5 -1 -4', null, F[2], .6);
    if (!w && p > .35) [[-20, -8], [16, -10]].forEach(function (q) { o += bloom(q[0] * s, q[1] * s, 1.8, '#F5D02A', '#C9A20E', '#B8860B'); });
    if (fr > 0) {
      var c = w ? ['#6E5A36', '#8E7A4E', '#B8A070'] : ['#B98A22', '#E9C45A', '#FFF1B0'], m = '';
      m += ell(1, 1.4, 17.5, 8.8, 0, c[0]) + ell(-.4, -.4, 16.4, 8, 0, c[1]) + path('M-16 1 C-10 7.5 10 7.5 16 1 C10 9 -10 9 -16 1Z', c[0], null, null, op(.5));
      [-1.2, -.4, .4, 1.2].forEach(function (k) { m += path('M-16 0 C-8 ' + f(k * 7 + .5) + ' 8 ' + f(k * 7 - .5) + ' 16 0', null, c[0], .45, op(.28)); });
      m += ell(-5, -4.2, 8, 2.4, -6, c[2], op(.55)) + ell(-7, -4.8, 3, .9, -6, '#FFFFFF', op(.5)) + path('M16 -1 q2 -1 3.4 -3', null, '#6B4A22', 1.4);
      o += g('translate(' + P2(4, -6) + ') rotate(-10) scale(' + f(fr) + ')', m);
    }
    V.pts.slice(4).forEach(function (q) { o += leaf(q[0] * 1.1, q[1] + 3, 12 * s, 12 * s, q[2] > 0 ? 70 : -70, F[2], F[1], F[3]); });
    return o;
  }
  function tarvuz(p, w, r) {
    var F = w ? FOL.dry : FOL.vine, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var s = .35 + .65 * e, V = groundVine(s, F, r, 6), fr = ease(seg(p, .55, 1));
    o += V.s;
    V.pts.slice(0, 4).forEach(function (q, i) { o += g('translate(' + P2(q[0], q[1]) + ') rotate(' + f(q[2]) + ')', fern(0, 0, 12 * s, -30, F) + fern(0, 0, 12 * s, 30, F)); });
    if (fr > 0) {
      var c = w ? ['#4A4A2E', '#6E6A44', '#8E8A60'] : ['#1E5A24', '#3F8F3A', '#8ECF6E'], m = ell(1, 1, 15, 10, 0, '#163E1A') + ell(-.5, -.5, 14, 9.5, 0, c[1]);
      [-1.6, -.8, 0, .8, 1.6].forEach(function (k) { m += path('M-14 0 C-8 ' + f(k * 9.5 * .9 + 1) + ' 8 ' + f(k * 9.5 * .9 - 1) + ' 14 0', null, c[0], 1.6, op(.85)); });
      m += ell(-5, -5, 5.5, 2.4, -12, c[2], op(.5)) + path('M14 -1 l3 -1.5', null, '#5A6A22', 1);
      o += g('translate(' + P2(-4, -7) + ') scale(' + f(fr) + ')', m);
      if (!w && fr > .8) o += g('translate(' + P2(18, -2) + ') rotate(-8)', path('M-8 0 A8 8 0 0 1 8 0Z', '#2E7D32') + path('M-7 -.5 A7 7 0 0 1 7 -.5Z', '#F2F4E8') + path('M-6 -1 A6 6 0 0 1 6 -1Z', '#E8414A') + path('M-6 -1 A6 6 0 0 1 0 -7 L0 -1Z', '#F25A62', null, null, op(.6)) + circ(-2.5, -3, .6, '#1A1A1A') + circ(1, -4.5, .6, '#1A1A1A') + circ(3, -2.5, .6, '#1A1A1A'));
    }
    return o;
  }
  function nilufar(p, w, r) {
    var e = ease(p), o = '', k, water = w ? ['#2E4A44', '#3E5E54', '#6E8A7E'] : ['#1E5E94', '#2C78B8', '#8FD0FF'];
    o += ell(0, 1, 34, 12, 0, '#4E5262') + ell(0, -1.5, 33, 11.4, 0, '#9097A8') + ell(0, -2, 30, 9.8, 0, '#B9BDCB') + ell(0, -2.2, 28, 8.8, 0, water[0]) + ell(-1, -2.8, 26.5, 8, 0, water[1]);
    for (k = 0; k < 10; k++) { var a = k / 10 * 6.283; o += ell(Math.cos(a) * 31, -1.8 + Math.sin(a) * 10.4, 2.6, 1.2, Math.cos(a) * 20, k % 2 ? '#7D8396' : '#A6ABBB', op(.8)); }
    o += ell(-12, -5, 9, 1.6, 0, water[2], op(.35)) + path('M6 -1 q4 -1.4 8 0 M-6 1 q3 -1 6 0', null, water[2], .5, op(.5));
    if (p < .1) return o + ell(4, -3, 4 * (p * 10), 1.8 * (p * 10), 0, '#3F9A52');
    var s = .4 + .6 * e, padC = w ? ['#4A4A2E', '#6E6A44', '#8E8A60'] : ['#1F6E36', '#2F8E48', '#6CC46E'];
    [[-15, -3, 7], [13, -1, 8], [2, 2, 6], [-4, -6, 5]].forEach(function (q) { var R = q[2] * s; o += ell(q[0] + .6, q[1] + .5, R, R * .38, 0, padC[0]) + path('M' + P2(q[0], q[1]) + ' L' + P2(q[0] + R, q[1] - R * .2) + ' A' + P2(R, R * .38) + ' 0 1 1 ' + P2(q[0] + R * .9, q[1] + R * .18) + 'Z', padC[1]) + ell(q[0] - R * .3, q[1] - R * .1, R * .4, R * .12, 0, padC[2], op(.6)); });
    var fs = ease(seg(p, .4, 1)), P = w ? WP : ['#B83A78', '#E86AA0', '#FFB8D4', '#FFFFFF'];
    if (fs > 0) {
      o += path('M-16 -4 Q-18 -14 -15 -20', null, w ? '#6E6A44' : '#2F7A3A', 1.2) + g('translate(-15 -21) rotate(' + (w ? 60 : -10) + ')', ell(0, 0, 2.4 * fs, 4.4 * fs, 0, P[1]) + ell(.8, .4, 1.2 * fs, 3.6 * fs, 0, P[0]) + ell(-.8, -1, .6 * fs, 2.4 * fs, 0, P[3], op(.7)));
      var fl = '', z = .4 + .6 * fs;
      [-62, -38, 38, 62, -14, 14].forEach(function (a) { fl += g('rotate(' + a + ')', path('M0 0 C-3.6 -3 -3.6 -11 0 -15 C3.6 -11 3.6 -3 0 0Z', P[0])); });
      [-46, 46, -22, 22].forEach(function (a) { fl += g('rotate(' + a + ')', path('M0 0 C-3.6 -3 -3.4 -11 0 -14 C3.4 -11 3.6 -3 0 0Z', P[1]) + path('M0 -1 C-1.4 -4 -1.2 -9 0 -12', null, P[2], .9, op(.8))); });
      fl += ell(0, -5, 4.2, 2.2, 0, '#E8C43A') + ell(0, -5.6, 3.2, 1.4, 0, '#FFE27A');
      [-8, 0, 8].forEach(function (a) { fl += g('rotate(' + a + ')', path('M0 1 C-3.4 -2 -3.2 -9 0 -12 C3.2 -9 3.4 -2 0 1Z', P[2]) + path('M-.6 -2 C-1.2 -5 -1 -8 0 -10.5', null, P[3], .9, op(.85))); });
      o += g('translate(4 -6) scale(' + f(z) + ')' + (w ? ' rotate(35)' : ''), fl);
    }
    return o;
  }
  function yulduzgul(p, w, r) {
    var F = w ? FOL.dry : FOL.star, e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, w, F);
    var h = 12 + 46 * e, ls = ease(seg(p, .08, .6)), fs = ease(seg(p, .45, 1));
    o += blade(-2, 0, 30 * ls, 9 * ls, -34, -6, F[1], F[0], w ? null : F[3]) + blade(2, 0, 28 * ls, 9 * ls, 32, 6, F[1], F[0], w ? null : F[3]);
    o += stem(0, 0, w ? 10 : 0, -h, w ? 6 : 1.5, w ? '#6E5C3C' : '#1C5560', w ? '#8E7A55' : '#3FA8A0', 2.6);
    o += blade(0, -h * .45, 16 * ls, 6 * ls, -58, -3, F[2], F[1], w ? null : F[3]) + blade(0, -h * .55, 15 * ls, 6 * ls, 56, 3, F[2], F[1], w ? null : F[3]);
    if (fs > 0) {
      var R = 14 * (.4 + .6 * fs), C = w ? ['#4A3A34', '#6E5650', '#8E766C', '#A89270'] : ['#2E1E8A', '#5A3FD0', '#9B7BFF', '#F5C04A'], fl = '', ri = Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);
      if (!w) fl += circ(0, 0, R * 1.45, '#B89CFF', op(.18)) + circ(0, 0, R * 1.1, '#D8C8FF', op(.15));
      fl += path(star(.8, .8, R, 8, ri), C[0]) + path(star(0, 0, R, 8, ri), C[1]) + path(star(0, 0, R * .74, 8, ri, Math.PI / 8), C[2]) + path(star(0, 0, R * .46, 8, ri), C[0], null, null, op(.5));
      fl += circ(0, 0, R * .3, C[3]) + path(star(0, 0, R * .22, 8, ri, Math.PI / 8), w ? '#BBA08E' : '#FFF1B8') + ell(-R * .35, -R * .45, R * .22, R * .1, -35, '#FFFFFF', op(.4));
      o += g('translate(' + P2(w ? 10 : 0, -h) + ')' + (w ? ' rotate(70)' : ''), fl);
      if (!w) o += sparkles(0, -h - 4, 18, r);
    }
    return o;
  }
  function sparkles(x, y, spread, r) {
    var s = '';
    for (var i = 0; i < 4; i++) { var px = x + (r() - .5) * spread * 2, py = y + (r() - .5) * spread * 1.4, k = 1.6 + r() * 1.8; s += path(star(px, py, k * 2, 4, .25), '#FFF6CF', null, null, ' class="spk"'); }
    return s;
  }

  var DRAW = { lola: lola, paxta: paxta, rayhon: rayhon, binafsha: binafsha, kungaboqar: kungaboqar, nargiz: nargiz, qizgaldoq: qizgaldoq, atirgul: atirgul, sumbul: sumbul, anor: anor, olma: olma, shaftoli: shaftoli, gilos: gilos, behi: behi,
    orik: orik, bodom: bodom, nok: nok, qovun: qovun, uzum: uzum, tarvuz: tarvuz, anjir: anjir, xurmo: xurmo, tut: tut, yongoq: yongoq, tol: tol, terak: terak, zarang: zarang, archa: archa, jiyda: jiyda, saksovul: saksovul,
    chinor: chinor, nilufar: nilufar, oltinlola: oltinlola, yulduzgul: yulduzgul };
  /* plants that bring their own ground (a pot, a basin, sand or a vine on the soil) get no planting mound */
  var OWN_GROUND = { rayhon: 1, nilufar: 1, saksovul: 1, qovun: 1, tarvuz: 1 };

  /* golden variant: every colour is mapped onto a gold ramp by its lightness */
  function hexLum(h) { var n = parseInt(h.slice(1), 16), R = n >> 16 & 255, G = n >> 8 & 255, B = n & 255; return (0.299 * R + 0.587 * G + 0.114 * B) / 255; }
  function goldOf(h) {
    if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    var l = Math.pow(hexLum(h), .85), a = [122, 82, 14], b = [255, 236, 150];
    var c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * Math.min(1, l * 1.35)); });
    return '#' + c.map(function (v) { return (v < 16 ? '0' : '') + v.toString(16); }).join('');
  }
  function goldify(svg) { return svg.replace(/(fill|stroke)="(#[0-9A-Fa-f]{3,6})"/g, function (m, a, h) { return a + '="' + goldOf(h) + '"'; }); }

  function plant(id, p, opt) {
    opt = opt || {}; p = clamp(p, 0, 1);
    var r = rnd(opt.seed || 7), fn = DRAW[id] || lola, inner = fn(p, !!opt.withered, r);
    if (opt.golden && !opt.withered) inner = goldify(inner) + (p > .6 ? sparkles(0, -40, 22, rnd((opt.seed || 7) + 3)) : '');
    var mound = OWN_GROUND[id] ? '' : ell(0, 1.2, 12, 3.6, 0, '#3A2416', op(.5)) + ell(-.8, .4, 9.5, 2.6, 0, '#6B4A30', op(.85)) + ell(-2.4, -.2, 4, .9, 0, '#8E6644', op(.7));
    return '<g class="plant' + (opt.withered ? ' withered' : '') + (opt.golden ? ' golden' : '') + '">' + mound + inner + '</g>';
  }

  /* ---------------------------------------------------------------- decorations (base at 0,0) */
  function D(id, cost, name) { return { id: id, cost: cost, name: name }; }
  var DECOR = [
    D('tosh', 30, L('Stones', 'Toshlar', 'Камни')), D('yol', 40, L('Stone path', 'Tosh yo‘lak', 'Каменная дорожка')), D('koza', 80, L('Clay jug', 'Ko‘za', 'Глиняный кувшин')),
    D('fonus', 90, L('Lantern', 'Fonus', 'Фонарь')), D('qovoq', 120, L('Pumpkins', 'Qovoqlar', 'Тыквы')), D('qushuya', 150, L('Birdhouse', 'Qush uyasi', 'Скворечник')),
    D('ari', 180, L('Beehive', 'Ari uyasi', 'Улей')), D('orindiq', 200, L('Bench', 'O‘rindiq', 'Скамейка')), D('gulxan', 240, L('Fire pit', 'Gulxan', 'Костёр')),
    D('kapalak', 280, L('Butterflies', 'Kapalaklar', 'Бабочки')), D('tandir', 320, L('Tandir oven', 'Tandir', 'Тандыр')), D('supa', 360, L('Tapchan', 'So‘ri', 'Топчан')),
    D('ariq', 420, L('Ariq stream', 'Ariq', 'Арык')), D('favvora', 480, L('Fountain', 'Favvora', 'Фонтан')), D('hovuz', 600, L('Pond', 'Hovuz', 'Пруд')),
    D('minor', 900, L('Little minaret', 'Kichik minora', 'Маленький минарет'))
  ];
  function isoBox(x, y, w, d, h, top, left, right) {
    var a = [x, y], b = [x + w, y + w / 2], c = [x + w - d, y + w / 2 + d / 2], dd = [x - d, y + d / 2];
    function Q(q, dy) { return f(q[0]) + ' ' + f(q[1] + (dy || 0)); }
    return path('M' + Q(dd) + ' L' + Q(c) + ' L' + Q(c, h) + ' L' + Q(dd, h) + 'Z', left) + path('M' + Q(c) + ' L' + Q(b) + ' L' + Q(b, h) + ' L' + Q(c, h) + 'Z', right) + path('M' + Q(a) + ' L' + Q(b) + ' L' + Q(c) + ' L' + Q(dd) + 'Z', top);
  }
  function shadow(rx, ry) { return ell(1.5, 1, rx, ry, 0, '#000', op(.2)); }
  function rock(x, y, rx, ry, rot, c) { return ell(x + rx * .1, y + ry * .25, rx, ry, rot, c[0]) + ell(x - rx * .05, y - ry * .05, rx * .9, ry * .82, rot, c[1]) + ell(x - rx * .3, y - ry * .35, rx * .4, ry * .28, rot, c[2], op(.8)); }
  var STONE = ['#5E6476', '#8C92A5', '#C2C7D4'], STONE2 = ['#6E6658', '#A39A88', '#D2CABA'];
  var DECO = {
    tosh: function () { return shadow(16, 5) + rock(-8, -2, 7.5, 4.8, -10, STONE) + rock(6, 2, 5.2, 3.4, 15, STONE2) + rock(0, -7.5, 3.8, 2.6, 0, STONE) + ell(-12, 1, 3, .8, 0, '#3E8A4A', op(.8)); },
    yol: function () { var s = ''; [[-14, 0], [-4, 4], [6, 1], [14, -3], [-6, -5], [4, -8]].forEach(function (q, i) { s += ell(q[0] + .6, q[1] + 1.2, 5.6, 2.8, 0, '#4E5262') + ell(q[0], q[1], 5.2, 2.6, 0, i % 2 ? '#B9BDCB' : '#A6ABBB') + ell(q[0] - 1.6, q[1] - .8, 2.2, .9, 0, '#E1E4EC', op(.7)); }); return s; },
    koza: function () { return shadow(10, 3.2) + path('M-7 0 C-12 -8 -10 -18 -5 -21 L-4 -26 L4 -26 L5 -21 C10 -18 12 -8 7 0Z', '#B85C34') + path('M0 0 C5 -1 10 -8 7 -16 C10 -10 8 -3 0 0Z', '#8F4224') + path('M-9 -12 C-9 -6 -6 -1 -3 0', null, '#8F4224', 1, op(.4)) + path('M-8.5 -11 L8.5 -11', null, '#E8C489', 1.2, op(.8)) + path('M-8 -9 L8 -9', null, '#2F6FD6', .8, op(.8)) + ell(0, -26, 4.5, 1.6, 0, '#6E3018') + ell(0, -26.4, 3.2, 1, 0, '#2A140A') + path('M5 -22 C11 -22 12 -14 7 -12', null, '#9E4A28', 2.2) + path('M-6 -10 C-6 -14 -5 -17 -3 -19', null, '#F0A07A', 1.6, op(.85)); },
    fonus: function () { return shadow(7, 2.5) + path('M-1.6 0 L-1.6 -34 L1.6 -34 L1.6 0Z', '#3A3F52') + path('M.4 0 L.4 -34 L1.6 -34 L1.6 0Z', '#23263A') + path('M1.5 -34 L10 -34', null, '#3A3F52', 2) + path('M10 -34 L10 -31', null, '#3A3F52', 1.2) + circ(10, -24, 12, '#FFC75A', ' class="glow" opacity=".22"') + path('M6 -31 L14 -31 L13 -18 L7 -18Z', '#FFD36B') + path('M10 -31 L14 -31 L13 -18 L10 -18Z', '#F0B840') + path('M6 -31 L14 -31 L13 -18 L7 -18Z', 'none', '#6A4A1E', 1) + path('M10 -31 L10 -18', null, '#6A4A1E', .6) + path('M5 -32 L15 -32 L13 -30 L7 -30Z', '#6A4A1E') + circ(10, -24.5, 2.4, '#FFF6CF') + path('M-3 0 L3 0 L2 -3 L-2 -3Z', '#23263A'); },
    qovoq: function () { function pk(x, y, R, c) { var s = ell(x + 1, y + 1, R * 1.25, R, 0, c[0]) + ell(x, y, R * 1.2, R * .95, 0, c[1]); [-.6, -.2, .2, .6].forEach(function (k) { s += path('M' + P2(x + k * R * 1.1, y - R * .9) + ' Q' + P2(x + k * R * 1.6, y) + ' ' + P2(x + k * R * 1.1, y + R * .9), null, c[0], R * .12, op(.7)); }); return s + ell(x - R * .5, y - R * .45, R * .35, R * .22, -20, c[2], op(.7)) + path('M' + P2(x, y - R * .9) + ' q' + P2(1, -2.4) + ' ' + P2(2.6, -2.6), null, '#5A6A22', 1.6); }
      return shadow(18, 4.5) + pk(-6, -5, 6.5, ['#A8480E', '#E07A1F', '#FFB86A']) + pk(8, -3.5, 4.8, ['#B8860B', '#E8B83A', '#FFE8A0']) + leaf(-14, -1, 8, 7, -60, '#46802C', '#2E5A1E', '#BEE07A'); },
    qushuya: function () { return shadow(5, 2) + path('M-1.6 0 L-1.6 -28 L1.6 -28 L1.6 0Z', '#7A5233') + path('M.4 0 L.4 -28 L1.6 -28 L1.6 0Z', '#5A3A22') + path('M-8.5 -28 L0 -40 L8.5 -28Z', '#C0392B') + path('M0 -40 L8.5 -28 L4 -28Z', '#8E2318') + path('M-7 -28 L7 -28 L7 -16 L-7 -16Z', '#E8C489') + path('M0 -28 L7 -28 L7 -16 L0 -16Z', '#C9A26A') + circ(0, -23, 2.6, '#3A2414') + circ(-.6, -23.6, .8, '#6A4A2E') + path('M-3 -18.5 L-6.5 -18.5', null, '#7A5233', 1.4); },
    ari: function () { var s = shadow(14, 4) + isoBox(-10, -4, 20, 10, 4, '#8A6A45', '#6E5233', '#5A422A'); [0, 1, 2].forEach(function (i) { var y = -12 - i * 7, w = 12 - i * 2; s += ell(0, y + 4, w, 3.6, 0, '#B8801E') + ell(-.5, y + 1, w, 4, 0, i % 2 ? '#F2B531' : '#E8A825') + ell(-w * .45, y, w * .3, 1.2, 0, '#FFE08A', op(.6)); }); return s + ell(0, -31, 5, 3, 0, '#E8A825') + ell(-1.5, -32, 2, 1, 0, '#FFE08A', op(.6)) + circ(-2, -12, 1.8, '#3A2A10') + circ(8, -26, 1.4, '#222') + ell(9, -27.5, 1.6, .9, -30, '#fff', op(.8)) + circ(-9, -22, 1.1, '#222') + ell(-8.2, -23.2, 1.2, .7, 30, '#fff', op(.8)); },
    orindiq: function () { return shadow(18, 5) + isoBox(-16, -6, 24, 9, 3, '#C88B4E', '#9A6636', '#7E522B') + path('M-15 -2 L-15 5 M7 9 L7 15 M-6 1 L-6 7', null, '#4A2E18', 2.2) + path('M-16 -6 L8 6 L8 -6 L-16 -18Z', '#B57A42') + path('M-16 -14 L8 -2 M-16 -10 L8 2', null, '#8A5A2F', .7, op(.7)) + path('M-16 -18 L8 -6', null, '#D9A066', 1.2); },
    gulxan: function () { var s = '', k; for (k = 0; k < 9; k++) { var a = k / 9 * Math.PI * 2; s += rock(Math.cos(a) * 11, Math.sin(a) * 5.5, 3.4, 2.2, 0, STONE); } return circ(0, -8, 17, '#FF9B3D', ' class="glow" opacity=".18"') + shadow(15, 5) + s + path('M-8 1 L8 -2', null, '#4A2E18', 2.6) + path('M-7 -2 L7 1', null, '#6B4426', 2.4) + path('M-6 0 C-8 -8 -2 -10 -3 -18 C2 -12 4 -14 3 -22 C9 -14 9 -6 6 0Z', '#F26A1B') + path('M-3 0 C-4 -6 0 -7 0 -13 C3 -8 5 -6 3 0Z', '#FFC233') + path('M-1 0 C-1.5 -3 .5 -4 .5 -7 C2 -4 2.4 -2 1.4 0Z', '#FFF2B0'); },
    kapalak: function () { var s = ''; [[-10, -30, '#F5C04A', '#E08A1E'], [8, -40, '#9B7BFF', '#6A45E0'], [2, -22, '#FF7FA6', '#D22A50']].forEach(function (b, i) { s += '<g class="fly" style="--fd:' + (i * .7) + 's"><g transform="translate(' + b[0] + ' ' + b[1] + ')">' + ell(-3, -1, 3.4, 2.4, -30, b[2]) + ell(3, -1, 3.4, 2.4, 30, b[3]) + ell(-2.2, 2, 2.2, 1.6, 20, b[3]) + ell(2.2, 2, 2.2, 1.6, -20, b[3]) + ell(-3.6, -1.8, 1.2, .7, -30, '#FFFFFF', op(.6)) + path('M0 -2 L0 3', null, '#2A2235', 1.1) + path('M0 -2 l-1.2 -2 M0 -2 l1.2 -2', null, '#2A2235', .4) + '</g></g>'; }); return s; },
    tandir: function () { return shadow(14, 4.5) + circ(0, -12, 16, '#FF9B3D', ' class="glow" opacity=".12"') + path('M-12 0 C-13 -8 -11 -18 -6 -22 L6 -22 C11 -18 13 -8 12 0Z', '#C9935A') + path('M2 0 C6 -6 8 -14 6 -22 C11 -18 13 -8 12 0Z', '#9C6A3A') + path('M-10 -2 C-11 -8 -10 -15 -7 -19', null, '#E8B888', 1.6, op(.7)) +
        ell(0, -22, 6.5, 2.4, 0, '#8A5A32') + ell(0, -22, 4.8, 1.6, 0, '#2A140A') + ell(0, -21.6, 3, .8, 0, '#FF8A2A', op(.8)) + ell(-4, -6, 3.2, 3.6, 0, '#2A140A') + ell(-4, -6.4, 2, 2.4, 0, '#C2420E', op(.8)) +
        g('translate(10 -2)', ell(.5, .6, 6, 2.4, 0, '#8A5A22') + ell(0, 0, 6, 2.4, 0, '#D9A050') + ell(0, -.3, 3.6, 1.3, 0, '#C2863A') + circ(-1, -.4, .4, '#6B4422') + circ(1, -.2, .4, '#6B4422') + circ(0, .3, .4, '#6B4422')); },
    supa: function () { return shadow(24, 6) + isoBox(-20, -10, 30, 18, 6, '#B23A3A', '#8A6A45', '#6E5233') + path('M-20 -10 L10 5 L-8 14 L-38 -1Z', '#B23A3A') + path('M-16 -9 L8 3 L-7 10.5 L-31 -1.5Z', 'none', '#F5C04A', 1.2) + path('M-12 -5 L2 2 L-6 6 L-20 -1Z', 'none', '#F5C04A', .7, op(.8)) + path('M-38 -1 L-38 4 M-8 14 L-8 19 M10 5 L10 10', null, '#4A2E18', 2.4) + ell(-12, -2, 6, 3, 0, '#5E3E24') + ell(-12.4, -4, 5.5, 2.6, 0, '#9B6A44') + path('M-13 -5 C-14 -10 -10 -10 -10 -7 L-9 -5Z', '#2F6FD6') + ell(-11.5, -9.5, 2.2, 1, 0, '#2F6FD6') + path('M-8 -8 L-5 -9', null, '#2F6FD6', 1.2) + path('M-12.6 -8 C-12.8 -6.5 -12.2 -5.6 -11.4 -5.4', null, '#9FC2FF', .6) + circ(-16, -4, 1.6, '#F5C04A') + circ(-17.6, -3.2, 1.4, '#E5484D'); },
    ariq: function () { return path('M-26 -6 L4 9 L14 4 L-16 -11Z', '#8C92A5') + path('M-24 -6 L4 8 L12 4 L-16 -10Z', '#2C78B8') + path('M-20 -6 L-4 2 M-12 -6 L6 4', null, '#8FD0FF', .8, ' class="spray"') + path('M-26 -6 L4 9 L4 11 L-26 -4Z', '#6E7486') + rock(-22, -11, 2.4, 1.4, 0, STONE) + rock(12, 7, 2.2, 1.3, 0, STONE2) + leaf(-18, -9, 6, 2, -20, '#46802C', '#2E5A1E') + leaf(-17, -9, 5, 1.8, 15, '#46802C', '#2E5A1E'); },
    favvora: function () { return shadow(20, 9) + ell(0, -3, 19, 8.5, 0, '#6E7486') + ell(0, -5, 19, 8.5, 0, '#B9BDCB') + ell(0, -5.5, 16, 7, 0, '#2C78B8') + ell(-4, -7, 6, 2, 0, '#9FD6FF', op(.7)) + path('M-3 -6 L-2 -20 L2 -20 L3 -6Z', '#A6ABBB') + path('M.5 -6 L1 -20 L2 -20 L3 -6Z', '#7D8396') + ell(0, -20, 8, 3.4, 0, '#B9BDCB') + ell(0, -20.6, 6.6, 2.7, 0, '#3E9BE0') + path('M0 -21 C-1 -28 1 -30 0 -33 M0 -22 C-5 -26 -7 -24 -8 -19 M0 -22 C5 -26 7 -24 8 -19', null, '#BEE6FF', 1.4, ' class="spray"'); },
    hovuz: function () { var s = ell(0, 0, 26, 12, 0, '#5E6476') + ell(0, -1, 24.5, 11, 0, '#1E5E94') + ell(-1, -1.6, 23, 10, 0, '#2E86C9') + ell(-6, -3, 12, 4, 0, '#5FB3EE', op(.55)), k; for (k = 0; k < 9; k++) { var a = k / 9 * 6.283; s += rock(Math.cos(a) * 25, Math.sin(a) * 11.5 - .5, 3, 1.6, 0, k % 2 ? STONE : STONE2); } return s + ell(8, 2, 5, 2.4, 15, '#2F8E48') + ell(7.4, 1.6, 2, .8, 15, '#6CC46E', op(.6)) + ell(-12, 3, 4, 2, -10, '#2F8E48') + circ(-11, 1.6, 1.7, '#FF8AB3') + circ(-11.4, 1.2, .7, '#FFE0EC') + ell(14, -5, 3, 1.5, 0, '#2F8E48') + g('translate(-2 -2)', ell(0, 0, 3, 1.6, 0, '#F28A1E') + path('M2.6 0 l2 -1.4 l0 2.8Z', '#F28A1E') + circ(-1.6, -.3, .4, '#1A1A1A')); },
    minor: function () {
      var s = shadow(14, 5) + isoBox(-11, -4, 18, 9, 4, '#D9B98A', '#B08A5A', '#8E6A40'), y0 = -4, top = -54, k;
      s += path('M-8 ' + y0 + ' L-6 ' + top + ' L6 ' + top + ' L8 ' + y0 + 'Z', '#C9935A') + path('M2 ' + y0 + ' L2 ' + top + ' L6 ' + top + ' L8 ' + y0 + 'Z', '#9C6A3A');
      for (k = 0; k < 9; k++) { var y = y0 - 4 - k * 5.4, wd = 8 - (k / 9) * 2; s += path('M' + P2(-wd, y) + ' L' + P2(wd, y), null, '#A87648', .5, op(.6)); }
      [[-12, '#1FA3A0', 2.4], [-26, '#2F5FD0', 2], [-38, '#1FA3A0', 2.4], [-46, '#F5C04A', 1]].forEach(function (b) { var t = (y0 - b[0]) / (y0 - top), wd = 8 - 2 * ((-b[0] - 4) / 50); s += path('M' + P2(-wd, b[0]) + ' L' + P2(wd, b[0]) + ' L' + P2(wd - .2, b[0] - b[2] * 1.6) + ' L' + P2(-wd + .2, b[0] - b[2] * 1.6) + 'Z', b[1]) + path('M' + P2(2, b[0]) + ' L' + P2(wd, b[0]) + ' L' + P2(wd - .2, b[0] - b[2] * 1.6) + ' L' + P2(2, b[0] - b[2] * 1.6) + 'Z', '#000', null, null, op(.2)); });
      s += path('M-9 ' + top + ' L9 ' + top + ' L8 ' + (top - 3) + ' L-8 ' + (top - 3) + 'Z', '#1FA3A0') + path('M-6 ' + (top - 3) + ' C-6 ' + (top - 10) + ' 6 ' + (top - 10) + ' 6 ' + (top - 3) + 'Z', '#2F5FD0') + path('M1 ' + (top - 3) + ' C2 ' + (top - 8) + ' 6 ' + (top - 8) + ' 6 ' + (top - 3) + 'Z', '#1E3E9A') + path('M0 ' + (top - 9) + ' L0 ' + (top - 13), null, '#F5C04A', 1) + circ(0, top - 13.5, 1.2, '#F5C04A') + path('M-5 ' + (top - 5) + ' C-5 ' + (top - 7) + ' -3 ' + (top - 8.5) + ' -1 ' + (top - 8.8), null, '#7FA8FF', .8, op(.8));
      return s + path('M-3 -14 L-3 -20 A3 3 0 0 1 3 -20 L3 -14Z', '#5A3A22');
    }
  };
  function decor(id) { return '<g class="deco deco-' + id + '">' + (DECO[id] ? DECO[id]() : '') + '</g>'; }

  /* ---------------------------------------------------------------- garden themes */
  function T(id, cost, name, o) { o.id = id; o.cost = cost; o.name = name; return o; }
  var THEMES = [
    T('bog', 0, L('Meadow', 'Bog‘', 'Луг'), { top: '#3FA35F', top2: '#55BD74', soil: '#9A6B45', soil2: '#B4825A', l: '#7A5234', r: '#5E3E27', tuft: '#86DA9C', bg: ['#3DDC97', '#0E1430'] }),
    T('bahor', 250, L('Spring', 'Bahor', 'Весна'), { top: '#62C76A', top2: '#7FDB85', soil: '#A77650', soil2: '#BE8E65', l: '#7E5637', r: '#62422A', tuft: '#FFC2D6', petals: true, bg: ['#FF9AC1', '#151338'] }),
    T('kuz', 350, L('Autumn', 'Kuz', 'Осень'), { top: '#B9852E', top2: '#D19D42', soil: '#8E5E38', soil2: '#A6714A', l: '#6E4628', r: '#55361E', tuft: '#F0A238', leaves: true, bg: ['#FF9B3D', '#1A1022'] }),
    T('qum', 450, L('Qizilqum desert', 'Qizilqum', 'Кызылкум'), { top: '#E0B46B', top2: '#EEC888', soil: '#C99A58', soil2: '#D9AE6E', l: '#B07E44', r: '#8E6334', tuft: '#9C7A3E', bg: ['#F5C04A', '#1E1424'] }),
    T('qor', 550, L('Chimgan snow', 'Chimyon qori', 'Снег Чимгана'), { top: '#E4EEF7', top2: '#FFFFFF', soil: '#B9C6D4', soil2: '#CED9E4', l: '#8396AB', r: '#677A8F', tuft: '#B7CADB', bg: ['#9FD6FF', '#0C1630'] }),
    T('tun', 800, L('Night garden', 'Tungi bog‘', 'Ночной сад'), { top: '#1F5E4B', top2: '#2A7A61', soil: '#3B3152', soil2: '#4A3F66', l: '#2B2140', r: '#1E1730', tuft: '#E8F56A', glow: true, bg: ['#9B7BFF', '#05060F'] })
  ];
  function theme(id) { return THEMES.filter(function (t) { return t.id === id; })[0] || THEMES[0]; }

  /* an isometric tile: soil sides with a stratum line, a grass top with a lit back edge,
     a gentle shade on the right half and a ragged grass lip over the front edges */
  function tile(x, y, w, kind, depth, th) {
    th = th || THEMES[0];
    var hw = w / 2, hh = w / 4, d = depth == null ? w * .16 : depth, soil = kind === 'soil', top = soil ? [th.soil, th.soil2] : [th.top, th.top2], k;
    var s = path('M' + f(-hw) + ' 0 L0 ' + f(hh) + ' L0 ' + f(hh + d) + ' L' + f(-hw) + ' ' + f(d) + 'Z', th.l) +
      path('M' + f(hw) + ' 0 L0 ' + f(hh) + ' L0 ' + f(hh + d) + ' L' + f(hw) + ' ' + f(d) + 'Z', th.r) +
      path('M' + f(-hw) + ' ' + f(d * .55) + ' L0 ' + f(hh + d * .55) + ' L' + f(hw) + ' ' + f(d * .55), null, '#000', Math.max(.5, d * .08), op(.12)) +
      path('M0 ' + f(-hh) + ' L' + f(hw) + ' 0 L0 ' + f(hh) + ' L' + f(-hw) + ' 0Z', top[0]) +
      path('M0 ' + f(-hh) + ' L' + f(hw) + ' 0 L0 ' + f(hh) + 'Z', '#000', null, null, op(.05)) +
      path('M0 ' + f(-hh) + ' L' + f(hw) + ' 0 L' + f(hw - 3) + ' 0 L0 ' + f(-hh + 1.5) + ' L' + f(-hw + 3) + ' 0 L' + f(-hw) + ' 0Z', top[1]);
    if (!soil) {
      var n = Math.max(5, Math.round(w / 7)), lip = 'M' + f(-hw) + ' 0';
      for (k = 1; k <= n; k++) { var t = k / n; lip += ' L' + P2(-hw + hw * (t - .5 / n), hh * (t - .5 / n) + d * .12 + (k % 2 ? .8 : 0)) + ' L' + P2(-hw + hw * t, hh * t); }
      for (k = 1; k <= n; k++) { var u = k / n; lip += ' L' + P2(hw * (u - .5 / n), hh - hh * (u - .5 / n) + d * .12 + (k % 2 ? .8 : 0)) + ' L' + P2(hw * u, hh - hh * u); }
      s += path(lip + ' L0 ' + f(hh - 1) + 'Z', top[0]);
    } else s += path('M' + f(-hw * .4) + ' ' + f(-hh * .1) + ' L' + f(hw * .2) + ' ' + f(hh * .2) + ' M' + f(-hw * .1) + ' ' + f(-hh * .4) + ' L' + f(hw * .5) + ' ' + f(-hh * .1), null, '#000', .7, op(.12));
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ')">' + s + '</g>';
  }
  function tuft(x, y, th, r) {
    if (th.petals) return ell(x, y, 1.6, .9, r() * 180, '#FFC2D6') + ell(x + 5, y + 2, 1.4, .8, r() * 180, '#FFFFFF', op(.8));
    if (th.leaves) return ell(x, y, 2, 1, r() * 180, r() < .5 ? '#E9822C' : '#C94A1F') + ell(x + 6, y - 1, 1.8, .9, r() * 180, '#F2B531');
    if (th.id === 'qum') return ell(x, y, 2.2, 1.2, 0, '#B48B4A') + ell(x + 5, y + 1, 1.4, .8, 0, '#C89D5A');
    if (th.id === 'qor') return ell(x, y, 2.6, 1.2, 0, '#FFFFFF') + ell(x + 4, y + 1, 1.6, .8, 0, '#DDE8F2');
    if (th.glow) return circ(x, y - 4, 1.2, th.tuft, ' class="ffly" opacity=".9"') + circ(x, y - 4, 3.2, th.tuft, op(.18));
    var c = r() < .3 ? (r() < .5 ? '#FFFFFF' : '#F5D02A') : null;
    return path('M' + f(x) + ' ' + f(y) + ' l-1.2 -4 M' + f(x) + ' ' + f(y) + ' l.2 -5 M' + f(x) + ' ' + f(y) + ' l1.6 -4', null, th.tuft, 1) + (c ? circ(x + .2, y - 5.4, 1.1, c) : '');
  }

  function island(id, p, opt) {
    opt = opt || {}; var th = theme(opt.theme), r = rnd(9);
    var s = '<svg viewBox="-125 -215 250 300" xmlns="http://www.w3.org/2000/svg" class="island" role="img" aria-label="' + (opt.label || id) + '">';
    s += '<ellipse cx="0" cy="62" rx="70" ry="10" fill="#000" opacity=".18"/>' + tile(0, 0, 180, 'grass', 26, th);
    s += '<path d="M-22 18 q22 -10 44 0 q-22 10 -44 0z" fill="' + th.l + '" opacity=".55"/>';
    [[-58, 4], [52, -2], [-30, -22], [36, 20], [-6, 30], [20, -26], [-70, -4], [64, 8]].forEach(function (q) { s += tuft(q[0], q[1], th, r); });
    if (opt.decor) s += '<g transform="translate(-52 6) scale(1.1)">' + decor(opt.decor) + '</g>';
    s += '<g transform="translate(0 18) scale(' + (opt.scale || 1.85) + ')"><ellipse cx="3" cy="2" rx="22" ry="5" fill="#000" opacity=".14"/>' + plant(id, p, opt) + '</g>';
    return s + '</svg>';
  }

  var SCENES = 0;
  /* items: [{species, p, withered, golden, title, seed, id}] · opt: {size, theme, decor:[ids], animate, plantScale, label} */
  function scene(items, opt) {
    opt = opt || {}; var th = theme(opt.theme);
    var n = opt.size || Math.max(4, Math.ceil(Math.sqrt((items.length + (opt.decor || []).length) * 1.25)));
    var tw = 64, th2 = tw / 2, head = 90, Wd = n * tw, H = n * th2 + head + 20;
    var s = '<svg viewBox="' + (-Wd / 2) + ' ' + (-head) + ' ' + Wd + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" class="scene theme-' + th.id + '"' + (opt.label ? ' role="img" aria-label="' + opt.label + '"' : ' aria-hidden="true"') + '>';
    var r = rnd(opt.seed || 11), cells = [], i, j;
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) cells.push([i, j]);
    cells.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]) || a[0] - b[0]; });
    var mid = (n - 1) / 2, order = cells.slice().sort(function (a, b) { var da = Math.abs(a[0] - mid) + Math.abs(a[1] - mid), db = Math.abs(b[0] - mid) + Math.abs(b[1] - mid); return da - db || a[0] - b[0]; });
    var at = {}, used = 0;
    items.slice(0, n * n).forEach(function (it, k) { var c = order[k]; at[c[0] + ',' + c[1]] = it; used = k + 1; });
    var free = order.slice(used).reverse(), dec = (opt.decor || []).slice(0, free.length);
    dec.forEach(function (d, k) { var c = free[Math.floor(k * free.length / Math.max(1, dec.length))]; if (c && !at[c[0] + ',' + c[1]]) at[c[0] + ',' + c[1]] = { decor: d }; });
    /* each distinct plant is drawn once in <defs> and placed with <use>, which keeps big gardens light */
    var tiles = '', top = '', defs = '', syms = {}, pre = 'gp' + (++SCENES) + '-';
    function sym(it, seed) {
      var key = it.species + '|' + (it.withered ? 1 : 0) + '|' + (it.golden ? 1 : 0) + '|' + (seed % 3) + '|' + (it.p == null ? 20 : Math.round(it.p * 20));
      if (!syms[key]) { syms[key] = pre + Object.keys(syms).length; defs += '<g id="' + syms[key] + '">' + plant(it.species, it.p == null ? 1 : it.p, { withered: it.withered, golden: it.golden, seed: seed % 3 + 3 }) + '</g>'; }
      return syms[key];
    }
    cells.forEach(function (c) {
      var x = (c[0] - c[1]) * tw / 2, y = (c[0] + c[1]) * th2 / 2, it = at[c[0] + ',' + c[1]];
      tiles += tile(x, y, tw, it && it.withered ? 'soil' : (!it && r() < .1 ? 'soil' : 'grass'), 9, th);
      if (!it && r() < .4) tiles += tuft(x - 4 + (r() - .5) * 10, y + 2 + (r() - .5) * 4, th, r);
      if (it && it.decor) top += '<g transform="translate(' + f(x) + ' ' + f(y + 2) + ') scale(.78)">' + decor(it.decor) + '</g>';
      else if (it) {
        top += '<g class="pl' + (opt.animate ? ' grow' : '') + '" transform="translate(' + f(x) + ' ' + f(y + 2) + ') scale(' + (opt.plantScale || .62) + ')"' + (it.id ? ' data-id="' + it.id + '"' : '') + ' style="--d:' + (r() * 3).toFixed(2) + 's">' + (it.title ? '<title>' + String(it.title).replace(/[<&]/g, '') + '</title>' : '') +
          '<ellipse cx="3" cy="2" rx="17" ry="4.5" fill="#000" opacity=".16"/><use href="#' + sym(it, it.seed || (c[0] * 31 + c[1] * 7 + 3)) + '" class="plant"/></g>';
      }
    });
    return s + (defs ? '<defs>' + defs + '</defs>' : '') + '<g>' + tiles + '</g><g>' + top + '</g></svg>';
  }
  function name(id, lang) { var sp = SPECIES.filter(function (x) { return x.id === id; })[0]; return sp ? (sp.name[lang] || sp.name.en) : id; }
  function species(id) { return SPECIES.filter(function (x) { return x.id === id; })[0] || SPECIES[0]; }
  /* a viewBox that frames one plant at its full size, so small flowers do not look lost in a card */
  var SMALL = { binafsha: 1, rayhon: 1, qovun: 1, tarvuz: 1, nilufar: 1 }, MID = { lola: 1, paxta: 1, nargiz: 1, qizgaldoq: 1, atirgul: 1, sumbul: 1, oltinlola: 1, yulduzgul: 1, saksovul: 1 };
  function box(id) { return SMALL[id] ? '-40 -62 80 72' : MID[id] ? '-47 -98 94 108' : '-50 -128 100 140'; }

  if (typeof document !== 'undefined' && !document.getElementById('garden-css')) {
    var st = document.createElement('style'); st.id = 'garden-css';
    st.textContent = '.scene .pl>.plant{transform-box:fill-box;transform-origin:50% 100%;animation:gsway 6s ease-in-out infinite;animation-delay:var(--d,0s)}@keyframes gsway{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}' +
      '.scene .pl.grow>.plant{animation:ggrow 1.1s cubic-bezier(.2,.9,.3,1.3) both,gsway 6s ease-in-out 1.1s infinite;animation-delay:var(--d,0s),calc(var(--d,0s) + 1.1s)}@keyframes ggrow{from{transform:scale(0)}}' +
      '.plant .spk{transform-box:fill-box;transform-origin:center;animation:gspk 2.4s ease-in-out infinite}.plant .spk:nth-of-type(2n){animation-delay:.8s}.plant .spk:nth-of-type(3n){animation-delay:1.5s}@keyframes gspk{0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1.15)}}' +
      '.deco .glow{animation:gglow 3s ease-in-out infinite}@keyframes gglow{50%{opacity:.36}}.deco .fly{animation:gfly 5s ease-in-out infinite;animation-delay:var(--fd,0s)}@keyframes gfly{0%,100%{transform:translate(0,0)}25%{transform:translate(6px,-5px)}50%{transform:translate(-3px,-9px)}75%{transform:translate(-7px,-2px)}}' +
      '.ffly{animation:gffly 3.5s ease-in-out infinite}@keyframes gffly{0%,100%{opacity:.2;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}.deco .spray{animation:gspr 1.6s ease-in-out infinite}@keyframes gspr{50%{opacity:.5}}' +
      ':root[data-motion=reduced] .scene .pl>.plant,:root[data-motion=reduced] .plant .spk,:root[data-motion=reduced] .deco *{animation:none!important}@media (prefers-reduced-motion:reduce){.scene .pl>.plant,.plant .spk,.deco *{animation:none!important}}';
    document.head.appendChild(st);
  }

  if (typeof window !== 'undefined') window.Garden = { SPECIES: SPECIES, TIERS: TIERS, DECOR: DECOR, THEMES: THEMES, plant: plant, island: island, scene: scene, tile: tile, decor: decor, theme: theme, name: name, species: species, box: box };
})();
