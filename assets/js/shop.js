/* Shop page: gallery. */
(function () {
  'use strict';
  function go() {
    var C = window.Clive, g = C.$('#gal'), dots = C.$$('.galnav .dots i');
    function idx() { return Math.round(g.scrollLeft / g.clientWidth); }
    function to(i) { i = Math.max(0, Math.min(dots.length - 1, i)); g.scrollTo({ left: i * g.clientWidth, behavior: 'smooth' }); }
    C.$$('[data-g]').forEach(function (b) { b.addEventListener('click', function () { to(idx() + +b.getAttribute('data-g')); }); });
    g.addEventListener('scroll', function () { var i = idx(); dots.forEach(function (d, k) { d.classList.toggle('on', k === i); }); }, { passive: true });
    g.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { to(idx() + 1); e.preventDefault(); } if (e.key === 'ArrowLeft') { to(idx() - 1); e.preventDefault(); } });
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
