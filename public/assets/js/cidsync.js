/* c-ID sync: when you are signed in with your c-ID, your Clive data on this site
   (profile, settings, saved words, the Vaqt garden and Reja planner) is saved to your c-ID
   and comes back on any other device you sign in on. Loaded on every page. */
(function () {
  'use strict';
  var API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://localhost:8787/api' : 'https://clivedu.me/api';
  var KEYS = ['clive.settings', 'clive.profile', 'clive.words', 'clive.vaqt.v1', 'reja.v1'];
  var AUTH = 'clive.cid', META = 'clive.cid.sync';
  function load(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function auth() { var a = load(AUTH, null); return a && /^[a-f0-9]{48}$/.test(a.token || '') ? a : null; }
  function bundle() { var o = { app: 'clive', v: 2 }; KEYS.forEach(function (k) { o[k] = load(k, null); }); return o; }
  function hash(o) { var s = JSON.stringify(o), h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h >>> 0) + ':' + s.length; }
  function restore(o) {
    if (!o || o.app !== 'clive') return false;
    KEYS.forEach(function (k) { if (o[k] != null) save(k, o[k]); });
    return true;
  }
  /* both devices changed since the last sync: keep everything from both where we can */
  function merge(mine, theirs) {
    var out = JSON.parse(JSON.stringify(theirs));
    var w = {}, words = [];
    [].concat(theirs['clive.words'] || [], mine['clive.words'] || []).forEach(function (x) { var k = x && x[0]; if (k && !w[k]) { w[k] = 1; words.push(x); } });
    out['clive.words'] = words;
    var a = mine['clive.vaqt.v1'], b = theirs['clive.vaqt.v1'];
    if (a && b && a.sessions && b.sessions) {
      var big = a.sessions.length >= b.sessions.length ? a : b, seen = {}, all = [];
      [].concat(a.sessions, b.sessions).forEach(function (s) { var k = (s.start || 0) + ':' + (s.mode || ''); if (!seen[k]) { seen[k] = 1; all.push(s); } });
      out['clive.vaqt.v1'] = Object.assign({}, big, { sessions: all.sort(function (x, y) { return (x.start || 0) - (y.start || 0); }) });
    } else if (a && !b) out['clive.vaqt.v1'] = a;
    var ra = mine['reja.v1'], rb = theirs['reja.v1'];
    if (ra && (!rb || (ra.updated || 0) > (rb.updated || 0))) out['reja.v1'] = ra;
    if (!theirs['clive.profile'] && mine['clive.profile']) out['clive.profile'] = mine['clive.profile'];
    return out;
  }
  function req(method, body) {
    var a = auth(); if (!a) return Promise.reject('signed out');
    var o = { method: method, headers: { authorization: 'Bearer ' + a.token } };
    if (body) { o.headers['content-type'] = 'application/json'; o.body = JSON.stringify({ data: body }); if (o.body.length < 60000) o.keepalive = true; }
    return fetch(API + '/cid/app?app=clive', o).then(function (r) {
      if (r.status === 401) { try { localStorage.removeItem(AUTH); } catch (e) {} throw 'signed out'; }
      return r.json();
    });
  }
  var busy = false;
  function push(force) {
    if (!auth() || busy) return Promise.resolve(false);
    var b = bundle(), h = hash(b), m = load(META, {});
    if (!force && m.h === h) return Promise.resolve(false);
    if (JSON.stringify(b).length > 290000) { b['reja.v1'] = null; }
    busy = true;
    return req('POST', b).then(function (j) { busy = false; if (j && j.ok) { save(META, { t: j.t, h: h }); return true; } return false; }, function () { busy = false; return false; });
  }
  /* returns true when data from another device was brought in */
  function pull() {
    if (!auth()) return Promise.resolve(false);
    return req('GET').then(function (j) {
      var m = load(META, {}), mine = bundle(), hm = hash(mine);
      if (!j || !j.data) { return push(true).then(function () { return false; }); }
      if ((j.t || 0) <= (m.t || 0)) return push().then(function () { return false; });
      var changedHere = m.h && m.h !== hm;
      var next = changedHere || !m.h ? merge(mine, j.data) : j.data;
      restore(next);
      save(META, { t: j.t, h: hash(bundle()) });
      if (hash(next) !== hash(j.data)) push(true);
      return hash(bundle()) !== hm;
    }).catch(function () { return false; });
  }
  window.CID_SYNC = { pull: pull, push: push, api: API, auth: auth, KEYS: KEYS };
  if (!auth()) return;
  var last = +(sessionStorage.getItem('clive.cid.pulled') || 0);
  if (Date.now() - last > 5 * 60e3) {
    try { sessionStorage.setItem('clive.cid.pulled', String(Date.now())); } catch (e) {}
    pull().then(function (changed) { if (changed) document.dispatchEvent(new CustomEvent('cid:synced')); });
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') push(); });
  setInterval(function () { if (document.visibilityState === 'visible') push(); }, 120e3);
})();
