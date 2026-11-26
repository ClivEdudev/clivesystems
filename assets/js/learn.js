/* Learn page: live countdown and today's column. */
(function () {
  'use strict';
  function go() {
    var C = window.Clive, t = C.t;
    function tick() {
      var n = C.nextClass(); if (!n) return;
      var big = C.$('#cd-big'), sub = C.$('#cd-sub'), lab = C.$('#cd-l');
      var nowDow = C.tash().getUTCDay();
      if (n.live) { lab.textContent = t('l.cd.live'); big.textContent = n.c.name; sub.textContent = C.fmt(t('h.nc.subl'), { group: n.c.name, time: n.c.start }); }
      else {
        lab.textContent = t('l.cd.l', 'Next class');
        big.textContent = C.fmt(t('l.cd.in'), { t: C.dur(n.inMin) });
        var day = n.day === nowDow ? t('h.nc.today') : (n.day === (nowDow + 1) % 7 ? t('h.nc.tomorrow') : C.DAYS[C.S.lang][n.day]);
        sub.textContent = C.fmt(t('h.nc.sub'), { group: n.c.name, day: day, time: n.c.start });
      }
      C.$$('#tt .h').forEach(function (h) { h.classList.toggle('today', +h.getAttribute('data-dow') === nowDow); });
    }
    tick(); setInterval(tick, 30000);
    document.addEventListener('clive:lang', tick);
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
