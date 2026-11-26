/* Clive ID: local profile, saved words, focus stats, sync code and backups. */
(function () {
  'use strict';
  var KEYS = ['clive.settings', 'clive.profile', 'clive.words', 'clive.vaqt.v1'];
  function go() {
    var C = window.Clive, t = C.t, $ = C.$;
    var prof = C.load('clive.profile', null) || { name: '', av: 'blue', goals: [], since: Date.now() };
    if (!prof.since) prof.since = Date.now();
    function saveP() { C.save('clive.profile', prof); }
    function renderProfile() {
      var av = $('#av'); av.style.setProperty('--av', 'var(--' + (prof.av || 'blue') + ')');
      var nm0 = (prof.name || '').trim(); $('#av-i').textContent = nm0 ? nm0.charAt(0).toUpperCase() : ''; av.classList.toggle('empty', !nm0);
      C.$$('[data-av]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-av') === prof.av)); });
      C.$$('[data-goal]').forEach(function (b) { b.setAttribute('aria-pressed', String((prof.goals || []).indexOf(b.getAttribute('data-goal')) >= 0)); });
      var d = new Date(prof.since);
      $('#pf-since').textContent = 'Clive ID · ' + d.toLocaleDateString(C.S.lang === 'uz' ? 'uz-UZ' : C.S.lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    var nm = $('#pf-name'); nm.value = prof.name || '';
    nm.addEventListener('input', function () { prof.name = nm.value.slice(0, 40); saveP(); renderProfile(); });
    C.$$('[data-av]').forEach(function (b) { b.addEventListener('click', function () { prof.av = b.getAttribute('data-av'); saveP(); renderProfile(); }); });
    C.$$('[data-goal]').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.getAttribute('data-goal'), gs = prof.goals || [], i = gs.indexOf(g);
        if (i >= 0) gs.splice(i, 1); else gs.push(g); prof.goals = gs; saveP(); renderProfile();
      });
    });

    function stats() {
      var v = C.vaqt() || { today: 0, total: 0, plants: 0, streak: 0 };
      $('#st-today').textContent = v.today; $('#st-total').textContent = v.total; $('#st-plants').textContent = v.plants; $('#st-streak').textContent = v.streak;
    }
    function words() {
      var w = C.load('clive.words', []), box = $('#words');
      if (!w.length) { box.innerHTML = '<p class="muted" style="margin:0">' + C.esc(t('m.nowords')) + '</p>'; return; }
      box.innerHTML = w.map(function (x, i) { return '<div><span><b>' + C.esc(x[0]) + '</b></span><span>' + C.esc(x[1]) + '</span><span>' + C.esc(x[2]) + '</span><span>' + C.esc(x[3]) + '</span><button class="iconbtn" data-rm="' + i + '" aria-label="Remove">' + C.icon('x') + '</button></div>'; }).join('');
    }
    $('#words').addEventListener('click', function (e) { var b = e.target.closest('[data-rm]'); if (!b) return; var w = C.load('clive.words', []); w.splice(+b.getAttribute('data-rm'), 1); C.save('clive.words', w); words(); });

    /* backup */
    function bundle() { var o = { app: 'clive', v: 1, at: new Date().toISOString() }; KEYS.forEach(function (k) { o[k] = C.load(k, null); }); return o; }
    function restore(o) {
      if (!o || o.app !== 'clive') return false;
      KEYS.forEach(function (k) { if (o[k] != null) C.save(k, o[k]); });
      return true;
    }
    function msg(id, k) { $(id).textContent = t(k); }
    $('#bk-dl').addEventListener('click', function () {
      try {
        var blob = new Blob([JSON.stringify(bundle(), null, 2)], { type: 'application/json' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'clive-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      } catch (e) { C.copy(JSON.stringify(bundle()), t('m.copied.bk')); }
    });
    $('#bk-copy').addEventListener('click', function () { C.copy(JSON.stringify(bundle()), t('m.copied.bk')); });
    $('#bk-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { try { if (restore(JSON.parse(r.result))) { msg('#bk-msg', 'm.imp.ok'); setTimeout(function () { location.reload(); }, 700); } else msg('#bk-msg', 'm.imp.bad'); } catch (x) { msg('#bk-msg', 'm.imp.bad'); } };
      r.readAsText(f);
    });
    $('#rs-ask').addEventListener('click', function () { $('#rs-box').classList.add('on'); });
    $('#rs-no').addEventListener('click', function () { $('#rs-box').classList.remove('on'); });
    $('#rs-yes').addEventListener('click', function () {
      KEYS.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
      try { localStorage.removeItem('clive.sync'); } catch (e) {}
      msg('#bk-msg', 'm.reset.ok'); setTimeout(function () { location.reload(); }, 800);
    });

    /* sync code */
    var AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    function newCode() {
      var a = new Uint8Array(12); (window.crypto || window.msCrypto).getRandomValues(a);
      var s = ''; for (var i = 0; i < 12; i++) { s += AL[a[i] % AL.length]; if (i % 4 === 3 && i < 11) s += '-'; }
      return 'CLV-' + s;
    }
    var code = C.load('clive.sync', null);
    function showCode() { $('#sync-code').textContent = code || '—'; }
    showCode();
    var api = (C.root || '') + 'api/sync';
    var online = location.protocol.indexOf('http') === 0 && !/(^|\.)claude(usercontent)?\.(ai|com)$/.test(location.hostname);
    function noSync() { msg('#sync-msg', 'm.nosync'); }
    $('#sync-up').addEventListener('click', function () {
      if (!online) return noSync();
      if (!code) { code = newCode(); C.save('clive.sync', code); showCode(); }
      fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code, data: bundle() }) })
        .then(function (r) { if (r.status === 404) throw 'nofn'; return r.json(); })
        .then(function (j) { if (j && j.ok) msg('#sync-msg', 'm.up.ok'); else msg('#sync-msg', 'm.err'); })
        .catch(function (e) { if (e === 'nofn') noSync(); else msg('#sync-msg', 'm.err'); });
    });
    $('#sync-copy').addEventListener('click', function () { if (code) C.copy(code); });
    $('#sync-pull').addEventListener('click', function () {
      var c = $('#sync-in').value.trim().toUpperCase().replace(/\s+/g, '');
      if (!/^CLV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c)) { msg('#sync-msg', 'm.pull.none'); return; }
      if (!online) return noSync();
      fetch(api + '?code=' + encodeURIComponent(c))
        .then(function (r) { if (r.status === 404) return null; if (!r.ok) throw 'err'; return r.json(); })
        .then(function (j) {
          if (!j || !j.data) { msg('#sync-msg', 'm.pull.none'); return; }
          if (restore(j.data)) { C.save('clive.sync', c); msg('#sync-msg', 'm.pull.ok'); setTimeout(function () { location.reload(); }, 700); }
          else msg('#sync-msg', 'm.err');
        }).catch(function () { msg('#sync-msg', 'm.err'); });
    });

    renderProfile(); stats(); words();
    document.addEventListener('clive:lang', function () { renderProfile(); words(); });
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
