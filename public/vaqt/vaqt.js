/* Vaqt v2: focus timer and time tracker that grows an Uzbek garden. Levels, quests, a bazaar and 57 awards. No dependencies. */
(function () {
  'use strict';
  var KEY = 'clive.vaqt.v1';
  var C, t, $, $$, esc, D;
  var DEF = { focus: 25, short: 5, long: 15, rounds: 4, autoBreak: true, autoFocus: false, deep: 'strict', grace: 15, goal: 120, chime: true, notify: false, wake: true, haptics: true, confetti: true, mode: 'timer', minutes: 25, species: 'lola', tag: 't0', task: null, round: 1 };
  var TAGC = ['#5B7CFF', '#FF9B3D', '#22CFC6', '#F5C04A', '#9B7BFF', '#3DDC97'];
  /* real recordings in vaqt/sounds/: [id, icon, exact loop length in seconds] */
  var SOUNDS = [['rain', 'rain', 37], ['thunder', 'bolt', 62], ['river', 'river', 67], ['ocean', 'waves', 76], ['fire', 'flame', 67], ['wind', 'wind', 52], ['birds', 'bird', 72], ['night', 'moon', 67], ['chimes', 'bell', 76], ['clock', 'clock', 14]];
  var QUICK = ['rain', 'river', 'ocean', 'fire', 'birds', 'night'], SND_V = '?v=1';
  var SVOL = { rain: .7, thunder: .55, river: .6, ocean: .6, fire: .6, wind: .5, birds: .5, night: .5, chimes: .4, clock: .35 };
  var PRESETS = [15, 25, 45, 60, 90, 120];
  var MIN_KEEP = 10, GOLD_CHANCE = 0.04, FREEZE_COST = 150, LEVEL_COINS = 20;
  var TIER_REWARD = { bronze: 15, silver: 40, gold: 100, platinum: 200, diamond: 400 };
  var TIER_GRAD = { bronze: ['#F6C08E', '#A0522D'], silver: ['#F4F7FB', '#8E9AAE'], gold: ['#FFE38A', '#D08C14'], platinum: ['#D2FFFA', '#3FB9B2'], diamond: ['#EBDCFF', '#7B4DF0'] };

  function boot() {
    C = window.Clive; t = C.t; $ = C.$; $$ = C.$$; esc = C.esc;
    D = load();
    injectDefs(); makeMotes();
    bindNav(); bindFocus(); bindGarden(); bindBazaar(); bindAwards(); bindStats(); bindTasks(); bindLog(); bindSounds(); bindPrefs(); bindKeys(); bindModals();
    applyFreezes(); rollQuests();
    resume();
    route();
    window.addEventListener('hashchange', route);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('clive:lang', function () { renderAll(); });
    document.addEventListener('clive:settings', function () { themeIcon(); });
    setInterval(tick, 250);
    setInterval(function () { sky(); if (rollQuests()) renderFocus(); }, 60000);
    var auto = null; try { auto = sessionStorage.getItem('vaqt.autostart'); sessionStorage.removeItem('vaqt.autostart'); } catch (e) {}
    if (auto && !D.run) { D.settings.mode = 'timer'; D.settings.minutes = clamp(+auto || 25, MIN_KEEP, 180); D.onboarded = true; save(); renderFocus(); startFocus(); }
    renderAll(); themeIcon(); sky();
    D.level = D.level || levelOf(xp()).n;
    if (!D.onboarded && !D.run) setTimeout(openOnboard, 400);
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) { try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {} }
  }

  /* ---------------------------------------------------------------- data */
  function defTags() { return TAGC.map(function (c, i) { return { id: 't' + i, key: i, color: c }; }); }
  /* default tags follow the interface language until the user renames them */
  function tname(x) { return x ? (x.name || t('v.tag.' + x.key)) : ''; }
  function fresh() {
    return { v: 2, sessions: [], tasks: [], tags: defTags(), coins: 0, earned: 0, xpBonus: 0, unlocked: ['lola', 'paxta'], decorOwned: [], decorOn: [], themesOwned: ['bog'], theme: 'bog',
      freezes: 0, frozen: [], quests: null, questsDone: 0, level: 1, onboarded: false, settings: Object.assign({}, DEF),
      sounds: { master: .7, only: false, muted: false, vol: Object.assign({}, SVOL), on: [] }, awards: {}, run: null, created: Date.now() };
  }
  function load() {
    var d = C.load(KEY, null), f = fresh();
    if (!d || !Array.isArray(d.sessions)) return f;
    d.settings = Object.assign({}, DEF, d.settings || {});
    d.sounds = Object.assign(f.sounds, d.sounds || {}); d.sounds.vol = Object.assign(fresh().sounds.vol, d.sounds.vol || {});
    /* v2.2: the generated brown noise became a real mountain stream */
    d.sounds.on = (d.sounds.on || []).map(function (k) { return k === 'brown' ? 'river' : k; }).filter(function (k, i, a) { return a.indexOf(k) === i && SOUNDS.some(function (x) { return x[0] === k; }); });
    delete d.sounds.vol.brown;
    ['tasks', 'unlocked', 'decorOwned', 'decorOn', 'frozen'].forEach(function (k) { if (!Array.isArray(d[k])) d[k] = f[k]; });
    if (!d.tags || !d.tags.length) d.tags = f.tags;
    var I = window.I18N || {};
    d.tags.forEach(function (x) { var m = /^t([0-5])$/.exec(x.id); if (m && x.name && ['en', 'uz', 'ru'].some(function (l) { return I[l] && I[l]['v.tag.' + m[1]] === x.name; })) { delete x.name; x.key = +m[1]; } });
    if (Array.isArray(d.awards)) { var o = {}; d.awards.forEach(function (id) { o[id] = d.created || Date.now(); }); d.awards = o; }
    d.awards = d.awards || {};
    if (!Array.isArray(d.themesOwned) || !d.themesOwned.length) d.themesOwned = ['bog'];
    ['coins', 'earned', 'xpBonus', 'freezes', 'questsDone'].forEach(function (k) { d[k] = d[k] || 0; });
    d.theme = d.theme || 'bog';
    if (d.v !== 2) { d.v = 2; d.onboarded = true; }
    return d;
  }
  var saveT;
  function save(now) { clearTimeout(saveT); if (now) { C.save(KEY, D); return; } saveT = setTimeout(function () { C.save(KEY, D); }, 200); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function sp(id) { return Garden.species(id); }
  function pname(id) { return Garden.name(id, C.S.lang); }
  function L3(o) { return o[C.S.lang] || o.en; }
  function tag(id) { return D.tags.filter(function (x) { return x.id === id; })[0] || null; }
  function task(id) { return D.tasks.filter(function (x) { return x.id === id; })[0] || null; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hm(ms) { var d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function dayStart(ms) { var d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function addDays(ms, n) { var d = new Date(ms); d.setDate(d.getDate() + n); return d.getTime(); }
  function dkey(ms) { var d = new Date(ms); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function mins(s) { return Math.round((s.actual || 0) / 60); }
  function focusSessions() { return D.sessions.filter(function (s) { return s.mode !== 'break'; }); }
  function real() { return focusSessions().filter(function (s) { return !s.sample; }); }
  function good(s) { return s.status !== 'withered'; }
  function locale() { return C.S.lang === 'uz' ? 'uz-UZ' : C.S.lang === 'ru' ? 'ru-RU' : 'en-GB'; }
  function fmtClock(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ':' + pad(m) : pad(m)) + ':' + pad(s); }
  function vib(p) { try { if (D.settings.haptics && navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function reduced() { return document.documentElement.getAttribute('data-motion') === 'reduced'; }
  function addCoins(n) { if (!n) return; D.coins += n; D.earned = (D.earned || 0) + n; var c = $('#h-coins'); if (c) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); } }

  /* ---------------------------------------------------------------- medals + shared svg */
  function starPath(cx, cy, R) {
    var r = R * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8), p = [];
    for (var k = 0; k < 16; k++) { var a = -Math.PI / 2 + k * Math.PI / 8, rr = k % 2 ? r : R; p.push((cx + Math.cos(a) * rr).toFixed(2) + ' ' + (cy + Math.sin(a) * rr).toFixed(2)); }
    return 'M' + p.join(' L') + 'Z';
  }
  var STAR64 = '';
  function injectDefs() {
    STAR64 = starPath(32, 32, 30);
    var g = Object.keys(TIER_GRAD).map(function (k) { return '<linearGradient id="mg-' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + TIER_GRAD[k][0] + '"/><stop offset="1" stop-color="' + TIER_GRAD[k][1] + '"/></linearGradient>'; }).join('');
    var d = document.createElement('div'); d.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + g + '</defs></svg>';
    document.body.appendChild(d.firstChild);
  }
  function medal(tier, icon) {
    return '<svg class="medal" viewBox="0 0 64 64" aria-hidden="true"><path d="' + STAR64 + '" fill="url(#mg-' + tier + ')"/><circle cx="32" cy="32" r="19" fill="' + TIER_GRAD[tier][1] + '" opacity=".85"/><circle cx="32" cy="32" r="19" fill="none" stroke="' + TIER_GRAD[tier][0] + '" stroke-width="1.5" opacity=".9"/>' +
      '<g style="color:#fff"><use href="#i-' + icon + '" x="21" y="21" width="22" height="22"/></g></svg>';
  }

  /* ---------------------------------------------------------------- toasts */
  function toast(html, opt) {
    opt = opt || {};
    var box = $('#vtoasts'), el = document.createElement('div');
    el.className = 'vt'; el.innerHTML = html + (opt.undo ? '<button type="button">' + esc(t('v.undo')) + '</button>' : '');
    box.appendChild(el);
    var done = false;
    function close() { if (done) return; done = true; el.classList.add('out'); setTimeout(function () { el.remove(); }, 320); }
    if (opt.undo) el.querySelector('button').addEventListener('click', function () { opt.undo(); close(); });
    setTimeout(close, opt.ms || 3600);
  }
  function toastC(msg) { toast('<span class="tx">' + esc(msg) + '</span>'); }

  /* ---------------------------------------------------------------- routing */
  var VIEWS = ['focus', 'garden', 'bazaar', 'awards', 'stats', 'tasks', 'log', 'sounds', 'prefs'], view = 'focus';
  function route() {
    var h = (location.hash || '').slice(1); view = VIEWS.indexOf(h) >= 0 ? h : 'focus';
    VIEWS.forEach(function (v) { var el = $('#v-' + v); if (el) el.hidden = v !== view; });
    $$('.vtabs [data-view],.vbottom [data-view]').forEach(function (b) { if (b.getAttribute('data-view') === view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    $('#vmore').hidden = true;
    renderView();
    window.scrollTo(0, 0);
  }
  function go(v) { if (location.hash.slice(1) === v) route(); else location.hash = v; }
  function bindNav() {
    $$('[data-view]').forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-view')); }); });
    $('[data-open-more]').addEventListener('click', function () { $('#vmore').hidden = false; });
    $('[data-close-more]').addEventListener('click', function () { $('#vmore').hidden = true; });
    $('#vmore').addEventListener('click', function (e) { if (e.target.id === 'vmore') $('#vmore').hidden = true; });
    $('#theme-btn').addEventListener('click', function () { C.set('theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
  }
  function themeIcon() { var b = $('#theme-btn'); if (b) b.innerHTML = C.icon(document.documentElement.getAttribute('data-theme') === 'dark' ? 'sun' : 'moon'); }
  function renderView() {
    ({ focus: renderFocus, garden: renderGarden, bazaar: renderBazaar, awards: renderAwards, stats: renderStats, tasks: renderTasks, log: renderLog, sounds: renderSounds, prefs: renderPrefs })[view]();
  }
  function renderAll() { renderHeader(); renderView(); }

  /* ---------------------------------------------------------------- streaks, xp, levels */
  function activeDays(all) {
    var days = {};
    (all ? focusSessions() : real()).forEach(function (s) { if (good(s)) days[dkey(s.start)] = 1; });
    D.frozen.forEach(function (k) { days[k] = 2; });
    return days;
  }
  function streaks(all) {
    var days = activeDays(all), cur = 0, d = Date.now();
    if (!days[dkey(d)]) d = addDays(d, -1);
    while (days[dkey(d)]) { cur++; d = addDays(d, -1); }
    var keys = Object.keys(days).sort(), best = 0, run = 0, prev = null;
    keys.forEach(function (k) { var ms = new Date(k + 'T12:00:00').getTime(); if (prev != null && Math.round((ms - prev) / 864e5) === 1) run++; else run = 1; best = Math.max(best, run); prev = ms; });
    return { cur: cur, best: best };
  }
  function applyFreezes() {
    if (!D.freezes) return;
    var days = activeDays(false), today = dayStart(Date.now()), y = addDays(today, -1), gap = [], d = y;
    while (!days[dkey(d)] && gap.length < 3 && d > (D.created || 0) - 864e5 * 400) { gap.push(dkey(d)); d = addDays(d, -1); }
    if (!gap.length || !days[dkey(d)] || gap.length > D.freezes) return;
    var before = streaks(false).cur;
    gap.forEach(function (k) { D.frozen.push(k); }); D.freezes -= gap.length; save(true);
    setTimeout(function () { toastC(C.fmt(t('v.bz.freeze.used'), { n: Math.max(before, streaks(false).cur) })); }, 1200);
  }
  function minutesIn(a, b, list) { return (list || focusSessions()).filter(function (s) { return good(s) && s.start >= a && s.start < b; }).reduce(function (n, s) { return n + mins(s); }, 0); }
  function todayMin() { var a = dayStart(Date.now()); return minutesIn(a, addDays(a, 1)); }
  function xp() { return real().filter(good).reduce(function (n, s) { return n + mins(s); }, 0) + (D.xpBonus || 0); }
  function xpAt(L) { return 25 * L * (L - 1); }
  function levelOf(x) { var L = Math.max(1, Math.floor((1 + Math.sqrt(1 + 4 * x / 25)) / 2)); return { n: L, from: xpAt(L), to: xpAt(L + 1), x: x }; }
  function title(L) { return t('v.title.' + (L < 5 ? 0 : L < 10 ? 1 : L < 15 ? 2 : L < 25 ? 3 : L < 40 ? 4 : 5)); }
  function renderHeader() {
    $('#h-coins b').textContent = D.coins;
    var lv = levelOf(xp()), p = (lv.x - lv.from) / (lv.to - lv.from);
    $('#h-lvnum').textContent = lv.n; $('#h-lvarc').style.strokeDashoffset = (94.25 * (1 - p)).toFixed(1);
    $('#h-level').title = C.fmt(t('v.lv'), { n: lv.n }) + ' · ' + title(lv.n);
  }
  function checkLevel() {
    var lv = levelOf(xp()).n;
    if (lv > (D.level || 1)) { var gained = lv - (D.level || 1); D.level = lv; addCoins(LEVEL_COINS * gained); save(); pendingLevel = { n: lv, coins: LEVEL_COINS * gained }; }
  }
  var pendingLevel = null;
  function showLevel() {
    if (!pendingLevel) return;
    var p = pendingLevel; pendingLevel = null;
    $('#lu-num').textContent = p.n;
    $('#lu-text').textContent = C.fmt(t('v.lv.upp'), { title: title(p.n), n: p.coins });
    $('#m-level').hidden = false; confetti(); vib([30, 60, 30]); renderHeader();
  }

  /* ---------------------------------------------------------------- quests */
  var QPOOL = [['min30', 'min', 30, 15], ['min60', 'min', 60, 25], ['min120', 'min', 120, 45], ['pl2', 'plants', 2, 15], ['pl4', 'plants', 4, 30], ['pomo', 'pomo', 1, 15], ['long45', 'long', 45, 25], ['tags2', 'tags', 2, 15], ['task', 'task', 1, 15], ['early', 'early', 1, 20], ['rate', 'rate', 1, 10], ['nowilt3', 'nowilt', 3, 25]];
  function qdef(id) { return QPOOL.filter(function (q) { return q[0] === id; })[0]; }
  function rollQuests() {
    var k = dkey(Date.now());
    if (D.quests && D.quests.day === k) return false;
    var seed = k.split('-').reduce(function (a, b) { return a * 31 + (+b); }, 7), r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var mins3 = QPOOL.filter(function (q) { return q[1] === 'min'; }), rest = QPOOL.filter(function (q) { return q[1] !== 'min'; });
    var pick = [mins3[Math.floor(r() * mins3.length)][0]], kinds = {};
    while (pick.length < 3) { var q = rest[Math.floor(r() * rest.length)]; if (!kinds[q[1]]) { kinds[q[1]] = 1; pick.push(q[0]); } }
    D.quests = { day: k, ids: pick, claimed: [] }; save();
    return true;
  }
  function qprog(q) {
    var a = dayStart(Date.now()), b = addDays(a, 1), today = real().filter(function (s) { return s.start >= a && s.start < b; }), ok = today.filter(good), plants = ok.filter(function (s) { return s.mode !== 'manual'; });
    var v = 0;
    switch (q[1]) {
      case 'min': v = ok.reduce(function (n, s) { return n + mins(s); }, 0); break;
      case 'plants': v = plants.length; break;
      case 'pomo': v = plants.filter(function (s) { return s.mode === 'pomo'; }).length; break;
      case 'long': v = plants.some(function (s) { return mins(s) >= q[2]; }) ? 1 : 0; return { v: v, n: 1 };
      case 'tags': var tg = {}; ok.forEach(function (s) { if (s.tag) tg[s.tag] = 1; }); v = Object.keys(tg).length; break;
      case 'task': v = D.tasks.filter(function (x) { return x.done && x.doneAt >= a; }).length; break;
      case 'early': v = plants.some(function (s) { return new Date(s.start).getHours() < 10; }) ? 1 : 0; break;
      case 'rate': v = today.filter(function (s) { return s.rating; }).length; break;
      case 'nowilt': v = today.some(function (s) { return !good(s); }) ? 0 : plants.length; break;
    }
    return { v: Math.min(v, q[1] === 'long' ? 1 : q[2]), n: q[1] === 'long' ? 1 : q[2] };
  }
  function qlabel(q) { var k = { min: 'v.q.min', plants: 'v.q.plants', pomo: 'v.q.pomo', long: 'v.q.long', tags: 'v.q.tags', task: 'v.q.task', early: 'v.q.early', rate: 'v.q.rate', nowilt: 'v.q.nowilt' }[q[1]]; return C.fmt(t(k), { n: q[2] }); }
  function renderQuests() {
    rollQuests();
    var done = 0;
    $('#quests').innerHTML = D.quests.ids.map(function (id) {
      var q = qdef(id); if (!q) return ''; var pr = qprog(q), claimed = D.quests.claimed.indexOf(id) >= 0, ok = pr.v >= pr.n; if (claimed) done++;
      return '<li class="' + (claimed ? 'claimed' : ok ? 'ok' : '') + '"><span class="qt">' + esc(qlabel(q)) + '</span>' +
        (claimed ? '<span class="qr">' + C.icon('check') + esc(t('v.q.done')) + '</span>' : ok ? '<button type="button" data-claim="' + id + '">' + esc(t('v.q.claim')) + ' +' + q[3] + '</button>' : '<span class="qr">' + C.icon('coin') + q[3] + '</span>') +
        '<span class="qb"><i style="width:' + (pr.v / pr.n * 100).toFixed(0) + '%"></i></span></li>';
    }).join('');
    $('#q-count').textContent = done + '/3';
  }

  /* ---------------------------------------------------------------- awards */
  var AW = window.VAQT_AWARDS || [];
  var TARGET = { g1: ['plants', 1], g10: ['plants', 10], g50: ['plants', 50], g100: ['plants', 100], g250: ['plants', 250], g500: ['plants', 500],
    t60: ['total', 60], t600: ['total', 600], t3000: ['total', 3000], t6000: ['total', 6000], t15000: ['total', 15000], t60000: ['total', 60000],
    s3: ['best', 3], s7: ['best', 7], s14: ['best', 14], s30: ['best', 30], s60: ['best', 60], s100: ['best', 100],
    l60: ['longest', 60], l90: ['longest', 90], l120: ['longest', 120], l180: ['longest', 180], d120: ['maxDay', 120], d240: ['maxDay', 240], d360: ['maxDay', 360],
    p4: ['pomoDay', 4], p8: ['pomoDay', 8], early: ['early', 1], owl: ['owl', 1], weekend: ['weekend', 1], modes: ['modes', 3], iron: ['iron', 10],
    c5: ['species', 5], c10: ['species', 10], c20: ['species', 20], call: ['species', (window.Garden ? Garden.SPECIES.length : 34)], gold1: ['golden', 1], gold5: ['golden', 5], leg: ['legendary', 1],
    tk10: ['tasksDone', 10], tk50: ['tasksDone', 50], tags5: ['tags', 5], manual: ['manual', 1], refl10: ['rated', 10],
    dec1: ['decor', 1], dec6: ['decor', 6], dec12: ['decor', 12], decall: ['decor', (window.Garden ? Garden.DECOR.length : 16)], theme1: ['themes', 1], seeds10: ['seeds', 10],
    goal1: ['goalDays', 1], goal7: ['goalDays', 7], goal30: ['goalDays', 30], q10: ['quests', 10], q50: ['quests', 50], lv10: ['level', 10], lv25: ['level', 25] };
  function metrics() {
    var all = real(), ok = all.filter(good), plants = ok.filter(function (s) { return s.mode !== 'manual'; }), M = {};
    M.plants = plants.length; M.total = ok.reduce(function (n, s) { return n + mins(s); }, 0); M.best = streaks(false).best;
    M.longest = ok.reduce(function (m, s) { return Math.max(m, mins(s)); }, 0);
    var perDay = {}, pomo = {}; ok.forEach(function (s) { var k = dkey(s.start); perDay[k] = (perDay[k] || 0) + mins(s); if (s.mode === 'pomo') pomo[k] = (pomo[k] || 0) + 1; });
    M.maxDay = Object.keys(perDay).reduce(function (m, k) { return Math.max(m, perDay[k]); }, 0);
    M.pomoDay = Object.keys(pomo).reduce(function (m, k) { return Math.max(m, pomo[k]); }, 0);
    M.goalDays = Object.keys(perDay).filter(function (k) { return perDay[k] >= D.settings.goal; }).length;
    M.early = plants.some(function (s) { return new Date(s.start).getHours() < 7; }) ? 1 : 0;
    M.owl = plants.some(function (s) { return new Date(s.start).getHours() >= 23; }) ? 1 : 0;
    var sat = {}; plants.forEach(function (s) { var d = new Date(s.start); if (d.getDay() === 6) sat[dkey(s.start)] = 1; });
    M.weekend = plants.some(function (s) { var d = new Date(s.start); return d.getDay() === 0 && sat[dkey(addDays(dayStart(s.start), -1))]; }) ? 1 : 0;
    var md = {}; plants.forEach(function (s) { md[s.mode] = 1; }); M.modes = ['timer', 'pomo', 'flow'].filter(function (m) { return md[m]; }).length;
    var run = 0, bestRun = 0; all.filter(function (s) { return s.mode !== 'manual' && s.deep === 'strict'; }).forEach(function (s) { if (good(s)) { run++; bestRun = Math.max(bestRun, run); } else run = 0; }); M.iron = bestRun;
    var spc = {}; plants.forEach(function (s) { spc[s.species] = 1; }); M.species = Object.keys(spc).length;
    M.golden = plants.filter(function (s) { return s.golden; }).length;
    M.legendary = plants.some(function (s) { return sp(s.species).tier === 'legendary'; }) ? 1 : 0;
    M.tasksDone = D.tasks.filter(function (x) { return x.done && !x.sample; }).length;
    var tg = {}; ok.forEach(function (s) { if (s.tag) tg[s.tag] = 1; }); M.tags = Object.keys(tg).length;
    M.manual = all.some(function (s) { return s.mode === 'manual'; }) ? 1 : 0;
    M.rated = all.filter(function (s) { return s.rating; }).length;
    M.decor = D.decorOwned.length; M.themes = D.themesOwned.length - 1; M.seeds = D.unlocked.length; M.quests = D.questsDone || 0; M.level = levelOf(xp()).n;
    return M;
  }
  function awardState() {
    var M = metrics();
    return AW.map(function (a) { var tg = TARGET[a.id] || ['plants', 1], v = M[tg[0]] || 0; return { id: a.id, icon: a.icon, tier: a.tier, cat: a.cat, v: Math.min(v, tg[1]), n: tg[1], got: !!D.awards[a.id] || v >= tg[1], at: D.awards[a.id] }; });
  }
  function checkAwards() {
    var news = [];
    awardState().forEach(function (a) { if (a.v >= a.n && !D.awards[a.id]) { D.awards[a.id] = Date.now(); var rw = TIER_REWARD[a.tier]; addCoins(rw); news.push([a, rw]); } });
    if (news.length) { save(); renderHeader(); vib(40); }
    news.forEach(function (x, i) {
      setTimeout(function () { toast(medal(x[0].tier, x[0].icon) + '<span class="tx">' + esc(t('v.a.' + x[0].id)) + '<small>' + esc(t('v.tier.' + x[0].tier)) + ' · ' + esc(C.fmt(t('v.a.reward'), { n: x[1] })) + '</small></span>', { ms: 4200 }); }, i * 700);
    });
    checkLevel();
  }

  /* ---------------------------------------------------------------- focus view */
  var dragging = false, lastIsland = '', holdT = null, holdStart = 0;
  function bindFocus() {
    $$('#modes [data-mode]').forEach(function (b) { b.addEventListener('click', function () { if (D.run) return; D.settings.mode = b.getAttribute('data-mode'); fitSpecies(); save(); renderFocus(); }); });
    var dial = $('#dial'), ticks = '';
    for (var i = 0; i < 36; i++) { var a = i / 36 * Math.PI * 2, big = i % 3 === 0, r1 = big ? 151 : 153, r2 = 159; ticks += '<line ' + (big ? 'class="big" ' : '') + 'x1="' + (160 + Math.sin(a) * r1).toFixed(1) + '" y1="' + (160 - Math.cos(a) * r1).toFixed(1) + '" x2="' + (160 + Math.sin(a) * r2).toFixed(1) + '" y2="' + (160 - Math.cos(a) * r2).toFixed(1) + '"/>'; }
    $('#ticks').innerHTML = ticks;
    function setFrom(e) {
      var r = dial.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      var a = Math.atan2(x, -y); if (a < 0) a += Math.PI * 2;
      var m = Math.round(a / (Math.PI * 2) * 180 / 5) * 5; if (m === 0) m = 180;
      if (D.settings.minutes !== clamp(m, MIN_KEEP, 180)) { D.settings.minutes = clamp(m, MIN_KEEP, 180); vib(4); }
      fitSpecies(); renderFocus(); save();
    }
    dial.addEventListener('pointerdown', function (e) { if (D.run || D.settings.mode !== 'timer') return; dragging = true; dial.setPointerCapture(e.pointerId); setFrom(e); });
    dial.addEventListener('pointermove', function (e) { if (dragging) setFrom(e); });
    dial.addEventListener('pointerup', function () { dragging = false; });
    dial.addEventListener('pointercancel', function () { dragging = false; });
    dial.addEventListener('keydown', function (e) {
      if (D.run || D.settings.mode !== 'timer') return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { bump(5); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { bump(-5); e.preventDefault(); }
    });
    $('#presets').addEventListener('click', function (e) { var b = e.target.closest('[data-pre]'); if (!b || D.run) return; D.settings.mode = 'timer'; D.settings.minutes = +b.getAttribute('data-pre'); fitSpecies(); save(); renderFocus(); });
    $('#start').addEventListener('click', function () { if (D.run) return; if (D.pendingBreak) startBreak(); else startFocus(); });
    $('#pause').addEventListener('click', togglePause);
    $('#stopflow').addEventListener('click', finishFlow);
    $('#plus5').addEventListener('click', function () { if (D.run && D.run.planned) { D.run.planned = Math.min(D.run.planned + 300, 180 * 60 + 600); save(); toastC(t('v.plus5')); } });
    $('#skip').addEventListener('click', function () { if (D.run && D.run.phase !== 'focus') endBreak(true); else if (D.pendingBreak) { D.pendingBreak = null; save(); renderFocus(); } });
    var gu = $('#giveup');
    function hold(e) {
      if (!D.run) return; e.preventDefault();
      if (elapsed() < 10) { cancelRun(); return; }
      holdStart = performance.now(); gu.lastElementChild.textContent = t('v.hold');
      (function step() { var p = (performance.now() - holdStart) / 1300; gu.style.setProperty('--p', Math.min(1, p)); if (p >= 1) { holdT = null; release(); wither('gaveup'); return; } holdT = requestAnimationFrame(step); })();
    }
    function release() { if (holdT) cancelAnimationFrame(holdT); holdT = null; gu.style.setProperty('--p', 0); gu.lastElementChild.textContent = elapsed() < 10 ? t('v.cancel') : t('v.giveup'); }
    gu.addEventListener('pointerdown', hold); gu.addEventListener('pointerup', release); gu.addEventListener('pointerleave', release);
    gu.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) hold(e); });
    gu.addEventListener('keyup', function (e) { if (e.key === 'Enter' || e.key === ' ') release(); });
    $('#f-task').addEventListener('change', function (e) { D.settings.task = e.target.value || null; var tk = task(D.settings.task); if (tk && tk.tag) D.settings.tag = tk.tag; save(); renderFocus(); });
    $('#intent').addEventListener('input', function (e) { D.settings.intent = e.target.value; save(); });
    $('#seeds').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sp]'); if (!b || D.run) return;
      var id = b.getAttribute('data-sp'), s = sp(id);
      D.settings.species = id;
      if (D.settings.mode === 'timer' && D.settings.minutes < s.min) { D.settings.minutes = s.min; toastC(C.fmt(t('v.minfor'), { plant: pname(id), n: s.min })); }
      if (D.settings.mode === 'pomo' && D.settings.focus < s.min) toastC(C.fmt(t('v.minfor'), { plant: pname(id), n: s.min }));
      fitSpecies(); save(); renderFocus();
    });
    $('#tagpick').addEventListener('click', function (e) { var b = e.target.closest('[data-tag]'); if (!b) return; D.settings.tag = b.getAttribute('data-tag') || null; if (D.run) D.run.tag = D.settings.tag; save(); renderFocus(); });
    $$('#deep [data-deep]').forEach(function (b) { b.addEventListener('click', function () { if (D.run && D.run.phase === 'focus') return; D.settings.deep = b.getAttribute('data-deep'); save(); renderFocus(); }); });
    $('#qsnd').addEventListener('click', function (e) { if (e.target.closest('[data-view-go]')) { go('sounds'); return; } var b = e.target.closest('[data-snd]'); if (b) toggleSound(b.getAttribute('data-snd')); });
    $('#quests').addEventListener('click', function (e) {
      var b = e.target.closest('[data-claim]'); if (!b) return; var id = b.getAttribute('data-claim'), q = qdef(id);
      if (!q || D.quests.claimed.indexOf(id) >= 0 || qprog(q).v < qprog(q).n) return;
      D.quests.claimed.push(id); D.questsDone = (D.questsDone || 0) + 1; addCoins(q[3]); save(true); vib(20);
      toastC(C.fmt(t('v.q.claimed'), { n: q[3] })); renderHeader(); renderQuests(); checkAwards(); setTimeout(showLevel, 300);
    });
    $('#pip').addEventListener('click', openPip);
    $('#fs').addEventListener('click', toggleZen);
    $('#mute').addEventListener('click', function () { D.sounds.muted = !D.sounds.muted; applyMaster(); save(); renderFocus(); });
  }
  function bump(n) { D.settings.minutes = clamp(D.settings.minutes + n, MIN_KEEP, 180); fitSpecies(); save(); renderFocus(); }
  function plannedMinutes() { var s = D.settings; return s.mode === 'pomo' ? s.focus : s.mode === 'flow' ? 0 : s.minutes; }
  function fitSpecies() {
    if (D.unlocked.indexOf(D.settings.species) < 0) D.settings.species = 'lola';
    var pm = plannedMinutes();
    if (pm && pm < sp(D.settings.species).min) {
      var ok = Garden.SPECIES.filter(function (x) { return D.unlocked.indexOf(x.id) >= 0 && x.min <= pm; });
      D.settings.species = ok.length ? ok[ok.length - 1].id : 'lola';
    }
  }
  function elapsed(now) { var r = D.run; if (!r) return 0; now = now || Date.now(); return Math.max(0, (now - r.start - (r.pausedTotal || 0) - (r.pausedAt ? now - r.pausedAt : 0)) / 1000); }
  function progress() {
    var r = D.run; if (!r) return 0;
    if (r.phase !== 'focus') return 1;
    if (!r.planned) return Math.min(1, elapsed() / (Math.max(sp(r.species).min, 25) * 60));
    return Math.min(1, elapsed() / r.planned);
  }
  function renderLevelCard() {
    var lv = levelOf(xp()), p = (lv.x - lv.from) / (lv.to - lv.from);
    $('#lv-num').textContent = lv.n; $('#lv-title').textContent = C.fmt(t('v.lv'), { n: lv.n }) + ' · ' + title(lv.n);
    $('#lv-xp').textContent = C.fmt(t('v.lv.next'), { a: lv.x - lv.from, b: lv.to - lv.from, n: lv.n + 1 });
    $('#lv-bar').style.width = (p * 100).toFixed(1) + '%';
  }
  function renderFocus() {
    var s = D.settings, r = D.run, focusing = r && r.phase === 'focus', breaking = r && r.phase !== 'focus', L = C.S.lang;
    document.body.classList.toggle('running', !!r);
    document.body.classList.toggle('break-mode', !!breaking || !!D.pendingBreak);
    $$('#modes [data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === s.mode)); });
    $('#presets').innerHTML = s.mode === 'timer' ? PRESETS.map(function (m) { return '<button type="button" data-pre="' + m + '" aria-pressed="' + (s.minutes === m) + '">' + m + ' ' + esc(t('v.min')) + '</button>'; }).join('') : '';
    var dots = ''; if (s.mode === 'pomo') for (var i = 1; i <= s.rounds; i++) dots += '<i class="' + (i < s.round ? 'on' : '') + (i === s.round ? ' cur' : '') + '"></i>';
    $('#pomodots').innerHTML = dots;
    var owned = Garden.SPECIES.filter(function (x) { return D.unlocked.indexOf(x.id) >= 0; }), curId = r && r.species ? r.species : s.species;
    $('#seeds').innerHTML = owned.map(function (x, k) {
      return '<button type="button" data-sp="' + x.id + '" aria-pressed="' + (x.id === curId) + '" title="' + esc(L3(x.note)) + '"' + (r ? ' disabled' : '') + '><i class="tier" style="--tc:' + Garden.TIERS[x.tier].c + '"></i><svg viewBox="' + Garden.box(x.id) + '" aria-hidden="true">' + Garden.plant(x.id, 1, { seed: 3 + k }) + '</svg>' + esc(L3(x.name)) + '</button>';
    }).join('');
    var cur = sp(curId);
    $('#seednote').textContent = L3(cur.note) + ' · ' + L3(Garden.TIERS[cur.tier].name) + ' · ' + C.fmt(t('v.recmin'), { n: cur.min });
    var tg = r ? r.tag : s.tag;
    $('#tagpick').innerHTML = D.tags.map(function (x) { return '<button type="button" data-tag="' + x.id + '" style="--c:' + esc(x.color) + '" aria-pressed="' + (x.id === tg) + '"><i></i>' + esc(tname(x)) + '</button>'; }).join('') + '<button type="button" data-tag="" style="--c:var(--mute)" aria-pressed="' + (!tg) + '"><i></i>' + esc(t('v.notag')) + '</button>';
    var open = D.tasks.filter(function (x) { return !x.done; });
    $('#f-task').innerHTML = '<option value="">' + esc(t('v.notask')) + '</option>' + open.map(function (x) { return '<option value="' + x.id + '"' + (x.id === s.task ? ' selected' : '') + '>' + esc(x.title) + '</option>'; }).join('');
    $('#f-task').disabled = !!r;
    var ii = $('#intent'); if (document.activeElement !== ii) ii.value = (r ? r.intent : s.intent) || '';
    $$('#deep [data-deep]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-deep') === s.deep)); b.disabled = !!focusing; });
    $('#deepnote').textContent = t(s.deep === 'strict' ? 'v.p.deep.s' : s.deep === 'gentle' ? 'v.p.deep.g' : 'v.p.deep.o');
    var qk = QUICK.concat(D.sounds.on.filter(function (k) { return QUICK.indexOf(k) < 0; }));
    $('#qsnd').innerHTML = qk.map(function (k) { var x = sinfo(k); return x ? '<button type="button" data-snd="' + k + '" aria-pressed="' + (D.sounds.on.indexOf(k) >= 0) + '" title="' + esc(t('v.snd.' + k)) + '">' + C.icon(x[1]) + '<span>' + esc(t('v.snd.' + k)) + '</span></button>' : ''; }).join('') + '<button type="button" class="more" data-view-go="sounds">' + C.icon('sliders') + '<span>' + esc(t('v.snd.all')) + '</span></button>';
    soundState();
    $('#mute').innerHTML = C.icon(D.sounds.muted ? 'mute' : 'volume');
    var pending = !r && D.pendingBreak;
    $('#start').hidden = !!r;
    $('#start span').textContent = pending ? t('v.startbreak') : t('v.start');
    $('#pause').hidden = !r || (focusing && s.deep === 'strict') || (focusing && !r.planned);
    $('#pause span').textContent = r && r.pausedAt ? t('v.resume') : t('v.pause');
    $('#giveup').hidden = !focusing || !r.planned;
    $('#stopflow').hidden = !(focusing && !r.planned);
    $('#plus5').hidden = !(focusing && r.planned && r.mode === 'timer');
    $('#skip').hidden = !(breaking || pending);
    $('#dial').setAttribute('aria-valuenow', s.minutes);
    $('#dial').setAttribute('aria-disabled', String(!!r || s.mode !== 'timer'));
    $('#breath').hidden = !breaking; $('#tip').hidden = !(breaking || pending);
    lastIsland = '';
    renderLevelCard(); renderToday(); renderQuests(); paint();
  }
  function renderToday() {
    var tm = todayMin(), g = D.settings.goal;
    $('#goal-num').textContent = tm;
    $('#goal-txt').textContent = tm >= g ? t('v.goalmet') : C.fmt(t('v.goal'), { a: tm, b: g });
    $('#goal-arc').style.strokeDashoffset = (314.16 * (1 - Math.min(1, tm / g))).toFixed(1);
    var a = dayStart(Date.now()), b = addDays(a, 1), today = focusSessions().filter(function (s) { return s.start >= a && s.start < b; });
    $('#ft-plants').textContent = today.filter(function (s) { return good(s) && s.mode !== 'manual'; }).length;
    $('#ft-sessions').textContent = today.length;
    $('#ft-streak').textContent = streaks(true).cur;
    $('#f-timeline').innerHTML = timeline(today, a);
  }
  function timeline(list, a) {
    var h = list.map(function (s) {
      var l = (s.start - a) / 864e5 * 100, w = Math.max(.25, (s.actual || 0) * 1000 / 864e5 * 100), tg = tag(s.tag);
      return '<i class="' + (good(s) ? '' : 'w') + '" style="left:' + l.toFixed(2) + '%;width:' + w.toFixed(2) + '%;--c:' + (tg ? esc(tg.color) : 'var(--mute)') + '" title="' + esc(hm(s.start) + ' · ' + mins(s) + ' ' + t('v.min') + (tg ? ' · ' + tname(tg) : '')) + '"></i>';
    }).join('');
    if (Date.now() >= a && Date.now() < a + 864e5) h += '<span class="now" style="left:' + ((Date.now() - a) / 864e5 * 100).toFixed(2) + '%"></span>';
    return h;
  }
  /* sky inside the dial follows the local time of day */
  function sky() {
    var h = new Date().getHours() + new Date().getMinutes() / 60, el = $('#sky'), m = $('#motes'), o;
    if (h >= 21 || h < 5) o = { bg: 'radial-gradient(120% 90% at 50% 100%,#24306E,#0A0F2E 70%)', orb: '#F3F1E6', g: 'rgba(243,241,230,.35)', x: '68%', y: '14%', st: 1, mote: '#D8FF7A' };
    else if (h < 8) o = { bg: 'linear-gradient(#2E2C6E,#8C5A8F 55%,#F5A06B)', orb: '#FFC27A', g: 'rgba(255,170,90,.6)', x: '18%', y: (60 - (h - 5) * 12) + '%', st: .35, mote: '#FFE2B0' };
    else if (h < 17) o = { bg: 'linear-gradient(#2F7BEA,#7EC3FF 60%,#CDEBFF)', orb: '#FFF3B0', g: 'rgba(255,243,176,.8)', x: (20 + (h - 8) / 9 * 60) + '%', y: '12%', st: 0, mote: '#FFF6CF' };
    else o = { bg: 'linear-gradient(#3B2A72,#B4507A 55%,#FF9A5C)', orb: '#FFB36B', g: 'rgba(255,160,90,.7)', x: '76%', y: (30 + (h - 17) * 9) + '%', st: .45, mote: '#FFD6A0' };
    el.style.setProperty('--sky', o.bg); el.style.setProperty('--orb', o.orb); el.style.setProperty('--orbg', o.g); el.style.setProperty('--ox', o.x); el.style.setProperty('--oy', o.y); el.style.setProperty('--st', o.st);
    m.style.setProperty('--mote', o.mote);
  }
  function makeMotes() {
    var m = $('#motes'), h = '';
    for (var i = 0; i < 16; i++) h += '<i style="left:' + (8 + Math.random() * 84).toFixed(1) + '%;--t:' + (5 + Math.random() * 6).toFixed(1) + 's;--dl:' + (Math.random() * 6).toFixed(1) + 's;--dx:' + ((Math.random() - .5) * 60).toFixed(0) + 'px;width:' + (3 + Math.random() * 4).toFixed(1) + 'px;height:auto;aspect-ratio:1"></i>';
    m.innerHTML = h;
  }
  /* per-frame: dial, island, time, status, title */
  var tipT = 0, tipI = 0;
  function paint() {
    var r = D.run, s = D.settings, arc = $('#arc'), knob = $('#knob'), CIRC = 917.35, frac, sec;
    if (!r) { var pm = plannedMinutes(); frac = s.mode === 'flow' ? 0 : pm / 180; sec = s.mode === 'flow' ? 0 : pm * 60; if (D.pendingBreak) { sec = D.pendingBreak.min * 60; frac = D.pendingBreak.min / 180; } }
    else if (r.phase === 'focus') { if (r.planned) { sec = r.planned - elapsed(); frac = 1 - elapsed() / r.planned; } else { sec = elapsed(); frac = (elapsed() % 3600) / 3600; } }
    else { sec = r.planned - elapsed(); frac = Math.max(0, sec / r.planned); }
    frac = clamp(frac, 0, 1);
    arc.style.strokeDashoffset = (CIRC * (1 - frac)).toFixed(1);
    var ang = frac * Math.PI * 2;
    knob.setAttribute('cx', (160 + Math.sin(ang) * 146).toFixed(1)); knob.setAttribute('cy', (160 - Math.cos(ang) * 146).toFixed(1));
    var tm = fmtClock(sec);
    $('#time').textContent = tm;
    var spc = r && r.species ? r.species : s.species, p = r ? (r.phase === 'focus' ? progress() : 1) : 0;
    var key = spc + ':' + p.toFixed(3) + ':' + D.theme;
    if (key !== lastIsland) { $('#island').innerHTML = Garden.island(spc, r ? Math.max(p, .04) : .04, { seed: 4, label: pname(spc), theme: D.theme }); lastIsland = key; }
    var st;
    if (!r) st = D.pendingBreak ? t(D.pendingBreak.long ? 'v.longbreak' : 'v.break') : C.fmt(t('v.ready'), { plant: pname(spc) });
    else if (r.pausedAt) st = t('v.paused');
    else if (r.phase !== 'focus') st = t(r.phase === 'long' ? 'v.longbreak' : 'v.break');
    else if (!r.planned) st = t('v.flow');
    else st = C.fmt(t(s.deep === 'strict' ? 'v.growing' : 'v.growing.g'), { plant: pname(spc) }) + (r.interruptions ? ' · ' + C.fmt(t('v.interrupt'), { n: r.interruptions }) : '');
    if (s.mode === 'pomo' && (!r || r.phase === 'focus')) st = C.fmt(t('v.round'), { a: s.round, b: s.rounds }) + ' · ' + st;
    var se = $('#status'); if (se.textContent !== st) se.textContent = st;
    var gu = $('#giveup'); if (r && !gu.hidden && !holdT) { var gl = elapsed() < 10 ? t('v.cancel') : t('v.giveup'); if (gu.lastElementChild.textContent !== gl) gu.lastElementChild.textContent = gl; }
    if (r && r.phase !== 'focus') { var ph = Math.floor((elapsed() % 16) / 4), bt = t(['v.br.in', 'v.br.hold', 'v.br.out', 'v.br.hold'][ph]); if ($('#breath-t').textContent !== bt) $('#breath-t').textContent = bt; }
    if (!$('#tip').hidden && Date.now() - tipT > 20000) { tipT = Date.now(); $('#tip').textContent = t('v.tip.' + (tipI++ % 6)); }
    document.title = r ? tm + ' · ' + (r.phase === 'focus' ? pname(spc) : t('v.p.short')) + ' · Vaqt' : 'Vaqt · ' + t('pd.vaqt.tag');
    favicon(r ? (r.phase === 'focus' ? (r.planned ? 1 - frac : p) : frac) : null, r && r.phase !== 'focus');
    pipPaint(tm, spc, p, r);
  }
  var favEl, favLast = '';
  function favicon(p, brk) {
    favEl = favEl || document.getElementById('fav'); if (!favEl) return;
    var k = p == null ? 'n' : (Math.round(p * 40) + (brk ? 'b' : '')); if (k === favLast) return; favLast = k;
    if (p == null) { favEl.href = 'icon.svg'; return; }
    try {
      var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d');
      x.fillStyle = '#0B2A1F'; x.beginPath(); x.arc(32, 32, 30, 0, 6.283); x.fill();
      x.strokeStyle = '#1E5C45'; x.lineWidth = 7; x.beginPath(); x.arc(32, 32, 24, 0, 6.283); x.stroke();
      x.strokeStyle = brk ? '#F5C04A' : '#3DDC97'; x.lineCap = 'round'; x.beginPath(); x.arc(32, 32, 24, -Math.PI / 2, -Math.PI / 2 + Math.max(.05, p) * 6.283); x.stroke();
      x.fillStyle = brk ? '#F5C04A' : '#E5484D'; x.beginPath(); x.arc(32, 32, 8, 0, 6.283); x.fill();
      favEl.href = c.toDataURL('image/png');
    } catch (e) {}
  }

  /* ---------------------------------------------------------------- the run */
  function startFocus() {
    if (D.run) return; fitSpecies();
    var s = D.settings; D.pendingBreak = null;
    D.run = { id: uid(), phase: 'focus', mode: s.mode, start: Date.now(), planned: plannedMinutes() * 60, species: s.species, tag: s.tag, task: s.task, intent: (s.intent || '').trim(), deep: s.deep, pausedAt: null, pausedTotal: 0, interruptions: 0, hiddenAt: null, lastBeat: Date.now() };
    save(true); wake(true); syncSounds(); renderFocus(); ac(); vib(15);
    if (innerWidth <= 900 && view === 'focus') window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }
  function startBreak() {
    var pb = D.pendingBreak; if (!pb) return; D.pendingBreak = null;
    D.run = { id: uid(), phase: pb.long ? 'long' : 'break', mode: 'pomo', start: Date.now(), planned: pb.min * 60, pausedAt: null, pausedTotal: 0, lastBeat: Date.now() };
    tipT = 0; save(true); wake(true); syncSounds(); renderFocus();
  }
  function togglePause() {
    var r = D.run; if (!r || (r.phase === 'focus' && D.settings.deep === 'strict')) return;
    if (r.pausedAt) { r.pausedTotal += Date.now() - r.pausedAt; r.pausedAt = null; } else r.pausedAt = Date.now();
    save(true); syncSounds(); renderFocus();
  }
  function cancelRun() { D.run = null; save(true); wake(false); syncSounds(); renderFocus(); toastC(t('v.cancel.ok')); }
  function record(status, endMs) {
    var r = D.run, act = Math.round(elapsed(endMs));
    if (r.planned && status === 'done') act = r.planned;
    var s = { id: r.id, start: r.start, end: endMs || Date.now(), planned: r.planned, actual: act, mode: r.mode, species: r.species, tag: r.tag, task: r.task, intent: r.intent, deep: r.deep, status: status, interruptions: r.interruptions || 0 };
    if (status === 'done' && Math.random() < GOLD_CHANCE) s.golden = true;
    D.sessions.push(s); return s;
  }
  function tick() {
    var r = D.run; if (!r) return;
    var now = Date.now();
    if (document.hidden && r.phase === 'focus' && r.hiddenAt && !r.pausedAt && D.settings.deep === 'strict' && now - r.hiddenAt > D.settings.grace * 1000) { wither('away', r.hiddenAt + D.settings.grace * 1000); return; }
    if (!document.hidden) { r.lastBeat = now; if (now % 5000 < 260) save(); }
    if (!r.pausedAt && r.planned && elapsed(now) >= r.planned) { if (r.phase === 'focus') completeFocus(r.start + r.planned + (r.pausedTotal || 0)); else endBreak(false); return; }
    if (view === 'focus') paint(); else pipPaint(fmtClock(r.planned ? r.planned - elapsed() : elapsed()), r.species, progress(), r);
  }
  function grant(s) {
    var m = mins(s), coins = m + (s.golden ? 25 : 0), before = xp() - m;
    addCoins(coins);
    return { coins: coins, xp: m, before: before, after: xp() };
  }
  function completeFocus(endMs) {
    var r = D.run, s = record('done', Math.min(endMs || Date.now(), Date.now())), g = grant(s);
    D.run = null;
    var st = D.settings, pomo = r.mode === 'pomo';
    if (pomo) { var long = st.round >= st.rounds; D.pendingBreak = { min: long ? st.long : st.short, long: long }; st.round = long ? 1 : st.round + 1; }
    save(true); wake(false); chime(); vib([20, 40, 20]); renderHeader();
    notify(C.fmt(t('v.notif.t'), { plant: pname(s.species) }), C.fmt(t('v.done.p'), { min: mins(s) }));
    showDone(s, g);
    if (pomo && st.autoBreak) startBreak(); else syncSounds();
    renderFocus(); checkAwards();
  }
  function endBreak(skipped) {
    D.run = null; save(true); wake(false);
    if (!skipped) { chime(); vib(30); notify('Vaqt', t('v.notif.b')); }
    syncSounds();
    if (D.settings.autoFocus && !skipped) startFocus(); else renderFocus();
  }
  function finishFlow() {
    var r = D.run; if (!r) return;
    if (elapsed() < MIN_KEEP * 60) { D.run = null; save(true); wake(false); syncSounds(); renderFocus(); toastC(C.fmt(t('v.tooshort'), { n: MIN_KEEP })); return; }
    var s = record('done'), g = grant(s); D.run = null; save(true); wake(false); chime(); vib([20, 40, 20]); renderHeader(); syncSounds(); showDone(s, g); renderFocus(); checkAwards();
  }
  function wither(reason, at) {
    var r = D.run; if (!r || r.phase !== 'focus') return;
    var s = record('withered', at || Date.now());
    D.run = null; save(true); wake(false); syncSounds(); renderFocus(); renderHeader(); vib(120);
    $('#w-island').innerHTML = Garden.island(s.species, Math.max(.5, s.planned ? s.actual / s.planned : .6), { withered: true, seed: 4, theme: D.theme });
    $('#w-title').textContent = C.fmt(t('v.wither.t'), { plant: pname(s.species) });
    $('#w-text').textContent = reason === 'away' ? C.fmt(t('v.wither.p'), { n: D.settings.grace }) : t('v.wither.g');
    $('#m-wither').hidden = false;
  }
  var doneS = null;
  function showDone(s, g) {
    doneS = s;
    $('#d-island').innerHTML = Garden.island(s.species, 1, { seed: 4, golden: s.golden, theme: D.theme });
    $('#d-title').textContent = C.fmt(t(s.golden ? 'v.done.gold' : 'v.done.t'), { plant: pname(s.species) });
    $('#d-text').textContent = s.golden ? t('v.done.goldp') : C.fmt(t('v.done.p'), { min: mins(s) });
    $('#d-coins b').textContent = C.fmt(t('v.coins'), { n: g.coins });
    $('#d-xp b').textContent = C.fmt(t('v.xp'), { n: g.xp });
    var lb = levelOf(g.before), la = levelOf(g.after), bar = $('#d-xpbar');
    bar.style.transition = 'none'; bar.style.width = (la.n > lb.n ? 0 : (g.before - lb.from) / (lb.to - lb.from) * 100) + '%'; void bar.offsetWidth;
    bar.style.transition = ''; setTimeout(function () { bar.style.width = ((g.after - la.from) / (la.to - la.from) * 100).toFixed(1) + '%'; }, 150);
    $('#d-xptxt').textContent = C.fmt(t('v.lv.next'), { a: g.after - la.from, b: la.to - la.from, n: la.n + 1 });
    $('#d-rate').innerHTML = [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" role="radio" aria-checked="false" data-r="' + n + '">' + C.icon(['wave', 'cloud', 'leaf', 'target', 'sparkle'][n - 1]) + esc(t('v.rate.r' + n)) + '</button>'; }).join('');
    $('#d-note').value = '';
    var tk = task(s.task), db = $('#d-task');
    db.hidden = !tk || tk.done;
    if (tk) { db.querySelector('span').textContent = C.fmt(t('v.taskdone'), { task: tk.title.slice(0, 40) }); db.onclick = function () { tk.done = true; tk.doneAt = Date.now(); if (D.settings.task === tk.id) D.settings.task = null; save(); db.hidden = true; checkAwards(); renderFocus(); }; }
    var nx = $('#d-next');
    nx.querySelector('span').textContent = D.run && D.run.phase !== 'focus' ? t('v.close') : D.pendingBreak ? t('v.startbreak') : t('v.again');
    nx.onclick = function () { closeDone(); if (D.run) return; if (D.pendingBreak) startBreak(); else startFocus(); };
    $('#m-done').hidden = false;
    if (D.settings.confetti) confetti(s.golden);
  }
  function closeDone() {
    if (doneS) { var n = $('#d-note').value.trim(); if (n) doneS.note = n.slice(0, 140); save(); doneS = null; renderQuests(); checkAwards(); }
    $('#m-done').hidden = true; setTimeout(showLevel, 250);
  }
  function resume() {
    var r = D.run; if (!r) return;
    var now = Date.now();
    if (r.phase === 'focus' && D.settings.deep === 'strict' && !r.pausedAt) { var away = now - (r.lastBeat || now); if (away > D.settings.grace * 1000) { wither('away', r.lastBeat + D.settings.grace * 1000); return; } }
    if (!r.pausedAt && r.planned && elapsed(now) >= r.planned) { if (r.phase === 'focus') completeFocus(r.start + r.planned + (r.pausedTotal || 0)); else endBreak(false); return; }
    wake(true);
  }
  function onVis() {
    var r = D.run;
    if (document.hidden) { if (r && r.phase === 'focus' && !r.pausedAt) { r.hiddenAt = Date.now(); if (D.settings.deep === 'gentle') r.interruptions = (r.interruptions || 0) + 1; save(true); } return; }
    if (r && r.hiddenAt) {
      var away = Date.now() - r.hiddenAt; r.hiddenAt = null;
      if (r.phase === 'focus' && D.settings.deep === 'strict') { if (away > D.settings.grace * 1000) { wither('away', Date.now()); return; } if (away > 1500) toastC(C.fmt(t('v.back'), { s: Math.round(away / 1000), n: D.settings.grace })); }
      r.lastBeat = Date.now(); save();
    }
    if (D.run) wake(true);
    sky(); if (rollQuests()) renderQuests();
    renderFocus();
  }
  function bindModals() {
    $('#d-close').addEventListener('click', closeDone);
    $('#d-rate').addEventListener('click', function (e) {
      var b = e.target.closest('[data-r]'); if (!b || !doneS) return; doneS.rating = +b.getAttribute('data-r'); save();
      $$('#d-rate [data-r]').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
    });
    $('#w-close').addEventListener('click', function () { $('#m-wither').hidden = true; });
    $('#w-again').addEventListener('click', function () { $('#m-wither').hidden = true; go('focus'); startFocus(); });
    $('#lu-ok').addEventListener('click', function () { $('#m-level').hidden = true; });
    $('#ob-next').addEventListener('click', function () { if (obI < 2) { obI++; renderOnboard(); } else closeOnboard(); });
    $('#ob-skip').addEventListener('click', closeOnboard);
    document.addEventListener('clive:lang', function () { if (!$('#m-onboard').hidden) renderOnboard(); });
  }

  /* ---------------------------------------------------------------- onboarding */
  var obI = 0;
  function openOnboard() { obI = 0; renderOnboard(); $('#m-onboard').hidden = false; }
  function renderOnboard() {
    var arts = [Garden.island('lola', 1, { seed: 4 }), Garden.island('chinor', .62, { seed: 4, decor: 'fonus' }), Garden.scene([{ species: 'anor' }, { species: 'yulduzgul' }, { species: 'orik', golden: true }, { species: 'lola' }, { species: 'tol' }], { size: 3, decor: ['supa', 'kapalak'], theme: 'bahor' })];
    $('#ob-art').innerHTML = arts[obI];
    $('#ob-title').textContent = t('v.ob.' + (obI + 1) + 't'); $('#ob-text').textContent = t('v.ob.' + (obI + 1) + 'p');
    $$('#ob-dots i').forEach(function (d, i) { d.classList.toggle('on', i === obI); });
    $('#ob-next span').textContent = obI < 2 ? t('v.ob.next') : t('v.ob.go');
  }
  function closeOnboard() { D.onboarded = true; save(); $('#m-onboard').hidden = true; go('focus'); }

  /* ---------------------------------------------------------------- confetti */
  function confetti(gold) {
    if (reduced()) return;
    var cv = $('#confetti'), x = cv.getContext('2d'), W = cv.width = innerWidth, H = cv.height = innerHeight, P = [], cols = gold ? ['#FFE38A', '#F5C04A', '#D08C14', '#FFF6CF'] : ['#3DDC97', '#5B7CFF', '#F5C04A', '#FF5C7A', '#22CFC6', '#9B7BFF'];
    for (var i = 0; i < 140; i++) P.push({ x: W / 2 + (Math.random() - .5) * 120, y: H * .38, vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 4, r: Math.random() * 6 + 3, c: cols[i % cols.length], a: Math.random() * 6, va: (Math.random() - .5) * .3, s: Math.random() < .3 });
    var t0 = performance.now();
    (function frame(now) {
      var dt = Math.min(2, (now - (frame.l || now)) / 16.7); frame.l = now;
      x.clearRect(0, 0, W, H);
      P.forEach(function (p) {
        p.vy += .35 * dt; p.vx *= .99; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt;
        x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.globalAlpha = Math.max(0, 1 - (now - t0) / 2800);
        if (p.s) { x.beginPath(); for (var k = 0; k < 8; k++) { var aa = k * Math.PI / 4, rr = k % 2 ? p.r * .45 : p.r; x.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } x.fill(); } else x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        x.restore();
      });
      if (now - t0 < 2800) requestAnimationFrame(frame); else x.clearRect(0, 0, W, H);
    })(t0);
  }

  /* ---------------------------------------------------------------- wake lock, notifications, chime */
  var lock = null;
  function wake(on) {
    try {
      if (on && D.settings.wake && 'wakeLock' in navigator && !lock && !document.hidden) navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { lock = null; }); }, function () {});
      if (!on && lock) { lock.release(); lock = null; }
    } catch (e) {}
  }
  function notify(title2, body) { try { if (D.settings.notify && 'Notification' in window && Notification.permission === 'granted' && document.hidden) new Notification(title2, { body: body, icon: 'icon-192.png', tag: 'vaqt' }); } catch (e) {} }
  function chime() {
    if (!D.settings.chime) return; var a = ac(); if (!a) return; var now = a.currentTime;
    [[523.25, 1], [783.99, .6], [1046.5, .45], [1567.98, .2]].forEach(function (p, i) {
      var o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = p[0];
      g.gain.setValueAtTime(0, now + i * .09); g.gain.linearRampToValueAtTime(.22 * p[1], now + i * .09 + .02); g.gain.exponentialRampToValueAtTime(.0001, now + i * .09 + 2.6);
      o.connect(g); g.connect(a.destination); o.start(now + i * .09); o.stop(now + i * .09 + 2.7);
    });
  }

  /* ---------------------------------------------------------------- mini timer window + zen */
  var pipW = null, pipLast = '';
  function openPip() {
    if (!('documentPictureInPicture' in window)) { toastC(t('v.pip.no')); return; }
    if (pipW) { pipW.close(); pipW = null; return; }
    window.documentPictureInPicture.requestWindow({ width: 240, height: 300 }).then(function (w) {
      pipW = w; var st = w.document.createElement('style');
      st.textContent = 'body{margin:0;background:#070A18;color:#EEF1FF;font-family:Unbounded,Manrope,system-ui,sans-serif;display:grid;place-items:center;height:100vh;text-align:center}#i{width:180px;height:180px}#i svg{width:100%;height:100%}#t{font-weight:700;font-size:40px;font-variant-numeric:tabular-nums}#s{font:600 12px Manrope,system-ui,sans-serif;color:#A9B1D6;margin-top:4px}';
      w.document.head.appendChild(st); w.document.body.innerHTML = '<div><div id="i"></div><div id="t">--:--</div><div id="s"></div></div>';
      w.addEventListener('pagehide', function () { pipW = null; }); pipLast = ''; paint();
    }, function () { toastC(t('v.pip.no')); });
  }
  function pipPaint(tm, spc, p, r) {
    if (!pipW) return;
    try {
      var d = pipW.document; d.getElementById('t').textContent = tm; d.getElementById('s').textContent = r ? (r.phase === 'focus' ? pname(spc) : t('v.p.short')) : 'Vaqt';
      var k = spc + (p || 0).toFixed(2); if (k !== pipLast) { d.getElementById('i').innerHTML = Garden.island(spc, Math.max(.04, p || 0), { seed: 4, theme: D.theme }); pipLast = k; }
    } catch (e) { pipW = null; }
  }
  function toggleZen() {
    var on = !document.body.classList.contains('zen'); document.body.classList.toggle('zen', on);
    try { if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
  }
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement) document.body.classList.remove('zen'); });

  /* ---------------------------------------------------------------- sounds (real recordings, looped with Web Audio) */
  var AC = null, MASTER = null, PLAY = {}, BUF = {}, LOADING = {};
  function ac() {
    if (!AC) {
      var A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      try { AC = new A(); } catch (e) { return null; }
      /* master gain, then a gentle limiter so several layered sounds never clip */
      MASTER = AC.createGain();
      var lim = AC.createDynamicsCompressor();
      try { lim.threshold.value = -8; lim.knee.value = 8; lim.ratio.value = 10; lim.attack.value = .004; lim.release.value = .25; } catch (e) {}
      MASTER.connect(lim); lim.connect(AC.destination); applyMaster();
    }
    if (AC.state === 'suspended') AC.resume().catch(function () {});
    return AC;
  }
  function applyMaster() { if (MASTER) MASTER.gain.value = D.sounds.muted ? 0 : D.sounds.master; }
  /* the files are mastered quietly so raindrops and crackles keep their shape; this brings them up to listening level */
  function svol(k) { return (D.sounds.vol[k] == null ? SVOL[k] || .5 : D.sounds.vol[k]) * 2.2; }
  function sinfo(k) { return SOUNDS.filter(function (x) { return x[0] === k; })[0]; }
  function getBuf(k) {
    if (BUF[k]) return Promise.resolve(BUF[k]);
    if (LOADING[k]) return LOADING[k];
    LOADING[k] = fetch('sounds/' + k + '.mp3' + SND_V).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.arrayBuffer(); })
      .then(function (ab) { return new Promise(function (res, rej) { var pr = AC.decodeAudioData(ab, res, rej); if (pr && pr.then) pr.then(res, rej); }); })
      .then(function (b) {
        /* some decoders keep the MP3 encoder's ~25 ms of priming silence; loop exactly the recorded length after it */
        var len = sinfo(k)[2], extra = b.duration - len, a = extra > .015 ? Math.min(extra, 1105 / 44100) : 0;
        BUF[k] = { b: b, a: a, z: Math.min(b.duration, a + len) }; delete LOADING[k]; return BUF[k];
      }, function (e) { delete LOADING[k]; throw e; });
    return LOADING[k];
  }
  function playOne(k) {
    if (PLAY[k] || !ac() || !sinfo(k)) return;
    var g = AC.createGain(); g.gain.value = 0; g.connect(MASTER);
    var p = PLAY[k] = { g: g, src: null }; soundState();
    getBuf(k).then(function (B) {
      if (PLAY[k] !== p) return;
      var s = AC.createBufferSource(); s.buffer = B.b; s.loop = true; s.loopStart = B.a; s.loopEnd = B.z; s.connect(g);
      s.start(0, B.a + Math.random() * (B.z - B.a) * .85);
      g.gain.setValueAtTime(0, AC.currentTime); g.gain.linearRampToValueAtTime(svol(k), AC.currentTime + 1.6);
      p.src = s; soundState();
    }, function () {
      if (PLAY[k] === p) { delete PLAY[k]; try { g.disconnect(); } catch (e) {} }
      D.sounds.on = D.sounds.on.filter(function (x) { return x !== k; }); save();
      toastC(t('v.snd.err')); if (view === 'sounds') renderSounds(); else renderFocus();
    });
  }
  function stopOne(k) {
    var p = PLAY[k]; if (!p) return; delete PLAY[k];
    try { p.g.gain.cancelScheduledValues(AC.currentTime); p.g.gain.setValueAtTime(p.g.gain.value, AC.currentTime); p.g.gain.linearRampToValueAtTime(0, AC.currentTime + .6); } catch (e) {}
    setTimeout(function () { try { if (p.src) p.src.stop(); p.g.disconnect(); } catch (e) {} }, 700);
    soundState();
  }
  /* mark sounds that are still downloading */
  function soundState() {
    $$('[data-tsnd],[data-snd]').forEach(function (el) {
      var k = el.getAttribute('data-tsnd') || el.getAttribute('data-snd'), p = PLAY[k], host = el.closest('.snd') || el;
      host.classList.toggle('loading', !!(p && !p.src)); host.classList.toggle('playing', !!(p && p.src));
    });
  }
  function wantSounds() { var r = D.run; return (!D.sounds.only || (r && r.phase === 'focus' && !r.pausedAt)) ? D.sounds.on : []; }
  function syncSounds() { var want = wantSounds(); if (!want.length && !AC) return; Object.keys(PLAY).forEach(function (k) { if (want.indexOf(k) < 0) stopOne(k); }); want.forEach(playOne); }
  function toggleSound(k) { var i = D.sounds.on.indexOf(k); if (i >= 0) D.sounds.on.splice(i, 1); else D.sounds.on.push(k); ac(); save(); syncSounds(); if (view === 'sounds') renderSounds(); else renderFocus(); }
  document.addEventListener('pointerdown', function first() { if (D && D.sounds.on.length) syncSounds(); document.removeEventListener('pointerdown', first); });
  function bindSounds() {
    $('#snd-master').addEventListener('input', function (e) { D.sounds.master = +e.target.value; applyMaster(); save(); });
    $('#snd-only').addEventListener('change', function (e) { D.sounds.only = e.target.checked; save(); syncSounds(); });
    $('#snd-stop').addEventListener('click', function () { D.sounds.on = []; save(); syncSounds(); renderSounds(); });
    $('#snd-grid').addEventListener('click', function (e) { var b = e.target.closest('[data-tsnd]'); if (b) toggleSound(b.getAttribute('data-tsnd')); });
    $('#snd-grid').addEventListener('input', function (e) { var k = e.target.getAttribute('data-vol'); if (!k) return; D.sounds.vol[k] = +e.target.value; if (PLAY[k] && PLAY[k].src) { PLAY[k].g.gain.cancelScheduledValues(AC.currentTime); PLAY[k].g.gain.value = svol(k); } save(); });
  }
  function renderSounds() {
    $('#snd-master').value = D.sounds.master; $('#snd-only').checked = !!D.sounds.only;
    $('#snd-grid').innerHTML = SOUNDS.map(function (x) {
      var on = D.sounds.on.indexOf(x[0]) >= 0;
      return '<article class="card snd' + (on ? ' on' : '') + (PLAY[x[0]] && !PLAY[x[0]].src ? ' loading' : '') + '"><div class="row"><span class="ico">' + C.icon(x[1]) + '</span><span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div>' +
        '<div class="row"><h3 style="margin:0">' + esc(t('v.snd.' + x[0])) + '</h3><label class="sw"><input type="checkbox" data-tsnd="' + x[0] + '"' + (on ? ' checked' : '') + ' aria-label="' + esc(t('v.snd.' + x[0])) + '"><i></i></label></div>' +
        '<input type="range" min="0" max="1" step="0.01" value="' + (D.sounds.vol[x[0]] == null ? SVOL[x[0]] : D.sounds.vol[x[0]]) + '" data-vol="' + x[0] + '" aria-label="' + esc(t('v.snd.' + x[0])) + '"></article>';
    }).join('');
  }

  /* ---------------------------------------------------------------- garden view */
  var G = { p: 'week', off: 0 };
  function period(p, off) {
    var now = Date.now(), a, b, label;
    if (p === 'day') { a = addDays(dayStart(now), off); b = addDays(a, 1); label = off === 0 ? t('v.today') : new Date(a).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short' }); }
    else if (p === 'week') { var d = new Date(dayStart(now)), dow = (d.getDay() + 6) % 7; a = addDays(d.getTime(), -dow + off * 7); b = addDays(a, 7); label = off === 0 ? t('v.thisweek') : new Date(a).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) + ' – ' + new Date(addDays(b, -1)).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }); }
    else if (p === 'month') { var m = new Date(now); m = new Date(m.getFullYear(), m.getMonth() + off, 1); a = m.getTime(); b = new Date(m.getFullYear(), m.getMonth() + 1, 1).getTime(); label = m.toLocaleDateString(locale(), { month: 'long', year: 'numeric' }); }
    else if (p === 'year') { var y = new Date(now).getFullYear() + off; a = new Date(y, 0, 1).getTime(); b = new Date(y + 1, 0, 1).getTime(); label = String(y); }
    else { a = 0; b = Infinity; label = t('v.period.all'); }
    return { a: a, b: b, label: label };
  }
  function bindGarden() {
    $('#g-period').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (!b) return; G.p = b.getAttribute('data-p'); G.off = 0; renderGarden(); });
    $('#g-prev').addEventListener('click', function () { G.off--; renderGarden(); });
    $('#g-next').addEventListener('click', function () { if (G.off < 0) { G.off++; renderGarden(); } });
    $('#g-themes').addEventListener('click', function (e) { var b = e.target.closest('[data-th]'); if (!b) return; D.theme = b.getAttribute('data-th'); save(); renderGarden(); });
    $('#g-decor').addEventListener('click', function (e) { var b = e.target.closest('[data-dc]'); if (!b) return; var id = b.getAttribute('data-dc'), i = D.decorOn.indexOf(id); if (i >= 0) D.decorOn.splice(i, 1); else D.decorOn.push(id); save(); renderGarden(); });
    $('#g-sample').addEventListener('click', function () { sample(); renderAll(); });
    $('#g-unsample').addEventListener('click', function () { D.sessions = D.sessions.filter(function (s) { return !s.sample; }); save(true); renderAll(); });
    $('#g-share').addEventListener('click', shareGarden);
  }
  function renderGarden() {
    $('#g-period').innerHTML = ['day', 'week', 'month', 'year', 'all'].map(function (p) { return '<button type="button" data-p="' + p + '" aria-pressed="' + (G.p === p) + '">' + esc(t('v.period.' + p)) + '</button>'; }).join('');
    var pr = period(G.p, G.off), th = Garden.theme(D.theme);
    $('#g-label').textContent = pr.label;
    $('#g-prev').disabled = G.p === 'all'; $('#g-next').disabled = G.p === 'all' || G.off >= 0;
    $('#gstage').style.setProperty('--gbg', th.bg[0]);
    var list = focusSessions().filter(function (s) { return s.mode !== 'manual' && s.start >= pr.a && s.start < pr.b; }).sort(function (x, y) { return x.start - y.start; });
    var alive = list.filter(good), total = alive.reduce(function (n, s) { return n + mins(s); }, 0);
    $('#g-sum').textContent = C.fmt(t('v.g.sum'), { min: C.dur(total), plants: alive.length, dead: list.length - alive.length });
    var max = 144, shown = list.slice(-max);
    if (!list.length) $('#g-scene').innerHTML = '<div class="empty">' + Garden.scene([], { size: 4, theme: D.theme, decor: D.decorOn }) + '<p>' + esc(t('v.g.empty')) + '</p></div>';
    else $('#g-scene').innerHTML = Garden.scene(shown.map(function (s) { var tg = tag(s.tag); return { species: s.species || 'lola', withered: !good(s), golden: s.golden, seed: parseInt(String(s.id).slice(-4), 36) || 3, title: pname(s.species) + (s.golden ? ' ★' : '') + ' · ' + mins(s) + ' ' + t('v.min') + (tg ? ' · ' + tname(tg) : '') + ' · ' + new Date(s.start).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) + ' ' + hm(s.start) }; }),
      { size: clamp(Math.ceil(Math.sqrt((shown.length + D.decorOn.length) * 1.3)), 4, 12), label: pr.label, theme: D.theme, decor: D.decorOn });
    $('#g-more').textContent = list.length > max ? C.fmt(t('v.g.more'), { n: list.length - max }) : '';
    $('#g-themes').innerHTML = D.themesOwned.map(function (id) { var x = Garden.theme(id); return '<button type="button" data-th="' + id + '" style="--c:' + x.top2 + '" aria-pressed="' + (D.theme === id) + '"><i></i>' + esc(L3(x.name)) + '</button>'; }).join('');
    $('#g-decor').innerHTML = D.decorOwned.length ? D.decorOwned.map(function (id) { var x = Garden.DECOR.filter(function (d) { return d.id === id; })[0]; return '<button type="button" data-dc="' + id + '" aria-pressed="' + (D.decorOn.indexOf(id) >= 0) + '"><svg viewBox="-42 -74 84 94" aria-hidden="true">' + Garden.decor(id) + '</svg>' + esc(L3(x.name)) + '</button>'; }).join('') : '<p class="small muted" style="margin:0">' + esc(t('v.g.nodecor')) + ' <button class="linkbtn" type="button" data-view="bazaar">' + esc(t('v.bz.h')) + '</button></p>';
    $$('#g-decor [data-view]').forEach(function (b) { b.addEventListener('click', function () { go('bazaar'); }); });
    var hasSample = D.sessions.some(function (s) { return s.sample; });
    $('#g-sample').hidden = D.sessions.length > 0; $('#g-unsample').hidden = !hasSample;
    $('#g-samplenote').textContent = hasSample ? t('v.sample.note') : '';
  }
  function shareGarden() {
    var svg = $('#g-scene svg'); if (!svg) return;
    try {
      var vb = svg.viewBox.baseVal, Wd = 1200, H = 900, s = new XMLSerializer().serializeToString(svg), th = Garden.theme(D.theme);
      if (s.indexOf('xmlns=') < 0) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      var img = new Image(), url = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = Wd; c.height = H; var x = c.getContext('2d');
        var g = x.createRadialGradient(Wd / 2, H * .6, 50, Wd / 2, H * .6, Wd * .7); g.addColorStop(0, th.bg[0] + '55'); g.addColorStop(1, th.bg[1]); x.fillStyle = th.bg[1]; x.fillRect(0, 0, Wd, H); x.fillStyle = g; x.fillRect(0, 0, Wd, H);
        var sc = Math.min((Wd - 120) / vb.width, (H - 220) / vb.height), dw = vb.width * sc, dh = vb.height * sc;
        x.drawImage(img, (Wd - dw) / 2, 150, dw, dh);
        x.fillStyle = '#EEF1FF'; x.font = '700 54px Unbounded, Manrope, sans-serif'; x.fillText('Vaqt', 60, 96);
        x.fillStyle = '#A9B1D6'; x.font = '600 26px Manrope, sans-serif'; x.fillText($('#g-label').textContent + ' · ' + $('#g-sum').textContent, 60, 134);
        x.fillStyle = '#3DDC97'; x.fillText(C.fmt(t('v.lv'), { n: levelOf(xp()).n }) + ' · clive · vaqt', Wd - 360, H - 40);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'vaqt-garden.png'; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 500); });
      };
      img.src = url;
    } catch (e) {}
  }
  function sample() {
    var now = Date.now(), tags = D.tags.map(function (x) { return x.id; }), spp = Garden.SPECIES.map(function (s) { return s.id; });
    for (var d = 13; d >= 0; d--) {
      var day = addDays(dayStart(now), -d), n = 2 + Math.floor(Math.random() * 4), h = 8 + Math.random() * 2;
      for (var i = 0; i < n; i++) {
        var len = [25, 25, 30, 45, 50, 60, 90][Math.floor(Math.random() * 7)], start = day + h * 3600e3;
        if (start + len * 60e3 > now) break;
        var s = spp.filter(function (x) { return sp(x).min <= len; }); s = s[Math.floor(Math.random() * s.length)];
        var wilt = Math.random() < .1;
        D.sessions.push({ id: uid(), start: start, end: start + len * 60e3, planned: len * 60, actual: wilt ? Math.round(len * 24) : len * 60, mode: len === 25 ? 'pomo' : 'timer', species: s, tag: tags[Math.floor(Math.random() * tags.length)], status: wilt ? 'withered' : 'done', golden: !wilt && Math.random() < .06, rating: Math.random() < .5 ? 3 + Math.floor(Math.random() * 3) : undefined, sample: true });
        h += len / 60 + .3 + Math.random() * 2.5; if (h > 22) break;
      }
      if (d % 4 === 1) { var ms = day + 19 * 3600e3; if (ms + 5400e3 < now) D.sessions.push({ id: uid(), start: ms, end: ms + 5400e3, planned: 5400, actual: 5400, mode: 'manual', tag: 't2', status: 'done', note: 'English class', sample: true }); }
    }
    D.sessions.sort(function (a, b) { return a.start - b.start; });
    save(true);
  }

  /* ---------------------------------------------------------------- bazaar */
  var BZ = 'seeds', confirmBuy = null;
  function bindBazaar() {
    $('#bz-tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-bz]'); if (!b) return; BZ = b.getAttribute('data-bz'); renderBazaar(); });
    function handle(e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var act = b.getAttribute('data-act'), id = b.getAttribute('data-id'), price = +b.getAttribute('data-price') || 0, kind = b.getAttribute('data-kind');
      if (act === 'buy') {
        if (D.coins < price) return;
        if (confirmBuy !== kind + id) { confirmBuy = kind + id; b.querySelector('span').textContent = t('v.bz.sure'); setTimeout(function () { if (confirmBuy === kind + id) { confirmBuy = null; renderBazaar(); } }, 3000); return; }
        confirmBuy = null; D.coins -= price;
        var nm = '';
        if (kind === 'seed') { D.unlocked.push(id); nm = pname(id); }
        else if (kind === 'decor') { D.decorOwned.push(id); D.decorOn.push(id); nm = L3(Garden.DECOR.filter(function (d) { return d.id === id; })[0].name); }
        else if (kind === 'theme') { D.themesOwned.push(id); D.theme = id; nm = L3(Garden.theme(id).name); }
        else if (kind === 'freeze') { D.freezes = Math.min(2, (D.freezes || 0) + 1); nm = t('v.bz.freeze'); }
        save(true); vib(25); confetti(kind === 'seed' && sp(id).tier === 'legendary'); toastC(C.fmt(t('v.bz.bought'), { item: nm })); renderHeader(); checkAwards(); renderBazaar(); setTimeout(showLevel, 400);
      } else if (act === 'plant') { D.settings.species = id; if (D.settings.mode === 'timer' && D.settings.minutes < sp(id).min) D.settings.minutes = sp(id).min; save(); go('focus'); }
      else if (act === 'toggle') { var i = D.decorOn.indexOf(id); if (i >= 0) D.decorOn.splice(i, 1); else D.decorOn.push(id); save(); renderBazaar(); }
      else if (act === 'use') { D.theme = id; save(); renderBazaar(); }
    }
    $('#bz-grid').addEventListener('click', handle);
    $('#bz-special').addEventListener('click', handle);
  }
  function coinI() { return C.icon('coin').replace('<svg', '<svg style="display:inline-block;width:13px;height:13px;vertical-align:-2px;color:var(--gold)"'); }
  function buyBtn(kind, id, price) {
    var poor = D.coins < price;
    return '<button type="button" class="btn ' + (poor ? 'ghost' : 'primary') + ' sm" data-act="buy" data-kind="' + kind + '" data-id="' + id + '" data-price="' + price + '"' + (poor ? ' disabled' : '') + ' style="--c:var(--gold);--ci:#1a1400">' + C.icon(poor ? 'lock' : 'coin') + '<span>' + esc(poor ? C.fmt(t('v.bz.need'), { n: price - D.coins }) : C.fmt(t('v.bz.buy'), { n: price })) + '</span></button>';
  }
  function renderBazaar() {
    $('#bz-coins').textContent = D.coins;
    $$('#bz-tabs [data-bz]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-bz') === BZ)); });
    var fz = D.freezes || 0;
    $('#bz-special').innerHTML = '<span class="ico">' + C.icon('shield') + '</span><div><h3 style="margin:0 0 4px">' + esc(t('v.bz.freeze')) + '</h3><p class="small muted" style="margin:0">' + esc(t('v.bz.freeze.p')) + ' · <b>' + esc(C.fmt(t('v.bz.freeze.have'), { n: fz })) + '</b></p></div>' +
      (fz >= 2 ? '<span class="chip">' + esc(t('v.bz.freeze.full')) + '</span>' : buyBtn('freeze', 'freeze', FREEZE_COST));
    var L = C.S.lang, h = '';
    if (BZ === 'seeds') h = Garden.SPECIES.map(function (x, k) {
      var own = D.unlocked.indexOf(x.id) >= 0, tc = Garden.TIERS[x.tier].c;
      return '<article class="card item ' + x.tier + (own ? ' owned' : '') + '" style="--tc:' + tc + '"><div class="pv"><svg viewBox="' + Garden.box(x.id) + '" aria-hidden="true">' + Garden.plant(x.id, 1, { seed: 3 + k }) + '</svg></div>' +
        '<span class="tier">' + esc(L3(Garden.TIERS[x.tier].name)) + '</span><h3>' + esc(L3(x.name)) + '</h3><p class="muted">' + esc(L3(x.note)) + '</p><div class="meta"><span>' + esc(C.fmt(t('v.bz.mins'), { n: x.min })) + '</span>' + (x.cost ? '<span>' + coinI() + ' ' + x.cost + '</span>' : '<span>' + esc(t('pp.vaqt.free')) + '</span>') + '</div>' +
        (own ? '<button type="button" class="btn ghost sm" data-act="plant" data-id="' + x.id + '">' + C.icon('sprout') + '<span>' + esc(D.settings.species === x.id ? t('v.bz.inuse') : t('v.bz.plant')) + '</span></button>' : buyBtn('seed', x.id, x.cost)) + '</article>';
    }).join('');
    else if (BZ === 'decor') h = Garden.DECOR.map(function (x) {
      var own = D.decorOwned.indexOf(x.id) >= 0, on = D.decorOn.indexOf(x.id) >= 0;
      return '<article class="card item' + (own ? ' owned' : '') + '" style="--tc:var(--amber)"><div class="pv"><svg viewBox="-46 -76 92 100" aria-hidden="true">' + Garden.tile(0, 6, 80, 'grass', 8, Garden.theme(D.theme)) + '<g transform="translate(0 6)">' + Garden.decor(x.id) + '</g></svg></div>' +
        '<h3>' + esc(L3(x.name)) + '</h3><div class="meta"><span>' + coinI() + ' ' + x.cost + '</span>' + (own ? '<span>' + esc(t('v.bz.owned')) + '</span>' : '') + '</div>' +
        (own ? '<button type="button" class="btn ghost sm" data-act="toggle" data-id="' + x.id + '" aria-pressed="' + on + '">' + C.icon(on ? 'eye' : 'x') + '<span>' + esc(on ? t('v.bz.show') : t('v.bz.hide')) + '</span></button>' : buyBtn('decor', x.id, x.cost)) + '</article>';
    }).join('');
    else h = Garden.THEMES.map(function (x) {
      var own = D.themesOwned.indexOf(x.id) >= 0, inuse = D.theme === x.id;
      return '<article class="card item' + (own ? ' owned' : '') + '" style="--tc:' + x.bg[0] + '"><div class="pv wide">' + Garden.scene([{ species: 'lola' }, { species: 'anor' }, { species: 'chinor' }, { species: 'paxta' }], { size: 3, theme: x.id, decor: ['fonus'] }) + '</div>' +
        '<h3>' + esc(L3(x.name)) + '</h3><div class="meta"><span>' + (x.cost ? coinI() + ' ' + x.cost : esc(t('pp.vaqt.free'))) + '</span></div>' +
        (own ? '<button type="button" class="btn ' + (inuse ? 'primary' : 'ghost') + ' sm" data-act="use" data-id="' + x.id + '" style="--c:var(--green);--ci:#03170d">' + C.icon(inuse ? 'check' : 'image') + '<span>' + esc(inuse ? t('v.bz.inuse') : t('v.bz.use')) + '</span></button>' : buyBtn('theme', x.id, x.cost)) + '</article>';
    }).join('');
    $('#bz-grid').innerHTML = h;
  }

  /* ---------------------------------------------------------------- awards view */
  var AF = 'all', ACAT = '';
  function bindAwards() {
    $('#a-filter').addEventListener('click', function (e) { var b = e.target.closest('[data-af]'); if (!b) return; AF = b.getAttribute('data-af'); renderAwards(); });
    $('#a-cats').addEventListener('click', function (e) { var b = e.target.closest('[data-ac]'); if (!b) return; var c = b.getAttribute('data-ac'); ACAT = ACAT === c ? '' : c; renderAwards(); });
  }
  function renderAwards() {
    var A = awardState(), got = A.filter(function (a) { return a.got; }), pts = got.reduce(function (n, a) { return n + TIER_REWARD[a.tier]; }, 0), p = got.length / Math.max(1, A.length), lv = levelOf(xp());
    var tiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond'].map(function (tr) { var n = got.filter(function (a) { return a.tier === tr; }).length, all = A.filter(function (a) { return a.tier === tr; }).length; return '<span class="chip c" style="--c:' + TIER_GRAD[tr][1] + '">' + esc(t('v.tier.' + tr)) + ' ' + n + '/' + all + '</span>'; }).join('');
    $('#a-sum').innerHTML = '<div class="ring"><svg viewBox="0 0 110 110"><circle cx="55" cy="55" r="46" class="tr"/><circle cx="55" cy="55" r="46" class="pr" stroke-dasharray="289" stroke-dashoffset="' + (289 * (1 - p)).toFixed(1) + '"/></svg><b>' + Math.round(p * 100) + '%</b></div>' +
      '<div><h2 style="font-size:1.5rem">' + esc(C.fmt(t('v.a.sum'), { a: got.length, b: A.length })) + '</h2><p class="muted" style="margin:6px 0 0">' + esc(C.fmt(t('v.a.pts'), { n: pts })) + ' · ' + esc(C.fmt(t('v.lv'), { n: lv.n })) + ' · ' + esc(title(lv.n)) + '</p><div class="tiers">' + tiers + '</div></div>';
    $$('#a-filter [data-af]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-af') === AF)); });
    var cats = []; AW.forEach(function (a) { if (cats.indexOf(a.cat) < 0) cats.push(a.cat); });
    $('#a-cats').innerHTML = cats.map(function (c) { return '<button type="button" data-ac="' + c + '" aria-pressed="' + (ACAT === c) + '">' + esc(t('v.a.cat.' + c)) + '</button>'; }).join('');
    var list = A.filter(function (a) { return (!ACAT || a.cat === ACAT) && (AF === 'all' || (AF === 'got' && a.got) || (AF === 'prog' && !a.got && a.v > 0) || (AF === 'lock' && !a.got && a.v === 0)); });
    list.sort(function (a, b) { return (b.got - a.got) || (b.v / b.n - a.v / a.n); });
    $('#a-grid').innerHTML = list.map(function (a) {
      var tc = TIER_GRAD[a.tier][1];
      return '<article class="card aw ' + (a.got ? 'got' : 'no') + '" style="--tc:' + tc + '">' + medal(a.tier, a.icon) + '<h3>' + esc(t('v.a.' + a.id)) + '</h3><p class="muted">' + esc(t('v.a.' + a.id + '.d')) + '</p>' +
        '<div class="foot3"><div class="pb"><i style="width:' + (a.v / a.n * 100).toFixed(0) + '%"></i></div><div class="ft"><span>' + (a.got && a.at ? esc(C.fmt(t('v.a.on'), { d: new Date(a.at).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) })) : a.v + ' / ' + a.n) + '</span><span class="rw">' + esc(t('v.tier.' + a.tier)) + ' · +' + TIER_REWARD[a.tier] + '</span></div></div></article>';
    }).join('');
  }

  /* ---------------------------------------------------------------- stats view */
  var SR = 'week', CAL = 0;
  function bindStats() {
    $('#s-range').addEventListener('click', function (e) { var b = e.target.closest('[data-r]'); if (b) { SR = b.getAttribute('data-r'); renderStats(); } });
    $('#cal-prev').addEventListener('click', function () { CAL--; renderStats(); });
    $('#cal-next').addEventListener('click', function () { if (CAL < 0) { CAL++; renderStats(); } });
  }
  function renderStats() {
    var all = focusSessions(), ok = all.filter(good), now = Date.now(), st = streaks(true), weekA = period('week', 0).a, total = ok.reduce(function (n, s) { return n + mins(s); }, 0);
    var timed = all.filter(function (s) { return s.mode !== 'manual'; }), rate = timed.length ? Math.round(timed.filter(good).length / timed.length * 100) : 0, avg = ok.length ? Math.round(total / ok.length) : 0;
    var rated = all.filter(function (s) { return s.rating; }), mood = rated.length ? (rated.reduce(function (n, s) { return n + s.rating; }, 0) / rated.length).toFixed(1) + ' / 5' : '–';
    var K = [['v.k.today', C.dur(todayMin())], ['v.k.week', C.dur(minutesIn(weekA, addDays(weekA, 7)))], ['v.k.total', C.dur(total)], ['v.k.streak', C.fmt(t('v.days'), { n: st.cur })], ['v.k.best', C.fmt(t('v.days'), { n: st.best })], ['v.k.rate', rate + '%'],
      ['v.k.avg', C.dur(avg)], ['v.k.plants', String(ok.filter(function (s) { return s.mode !== 'manual'; }).length)], ['v.k.golden', String(ok.filter(function (s) { return s.golden; }).length)], ['v.k.mood', mood], ['v.k.level', String(levelOf(xp()).n)], ['v.k.coins', String(D.earned || 0)]];
    $('#s-kpi').innerHTML = K.map(function (k) { return '<div class="card"><b>' + esc(k[1]) + '</b><span>' + esc(t(k[0])) + '</span></div>'; }).join('');
    var days = [], mx = 1;
    for (var i = 0; i < 7; i++) { var a = addDays(weekA, i), b = addDays(a, 1), per = {}; ok.forEach(function (s) { if (s.start >= a && s.start < b) per[s.tag || '-'] = (per[s.tag || '-'] || 0) + mins(s); }); var sum = Object.keys(per).reduce(function (n, k) { return n + per[k]; }, 0); mx = Math.max(mx, sum); days.push({ a: a, per: per, sum: sum }); }
    var dn = C.DSHORT[C.S.lang] || C.DSHORT.en, today = dayStart(now);
    $('#s-week').innerHTML = days.map(function (d) {
      var segs = Object.keys(d.per).map(function (k) { var tg = tag(k); return '<i style="height:' + (d.per[k] / mx * 100).toFixed(1) + '%;--c:' + (tg ? esc(tg.color) : 'var(--mute)') + '" title="' + esc((tg ? tname(tg) : t('v.notag')) + ' · ' + d.per[k] + ' ' + t('v.min')) + '"></i>'; }).join('');
      return '<div class="col' + (d.a === today ? ' today' : '') + '"><div class="bar">' + segs + '</div><b>' + (d.sum ? esc(C.dur(d.sum)) : '·') + '</b><small>' + esc(dn[new Date(d.a).getDay()]) + '</small></div>';
    }).join('');
    $$('#s-range [data-r]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-r') === SR)); });
    var ra = SR === 'week' ? weekA : SR === 'month' ? period('month', 0).a : 0, per2 = {}, tot2 = 0;
    ok.forEach(function (s) { if (s.start >= ra) { per2[s.tag || '-'] = (per2[s.tag || '-'] || 0) + mins(s); tot2 += mins(s); } });
    var tk = Object.keys(per2).sort(function (x, y) { return per2[y] - per2[x]; });
    $('#s-tags').innerHTML = tk.length ? tk.map(function (k) { var tg = tag(k); return '<div class="r" style="--c:' + (tg ? esc(tg.color) : 'var(--mute)') + '"><span><i></i>' + esc(tg ? tname(tg) : t('v.notag')) + '</span><span class="b"><i style="width:' + (per2[k] / tot2 * 100).toFixed(1) + '%"></i></span><span class="v">' + esc(C.dur(per2[k])) + '</span></div>'; }).join('') : '<p class="muted">' + esc(t('v.s.none')) + '</p>';
    var perDay = {}; ok.forEach(function (s) { var k = dkey(s.start); perDay[k] = (perDay[k] || 0) + mins(s); });
    var lvl = function (m) { return m === 0 ? 0 : m < 30 ? 1 : m < 60 ? 2 : m < 120 ? 3 : 4; };
    /* month calendar */
    var m0 = new Date(new Date().getFullYear(), new Date().getMonth() + CAL, 1), m1 = new Date(m0.getFullYear(), m0.getMonth() + 1, 1), pre = (m0.getDay() + 6) % 7, cal = '';
    $('#cal-label').textContent = m0.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
    $('#cal-next').disabled = CAL >= 0;
    var mon = [1, 2, 3, 4, 5, 6, 0]; cal += mon.map(function (d) { return '<span class="dh">' + esc(dn[d]) + '</span>'; }).join('');
    for (i = 0; i < pre; i++) cal += '<span class="d empty"></span>';
    for (var dd = new Date(m0); dd < m1; dd.setDate(dd.getDate() + 1)) {
      var kk = dkey(dd.getTime()), m = perDay[kk] || 0;
      cal += '<span class="d l' + lvl(m) + (dkey(now) === kk ? ' today' : '') + (D.frozen.indexOf(kk) >= 0 ? ' frz' : '') + (m >= D.settings.goal ? ' goal' : '') + '" title="' + esc(dd.toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) + ' · ' + m + ' ' + t('v.min')) + '">' + dd.getDate() + '</span>';
    }
    $('#s-cal').innerHTML = cal;
    var startW = addDays(weekA, -25 * 7), cells = '';
    for (var w = 0; w < 26; w++) for (var d7 = 0; d7 < 7; d7++) { var ms = addDays(startW, w * 7 + d7), mm = perDay[dkey(ms)] || 0; cells += '<i class="' + (ms > now ? 'fut' : 'l' + lvl(mm)) + '" title="' + esc(new Date(ms).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) + ' · ' + mm + ' ' + t('v.min')) + '"></i>'; }
    $('#s-heat').innerHTML = cells;
    var hrs = new Array(24).fill(0); ok.forEach(function (s) { hrs[new Date(s.start).getHours()] += mins(s); });
    var hm2 = Math.max.apply(null, hrs) || 1;
    $('#s-hours').innerHTML = hrs.map(function (v, h) { return '<div title="' + h + ':00 · ' + v + ' ' + esc(t('v.min')) + '"><i style="height:' + (v / hm2 * 100).toFixed(1) + '%"></i><small>' + (h % 6 === 0 ? h : '') + '</small></div>'; }).join('');
    var ins = [];
    if (ok.length) {
      var bh = hrs.indexOf(Math.max.apply(null, hrs)); ins.push(C.fmt(t('v.i.hour'), { h: pad(bh) + ':00' }));
      var allT = {}; ok.forEach(function (s) { allT[s.tag || '-'] = (allT[s.tag || '-'] || 0) + mins(s); });
      var top = Object.keys(allT).sort(function (x, y) { return allT[y] - allT[x]; })[0], tg = tag(top);
      ins.push(C.fmt(t('v.i.tag'), { tag: tg ? tname(tg) : t('v.notag'), p: Math.round(allT[top] / total * 100) }));
      var lg = ok.reduce(function (m2, s) { return mins(s) > mins(m2) ? s : m2; }, ok[0]); ins.push(C.fmt(t('v.i.long'), { min: C.dur(mins(lg)) }));
      var dw = new Array(7).fill(0); ok.forEach(function (s) { dw[new Date(s.start).getDay()] += mins(s); }); ins.push(C.fmt(t('v.i.day'), { d: (C.DAYS[C.S.lang] || C.DAYS.en)[dw.indexOf(Math.max.apply(null, dw))] }));
      var hi = rated.filter(function (s) { return s.rating >= 4; }); if (hi.length >= 3) ins.push(C.fmt(t('v.i.mood'), { min: C.dur(Math.round(hi.reduce(function (n, s) { return n + mins(s); }, 0) / hi.length)) }));
      if (rate < 80 && timed.length >= 5) ins.push(C.fmt(t('v.i.rate'), { p: rate }));
    } else ins.push(t('v.s.none'));
    $('#s-ins').innerHTML = ins.map(function (x) { return '<li>' + C.icon('sparkle') + '<span>' + esc(x) + '</span></li>'; }).join('');
    var cnt = {}, gold = {}; ok.forEach(function (s) { if (s.species) { cnt[s.species] = (cnt[s.species] || 0) + 1; if (s.golden) gold[s.species] = 1; } });
    $('#s-coll').innerHTML = Garden.SPECIES.map(function (x, k) { return '<div class="' + (cnt[x.id] ? '' : 'no') + '"><svg viewBox="' + Garden.box(x.id) + '" aria-hidden="true">' + Garden.plant(x.id, 1, { seed: 2 + k, golden: !!gold[x.id] }) + '</svg><b>' + esc(L3(x.name)) + '</b>× ' + (cnt[x.id] || 0) + '</div>'; }).join('');
  }

  /* ---------------------------------------------------------------- tasks */
  var TF = 'open', editing = null;
  function tagOptions(sel) { return '<option value="">' + esc(t('v.notag')) + '</option>' + D.tags.map(function (x) { return '<option value="' + x.id + '"' + (x.id === sel ? ' selected' : '') + '>' + esc(tname(x)) + '</option>'; }).join(''); }
  function bindTasks() {
    $('#t-form').addEventListener('submit', function (e) {
      e.preventDefault(); var ti = $('#t-title').value.trim(); if (!ti) return;
      D.tasks.unshift({ id: uid(), title: ti.slice(0, 120), tag: $('#t-tag').value || null, est: clamp(+$('#t-est').value || 1, 1, 20), done: false, created: Date.now() });
      $('#t-title').value = ''; save(); renderTasks();
    });
    $('#t-filter').addEventListener('click', function (e) { var b = e.target.closest('[data-tf]'); if (!b) return; TF = b.getAttribute('data-tf'); renderTasks(); });
    $('#t-list').addEventListener('click', function (e) {
      var li = e.target.closest('li[data-id]'); if (!li) return; var tk = task(li.getAttribute('data-id')); if (!tk) return;
      var a = e.target.closest('[data-a]'); if (!a) return; var act = a.getAttribute('data-a');
      if (act === 'ck') { tk.done = !tk.done; tk.doneAt = tk.done ? Date.now() : null; if (tk.done) { vib(15); if (D.settings.task === tk.id) D.settings.task = null; } save(); renderTasks(); checkAwards(); return; }
      if (act === 'go') { D.settings.task = tk.id; if (tk.tag) D.settings.tag = tk.tag; save(); go('focus'); return; }
      if (act === 'del') {
        var idx = D.tasks.indexOf(tk); D.tasks.splice(idx, 1); if (D.settings.task === tk.id) D.settings.task = null; save(); renderTasks();
        toast('<span class="tx">' + esc(t('v.deleted')) + ': ' + esc(tk.title.slice(0, 40)) + '</span>', { undo: function () { D.tasks.splice(idx, 0, tk); save(); renderTasks(); }, ms: 6000 }); return;
      }
      if (act === 'ed') editing = tk.id;
      else if (act === 'sv') { var ip = li.querySelector('[data-f=title]'); tk.title = (ip.value.trim() || tk.title).slice(0, 120); tk.est = clamp(+li.querySelector('[data-f=est]').value || 1, 1, 20); tk.tag = li.querySelector('[data-f=tag]').value || null; editing = null; }
      else if (act === 'cx') editing = null;
      save(); renderTasks();
    });
  }
  function renderTasks() {
    $('#t-tag').innerHTML = tagOptions(D.settings.tag);
    $$('#t-filter [data-tf]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tf') === TF)); });
    var list = D.tasks.filter(function (x) { return TF === 'done' ? x.done : !x.done; });
    if (!list.length) { $('#t-list').innerHTML = '<li class="empty" style="display:block">' + esc(t('v.t.empty')) + '</li>'; return; }
    $('#t-list').innerHTML = list.map(function (x) {
      var ss = D.sessions.filter(function (s) { return s.task === x.id && good(s); }), n = ss.length, spent = ss.reduce(function (a, s) { return a + mins(s); }, 0), tg = tag(x.tag);
      var dots = ''; for (var i = 0; i < Math.max(x.est, n); i++) dots += '<i class="' + (i < n ? 'on' : '') + '"></i>';
      if (editing === x.id) return '<li data-id="' + x.id + '"><span></span><div style="display:grid;gap:8px;grid-template-columns:1fr 140px 80px"><input class="input" data-f="title" value="' + esc(x.title) + '" aria-label="Task"><select class="input select" data-f="tag">' + tagOptions(x.tag) + '</select><input class="input" type="number" min="1" max="20" data-f="est" value="' + x.est + '" aria-label="' + esc(t('v.t.est')) + '"></div><div class="act"><button class="iconbtn" data-a="sv" aria-label="' + esc(t('v.t.save')) + '">' + C.icon('check') + '</button><button class="iconbtn" data-a="cx" aria-label="' + esc(t('v.cancel')) + '">' + C.icon('x') + '</button></div></li>';
      return '<li data-id="' + x.id + '" class="' + (x.done ? 'done' : '') + '"><button class="ck" data-a="ck" aria-label="' + esc(t('v.t.done')) + '" aria-pressed="' + x.done + '">' + C.icon('check') + '</button>' +
        '<div><div class="tt">' + esc(x.title) + '</div><div class="meta">' + (tg ? '<span class="chip c" style="--c:' + esc(tg.color) + '">' + esc(tname(tg)) + '</span>' : '') + '<span class="dots">' + dots + '</span><span>' + n + '/' + x.est + '</span>' + (spent ? '<span>' + esc(C.fmt(t('v.t.spent'), { t: C.dur(spent) })) + '</span>' : '') + '</div></div>' +
        '<div class="act">' + (x.done ? '' : '<button class="iconbtn" data-a="go" aria-label="' + esc(t('v.t.focus')) + '" title="' + esc(t('v.t.focus')) + '" style="color:var(--green)">' + C.icon('play') + '</button>') + '<button class="iconbtn" data-a="ed" aria-label="' + esc(t('v.t.edit')) + '">' + C.icon('pen') + '</button><button class="iconbtn" data-a="del" aria-label="' + esc(t('v.t.del')) + '">' + C.icon('trash') + '</button></div></li>';
    }).join('');
  }

  /* ---------------------------------------------------------------- log */
  var LO = 0, LED = null;
  function bindLog() {
    $('#l-prev').addEventListener('click', function () { LO--; renderLog(); });
    $('#l-next').addEventListener('click', function () { if (LO < 0) { LO++; renderLog(); } });
    $('#l-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var dv = $('#l-date').value, f = $('#l-from').value, to = $('#l-to').value; if (!dv || !f || !to) return;
      var a = new Date(dv + 'T' + f).getTime(), b = new Date(dv + 'T' + to).getTime();
      if (!(b > a)) { $('#l-err').textContent = t('v.l.bad'); return; }
      $('#l-err').textContent = '';
      D.sessions.push({ id: uid(), start: a, end: b, planned: Math.round((b - a) / 1000), actual: Math.round((b - a) / 1000), mode: 'manual', tag: $('#l-tag').value || null, status: 'done', note: $('#l-note').value.trim().slice(0, 120) });
      D.sessions.sort(function (x, y) { return x.start - y.start; });
      $('#l-note').value = ''; save(true); toastC(t('v.l.added'));
      LO = Math.round((dayStart(a) - dayStart(Date.now())) / 864e5); renderLog(); renderHeader(); checkAwards();
    });
    $('#l-list').addEventListener('click', function (e) {
      var li = e.target.closest('li[data-id]'); if (!li) return; var id = li.getAttribute('data-id'), s = D.sessions.filter(function (x) { return x.id === id; })[0]; if (!s) return;
      var a = e.target.closest('[data-a]'); if (!a) return; var act = a.getAttribute('data-a');
      if (act === 'ed') LED = id;
      else if (act === 'del') {
        var idx = D.sessions.indexOf(s); D.sessions.splice(idx, 1); save(true); renderHeader(); renderLog();
        toast('<span class="tx">' + esc(t('v.deleted')) + ': ' + esc(hm(s.start)) + ' · ' + esc(C.dur(mins(s))) + '</span>', { undo: function () { D.sessions.splice(idx, 0, s); save(true); renderHeader(); renderLog(); }, ms: 6000 }); return;
      }
      else if (act === 'cx') LED = null;
      else if (act === 'sv') {
        s.tag = li.querySelector('[data-f=tag]').value || null; s.note = li.querySelector('[data-f=note]').value.trim().slice(0, 120);
        var m = clamp(+li.querySelector('[data-f=min]').value || 1, 1, 24 * 60); s.actual = m * 60; s.end = s.start + m * 60e3; if (s.mode === 'manual') s.planned = s.actual;
        LED = null; save(true); renderHeader();
      }
      renderLog();
    });
    $('#l-csv').addEventListener('click', exportCSV);
    $('#l-json').addEventListener('click', function () { download('vaqt-backup-' + dkey(Date.now()) + '.json', JSON.stringify({ app: 'clive', v: 1, at: new Date().toISOString(), 'clive.vaqt.v1': D }, null, 2), 'application/json'); });
    $('#l-import').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return; var r = new FileReader();
      r.onload = function () {
        try {
          var o = JSON.parse(r.result), v = o && o['clive.vaqt.v1'] ? o['clive.vaqt.v1'] : (o && Array.isArray(o.sessions) ? o : null); if (!v) throw 0;
          var have = {}; D.sessions.forEach(function (s) { have[s.id] = 1; }); var n = 0;
          v.sessions.forEach(function (s) { if (s && s.id && s.start && !have[s.id]) { D.sessions.push(s); n++; } });
          var ht = {}; D.tasks.forEach(function (x) { ht[x.id] = 1; }); (v.tasks || []).forEach(function (x) { if (x && x.id && !ht[x.id]) D.tasks.push(x); });
          var hg = {}; D.tags.forEach(function (x) { hg[x.id] = 1; }); (v.tags || []).forEach(function (x) { if (x && x.id && !hg[x.id]) D.tags.push(x); });
          ['unlocked', 'decorOwned', 'themesOwned'].forEach(function (k) { (v[k] || []).forEach(function (x) { if (D[k].indexOf(x) < 0) D[k].push(x); }); });
          D.coins = Math.max(D.coins, v.coins || 0);
          D.sessions.sort(function (a, b) { return a.start - b.start; }); save(true); toastC(C.fmt(t('v.l.imported'), { n: n })); renderAll();
        } catch (x) { toastC(t('v.l.badfile')); }
        e.target.value = '';
      };
      r.readAsText(f);
    });
  }
  function renderLog() {
    var a = addDays(dayStart(Date.now()), LO), b = addDays(a, 1);
    $('#l-label').textContent = LO === 0 ? t('v.today') : new Date(a).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
    $('#l-next').disabled = LO >= 0;
    var list = focusSessions().filter(function (s) { return s.start >= a && s.start < b; }).sort(function (x, y) { return x.start - y.start; });
    $('#l-sum').textContent = C.dur(list.filter(good).reduce(function (n, s) { return n + mins(s); }, 0));
    $('#l-timeline').innerHTML = timeline(list, a);
    if (!$('#l-date').value) $('#l-date').value = dkey(Date.now());
    $('#l-tag').innerHTML = tagOptions(D.settings.tag);
    if (!list.length) { $('#l-list').innerHTML = '<li class="empty" style="display:block">' + esc(t('v.l.empty')) + '</li>'; return; }
    $('#l-list').innerHTML = list.slice().reverse().map(function (s) {
      var tg = tag(s.tag), tk = task(s.task), m = mins(s);
      var desc = (s.mode === 'manual' ? '<span class="chip">' + C.icon('pen') + esc(t('v.l.manual')) + '</span>' : '<svg class="p" viewBox="' + Garden.box(s.species || 'lola') + '" aria-hidden="true">' + Garden.plant(s.species || 'lola', 1, { withered: !good(s), golden: s.golden, seed: 3 }) + '</svg><b>' + esc(pname(s.species)) + (s.golden ? ' ★' : '') + '</b>') +
        (tg ? '<span class="chip c" style="--c:' + esc(tg.color) + '">' + esc(tname(tg)) + '</span>' : '') + (!good(s) ? '<span class="chip c" style="--c:var(--rose)">' + esc(t('v.l.withered')) + '</span>' : '') +
        (s.rating ? '<span class="chip c" style="--c:var(--green)">' + esc(t('v.rate.r' + s.rating)) + '</span>' : '') +
        (tk ? '<span class="small muted">' + esc(tk.title) + '</span>' : '') + ((s.note || s.intent) ? '<span class="note">' + esc(s.note || s.intent) + '</span>' : '');
      var extra = LED === s.id ? '<div class="ed"><input class="input" type="number" min="1" max="1440" data-f="min" value="' + m + '" aria-label="' + esc(t('v.l.dur')) + '"><select class="input select" data-f="tag">' + tagOptions(s.tag) + '</select><input class="input" data-f="note" value="' + esc(s.note || '') + '" placeholder="' + esc(t('v.l.notep')) + '" aria-label="' + esc(t('v.l.note')) + '"><button class="btn primary sm" data-a="sv" style="--c:var(--green);--ci:#03170d">' + esc(t('v.t.save')) + '</button><button class="btn ghost sm" data-a="cx">' + esc(t('v.cancel')) + '</button></div>' : '';
      return '<li data-id="' + s.id + '"><div class="tm">' + hm(s.start) + '–' + hm(s.end || s.start + (s.actual || 0) * 1000) + '<small>' + esc(C.dur(m)) + '</small></div><div class="ds">' + desc + '</div><div class="act"><button class="iconbtn" data-a="ed" aria-label="' + esc(t('v.t.edit')) + '">' + C.icon('pen') + '</button><button class="iconbtn" data-a="del" aria-label="' + esc(t('v.t.del')) + '">' + C.icon('trash') + '</button></div>' + extra + '</li>';
    }).join('');
  }
  function exportCSV() {
    var rows = [['date', 'start', 'end', 'minutes', 'mode', 'status', 'tag', 'task', 'plant', 'golden', 'rating', 'note']];
    focusSessions().forEach(function (s) { var tg = tag(s.tag), tk = task(s.task); rows.push([dkey(s.start), hm(s.start), hm(s.end || s.start), mins(s), s.mode, s.status, tg ? tname(tg) : '', tk ? tk.title : '', s.species || '', s.golden ? 'yes' : '', s.rating || '', s.note || s.intent || '']); });
    download('vaqt-log-' + dkey(Date.now()) + '.csv', rows.map(function (r) { return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n'), 'text/csv');
  }
  function download(name, text, type) {
    try { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800); }
    catch (e) { C.copy(text); }
  }

  /* ---------------------------------------------------------------- settings */
  function bindPrefs() {
    [['p-focus', 'focus', 5, 180], ['p-short', 'short', 1, 30], ['p-long', 'long', 5, 60], ['p-rounds', 'rounds', 2, 8], ['p-goal', 'goal', 10, 720], ['p-grace', 'grace', 3, 60]].forEach(function (x) {
      $('#' + x[0]).addEventListener('change', function (e) { D.settings[x[1]] = clamp(Math.round(+e.target.value || DEF[x[1]]), x[2], x[3]); e.target.value = D.settings[x[1]]; if (D.settings.round > D.settings.rounds) D.settings.round = 1; save(); toastC(t('v.saved')); });
    });
    [['p-autobreak', 'autoBreak'], ['p-autofocus', 'autoFocus'], ['p-chime', 'chime'], ['p-wake', 'wake'], ['p-haptics', 'haptics'], ['p-confetti', 'confetti']].forEach(function (x) { $('#' + x[0]).addEventListener('change', function (e) { D.settings[x[1]] = e.target.checked; save(); }); });
    $('#p-notify').addEventListener('change', function (e) {
      if (!e.target.checked) { D.settings.notify = false; save(); return; }
      if (!('Notification' in window)) { e.target.checked = false; $('#p-notenote').textContent = t('v.p.notify.no'); return; }
      try { Notification.requestPermission().then(function (p) { D.settings.notify = p === 'granted'; e.target.checked = D.settings.notify; if (!D.settings.notify) $('#p-notenote').textContent = t('v.p.notify.no'); save(); }, function () { e.target.checked = false; $('#p-notenote').textContent = t('v.p.notify.no'); }); }
      catch (x) { e.target.checked = false; $('#p-notenote').textContent = t('v.p.notify.no'); }
    });
    $$('#p-deep [data-deep]').forEach(function (b) { b.addEventListener('click', function () { if (D.run && D.run.phase === 'focus') return; D.settings.deep = b.getAttribute('data-deep'); save(); renderPrefs(); }); });
    $('#p-tags').addEventListener('change', function (e) {
      var li = e.target.closest('li[data-id]'); if (!li) return; var tg = tag(li.getAttribute('data-id'));
      if (e.target.type === 'color') tg.color = e.target.value; else tg.name = (e.target.value.trim() || tname(tg)).slice(0, 24); save(); renderPrefs();
    });
    $('#p-tags').addEventListener('click', function (e) { var b = e.target.closest('[data-rmtag]'); if (!b) return; var id = b.getAttribute('data-rmtag'); D.tags = D.tags.filter(function (x) { return x.id !== id; }); if (D.settings.tag === id) D.settings.tag = null; save(); renderPrefs(); });
    $('#p-tagform').addEventListener('submit', function (e) { e.preventDefault(); var n = $('#p-tagname').value.trim(); if (!n) return; D.tags.push({ id: 't' + uid(), name: n.slice(0, 24), color: TAGC[D.tags.length % TAGC.length] }); $('#p-tagname').value = ''; save(); renderPrefs(); });
    $('#p-tour').addEventListener('click', openOnboard);
    $('#p-clear').addEventListener('click', function () { $('#p-clearbox').classList.add('on'); });
    $('#p-clear-n').addEventListener('click', function () { $('#p-clearbox').classList.remove('on'); });
    $('#p-clear-y').addEventListener('click', function () { Object.keys(PLAY).forEach(stopOne); D = fresh(); D.onboarded = true; save(true); $('#p-clearbox').classList.remove('on'); toastC(t('v.p.cleared')); rollQuests(); renderAll(); });
  }
  function renderPrefs() {
    var s = D.settings;
    $('#p-focus').value = s.focus; $('#p-short').value = s.short; $('#p-long').value = s.long; $('#p-rounds').value = s.rounds; $('#p-goal').value = s.goal; $('#p-grace').value = s.grace;
    $('#p-autobreak').checked = s.autoBreak; $('#p-autofocus').checked = s.autoFocus; $('#p-chime').checked = s.chime; $('#p-notify').checked = s.notify; $('#p-wake').checked = s.wake; $('#p-haptics').checked = s.haptics; $('#p-confetti').checked = s.confetti;
    $$('#p-deep [data-deep]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-deep') === s.deep)); });
    $('#p-deepnote').textContent = t(s.deep === 'strict' ? 'v.p.deep.s' : s.deep === 'gentle' ? 'v.p.deep.g' : 'v.p.deep.o');
    $('#p-tags').innerHTML = D.tags.map(function (x) { return '<li data-id="' + x.id + '"><input type="color" value="' + esc(x.color) + '" aria-label="Colour"><input class="input" value="' + esc(tname(x)) + '" maxlength="24" aria-label="' + esc(t('v.p.tagname')) + '"><button class="iconbtn" data-rmtag="' + x.id + '" aria-label="' + esc(t('v.t.del')) + '">' + C.icon('trash') + '</button></li>'; }).join('');
  }

  /* ---------------------------------------------------------------- keyboard */
  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      var tg = (e.target.tagName || '').toLowerCase();
      if (tg === 'input' || tg === 'textarea' || tg === 'select' || e.target.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
      if (!$('#m-onboard').hidden) return;
      var k = e.key;
      if (k === ' ' && view === 'focus' && tg !== 'button') { e.preventDefault(); if (!D.run) { D.pendingBreak ? startBreak() : startFocus(); } else togglePause(); }
      else if ((k === '1' || k === '2' || k === '3') && !D.run) { D.settings.mode = ['timer', 'pomo', 'flow'][+k - 1]; fitSpecies(); save(); if (view !== 'focus') go('focus'); else renderFocus(); }
      else if ((k === 'ArrowUp' || k === 'ArrowDown') && view === 'focus' && !D.run && D.settings.mode === 'timer' && tg !== 'button') { e.preventDefault(); bump(k === 'ArrowUp' ? 5 : -5); }
      else if (k === 'f' || k === 'F') toggleZen();
      else if (k === 'm' || k === 'M') { D.sounds.muted = !D.sounds.muted; applyMaster(); save(); renderFocus(); }
      else if (k === 'g' || k === 'G') go('garden');
      else if (k === 'b' || k === 'B') go('bazaar');
      else if (k === 'a' || k === 'A') go('awards');
      else if (k === 's' || k === 'S') go('stats');
      else if (k === 't' || k === 'T') go('tasks');
      else if (k === 'Escape') { if (!$('#m-done').hidden) closeDone(); $('#m-wither').hidden = true; $('#m-level').hidden = true; if (document.body.classList.contains('zen')) toggleZen(); }
    });
  }

  if (window.Clive && Clive.booted) boot(); else document.addEventListener('clive:ready', boot);
})();
