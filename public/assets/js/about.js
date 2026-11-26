/* About page: the ID card tilts toward the pointer. */
(function () {
  'use strict';
  var c = document.getElementById('idc'); if (!c) return;
  var root = document.documentElement;
  c.addEventListener('pointermove', function (e) {
    if (root.getAttribute('data-motion') === 'reduced') return;
    var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.setProperty('--ry', (x * 18).toFixed(2) + 'deg'); c.style.setProperty('--rx', (-y * 14).toFixed(2) + 'deg'); c.style.setProperty('--sx', (50 + x * 100).toFixed(1) + '%');
  });
  c.addEventListener('pointerleave', function () { c.style.removeProperty('--ry'); c.style.removeProperty('--rx'); c.style.removeProperty('--sx'); });
})();
