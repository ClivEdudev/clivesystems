/* Contact form: posts to Netlify Forms on the live site; elsewhere it hands the text over to copy. */
(function () {
  'use strict';
  function go() {
    var C = window.Clive, t = C.t, f = C.$('#cform'); if (!f) return;
    var canPost = location.protocol.indexOf('http') === 0 && !/(^|\.)claude(usercontent)?\.(ai|com)$|localhost|127\.0\.0\.1/.test(location.hostname);
    function text() {
      return [C.$('#cf-name').value.trim(), C.$('#cf-contact').value.trim(), C.$('#cf-topic').value, '', C.$('#cf-msg').value.trim()].filter(function (x, i) { return x || i === 3; }).join('\n');
    }
    function show(msgKey, withText) {
      C.$('#cfields').style.display = 'none'; var d = C.$('#cdone'); d.classList.add('on');
      C.$('#cd-msg').textContent = t(msgKey);
      var pre = C.$('#cd-pre'); pre.style.display = withText ? '' : 'none'; pre.textContent = text();
      C.$('#cd-mail').href = 'mailto:imonkulovclive@gmail.com?subject=' + encodeURIComponent(C.$('#cf-topic').value) + '&body=' + encodeURIComponent(text());
    }
    C.$('#cd-copy').addEventListener('click', function () { C.copy(text()); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!C.$('#cf-name').value.trim() || !C.$('#cf-msg').value.trim()) { C.$('#cf-err').textContent = t('c.need'); return; }
      C.$('#cf-err').textContent = '';
      if (!canPost) { show('c.fb', true); return; }
      var body = new URLSearchParams(new FormData(f)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) { if (r.ok) show('c.ok', false); else show('c.err', true); }, function () { show('c.err', true); });
    });
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
