/* Work page: category filter. */
(function () {
  'use strict';
  function go() {
    var C = window.Clive, btns = C.$$('[data-f]'), cards = C.$$('#wgrid .wk');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        cards.forEach(function (c) { c.hidden = !(f === 'all' || c.getAttribute('data-cat') === f); if (!c.hidden) c.classList.add('in'); });
      });
    });
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
