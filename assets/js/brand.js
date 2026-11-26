/* Brand page: copy SVG markup of a logo stage. */
(function () {
  'use strict';
  function go() {
    var C = window.Clive;
    C.$$('[data-svg]').forEach(function (b) {
      b.addEventListener('click', function () {
        var st = document.getElementById(b.getAttribute('data-svg')), svg = st.querySelector('svg').cloneNode(true);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); svg.setAttribute('width', '256'); svg.setAttribute('height', '256');
        var html = svg.outerHTML;
        if (st.classList.contains('wm')) {
          html = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" width="300" height="80"><svg x="4" y="8" width="64" height="64" viewBox="0 0 64 64">' + svg.innerHTML + '</svg><text x="84" y="56" font-family="Unbounded, Manrope, sans-serif" font-weight="700" font-size="44" fill="#EEF1FF">Clive</text></svg>';
        }
        C.copy(html, C.t('b.svgc'));
      });
    });
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
