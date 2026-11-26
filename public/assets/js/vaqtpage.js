/* Vaqt product page: growing island, species gallery, quick start. */
(function () {
  'use strict';
  function go() {
    var C = window.Clive, t = C.t, isl = document.getElementById('vq-island');
    var reduced = document.documentElement.getAttribute('data-motion') === 'reduced';
    if (isl) {
      var sp = ['lola', 'anor', 'xurmo', 'chinor', 'yulduzgul', 'gilos', 'tol', 'oltinlola', 'uzum', 'archa'], i = 0, p = reduced ? 1 : 0;
      var draw = function () { isl.innerHTML = Garden.island(sp[i], p, { seed: 5 + i, label: Garden.name(sp[i], C.S.lang) }); };
      draw();
      if (!reduced) setInterval(function () { p += 0.02; if (p > 1.4) { p = 0; i = (i + 1) % sp.length; } draw(); }, 60);
    }
    var box = document.getElementById('species');
    function species() {
      if (!box) return;
      var L = C.S.lang;
      box.innerHTML = Garden.SPECIES.map(function (s, k) {
        var tr = Garden.TIERS[s.tier];
        return '<article class="card' + (s.tier === 'legendary' ? ' glow' : '') + '" style="--tc:' + tr.c + '"><div class="pv"><svg viewBox="-45 -125 90 135">' + Garden.plant(s.id, 1, { seed: 9 + k }) + '</svg></div><b>' + C.esc(s.name[L] || s.name.en) + '</b>' +
          '<p class="small" style="margin:4px 0 8px">' + C.esc(s.note[L] || s.note.en) + '</p><div class="row" style="gap:6px;justify-content:center;flex-wrap:wrap"><span class="chip c" style="--c:' + tr.c + '">' + C.esc(tr.name[L] || tr.name.en) + '</span><span class="chip c" style="--c:var(--' + (s.cost ? 'gold' : 'green') + ')">' + C.esc(s.cost ? C.fmt(t('pp.vaqt.coins'), { n: s.cost }) : t('pp.vaqt.free')) + '</span></div></article>';
      }).join('');
    }
    species();
    document.addEventListener('clive:lang', species);
    var q = document.getElementById('vq-25');
    if (q) q.addEventListener('click', function () { try { sessionStorage.setItem('vaqt.autostart', '25'); } catch (e) {} location.href = (C.root || '') + 'vaqt/index.html#focus'; });
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
