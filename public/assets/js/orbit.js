/* The Clive orbit: hero canvas with the products as planets. Click a planet to open it. */
(function () {
  'use strict';
  var cv = document.getElementById('orbit');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, cx = 0, cy = 0, R = 0, t0 = performance.now(), hover = null, px = 0, py = 0, tx = 0, ty = 0, running = true, visible = true;
  var root = document.documentElement;
  var PL = [
    { id: 'vaqt', ring: 0, a: 0.6, sp: 0.11, size: 15, col: 'green', href: 'vaqt/index.html' },
    { id: 'shop', ring: 0, a: 3.7, sp: 0.11, size: 9, col: 'rose', href: 'shop.html' },
    { id: 'clivedu', ring: 1, a: 2.2, sp: 0.075, size: 13, col: 'blue', href: 'products/clivedu.html' },
    { id: 'sprachwerk', ring: 1, a: 5.3, sp: 0.075, size: 12, col: 'gold', href: 'products/sprachwerk.html' },
    { id: 'class', ring: 2, a: 1.0, sp: 0.05, size: 13, col: 'turq', href: 'products/class.html' },
    { id: 'vault', ring: 2, a: 3.3, sp: 0.05, size: 11, col: 'amber', href: 'products/vault-studio.html' },
    { id: 'reja', ring: 1, a: 3.75, sp: 0.075, size: 12, col: 'violet', href: 'products/reja.html' },
    { id: 'work', ring: 2, a: 5.4, sp: 0.05, size: 10, col: 'sub', href: 'work.html' }
  ];
  var RINGS = [0.38, 0.62, 0.9], TILT = -0.2;
  var COL = {}, dark = true, stars = [];

  function readColors() {
    var cs = getComputedStyle(root);
    ['blue', 'violet', 'turq', 'gold', 'green', 'amber', 'rose', 'ink', 'sub', 'mute'].forEach(function (k) { COL[k] = cs.getPropertyValue('--' + k).trim() || '#888'; });
    dark = root.getAttribute('data-theme') !== 'light';
  }
  function size() {
    var r = cv.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var wide = W > 820;
    cx = wide ? W * 0.66 : W * 0.5; cy = wide ? H * 0.47 : H * 0.5;
    R = wide ? Math.min(W * 0.34, H * 0.62) : Math.min(W * 0.5, H * 0.56);
    stars = [];
    var n = Math.round(W * H / 5200);
    for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .2, p: Math.random() * 6.28, d: Math.random() * .8 + .2 });
    if (!running) draw(performance.now());
  }
  function label(id) { return window.Clive ? Clive.t('orb.' + id, id) : id; }
  function rgba(hex, a) {
    if (hex.indexOf('#') !== 0) return hex;
    var h = hex.slice(1); if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function pos(p, time) {
    var rx = R * RINGS[p.ring], ry = rx * 0.36, ang = p.a + time * p.sp;
    var x = Math.cos(ang) * rx, y = Math.sin(ang) * ry;
    var c = Math.cos(TILT), s = Math.sin(TILT);
    return { x: cx + x * c - y * s + px * (p.ring + 1) * 6, y: cy + x * s + y * c + py * (p.ring + 1) * 6, z: Math.sin(ang) };
  }
  function starPath(x, y, rOut, rot) {
    var rIn = rOut * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);
    ctx.beginPath();
    for (var k = 0; k < 16; k++) {
      var a = rot + k * Math.PI / 8, rr = k % 2 ? rIn : rOut;
      ctx[k ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  function center(time) {
    var s = R * 0.2, x = cx + px * 4, y = cy + py * 4;
    var g = ctx.createRadialGradient(x, y, 0, x, y, s * 3.2);
    g.addColorStop(0, rgba(COL.blue, dark ? .45 : .22)); g.addColorStop(.5, rgba(COL.violet, dark ? .12 : .06)); g.addColorStop(1, rgba(COL.violet, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 3.2, 0, 6.283); ctx.fill();
    var lg = ctx.createLinearGradient(x - s, y - s, x + s, y + s);
    lg.addColorStop(0, dark ? '#7C95FF' : COL.blue); lg.addColorStop(1, dark ? '#A985FF' : COL.violet);
    /* the star outline, opened on the right like a C: sample the polygon and skip the gap */
    var rIn = s * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8), rot = -Math.PI / 2 + time * 0.08, V = [], k, j;
    for (k = 0; k < 16; k++) { var a = rot + k * Math.PI / 8, rr = k % 2 ? rIn : s; V.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    var P = [];
    for (k = 0; k < 16; k++) { var A = V[k], B = V[(k + 1) % 16]; for (j = 0; j < 10; j++) { var u = j / 10; P.push([A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u]); } }
    var GAP = 0.5, inGap = function (pt) { return Math.abs(Math.atan2(pt[1] - y, pt[0] - x)) < GAP; };
    var start = 0; for (k = 0; k < P.length; k++) { if (inGap(P[k]) && !inGap(P[(k + 1) % P.length])) { start = (k + 1) % P.length; break; } }
    ctx.beginPath(); var first = true;
    for (k = 0; k < P.length; k++) { var q = P[(start + k) % P.length]; if (inGap(q)) break; ctx[first ? 'moveTo' : 'lineTo'](q[0], q[1]); first = false; }
    ctx.save();
    ctx.lineWidth = Math.max(3, s * 0.2); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = lg;
    if (dark) { ctx.shadowColor = 'rgba(124,149,255,.7)'; ctx.shadowBlur = 22; }
    ctx.stroke(); ctx.restore();
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(x, y, s * 0.26, 0, 6.283); ctx.fill();
  }
  function ring(i) {
    var rx = R * RINGS[i], ry = rx * 0.36;
    ctx.save(); ctx.translate(cx + px * (i + 1) * 6, cy + py * (i + 1) * 6); ctx.rotate(TILT);
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 6.283);
    ctx.strokeStyle = dark ? 'rgba(160,178,255,.16)' : 'rgba(30,45,120,.14)'; ctx.lineWidth = 1; ctx.setLineDash(i === 1 ? [2, 6] : []); ctx.stroke();
    ctx.restore();
  }
  function planet(p, q) {
    var col = COL[p.col], k = q.z < 0 ? 0.78 + 0.22 * (1 + q.z) : 1, r = p.size * (R / 300) * k * (hover === p ? 1.25 : 1);
    r = Math.max(r, 5);
    ctx.globalAlpha = q.z < 0 ? 0.55 + 0.45 * (1 + q.z) : 1;
    if (dark) { var gl = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, r * 3.4); gl.addColorStop(0, rgba(col, .35)); gl.addColorStop(1, rgba(col, 0)); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(q.x, q.y, r * 3.4, 0, 6.283); ctx.fill(); }
    var g = ctx.createRadialGradient(q.x - r * .4, q.y - r * .45, r * .1, q.x, q.y, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.25, col); g.addColorStop(1, rgba(col, .75));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, 6.283); ctx.fill();
    if (p.id === 'vaqt') { ctx.strokeStyle = rgba(col, .7); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(q.x, q.y, r * 1.8, r * .5, -0.4, 0, 6.283); ctx.stroke(); }
    if (q.z < 0 && Math.abs(q.x - cx) < R * 0.3 && Math.abs(q.y - cy) < R * 0.25) { ctx.globalAlpha = 1; p._x = q.x; p._y = q.y; p._r = Math.max(r * 1.6, 18); p._lw = 0; p._lx = -999; return; }
    var fs = W < 560 ? 11 : 13;
    ctx.font = '700 ' + fs + 'px Manrope, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    var txt = label(p.id), tw = ctx.measureText(txt).width, lx = q.x + r + 8, ly = q.y - r * .2;
    if (lx + tw > W - 6) lx = q.x - r - 8 - tw;
    ctx.fillStyle = dark ? 'rgba(7,10,24,.55)' : 'rgba(255,255,255,.75)';
    roundRect(lx - 6, ly - fs * .8, tw + 12, fs * 1.6, fs * .8); ctx.fill();
    ctx.fillStyle = hover === p ? col : (dark ? '#EEF1FF' : '#0C1236');
    ctx.fillText(txt, lx, ly + .5);
    ctx.globalAlpha = 1;
    p._x = q.x; p._y = q.y; p._r = Math.max(r * 1.6, 18); p._lx = lx; p._lw = tw; p._ly = ly;
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  var shoot = null;
  function draw(now) {
    var time = (now - t0) / 1000;
    px += (tx - px) * .06; py += (ty - py) * .06;
    ctx.clearRect(0, 0, W, H);
    if (dark) {
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i], a = .35 + .45 * Math.sin(time * s.d * 1.5 + s.p);
        ctx.fillStyle = 'rgba(220,228,255,' + a.toFixed(3) + ')';
        ctx.fillRect(s.x + px * s.d * 10, s.y + py * s.d * 10, s.r, s.r);
      }
      if (running) {
        if (!shoot && Math.random() < .004) shoot = { x: Math.random() * W * .6, y: Math.random() * H * .4, l: 0 };
        if (shoot) {
          shoot.l += 14; var sx = shoot.x + shoot.l, sy = shoot.y + shoot.l * .45;
          var gr = ctx.createLinearGradient(sx - 90, sy - 40, sx, sy); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,.8)');
          ctx.strokeStyle = gr; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(sx - 90, sy - 40); ctx.lineTo(sx, sy); ctx.stroke();
          if (shoot.l > W) shoot = null;
        }
      }
    }
    for (var k = 0; k < RINGS.length; k++) ring(k);
    var qs = PL.map(function (p) { return { p: p, q: pos(p, time) }; });
    qs.sort(function (a, b) { return a.q.y - b.q.y; });
    qs.forEach(function (o) { if (o.q.z < 0) planet(o.p, o.q); });
    center(time);
    qs.forEach(function (o) { if (o.q.z >= 0) planet(o.p, o.q); });
  }
  function loop(now) { if (running && visible) draw(now); requestAnimationFrame(loop); }
  function hit(x, y) {
    for (var i = 0; i < PL.length; i++) {
      var p = PL[i]; if (p._x == null) continue;
      var dx = x - p._x, dy = y - p._y;
      if (dx * dx + dy * dy < p._r * p._r) return p;
      if (x >= p._lx - 6 && x <= p._lx + p._lw + 6 && Math.abs(y - p._ly) < 12) return p;
    }
    return null;
  }
  cv.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    tx = (x / W - .5) * 2; ty = (y / H - .5) * 2;
    var h = hit(x, y); if (h !== hover) { hover = h; cv.style.cursor = h ? 'pointer' : ''; if (!running) draw(performance.now()); }
  });
  cv.addEventListener('pointerleave', function () { tx = ty = 0; hover = null; cv.style.cursor = ''; });
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect(), h = hit(e.clientX - r.left, e.clientY - r.top);
    if (h) location.href = (root.getAttribute('data-root') || '') + h.href;
  });
  function motion() { running = root.getAttribute('data-motion') !== 'reduced'; if (!running) draw(performance.now()); }
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }); io.observe(cv); }
  if ('ResizeObserver' in window) { var ro = new ResizeObserver(size); ro.observe(cv); } else window.addEventListener('resize', size);
  document.addEventListener('clive:settings', function () { readColors(); motion(); if (!running) draw(performance.now()); });
  document.addEventListener('clive:lang', function () { if (!running) draw(performance.now()); });
  readColors(); size(); motion();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!running) draw(performance.now()); });
  requestAnimationFrame(loop);
})();
