/* Orbit page: reachability chips and the Vaqt island. */
(function () {
  'use strict';
  function go() {
    var C = window.Clive;
    C.$$('[data-ping]').forEach(function (chip) {
      C.ping(chip.getAttribute('data-ping')).then(function (s) {
        chip.setAttribute('data-s', s);
        chip.lastElementChild.textContent = C.t(s === 'up' ? 'o.up' : 'o.unk');
        chip.lastElementChild.removeAttribute('data-i18n');
      });
    });
    var isl = document.getElementById('vq-island');
    if (isl && window.Garden) {
      var sp = ['lola', 'anor', 'zarang', 'chinor', 'uzum', 'nilufar', 'kungaboqar', 'archa'], i = 0, p = 0;
      var reduced = document.documentElement.getAttribute('data-motion') === 'reduced';
      var draw = function () { isl.innerHTML = Garden.island(sp[i], reduced ? 1 : p, { seed: 5 + i }); };
      if (reduced) { draw(); return; }
      setInterval(function () { p += 0.025; if (p > 1.35) { p = 0; i = (i + 1) % sp.length; } draw(); }, 60);
    }
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
