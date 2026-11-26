/* Vaqt: focus timer and time tracker that grows an Uzbek garden. Part of the Clive orbit. No dependencies. */
(function () {
  'use strict';
  var KEY = 'clive.vaqt.v1';
  var C, t, $, $$, esc, D;
  var DEF = { focus: 25, short: 5, long: 15, rounds: 4, autoBreak: true, autoFocus: false, deep: 'strict', grace: 15, goal: 120, chime: true, notify: false, wake: true, mode: 'timer', minutes: 25, species: 'lola', tag: 't0', task: null, round: 1 };
  var TAGC = ['#5B7CFF', '#FF9B3D', '#22CFC6', '#F5C04A', '#9B7BFF', '#3DDC97'];
  var SOUNDS = [['rain', 'cloud'], ['brown', 'wave'], ['ocean', 'wave'], ['fire', 'flame'], ['wind', 'wind'], ['clock', 'clock']];
  var MIN_KEEP = 10; /* minutes: shortest session that plants something */

  function boot() {
    C = window.Clive; t = C.t; $ = C.$; $$ = C.$$; esc = C.esc;
    D = load();
    bindNav(); bindFocus(); bindGarden(); bindStats(); bindTasks(); bindLog(); bindSounds(); bindPrefs(); bindKeys();
    resume();
    route();
    window.addEventListener('hashchange', route);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('clive:lang', function () { renderAll(); });
    document.addEventListener('clive:settings', function () { themeIcon(); });
    setInterval(tick, 250);
    var auto = null; try { auto = sessionStorage.getItem('vaqt.autostart'); sessionStorage.removeItem('vaqt.autostart'); } catch (e) {}
    if (auto && !D.run) { D.settings.mode = 'timer'; D.settings.minutes = clamp(+auto || 25, MIN_KEEP, 180); save(); renderFocus(); startFocus(); }
    renderAll(); themeIcon();
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) { try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {} }
  }

  /* ---------------------------------------------------------------- data */
  function defTags() { return TAGC.map(function (c, i) { return { id: 't' + i, name: t('v.tag.' + i), color: c }; }); }
  function fresh() {
    return { v: 1, sessions: [], tasks: [], tags: defTags(), coins: 0, unlocked: ['lola', 'paxta'], settings: Object.assign({}, DEF),
      sounds: { master: .7, only: false, muted: false, vol: { rain: .6, brown: .5, ocean: .6, fire: .6, wind: .5, clock: .35 }, on: [] }, awards: [], run: null, created: Date.now() };
  }
  function load() {
    var d = C.load(KEY, null);
    if (!d || !Array.isArray(d.sessions)) d = fresh();
    var f = fresh();
    d.settings = Object.assign({}, DEF, d.settings || {});
    d.sounds = Object.assign(f.sounds, d.sounds || {}); d.sounds.vol = Object.assign(f.sounds.vol, d.sounds.vol || {});
    d.tasks = d.tasks || []; d.tags = d.tags && d.tags.length ? d.tags : f.tags; d.unlocked = d.unlocked || ['lola', 'paxta']; d.awards = d.awards || []; d.coins = d.coins || 0;
    return d;
  }
  var saveT;
  function save(now) { clearTimeout(saveT); if (now) { C.save(KEY, D); return; } saveT = setTimeout(function () { C.save(KEY, D); }, 200); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function sp(id) { return Garden.SPECIES.filter(function (s) { return s.id === id; })[0] || Garden.SPECIES[0]; }
  function pname(id) { return Garden.name(id, C.S.lang); }
  function tag(id) { return D.tags.filter(function (x) { return x.id === id; })[0] || null; }
  function task(id) { return D.tasks.filter(function (x) { return x.id === id; })[0] || null; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hm(ms) { var d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function dayStart(ms) { var d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function addDays(ms, n) { var d = new Date(ms); d.setDate(d.getDate() + n); return d.getTime(); }
  function dkey(ms) { var d = new Date(ms); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function mins(s) { return Math.round((s.actual || 0) / 60); }
  function focusSessions() { return D.sessions.filter(function (s) { return s.mode !== 'break'; }); }
  function good(s) { return s.status !== 'withered'; }
  function locale() { return C.S.lang === 'uz' ? 'uz-UZ' : C.S.lang === 'ru' ? 'ru-RU' : 'en-GB'; }
  function fmtClock(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ':' + pad(m) : pad(m)) + ':' + pad(s); }

  /* ---------------------------------------------------------------- routing */
  var VIEWS = ['focus', 'garden', 'stats', 'tasks', 'log', 'sounds', 'awards', 'prefs'], view = 'focus';
  function route() {
    var h = (location.hash || '').slice(1); view = VIEWS.indexOf(h) >= 0 ? h : 'focus';
    VIEWS.forEach(function (v) { var el = $('#v-' + v); if (el) el.hidden = v !== view; });
    $$('[data-view]').forEach(function (b) { if (b.getAttribute('data-view') === view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
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
    if (view === 'focus') renderFocus();
    else if (view === 'garden') renderGarden();
    else if (view === 'stats') renderStats();
    else if (view === 'tasks') renderTasks();
    else if (view === 'log') renderLog();
    else if (view === 'sounds') renderSounds();
    else if (view === 'awards') renderAwards();
    else if (view === 'prefs') renderPrefs();
  }
  function renderAll() { renderHeader(); renderView(); }

  /* ---------------------------------------------------------------- stats helpers */
  function streaks() {
    var days = {};
    focusSessions().forEach(function (s) { if (good(s)) days[dkey(s.start)] = 1; });
    var cur = 0, d = Date.now();
    if (!days[dkey(d)]) d = addDays(d, -1);
    while (days[dkey(d)]) { cur++; d = addDays(d, -1); }
    var keys = Object.keys(days).sort(), best = 0, run = 0, prev = null;
    keys.forEach(function (k) {
      var ms = new Date(k + 'T12:00:00').getTime();
      if (prev != null && Math.round((ms - prev) / 864e5) === 1) run++; else run = 1;
      best = Math.max(best, run); prev = ms;
    });
    return { cur: cur, best: best };
  }
  function minutesIn(a, b, pred) { return focusSessions().filter(function (s) { return good(s) && s.start >= a && s.start < b && (!pred || pred(s)); }).reduce(function (n, s) { return n + mins(s); }, 0); }
  function todayMin() { var a = dayStart(Date.now()); return minutesIn(a, addDays(a, 1)); }
  function renderHeader() {
    $('#h-coins b').textContent = D.coins;
    $('#h-streak b').textContent = streaks().cur;
  }

  /* ---------------------------------------------------------------- focus view */
  var dragging = false, lastIsland = '', holdT = null, holdStart = 0;
  function bindFocus() {
    $$('#modes [data-mode]').forEach(function (b) { b.addEventListener('click', function () { if (D.run) return; D.settings.mode = b.getAttribute('data-mode'); fitSpecies(); save(); renderFocus(); }); });
    var dial = $('#dial');
    var ticks = '';
    for (var i = 0; i < 36; i++) { var a = i / 36 * Math.PI * 2, big = i % 3 === 0, r1 = big ? 118 : 122, r2 = 128; ticks += '<line ' + (big ? 'class="big" ' : '') + 'x1="' + (160 + Math.sin(a) * r1).toFixed(1) + '" y1="' + (160 - Math.cos(a) * r1).toFixed(1) + '" x2="' + (160 + Math.sin(a) * r2).toFixed(1) + '" y2="' + (160 - Math.cos(a) * r2).toFixed(1) + '"/>'; }
    $('#ticks').innerHTML = ticks;
    function setFrom(e) {
      var r = dial.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      var a = Math.atan2(x, -y); if (a < 0) a += Math.PI * 2;
      var m = Math.round(a / (Math.PI * 2) * 180 / 5) * 5; if (m === 0) m = 180;
      D.settings.minutes = clamp(m, MIN_KEEP, 180); fitSpecies(); renderFocus(); save();
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
    $('#start').addEventListener('click', function () { if (D.run) return; if (D.pendingBreak) startBreak(); else startFocus(); });
    $('#pause').addEventListener('click', togglePause);
    $('#stopflow').addEventListener('click', finishFlow);
    $('#plus5').addEventListener('click', function () { if (D.run && D.run.planned) { D.run.planned = Math.min(D.run.planned + 300, 180 * 60 + 600); save(); toastC(t('v.plus5')); } });
    $('#skip').addEventListener('click', function () { if (D.run && D.run.phase !== 'focus') { endBreak(true); } else if (D.pendingBreak) { D.pendingBreak = null; save(); renderFocus(); } });
    var gu = $('#giveup');
    function hold(e) {
      if (!D.run) return; e.preventDefault();
      if (elapsed() < 10) { cancelRun(); return; }
      holdStart = performance.now();
      gu.querySelector('span').textContent = t('v.hold');
      (function step() { var p = (performance.now() - holdStart) / 1300; gu.style.setProperty('--p', Math.min(1, p)); if (p >= 1) { holdT = null; release(); wither('gaveup'); return; } holdT = requestAnimationFrame(step); })();
    }
    function release() { if (holdT) cancelAnimationFrame(holdT); holdT = null; gu.style.setProperty('--p', 0); gu.querySelector('span').textContent = elapsed() < 10 ? t('v.cancel') : t('v.giveup'); }
    gu.addEventListener('pointerdown', hold); gu.addEventListener('pointerup', release); gu.addEventListener('pointerleave', release);
    gu.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) hold(e); });
    gu.addEventListener('keyup', function (e) { if (e.key === 'Enter' || e.key === ' ') release(); });
    $('#f-task').addEventListener('change', function (e) { D.settings.task = e.target.value || null; var tk = task(D.settings.task); if (tk && tk.tag) D.settings.tag = tk.tag; save(); renderFocus(); });
    $('#intent').addEventListener('input', function (e) { D.settings.intent = e.target.value; save(); });
    $('#seeds').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sp]'); if (!b || D.run) return;
      var id = b.getAttribute('data-sp'), s = sp(id);
      if (D.unlocked.indexOf(id) < 0) {
        if (D.coins >= s.cost) { D.coins -= s.cost; D.unlocked.push(id); toastC(C.fmt(t('v.unlocked'), { plant: pname(id) })); }
        else { toastC(C.fmt(t('v.needcoins'), { n: s.cost - D.coins })); return; }
      }
      D.settings.species = id;
      if (D.settings.mode === 'timer' && D.settings.minutes < s.min) { D.settings.minutes = s.min; toastC(C.fmt(t('v.minfor'), { plant: pname(id), n: s.min })); }
      save(); renderFocus(); renderHeader(); checkAwards();
    });
    $('#tagpick').addEventListener('click', function (e) { var b = e.target.closest('[data-tag]'); if (!b) return; D.settings.tag = b.getAttribute('data-tag') || null; if (D.run) D.run.tag = D.settings.tag; save(); renderFocus(); });
    $$('#deep [data-deep]').forEach(function (b) { b.addEventListener('click', function () { if (D.run && D.run.phase === 'focus') return; D.settings.deep = b.getAttribute('data-deep'); save(); renderFocus(); }); });
    $('#qsnd').addEventListener('click', function (e) { var b = e.target.closest('[data-snd]'); if (b) toggleSound(b.getAttribute('data-snd')); });
    $('#pip').addEventListener('click', openPip);
    $('#fs').addEventListener('click', toggleZen);
    $('#mute').addEventListener('click', function () { D.sounds.muted = !D.sounds.muted; applyMaster(); save(); renderFocus(); });
    $('#d-close').addEventListener('click', function () { $('#m-done').hidden = true; });
    $('#w-close').addEventListener('click', function () { $('#m-wither').hidden = true; });
    $('#w-again').addEventListener('click', function () { $('#m-wither').hidden = true; go('focus'); startFocus(); });
  }
  function bump(n) { D.settings.minutes = clamp(D.settings.minutes + n, MIN_KEEP, 180); fitSpecies(); save(); renderFocus(); }
  function plannedMinutes() { var s = D.settings; return s.mode === 'pomo' ? s.focus : s.mode === 'flow' ? 0 : s.minutes; }
  function fitSpecies() {
    var s = sp(D.settings.species);
    if (D.unlocked.indexOf(s.id) < 0) D.settings.species = 'lola';
    var pm = plannedMinutes();
    if (pm && pm < sp(D.settings.species).min) {
      var ok = Garden.SPECIES.filter(function (x) { return D.unlocked.indexOf(x.id) >= 0 && x.min <= pm; });
      D.settings.species = ok.length ? ok[ok.length - 1].id : 'lola';
    }
  }
  function elapsed(now) {
    var r = D.run; if (!r) return 0; now = now || Date.now();
    return Math.max(0, (now - r.start - (r.pausedTotal || 0) - (r.pausedAt ? now - r.pausedAt : 0)) / 1000);
  }
  function progress() {
    var r = D.run; if (!r) return 0;
    if (r.phase !== 'focus') return 1;
    if (!r.planned) return Math.min(1, elapsed() / (Math.max(sp(r.species).min, 25) * 60));
    return Math.min(1, elapsed() / r.planned);
  }
  function renderFocus() {
    var s = D.settings, r = D.run, focusing = r && r.phase === 'focus', breaking = r && r.phase !== 'focus';
    document.body.classList.toggle('running', !!r);
    document.body.classList.toggle('break-mode', !!breaking || !!D.pendingBreak);
    $$('#modes [data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === s.mode)); });
    var dots = '';
    if (s.mode === 'pomo') for (var i = 1; i <= s.rounds; i++) dots += '<i class="' + (i < s.round ? 'on' : '') + (i === s.round ? ' cur' : '') + '"></i>';
    $('#pomodots').innerHTML = dots;
    /* seeds */
    var L = C.S.lang;
    $('#seeds').innerHTML = Garden.SPECIES.map(function (x, k) {
      var lock = D.unlocked.indexOf(x.id) < 0, on = x.id === (r ? r.species : s.species);
      return '<button data-sp="' + x.id + '" aria-pressed="' + on + '" class="' + (lock ? 'lock' : '') + '" title="' + esc(x.note[L] || x.note.en) + '"' + (r ? ' disabled' : '') + '>' +
        (lock ? '<span class="cost">' + C.icon('coin') + x.cost + '</span>' : '') + '<svg viewBox="-45 -125 90 135" aria-hidden="true">' + Garden.plant(x.id, 1, { seed: 3 + k }) + '</svg>' + esc(x.name[L] || x.name.en) + '</button>';
    }).join('');
    var cur = sp(r ? r.species : s.species);
    $('#seednote').textContent = (cur.note[L] || cur.note.en) + ' · ' + C.fmt(t('v.recmin'), { n: cur.min });
    /* tags */
    var tg = r ? r.tag : s.tag;
    $('#tagpick').innerHTML = D.tags.map(function (x) { return '<button data-tag="' + x.id + '" style="--c:' + x.color + '" aria-pressed="' + (x.id === tg) + '"><i></i>' + esc(x.name) + '</button>'; }).join('') +
      '<button data-tag="" style="--c:var(--mute)" aria-pressed="' + (!tg) + '"><i></i>' + esc(t('v.notag')) + '</button>';
    /* tasks */
    var open = D.tasks.filter(function (x) { return !x.done; });
    $('#f-task').innerHTML = '<option value="">' + esc(t('v.notask')) + '</option>' + open.map(function (x) { return '<option value="' + x.id + '"' + (x.id === s.task ? ' selected' : '') + '>' + esc(x.title) + '</option>'; }).join('');
    $('#f-task').disabled = !!r;
    var ii = $('#intent'); if (document.activeElement !== ii) ii.value = (r ? r.intent : s.intent) || '';
    /* deep */
    $$('#deep [data-deep]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-deep') === s.deep)); b.disabled = !!focusing; });
    $('#deepnote').textContent = t(s.deep === 'strict' ? 'v.p.deep.s' : s.deep === 'gentle' ? 'v.p.deep.g' : 'v.p.deep.o');
    /* quick sounds */
    $('#qsnd').innerHTML = SOUNDS.map(function (x) { return '<button data-snd="' + x[0] + '" aria-pressed="' + (D.sounds.on.indexOf(x[0]) >= 0) + '">' + esc(t('v.snd.' + x[0])) + '</button>'; }).join('');
    $('#mute').innerHTML = C.icon(D.sounds.muted ? 'mute' : 'volume');
    /* buttons */
    var pending = !r && D.pendingBreak;
    $('#start').hidden = !!r;
    $('#start span').textContent = pending ? t('v.startbreak') : t('v.start');
    $('#pause').hidden = !r || (focusing && s.deep === 'strict') || (focusing && !r.planned);
    $('#pause span').textContent = r && r.pausedAt ? t('v.resume') : t('v.pause');
    $('#giveup').hidden = !focusing || !r.planned;
    $('#stopflow').hidden = !(focusing && !r.planned);
    $('#plus5').hidden = !(focusing && r.planned && s.mode === 'timer');
    $('#skip').hidden = !(breaking || pending);
    if (focusing && r.planned) $('#giveup span').textContent = elapsed() < 10 ? t('v.cancel') : t('v.giveup');
    $('#dial').setAttribute('aria-valuenow', s.minutes);
    $('#dial').setAttribute('aria-disabled', String(!!r || s.mode !== 'timer'));
    lastIsland = '';
    renderToday();
    paint();
  }
  function renderToday() {
    var tm = todayMin(), g = D.settings.goal;
    $('#goal-num').textContent = tm;
    $('#goal-txt').textContent = tm >= g ? t('v.goalmet') + ' · ' + C.fmt(t('v.goal'), { a: tm, b: g }) : C.fmt(t('v.goal'), { a: tm, b: g });
    $('#goal-arc').style.strokeDashoffset = (314.16 * (1 - Math.min(1, tm / g))).toFixed(1);
    var a = dayStart(Date.now()), b = addDays(a, 1), today = focusSessions().filter(function (s) { return s.start >= a && s.start < b; });
    $('#ft-plants').textContent = today.filter(function (s) { return good(s) && s.mode !== 'manual'; }).length;
    $('#ft-sessions').textContent = today.length;
    $('#ft-streak').textContent = streaks().cur;
    $('#f-timeline').innerHTML = timeline(today, a);
  }
  function timeline(list, a) {
    var h = list.map(function (s) {
      var l = (s.start - a) / 864e5 * 100, w = Math.max(.25, (s.actual || 0) * 1000 / 864e5 * 100), tg = tag(s.tag);
      return '<i class="' + (good(s) ? '' : 'w') + '" style="left:' + l.toFixed(2) + '%;width:' + w.toFixed(2) + '%;--c:' + (tg ? tg.color : 'var(--mute)') + '" title="' + esc(hm(s.start) + ' · ' + mins(s) + ' ' + t('v.min') + (tg ? ' · ' + tg.name : '')) + '"></i>';
    }).join('');
    if (Date.now() >= a && Date.now() < a + 864e5) h += '<span class="now" style="left:' + ((Date.now() - a) / 864e5 * 100).toFixed(2) + '%"></span>';
    return h;
  }
  /* the per-frame part: dial, island, time, status, title */
  function paint() {
    var r = D.run, s = D.settings, arc = $('#arc'), knob = $('#knob'), CIRC = 879.65, frac, sec;
    if (!r) {
      var pm = plannedMinutes(); frac = s.mode === 'flow' ? 0 : pm / 180;
      sec = s.mode === 'flow' ? 0 : pm * 60;
      if (D.pendingBreak) { sec = D.pendingBreak.min * 60; frac = D.pendingBreak.min / 180; }
    } else if (r.phase === 'focus') {
      if (r.planned) { sec = r.planned - elapsed(); frac = 1 - elapsed() / r.planned; }
      else { sec = elapsed(); frac = (elapsed() % 3600) / 3600; }
    } else { sec = r.planned - elapsed(); frac = Math.max(0, sec / r.planned); }
    frac = clamp(frac, 0, 1);
    arc.style.strokeDashoffset = (CIRC * (1 - frac)).toFixed(1);
    var ang = frac * Math.PI * 2;
    knob.setAttribute('cx', (160 + Math.sin(ang) * 140).toFixed(1)); knob.setAttribute('cy', (160 - Math.cos(ang) * 140).toFixed(1));
    var tm = fmtClock(sec);
    $('#time').textContent = tm;
    var spc = r ? r.species : s.species, p = r ? (r.phase === 'focus' ? progress() : 1) : 0;
    var key = spc + ':' + p.toFixed(3);
    if (key !== lastIsland) { $('#island').innerHTML = Garden.island(spc, r ? Math.max(p, .04) : .04, { seed: 4, label: pname(spc) }); lastIsland = key; }
    var st;
    if (!r) st = D.pendingBreak ? t(D.pendingBreak.long ? 'v.longbreak' : 'v.break') : C.fmt(t('v.ready'), { plant: pname(spc) });
    else if (r.pausedAt) st = t('v.paused');
    else if (r.phase !== 'focus') st = t(r.phase === 'long' ? 'v.longbreak' : 'v.break');
    else if (!r.planned) st = t('v.flow');
    else st = C.fmt(t(s.deep === 'strict' ? 'v.growing' : 'v.growing.g'), { plant: pname(spc) }) + (r.interruptions ? ' · ' + C.fmt(t('v.interrupt'), { n: r.interruptions }) : '');
    if (s.mode === 'pomo' && (!r || r.phase === 'focus')) st = C.fmt(t('v.round'), { a: s.round, b: s.rounds }) + ' · ' + st;
    var se = $('#status'); if (se.textContent !== st) se.textContent = st;
    var gu = $('#giveup'); if (r && !gu.hidden && !holdT) { var gl = elapsed() < 10 ? t('v.cancel') : t('v.giveup'); if (gu.lastElementChild.textContent !== gl) gu.lastElementChild.textContent = gl; }
    document.title = r ? tm + ' · ' + (r.phase === 'focus' ? pname(spc) : t('v.p.short')) + ' · Vaqt' : 'Vaqt · ' + t('pd.vaqt.tag');
    favicon(r ? (r.phase === 'focus' ? (r.planned ? 1 - frac : p) : frac) : null, r && r.phase !== 'focus');
    pipPaint(tm, spc, p, r);
  }
  var favEl, favLast = '';
  function favicon(p, brk) {
    favEl = favEl || document.getElementById('fav');
    if (!favEl) return;
    var k = p == null ? 'n' : (Math.round(p * 40) + (brk ? 'b' : ''));
    if (k === favLast) return; favLast = k;
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
    if (D.run) return;
    fitSpecies();
    var s = D.settings, planned = plannedMinutes() * 60;
    D.pendingBreak = null;
    D.run = { id: uid(), phase: 'focus', mode: s.mode, start: Date.now(), planned: planned, species: s.species, tag: s.tag, task: s.task, intent: (s.intent || '').trim(), pausedAt: null, pausedTotal: 0, interruptions: 0, hiddenAt: null, lastBeat: Date.now() };
    save(true); wake(true); syncSounds(); renderFocus(); ac();
  }
  function startBreak() {
    var pb = D.pendingBreak; if (!pb) return;
    D.pendingBreak = null;
    D.run = { id: uid(), phase: pb.long ? 'long' : 'break', mode: 'pomo', start: Date.now(), planned: pb.min * 60, pausedAt: null, pausedTotal: 0, lastBeat: Date.now() };
    save(true); wake(true); syncSounds(); renderFocus();
  }
  function togglePause() {
    var r = D.run; if (!r) return;
    if (r.phase === 'focus' && D.settings.deep === 'strict') return;
    if (r.pausedAt) { r.pausedTotal += Date.now() - r.pausedAt; r.pausedAt = null; } else r.pausedAt = Date.now();
    save(true); syncSounds(); renderFocus();
  }
  function cancelRun() { D.run = null; save(true); wake(false); syncSounds(); renderFocus(); toastC(t('v.cancel.ok')); }
  function record(status, endMs) {
    var r = D.run, act = Math.round(elapsed(endMs));
    if (r.planned && status === 'done') act = r.planned;
    var s = { id: r.id, start: r.start, end: endMs || Date.now(), planned: r.planned, actual: act, mode: r.mode, species: r.species, tag: r.tag, task: r.task, intent: r.intent, status: status, interruptions: r.interruptions || 0 };
    D.sessions.push(s);
    return s;
  }
  function tick() {
    var r = D.run;
    if (!r) { if (view === 'focus' && !dragging) { /* keep timeline "now" fresh */ } return; }
    var now = Date.now();
    if (document.hidden && r.phase === 'focus' && r.hiddenAt && !r.pausedAt && D.settings.deep === 'strict' && now - r.hiddenAt > D.settings.grace * 1000) { wither('away', r.hiddenAt + D.settings.grace * 1000); return; }
    if (!document.hidden) { r.lastBeat = now; if (now % 5000 < 260) save(); }
    if (!r.pausedAt && r.planned && elapsed(now) >= r.planned) { if (r.phase === 'focus') completeFocus(r.start + r.planned + (r.pausedTotal || 0)); else endBreak(false); return; }
    if (view === 'focus') paint(); else pipPaint(fmtClock(r.planned ? r.planned - elapsed() : elapsed()), r.species, progress(), r);
  }
  function completeFocus(endMs) {
    var r = D.run, s = record('done', Math.min(endMs || Date.now(), Date.now())), m = mins(s);
    D.coins += m; D.run = null;
    var st = D.settings, pomo = r.mode === 'pomo';
    if (pomo) {
      var long = st.round >= st.rounds;
      D.pendingBreak = { min: long ? st.long : st.short, long: long };
      st.round = long ? 1 : st.round + 1;
    }
    save(true); wake(false); chime(); renderHeader();
    notify(C.fmt(t('v.notif.t'), { plant: pname(s.species) }), C.fmt(t('v.done.p'), { min: m }));
    showDone(s);
    if (pomo && st.autoBreak) startBreak(); else syncSounds();
    renderFocus(); checkAwards();
  }
  function endBreak(skipped) {
    D.run = null; save(true); wake(false);
    if (!skipped) { chime(); notify('Vaqt', t('v.notif.b')); }
    syncSounds();
    if (D.settings.autoFocus && !skipped) startFocus(); else renderFocus();
  }
  function finishFlow() {
    var r = D.run; if (!r) return;
    if (elapsed() < MIN_KEEP * 60) { D.run = null; save(true); wake(false); syncSounds(); renderFocus(); toastC(C.fmt(t('v.tooshort'), { n: MIN_KEEP })); return; }
    var s = record('done'); D.coins += mins(s); D.run = null; save(true); wake(false); chime(); renderHeader(); syncSounds(); showDone(s); renderFocus(); checkAwards();
  }
  function wither(reason, at) {
    var r = D.run; if (!r || r.phase !== 'focus') return;
    var s = record('withered', at || Date.now());
    D.run = null; save(true); wake(false); syncSounds(); renderFocus(); renderHeader();
    $('#w-island').innerHTML = Garden.island(s.species, Math.max(.5, s.planned ? s.actual / s.planned : .6), { withered: true, seed: 4 });
    $('#w-title').textContent = C.fmt(t('v.wither.t'), { plant: pname(s.species) });
    $('#w-text').textContent = reason === 'away' ? C.fmt(t('v.wither.p'), { n: D.settings.grace }) : t('v.wither.g');
    $('#m-wither').hidden = false;
  }
  function showDone(s) {
    $('#d-island').innerHTML = Garden.island(s.species, 1, { seed: 4 });
    $('#d-title').textContent = C.fmt(t('v.done.t'), { plant: pname(s.species) });
    $('#d-text').textContent = C.fmt(t('v.done.p'), { min: mins(s) });
    $('#d-coins b').textContent = C.fmt(t('v.coins'), { n: mins(s) });
    var tk = task(s.task), db = $('#d-task');
    db.hidden = !tk || tk.done;
    if (tk) { db.querySelector('span').textContent = C.fmt(t('v.taskdone'), { task: tk.title.slice(0, 40) }); db.onclick = function () { tk.done = true; tk.doneAt = Date.now(); if (D.settings.task === tk.id) D.settings.task = null; save(); db.hidden = true; checkAwards(); renderFocus(); }; }
    var nx = $('#d-next');
    nx.querySelector('span').textContent = D.pendingBreak ? t('v.startbreak') : t('v.again');
    nx.onclick = function () { $('#m-done').hidden = true; if (D.run) return; if (D.pendingBreak) startBreak(); else startFocus(); };
    if (D.run && D.run.phase !== 'focus') nx.querySelector('span').textContent = t('v.close');
    $('#m-done').hidden = false;
    if (document.documentElement.getAttribute('data-motion') !== 'reduced' && C.starBurst) { /* a quiet sparkle */ }
  }
  function resume() {
    var r = D.run; if (!r) return;
    var now = Date.now();
    if (r.phase === 'focus' && D.settings.deep === 'strict' && !r.pausedAt) {
      var away = now - (r.lastBeat || now);
      if (away > D.settings.grace * 1000) { wither('away', r.lastBeat + D.settings.grace * 1000); return; }
    }
    if (!r.pausedAt && r.planned && elapsed(now) >= r.planned) { if (r.phase === 'focus') completeFocus(r.start + r.planned + (r.pausedTotal || 0)); else endBreak(false); return; }
    wake(true);
  }
  function onVis() {
    var r = D.run;
    if (document.hidden) {
      if (r && r.phase === 'focus' && !r.pausedAt) { r.hiddenAt = Date.now(); if (D.settings.deep === 'gentle') r.interruptions = (r.interruptions || 0) + 1; save(true); }
      return;
    }
    if (r && r.hiddenAt) {
      var away = Date.now() - r.hiddenAt; r.hiddenAt = null;
      if (r.phase === 'focus' && D.settings.deep === 'strict') {
        if (away > D.settings.grace * 1000) { wither('away', Date.now()); return; }
        if (away > 1500) toastC(C.fmt(t('v.back'), { s: Math.round(away / 1000), n: D.settings.grace }));
      }
      r.lastBeat = Date.now(); save();
    }
    if (D.run) wake(true);
    renderFocus();
  }

  /* ---------------------------------------------------------------- screen wake lock, notifications, chime */
  var lock = null;
  function wake(on) {
    try {
      if (on && D.settings.wake && 'wakeLock' in navigator && !lock && !document.hidden) navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { lock = null; }); }, function () {});
      if (!on && lock) { lock.release(); lock = null; }
    } catch (e) {}
  }
  function notify(title, body) {
    try { if (D.settings.notify && 'Notification' in window && Notification.permission === 'granted' && document.hidden) new Notification(title, { body: body, icon: 'icon-192.png', tag: 'vaqt' }); } catch (e) {}
  }
  function chime() {
    if (!D.settings.chime) return;
    var a = ac(); if (!a) return;
    var now = a.currentTime;
    [[523.25, 1], [783.99, .6], [1046.5, .45], [1567.98, .2]].forEach(function (p, i) {
      var o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.value = p[0];
      g.gain.setValueAtTime(0, now + i * .09); g.gain.linearRampToValueAtTime(.22 * p[1], now + i * .09 + .02); g.gain.exponentialRampToValueAtTime(.0001, now + i * .09 + 2.6);
      o.connect(g); g.connect(a.destination); o.start(now + i * .09); o.stop(now + i * .09 + 2.7);
    });
  }
  var toastT2;
  function toastC(m) { C.toast(m); }

  /* ---------------------------------------------------------------- mini timer window */
  var pipW = null;
  function openPip() {
    if (!('documentPictureInPicture' in window)) { toastC(t('v.pip.no')); return; }
    if (pipW) { pipW.close(); pipW = null; return; }
    window.documentPictureInPicture.requestWindow({ width: 240, height: 300 }).then(function (w) {
      pipW = w;
      var st = w.document.createElement('style');
      st.textContent = 'body{margin:0;background:#070A18;color:#EEF1FF;font-family:Unbounded,Manrope,system-ui,sans-serif;display:grid;place-items:center;height:100vh;text-align:center}#i{width:180px;height:180px}#i svg{width:100%;height:100%}#t{font-weight:700;font-size:40px;font-variant-numeric:tabular-nums;letter-spacing:-.02em}#s{font:600 12px Manrope,system-ui,sans-serif;color:#A9B1D6;margin-top:4px}';
      w.document.head.appendChild(st);
      w.document.body.innerHTML = '<div><div id="i"></div><div id="t">--:--</div><div id="s"></div></div>';
      w.addEventListener('pagehide', function () { pipW = null; });
      pipLast = ''; paint();
    }, function () { toastC(t('v.pip.no')); });
  }
  var pipLast = '';
  function pipPaint(tm, spc, p, r) {
    if (!pipW) return;
    try {
      var d = pipW.document; d.getElementById('t').textContent = tm;
      d.getElementById('s').textContent = r ? (r.phase === 'focus' ? pname(spc) : t('v.p.short')) : 'Vaqt';
      var k = spc + (p || 0).toFixed(2);
      if (k !== pipLast) { d.getElementById('i').innerHTML = Garden.island(spc, Math.max(.04, p || 0), { seed: 4 }); pipLast = k; }
    } catch (e) { pipW = null; }
  }
  function toggleZen() {
    var on = !document.body.classList.contains('zen');
    document.body.classList.toggle('zen', on);
    try { if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
  }
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement) document.body.classList.remove('zen'); });

  /* ---------------------------------------------------------------- sounds (Web Audio, generated) */
  var AC = null, MASTER = null, PLAY = {};
  function ac() {
    if (!AC) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; try { AC = new A(); } catch (e) { return null; } MASTER = AC.createGain(); MASTER.connect(AC.destination); applyMaster(); }
    if (AC.state === 'suspended') AC.resume().catch(function () {});
    return AC;
  }
  function applyMaster() { if (MASTER) MASTER.gain.value = D.sounds.muted ? 0 : D.sounds.master; }
  function noise(kind) {
    var len = AC.sampleRate * 5, b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0), last = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (kind === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; }
      else if (kind === 'pink') { b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11; b6 = w * .115926; }
      else d[i] = w;
    }
    return b;
  }
  var BUF = {};
  function src(kind) { BUF[kind] = BUF[kind] || noise(kind); var s = AC.createBufferSource(); s.buffer = BUF[kind]; s.loop = true; s.start(); return s; }
  function filt(type, f, q) { var x = AC.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q) x.Q.value = q; return x; }
  function lfo(freq, depth, param) { var o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = freq; g.gain.value = depth; o.connect(g); g.connect(param); o.start(); return o; }
  function burst(out, dur, f1, f2, gain) {
    var s = AC.createBufferSource(); s.buffer = BUF.white || (BUF.white = noise('white'));
    var bp = filt('bandpass', f1 + Math.random() * (f2 - f1), 6), g = AC.createGain(), n = AC.currentTime;
    g.gain.setValueAtTime(gain, n); g.gain.exponentialRampToValueAtTime(.0001, n + dur);
    s.connect(bp); bp.connect(g); g.connect(out); s.start(n, Math.random() * 4, dur + .02);
  }
  var BUILD = {
    rain: function (out) { var s = src('pink'), h = filt('highpass', 500), l = filt('lowpass', 7000), g = AC.createGain(); g.gain.value = .9; s.connect(h); h.connect(l); l.connect(g); g.connect(out); var iv = setInterval(function () { if (Math.random() < .55) burst(out, .03, 2500, 6500, .25 * Math.random()); }, 45); return function () { clearInterval(iv); s.stop(); }; },
    brown: function (out) { var s = src('brown'), l = filt('lowpass', 700); s.connect(l); l.connect(out); return function () { s.stop(); }; },
    ocean: function (out) { var s = src('brown'), l = filt('lowpass', 900), g = AC.createGain(); g.gain.value = .55; s.connect(l); l.connect(g); g.connect(out); var o = lfo(.09, .45, g.gain); var o2 = lfo(.05, 300, l.frequency); return function () { s.stop(); o.stop(); o2.stop(); }; },
    fire: function (out) { var s = src('brown'), l = filt('lowpass', 320), g = AC.createGain(); g.gain.value = .8; s.connect(l); l.connect(g); g.connect(out); var iv = setInterval(function () { if (Math.random() < .3) burst(out, .012 + Math.random() * .03, 1500, 5000, .15 + Math.random() * .5); }, 40); return function () { clearInterval(iv); s.stop(); }; },
    wind: function (out) { var s = src('white'), b = filt('bandpass', 600, .9), g = AC.createGain(); g.gain.value = .35; s.connect(b); b.connect(g); g.connect(out); var o = lfo(.07, 380, b.frequency), o2 = lfo(.13, .2, g.gain); return function () { s.stop(); o.stop(); o2.stop(); }; },
    clock: function (out) {
      var k = 0, iv = setInterval(function () {
        var o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime; o.type = 'square'; o.frequency.value = k++ % 2 ? 1250 : 1650;
        g.gain.setValueAtTime(.12, n); g.gain.exponentialRampToValueAtTime(.0001, n + .03); o.connect(g); g.connect(out); o.start(n); o.stop(n + .04);
      }, 1000);
      return function () { clearInterval(iv); };
    }
  };
  function playOne(k) {
    if (PLAY[k] || !ac()) return;
    var g = AC.createGain(); g.gain.value = 0; g.connect(MASTER);
    g.gain.linearRampToValueAtTime(D.sounds.vol[k], AC.currentTime + 1.2);
    var stop = BUILD[k](g);
    PLAY[k] = { g: g, stop: stop };
  }
  function stopOne(k) {
    var p = PLAY[k]; if (!p) return; delete PLAY[k];
    try { p.g.gain.cancelScheduledValues(AC.currentTime); p.g.gain.setValueAtTime(p.g.gain.value, AC.currentTime); p.g.gain.linearRampToValueAtTime(0, AC.currentTime + .5); } catch (e) {}
    setTimeout(function () { try { p.stop(); p.g.disconnect(); } catch (e) {} }, 600);
  }
  function wantSounds() { var r = D.run; return (!D.sounds.only || (r && r.phase === 'focus' && !r.pausedAt)) ? D.sounds.on : []; }
  function syncSounds() {
    var want = wantSounds();
    if (!want.length && !AC) return;
    Object.keys(PLAY).forEach(function (k) { if (want.indexOf(k) < 0) stopOne(k); });
    want.forEach(function (k) { playOne(k); });
  }
  function toggleSound(k) {
    var i = D.sounds.on.indexOf(k);
    if (i >= 0) D.sounds.on.splice(i, 1); else D.sounds.on.push(k);
    ac(); save(); syncSounds(); if (view === 'sounds') renderSounds(); else renderFocus();
  }
  document.addEventListener('pointerdown', function first() { if (D && D.sounds.on.length) syncSounds(); document.removeEventListener('pointerdown', first); });
  function bindSounds() {
    $('#snd-master').addEventListener('input', function (e) { D.sounds.master = +e.target.value; applyMaster(); save(); });
    $('#snd-only').addEventListener('change', function (e) { D.sounds.only = e.target.checked; save(); syncSounds(); });
    $('#snd-stop').addEventListener('click', function () { D.sounds.on = []; save(); syncSounds(); renderSounds(); });
    $('#snd-grid').addEventListener('click', function (e) { var b = e.target.closest('[data-tsnd]'); if (b) toggleSound(b.getAttribute('data-tsnd')); });
    $('#snd-grid').addEventListener('input', function (e) { var k = e.target.getAttribute('data-vol'); if (!k) return; D.sounds.vol[k] = +e.target.value; if (PLAY[k]) PLAY[k].g.gain.value = D.sounds.vol[k]; save(); });
  }
  function renderSounds() {
    $('#snd-master').value = D.sounds.master; $('#snd-only').checked = !!D.sounds.only;
    $('#snd-grid').innerHTML = SOUNDS.map(function (x) {
      var on = D.sounds.on.indexOf(x[0]) >= 0;
      return '<article class="card snd' + (on ? ' on' : '') + '"><div class="row"><span class="ico">' + C.icon(x[1] === 'wind' ? 'wave' : x[1]) + '</span><span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div>' +
        '<div class="row"><h3 style="margin:0">' + esc(t('v.snd.' + x[0])) + '</h3><label class="sw"><input type="checkbox" data-tsnd="' + x[0] + '"' + (on ? ' checked' : '') + ' aria-label="' + esc(t('v.snd.' + x[0])) + '"><i></i></label></div>' +
        '<input type="range" min="0" max="1" step="0.01" value="' + D.sounds.vol[x[0]] + '" data-vol="' + x[0] + '" aria-label="' + esc(t('v.snd.' + x[0])) + '"></article>';
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
    $('#g-sample').addEventListener('click', function () { sample(); renderAll(); });
    $('#g-unsample').addEventListener('click', function () { D.sessions = D.sessions.filter(function (s) { return !s.sample; }); D.tasks = D.tasks.filter(function (x) { return !x.sample; }); save(true); renderAll(); });
    $('#g-share').addEventListener('click', shareGarden);
  }
  function renderGarden() {
    $('#g-period').innerHTML = ['day', 'week', 'month', 'year', 'all'].map(function (p) { return '<button data-p="' + p + '" aria-pressed="' + (G.p === p) + '">' + esc(t('v.period.' + p)) + '</button>'; }).join('');
    var pr = period(G.p, G.off);
    $('#g-label').textContent = pr.label;
    $('#g-prev').disabled = G.p === 'all'; $('#g-next').disabled = G.p === 'all' || G.off >= 0;
    var list = focusSessions().filter(function (s) { return s.mode !== 'manual' && s.start >= pr.a && s.start < pr.b; }).sort(function (x, y) { return x.start - y.start; });
    var alive = list.filter(good), dead = list.length - alive.length, total = alive.reduce(function (n, s) { return n + mins(s); }, 0);
    $('#g-sum').textContent = C.fmt(t('v.g.sum'), { min: C.dur(total), plants: alive.length, dead: dead });
    var max = 144, shown = list.slice(-max);
    if (!list.length) $('#g-scene').innerHTML = '<div class="empty">' + Garden.scene([], { size: 5 }) + '<p>' + esc(t('v.g.empty')) + '</p></div>';
    else {
      var size = clamp(Math.ceil(Math.sqrt(shown.length * 1.3)), 4, 12);
      $('#g-scene').innerHTML = Garden.scene(shown.map(function (s) {
        var tg = tag(s.tag);
        return { species: s.species || 'lola', withered: !good(s), seed: parseInt(String(s.id).slice(-4), 36) || 3, title: pname(s.species) + ' · ' + mins(s) + ' ' + t('v.min') + (tg ? ' · ' + tg.name : '') + ' · ' + new Date(s.start).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) + ' ' + hm(s.start) };
      }), { size: size, label: pr.label });
    }
    $('#g-more').textContent = list.length > max ? C.fmt(t('v.g.more'), { n: list.length - max }) : '';
    var hasSample = D.sessions.some(function (s) { return s.sample; });
    $('#g-sample').hidden = D.sessions.length > 0;
    $('#g-unsample').hidden = !hasSample;
    $('#g-samplenote').textContent = hasSample ? t('v.sample.note') : '';
  }
  function shareGarden() {
    var svg = $('#g-scene svg'); if (!svg) return;
    try {
      var vb = svg.viewBox.baseVal, W = 1200, H = 900, s = new XMLSerializer().serializeToString(svg);
      if (s.indexOf('xmlns=') < 0) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      var img = new Image(), url = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
        var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0B1024'); g.addColorStop(1, '#07231A'); x.fillStyle = g; x.fillRect(0, 0, W, H);
        var sc = Math.min((W - 120) / vb.width, (H - 220) / vb.height), dw = vb.width * sc, dh = vb.height * sc;
        x.drawImage(img, (W - dw) / 2, 150, dw, dh);
        x.fillStyle = '#EEF1FF'; x.font = '700 54px Unbounded, Manrope, sans-serif'; x.fillText('Vaqt', 60, 96);
        x.fillStyle = '#A9B1D6'; x.font = '600 26px Manrope, sans-serif'; x.fillText($('#g-label').textContent + ' · ' + $('#g-sum').textContent, 60, 134);
        x.fillStyle = '#3DDC97'; x.fillText('clive · vaqt', W - 230, H - 40);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'vaqt-garden.png'; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 500); });
      };
      img.src = url;
    } catch (e) {}
  }
  function sample() {
    var now = Date.now(), tags = D.tags.map(function (x) { return x.id; }), spp = ['lola', 'paxta', 'anor', 'orik', 'uzum', 'tut', 'archa', 'chinor'];
    for (var d = 13; d >= 0; d--) {
      var day = addDays(dayStart(now), -d), n = 2 + Math.floor(Math.random() * 4), h = 8 + Math.random() * 2;
      for (var i = 0; i < n; i++) {
        var len = [25, 25, 30, 45, 50, 60, 90][Math.floor(Math.random() * 7)], start = day + h * 3600e3;
        if (start + len * 60e3 > now) break;
        var s = spp.filter(function (x) { return sp(x).min <= len; }); s = s[Math.floor(Math.random() * s.length)];
        D.sessions.push({ id: uid(), start: start, end: start + len * 60e3, planned: len * 60, actual: Math.random() < .1 ? Math.round(len * 60 * .4) : len * 60, mode: len === 25 ? 'pomo' : 'timer', species: s, tag: tags[Math.floor(Math.random() * tags.length)], status: 'done', sample: true });
        var last = D.sessions[D.sessions.length - 1]; if (last.actual < last.planned) last.status = 'withered';
        h += len / 60 + .3 + Math.random() * 2.5; if (h > 22) break;
      }
      if (d % 4 === 1) { var ms = day + 19 * 3600e3; if (ms + 5400e3 < now) D.sessions.push({ id: uid(), start: ms, end: ms + 5400e3, planned: 5400, actual: 5400, mode: 'manual', tag: 't2', status: 'done', note: 'English class', sample: true }); }
    }
    D.sessions.sort(function (a, b) { return a.start - b.start; });
    save(true);
  }

  /* ---------------------------------------------------------------- stats view */
  var SR = 'week';
  function bindStats() { $('#s-range').addEventListener('click', function (e) { var b = e.target.closest('[data-r]'); if (b) { SR = b.getAttribute('data-r'); renderStats(); } }); }
  function renderStats() {
    var all = focusSessions(), ok = all.filter(good), now = Date.now(), st = streaks();
    var weekA = period('week', 0).a, total = ok.reduce(function (n, s) { return n + mins(s); }, 0);
    var timed = all.filter(function (s) { return s.mode !== 'manual'; }), rate = timed.length ? Math.round(timed.filter(good).length / timed.length * 100) : 0;
    var avg = ok.length ? Math.round(total / ok.length) : 0;
    var K = [['v.k.today', C.dur(todayMin())], ['v.k.week', C.dur(minutesIn(weekA, addDays(weekA, 7)))], ['v.k.total', C.dur(total)], ['v.k.streak', C.fmt(t('v.days'), { n: st.cur })],
      ['v.k.best', C.fmt(t('v.days'), { n: st.best })], ['v.k.rate', rate + '%'], ['v.k.avg', C.dur(avg)], ['v.k.plants', String(ok.filter(function (s) { return s.mode !== 'manual'; }).length)]];
    $('#s-kpi').innerHTML = K.map(function (k) { return '<div class="card"><b>' + esc(k[1]) + '</b><span>' + esc(t(k[0])) + '</span></div>'; }).join('');
    /* week by tag */
    var days = [], mx = 1;
    for (var i = 0; i < 7; i++) {
      var a = addDays(weekA, i), b = addDays(a, 1), per = {};
      ok.forEach(function (s) { if (s.start >= a && s.start < b) per[s.tag || '-'] = (per[s.tag || '-'] || 0) + mins(s); });
      var sum = Object.keys(per).reduce(function (n, k) { return n + per[k]; }, 0); mx = Math.max(mx, sum);
      days.push({ a: a, per: per, sum: sum });
    }
    var dn = C.DSHORT[C.S.lang] || C.DSHORT.en, today = dayStart(now);
    $('#s-week').innerHTML = days.map(function (d) {
      var segs = Object.keys(d.per).map(function (k) { var tg = tag(k); return '<i style="height:' + (d.per[k] / mx * 100).toFixed(1) + '%;--c:' + (tg ? tg.color : 'var(--mute)') + '" title="' + esc((tg ? tg.name : t('v.notag')) + ' · ' + d.per[k] + ' ' + t('v.min')) + '"></i>'; }).join('');
      return '<div class="col' + (d.a === today ? ' today' : '') + '"><div class="bar">' + segs + '</div><b>' + (d.sum ? esc(C.dur(d.sum)) : '·') + '</b><small>' + esc(dn[new Date(d.a).getDay()]) + '</small></div>';
    }).join('');
    /* tags */
    $$('#s-range [data-r]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-r') === SR)); });
    var ra = SR === 'week' ? weekA : SR === 'month' ? period('month', 0).a : 0, per2 = {}, tot2 = 0;
    ok.forEach(function (s) { if (s.start >= ra) { per2[s.tag || '-'] = (per2[s.tag || '-'] || 0) + mins(s); tot2 += mins(s); } });
    var tk = Object.keys(per2).sort(function (x, y) { return per2[y] - per2[x]; });
    $('#s-tags').innerHTML = tk.length ? tk.map(function (k) { var tg = tag(k), p = per2[k] / tot2 * 100; return '<div class="r" style="--c:' + (tg ? tg.color : 'var(--mute)') + '"><span><i></i>' + esc(tg ? tg.name : t('v.notag')) + '</span><span class="b"><i style="width:' + p.toFixed(1) + '%"></i></span><span class="v">' + esc(C.dur(per2[k])) + '</span></div>'; }).join('') : '<p class="muted">' + esc(t('v.s.none')) + '</p>';
    /* heatmap: 26 weeks, Monday rows first */
    var perDay = {}; ok.forEach(function (s) { var k = dkey(s.start); perDay[k] = (perDay[k] || 0) + mins(s); });
    var startW = addDays(weekA, -25 * 7), cells = '';
    for (var w = 0; w < 26; w++) for (var dd = 0; dd < 7; dd++) {
      var ms = addDays(startW, w * 7 + dd), m = perDay[dkey(ms)] || 0, lv = m === 0 ? 0 : m < 30 ? 1 : m < 60 ? 2 : m < 120 ? 3 : 4;
      cells += '<i class="' + (ms > now ? 'fut' : 'l' + lv) + '" title="' + esc(new Date(ms).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) + ' · ' + m + ' ' + t('v.min')) + '"></i>';
    }
    $('#s-heat').innerHTML = cells;
    /* hours */
    var hrs = new Array(24).fill(0); ok.forEach(function (s) { hrs[new Date(s.start).getHours()] += mins(s); });
    var hm2 = Math.max.apply(null, hrs) || 1;
    $('#s-hours').innerHTML = hrs.map(function (v, h) { return '<div title="' + h + ':00 · ' + v + ' ' + esc(t('v.min')) + '"><i style="height:' + (v / hm2 * 100).toFixed(1) + '%"></i><small>' + (h % 6 === 0 ? h : '') + '</small></div>'; }).join('');
    /* insights */
    var ins = [];
    if (ok.length) {
      var bh = hrs.indexOf(Math.max.apply(null, hrs)); ins.push(C.fmt(t('v.i.hour'), { h: pad(bh) + ':00' }));
      var allT = {}; ok.forEach(function (s) { allT[s.tag || '-'] = (allT[s.tag || '-'] || 0) + mins(s); });
      var top = Object.keys(allT).sort(function (x, y) { return allT[y] - allT[x]; })[0], tg = tag(top);
      ins.push(C.fmt(t('v.i.tag'), { tag: tg ? tg.name : t('v.notag'), p: Math.round(allT[top] / total * 100) }));
      var lg = ok.reduce(function (m, s) { return mins(s) > mins(m) ? s : m; }, ok[0]); ins.push(C.fmt(t('v.i.long'), { min: C.dur(mins(lg)) }));
      var dw = new Array(7).fill(0); ok.forEach(function (s) { dw[new Date(s.start).getDay()] += mins(s); });
      ins.push(C.fmt(t('v.i.day'), { d: (C.DAYS[C.S.lang] || C.DAYS.en)[dw.indexOf(Math.max.apply(null, dw))] }));
      if (rate < 80 && timed.length >= 5) ins.push(C.fmt(t('v.i.rate'), { p: rate }));
    } else ins.push(t('v.s.none'));
    $('#s-ins').innerHTML = ins.map(function (x) { return '<li>' + C.icon('sparkle') + '<span>' + esc(x) + '</span></li>'; }).join('');
    /* collection */
    var cnt = {}; ok.forEach(function (s) { if (s.species) cnt[s.species] = (cnt[s.species] || 0) + 1; });
    $('#s-coll').innerHTML = Garden.SPECIES.map(function (x, k) { return '<div class="' + (cnt[x.id] ? '' : 'no') + '"><svg viewBox="-45 -125 90 135" aria-hidden="true">' + Garden.plant(x.id, 1, { seed: 2 + k }) + '</svg><b>' + esc(x.name[C.S.lang] || x.name.en) + '</b>× ' + (cnt[x.id] || 0) + '</div>'; }).join('');
  }

  /* ---------------------------------------------------------------- tasks */
  var TF = 'open', editing = null;
  function tagOptions(sel) { return '<option value="">' + esc(t('v.notag')) + '</option>' + D.tags.map(function (x) { return '<option value="' + x.id + '"' + (x.id === sel ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join(''); }
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
      if (act === 'ck') { tk.done = !tk.done; tk.doneAt = tk.done ? Date.now() : null; if (tk.done && D.settings.task === tk.id) D.settings.task = null; checkAwards(); }
      else if (act === 'go') { D.settings.task = tk.id; if (tk.tag) D.settings.tag = tk.tag; save(); go('focus'); return; }
      else if (act === 'del') { D.tasks = D.tasks.filter(function (x) { return x !== tk; }); if (D.settings.task === tk.id) D.settings.task = null; }
      else if (act === 'ed') { editing = tk.id; }
      else if (act === 'sv') { var ip = li.querySelector('[data-f=title]'); tk.title = (ip.value.trim() || tk.title).slice(0, 120); tk.est = clamp(+li.querySelector('[data-f=est]').value || 1, 1, 20); tk.tag = li.querySelector('[data-f=tag]').value || null; editing = null; }
      else if (act === 'cx') { editing = null; }
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
      if (editing === x.id) {
        return '<li data-id="' + x.id + '"><span></span><div class="ed2" style="display:grid;gap:8px;grid-template-columns:1fr 140px 80px"><input class="input" data-f="title" value="' + esc(x.title) + '" aria-label="Task"><select class="input select" data-f="tag">' + tagOptions(x.tag) + '</select><input class="input" type="number" min="1" max="20" data-f="est" value="' + x.est + '" aria-label="' + esc(t('v.t.est')) + '"></div><div class="act"><button class="iconbtn" data-a="sv" aria-label="' + esc(t('v.t.save')) + '">' + C.icon('check') + '</button><button class="iconbtn" data-a="cx" aria-label="' + esc(t('v.cancel')) + '">' + C.icon('x') + '</button></div></li>';
      }
      return '<li data-id="' + x.id + '" class="' + (x.done ? 'done' : '') + '"><button class="ck" data-a="ck" aria-label="' + esc(t('v.t.done')) + '" aria-pressed="' + x.done + '">' + C.icon('check') + '</button>' +
        '<div><div class="tt">' + esc(x.title) + '</div><div class="meta">' + (tg ? '<span class="chip c" style="--c:' + tg.color + '">' + esc(tg.name) + '</span>' : '') + '<span class="dots">' + dots + '</span><span>' + n + '/' + x.est + '</span>' + (spent ? '<span>' + esc(C.fmt(t('v.t.spent'), { t: C.dur(spent) })) + '</span>' : '') + '</div></div>' +
        '<div class="act">' + (x.done ? '' : '<button class="iconbtn" data-a="go" aria-label="' + esc(t('v.t.focus')) + '" title="' + esc(t('v.t.focus')) + '" style="color:var(--green)">' + C.icon('play') + '</button>') + '<button class="iconbtn" data-a="ed" aria-label="' + esc(t('v.t.edit')) + '">' + C.icon('pen') + '</button><button class="iconbtn" data-a="del" aria-label="' + esc(t('v.t.del')) + '">' + C.icon('trash') + '</button></div></li>';
    }).join('');
  }

  /* ---------------------------------------------------------------- log (time tracker) */
  var LO = 0, LED = null, LDEL = null;
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
      if (act === 'ed') { LED = id; LDEL = null; }
      else if (act === 'del') { LDEL = id; LED = null; }
      else if (act === 'dy') { D.sessions = D.sessions.filter(function (x) { return x.id !== id; }); LDEL = null; save(true); renderHeader(); }
      else if (act === 'dn' || act === 'cx') { LDEL = null; LED = null; }
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
          var o = JSON.parse(r.result), v = o && o['clive.vaqt.v1'] ? o['clive.vaqt.v1'] : (o && Array.isArray(o.sessions) ? o : null);
          if (!v) throw 0;
          var have = {}; D.sessions.forEach(function (s) { have[s.id] = 1; }); var n = 0;
          v.sessions.forEach(function (s) { if (s && s.id && s.start && !have[s.id]) { D.sessions.push(s); n++; } });
          var ht = {}; D.tasks.forEach(function (x) { ht[x.id] = 1; }); (v.tasks || []).forEach(function (x) { if (x && x.id && !ht[x.id]) D.tasks.push(x); });
          var hg = {}; D.tags.forEach(function (x) { hg[x.id] = 1; }); (v.tags || []).forEach(function (x) { if (x && x.id && !hg[x.id]) D.tags.push(x); });
          (v.unlocked || []).forEach(function (x) { if (D.unlocked.indexOf(x) < 0) D.unlocked.push(x); });
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
      var desc = (s.mode === 'manual' ? '<span class="chip">' + C.icon('pen') + esc(t('v.l.manual')) + '</span>' : '<svg class="p" viewBox="-45 -125 90 135" aria-hidden="true">' + Garden.plant(s.species || 'lola', 1, { withered: !good(s), seed: 3 }) + '</svg><b>' + esc(pname(s.species)) + '</b>') +
        (tg ? '<span class="chip c" style="--c:' + tg.color + '">' + esc(tg.name) + '</span>' : '') + (!good(s) ? '<span class="chip c" style="--c:var(--rose)">' + esc(t('v.l.withered')) + '</span>' : '') +
        (tk ? '<span class="small muted">' + C.icon('list').replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px"') + ' ' + esc(tk.title) + '</span>' : '') +
        ((s.note || s.intent) ? '<span class="note">' + esc(s.note || s.intent) + '</span>' : '');
      var extra = '';
      if (LED === s.id) extra = '<div class="ed"><input class="input" type="number" min="1" max="1440" data-f="min" value="' + m + '" aria-label="' + esc(t('v.l.dur')) + '"><select class="input select" data-f="tag">' + tagOptions(s.tag) + '</select><input class="input" data-f="note" value="' + esc(s.note || '') + '" placeholder="' + esc(t('v.l.notep')) + '" aria-label="' + esc(t('v.l.note')) + '"><button class="btn primary sm" data-a="sv" style="--c:var(--green);--ci:#03170d">' + esc(t('v.t.save')) + '</button><button class="btn ghost sm" data-a="cx">' + esc(t('v.cancel')) + '</button></div>';
      if (LDEL === s.id) extra = '<div class="confirm on" style="grid-column:1/-1"><span>' + esc(t('v.l.del.q')) + '</span><button class="btn primary sm" data-a="dy" style="--c:var(--rose)">' + esc(t('v.l.del.y')) + '</button><button class="btn ghost sm" data-a="dn">' + esc(t('v.cancel')) + '</button></div>';
      return '<li data-id="' + s.id + '"><div class="tm">' + hm(s.start) + '–' + hm(s.end || s.start + (s.actual || 0) * 1000) + '<small>' + esc(C.dur(m)) + '</small></div><div class="ds">' + desc + '</div><div class="act"><button class="iconbtn" data-a="ed" aria-label="' + esc(t('v.t.edit')) + '">' + C.icon('pen') + '</button><button class="iconbtn" data-a="del" aria-label="' + esc(t('v.t.del')) + '">' + C.icon('trash') + '</button></div>' + extra + '</li>';
    }).join('');
  }
  function exportCSV() {
    var rows = [['date', 'start', 'end', 'minutes', 'mode', 'status', 'tag', 'task', 'plant', 'note']];
    focusSessions().forEach(function (s) { var tg = tag(s.tag), tk = task(s.task); rows.push([dkey(s.start), hm(s.start), hm(s.end || s.start), mins(s), s.mode, s.status, tg ? tg.name : '', tk ? tk.title : '', s.species || '', s.note || s.intent || '']); });
    download('vaqt-log-' + dkey(Date.now()) + '.csv', rows.map(function (r) { return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n'), 'text/csv');
  }
  function download(name, text, type) {
    try { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800); }
    catch (e) { C.copy(text); }
  }

  /* ---------------------------------------------------------------- awards */
  function awardList() {
    var ok = focusSessions().filter(good), plants = ok.filter(function (s) { return s.mode !== 'manual'; }), total = ok.reduce(function (n, s) { return n + mins(s); }, 0), st = streaks();
    var hours = ok.map(function (s) { return new Date(s.start).getHours(); });
    var pomoDay = {}; plants.forEach(function (s) { if (s.mode === 'pomo') pomoDay[dkey(s.start)] = (pomoDay[dkey(s.start)] || 0) + 1; });
    var maxPomo = Object.keys(pomoDay).reduce(function (m, k) { return Math.max(m, pomoDay[k]); }, 0);
    var sp8 = {}; plants.forEach(function (s) { sp8[s.species] = 1; });
    var tags = {}; ok.forEach(function (s) { if (s.tag) tags[s.tag] = 1; });
    var perDay = {}; ok.forEach(function (s) { perDay[dkey(s.start)] = (perDay[dkey(s.start)] || 0) + mins(s); });
    var goalMet = Object.keys(perDay).some(function (k) { return perDay[k] >= D.settings.goal; });
    var longest = ok.reduce(function (m, s) { return Math.max(m, mins(s)); }, 0);
    return [
      ['first', 'sprout', plants.length, 1], ['ten', 'leaf', plants.length, 10], ['fifty', 'leaf', plants.length, 50],
      ['hour', 'clock', total, 60], ['h10', 'hourglass', total, 600], ['h100', 'trophy', total, 6000],
      ['s3', 'flame', st.best, 3], ['s7', 'flame', st.best, 7], ['s30', 'flame', st.best, 30],
      ['long', 'target', longest, 90], ['early', 'sun', hours.some(function (h) { return h < 7; }) ? 1 : 0, 1], ['owl', 'moon', hours.some(function (h) { return h >= 23; }) ? 1 : 0, 1],
      ['pomo', 'repeat', maxPomo, 4], ['all', 'grid', Object.keys(sp8).length, 8], ['chinor', 'leaf', sp8.chinor ? 1 : 0, 1],
      ['tasks', 'check', D.tasks.filter(function (x) { return x.done; }).length, 10], ['tags', 'tag', Object.keys(tags).length, 5], ['goal', 'target', goalMet ? 1 : 0, 1]
    ].map(function (a) { return { id: a[0], icon: a[1], v: a[2], n: a[3], got: a[2] >= a[3] }; });
  }
  function checkAwards() {
    var real = D.sessions.some(function (s) { return !s.sample; });
    awardList().forEach(function (a) {
      if (a.got && D.awards.indexOf(a.id) < 0) { D.awards.push(a.id); if (real) toastC(C.fmt(t('v.newaward'), { a: t('v.a.' + a.id) })); }
    });
    save();
  }
  function renderAwards() {
    var L = awardList();
    $('#a-count').textContent = L.filter(function (a) { return a.got; }).length + ' / ' + L.length;
    $('#a-grid').innerHTML = L.map(function (a) {
      return '<article class="card aw ' + (a.got ? 'got' : 'no') + '" style="--c:var(--' + (a.got ? 'gold' : 'mute') + ')"><span class="ico">' + C.icon(a.icon) + '</span><h3 style="margin:0">' + esc(t('v.a.' + a.id)) + '</h3><p class="small" style="margin:0">' + esc(t('v.a.' + a.id + '.d')) + '</p><div class="pb"><i style="width:' + Math.min(100, a.v / a.n * 100).toFixed(0) + '%"></i></div><span class="small faint">' + (a.got ? esc(t('v.a.got')) : Math.min(a.v, a.n) + ' / ' + a.n) + '</span></article>';
    }).join('');
  }

  /* ---------------------------------------------------------------- settings */
  function bindPrefs() {
    [['p-focus', 'focus', 5, 180], ['p-short', 'short', 1, 30], ['p-long', 'long', 5, 60], ['p-rounds', 'rounds', 2, 8], ['p-goal', 'goal', 10, 720], ['p-grace', 'grace', 3, 60]].forEach(function (x) {
      $('#' + x[0]).addEventListener('change', function (e) { D.settings[x[1]] = clamp(Math.round(+e.target.value || DEF[x[1]]), x[2], x[3]); e.target.value = D.settings[x[1]]; if (D.settings.round > D.settings.rounds) D.settings.round = 1; save(); toastC(t('v.saved')); });
    });
    [['p-autobreak', 'autoBreak'], ['p-autofocus', 'autoFocus'], ['p-chime', 'chime'], ['p-wake', 'wake']].forEach(function (x) { $('#' + x[0]).addEventListener('change', function (e) { D.settings[x[1]] = e.target.checked; save(); }); });
    $('#p-notify').addEventListener('change', function (e) {
      if (!e.target.checked) { D.settings.notify = false; save(); return; }
      if (!('Notification' in window)) { e.target.checked = false; $('#p-notenote').textContent = t('v.p.notify.no'); return; }
      try {
        Notification.requestPermission().then(function (p) { D.settings.notify = p === 'granted'; e.target.checked = D.settings.notify; if (!D.settings.notify) $('#p-notenote').textContent = t('v.p.notify.no'); save(); }, function () { e.target.checked = false; $('#p-notenote').textContent = t('v.p.notify.no'); });
      } catch (x) { e.target.checked = false; $('#p-notenote').textContent = t('v.p.notify.no'); }
    });
    $$('#p-deep [data-deep]').forEach(function (b) { b.addEventListener('click', function () { if (D.run && D.run.phase === 'focus') return; D.settings.deep = b.getAttribute('data-deep'); save(); renderPrefs(); }); });
    $('#p-tags').addEventListener('change', function (e) {
      var li = e.target.closest('li[data-id]'); if (!li) return; var tg = tag(li.getAttribute('data-id'));
      if (e.target.type === 'color') tg.color = e.target.value; else tg.name = (e.target.value.trim() || tg.name).slice(0, 24);
      save(); renderPrefs();
    });
    $('#p-tags').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rmtag]'); if (!b) return; var id = b.getAttribute('data-rmtag');
      D.tags = D.tags.filter(function (x) { return x.id !== id; }); if (D.settings.tag === id) D.settings.tag = null; save(); renderPrefs();
    });
    $('#p-tagform').addEventListener('submit', function (e) {
      e.preventDefault(); var n = $('#p-tagname').value.trim(); if (!n) return;
      D.tags.push({ id: 't' + uid(), name: n.slice(0, 24), color: TAGC[D.tags.length % TAGC.length] }); $('#p-tagname').value = ''; save(); renderPrefs();
    });
    $('#p-clear').addEventListener('click', function () { $('#p-clearbox').classList.add('on'); });
    $('#p-clear-n').addEventListener('click', function () { $('#p-clearbox').classList.remove('on'); });
    $('#p-clear-y').addEventListener('click', function () {
      Object.keys(PLAY).forEach(stopOne); D = fresh(); save(true); $('#p-clearbox').classList.remove('on'); toastC(t('v.p.cleared')); renderAll();
    });
  }
  function renderPrefs() {
    var s = D.settings;
    $('#p-focus').value = s.focus; $('#p-short').value = s.short; $('#p-long').value = s.long; $('#p-rounds').value = s.rounds; $('#p-goal').value = s.goal; $('#p-grace').value = s.grace;
    $('#p-autobreak').checked = s.autoBreak; $('#p-autofocus').checked = s.autoFocus; $('#p-chime').checked = s.chime; $('#p-notify').checked = s.notify; $('#p-wake').checked = s.wake;
    $$('#p-deep [data-deep]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-deep') === s.deep)); });
    $('#p-deepnote').textContent = t(s.deep === 'strict' ? 'v.p.deep.s' : s.deep === 'gentle' ? 'v.p.deep.g' : 'v.p.deep.o');
    $('#p-tags').innerHTML = D.tags.map(function (x) { return '<li data-id="' + x.id + '"><input type="color" value="' + esc(x.color) + '" aria-label="Colour"><input class="input" value="' + esc(x.name) + '" maxlength="24" aria-label="' + esc(t('v.p.tagname')) + '"><button class="iconbtn" data-rmtag="' + x.id + '" aria-label="' + esc(t('v.t.del')) + '">' + C.icon('trash') + '</button></li>'; }).join('');
  }

  /* ---------------------------------------------------------------- keyboard */
  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      var tg = (e.target.tagName || '').toLowerCase();
      if (tg === 'input' || tg === 'textarea' || tg === 'select' || e.target.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key;
      if (k === ' ' && view === 'focus' && tg !== 'button') { e.preventDefault(); if (!D.run) { D.pendingBreak ? startBreak() : startFocus(); } else togglePause(); }
      else if ((k === '1' || k === '2' || k === '3') && !D.run) { D.settings.mode = ['timer', 'pomo', 'flow'][+k - 1]; fitSpecies(); save(); if (view !== 'focus') go('focus'); else renderFocus(); }
      else if ((k === 'ArrowUp' || k === 'ArrowDown') && view === 'focus' && !D.run && D.settings.mode === 'timer' && tg !== 'button') { e.preventDefault(); bump(k === 'ArrowUp' ? 5 : -5); }
      else if (k === 'f' || k === 'F') toggleZen();
      else if (k === 'm' || k === 'M') { D.sounds.muted = !D.sounds.muted; applyMaster(); save(); renderFocus(); }
      else if (k === 'g' || k === 'G') go('garden');
      else if (k === 's' || k === 'S') go('stats');
      else if (k === 't' || k === 'T') go('tasks');
      else if (k === 'l' || k === 'L') go('log');
      else if (k === 'Escape') { $('#m-done').hidden = true; $('#m-wither').hidden = true; if (document.body.classList.contains('zen')) toggleZen(); }
    });
  }

  if (window.Clive && Clive.booted) boot(); else document.addEventListener('clive:ready', boot);
})();
