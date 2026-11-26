/* Garden: draws the Vaqt plants and isometric gardens as SVG strings. Shared by the site and the app. */
(function () {
  'use strict';
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function f(n) { return Math.round(n * 10) / 10; }
  function rnd(seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 10000) / 10000; }; }

  var SPECIES = [
    { id: 'lola', cost: 0, min: 10, name: { en: 'Tulip', uz: 'Lola', ru: 'Тюльпан' }, note: { en: 'Uzbekistan’s spring flower. Free.', uz: 'O‘zbekiston bahor guli. Bepul.', ru: 'Весенний цветок Узбекистана. Бесплатно.' } },
    { id: 'paxta', cost: 0, min: 10, name: { en: 'Cotton', uz: 'Paxta', ru: 'Хлопок' }, note: { en: 'White gold of the valley. Free.', uz: 'Vodiyning oq oltini. Bepul.', ru: 'Белое золото долины. Бесплатно.' } },
    { id: 'anor', cost: 120, min: 20, name: { en: 'Pomegranate', uz: 'Anor', ru: 'Гранат' }, note: { en: 'A small tree with red crowns.', uz: 'Qizil tojli kichik daraxt.', ru: 'Небольшое дерево с красными коронами.' } },
    { id: 'orik', cost: 250, min: 25, name: { en: 'Apricot', uz: 'O‘rik', ru: 'Урюк' }, note: { en: 'Blossoms first, then fruit.', uz: 'Avval gullaydi, keyin meva beradi.', ru: 'Сначала цветёт, потом плодоносит.' } },
    { id: 'uzum', cost: 400, min: 30, name: { en: 'Grapevine', uz: 'Uzum', ru: 'Виноград' }, note: { en: 'Climbs a courtyard trellis.', uz: 'Hovli so‘risiga chirmashadi.', ru: 'Вьётся по шпалере во дворе.' } },
    { id: 'tut', cost: 600, min: 40, name: { en: 'Mulberry', uz: 'Tut', ru: 'Шелковица' }, note: { en: 'Wide shade, dark berries.', uz: 'Keng soya, to‘q mevalar.', ru: 'Широкая тень, тёмные ягоды.' } },
    { id: 'archa', cost: 800, min: 45, name: { en: 'Juniper', uz: 'Archa', ru: 'Арча' }, note: { en: 'Mountain evergreen. Patient.', uz: 'Tog‘ archasi. Sabrli.', ru: 'Горный вечнозелёный. Терпеливый.' } },
    { id: 'chinor', cost: 1200, min: 60, name: { en: 'Plane tree', uz: 'Chinor', ru: 'Чинара' }, note: { en: 'The great tree of the mahalla. For long sessions.', uz: 'Mahallaning ulug‘ daraxti. Uzun sessiyalar uchun.', ru: 'Великое дерево махалли. Для долгих сессий.' } }
  ];

  var C = {
    leaf: '#3DBE7A', leaf2: '#2A9A5F', leafHi: '#86E3AE', dark: '#23784A', trunk: '#8A5A3B', trunk2: '#6B4329',
    w_leaf: '#A68F5B', w_leaf2: '#86724A', w_hi: '#C2AE7C', w_dark: '#6E5C3C', w_trunk: '#6B5847', w_flower: '#8E6C58'
  };
  function pal(w) {
    return w ? { leaf: C.w_leaf, leaf2: C.w_leaf2, hi: C.w_hi, dark: C.w_dark, trunk: C.w_trunk, trunk2: '#57483B' }
      : { leaf: C.leaf, leaf2: C.leaf2, hi: C.leafHi, dark: C.dark, trunk: C.trunk, trunk2: C.trunk2 };
  }
  function circ(x, y, r, fill, extra) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(Math.max(r, 0)) + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function ell(x, y, rx, ry, rot, fill) { return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(Math.max(rx, 0)) + '" ry="' + f(Math.max(ry, 0)) + '" transform="rotate(' + f(rot) + ' ' + f(x) + ' ' + f(y) + ')" fill="' + fill + '"/>'; }
  function path(d, fill, stroke, sw) { return '<path d="' + d + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>'; }
  function trunk(h, w, bend, P) {
    var top = -h, b = bend;
    return path('M' + f(-w) + ' 0 C' + f(-w * .8) + ' ' + f(top * .5) + ' ' + f(b - w * .5) + ' ' + f(top * .7) + ' ' + f(b - w * .35) + ' ' + f(top) +
      ' L' + f(b + w * .35) + ' ' + f(top) + ' C' + f(b + w * .5) + ' ' + f(top * .7) + ' ' + f(w * .8) + ' ' + f(top * .5) + ' ' + f(w) + ' 0Z', P.trunk) +
      path('M' + f(w * .15) + ' 0 C' + f(w * .2) + ' ' + f(top * .5) + ' ' + f(b + w * .1) + ' ' + f(top * .7) + ' ' + f(b + w * .2) + ' ' + f(top) + ' L' + f(b + w * .35) + ' ' + f(top) + ' C' + f(b + w * .5) + ' ' + f(top * .7) + ' ' + f(w * .8) + ' ' + f(top * .5) + ' ' + f(w) + ' 0Z', P.trunk2);
  }
  function sprout(s, P) {
    s = clamp(s, 0, 1);
    return path('M0 0 Q1 ' + f(-6 * s) + ' 0 ' + f(-12 * s), null, P.leaf2, 2.2) +
      ell(-5 * s, -12 * s, 5 * s, 2.4 * s, -25, P.leaf) + ell(5 * s, -13 * s, 5 * s, 2.4 * s, 25, P.leaf2);
  }
  function canopy(cx, cy, R, n, P, r, flat) {
    var out = '', k;
    var pts = [];
    for (k = 0; k < n; k++) { var a = (k / n) * Math.PI * 2 + r() * .5; var d = R * (.45 + r() * .35); pts.push([cx + Math.cos(a) * d * (flat || 1), cy + Math.sin(a) * d * .7, R * (.48 + r() * .22)]); }
    out += circ(cx, cy + R * .15, R * .78, P.dark);
    pts.forEach(function (q) { out += circ(q[0], q[1] + R * .08, q[2], P.leaf2); });
    pts.forEach(function (q) { out += circ(q[0] - q[2] * .12, q[1] - q[2] * .12, q[2] * .86, P.leaf); });
    out += circ(cx - R * .35, cy - R * .35, R * .32, P.hi, ' opacity=".55"');
    return out;
  }

  function lola(p, w, r) {
    var P = pal(w), e = ease(p), h = 8 + 44 * e, bend = w ? 9 : 2;
    var o = '';
    var lf = ease(seg(p, .08, .6));
    o += '<g transform="scale(' + f(lf) + ')">' + path('M0 0 C-11 -6 -17 -18 -15 -31 C-8 -23 -2 -12 0 0Z', P.leaf2) + path('M0 0 C10 -5 16 -15 14 -27 C8 -19 2 -10 0 0Z', P.leaf) + path('M-2 -4 C-7 -10 -11 -18 -12 -26', null, P.hi, 1) + '</g>';
    o += path('M0 0 Q' + f(bend * .3) + ' ' + f(-h * .5) + ' ' + f(bend) + ' ' + f(-h), null, P.leaf2, 2.6);
    var fs = ease(seg(p, .45, .95));
    if (fs > 0) {
      var red = w ? C.w_flower : '#E5484D', red2 = w ? '#6F5444' : '#B8323A', hi = w ? '#A8897A' : '#FF8A8E';
      var x = bend, y = -h, s = .35 + .65 * fs, open = w ? 1.25 : 1;
      var g = '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + (w ? 38 : 0) + ') scale(' + f(s) + ')">';
      g += path('M-8 2 C-11 -6 -8 -16 0 -19 C8 -16 11 -6 8 2 C4 5 -4 5 -8 2Z', red2);
      g += path('M-9 1 C-12 -7 -' + f(7 * open) + ' -16 -1 -18 C-2 -10 -3 -3 -1 4 C-5 5 -8 3 -9 1Z', red);
      g += path('M9 1 C12 -7 ' + f(7 * open) + ' -16 1 -18 C2 -10 3 -3 1 4 C5 5 8 3 9 1Z', red);
      g += path('M-5 -4 C-6 -9 -4 -14 -2 -16', null, hi, 1.6);
      g += '</g>';
      o += g;
    }
    if (p < .1) return sprout(p * 10, P);
    return o;
  }

  function paxta(p, w, r) {
    var P = pal(w), e = ease(p), h = 8 + 30 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += path('M0 0 Q-1 ' + f(-h * .5) + ' 0 ' + f(-h), null, P.trunk, 2.6);
    var br = [[-.45, -14, -1], [-.65, 13, 1], [-.85, -11, -1], [-.95, 9, 1]];
    var bs = ease(seg(p, .15, .7));
    br.forEach(function (b, i) {
      var y = h * b[0], x2 = b[1] * bs, y2 = y - 8 * bs;
      o += path('M0 ' + f(y) + ' Q' + f(x2 * .5) + ' ' + f(y - 2) + ' ' + f(x2) + ' ' + f(y2), null, P.trunk, 1.8);
      o += circ(x2, y2 + 2, 6.5 * bs, P.leaf2) + circ(x2 - 1.5, y2, 5.5 * bs, P.leaf);
    });
    o += circ(0, -h - 2, 7 * e, P.leaf2) + circ(-1.5, -h - 4, 6 * e, P.leaf) + circ(-3, -h - 6, 2.4 * e, P.hi, ' opacity=".6"');
    var bo = ease(seg(p, .55, 1));
    if (bo > 0) {
      var pos = [[-14, -h * .45 - 9], [13, -h * .65 - 9], [-11, -h * .85 - 9], [9, -h * .95 - 9], [0, -h - 8]];
      var wh = w ? '#CFC3A8' : '#FBFBF7', sh = w ? '#B1A385' : '#E2E4DE';
      pos.forEach(function (q, i) {
        if (i / pos.length > bo + .1) return;
        var s = 3.6 * bo;
        o += path('M' + f(q[0] - 4 * bo) + ' ' + f(q[1] + 3) + ' L' + f(q[0]) + ' ' + f(q[1] + 6 * bo) + ' L' + f(q[0] + 4 * bo) + ' ' + f(q[1] + 3) + 'Z', '#7A5230');
        o += circ(q[0] - s * .7, q[1], s, sh) + circ(q[0] + s * .7, q[1], s, sh) + circ(q[0], q[1] - s * .8, s, wh) + circ(q[0] - s * .5, q[1] - s * .2, s * .9, wh);
      });
    }
    return o;
  }

  function anor(p, w, r) {
    var P = pal(w), e = ease(p), h = 10 + 26 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    o += trunk(h, 3 + 2 * e, 2, P);
    var cs = ease(seg(p, .15, .85)), R = 20 * cs;
    o += canopy(2, -h - R * .5, R, 6, P, r);
    var fr = ease(seg(p, .6, 1));
    if (fr > 0) {
      var red = w ? C.w_flower : '#D7263D', red2 = w ? '#6F5444' : '#A31A2E';
      [[-10, -h - 2], [9, -h - 8], [1, -h - R * .9], [-4, -h - 14], [13, -h + 2]].forEach(function (q, i) {
        if (i > fr * 5) return;
        var s = 4.2 * fr;
        o += circ(q[0], q[1], s, red2) + circ(q[0] - .6, q[1] - .6, s * .85, red) + path('M' + f(q[0] - 1.6 * fr) + ' ' + f(q[1] - s + .5) + ' l' + f(1.6 * fr) + ' ' + f(-2.6 * fr) + ' l' + f(1.6 * fr) + ' ' + f(2.6 * fr) + 'z', red2) + circ(q[0] - s * .4, q[1] - s * .4, s * .25, '#FF9AA6', ' opacity="' + (w ? 0 : .7) + '"');
      });
    }
    return o;
  }

  function orik(p, w, r) {
    var P = pal(w), e = ease(p), h = 14 + 30 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    if (!w) P = { leaf: '#58C27D', leaf2: '#3FA163', hi: '#A6EBC0', dark: '#2E7F4B', trunk: P.trunk, trunk2: P.trunk2 };
    o += trunk(h, 3.2 + 2 * e, -2, P);
    var cs = ease(seg(p, .15, .85)), R = 22 * cs;
    o += canopy(-2, -h - R * .45, R, 7, P, r);
    var bl = seg(p, .45, .75) * (1 - seg(p, .85, 1) * .6);
    var fr = ease(seg(p, .75, 1));
    var pts = [[-14, -h - 4], [10, -h - 10], [-6, -h - R * .95], [4, -h - 2], [-18, -h - 12], [15, -h - 2], [0, -h - 16], [-10, -h - 18]];
    pts.forEach(function (q, i) {
      if (bl > 0 && i % 2 === 0) o += circ(q[0] + 3, q[1] - 3, 2.2 * bl, w ? '#C9B7A6' : '#FFE1EA') + circ(q[0] + 3, q[1] - 3, .9 * bl, w ? '#9F8C7A' : '#F59AB4');
      if (fr > 0 && i < 6) o += circ(q[0], q[1], 3.4 * fr, w ? '#9C7B52' : '#F08A24') + circ(q[0] - .8, q[1] - .8, 2.4 * fr, w ? '#B39465' : '#FDB352');
    });
    return o;
  }

  function uzum(p, w, r) {
    var P = pal(w), e = ease(p), o = '';
    if (p < .1) return sprout(p * 10, P);
    var wood = w ? '#6B5847' : '#9B6A44', wood2 = w ? '#57483B' : '#7A5233';
    o += path('M-20 0 L-20 -46', null, wood2, 3.4) + path('M20 0 L20 -46', null, wood2, 3.4) + path('M-24 -46 Q0 -60 24 -46', null, wood, 3.2) + path('M-20 -30 L20 -30', null, wood, 1.6);
    var vs = ease(seg(p, .1, .8));
    var vine = 'M0 0 C-2 -12 -14 -18 -18 -' + f(30 * vs) + (vs > .5 ? ' C-16 -44 -6 -52 0 -' + f(52 * vs) + ' C8 -52 16 -46 18 -' + f(40 * vs) : '');
    o += path(vine, null, P.trunk, 2.6);
    var leaves = [[-6, -10], [-15, -22], [-18, -36], [-8, -50], [6, -52], [16, -44], [12, -30]];
    leaves.forEach(function (q, i) { var s = clamp(vs * 7 - i, 0, 1); if (s <= 0) return; o += circ(q[0], q[1], 6 * s, P.leaf2) + circ(q[0] - 1, q[1] - 1, 5 * s, P.leaf) + circ(q[0] - 2.5, q[1] - 2.5, 1.6 * s, P.hi, ' opacity=".6"'); });
    var gr = ease(seg(p, .6, 1));
    if (gr > 0) {
      var g1 = w ? '#7D6A5A' : '#6B3FA0', g2 = w ? '#9A8573' : '#8E5BD0';
      [[-12, -40], [8, -44], [0, -30]].forEach(function (q) {
        var s = 2.4 * gr;
        [[0, 0], [-1, 1], [1, 1], [-2, 2], [0, 2], [2, 2], [-1, 3], [1, 3], [0, 4]].forEach(function (d) { o += circ(q[0] + d[0] * s * .95, q[1] + d[1] * s * .95, s, g1) + circ(q[0] + d[0] * s * .95 - .5, q[1] + d[1] * s * .95 - .5, s * .55, g2); });
      });
    }
    return o;
  }

  function tut(p, w, r) {
    var P = pal(w), e = ease(p), h = 12 + 28 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    if (!w) P = { leaf: '#3A9C5E', leaf2: '#2B7F4A', hi: '#7FD3A0', dark: '#1F5F37', trunk: '#7A5136', trunk2: '#5E3D28' };
    o += trunk(h, 4 + 2.5 * e, 1, P);
    var cs = ease(seg(p, .15, .85)), R = 22 * cs;
    o += canopy(1, -h - R * .3, R, 8, P, r, 1.45);
    var fr = ease(seg(p, .65, 1));
    if (fr > 0) [[-22, -h + 2], [-10, -h - 6], [6, -h - 12], [20, -h], [-2, -h - 2], [14, -h - 8], [-16, -h - 10]].forEach(function (q) {
      o += circ(q[0], q[1], 2.2 * fr, w ? '#6A5545' : '#4A1F4E') + circ(q[0] + 2, q[1] + 1.5, 1.9 * fr, w ? '#7E6957' : '#6E2F74') + circ(q[0] - 1.5, q[1] + 2, 1.7 * fr, w ? '#7E6957' : '#5B2A5E');
    });
    return o;
  }

  function archa(p, w, r) {
    var e = ease(p), h = 16 + 64 * e, o = '';
    var P = w ? pal(true) : { leaf: '#2C9A86', leaf2: '#1F7466', hi: '#6ED3BE', dark: '#145448', trunk: C.trunk, trunk2: C.trunk2 };
    if (p < .1) return sprout(p * 10, P);
    o += path('M-3 0 L-2 -10 L2 -10 L3 0Z', P.trunk);
    var tiers = 4, k;
    for (k = 0; k < tiers; k++) {
      var t = k / tiers, ts = clamp(e * tiers - k + .6, 0, 1); if (ts <= 0) continue;
      var y0 = -8 - (h - 10) * t * .78, wdt = (20 - k * 3.6) * ts, ht = (h * .42) * ts;
      o += path('M' + f(-wdt) + ' ' + f(y0) + ' L0 ' + f(y0 - ht) + ' L' + f(wdt) + ' ' + f(y0) + ' Q0 ' + f(y0 + 4) + ' ' + f(-wdt) + ' ' + f(y0) + 'Z', P.leaf2);
      o += path('M' + f(-wdt) + ' ' + f(y0) + ' L0 ' + f(y0 - ht) + ' L0 ' + f(y0 + 2) + ' Q' + f(-wdt * .5) + ' ' + f(y0 + 2) + ' ' + f(-wdt) + ' ' + f(y0) + 'Z', P.leaf);
      o += path('M' + f(-wdt * .55) + ' ' + f(y0 - ht * .35) + ' L' + f(-wdt * .2) + ' ' + f(y0 - ht * .75), null, P.hi, 1.2);
    }
    return o;
  }

  function chinor(p, w, r) {
    var P = pal(w), e = ease(p), h = 16 + 40 * e, o = '';
    if (p < .1) return sprout(p * 10, P);
    if (!w) P = { leaf: '#47A869', leaf2: '#327F4F', hi: '#8FE0AA', dark: '#22603A', trunk: '#A07B5A', trunk2: '#7D5E44' };
    var tw = 5 + 4 * e;
    o += path('M' + f(-tw - 5) + ' 0 Q' + f(-tw) + ' -4 ' + f(-tw) + ' -10 L' + f(tw) + ' -10 Q' + f(tw) + ' -4 ' + f(tw + 5) + ' 0Z', P.trunk2);
    o += trunk(h, tw, 0, P);
    o += path('M0 ' + f(-h * .7) + ' Q-10 ' + f(-h * .85) + ' -16 ' + f(-h * 1.02), null, P.trunk, 3) + path('M0 ' + f(-h * .75) + ' Q10 ' + f(-h * .9) + ' 17 ' + f(-h * 1.05), null, P.trunk, 3);
    var cs = ease(seg(p, .12, .9)), R = 34 * cs;
    o += canopy(0, -h - R * .35, R, 10, P, r, 1.25);
    if (!w && cs > .6) for (var k = 0; k < 6; k++) o += circ(-R * .9 + r() * R * 1.8, -h - R * .2 - r() * R * .8, 1.2, '#C9F2D6', ' opacity=".7"');
    return o;
  }

  var DRAW = { lola: lola, paxta: paxta, anor: anor, orik: orik, uzum: uzum, tut: tut, archa: archa, chinor: chinor };

  /* one plant as an SVG group, base at 0,0 */
  function plant(id, p, opt) {
    opt = opt || {};
    var r = rnd(opt.seed || 7), fn = DRAW[id] || lola;
    return '<g class="plant' + (opt.withered ? ' withered' : '') + '">' + fn(clamp(p, 0, 1), !!opt.withered, r) + '</g>';
  }

  /* isometric tile; w = width (height is w/2) */
  function tile(x, y, w, kind, depth) {
    var hw = w / 2, hh = w / 4, d = depth == null ? w * .16 : depth;
    var top = kind === 'soil' ? ['#9A6B45', '#B4825A'] : kind === 'stone' ? ['#8E93A8', '#A7ADC3'] : ['#3FA35F', '#55BD74'];
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ')">' +
      path('M' + f(-hw) + ' 0 L0 ' + f(hh) + ' L0 ' + f(hh + d) + ' L' + f(-hw) + ' ' + f(d) + 'Z', '#7A5234') +
      path('M' + f(hw) + ' 0 L0 ' + f(hh) + ' L0 ' + f(hh + d) + ' L' + f(hw) + ' ' + f(d) + 'Z', '#5E3E27') +
      path('M0 ' + f(-hh) + ' L' + f(hw) + ' 0 L0 ' + f(hh) + ' L' + f(-hw) + ' 0Z', top[0]) +
      path('M0 ' + f(-hh) + ' L' + f(hw) + ' 0 L' + f(hw - 3) + ' 0 L0 ' + f(-hh + 1.5) + ' L' + f(-hw + 3) + ' 0 L' + f(-hw) + ' 0Z', top[1]) +
      '</g>';
  }

  /* a floating island with one plant, for the focus screen */
  function island(id, p, opt) {
    opt = opt || {};
    var s = '<svg viewBox="-125 -215 250 300" xmlns="http://www.w3.org/2000/svg" class="island" role="img" aria-label="' + (opt.label || id) + '">';
    s += '<ellipse cx="0" cy="62" rx="70" ry="10" fill="#000" opacity=".18"/>';
    s += tile(0, 0, 180, 'grass', 26);
    s += '<path d="M-22 18 q22 -10 44 0 q-22 10 -44 0z" fill="#7A5234" opacity=".55"/>';
    [[-58, 4], [52, -2], [-30, -22], [36, 20], [-6, 30]].forEach(function (q) { s += '<path d="M' + q[0] + ' ' + q[1] + ' l-2 -6 M' + q[0] + ' ' + q[1] + ' l1 -7 M' + q[0] + ' ' + q[1] + ' l3 -5" stroke="#7CD493" stroke-width="1.6" stroke-linecap="round"/>'; });
    s += '<g transform="translate(0 18) scale(' + (opt.scale || 2.05) + ')">' + plant(id, p, opt) + '</g>';
    return s + '</svg>';
  }

  /* isometric garden of many plants. items: [{species, p, withered, title, seed}] */
  function scene(items, opt) {
    opt = opt || {};
    var n = opt.size || Math.max(4, Math.ceil(Math.sqrt(items.length * 1.25)));
    var tw = 64, th = tw / 2, head = 80;
    var W = n * tw, H = n * th + head + 20;
    var s = '<svg viewBox="' + (-W / 2) + ' ' + (-head) + ' ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" class="scene"' + (opt.label ? ' role="img" aria-label="' + opt.label + '"' : ' aria-hidden="true"') + '>';
    var r = rnd(opt.seed || 11);
    var cells = [], i, j;
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) cells.push([i, j]);
    cells.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]) || a[0] - b[0]; });
    var order = cells.slice().sort(function (a, b) { var da = Math.abs(a[0] - (n - 1) / 2) + Math.abs(a[1] - (n - 1) / 2), db = Math.abs(b[0] - (n - 1) / 2) + Math.abs(b[1] - (n - 1) / 2); return da - db || a[0] - b[0]; });
    var at = {};
    items.slice(0, n * n).forEach(function (it, k) { var c = order[k]; at[c[0] + ',' + c[1]] = it; });
    var tiles = '', plants = '';
    cells.forEach(function (c) {
      var x = (c[0] - c[1]) * tw / 2, y = (c[0] + c[1]) * th / 2;
      var it = at[c[0] + ',' + c[1]];
      tiles += tile(x, y, tw, it ? (it.withered ? 'soil' : 'grass') : (r() < .12 ? 'soil' : 'grass'), 9);
      if (!it && r() < .3) tiles += '<path d="M' + f(x - 4) + ' ' + f(y + 2) + ' l-1 -4 M' + f(x - 4) + ' ' + f(y + 2) + ' l1.5 -4.5" stroke="#86DA9C" stroke-width="1.2" stroke-linecap="round"/>';
      if (it) {
        var cls = 'pl' + (opt.animate ? ' grow' : '');
        plants += '<g class="' + cls + '" transform="translate(' + f(x) + ' ' + f(y + 2) + ') scale(' + (opt.plantScale || .62) + ')"' + (it.id ? ' data-id="' + it.id + '"' : '') + ' style="--d:' + (Math.random() * 3).toFixed(2) + 's">' + (it.title ? '<title>' + String(it.title).replace(/[<&]/g, '') + '</title>' : '') +
          '<ellipse cx="0" cy="2" rx="14" ry="4" fill="#000" opacity=".16"/>' + plant(it.species, it.p == null ? 1 : it.p, { withered: it.withered, seed: it.seed || (c[0] * 31 + c[1] * 7 + 3) }) + '</g>';
      }
    });
    s += '<g>' + tiles + '</g><g>' + plants + '</g></svg>';
    return s;
  }

  function name(id, lang) { var sp = SPECIES.filter(function (x) { return x.id === id; })[0]; return sp ? (sp.name[lang] || sp.name.en) : id; }

  /* gentle sway, injected once */
  if (typeof document !== 'undefined' && !document.getElementById('garden-css')) {
    var st = document.createElement('style'); st.id = 'garden-css';
    st.textContent = '.scene .pl>.plant{transform-box:fill-box;transform-origin:50% 100%;animation:gsway 6s ease-in-out infinite;animation-delay:var(--d,0s)}@keyframes gsway{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}.scene .pl.grow>.plant{animation:ggrow 1.1s cubic-bezier(.2,.9,.3,1.3) both,gsway 6s ease-in-out 1.1s infinite;animation-delay:var(--d,0s),calc(var(--d,0s) + 1.1s)}@keyframes ggrow{from{transform:scale(0)}}:root[data-motion=reduced] .scene .pl>.plant{animation:none}@media (prefers-reduced-motion:reduce){.scene .pl>.plant{animation:none}}';
    document.head.appendChild(st);
  }

  window.Garden = { SPECIES: SPECIES, plant: plant, island: island, scene: scene, tile: tile, name: name };
})();
