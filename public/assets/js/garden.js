/* Garden v2: Vaqt plants, decorations and garden themes, drawn as SVG strings. Shared by the site and the app. */
(function () {
  'use strict';
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
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
    S('rayhon', 'common', 40, L('Basil', 'Rayhon', 'Базилик'), L('A clay pot on the windowsill.', 'Deraza tokchasidagi sopol tuvak.', 'Глиняный горшок на подоконнике.')),
    S('kungaboqar', 'common', 80, L('Sunflower', 'Kungaboqar', 'Подсолнух'), L('Always facing the light.', 'Doim yorug‘likka qaraydi.', 'Всегда смотрит на свет.')),
    S('atirgul', 'uncommon', 150, L('Rose', 'Atirgul', 'Роза'), L('A courtyard rose bush.', 'Hovlidagi atirgul butasi.', 'Розовый куст во дворе.')),
    S('anor', 'uncommon', 200, L('Pomegranate', 'Anor', 'Гранат'), L('A small tree with red crowns.', 'Qizil tojli kichik daraxt.', 'Небольшое дерево с красными коронами.')),
    S('olma', 'uncommon', 260, L('Apple', 'Olma', 'Яблоня'), L('Round, red and generous.', 'Yumaloq, qizil va saxiy.', 'Круглая, красная и щедрая.')),
    S('gilos', 'uncommon', 320, L('Cherry', 'Gilos', 'Черешня'), L('Blossoms, then twin cherries.', 'Avval gul, keyin qo‘sh gilos.', 'Сначала цветы, потом парные ягоды.')),
    S('orik', 'rare', 400, L('Apricot', 'O‘rik', 'Урюк'), L('Blossoms first, then fruit.', 'Avval gullaydi, keyin meva beradi.', 'Сначала цветёт, потом плодоносит.')),
    S('bodom', 'rare', 480, L('Almond', 'Bodom', 'Миндаль'), L('The first tree to bloom in spring.', 'Bahorda birinchi gullaydigan daraxt.', 'Первым цветёт весной.')),
    S('uzum', 'rare', 560, L('Grapevine', 'Uzum', 'Виноград'), L('Climbs a courtyard trellis.', 'Hovli so‘risiga chirmashadi.', 'Вьётся по шпалере во дворе.')),
    S('qovun', 'rare', 640, L('Melon', 'Qovun', 'Дыня'), L('Sweet gold from the fields.', 'Daladan kelgan shirin oltin.', 'Сладкое золото с полей.')),
    S('xurmo', 'rare', 720, L('Persimmon', 'Xurmo', 'Хурма'), L('Orange lanterns in autumn.', 'Kuzdagi to‘q sariq chiroqlar.', 'Оранжевые фонарики осени.')),
    S('tut', 'epic', 900, L('Mulberry', 'Tut', 'Шелковица'), L('Wide shade, dark berries.', 'Keng soya, to‘q mevalar.', 'Широкая тень, тёмные ягоды.')),
    S('tol', 'epic', 1050, L('Willow', 'Majnuntol', 'Ива'), L('Hangs over the ariq.', 'Ariq ustiga egilgan.', 'Склоняется над арыком.')),
    S('terak', 'epic', 1200, L('Poplar', 'Terak', 'Тополь'), L('Tall and straight, like a good habit.', 'Yaxshi odat kabi baland va tik.', 'Высокий и прямой, как хорошая привычка.')),
    S('archa', 'epic', 1400, L('Juniper', 'Archa', 'Арча'), L('Mountain evergreen. Patient.', 'Tog‘ archasi. Sabrli.', 'Горный вечнозелёный. Терпеливый.')),
    S('chinor', 'legendary', 2000, L('Plane tree', 'Chinor', 'Чинара'), L('The great tree of the mahalla.', 'Mahallaning ulug‘ daraxti.', 'Великое дерево махалли.')),
    S('oltinlola', 'legendary', 3000, L('Golden tulip', 'Oltin lola', 'Золотой тюльпан'), L('For the truly devoted.', 'Chinakam sodiqlar uchun.', 'Для по-настоящему преданных.')),
    S('yulduzgul', 'legendary', 4000, L('Star flower', 'Yulduzgul', 'Звёздоцвет'), L('Blooms an eight-point star. Rarest of all.', 'Sakkiz qirrali yulduz bo‘lib ochiladi. Eng nodiri.', 'Распускается восьмиконечной звездой. Самый редкий.'))
  ];

  var C = { leaf: '#3DBE7A', leaf2: '#2A9A5F', leafHi: '#86E3AE', dark: '#23784A', trunk: '#8A5A3B', trunk2: '#6B4329' };
  var W = { leaf: '#A68F5B', leaf2: '#86724A', hi: '#C2AE7C', dark: '#6E5C3C', trunk: '#6B5847', trunk2: '#57483B', flower: '#8E6C58', flower2: '#6F5444' };
  function pal(w, o) {
    if (w) return { leaf: W.leaf, leaf2: W.leaf2, hi: W.hi, dark: W.dark, trunk: W.trunk, trunk2: W.trunk2 };
    var p = { leaf: C.leaf, leaf2: C.leaf2, hi: C.leafHi, dark: C.dark, trunk: C.trunk, trunk2: C.trunk2 };
    if (o) for (var k in o) p[k] = o[k];
    return p;
  }
  function wc(w, alive, dead) { return w ? dead || W.flower : alive; }
  function circ(x, y, r, fill, extra) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(Math.max(r, 0)) + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function ell(x, y, rx, ry, rot, fill, extra) { return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(Math.max(rx, 0)) + '" ry="' + f(Math.max(ry, 0)) + '" transform="rotate(' + f(rot) + ' ' + f(x) + ' ' + f(y) + ')" fill="' + fill + '"' + (extra || '') + '/>'; }
  function path(d, fill, stroke, sw, extra) { return '<path d="' + d + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"' : '') + (extra || '') + '/>'; }
  function trunk(h, w, bend, P) {
    var top = -h, b = bend;
    return path('M' + f(-w) + ' 0 C' + f(-w * .8) + ' ' + f(top * .5) + ' ' + f(b - w * .5) + ' ' + f(top * .7) + ' ' + f(b - w * .35) + ' ' + f(top) +
      ' L' + f(b + w * .35) + ' ' + f(top) + ' C' + f(b + w * .5) + ' ' + f(top * .7) + ' ' + f(w * .8) + ' ' + f(top * .5) + ' ' + f(w) + ' 0Z', P.trunk) +
      path('M' + f(w * .15) + ' 0 C' + f(w * .2) + ' ' + f(top * .5) + ' ' + f(b + w * .1) + ' ' + f(top * .7) + ' ' + f(b + w * .2) + ' ' + f(top) + ' L' + f(b + w * .35) + ' ' + f(top) + ' C' + f(b + w * .5) + ' ' + f(top * .7) + ' ' + f(w * .8) + ' ' + f(top * .5) + ' ' + f(w) + ' 0Z', P.trunk2);
  }
  function sprout(s, P) {
    s = clamp(s, 0, 1);
    return path('M0 0 Q1 ' + f(-6 * s) + ' 0 ' + f(-12 * s), null, P.leaf2, 2.2) + ell(-5 * s, -12 * s, 5 * s, 2.4 * s, -25, P.leaf) + ell(5 * s, -13 * s, 5 * s, 2.4 * s, 25, P.leaf2);
  }
  function canopy(cx, cy, R, n, P, r, flat) {
    var out = '', pts = [], k;
    for (k = 0; k < n; k++) { var a = (k / n) * Math.PI * 2 + r() * .5, d = R * (.45 + r() * .35); pts.push([cx + Math.cos(a) * d * (flat || 1), cy + Math.sin(a) * d * .7, R * (.48 + r() * .22)]); }
    out += circ(cx, cy + R * .15, R * .78, P.dark);
    pts.forEach(function (q) { out += circ(q[0], q[1] + R * .08, q[2], P.leaf2); });
    pts.forEach(function (q) { out += circ(q[0] - q[2] * .12, q[1] - q[2] * .12, q[2] * .86, P.leaf); });
    out += circ(cx - R * .35, cy - R * .35, R * .32, P.hi, ' opacity=".55"');
    return out;
  }
  function fruitTree(p, w, r, o) {
    var P = pal(w, o.pal), e = ease(p), h = (o.h0 || 12) + (o.h || 28) * e, out = '';
    out += trunk(h, (o.tw || 3.2) + 2 * e, o.bend || 0, P);
    var cs = ease(seg(p, .15, .85)), R = (o.R || 21) * cs;
    out += canopy(o.bend || 0, -h - R * .45, R, o.n || 7, P, r, o.flat);
    return { s: out, h: h, R: R };
  }
  var DOTS = [[-14, -4], [10, -10], [-5, -20], [4, -1], [-18, -12], [15, -2], [0, -16], [-10, -18], [12, -16], [-2, -8]];
  function place(h, R, i) { var d = DOTS[i % DOTS.length]; return [d[0] * (R / 21), -h + d[1] * (R / 21) - R * .1]; }

  /* ---------------------------------------------------------------- species */
  function lola(p, w, r, gold) {
    var P = pal(w), e = ease(p), h = 8 + 44 * e, bend = w ? 9 : 2, o = '';
    if (p < .1) return sprout(p * 10, P);
    var lf = ease(seg(p, .08, .6));
    o += '<g transform="scale(' + f(lf) + ')">' + path('M0 0 C-11 -6 -17 -18 -15 -31 C-8 -23 -2 -12 0 0Z', P.leaf2) + path('M0 0 C10 -5 16 -15 14 -27 C8 -19 2 -10 0 0Z', P.leaf) + path('M-2 -4 C-7 -10 -11 -18 -12 -26', null, P.hi, 1) + '</g>';
    o += path('M0 0 Q' + f(bend * .3) + ' ' + f(-h * .5) + ' ' + f(bend) + ' ' + f(-h), null, P.leaf2, 2.6);
    var fs = ease(seg(p, .45, .95));
    if (fs > 0) {
      var red = w ? W.flower : gold ? '#F2B630' : '#E5484D', red2 = w ? W.flower2 : gold ? '#B97F12' : '#B8323A', hi = w ? '#A8897A' : gold ? '#FFE7A0' : '#FF8A8E';
      var s = .35 + .65 * fs;
      o += '<g transform="translate(' + f(bend) + ' ' + f(-h) + ') rotate(' + (w ? 38 : 0) + ') scale(' + f(s) + ')">' + path('M-8 2 C-11 -6 -8 -16 0 -19 C8 -16 11 -6 8 2 C4 5 -4 5 -8 2Z', red2) +
        path('M-9 1 C-12 -7 -7 -16 -1 -18 C-2 -10 -3 -3 -1 4 C-5 5 -8 3 -9 1Z', red) + path('M9 1 C12 -7 7 -16 1 -18 C2 -10 3 -3 1 4 C5 5 8 3 9 1Z', red) + path('M-5 -4 C-6 -9 -4 -14 -2 -16', null, hi, 1.6) + '</g>';
    }
    return o;
  }
  function oltinlola(p, w, r) { var s = lola(p, w, r, true); if (!w && p > .6) s += sparkles(2, -52, 20, r); return s; }
  function paxta(p, w, r) {
    var P = pal(w), e = ease(p), h = 8 + 30 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += path('M0 0 Q-1 ' + f(-h * .5) + ' 0 ' + f(-h), null, P.trunk, 2.6);
    var bs = ease(seg(p, .15, .7));
    [[-.45, -14], [-.65, 13], [-.85, -11], [-.95, 9]].forEach(function (b) {
      var y = h * b[0], x2 = b[1] * bs, y2 = y - 8 * bs;
      o += path('M0 ' + f(y) + ' Q' + f(x2 * .5) + ' ' + f(y - 2) + ' ' + f(x2) + ' ' + f(y2), null, P.trunk, 1.8) + circ(x2, y2 + 2, 6.5 * bs, P.leaf2) + circ(x2 - 1.5, y2, 5.5 * bs, P.leaf);
    });
    o += circ(0, -h - 2, 7 * e, P.leaf2) + circ(-1.5, -h - 4, 6 * e, P.leaf);
    var bo = ease(seg(p, .55, 1));
    if (bo > 0) {
      var wh = w ? '#CFC3A8' : '#FBFBF7', sh = w ? '#B1A385' : '#E2E4DE';
      [[-14, -h * .45 - 9], [13, -h * .65 - 9], [-11, -h * .85 - 9], [9, -h * .95 - 9], [0, -h - 8]].forEach(function (q, i) {
        if (i / 5 > bo + .1) return; var s = 3.6 * bo;
        o += path('M' + f(q[0] - 4 * bo) + ' ' + f(q[1] + 3) + ' L' + f(q[0]) + ' ' + f(q[1] + 6 * bo) + ' L' + f(q[0] + 4 * bo) + ' ' + f(q[1] + 3) + 'Z', '#7A5230') +
          circ(q[0] - s * .7, q[1], s, sh) + circ(q[0] + s * .7, q[1], s, sh) + circ(q[0], q[1] - s * .8, s, wh) + circ(q[0] - s * .5, q[1] - s * .2, s * .9, wh);
      });
    }
    return o;
  }
  function rayhon(p, w, r) {
    var P = pal(w, { leaf: '#4CC96B', leaf2: '#2E9E50', hi: '#A5EDB4' }), e = ease(p), o = '';
    o += path('M-13 0 L-15 -14 L15 -14 L13 0Z', w ? '#8A6A55' : '#C4683E') + path('M-16.5 -14 L16.5 -14 L16.5 -18 L-16.5 -18Z', w ? '#9C7B64' : '#D97E50') + path('M3 -2 L13 -2 L13 0 L-13 0 L-13 -2Z', w ? '#715644' : '#A4552F', null, null, ' opacity=".5"') + ell(0, -18, 15, 2.5, 0, '#5A3A26');
    if (p < .1) return o + '<g transform="translate(0 -18)">' + sprout(p * 10, P) + '</g>';
    var s = ease(seg(p, .1, .9)), n = 14;
    for (var k = 0; k < n; k++) {
      var a = (k / n) * Math.PI, rr = 10 * s, x = Math.cos(a) * rr * 1.2, y = -18 - Math.sin(a) * rr * 1.3 - (k % 3) * 2 * s;
      o += ell(x, y, 5 * s, 3.2 * s, (x * 4), k % 2 ? P.leaf2 : P.leaf);
    }
    o += ell(0, -18 - 14 * s, 5 * s, 3.4 * s, 0, P.leaf) + ell(-2, -19 - 14 * s, 2 * s, 1.2 * s, -20, P.hi, ' opacity=".7"');
    var fl = seg(p, .8, 1);
    if (fl > 0) [[-6, -34], [6, -33], [0, -38]].forEach(function (q) { o += path('M' + q[0] + ' ' + f(q[1] + 4) + ' L' + q[0] + ' ' + f(q[1] - 6 * fl), null, wc(w, '#F3F0FF', '#B8AA94'), 2.4); });
    return o;
  }
  function kungaboqar(p, w, r) {
    var P = pal(w), e = ease(p), h = 10 + 56 * e, lean = w ? 12 : 3, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += path('M0 0 Q2 ' + f(-h * .5) + ' ' + f(lean) + ' ' + f(-h), null, P.leaf2, 3.2);
    var ls = ease(seg(p, .1, .7));
    [[-.3, -1], [-.5, 1], [-.72, -1]].forEach(function (b) {
      var y = h * b[0], dx = b[1];
      o += path('M' + f(dx) + ' ' + f(y) + ' C' + f(dx * 10 * ls) + ' ' + f(y - 2) + ' ' + f(dx * 18 * ls) + ' ' + f(y - 8 * ls) + ' ' + f(dx * 16 * ls) + ' ' + f(y - 14 * ls) + ' C' + f(dx * 10 * ls) + ' ' + f(y - 12 * ls) + ' ' + f(dx * 4) + ' ' + f(y - 6 * ls) + ' ' + f(dx) + ' ' + f(y) + 'Z', dx < 0 ? P.leaf : P.leaf2);
    });
    var hs = ease(seg(p, .5, 1));
    if (hs > 0) {
      var cx = lean, cy = -h - 2, R = 13 * hs, pet = w ? '#B89A5A' : '#F7C531', pet2 = w ? '#9A8050' : '#E9A91E';
      var g = '<g transform="translate(' + f(cx) + ' ' + f(cy) + ') rotate(' + (w ? 30 : -8) + ')">';
      for (var k = 0; k < 14; k++) { var a = k / 14 * 360; g += ell(Math.cos(a * Math.PI / 180) * R * .78, Math.sin(a * Math.PI / 180) * R * .78, R * .42, R * .2, a, k % 2 ? pet : pet2); }
      g += circ(0, 0, R * .55, w ? '#5A4636' : '#6B3F1F') + circ(-R * .15, -R * .15, R * .32, w ? '#6E5846' : '#8A5530');
      for (k = 0; k < 6; k++) g += circ(Math.cos(k) * R * .3, Math.sin(k * 1.7) * R * .3, .9, w ? '#7E6A57' : '#3E2410');
      o += g + '</g>';
    }
    return o;
  }
  function atirgul(p, w, r) {
    var P = pal(w, { leaf: '#3B9E5E', leaf2: '#2A7A47', dark: '#1D5A34' }), e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, P);
    var s = ease(seg(p, .1, .8)), R = 16 * s;
    o += path('M-2 0 L-3 -10 M2 0 L4 -12 M0 0 L0 -14', null, P.trunk, 2);
    var pts = [[-11, -12], [10, -13], [0, -20], [-6, -24], [7, -25], [-14, -20], [14, -20], [0, -30]];
    o += ell(0, -18 * s, R * 1.15, R * .95, 0, P.dark);
    pts.forEach(function (q, i) { o += ell(q[0] * s, q[1] * s, 6.5 * s, 4.5 * s, i * 37, i % 2 ? P.leaf2 : P.leaf); });
    var fl = ease(seg(p, .5, 1)), red = w ? W.flower : '#E0245E', red2 = w ? W.flower2 : '#A8123F', hi = w ? '#A8897A' : '#FF7FA6';
    if (fl > 0) [[-9, -20], [8, -22], [0, -31], [-13, -10], [12, -11]].forEach(function (q, i) {
      if (i / 5 > fl + .15) return; var rr = 4.2 * fl;
      o += circ(q[0] * s, q[1] * s, rr, red2) + circ(q[0] * s - .5, q[1] * s - .6, rr * .82, red) + path('M' + f(q[0] * s - rr * .5) + ' ' + f(q[1] * s) + ' a' + f(rr * .5) + ' ' + f(rr * .5) + ' 0 1 1 ' + f(rr * .55) + ' ' + f(rr * .35), null, hi, 1) + circ(q[0] * s, q[1] * s - .4, rr * .25, red2);
    });
    return o;
  }
  function anor(p, w, r) {
    if (p < .1) return sprout(p * 10, pal(w));
    var t = fruitTree(p, w, r, { h0: 10, h: 26, tw: 3, bend: 2, R: 20, n: 6 }), o = t.s, fr = ease(seg(p, .6, 1));
    if (fr > 0) for (var i = 0; i < 5; i++) {
      if (i > fr * 5) break; var q = place(t.h, t.R, i), s = 4.2 * fr, red = wc(w, '#D7263D'), red2 = wc(w, '#A31A2E', W.flower2);
      o += circ(q[0], q[1], s, red2) + circ(q[0] - .6, q[1] - .6, s * .85, red) + path('M' + f(q[0] - 1.6 * fr) + ' ' + f(q[1] - s + .5) + ' l' + f(1.6 * fr) + ' ' + f(-2.6 * fr) + ' l' + f(1.6 * fr) + ' ' + f(2.6 * fr) + 'z', red2);
    }
    return o;
  }
  function olma(p, w, r) {
    if (p < .1) return sprout(p * 10, pal(w));
    var t = fruitTree(p, w, r, { h0: 12, h: 26, tw: 3.4, R: 22, n: 8, pal: { leaf: '#4FBF6A', leaf2: '#349A52', hi: '#9BE6AE', dark: '#22713A' } }), o = t.s, fr = ease(seg(p, .62, 1));
    if (fr > 0) for (var i = 0; i < 7; i++) {
      var q = place(t.h, t.R, i + 1), s = 3.6 * fr;
      o += circ(q[0], q[1], s, wc(w, '#C8203A', W.flower2)) + circ(q[0] - .7, q[1] - .7, s * .8, wc(w, '#EE3B4E')) + circ(q[0] - s * .4, q[1] - s * .4, s * .25, '#FFC2C8', w ? ' opacity="0"' : ' opacity=".8"') + path('M' + f(q[0]) + ' ' + f(q[1] - s) + ' l1 -2', null, '#5A3A20', 1);
    }
    return o;
  }
  function gilos(p, w, r) {
    if (p < .1) return sprout(p * 10, pal(w));
    var t = fruitTree(p, w, r, { h0: 12, h: 28, tw: 3.2, bend: -1, R: 21, n: 7, pal: { leaf: '#46B467', leaf2: '#2F8F4E', dark: '#1F6337' } }), o = t.s;
    var bl = seg(p, .4, .72) * (1 - seg(p, .78, .95)), fr = ease(seg(p, .75, 1)), i;
    if (bl > 0) for (i = 0; i < 10; i++) { var q = place(t.h, t.R, i); o += circ(q[0] + 2, q[1] - 2, 2.6 * bl, wc(w, '#FFE4EE', '#C9B7A6')) + circ(q[0] + 2, q[1] - 2, 1 * bl, wc(w, '#F7A3C0', '#9F8C7A')); }
    if (fr > 0) for (i = 0; i < 5; i++) {
      var q2 = place(t.h, t.R, i * 2 + 1), s = 2.6 * fr;
      o += path('M' + f(q2[0] - 2) + ' ' + f(q2[1]) + ' Q' + f(q2[0]) + ' ' + f(q2[1] - 7) + ' ' + f(q2[0] + 2) + ' ' + f(q2[1]), null, '#4A6A2A', .9) + circ(q2[0] - 2, q2[1] + 1, s, wc(w, '#9E0F2A', W.flower2)) + circ(q2[0] + 2.4, q2[1] + 1.5, s, wc(w, '#C41E3A')) + circ(q2[0] - 2.8, q2[1], s * .3, '#FF9AAA', w ? ' opacity="0"' : '');
    }
    return o;
  }
  function orik(p, w, r) {
    if (p < .1) return sprout(p * 10, pal(w));
    var t = fruitTree(p, w, r, { h0: 14, h: 30, tw: 3.2, bend: -2, R: 22, n: 7, pal: { leaf: '#58C27D', leaf2: '#3FA163', hi: '#A6EBC0', dark: '#2E7F4B' } }), o = t.s;
    var bl = seg(p, .45, .75) * (1 - seg(p, .85, 1) * .6), fr = ease(seg(p, .75, 1));
    for (var i = 0; i < 8; i++) {
      var q = place(t.h, t.R, i);
      if (bl > 0 && i % 2 === 0) o += circ(q[0] + 3, q[1] - 3, 2.2 * bl, wc(w, '#FFE1EA', '#C9B7A6')) + circ(q[0] + 3, q[1] - 3, .9 * bl, wc(w, '#F59AB4', '#9F8C7A'));
      if (fr > 0 && i < 6) o += circ(q[0], q[1], 3.4 * fr, wc(w, '#F08A24', '#9C7B52')) + circ(q[0] - .8, q[1] - .8, 2.4 * fr, wc(w, '#FDB352', '#B39465'));
    }
    return o;
  }
  function bodom(p, w, r) {
    var P = pal(w, { trunk: '#5E4433', trunk2: '#463224' }), e = ease(p), h = 12 + 24 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += trunk(h, 2.8 + 1.6 * e, 1, P);
    var bs = ease(seg(p, .15, .7)), br = [[1, -h, -16, -h - 16], [1, -h, 15, -h - 18], [1, -h, -2, -h - 24], [-4, -h - 8 * bs, -22, -h - 4], [6, -h - 9 * bs, 22, -h - 6]];
    br.forEach(function (b) { o += path('M' + f(b[0]) + ' ' + f(b[1]) + ' Q' + f((b[0] + b[2]) / 2) + ' ' + f(b[3] + 6) + ' ' + f(b[0] + (b[2] - b[0]) * bs) + ' ' + f(b[1] + (b[3] - b[1]) * bs), null, P.trunk, 2); });
    var bl = ease(seg(p, .35, 1)), n = Math.round(26 * bl), rr = r;
    for (var i = 0; i < n; i++) {
      var b = br[i % br.length], u = .45 + rr() * .55, x = b[0] + (b[2] - b[0]) * u * bs + (rr() - .5) * 6, y = b[1] + (b[3] - b[1]) * u * bs + (rr() - .5) * 6;
      o += circ(x, y, 2.6, wc(w, i % 3 ? '#FFF1F5' : '#FFD3E1', '#C9B7A6')) + circ(x, y, .9, wc(w, '#E86A92', '#9F8C7A'));
    }
    if (!w && bl > .6) for (i = 0; i < 3; i++) o += ell(-18 + i * 14, -6 - i * 3, 1.6, .9, 30 * i, '#FFD3E1', ' opacity=".8"');
    return o;
  }
  function uzum(p, w, r) {
    var P = pal(w), e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, P);
    var wood = w ? '#6B5847' : '#9B6A44', wood2 = w ? '#57483B' : '#7A5233';
    o += path('M-20 0 L-20 -46', null, wood2, 3.4) + path('M20 0 L20 -46', null, wood2, 3.4) + path('M-24 -46 Q0 -60 24 -46', null, wood, 3.2) + path('M-20 -30 L20 -30', null, wood, 1.6);
    var vs = ease(seg(p, .1, .8));
    o += path('M0 0 C-2 -12 -14 -18 -18 -' + f(30 * vs) + (vs > .5 ? ' C-16 -44 -6 -52 0 -' + f(52 * vs) + ' C8 -52 16 -46 18 -' + f(40 * vs) : ''), null, P.trunk, 2.6);
    [[-6, -10], [-15, -22], [-18, -36], [-8, -50], [6, -52], [16, -44], [12, -30]].forEach(function (q, i) { var s = clamp(vs * 7 - i, 0, 1); if (s <= 0) return; o += circ(q[0], q[1], 6 * s, P.leaf2) + circ(q[0] - 1, q[1] - 1, 5 * s, P.leaf); });
    var gr = ease(seg(p, .6, 1));
    if (gr > 0) {
      var g1 = w ? '#7D6A5A' : '#6B3FA0', g2 = w ? '#9A8573' : '#8E5BD0';
      [[-12, -40], [8, -44], [0, -30]].forEach(function (q) { var s = 2.4 * gr; [[0, 0], [-1, 1], [1, 1], [-2, 2], [0, 2], [2, 2], [-1, 3], [1, 3], [0, 4]].forEach(function (d) { o += circ(q[0] + d[0] * s * .95, q[1] + d[1] * s * .95, s, g1) + circ(q[0] + d[0] * s * .95 - .5, q[1] + d[1] * s * .95 - .5, s * .55, g2); }); });
    }
    return o;
  }
  function qovun(p, w, r) {
    var P = pal(w, { leaf: '#5CC46F', leaf2: '#3C9B52' }), e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, P);
    var vs = ease(seg(p, .1, .7));
    o += path('M0 0 C-10 2 -18 -2 -' + f(26 * vs) + ' 2 M0 0 C10 -2 18 2 ' + f(24 * vs) + ' -3', null, P.leaf2, 2);
    [[-8, -3], [-18, 0], [-24, -2], [9, -5], [17, -2], [22, -6], [0, -6]].forEach(function (q, i) { var s = clamp(vs * 7 - i, 0, 1); if (s <= 0) return; o += ell(q[0], q[1] - 3 * s, 6 * s, 4 * s, i * 25, i % 2 ? P.leaf : P.leaf2) + path('M' + q[0] + ' ' + f(q[1] - 3 * s) + ' l' + f(3 * s) + ' ' + f(-2 * s), null, P.hi, .8, ' opacity=".6"'); });
    var m = ease(seg(p, .45, 1));
    if (m > 0) {
      var cx = 4, cy = -8 * m, rx = 13 * m, ry = 9 * m, c1 = wc(w, '#E7C34C', '#A8946A'), c2 = wc(w, '#C99A2C', '#8D7A55');
      o += ell(cx, cy + 1, rx, ry, -8, c2) + ell(cx - 1, cy, rx * .94, ry * .9, -8, c1);
      for (var k = -2; k <= 2; k++) o += path('M' + f(cx + k * rx * .3) + ' ' + f(cy - ry * .85) + ' Q' + f(cx + k * rx * .42) + ' ' + f(cy) + ' ' + f(cx + k * rx * .3) + ' ' + f(cy + ry * .85), null, c2, .8, ' opacity=".7"');
      o += ell(cx - rx * .4, cy - ry * .4, rx * .25, ry * .18, -20, '#FFF3C4', w ? ' opacity="0"' : ' opacity=".7"');
      if (m > .8) o += ell(-16, -4, 6 * m, 4.5 * m, 10, c2) + ell(-16.5, -4.5, 5.5 * m, 4 * m, 10, c1);
    }
    return o;
  }
  function xurmo(p, w, r) {
    if (p < .1) return sprout(p * 10, pal(w));
    var aut = seg(p, .5, 1);
    var t = fruitTree(p, w, r, { h0: 13, h: 27, tw: 3, bend: 1, R: 20, n: 6, flat: 1.15, pal: { leaf: aut > .5 ? '#7FAE44' : '#4DB46A', leaf2: aut > .5 ? '#5E8A2E' : '#348F50', hi: '#C9E58F', dark: '#3D6A28' } }), o = t.s;
    var fr = ease(seg(p, .6, 1));
    if (!w && aut > .3) for (var j = 0; j < 6; j++) { var q0 = place(t.h, t.R, j + 3); o += ell(q0[0] + 4, q0[1] + 2, 3, 1.8, j * 40, j % 2 ? '#E9822C' : '#D2591F', ' opacity=".9"'); }
    if (fr > 0) for (var i = 0; i < 6; i++) {
      var q = place(t.h, t.R, i), s = 3.8 * fr;
      o += circ(q[0], q[1], s, wc(w, '#E0661C', W.flower2)) + circ(q[0] - .7, q[1] - .7, s * .8, wc(w, '#FF8B2B')) + path('M' + f(q[0] - 2.4) + ' ' + f(q[1] - s + .8) + ' L' + f(q[0]) + ' ' + f(q[1] - s - 1.5) + ' L' + f(q[0] + 2.4) + ' ' + f(q[1] - s + .8) + 'Z', '#3F6B2A');
    }
    return o;
  }
  function tut(p, w, r) {
    if (p < .1) return sprout(p * 10, pal(w));
    var t = fruitTree(p, w, r, { h0: 12, h: 28, tw: 4, bend: 1, R: 22, n: 8, flat: 1.45, pal: { leaf: '#3A9C5E', leaf2: '#2B7F4A', hi: '#7FD3A0', dark: '#1F5F37', trunk: '#7A5136', trunk2: '#5E3D28' } }), o = t.s, fr = ease(seg(p, .65, 1));
    if (fr > 0) [[-22, 2], [-10, -6], [6, -12], [20, 0], [-2, -2], [14, -8], [-16, -10]].forEach(function (d) { var q = [d[0], -t.h + d[1]]; o += circ(q[0], q[1], 2.2 * fr, wc(w, '#4A1F4E', '#6A5545')) + circ(q[0] + 2, q[1] + 1.5, 1.9 * fr, wc(w, '#6E2F74', '#7E6957')) + circ(q[0] - 1.5, q[1] + 2, 1.7 * fr, wc(w, '#5B2A5E', '#7E6957')); });
    return o;
  }
  function tol(p, w, r) {
    var P = pal(w, { leaf: '#8BD06A', leaf2: '#5FAE4A', hi: '#C7F0A8', dark: '#3E8A3A' }), e = ease(p), h = 14 + 30 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += trunk(h, 3.6 + 2.2 * e, -2, P);
    var cs = ease(seg(p, .15, .9)), R = 24 * cs, top = -h - R * .35;
    o += ell(-2, top, R, R * .55, 0, P.dark);
    for (var k = 0; k < 15; k++) {
      var x = -2 - R + (k / 14) * R * 2, len = (18 + (k % 4) * 6) * cs + (Math.abs(x) < R * .5 ? 10 * cs : 0), sway = (k % 2 ? 3 : -3) * cs;
      o += path('M' + f(x) + ' ' + f(top - R * .2) + ' Q' + f(x + sway) + ' ' + f(top + len * .5) + ' ' + f(x + sway * .5) + ' ' + f(top + len), null, k % 3 ? P.leaf : P.leaf2, 2.6);
    }
    o += ell(-2, top - R * .2, R * .85, R * .32, 0, P.leaf) + ell(-8, top - R * .32, R * .35, R * .12, -8, P.hi, ' opacity=".6"');
    return o;
  }
  function terak(p, w, r) {
    var P = pal(w, { leaf: '#5DBE73', leaf2: '#3F9A57', hi: '#A8E8B6', dark: '#2A7040', trunk: '#B9AE9A', trunk2: '#968B78' }), e = ease(p), h = 10 + 16 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += trunk(h, 2.6 + 1.2 * e, 0, P);
    var cs = ease(seg(p, .12, .95)), H = 76 * cs, Wd = 11 * cs;
    o += ell(0, -h - H * .45, Wd * 1.05, H * .55, 0, P.dark);
    for (var k = 0; k < 7; k++) { var y = -h - H * (.12 + k * .13), wd = Wd * (1 - Math.abs(k - 2.5) * .12); o += ell(k % 2 ? 2 : -2, y, wd, H * .1, 0, k % 2 ? P.leaf2 : P.leaf); }
    o += ell(-4, -h - H * .6, Wd * .3, H * .25, -4, P.hi, ' opacity=".45"');
    return o;
  }
  function archa(p, w, r) {
    var e = ease(p), h = 16 + 64 * e, o = '';
    var P = w ? pal(true) : { leaf: '#2C9A86', leaf2: '#1F7466', hi: '#6ED3BE', dark: '#145448', trunk: C.trunk, trunk2: C.trunk2 };
    if (p < .1) return sprout(p * 10, P);
    o += path('M-3 0 L-2 -10 L2 -10 L3 0Z', P.trunk);
    for (var k = 0; k < 4; k++) {
      var t = k / 4, ts = clamp(e * 4 - k + .6, 0, 1); if (ts <= 0) continue;
      var y0 = -8 - (h - 10) * t * .78, wdt = (20 - k * 3.6) * ts, ht = (h * .42) * ts;
      o += path('M' + f(-wdt) + ' ' + f(y0) + ' L0 ' + f(y0 - ht) + ' L' + f(wdt) + ' ' + f(y0) + ' Q0 ' + f(y0 + 4) + ' ' + f(-wdt) + ' ' + f(y0) + 'Z', P.leaf2) +
        path('M' + f(-wdt) + ' ' + f(y0) + ' L0 ' + f(y0 - ht) + ' L0 ' + f(y0 + 2) + ' Q' + f(-wdt * .5) + ' ' + f(y0 + 2) + ' ' + f(-wdt) + ' ' + f(y0) + 'Z', P.leaf) +
        path('M' + f(-wdt * .55) + ' ' + f(y0 - ht * .35) + ' L' + f(-wdt * .2) + ' ' + f(y0 - ht * .75), null, P.hi, 1.2);
    }
    return o;
  }
  function chinor(p, w, r) {
    var P = pal(w, { leaf: '#47A869', leaf2: '#327F4F', hi: '#8FE0AA', dark: '#22603A', trunk: '#A07B5A', trunk2: '#7D5E44' }), e = ease(p), h = 16 + 40 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    var tw = 5 + 4 * e;
    o += path('M' + f(-tw - 5) + ' 0 Q' + f(-tw) + ' -4 ' + f(-tw) + ' -10 L' + f(tw) + ' -10 Q' + f(tw) + ' -4 ' + f(tw + 5) + ' 0Z', P.trunk2) + trunk(h, tw, 0, P);
    o += path('M0 ' + f(-h * .7) + ' Q-10 ' + f(-h * .85) + ' -16 ' + f(-h * 1.02), null, P.trunk, 3) + path('M0 ' + f(-h * .75) + ' Q10 ' + f(-h * .9) + ' 17 ' + f(-h * 1.05), null, P.trunk, 3);
    var cs = ease(seg(p, .12, .9)), R = 34 * cs;
    o += canopy(0, -h - R * .35, R, 10, P, r, 1.25);
    if (!w && cs > .6) for (var k = 0; k < 6; k++) o += circ(-R * .9 + r() * R * 1.8, -h - R * .2 - r() * R * .8, 1.2, '#C9F2D6', ' opacity=".7"');
    return o;
  }
  function yulduzgul(p, w, r) {
    var P = pal(w, { leaf: '#5FD0A0', leaf2: '#36A37A', hi: '#B8F5DC' }), e = ease(p), h = 10 + 46 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += path('M0 0 C-3 ' + f(-h * .3) + ' 3 ' + f(-h * .6) + ' 0 ' + f(-h), null, P.leaf2, 2.6);
    var ls = ease(seg(p, .1, .6));
    o += ell(-7 * ls, -h * .35, 8 * ls, 3 * ls, -30, P.leaf) + ell(7 * ls, -h * .55, 8 * ls, 3 * ls, 30, P.leaf2) + ell(-6 * ls, -h * .72, 6 * ls, 2.4 * ls, -35, P.leaf);
    var fs = ease(seg(p, .5, 1));
    if (fs > 0) {
      var R = 13 * fs, cx = 0, cy = -h - 4, rIn = R * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8), pts = [];
      for (var k = 0; k < 16; k++) { var a = -Math.PI / 2 + k * Math.PI / 8, rr = k % 2 ? rIn : R; pts.push(f(cx + Math.cos(a) * rr) + ' ' + f(cy + Math.sin(a) * rr)); }
      var c1 = w ? '#8F7C9A' : '#8B6CFF', c2 = w ? '#6E5E78' : '#5B7CFF';
      if (!w) o += circ(cx, cy, R * 2.1, '#9B7BFF', ' opacity=".18"') + circ(cx, cy, R * 1.4, '#9B7BFF', ' opacity=".22"');
      o += path('M' + pts.join(' L') + 'Z', c2) + '<g transform="translate(' + f(-1) + ' ' + f(-1) + ')">' + path('M' + pts.join(' L') + 'Z', c1) + '</g>' + circ(cx, cy, R * .38, w ? '#B8A98A' : '#F5C04A') + circ(cx - R * .12, cy - R * .12, R * .14, '#FFF3C8', w ? ' opacity="0"' : '');
      if (!w) o += '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(R * 1.7) + '" ry="' + f(R * .5) + '" transform="rotate(-20 ' + f(cx) + ' ' + f(cy) + ')" fill="none" stroke="#C8B6FF" stroke-width=".9" opacity=".8"/>' + circ(cx + R * 1.55, cy - R * .55, 1.8, '#F5C04A');
    }
    return o;
  }
  function sparkles(x, y, spread, r) {
    var s = '';
    for (var i = 0; i < 4; i++) { var px = x + (r() - .5) * spread * 2, py = y + (r() - .5) * spread * 1.4, k = 1.6 + r() * 1.8; s += path('M' + f(px) + ' ' + f(py - k * 2) + ' L' + f(px + k * .5) + ' ' + f(py - k * .5) + ' L' + f(px + k * 2) + ' ' + f(py) + ' L' + f(px + k * .5) + ' ' + f(py + k * .5) + ' L' + f(px) + ' ' + f(py + k * 2) + ' L' + f(px - k * .5) + ' ' + f(py + k * .5) + ' L' + f(px - k * 2) + ' ' + f(py) + ' L' + f(px - k * .5) + ' ' + f(py - k * .5) + 'Z', '#FFF6CF', null, null, ' class="spk"'); }
    return s;
  }

  var DRAW = { lola: lola, paxta: paxta, rayhon: rayhon, kungaboqar: kungaboqar, atirgul: atirgul, anor: anor, olma: olma, gilos: gilos, orik: orik, bodom: bodom, uzum: uzum, qovun: qovun, xurmo: xurmo, tut: tut, tol: tol, terak: terak, archa: archa, chinor: chinor, oltinlola: oltinlola, yulduzgul: yulduzgul };

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
    opt = opt || {};
    var r = rnd(opt.seed || 7), fn = DRAW[id] || lola, inner = fn(clamp(p, 0, 1), !!opt.withered, r);
    if (opt.golden && !opt.withered) inner = goldify(inner) + (p > .6 ? sparkles(0, -40, 22, rnd((opt.seed || 7) + 3)) : '');
    return '<g class="plant' + (opt.withered ? ' withered' : '') + (opt.golden ? ' golden' : '') + '">' + inner + '</g>';
  }

  /* ---------------------------------------------------------------- decorations (base at 0,0) */
  function D(id, cost, name) { return { id: id, cost: cost, name: name }; }
  var DECOR = [
    D('tosh', 30, L('Stones', 'Toshlar', 'Камни')), D('yol', 40, L('Stone path', 'Tosh yo‘lak', 'Каменная дорожка')), D('koza', 80, L('Clay jug', 'Ko‘za', 'Глиняный кувшин')),
    D('fonus', 90, L('Lantern', 'Fonus', 'Фонарь')), D('qushuya', 150, L('Birdhouse', 'Qush uyasi', 'Скворечник')), D('ari', 180, L('Beehive', 'Ari uyasi', 'Улей')),
    D('orindiq', 200, L('Bench', 'O‘rindiq', 'Скамейка')), D('gulxan', 240, L('Fire pit', 'Gulxan', 'Костёр')), D('kapalak', 280, L('Butterflies', 'Kapalaklar', 'Бабочки')),
    D('supa', 360, L('Tapchan', 'So‘ri', 'Топчан')), D('favvora', 480, L('Fountain', 'Favvora', 'Фонтан')), D('hovuz', 600, L('Pond', 'Hovuz', 'Пруд'))
  ];
  function isoBox(x, y, w, d, h, top, left, right) {
    var a = [x, y], b = [x + w, y + w / 2], c = [x + w - d, y + w / 2 + d / 2], dd = [x - d, y + d / 2];
    function P2(q, dy) { return f(q[0]) + ' ' + f(q[1] + (dy || 0)); }
    return path('M' + P2(dd) + ' L' + P2(c) + ' L' + P2(c, h) + ' L' + P2(dd, h) + 'Z', left) + path('M' + P2(c) + ' L' + P2(b) + ' L' + P2(b, h) + ' L' + P2(c, h) + 'Z', right) + path('M' + P2(a) + ' L' + P2(b) + ' L' + P2(c) + ' L' + P2(dd) + 'Z', top);
  }
  var DECO = {
    tosh: function () { return ell(-8, -2, 7, 4.5, -10, '#7D8396') + ell(-9, -3.5, 6, 3.5, -10, '#A3A9BC') + ell(6, 2, 5, 3.2, 15, '#6E7486') + ell(5.5, 1, 4.2, 2.6, 15, '#959BAE') + ell(0, -8, 3.6, 2.3, 0, '#8C92A5'); },
    yol: function () { var s = ''; [[-14, 0], [-4, 4], [6, 1], [14, -3], [-6, -5], [4, -8]].forEach(function (q, i) { s += ell(q[0], q[1] + 1, 5.5, 2.8, 0, '#6F7486') + ell(q[0], q[1], 5.2, 2.6, 0, i % 2 ? '#B9BDCB' : '#A6ABBB'); }); return s; },
    koza: function () { return ell(0, 1, 9, 3, 0, '#000', ' opacity=".15"') + path('M-7 0 C-12 -8 -10 -18 -5 -21 L-4 -26 L4 -26 L5 -21 C10 -18 12 -8 7 0Z', '#B85C34') + path('M0 0 C5 -1 10 -8 7 -16 C10 -10 8 -3 0 0Z', '#8F4224') + ell(0, -26, 4.5, 1.6, 0, '#6E3018') + path('M5 -22 C11 -22 12 -14 7 -12', null, '#B85C34', 2) + path('M-6 -10 C-6 -14 -5 -17 -3 -19', null, '#E18A5E', 1.6); },
    fonus: function () { return ell(0, 0, 7, 2.5, 0, '#000', ' opacity=".15"') + path('M-1.5 0 L-1.5 -34 L1.5 -34 L1.5 0Z', '#3A3F52') + path('M1.5 -34 L10 -34', null, '#3A3F52', 2) + path('M10 -34 L10 -31', null, '#3A3F52', 1.2) + circ(10, -24, 11, '#FFC75A', ' class="glow" opacity=".22"') + path('M6 -31 L14 -31 L13 -18 L7 -18Z', '#FFD36B') + path('M6 -31 L14 -31 L13 -18 L7 -18Z', 'none', '#7A5A2A', 1) + path('M5 -32 L15 -32 L13 -30 L7 -30Z', '#7A5A2A') + circ(10, -24.5, 2.2, '#FFF6CF'); },
    qushuya: function () { return path('M-1.5 0 L-1.5 -28 L1.5 -28 L1.5 0Z', '#7A5233') + path('M-8 -28 L0 -40 L8 -28Z', '#C0392B') + path('M-7 -28 L7 -28 L7 -16 L-7 -16Z', '#E8C489') + path('M0 -28 L7 -28 L7 -16 L0 -16Z', '#D4AE73') + circ(0, -23, 2.6, '#4A2F1E') + path('M-3 -18 L-6 -18', null, '#7A5233', 1.4); },
    ari: function () { var s = isoBox(-10, -4, 20, 10, 4, '#8A6A45', '#6E5233', '#5A422A'); [0, 1, 2].forEach(function (i) { var y = -12 - i * 7, w = 12 - i * 2; s += ell(0, y + 4, w, 3.6, 0, '#C8902A') + ell(0, y + 1, w, 4, 0, i % 2 ? '#F2B531' : '#E8A825'); }); return s + ell(0, -31, 5, 3, 0, '#E8A825') + circ(-2, -12, 1.6, '#3A2A10') + circ(8, -26, 1.4, '#222') + ell(9, -27.5, 1.6, .9, -30, '#fff', ' opacity=".8"'); },
    orindiq: function () { return isoBox(-16, -6, 24, 9, 3, '#C88B4E', '#9A6636', '#7E522B') + path('M-15 -2 L-15 5 M7 9 L7 15 M-6 1 L-6 7', null, '#5E3D22', 2) + path('M-16 -6 L8 6 L8 -6 L-16 -18Z', '#B57A42') + path('M-16 -18 L8 -6', null, '#8A5A2F', 1.2); },
    gulxan: function () { var s = ''; for (var k = 0; k < 9; k++) { var a = k / 9 * Math.PI * 2; s += ell(Math.cos(a) * 11, Math.sin(a) * 5.5, 3.4, 2.2, 0, k % 2 ? '#7D8396' : '#9AA0B2'); } return circ(0, -8, 16, '#FF9B3D', ' class="glow" opacity=".18"') + s + path('M-6 0 C-8 -8 -2 -10 -3 -18 C2 -12 4 -14 3 -22 C9 -14 9 -6 6 0Z', '#F26A1B') + path('M-3 0 C-4 -6 0 -7 0 -13 C3 -8 5 -6 3 0Z', '#FFC233') + path('M-8 1 L8 -2', null, '#5E3D22', 2.4); },
    kapalak: function () { var s = ''; [[-10, -30, '#F5C04A', '#E08A1E'], [8, -40, '#9B7BFF', '#6A45E0'], [2, -22, '#FF7FA6', '#D22A50']].forEach(function (b, i) { s += '<g class="fly" style="--fd:' + (i * .7) + 's"><g transform="translate(' + b[0] + ' ' + b[1] + ')">' + ell(-3, -1, 3.4, 2.4, -30, b[2]) + ell(3, -1, 3.4, 2.4, 30, b[2]) + ell(-2.2, 2, 2.2, 1.6, 20, b[3]) + ell(2.2, 2, 2.2, 1.6, -20, b[3]) + path('M0 -2 L0 3', null, '#2A2235', 1) + '</g></g>'; }); return s; },
    supa: function () { return isoBox(-20, -10, 30, 18, 6, '#B23A3A', '#8A6A45', '#6E5233') + path('M-20 -10 L10 5 L-8 14 L-38 -1Z', '#B23A3A') + path('M-16 -9 L8 3 L-7 10.5 L-31 -1.5Z', 'none', '#F5C04A', 1.2) + path('M-38 -1 L-38 4 M-8 14 L-8 19 M10 5 L10 10', null, '#5E3D22', 2.2) + ell(-12, -2, 6, 3, 0, '#7A5233') + ell(-12, -4, 5.5, 2.6, 0, '#9B6A44') + path('M-13 -5 C-14 -10 -10 -10 -10 -7 L-9 -5Z', '#2F6FD6') + ell(-11.5, -9.5, 2.2, 1, 0, '#2F6FD6') + path('M-8 -8 L-5 -9', null, '#2F6FD6', 1.2) + circ(-16, -4, 1.6, '#F5C04A'); },
    favvora: function () { return ell(0, 0, 20, 9, 0, '#000', ' opacity=".15"') + ell(0, -3, 19, 8.5, 0, '#8C92A5') + ell(0, -5, 19, 8.5, 0, '#B9BDCB') + ell(0, -5.5, 16, 7, 0, '#3E9BE0') + ell(-4, -7, 6, 2, 0, '#9FD6FF', ' opacity=".7"') + path('M-3 -6 L-2 -20 L2 -20 L3 -6Z', '#A6ABBB') + ell(0, -20, 8, 3.4, 0, '#B9BDCB') + ell(0, -20.6, 6.6, 2.7, 0, '#4FAEF0') + path('M0 -21 C-1 -28 1 -30 0 -33 M0 -22 C-5 -26 -7 -24 -8 -19 M0 -22 C5 -26 7 -24 8 -19', null, '#BEE6FF', 1.4, ' class="spray"'); },
    hovuz: function () { return ell(0, 0, 26, 12, 0, '#6E7486') + ell(0, -1, 24.5, 11, 0, '#2E86C9') + ell(-6, -3, 12, 4, 0, '#5FB3EE', ' opacity=".6"') + ell(8, 2, 5, 2.4, 15, '#3FA35F') + path('M8 2 L12 1', null, '#2E86C9', 1) + ell(-12, 3, 4, 2, -10, '#3FA35F') + circ(-11, 1.6, 1.6, '#FF8AB3') + ell(14, -5, 3, 1.5, 0, '#3FA35F'); }
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

  function tile(x, y, w, kind, depth, th) {
    th = th || THEMES[0];
    var hw = w / 2, hh = w / 4, d = depth == null ? w * .16 : depth;
    var top = kind === 'soil' ? [th.soil, th.soil2] : [th.top, th.top2];
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ')">' +
      path('M' + f(-hw) + ' 0 L0 ' + f(hh) + ' L0 ' + f(hh + d) + ' L' + f(-hw) + ' ' + f(d) + 'Z', th.l) +
      path('M' + f(hw) + ' 0 L0 ' + f(hh) + ' L0 ' + f(hh + d) + ' L' + f(hw) + ' ' + f(d) + 'Z', th.r) +
      path('M0 ' + f(-hh) + ' L' + f(hw) + ' 0 L0 ' + f(hh) + ' L' + f(-hw) + ' 0Z', top[0]) +
      path('M0 ' + f(-hh) + ' L' + f(hw) + ' 0 L' + f(hw - 3) + ' 0 L0 ' + f(-hh + 1.5) + ' L' + f(-hw + 3) + ' 0 L' + f(-hw) + ' 0Z', top[1]) + '</g>';
  }
  function tuft(x, y, th, r) {
    if (th.petals) return ell(x, y, 1.6, .9, r() * 180, '#FFC2D6') + ell(x + 5, y + 2, 1.4, .8, r() * 180, '#FFFFFF', ' opacity=".8"');
    if (th.leaves) return ell(x, y, 2, 1, r() * 180, r() < .5 ? '#E9822C' : '#C94A1F') + ell(x + 6, y - 1, 1.8, .9, r() * 180, '#F2B531');
    if (th.id === 'qum') return ell(x, y, 2.2, 1.2, 0, '#B48B4A') + ell(x + 5, y + 1, 1.4, .8, 0, '#C89D5A');
    if (th.id === 'qor') return ell(x, y, 2.6, 1.2, 0, '#FFFFFF') + ell(x + 4, y + 1, 1.6, .8, 0, '#DDE8F2');
    if (th.glow) return circ(x, y - 4, 1.2, th.tuft, ' class="ffly" opacity=".9"') + circ(x, y - 4, 3.2, th.tuft, ' opacity=".18"');
    return path('M' + f(x) + ' ' + f(y) + ' l-1 -4 M' + f(x) + ' ' + f(y) + ' l1.5 -4.5', null, th.tuft, 1.2);
  }

  function island(id, p, opt) {
    opt = opt || {}; var th = theme(opt.theme), r = rnd(9);
    var s = '<svg viewBox="-125 -215 250 300" xmlns="http://www.w3.org/2000/svg" class="island" role="img" aria-label="' + (opt.label || id) + '">';
    s += '<ellipse cx="0" cy="62" rx="70" ry="10" fill="#000" opacity=".18"/>' + tile(0, 0, 180, 'grass', 26, th);
    s += '<path d="M-22 18 q22 -10 44 0 q-22 10 -44 0z" fill="' + th.l + '" opacity=".55"/>';
    [[-58, 4], [52, -2], [-30, -22], [36, 20], [-6, 30], [20, -26]].forEach(function (q) { s += tuft(q[0], q[1], th, r); });
    if (opt.decor) s += '<g transform="translate(-52 6) scale(1.1)">' + decor(opt.decor) + '</g>';
    s += '<g transform="translate(0 18) scale(' + (opt.scale || 2.05) + ')">' + plant(id, p, opt) + '</g>';
    return s + '</svg>';
  }

  /* items: [{species, p, withered, golden, title, seed, id}] · opt: {size, theme, decor:[ids], animate, plantScale, label} */
  function scene(items, opt) {
    opt = opt || {}; var th = theme(opt.theme);
    var n = opt.size || Math.max(4, Math.ceil(Math.sqrt((items.length + (opt.decor || []).length) * 1.25)));
    var tw = 64, th2 = tw / 2, head = 84, Wd = n * tw, H = n * th2 + head + 20;
    var s = '<svg viewBox="' + (-Wd / 2) + ' ' + (-head) + ' ' + Wd + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" class="scene theme-' + th.id + '"' + (opt.label ? ' role="img" aria-label="' + opt.label + '"' : ' aria-hidden="true"') + '>';
    var r = rnd(opt.seed || 11), cells = [], i, j;
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) cells.push([i, j]);
    cells.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]) || a[0] - b[0]; });
    var mid = (n - 1) / 2, order = cells.slice().sort(function (a, b) { var da = Math.abs(a[0] - mid) + Math.abs(a[1] - mid), db = Math.abs(b[0] - mid) + Math.abs(b[1] - mid); return da - db || a[0] - b[0]; });
    var at = {}, used = 0;
    items.slice(0, n * n).forEach(function (it, k) { var c = order[k]; at[c[0] + ',' + c[1]] = it; used = k + 1; });
    /* decorations go on the outer free tiles, spread around */
    var free = order.slice(used).reverse(), dec = (opt.decor || []).slice(0, free.length);
    dec.forEach(function (d, k) { var c = free[Math.floor(k * free.length / Math.max(1, dec.length))]; if (c && !at[c[0] + ',' + c[1]]) at[c[0] + ',' + c[1]] = { decor: d }; });
    var tiles = '', top = '';
    cells.forEach(function (c) {
      var x = (c[0] - c[1]) * tw / 2, y = (c[0] + c[1]) * th2 / 2, it = at[c[0] + ',' + c[1]];
      tiles += tile(x, y, tw, it && it.withered ? 'soil' : (!it && r() < .1 ? 'soil' : 'grass'), 9, th);
      if (!it && r() < .35) tiles += tuft(x - 4, y + 2, th, r);
      if (it && it.decor) top += '<g transform="translate(' + f(x) + ' ' + f(y + 2) + ') scale(.78)">' + decor(it.decor) + '</g>';
      else if (it) {
        top += '<g class="pl' + (opt.animate ? ' grow' : '') + '" transform="translate(' + f(x) + ' ' + f(y + 2) + ') scale(' + (opt.plantScale || .62) + ')"' + (it.id ? ' data-id="' + it.id + '"' : '') + ' style="--d:' + (r() * 3).toFixed(2) + 's">' + (it.title ? '<title>' + String(it.title).replace(/[<&]/g, '') + '</title>' : '') +
          '<ellipse cx="0" cy="2" rx="14" ry="4" fill="#000" opacity=".16"/>' + plant(it.species, it.p == null ? 1 : it.p, { withered: it.withered, golden: it.golden, seed: it.seed || (c[0] * 31 + c[1] * 7 + 3) }) + '</g>';
      }
    });
    return s + '<g>' + tiles + '</g><g>' + top + '</g></svg>';
  }
  function name(id, lang) { var sp = SPECIES.filter(function (x) { return x.id === id; })[0]; return sp ? (sp.name[lang] || sp.name.en) : id; }
  function species(id) { return SPECIES.filter(function (x) { return x.id === id; })[0] || SPECIES[0]; }

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

  window.Garden = { SPECIES: SPECIES, TIERS: TIERS, DECOR: DECOR, THEMES: THEMES, plant: plant, island: island, scene: scene, tile: tile, decor: decor, theme: theme, name: name, species: species };
})();
