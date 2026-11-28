/* Reja: study and life planner. Data lives in this browser: settings and plans in localStorage, attached files in IndexedDB. */
(function () {
  'use strict';
  var KEY = 'reja.v1', MAXFILE = 60 * 1024 * 1024;

  /* ------------------------------------------------------------ icons */
  var IC = {
    today: '<path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/><circle cx="12" cy="12" r="4"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    tasks: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.5 1.5L7.5 5M3.5 12l1.5 1.5L7.5 11M3.5 18l1.5 1.5L7.5 17"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2.5"/><path d="M6 21h13v-2"/><path d="M9 7h6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', check: '<path d="m5 12 5 5 9-10"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    clip: '<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
    note: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    flag: '<path d="M4 22V4M4 4h12l-2 4 2 4H4"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    down: '<path d="M12 4v12M6 10l6 6 6-6M5 20h14"/>', up: '<path d="M12 20V8M6 14l6-6 6 6M5 4h14"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', board: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>', pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>',
    door: '<path d="M14 3h5v18h-5M3 21h18M14 3 5 5v16"/><path d="M10 12h.01"/>', link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'
  };
  function ic(n, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || '') + '</svg>'; }

  /* ------------------------------------------------------------ helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function pday(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function sod(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function monday(d) { var x = sod(d), w = (x.getDay() + 6) % 7; return addDays(x, -w); }
  function hm2m(s) { var p = (s || '0:0').split(':'); return +p[0] * 60 + +p[1]; }
  function m2hm(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function at(day, hm) { var d = sod(day); d.setMinutes(hm2m(hm)); return d; }
  function dtl(ms) { var d = new Date(ms); return ymd(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function pdt(s) { if (!s) return null; var a = s.split('T'); return at(pday(a[0]), a[1] || '23:59').getTime(); }
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fdate(d, o) { d = new Date(d); return (o === 'long' ? DOW[d.getDay()] + ', ' : DOWS[d.getDay()] + ' ') + d.getDate() + ' ' + MON[d.getMonth()].slice(0, o === 'long' ? 20 : 3); }
  function ftime(ms) { var d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function fsize(b) { return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB'; }
  function rel(ms) {
    var d = ms - Date.now(), a = Math.abs(d), m = Math.round(a / 60000), h = Math.round(a / 3600000), dd = Math.round(a / 86400000), s;
    s = m < 60 ? m + ' min' : h < 36 ? h + ' h' : dd + ' days';
    return d < 0 ? s + ' ago' : 'in ' + s;
  }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : /(s|sh|ch|x)$/.test(w) ? 'es' : 's'); }

  /* ------------------------------------------------------------ data */
  var TYPES = { lecture: 'Lecture', seminar: 'Seminar', lab: 'Laboratory' };
  function seed() {
    var subj = [
      ['tarix', 'O‘zbekistonning eng yangi tarixi', 'Yangi tarix', '#FFB547', ['lecture', 'seminar']],
      ['akad', 'Akademik ko‘nikmalar va kasbiy kompetensiyalar', 'Akademik ko‘nikmalar', '#A78BFA', ['lecture', 'seminar']],
      ['eng', 'English', 'English', '#38BDF8', ['seminar']],
      ['iqt', 'Iqtisodiyot nazariyasi', 'Iqtisodiyot nazariyasi', '#3DDC97', ['lecture', 'seminar']],
      ['akt', 'Iqtisodiyotda axborot kommunikatsion texnologiyalari', 'Iqtisodiyotda AKT', '#F472B6', ['lecture', 'seminar', 'lab']],
      ['mat', 'Amaliy matematika', 'Amaliy matematika', '#FF7A59', ['lecture', 'seminar']]
    ].map(function (s) { return { id: s[0], name: s[1], short: s[2], color: s[3], types: s[4], teacher: '', room: '' }; });
    function sl(dow, p, s, t, par) { return { id: uid(), dow: dow, period: p, subject: s, type: t, parity: par || 'all' }; }
    return {
      v: 1, created: Date.now(), subjects: subj,
      /* 80-minute pairs, 10-minute breaks, lunch 11:20–12:00 */
      periods: [['08:30', '09:50'], ['10:00', '11:20'], ['12:00', '13:20'], ['13:30', '14:50'], ['15:00', '16:20'], ['16:30', '17:50']],
      /* week A starts on this Monday: the alternating Thursday ICT lecture happens in A weeks */
      parityAnchor: '2026-11-30',
      slots: [
        sl(1, 1, 'tarix', 'lecture'), sl(1, 2, 'akad', 'lecture'), sl(1, 3, 'tarix', 'seminar'),
        sl(2, 1, 'iqt', 'lecture'), sl(2, 2, 'eng', 'seminar'), sl(2, 3, 'iqt', 'seminar'),
        sl(4, 1, 'akt', 'lecture', 'A'), sl(4, 2, 'eng', 'seminar'), sl(4, 3, 'mat', 'seminar'),
        sl(5, 1, 'mat', 'lecture'), sl(5, 2, 'akad', 'seminar'), sl(5, 3, 'akt', 'lab'),
        sl(6, 1, 'eng', 'seminar'), sl(6, 2, 'akt', 'seminar')
      ],
      offDays: [3], tasks: [], notes: [], events: [], goals: [], oneoffs: [], cancelled: {}, fired: {},
      settings: { notify: false, classRemind: 10, defRemind: [1440, 180], semesterEnd: '2027-01-31', theme: 'dark', taskView: 'list' }
    };
  }
  var S = load();
  function load() {
    var d = null; try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!d || !d.subjects) return seed();
    var f = seed();
    ['tasks', 'notes', 'events', 'goals', 'oneoffs', 'offDays', 'slots', 'periods'].forEach(function (k) { if (!Array.isArray(d[k])) d[k] = f[k]; });
    if (d.periods[2] && d.periods[2][0] === '11:30' && d.periods[2][1] === '12:50') d.periods[2] = ['12:00', '13:20'];
    d.settings = Object.assign(f.settings, d.settings || {}); d.cancelled = d.cancelled || {}; d.fired = d.fired || {};
    return d;
  }
  var st;
  function save() { clearTimeout(st); st = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save: browser storage is full.', 'x', 'var(--bad)'); } }, 120); }
  function subj(id) { return S.subjects.filter(function (s) { return s.id === id; })[0] || null; }
  function scol(id) { var s = subj(id); return s ? s.color : '#8B7CFF'; }
  function sname(id, long) { var s = subj(id); return s ? (long ? s.name : s.short) : 'Life'; }
  function task(id) { return S.tasks.filter(function (t) { return t.id === id; })[0]; }

  /* ------------------------------------------------------------ files in IndexedDB */
  var dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) { var r = indexedDB.open('reja-files', 1); r.onupgradeneeded = function () { r.result.createObjectStore('files'); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; });
    return dbp;
  }
  function fop(mode, fn) { return db().then(function (d) { return new Promise(function (res, rej) { var tx = d.transaction('files', mode), q = fn(tx.objectStore('files')); tx.oncomplete = function () { res(q && q.result); }; tx.onerror = tx.onabort = function () { rej(tx.error); }; }); }); }
  function fput(id, blob) { return fop('readwrite', function (s) { return s.put(blob, id); }); }
  function fget(id) { return fop('readonly', function (s) { return s.get(id); }); }
  function fdel(id) { return fop('readwrite', function (s) { return s.delete(id); }); }
  function persist() { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {} }
  var FCOL = { pdf: '#FF5C7A', doc: '#38BDF8', docx: '#38BDF8', ppt: '#FF9B3D', pptx: '#FF9B3D', xls: '#3DDC97', xlsx: '#3DDC97', csv: '#3DDC97', zip: '#A78BFA', rar: '#A78BFA', '7z': '#A78BFA', mp3: '#F472B6', wav: '#F472B6', m4a: '#F472B6', mp4: '#FFB547', mov: '#FFB547', txt: '#9AA2C7', py: '#FFD43B', js: '#FFD43B' };
  function ext(n) { var m = /\.([a-z0-9]+)$/i.exec(n || ''); return m ? m[1].toLowerCase() : 'file'; }

  /* ------------------------------------------------------------ schedule */
  function parity(d) { var w = Math.round((monday(d) - monday(pday(S.parityAnchor))) / (7 * 864e5)); return ((w % 2) + 2) % 2 === 0 ? 'A' : 'B'; }
  function classesOn(d) {
    var dow = d.getDay(), p = parity(d), key = ymd(d);
    return S.slots.filter(function (s) { return s.dow === dow && (s.parity === 'all' || s.parity === p) && !S.cancelled[key + ':' + s.id]; }).map(function (s) {
      var per = S.periods[s.period - 1] || ['08:30', '09:50'];
      return { kind: 'class', slot: s, subject: s.subject, type: s.type, start: at(d, per[0]).getTime(), end: at(d, per[1]).getTime(), key: key + ':' + s.id, period: s.period };
    }).concat(S.oneoffs.filter(function (o) { return o.date === key; }).map(function (o) {
      /* a class moved to this day for one time only */
      var per = S.periods[o.period - 1] || ['08:30', '09:50'];
      return { kind: 'class', oneoff: o, slot: { id: 'o' + o.id, parity: 'all', dow: dow, period: o.period }, subject: o.subject, type: o.type, start: at(d, per[0]).getTime(), end: at(d, per[1]).getTime(), key: key + ':o' + o.id, period: o.period };
    })).sort(function (a, b) { return a.start - b.start; });
  }
  function eventsOn(d) {
    var k = ymd(d), dow = d.getDay();
    return S.events.filter(function (e) {
      if (e.date === k) return true;
      if (e.date > k) return false;
      if (e.until && e.until < k) return false;
      if (e.repeat === 'daily') return true;
      if (e.repeat === 'weekly') return pday(e.date).getDay() === dow;
      return false;
    }).map(function (e) { return { kind: 'event', ev: e, subject: e.subject || null, start: at(d, e.start).getTime(), end: at(d, e.end || m2hm(Math.min(1439, hm2m(e.start) + 60))).getTime(), key: k + ':' + e.id }; });
  }
  function dueOn(d) { var a = sod(d).getTime(), b = a + 864e5; return S.tasks.filter(function (t) { var u = pdt(t.due); return u && u >= a && u < b; }); }
  function itemsOn(d) { return classesOn(d).concat(eventsOn(d)).sort(function (a, b) { return a.start - b.start; }); }
  function notesFor(key) { return S.notes.filter(function (n) { return n.cls === key; }); }
  function liveClass(now) {
    now = now || Date.now(); var d = new Date(now), list = itemsOn(d);
    var cur = list.filter(function (c) { return c.start <= now && c.end > now; })[0];
    var next = list.filter(function (c) { return c.start > now; })[0];
    if (!next) for (var i = 1; i < 8 && !next; i++) next = itemsOn(addDays(d, i))[0];
    return { cur: cur, next: next };
  }

  /* ------------------------------------------------------------ toasts, sheet */
  function toast(msg, icon, c, act, actLabel) {
    var el = document.createElement('div'); el.className = 'toast'; if (c) el.style.setProperty('--c', c);
    el.innerHTML = '<span class="ti">' + ic(icon || 'check') + '</span><span>' + esc(msg) + '</span>' + (act ? '<button type="button">' + esc(actLabel || 'Undo') + '</button>' : '');
    $('#toasts').appendChild(el);
    if (act) el.querySelector('button').onclick = function () { act(); close(); };
    var done = false; function close() { if (done) return; done = true; el.classList.add('out'); setTimeout(function () { el.remove(); }, 300); }
    setTimeout(close, act ? 6000 : 3400);
  }
  var sheetClose = null;
  function sheet(title, body, foot, onMount, onClose) {
    var sh = $('#sheet');
    sh.innerHTML = '<div class="sh-h"><h2 id="sheet-title">' + title + '</h2><button class="ib" data-close aria-label="Close">' + ic('x') + '</button></div><div class="sh-b">' + body + '</div>' + (foot ? '<div class="sh-f">' + foot + '</div>' : '');
    sh.hidden = false; $('#scrim').hidden = false; document.body.style.overflow = 'hidden';
    sheetClose = onClose || null;
    $('[data-close]', sh).onclick = closeSheet;
    if (onMount) onMount(sh);
    var f = $('[autofocus]', sh); if (f && innerWidth > 640) setTimeout(function () { f.focus(); }, 60);
  }
  function closeSheet() { var cb = sheetClose; sheetClose = null; $('#sheet').hidden = true; $('#scrim').hidden = true; document.body.style.overflow = ''; if (cb) cb(); render(); }
  $('#scrim').onclick = closeSheet;

  /* ------------------------------------------------------------ navigation */
  var VIEWS = [['today', 'Today', 'today'], ['calendar', 'Calendar', 'cal'], ['tasks', 'Assignments', 'tasks'], ['subjects', 'Subjects', 'book'], ['settings', 'Settings', 'gear']];
  var view = 'today';
  function navHtml() { return VIEWS.map(function (v) { return '<button type="button" data-go="' + v[0] + '"' + (v[0] === view ? ' aria-current="page"' : '') + '>' + ic(v[2]) + '<span>' + v[1] + '</span></button>'; }).join(''); }
  function route() { var h = location.hash.slice(1).split('/')[0]; view = VIEWS.some(function (v) { return v[0] === h; }) ? h : 'today'; render(); window.scrollTo(0, 0); }
  function go(v) { if (location.hash.slice(1) === v) route(); else location.hash = v; }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) go(b.getAttribute('data-go')); });
  window.addEventListener('hashchange', route);

  function render() {
    $('#tabs').innerHTML = navHtml(); $('#bottom').innerHTML = navHtml();
    var m = $('#main'), y = window.scrollY;
    ({ today: vToday, calendar: vCalendar, tasks: vTasks, subjects: vSubjects, settings: vSettings })[view](m);
    window.scrollTo(0, y);
  }

  /* ------------------------------------------------------------ TODAY */
  var qkind = 'note';
  function vToday(m) {
    var now = Date.now(), d = new Date(), L = liveClass(now), items = itemsOn(d), hr = d.getHours();
    var hello = hr < 5 ? 'Good night' : hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    var off = S.offDays.indexOf(d.getDay()) >= 0, open = S.tasks.filter(function (t) { return t.status !== 'done'; });
    var week = open.filter(function (t) { var u = pdt(t.due); return u && u - now < 7 * 864e5; }).sort(function (a, b) { return pdt(a.due) - pdt(b.due); });
    var late = open.filter(function (t) { var u = pdt(t.due); return u && u < now; }).length;
    var doneW = S.tasks.filter(function (t) { return t.status === 'done' && t.doneAt > monday(d).getTime(); }).length;
    var c = L.cur || L.next, h = '<div class="view">';
    h += '<div class="phead"><div><div class="kicker">' + esc(fdate(d, 'long')) + ' · Week ' + parity(d) + '</div><h1>' + hello + '.</h1><p>' + (off ? 'Wednesday is yours: a day to improve yourself.' : items.length ? plural(classesOn(d).length, 'class') + ' today' + (week.length ? ' · ' + plural(week.length, 'deadline') + ' this week' : '') : 'No classes today.') + '</p></div>' +
      '<div class="row"><button class="btn" data-add="note">' + ic('note') + 'Note</button><button class="btn pri" data-add="task">' + ic('plus') + 'Assignment</button></div></div>';
    h += '<div class="grid stats" style="margin-bottom:16px">' + [[classesOn(d).length, 'classes today'], [week.length, 'due in 7 days'], [late, 'overdue'], [doneW, 'done this week']].map(function (s, i) { return '<div class="card stat"' + (i === 2 && s[0] ? ' style="border-color:color-mix(in srgb,var(--bad) 50%,transparent)"' : '') + '><b' + (i === 2 && s[0] ? ' style="color:var(--bad)"' : '') + '>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('') + '</div>';
    h += '<div class="grid today"><div class="grid" style="align-content:start">';
    /* live / next class with quick note */
    if (c) {
      var isCur = !!L.cur, col = c.subject ? scol(c.subject) : '#FFB547', tot = c.end - c.start, p = isCur ? (now - c.start) / tot : 0;
      var title = c.kind === 'class' ? sname(c.subject, true) : c.ev.title;
      var left = isCur ? Math.ceil((c.end - now) / 60000) : Math.ceil((c.start - now) / 60000);
      h += '<section class="card hl now" style="--c:' + col + '"><div class="row sp"><span class="chip">' + (isCur ? '● Now' : 'Next') + '</span><span class="small muted">' + ftime(c.start) + '–' + ftime(c.end) + (sameDay(c.start, now) ? '' : ' · ' + fdate(c.start)) + '</span></div>' +
        '<div class="ringw"><div class="ring"><svg viewBox="0 0 100 100"><circle class="tr" cx="50" cy="50" r="42"/><circle class="pr" cx="50" cy="50" r="42" stroke-dasharray="263.9" stroke-dashoffset="' + (263.9 * (1 - p)).toFixed(1) + '"/></svg><b>' + (left > 1440 ? Math.round(left / 1440) + 'd' : left >= 60 ? Math.floor(left / 60) + 'h ' + left % 60 + 'm' : left + 'm') + '<small>' + (isCur ? 'left' : 'to go') + '</small></b></div>' +
        '<div><h2>' + esc(title) + '</h2><div class="meta" style="margin-top:8px">' + (c.kind === 'class' ? '<span class="chip">' + TYPES[c.type] + '</span>' + (c.period ? '<span class="chip" style="--c:#9AA2C7">Pair ' + c.period + '</span>' : '') + (subj(c.subject).room ? '<span class="chip" style="--c:#9AA2C7">' + ic('door') + esc(subj(c.subject).room) + '</span>' : '') : '<span class="chip">' + esc(c.ev.category || 'Event') + '</span>') + '</div></div></div>' +
        (c.kind === 'class' ? qnoteHtml(c) : '') + '</section>';
    } else h += '<section class="card hl now"><h2>Nothing scheduled ahead.</h2><p class="muted">Add an event or an assignment with the + button.</p></section>';
    if (off) h += wedHtml(d);
    /* today timeline */
    h += '<section class="card"><div class="row sp" style="margin-bottom:12px"><h2>Today</h2><button class="btn sm ghost" data-go="calendar">' + ic('cal') + 'Calendar</button></div><div class="tl">' +
      (items.length ? items.map(function (it) { return tlItem(it, now); }).join('') : '<div class="empty">No classes or events today.</div>') +
      dueOn(d).map(function (t) { return '<div class="tli" data-task="' + t.id + '" style="--c:var(--bad)"><div class="t">' + esc(t.due.split('T')[1]) + '<small>due</small></div><div><div class="nm">' + esc(t.title) + '</div><div class="sub">' + esc(sname(t.subject)) + '</div></div>' + ic('flag') + '</div>'; }).join('') + '</div></section>';
    h += '</div><div class="grid" style="align-content:start">';
    h += '<section class="card"><div class="row sp" style="margin-bottom:10px"><h2>Due soon</h2><button class="btn sm ghost" data-go="tasks">All</button></div><div class="grid" style="gap:8px">' +
      (week.length ? week.slice(0, 7).map(taskHtml).join('') : '<div class="empty">Nothing due in the next 7 days. ' + (open.length ? '' : 'Add your first assignment with the + button.') + '</div>') + '</div></section>';
    var recent = S.notes.slice().sort(function (a, b) { return b.at - a.at; }).slice(0, 4);
    h += '<section class="card"><div class="row sp" style="margin-bottom:10px"><h2>Recent notes</h2><button class="btn sm ghost" data-add="note">' + ic('plus') + 'Note</button></div><div class="notes">' + (recent.length ? recent.map(noteHtml).join('') : '<div class="empty">Notes you take during class show up here.</div>') + '</div></section>';
    if (!off) { var nextWed = addDays(sod(d), ((3 - d.getDay()) + 7) % 7 || 7); h += '<section class="card wed" style="--c:#FFB547"><div class="row sp"><h2>Wednesday plan</h2><span class="chip">' + fdate(nextWed) + '</span></div><p class="small muted" style="margin:0">Your self-improvement day. Line up what you want to work on.</p>' + goalsHtml() + '</section>'; }
    h += '</div></div></div>';
    m.innerHTML = h;
    bindQuick(m, c); bindGoals(m);
  }
  function sameDay(a, b) { return ymd(new Date(a)) === ymd(new Date(b)); }
  function tlItem(it, now) {
    var col = it.subject ? scol(it.subject) : (it.ev && it.ev.color) || '#FFB547', live = it.start <= now && it.end > now, past = it.end <= now, n = it.kind === 'class' ? notesFor(it.key).length : 0;
    return '<div class="tli' + (live ? ' live' : past ? ' past' : '') + '" style="--c:' + col + '" data-' + it.kind + '="' + esc(it.key) + '"><div class="t">' + ftime(it.start) + '<small>' + ftime(it.end) + '</small></div><div><div class="nm">' + esc(it.kind === 'class' ? sname(it.subject) : it.ev.title) + '</div><div class="sub">' + (it.kind === 'class' ? TYPES[it.type] + ' · pair ' + it.period : esc(it.ev.category || 'Event')) + (n ? ' · ' + plural(n, 'note') : '') + '</div></div>' + (live ? '<span class="chip">Now</span>' : '') + '</div>';
  }
  function qnoteHtml(c) {
    return '<div class="qnote"><div class="row sp"><b class="small">Quick note for this class</b><div class="kinds">' + [['note', 'Note'], ['hw', 'Homework'], ['extra', 'Extra lesson']].map(function (k) { return '<button type="button" data-qk="' + k[0] + '" aria-pressed="' + (qkind === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div></div>' +
      '<textarea class="in" data-q="text" rows="2" placeholder="' + (qkind === 'hw' ? 'What was set? e.g. Exercises 3–7, page 42' : qkind === 'extra' ? 'e.g. Extra lesson Saturday 15:00, room 214' : 'Anything the teacher said that you should not forget…') + '">' + esc(drafts[c.key] || '') + '</textarea>' +
      (qkind === 'hw' ? '<div class="two"><label class="field"><span>Due</span><input class="in" type="datetime-local" data-q="due" value="' + defaultDue(c.subject) + '"></label><div class="field"><span>&nbsp;</span><span class="small muted">Saved as an assignment. Add files later.</span></div></div>' : '') +
      (qkind === 'extra' ? '<div class="two"><label class="field"><span>Date</span><input class="in" type="date" data-q="date" value="' + ymd(addDays(new Date(), 1)) + '"></label><label class="field"><span>Time</span><input class="in" type="time" data-q="time" value="14:00"></label></div>' : '') +
      '<div class="row sp"><span class="tiny muted">Saved with ' + esc(sname(c.subject)) + ', ' + fdate(c.start) + '</span><button class="btn sm pri" data-q="save" data-key="' + esc(c.key) + '">' + ic('check') + 'Save</button></div></div>';
  }
  function defaultDue(sid) {
    /* the start of the next class of the same subject, or a week from now */
    var d = new Date(); for (var i = 1; i < 15; i++) { var x = addDays(d, i), cl = classesOn(x).filter(function (c) { return c.subject === sid; })[0]; if (cl) return dtl(cl.start); }
    return dtl(addDays(d, 7).setHours(23, 59, 0, 0));
  }
  var drafts = {};
  function bindQuick(root, c) {
    var box = $('.qnote', root); if (!box || !c) return;
    function q(n) { return $('[data-q=' + n + ']', box); }
    q('text').oninput = function () { drafts[c.key] = q('text').value; };
    $$('[data-qk]', box).forEach(function (b) { b.onclick = function () { qkind = b.getAttribute('data-qk'); var nb = document.createElement('div'); nb.innerHTML = qnoteHtml(c); box.replaceWith(nb.firstChild); bindQuick(root, c); $('.qnote [data-q=text]', root).focus(); }; });
    q('save').onclick = function () {
      var txt = q('text').value.trim(); if (!txt) { q('text').focus(); return; }
      var key = c.key;
      S.notes.push({ id: uid(), cls: key, subject: c.subject, date: key.split(':')[0], text: txt, kind: qkind, at: Date.now() });
      if (qkind === 'hw') { var t = newTask({ title: txt.split('\n')[0].slice(0, 90), subject: c.subject, due: q('due').value, notes: txt }); S.tasks.push(t); toast('Homework saved with a deadline', 'flag', scol(c.subject), function () { openTask(t.id); }, 'Open'); }
      else if (qkind === 'extra') { var dt = q('date').value, tm = q('time').value || '14:00'; S.events.push({ id: uid(), title: 'Extra lesson · ' + sname(c.subject), subject: c.subject, date: dt, start: tm, end: m2hm(Math.min(1439, hm2m(tm) + 80)), repeat: 'none', category: 'Study', notes: txt, remind: [60] }); toast('Extra lesson added to your calendar', 'cal', scol(c.subject)); }
      else toast('Note saved', 'note', scol(c.subject));
      delete drafts[key]; save();
      if ($('#sheet').hidden) render(); else { closeSheet(); openClass(key); }
    };
  }
  function wedHtml(d) { return '<section class="card hl wed" style="--c:#FFB547"><div class="row sp"><h2>Self-improvement day</h2>' + ic('spark') + '</div><p class="small muted" style="margin:0">No classes. Pick a few things that make you better and tick them off.</p>' + goalsHtml() + '</section>'; }
  function goalsHtml() {
    return '<div class="goals">' + S.goals.map(function (g) { return '<label class="goal' + (g.done ? ' done' : '') + '"><input type="checkbox" data-goal="' + g.id + '"' + (g.done ? ' checked' : '') + '><span>' + esc(g.text) + '</span><button class="x" type="button" data-goaldel="' + g.id + '" aria-label="Remove">' + ic('x') + '</button></label>'; }).join('') +
      '<form class="row" data-goalform><input class="in" name="g" placeholder="e.g. 1 hour of German, read 30 pages, gym" maxlength="80"><button class="btn sm" type="submit">' + ic('plus') + '</button></form></div>';
  }
  function bindGoals(m) {
    $$('[data-goal]', m).forEach(function (c) { c.onchange = function () { var g = S.goals.filter(function (x) { return x.id === c.getAttribute('data-goal'); })[0]; g.done = c.checked; save(); render(); }; });
    $$('[data-goaldel]', m).forEach(function (b) { b.onclick = function (e) { e.preventDefault(); S.goals = S.goals.filter(function (x) { return x.id !== b.getAttribute('data-goaldel'); }); save(); render(); }; });
    $$('[data-goalform]', m).forEach(function (f) { f.onsubmit = function (e) { e.preventDefault(); var v = f.g.value.trim(); if (!v) return; S.goals.push({ id: uid(), text: v, done: false }); save(); render(); }; });
  }

  /* ------------------------------------------------------------ CALENDAR */
  var cal = { mode: innerWidth < 720 ? 'day' : 'week', at: sod(new Date()) }, PH = 64, H0 = 8, H1 = 21;
  function vCalendar(m) {
    var d = cal.at, title, body = '';
    if (cal.mode === 'month') { title = MON[d.getMonth()] + ' ' + d.getFullYear(); body = monthHtml(d); }
    else if (cal.mode === 'agenda') { title = 'Next 3 weeks'; body = agendaHtml(); }
    else {
      var days = cal.mode === 'day' ? [d] : [0, 1, 2, 3, 4, 5, 6].map(function (i) { return addDays(monday(d), i); });
      var a = days[0], b = days[days.length - 1];
      title = cal.mode === 'day' ? fdate(a, 'long') : a.getDate() + (a.getMonth() !== b.getMonth() ? ' ' + MON[a.getMonth()].slice(0, 3) : '') + ' – ' + b.getDate() + ' ' + MON[b.getMonth()].slice(0, 3) + ' ' + b.getFullYear();
      body = weekHtml(days);
    }
    var p = parity(d);
    m.innerHTML = '<div class="view"><div class="calbar"><h2>' + esc(title) + '</h2>' + (cal.mode !== 'agenda' && cal.mode !== 'month' ? '<span class="chip parity" title="Week A has the Thursday ICT lecture">Week ' + p + (p === 'A' ? ' · ICT lecture on Thu' : '') + '</span>' : '') +
      '<div class="seg">' + [['day', 'Day'], ['week', 'Week'], ['month', 'Month'], ['agenda', 'Agenda']].map(function (x) { return '<button type="button" data-cm="' + x[0] + '" aria-pressed="' + (cal.mode === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<div class="row"><button class="ib" data-cn="-1" aria-label="Previous">' + ic('left') + '</button><button class="btn sm" data-cn="0">Today</button><button class="ib" data-cn="1" aria-label="Next">' + ic('right') + '</button></div></div>' + body + '</div>';
    $$('[data-cm]', m).forEach(function (b) { b.onclick = function () { cal.mode = b.getAttribute('data-cm'); render(); }; });
    $$('[data-cn]', m).forEach(function (b) {
      b.onclick = function () {
        var n = +b.getAttribute('data-cn');
        if (!n) cal.at = sod(new Date());
        else if (cal.mode === 'month') { var x = new Date(cal.at); x.setDate(1); x.setMonth(x.getMonth() + n); cal.at = x; }
        else cal.at = addDays(cal.at, n * (cal.mode === 'day' ? 1 : 7));
        render();
      };
    });
    $$('.week .day', m).forEach(function (col) {
      col.addEventListener('click', function (e) {
        if (e.target.closest('.blk,.flag')) return;
        var r = col.getBoundingClientRect(), min = Math.round(((e.clientY - r.top) / PH * 60 + H0 * 60) / 15) * 15;
        openEvent(null, { date: col.getAttribute('data-date'), start: m2hm(Math.max(0, Math.min(1380, min))) });
      });
    });
    $$('.week .blk[data-class], .week .blk[data-event]', m).forEach(function (b) { holdDrag(b, calDrag(b)); });
    $$('.week .hd', m).forEach(function (h) { h.onclick = function () { cal.at = pday(h.getAttribute('data-date')); cal.mode = 'day'; render(); }; });
    $$('.mc', m).forEach(function (c) { c.onclick = function () { cal.at = pday(c.getAttribute('data-date')); cal.mode = innerWidth < 720 ? 'day' : 'week'; render(); }; });
    var nl = $('.nowline', m); if (nl && !scrolledCal) { scrolledCal = true; var y = nl.getBoundingClientRect().top + window.scrollY - 220; if (y > 200) window.scrollTo(0, y); }
  }
  var scrolledCal = false;
  function weekHtml(days) {
    var now = Date.now(), h = '<div class="calwrap"><div class="week" style="--days:' + days.length + ';--ph:' + PH + 'px;min-width:' + (days.length > 1 ? 760 : 0) + 'px">';
    h += '<div class="hd" style="cursor:default"></div>';
    days.forEach(function (d) { var off = S.offDays.indexOf(d.getDay()) >= 0; h += '<div class="hd' + (ymd(d) === ymd(new Date()) ? ' today' : '') + (off ? ' off' : '') + '" data-date="' + ymd(d) + '"><span>' + DOWS[d.getDay()] + (off ? ' · free' : '') + '</span><b>' + d.getDate() + '</b></div>'; });
    var H = (H1 - H0) * PH;
    h += '<div class="hours" style="height:' + H + 'px">'; for (var i = H0 + 1; i < H1; i++) h += '<div style="top:' + ((i - H0) * PH) + 'px">' + pad(i) + ':00</div>'; h += '</div>';
    days.forEach(function (d) {
      var off = S.offDays.indexOf(d.getDay()) >= 0, tday = ymd(d) === ymd(new Date());
      h += '<div class="day' + (off ? ' off' : '') + (tday ? ' today' : '') + '" data-date="' + ymd(d) + '" style="height:' + H + 'px">';
      lanes(itemsOn(d)).forEach(function (it) {
        var top = (it.start - at(d, pad(H0) + ':00')) / 3600000 * PH, ht = Math.max(26, (it.end - it.start) / 3600000 * PH - 3);
        if (top + ht < 0 || top > H) return;
        var col = it.subject ? scol(it.subject) : (it.ev && it.ev.color) || '#FFB547', n = it.kind === 'class' ? notesFor(it.key).length : 0, w = 100 / it.lanes;
        h += '<div class="blk' + (it.kind === 'class' ? (it.type === 'seminar' ? ' sem' : it.type === 'lab' ? ' lab' : '') : ' ev') + (it.end < now ? ' past' : '') + '" data-' + it.kind + '="' + esc(it.key) + '" style="--c:' + col + ';top:' + top.toFixed(1) + 'px;height:' + ht.toFixed(1) + 'px;left:calc(' + (it.lane * w) + '% + 4px);right:auto;width:calc(' + w + '% - 8px)"' +
          ' title="' + esc((it.kind === 'class' ? sname(it.subject, true) + ' · ' + TYPES[it.type] : it.ev.title) + ' · ' + ftime(it.start) + '–' + ftime(it.end)) + '">' +
          '<span class="ty">' + (it.kind === 'class' ? TYPES[it.type] : esc(it.ev.category || 'Event')) + '</span><b>' + esc(it.kind === 'class' ? sname(it.subject) : it.ev.title) + '</b><span class="tiny muted">' + ftime(it.start) + '–' + ftime(it.end) + '</span>' + (n ? '<span class="nb">' + n + '</span>' : '') + '</div>';
      });
      dueOn(d).forEach(function (t) { var top = Math.min(H - 12, Math.max(12, (pdt(t.due) - at(d, pad(H0) + ':00')) / 3600000 * PH)); h += '<div class="flag' + (t.status === 'done' ? ' done' : '') + '" data-task="' + t.id + '" style="--c:' + scol(t.subject) + ';top:' + top.toFixed(1) + 'px" title="Due ' + esc(t.due.split('T')[1]) + ': ' + esc(t.title) + '">' + esc(t.due.split('T')[1]) + ' ' + esc(t.title) + '</div>'; });
      if (tday) { var ny = (now - at(d, pad(H0) + ':00')) / 3600000 * PH; if (ny > 0 && ny < H) h += '<div class="nowline" style="top:' + ny.toFixed(1) + 'px"></div>'; }
      h += '</div>';
    });
    return h + '</div></div><p class="tiny muted" style="margin-top:10px">Press and hold a class or event, then drag it to move it. Tap an empty slot to add an event. Solid = lecture, stripes = seminar, dots = laboratory, red flags = deadlines.</p>';
  }
  function lanes(items) {
    var out = items.map(function (x) { return Object.assign({}, x, { lane: 0, lanes: 1 }); }), groups = [], g = null;
    out.forEach(function (it) { if (g && it.start < g.end) { g.items.push(it); g.end = Math.max(g.end, it.end); } else { g = { items: [it], end: it.end }; groups.push(g); } });
    groups.forEach(function (gr) { var ends = []; gr.items.forEach(function (it) { var l = 0; while (ends[l] > it.start) l++; it.lane = l; ends[l] = it.end; }); gr.items.forEach(function (it) { it.lanes = ends.length; }); });
    return out;
  }
  function monthHtml(d) {
    var first = new Date(d.getFullYear(), d.getMonth(), 1), start = monday(first), h = '<div class="month">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (x) { return '<div class="dh">' + x + '</div>'; }).join('');
    for (var i = 0; i < 42; i++) {
      var x = addDays(start, i); if (i === 35 && x.getMonth() !== d.getMonth()) break;
      var cl = itemsOn(x), du = dueOn(x), off = S.offDays.indexOf(x.getDay()) >= 0;
      h += '<div class="mc' + (x.getMonth() !== d.getMonth() ? ' out' : '') + (ymd(x) === ymd(new Date()) ? ' today' : '') + (off ? ' off' : '') + '" data-date="' + ymd(x) + '"><div class="n"><b>' + x.getDate() + '</b><span class="dots">' + cl.slice(0, 6).map(function (c) { return '<i style="--c:' + (c.subject ? scol(c.subject) : '#FFB547') + '"></i>'; }).join('') + '</span></div>' +
        du.map(function (t) { return '<div class="it dl" style="--c:' + scol(t.subject) + '">⚑ ' + esc(t.title) + '</div>'; }).join('') +
        cl.filter(function (c) { return c.kind === 'event'; }).map(function (c) { return '<div class="it" style="--c:' + (c.subject ? scol(c.subject) : c.ev.color || '#FFB547') + '">' + esc(c.ev.title) + '</div>'; }).join('') + '</div>';
    }
    return h + '</div>';
  }
  function agendaHtml() {
    var h = '<div class="agenda">', now = Date.now();
    for (var i = 0; i < 21; i++) {
      var d = addDays(sod(new Date()), i), it = itemsOn(d), du = dueOn(d);
      if (!it.length && !du.length) continue;
      h += '<div><div class="grp"><b>' + (i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : fdate(d, 'long')) + '</b>Week ' + parity(d) + '</div><div class="tl">' + du.map(function (t) { return '<div class="tli" data-task="' + t.id + '" style="--c:var(--bad)"><div class="t">' + esc(t.due.split('T')[1]) + '<small>due</small></div><div><div class="nm">' + esc(t.title) + '</div><div class="sub">' + esc(sname(t.subject)) + '</div></div>' + ic('flag') + '</div>'; }).join('') + it.map(function (x) { return tlItem(x, now); }).join('') + '</div></div>';
    }
    return h + '</div>';
  }

  /* ------------------------------------------------------------ press, hold and drag */
  var lastDrag = 0;
  document.addEventListener('click', function (e) { if (Date.now() - lastDrag < 450) { e.stopPropagation(); e.preventDefault(); } }, true);
  /* mouse: drag right away. touch and pen: hold still for a moment first, so a normal swipe still scrolls */
  function holdDrag(el, o) {
    var timer = null, sx = 0, sy = 0, ox = 0, oy = 0, active = false, ghost = null, pid = null, last = null, raf = null;
    el.addEventListener('contextmenu', function (e) { if (active || timer) e.preventDefault(); });
    el.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      sx = e.clientX; sy = e.clientY; pid = e.pointerId; last = e;
      var r = el.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top;
      clearTimeout(timer); timer = setTimeout(function () { timer = null; start(); }, e.pointerType === 'mouse' ? 900 : 420);
      if (e.pointerType !== 'mouse') el.classList.add('holding');
    });
    el.addEventListener('pointermove', function (e) {
      last = e;
      if (active) { e.preventDefault(); step(); return; }
      if (!timer) return;
      var d = Math.hypot(e.clientX - sx, e.clientY - sy);
      if (e.pointerType === 'mouse' && d > 5) { clearTimeout(timer); timer = null; start(); }
      else if (e.pointerType !== 'mouse' && d > 10) { clearTimeout(timer); timer = null; el.classList.remove('holding'); }
    });
    el.addEventListener('touchmove', function (e) { if (active) e.preventDefault(); }, { passive: false });
    function start() {
      active = true; el.classList.remove('holding');
      try { el.setPointerCapture(pid); } catch (e) {}
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
      var r = el.getBoundingClientRect();
      ghost = el.cloneNode(true); ghost.classList.add('ghost'); ghost.removeAttribute('data-class'); ghost.removeAttribute('data-event'); ghost.removeAttribute('data-slot');
      ghost.style.cssText += ';position:fixed;margin:0;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;right:auto';
      document.body.appendChild(ghost); el.classList.add('lifted'); document.body.classList.add('dragging');
      if (o.start) o.start(); step();
    }
    function step() {
      if (!ghost || !last) return;
      ghost.style.left = (last.clientX - ox) + 'px'; ghost.style.top = (last.clientY - oy) + 'px';
      o.move(last.clientX, last.clientY, last.clientY - oy);
      cancelAnimationFrame(raf);
      var edge = last.clientY < 90 ? -1 : last.clientY > innerHeight - 90 ? 1 : 0;
      if (edge) raf = requestAnimationFrame(function () { window.scrollBy(0, edge * 14); if (active) step(); });
    }
    function finish(drop) {
      clearTimeout(timer); timer = null; el.classList.remove('holding'); cancelAnimationFrame(raf);
      if (!active) return;
      active = false; lastDrag = Date.now();
      if (ghost) ghost.remove(); ghost = null; el.classList.remove('lifted'); document.body.classList.remove('dragging');
      if (drop && last) o.drop(last.clientX, last.clientY, last.clientY - oy); else if (o.cancel) o.cancel();
    }
    el.addEventListener('pointerup', function (e) { last = e; finish(true); });
    el.addEventListener('pointercancel', function () { finish(false); });
  }
  function nearestPeriod(min) {
    var best = 1, bd = 1e9; S.periods.forEach(function (p, i) { var d = Math.abs(hm2m(p[0]) - min); if (d < bd) { bd = d; best = i + 1; } }); return best;
  }
  /* calendar: drop a class on a pair, or an event on a 15-minute step */
  function calDrag(el) {
    var isClass = el.hasAttribute('data-class'), key = el.getAttribute(isClass ? 'data-class' : 'data-event'), it = null, zone = null, target = null;
    function clear() { if (zone) zone.remove(); zone = null; $$('.week .day.over').forEach(function (d) { d.classList.remove('over'); }); }
    return {
      start: function () { it = isClass ? findItem(key) : itemsOn(pday(key.split(':')[0])).filter(function (x) { return x.key === key; })[0]; },
      move: function (x, y, topY) {
        clear(); target = null; if (!it) return;
        var under = document.elementFromPoint(x, y), col = under && under.closest('.week .day'); if (!col) return;
        var r = col.getBoundingClientRect(), min = (topY - r.top) / PH * 60 + H0 * 60, date = col.getAttribute('data-date'), top, ht, label;
        if (isClass) { var pn = nearestPeriod(min), per = S.periods[pn - 1]; target = { date: date, period: pn }; top = (hm2m(per[0]) - H0 * 60) / 60 * PH; ht = (hm2m(per[1]) - hm2m(per[0])) / 60 * PH - 3; label = 'Pair ' + pn + ' · ' + per[0]; }
        else { var len = (it.end - it.start) / 60000, st0 = Math.max(0, Math.min(1439 - len, Math.round(min / 15) * 15)); target = { date: date, start: m2hm(st0), end: m2hm(st0 + len) }; top = (st0 - H0 * 60) / 60 * PH; ht = len / 60 * PH - 3; label = m2hm(st0) + '–' + m2hm(st0 + len); }
        col.classList.add('over');
        zone = document.createElement('div'); zone.className = 'dropzone'; zone.style.cssText = 'top:' + top.toFixed(1) + 'px;height:' + Math.max(24, ht).toFixed(1) + 'px;--c:' + (it.subject ? scol(it.subject) : (it.ev && it.ev.color) || '#FFB547');
        zone.innerHTML = '<span>' + esc(fdate(pday(date))) + ' · ' + esc(label) + '</span>'; col.appendChild(zone);
      },
      drop: function () { clear(); if (it && target) (isClass ? moveClass : moveEvent)(it, target); },
      cancel: clear
    };
  }
  function moveClass(c, t) {
    var from = ymd(new Date(c.start)), per = S.periods[t.period - 1];
    if (from === t.date && c.period === t.period) return;
    var snap = JSON.stringify({ slots: S.slots, oneoffs: S.oneoffs, cancelled: S.cancelled });
    function undo() { var o = JSON.parse(snap); S.slots = o.slots; S.oneoffs = o.oneoffs; S.cancelled = o.cancelled; save(); render(); }
    if (c.oneoff) { c.oneoff.date = t.date; c.oneoff.period = t.period; save(); render(); toast(sname(c.subject) + ' moved to ' + fdate(pday(t.date)) + ' ' + per[0], 'cal', scol(c.subject), undo); return; }
    var nd = pday(t.date), wk = c.slot.parity !== 'all' && parity(nd) !== c.slot.parity;
    var body = '<div class="card hl" style="--c:' + scol(c.subject) + '"><b>' + esc(sname(c.subject, true)) + '</b><div class="small muted">' + TYPES[c.type] + '</div>' +
      '<div class="mv"><div><small>From</small><b>' + fdate(c.start) + '</b><span>Pair ' + c.period + ' · ' + ftime(c.start) + '</span></div>' + ic('right') + '<div><small>To</small><b>' + fdate(nd) + '</b><span>Pair ' + t.period + ' · ' + per[0] + '</span></div></div></div>' +
      '<button class="choice" id="mv-once">' + ic('flag') + '<span><b>Only this time</b><small>Just ' + fdate(c.start) + ' moves. Every other week stays the same.</small></span></button>' +
      '<button class="choice" id="mv-all">' + ic('cal') + '<span><b>Every week from now on</b><small>The timetable changes: ' + DOW[nd.getDay()] + 's, pair ' + t.period + (c.slot.parity !== 'all' ? ', still every other week' : '') + '.</small></span></button>' +
      (wk ? '<p class="tiny muted" style="margin:0">Note: ' + fdate(nd) + ' is in week ' + parity(nd) + ', but this class runs in week ' + c.slot.parity + ' weeks.</p>' : '');
    sheet('Move this class?', body, '<button class="btn" data-close2>Cancel</button>', function (sh) {
      $('[data-close2]', sh).onclick = closeSheet;
      $('#mv-once').onclick = function () { S.cancelled[c.key] = true; S.oneoffs.push({ id: uid(), date: t.date, period: t.period, subject: c.subject, type: c.type, from: c.key }); save(); closeSheet(); toast('Moved for ' + fdate(nd) + ' only', 'flag', scol(c.subject), undo); };
      $('#mv-all').onclick = function () { var sl = S.slots.filter(function (x) { return x.id === c.slot.id; })[0]; sl.dow = nd.getDay(); sl.period = t.period; save(); closeSheet(); toast('Timetable updated: ' + DOWS[sl.dow] + ', pair ' + sl.period, 'cal', scol(c.subject), undo); };
    });
  }
  function moveEvent(it, t) {
    var e = it.ev, snap = JSON.stringify(e), from = ymd(new Date(it.start)), shift = Math.round((pday(t.date) - pday(from)) / 864e5);
    if (!shift && t.start === e.start) return;
    e.date = ymd(addDays(pday(e.date), shift)); e.start = t.start; e.end = t.end;
    Object.keys(S.fired).forEach(function (k) { if (k.indexOf(e.id) >= 0) delete S.fired[k]; });
    save(); render();
    toast(e.title + (e.repeat !== 'none' ? ' (every ' + (e.repeat === 'daily' ? 'day' : 'week') + ')' : '') + ' moved to ' + fdate(pday(t.date)) + ' ' + t.start, 'cal', e.color, function () { var o = JSON.parse(snap); S.events = S.events.map(function (x) { return x.id === o.id ? o : x; }); save(); render(); });
  }
  /* settings: the weekly timetable as a grid of days and pairs */
  var TTD = [1, 2, 3, 4, 5, 6, 0];
  function ttGrid() {
    var h = '<div class="ttwrap"><div class="tt"><div class="tth"></div>' + TTD.map(function (d) { return '<div class="tth' + (S.offDays.indexOf(d) >= 0 ? ' off' : '') + '">' + DOWS[d] + '</div>'; }).join('');
    S.periods.forEach(function (p, i) {
      h += '<div class="ttp"><b>' + (i + 1) + '</b><small>' + p[0] + '<br>' + p[1] + '</small></div>';
      TTD.forEach(function (d) {
        var sl = S.slots.filter(function (x) { return x.dow === d && x.period === i + 1; });
        h += '<div class="ttc' + (S.offDays.indexOf(d) >= 0 ? ' off' : '') + '" data-cell="' + d + ':' + (i + 1) + '">' + sl.map(function (x) {
          return '<div class="slot" data-slot="' + x.id + '" style="--c:' + scol(x.subject) + '"><b>' + esc(sname(x.subject)) + '</b><small>' + TYPES[x.type] + (x.parity !== 'all' ? ' · wk ' + x.parity : '') + '</small></div>';
        }).join('') + '<span class="add">' + ic('plus') + '</span></div>';
      });
    });
    return h + '</div></div>';
  }
  function ttDrag(el) {
    var id = el.getAttribute('data-slot'), cell = null;
    function clear() { $$('.ttc.over').forEach(function (c) { c.classList.remove('over'); }); }
    return {
      move: function (x, y) { clear(); var u = document.elementFromPoint(x, y); cell = u && u.closest('[data-cell]'); if (cell) cell.classList.add('over'); },
      drop: function () {
        clear(); if (!cell) return;
        var p = cell.getAttribute('data-cell').split(':'), sl = S.slots.filter(function (x) { return x.id === id; })[0], old = [sl.dow, sl.period];
        if (sl.dow === +p[0] && sl.period === +p[1]) return;
        sl.dow = +p[0]; sl.period = +p[1]; save(); render();
        toast(sname(sl.subject) + ' → ' + DOWS[sl.dow] + ', pair ' + sl.period, 'cal', scol(sl.subject), function () { sl.dow = old[0]; sl.period = old[1]; save(); render(); });
      },
      cancel: clear
    };
  }

  /* ------------------------------------------------------------ class detail */
  function findItem(key) {
    var p = key.split(':'), d = pday(p[0]);
    return itemsOn(d).filter(function (x) { return x.key === key; })[0] || null;
  }
  function openClass(key) {
    var c = findItem(key); if (!c) return;
    var s = subj(c.subject), col = s.color, ns = notesFor(key).sort(function (a, b) { return b.at - a.at; });
    var open = S.tasks.filter(function (t) { return t.subject === c.subject && t.status !== 'done'; }).sort(function (a, b) { return (pdt(a.due) || 9e15) - (pdt(b.due) || 9e15); });
    var body = '<div class="row wrap"><span class="chip" style="--c:' + col + '">' + TYPES[c.type] + '</span><span class="chip" style="--c:#9AA2C7">' + ic('clock') + fdate(c.start) + ' · ' + ftime(c.start) + '–' + ftime(c.end) + '</span><span class="chip" style="--c:#9AA2C7">Pair ' + c.period + '</span>' + (c.slot.parity !== 'all' ? '<span class="chip parity">Every other week (' + c.slot.parity + ')</span>' : '') + (c.oneoff ? '<span class="chip" style="--c:#FFB547">Moved here this time</span>' : '') + '</div>' +
      '<p class="tiny muted" style="margin:0">Tip: in the calendar, press and hold a class, then drag it to a new day or pair.</p>' +
      '<div class="card" style="--c:' + col + '">' + qnoteHtml(c) + '</div>' +
      '<div><h3 style="margin-bottom:8px">Notes from this class</h3><div class="notes">' + (ns.length ? ns.map(noteHtml).join('') : '<div class="empty">No notes yet.</div>') + '</div></div>' +
      '<div><h3 style="margin-bottom:8px">Open assignments · ' + esc(s.short) + '</h3><div class="grid" style="gap:8px">' + (open.length ? open.map(taskHtml).join('') : '<div class="empty">None. Nice.</div>') + '</div></div>';
    var foot = '<button class="btn ghost bad" id="cl-cancel">' + (S.cancelled[key] ? 'Restore class' : 'Cancelled this time') + '</button><button class="btn" id="cl-subj">' + ic('book') + 'Subject</button><button class="btn pri" id="cl-task">' + ic('plus') + 'Assignment</button>';
    sheet(esc(s.name), body, foot, function (sh) {
      bindQuick(sh, c); bindNotes(sh);
      $('#cl-task').onclick = function () { closeSheet(); openTask(null, { subject: c.subject, due: defaultDue(c.subject) }); };
      $('#cl-subj').onclick = function () { closeSheet(); openSubject(c.subject); };
      $('#cl-cancel').onclick = function () {
        if (c.oneoff) { var i = S.oneoffs.indexOf(c.oneoff); S.oneoffs.splice(i, 1); if (c.oneoff.from) delete S.cancelled[c.oneoff.from]; save(); closeSheet(); toast('Moved class removed', 'x', col, function () { S.oneoffs.splice(i, 0, c.oneoff); if (c.oneoff.from) S.cancelled[c.oneoff.from] = true; save(); render(); }); return; }
        S.cancelled[key] = true; save(); closeSheet(); toast('Class hidden for ' + fdate(c.start), 'x', col, function () { delete S.cancelled[key]; save(); render(); }); };
    });
  }

  /* ------------------------------------------------------------ notes */
  function noteHtml(n) {
    var lab = n.kind === 'hw' ? 'Homework' : n.kind === 'extra' ? 'Extra lesson' : 'Note';
    return '<div class="note ' + (n.kind || '') + '" style="--c:' + scol(n.subject) + '"><div class="nh"><span class="dot" style="--c:' + scol(n.subject) + '"></span>' + esc(sname(n.subject)) + ' · ' + lab + ' · ' + fdate(pday(n.date)) + '<button class="x" type="button" data-notedel="' + n.id + '" aria-label="Delete note">' + ic('trash') + '</button></div><p>' + esc(n.text) + '</p></div>';
  }
  function bindNotes(root) {
    $$('[data-notedel]', root).forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation(); var id = b.getAttribute('data-notedel'), i = -1, n;
        S.notes.forEach(function (x, k) { if (x.id === id) { i = k; n = x; } }); if (i < 0) return;
        S.notes.splice(i, 1); save(); b.closest('.note').remove(); if ($('#sheet').hidden) render();
        toast('Note deleted', 'trash', null, function () { S.notes.splice(i, 0, n); save(); render(); });
      };
    });
  }
  function openNote(pre) {
    pre = pre || {}; var L = liveClass(), cur = L.cur && L.cur.kind === 'class' ? L.cur : null, sid = pre.subject || (cur ? cur.subject : S.subjects[0].id), kind = 'note';
    function body() {
      return '<div class="field"><span>Subject</span><div class="subpick">' + S.subjects.map(function (s) { return '<button type="button" data-sp="' + s.id + '" style="--c:' + s.color + '" aria-pressed="' + (s.id === sid) + '"><span class="dot"></span>' + esc(s.short) + '</button>'; }).join('') + '</div></div>' +
        '<div class="field"><span>Kind</span><div class="seg">' + [['note', 'Note'], ['extra', 'Extra lesson']].map(function (k) { return '<button type="button" data-nk="' + k[0] + '" aria-pressed="' + (kind === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div></div>' +
        '<label class="field"><span>Note</span><textarea class="in" id="nn-text" rows="5" autofocus placeholder="Write it down before you forget…"></textarea></label>' +
        (kind === 'extra' ? '<div class="two"><label class="field"><span>Date</span><input class="in" type="date" id="nn-date" value="' + ymd(addDays(new Date(), 1)) + '"></label><label class="field"><span>Time</span><input class="in" type="time" id="nn-time" value="14:00"></label></div>' : '') +
        (cur && cur.subject === sid ? '<p class="small muted" style="margin:0">Linked to the class happening now.</p>' : '');
    }
    function mount(sh) {
      $$('[data-sp]', sh).forEach(function (b) { b.onclick = function () { var v = $('#nn-text').value; sid = b.getAttribute('data-sp'); $('.sh-b', sh).innerHTML = body(); mount(sh); $('#nn-text').value = v; }; });
      $$('[data-nk]', sh).forEach(function (b) { b.onclick = function () { var v = $('#nn-text').value; kind = b.getAttribute('data-nk'); $('.sh-b', sh).innerHTML = body(); mount(sh); $('#nn-text').value = v; }; });
      $('#nn-save').onclick = function () {
        var t = $('#nn-text').value.trim(); if (!t) return $('#nn-text').focus();
        var today = ymd(new Date()), key = cur && cur.subject === sid ? cur.key : today + ':' + sid;
        S.notes.push({ id: uid(), cls: key, subject: sid, date: today, text: t, kind: kind, at: Date.now() });
        if (kind === 'extra') { var tm = $('#nn-time').value || '14:00'; S.events.push({ id: uid(), title: 'Extra lesson · ' + sname(sid), subject: sid, date: $('#nn-date').value, start: tm, end: m2hm(Math.min(1439, hm2m(tm) + 80)), repeat: 'none', category: 'Study', notes: t, remind: [60] }); }
        save(); closeSheet(); toast(kind === 'extra' ? 'Extra lesson added to your calendar' : 'Note saved', kind === 'extra' ? 'cal' : 'note', scol(sid));
      };
    }
    sheet('New note', body(), '<button class="btn" data-close2>Cancel</button><button class="btn pri" id="nn-save">' + ic('check') + 'Save note</button>', function (sh) { mount(sh); $('[data-close2]', sh).onclick = closeSheet; });
  }

  /* ------------------------------------------------------------ tasks */
  var REMS = [[0, 'At deadline'], [10, '10 min'], [60, '1 hour'], [180, '3 hours'], [720, '12 hours'], [1440, '1 day'], [2880, '2 days'], [10080, '1 week']];
  function newTask(o) { return Object.assign({ id: uid(), title: '', subject: S.subjects[0].id, kind: 'homework', due: '', priority: 'normal', status: 'todo', notes: '', files: [], remind: S.settings.defRemind.slice(), created: Date.now() }, o || {}); }
  function dueHtml(t) {
    var u = pdt(t.due); if (!u) return '<div class="due"><small>no deadline</small></div>';
    var late = u < Date.now() && t.status !== 'done', soon = !late && u - Date.now() < 2 * 864e5;
    return '<div class="due' + (late ? ' late' : soon ? ' soon' : '') + '">' + (t.status === 'done' ? fdate(u) : rel(u)) + '<small>' + fdate(u) + ' · ' + ftime(u) + '</small></div>';
  }
  function taskHtml(t) {
    var c = scol(t.subject);
    return '<div class="task' + (t.status === 'done' ? ' done' : '') + '" data-task="' + t.id + '" style="--c:' + c + '" draggable="true"><button class="ck" type="button" data-ck="' + t.id + '" aria-label="Mark done">' + ic('check') + '</button>' +
      '<div><div class="tt">' + (t.priority === 'high' ? '<span style="color:var(--bad)">! </span>' : '') + esc(t.title || 'Untitled') + '</div><div class="mt"><span class="dot"></span>' + esc(sname(t.subject)) + (t.kind !== 'homework' ? ' · ' + esc(KINDS[t.kind] || t.kind) : '') + (t.status === 'doing' ? ' · <b style="color:var(--acc2)">in progress</b>' : '') +
      (t.files.length ? ' · ' + ic('clip') + t.files.length : '') + (t.remind && t.remind.length && t.status !== 'done' ? ' · ' + ic('bell') : '') + '</div></div>' + dueHtml(t) + '</div>';
  }
  var KINDS = { homework: 'Homework', essay: 'Essay', presentation: 'Presentation', project: 'Project', reading: 'Reading', test: 'Test / exam', personal: 'Personal' };
  var tf = { subject: 'all', show: 'open' };
  function vTasks(m) {
    var now = Date.now(), list = S.tasks.filter(function (t) { return tf.subject === 'all' || t.subject === tf.subject; }), mode = S.settings.taskView;
    var h = '<div class="view"><div class="phead"><div><div class="kicker">Assignments</div><h1>Deadlines</h1><p>' + plural(list.filter(function (t) { return t.status !== 'done'; }).length, 'open assignment') + '</p></div><div class="row"><div class="seg"><button type="button" data-tv="list" aria-pressed="' + (mode === 'list') + '">' + ic('list') + '</button><button type="button" data-tv="board" aria-pressed="' + (mode === 'board') + '">' + ic('board') + '</button></div><button class="btn pri" data-add="task">' + ic('plus') + 'Assignment</button></div></div>';
    h += '<div class="filters"><button class="chip" style="--c:#9AA2C7" data-tfs="all" aria-pressed="' + (tf.subject === 'all') + '">All subjects</button>' + S.subjects.map(function (s) { return '<button class="chip" style="--c:' + s.color + '" data-tfs="' + s.id + '" aria-pressed="' + (tf.subject === s.id) + '"><span class="dot"></span>' + esc(s.short) + '</button>'; }).join('') + '<button class="chip" style="--c:#FFB547" data-tfs="" aria-pressed="' + (tf.subject === '') + '">Life</button></div>';
    if (!S.tasks.length) h += '<div class="empty" style="margin-top:18px">' + ic('flag') + '<p><b>No assignments yet.</b><br>Add one with its deadline, reminders and files, or take a homework note during class.</p><button class="btn pri" data-add="task">' + ic('plus') + 'Add assignment</button></div>';
    else if (mode === 'board') {
      h += '<div class="board" style="margin-top:12px">' + [['todo', 'To do'], ['doing', 'In progress'], ['done', 'Done']].map(function (c) {
        var it = list.filter(function (t) { return t.status === c[0]; }).sort(function (a, b) { return (pdt(a.due) || 9e15) - (pdt(b.due) || 9e15); });
        return '<div class="col" data-col="' + c[0] + '"><h3>' + c[1] + '<span class="muted">' + it.length + '</span></h3>' + it.map(taskHtml).join('') + '</div>';
      }).join('') + '</div>';
    } else {
      var open = list.filter(function (t) { return t.status !== 'done'; }), eod = sod(new Date()).getTime() + 864e5, eow = monday(new Date()).getTime() + 7 * 864e5;
      var G = [['Overdue', function (u) { return u && u < now; }], ['Today', function (u) { return u && u >= now && u < eod; }], ['This week', function (u) { return u && u >= eod && u < eow; }], ['Later', function (u) { return u && u >= eow; }], ['No deadline', function (u) { return !u; }]];
      G.forEach(function (g) {
        var it = open.filter(function (t) { return g[1](pdt(t.due)); }).sort(function (a, b) { return (pdt(a.due) || 0) - (pdt(b.due) || 0) || (a.priority === 'high' ? -1 : 1); });
        if (it.length) h += '<div class="grp"><b' + (g[0] === 'Overdue' ? ' style="color:var(--bad)"' : '') + '>' + g[0] + '</b>' + it.length + '</div><div class="grid" style="gap:8px">' + it.map(taskHtml).join('') + '</div>';
      });
      var dn = list.filter(function (t) { return t.status === 'done'; }).sort(function (a, b) { return (b.doneAt || 0) - (a.doneAt || 0); });
      if (dn.length) h += '<div class="grp"><b>Done</b>' + dn.length + '</div><div class="grid" style="gap:8px">' + dn.slice(0, tf.show === 'all' ? 999 : 5).map(taskHtml).join('') + '</div>' + (dn.length > 5 && tf.show !== 'all' ? '<button class="btn sm ghost" id="showdone" style="margin-top:8px">Show all ' + dn.length + '</button>' : '');
    }
    m.innerHTML = h + '</div>';
    $$('[data-tv]', m).forEach(function (b) { b.onclick = function () { S.settings.taskView = b.getAttribute('data-tv'); save(); render(); }; });
    $$('[data-tfs]', m).forEach(function (b) { b.onclick = function () { tf.subject = b.getAttribute('data-tfs'); render(); }; });
    var sd = $('#showdone', m); if (sd) sd.onclick = function () { tf.show = 'all'; render(); };
    $$('.col', m).forEach(function (col) {
      col.addEventListener('dragover', function (e) { e.preventDefault(); col.classList.add('over'); });
      col.addEventListener('dragleave', function () { col.classList.remove('over'); });
      col.addEventListener('drop', function (e) { e.preventDefault(); col.classList.remove('over'); var t = task(e.dataTransfer.getData('text/plain')); if (!t) return; setStatus(t, col.getAttribute('data-col')); });
    });
    $$('.task[draggable]', m).forEach(function (el) { el.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', el.getAttribute('data-task')); }); });
  }
  function setStatus(t, s) { var was = t.status; t.status = s; t.doneAt = s === 'done' ? Date.now() : null; save(); render(); if (s === 'done' && was !== 'done') { confetti(scol(t.subject)); toast('Done: ' + (t.title || 'assignment'), 'check', scol(t.subject), function () { t.status = was; t.doneAt = null; save(); render(); }); } }
  function openTask(id, pre) {
    var isNew = !id, t = isNew ? newTask(pre) : JSON.parse(JSON.stringify(task(id))); if (!t) return;
    if (isNew && !t.due) t.due = defaultDue(t.subject);
    var pending = [];
    function body() {
      return '<label class="field"><span>Title</span><input class="in" id="t-title" autofocus value="' + esc(t.title) + '" placeholder="e.g. Essay on the 1991 independence, 2 pages" maxlength="140"></label>' +
        '<div class="field"><span>Subject</span><div class="subpick">' + S.subjects.map(function (s) { return '<button type="button" data-sp="' + s.id + '" style="--c:' + s.color + '" aria-pressed="' + (s.id === t.subject) + '"><span class="dot"></span>' + esc(s.short) + '</button>'; }).join('') + '<button type="button" data-sp="" style="--c:#FFB547" aria-pressed="' + (!t.subject) + '"><span class="dot"></span>Life</button></div></div>' +
        '<div class="two"><label class="field"><span>Deadline</span><input class="in" type="datetime-local" id="t-due" value="' + esc(t.due) + '"></label><label class="field"><span>Type</span><select class="in" id="t-kind">' + Object.keys(KINDS).map(function (k) { return '<option value="' + k + '"' + (t.kind === k ? ' selected' : '') + '>' + KINDS[k] + '</option>'; }).join('') + '</select></label></div>' +
        '<div class="row wrap tiny muted" id="t-quick">' + [['Next class', ''], ['Tonight 23:59', 'tonight'], ['Tomorrow 09:00', 'tom'], ['In a week', 'week']].map(function (q) { return '<button type="button" class="btn sm ghost" data-qd="' + q[1] + '">' + q[0] + '</button>'; }).join('') + '</div>' +
        '<div class="two"><div class="field"><span>Status</span><div class="seg">' + [['todo', 'To do'], ['doing', 'Doing'], ['done', 'Done']].map(function (s) { return '<button type="button" data-st="' + s[0] + '" aria-pressed="' + (t.status === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div></div>' +
        '<div class="field"><span>Priority</span><div class="seg">' + [['low', 'Low'], ['normal', 'Normal'], ['high', 'High']].map(function (s) { return '<button type="button" data-pr="' + s[0] + '" aria-pressed="' + (t.priority === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div></div></div>' +
        '<div class="field"><span>' + ic('bell') + ' Remind me before the deadline</span><div class="rems">' + REMS.map(function (r) { return '<button type="button" data-rm="' + r[0] + '" aria-pressed="' + (t.remind.indexOf(r[0]) >= 0) + '">' + r[1] + '</button>'; }).join('') + '</div>' + notifyHint() + '</div>' +
        '<div class="field"><span>' + ic('clip') + ' Files (any type, up to 60 MB each)</span><div class="drop" id="t-drop" tabindex="0" role="button"><b>Drop files here</b> or tap to choose<br><span class="tiny">PDF, Word, PowerPoint, Excel, images, audio, video, ZIP…</span></div><div class="files" id="t-files"></div></div>' +
        '<label class="field"><span>Notes</span><textarea class="in" id="t-notes" rows="4" placeholder="Requirements, pages, links, what the teacher said…">' + esc(t.notes) + '</textarea></label>';
    }
    function grab() { t.title = $('#t-title').value.trim(); t.due = $('#t-due').value; t.kind = $('#t-kind').value; t.notes = $('#t-notes').value; }
    function mount(sh) {
      $$('[data-sp]', sh).forEach(function (b) { b.onclick = function () { grab(); t.subject = b.getAttribute('data-sp') || null; re(sh); }; });
      $$('[data-st]', sh).forEach(function (b) { b.onclick = function () { grab(); t.status = b.getAttribute('data-st'); re(sh); }; });
      $$('[data-pr]', sh).forEach(function (b) { b.onclick = function () { grab(); t.priority = b.getAttribute('data-pr'); re(sh); }; });
      $$('[data-rm]', sh).forEach(function (b) { b.onclick = function () { grab(); var v = +b.getAttribute('data-rm'), i = t.remind.indexOf(v); if (i >= 0) t.remind.splice(i, 1); else t.remind.push(v); re(sh); }; });
      $$('[data-qd]', sh).forEach(function (b) {
        b.onclick = function () {
          grab(); var q = b.getAttribute('data-qd'), d = new Date();
          t.due = q === 'tonight' ? ymd(d) + 'T23:59' : q === 'tom' ? ymd(addDays(d, 1)) + 'T09:00' : q === 'week' ? ymd(addDays(d, 7)) + 'T23:59' : defaultDue(t.subject); re(sh);
        };
      });
      var nb = $('[data-notify]', sh); if (nb) nb.onclick = function () { grab(); askNotify().then(function () { re(sh); }); };
      var drop = $('#t-drop', sh);
      drop.onclick = drop.onkeydown = function (e) { if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return; e.preventDefault(); pickFiles(addFiles); };
      ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('on'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('on'); }); });
      drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });
      renderFiles(sh);
    }
    function re(sh) { $('.sh-b', sh).innerHTML = body(); mount(sh); }
    function addFiles(fl) {
      Array.prototype.forEach.call(fl || [], function (f) {
        if (f.size > MAXFILE) { toast(f.name + ' is ' + fsize(f.size) + '. The limit is 60 MB per file.', 'x', 'var(--bad)'); return; }
        var meta = { id: uid(), name: f.name, size: f.size, type: f.type || '', added: Date.now(), saving: true };
        t.files.push(meta); pending.push(meta.id); renderFiles($('#sheet'));
        persist();
        fput(meta.id, f).then(function () { meta.saving = false; renderFiles($('#sheet')); }, function (err) {
          t.files = t.files.filter(function (x) { return x.id !== meta.id; }); renderFiles($('#sheet'));
          toast('Could not store ' + f.name + (err && err.name === 'QuotaExceededError' ? ': the browser is out of space.' : '.'), 'x', 'var(--bad)');
        });
      });
    }
    function renderFiles(sh) {
      var box = $('#t-files', sh); if (!box) return;
      box.innerHTML = t.files.map(function (f) { return fileHtml(f, true); }).join('');
      bindFiles(box, function (fid) { t.files = t.files.filter(function (x) { return x.id !== fid; }); if (pending.indexOf(fid) >= 0) fdel(fid); else removed.push(fid); renderFiles(sh); });
      thumbs(box);
    }
    var removed = [];
    var foot = (isNew ? '' : '<button class="btn ghost bad" id="t-del">' + ic('trash') + 'Delete</button>') + '<button class="btn" id="t-cancel">Cancel</button><button class="btn pri" id="t-save">' + ic('check') + (isNew ? 'Add assignment' : 'Save') + '</button>';
    sheet(isNew ? 'New assignment' : 'Assignment', body(), foot, function (sh) {
      mount(sh);
      $('#t-cancel').onclick = function () { closeSheet(); };
      $('#t-save').onclick = function () {
        grab(); if (!t.title) { $('#t-title').focus(); $('#t-title').style.borderColor = 'var(--bad)'; return; }
        if (t.files.some(function (f) { return f.saving; })) { toast('Wait a moment: files are still saving.', 'clip'); return; }
        t.files.forEach(function (f) { delete f.saving; });
        if (t.status === 'done' && !t.doneAt) t.doneAt = Date.now();
        Object.keys(S.fired).forEach(function (k) { if (k.indexOf(t.id) === 0) delete S.fired[k]; });
        if (isNew) S.tasks.push(t); else S.tasks = S.tasks.map(function (x) { return x.id === t.id ? t : x; });
        removed.forEach(fdel); pending = [];
        save(); closeSheet(); toast(isNew ? 'Assignment added' + (t.due ? ' · due ' + rel(pdt(t.due)) : '') : 'Saved', 'flag', scol(t.subject));
        if (isNew && t.remind.length && !S.settings.notify && 'Notification' in window && Notification.permission === 'default') setTimeout(function () { toast('Turn on notifications to get deadline reminders', 'bell', null, askNotify, 'Turn on'); }, 900);
      };
      var del = $('#t-del'); if (del) del.onclick = function () {
        var orig = task(id), i = S.tasks.indexOf(orig); S.tasks.splice(i, 1); save(); closeSheet();
        var tm = setTimeout(function () { orig.files.forEach(function (f) { fdel(f.id); }); }, 6500);
        toast('Assignment deleted', 'trash', null, function () { clearTimeout(tm); S.tasks.splice(i, 0, orig); save(); render(); });
      };
    }, function () { pending.forEach(fdel); });
  }
  function pickFiles(cb) { var fi = $('#file-in'); fi.value = ''; fi.onchange = function () { cb(fi.files); }; fi.click(); }
  function fileHtml(f, editable) {
    var e = ext(f.name), img = /^image\//.test(f.type);
    return '<div class="file" data-fid="' + f.id + '"><div class="th" style="--fc:' + (FCOL[e] || '#8B7CFF') + '"' + (img ? ' data-img="' + f.id + '"' : '') + '>' + esc(e.slice(0, 4)) + '</div><div class="nm">' + esc(f.name) + '<small>' + fsize(f.size) + (f.saving ? ' · saving…' : '') + '</small>' + (f.saving ? '<div class="prog"><i style="width:70%"></i></div>' : '') + '</div>' +
      '<div class="acts"><button class="ib" type="button" data-fopen="' + f.id + '" title="Open" aria-label="Open">' + ic('eye') + '</button><button class="ib" type="button" data-fdl="' + f.id + '" title="Download" aria-label="Download">' + ic('down') + '</button>' + (editable ? '<button class="ib" type="button" data-frm="' + f.id + '" title="Remove" aria-label="Remove">' + ic('trash') + '</button>' : '') + '</div></div>';
  }
  function bindFiles(root, onRemove) {
    function meta(fid) { var m = null; S.tasks.forEach(function (t) { t.files.forEach(function (f) { if (f.id === fid) m = f; }); }); return m; }
    function blobOf(fid) { return fget(fid).then(function (b) { if (!b) throw new Error('missing'); return b; }); }
    $$('[data-fopen]', root).forEach(function (b) { b.onclick = function () { var fid = b.getAttribute('data-fopen'); var w = window.open('', '_blank'); blobOf(fid).then(function (bl) { var u = URL.createObjectURL(bl); if (w) w.location = u; else location.href = u; setTimeout(function () { URL.revokeObjectURL(u); }, 60000); }, function () { if (w) w.close(); toast('That file is not in this browser.', 'x', 'var(--bad)'); }); }; });
    $$('[data-fdl]', root).forEach(function (b) {
      b.onclick = function () {
        var fid = b.getAttribute('data-fdl'), row = b.closest('.file'), name = row ? row.querySelector('.nm').firstChild.textContent : (meta(fid) || {}).name;
        blobOf(fid).then(function (bl) { var a = document.createElement('a'), u = URL.createObjectURL(bl); a.href = u; a.download = name || 'file'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 2000); }, function () { toast('That file is not in this browser.', 'x', 'var(--bad)'); });
      };
    });
    $$('[data-frm]', root).forEach(function (b) { b.onclick = function () { onRemove(b.getAttribute('data-frm')); }; });
  }
  function thumbs(root) { $$('[data-img]', root).forEach(function (th) { fget(th.getAttribute('data-img')).then(function (bl) { if (bl) th.innerHTML = '<img alt="" src="' + URL.createObjectURL(bl) + '">'; }, function () {}); }); }

  /* ------------------------------------------------------------ events (life + study) */
  var CATS = { Life: '#FFB547', Study: '#8B7CFF', Health: '#3DDC97', Social: '#F472B6', Work: '#38BDF8', 'Self-improvement': '#2EE6C5' };
  function openEvent(id, pre) {
    var isNew = !id, e = isNew ? Object.assign({ id: uid(), title: '', date: ymd(new Date()), start: '15:00', end: '16:00', repeat: 'none', category: 'Life', color: CATS.Life, subject: null, notes: '', remind: [30] }, pre || {}) : JSON.parse(JSON.stringify(S.events.filter(function (x) { return x.id === id; })[0]));
    if (pre && pre.start && isNew) e.end = m2hm(Math.min(1439, hm2m(pre.start) + 60));
    function body() {
      return '<label class="field"><span>Title</span><input class="in" id="e-title" autofocus value="' + esc(e.title) + '" placeholder="e.g. Gym, Group study, Dinner with family"></label>' +
        '<div class="field"><span>Category</span><div class="subpick">' + Object.keys(CATS).map(function (k) { return '<button type="button" data-cat="' + k + '" style="--c:' + CATS[k] + '" aria-pressed="' + (e.category === k) + '"><span class="dot"></span>' + k + '</button>'; }).join('') + '</div></div>' +
        '<div class="two"><label class="field"><span>Date</span><input class="in" type="date" id="e-date" value="' + e.date + '"></label><label class="field"><span>Repeat</span><select class="in" id="e-rep">' + [['none', 'Does not repeat'], ['daily', 'Every day'], ['weekly', 'Every week']].map(function (r) { return '<option value="' + r[0] + '"' + (e.repeat === r[0] ? ' selected' : '') + '>' + r[1] + '</option>'; }).join('') + '</select></label></div>' +
        '<div class="two"><label class="field"><span>Starts</span><input class="in" type="time" id="e-start" value="' + e.start + '"></label><label class="field"><span>Ends</span><input class="in" type="time" id="e-end" value="' + e.end + '"></label></div>' +
        '<div class="field"><span>Link to a subject (optional)</span><div class="subpick"><button type="button" data-es="" aria-pressed="' + (!e.subject) + '" style="--c:#9AA2C7">None</button>' + S.subjects.map(function (s) { return '<button type="button" data-es="' + s.id + '" style="--c:' + s.color + '" aria-pressed="' + (e.subject === s.id) + '"><span class="dot"></span>' + esc(s.short) + '</button>'; }).join('') + '</div></div>' +
        '<div class="field"><span>' + ic('bell') + ' Remind me</span><div class="rems">' + [[0, 'At start'], [10, '10 min'], [30, '30 min'], [60, '1 hour'], [1440, '1 day']].map(function (r) { return '<button type="button" data-rm="' + r[0] + '" aria-pressed="' + (e.remind.indexOf(r[0]) >= 0) + '">' + r[1] + '</button>'; }).join('') + '</div></div>' +
        '<label class="field"><span>Notes</span><textarea class="in" id="e-notes" rows="3">' + esc(e.notes) + '</textarea></label>';
    }
    function grab() { e.title = $('#e-title').value.trim(); e.date = $('#e-date').value; e.repeat = $('#e-rep').value; e.start = $('#e-start').value; e.end = $('#e-end').value; e.notes = $('#e-notes').value; }
    function mount(sh) {
      $$('[data-cat]', sh).forEach(function (b) { b.onclick = function () { grab(); e.category = b.getAttribute('data-cat'); e.color = CATS[e.category]; re(sh); }; });
      $$('[data-es]', sh).forEach(function (b) { b.onclick = function () { grab(); e.subject = b.getAttribute('data-es') || null; re(sh); }; });
      $$('[data-rm]', sh).forEach(function (b) { b.onclick = function () { grab(); var v = +b.getAttribute('data-rm'), i = e.remind.indexOf(v); if (i >= 0) e.remind.splice(i, 1); else e.remind.push(v); re(sh); }; });
    }
    function re(sh) { $('.sh-b', sh).innerHTML = body(); mount(sh); }
    sheet(isNew ? 'New event' : 'Event', body(), (isNew ? '' : '<button class="btn ghost bad" id="e-del">' + ic('trash') + 'Delete</button>') + '<button class="btn" id="e-cancel">Cancel</button><button class="btn pri" id="e-save">' + ic('check') + 'Save</button>', function (sh) {
      mount(sh);
      $('#e-cancel').onclick = closeSheet;
      $('#e-save').onclick = function () {
        grab(); if (!e.title) { $('#e-title').focus(); return; } if (hm2m(e.end) <= hm2m(e.start)) e.end = m2hm(Math.min(1439, hm2m(e.start) + 30));
        if (isNew) S.events.push(e); else S.events = S.events.map(function (x) { return x.id === e.id ? e : x; });
        save(); closeSheet(); toast(isNew ? 'Added to your calendar' : 'Saved', 'cal', e.color);
      };
      var d = $('#e-del'); if (d) d.onclick = function () { var o = S.events.filter(function (x) { return x.id === id; })[0], i = S.events.indexOf(o); S.events.splice(i, 1); save(); closeSheet(); toast('Event deleted', 'trash', null, function () { S.events.splice(i, 0, o); save(); render(); }); };
    });
  }

  /* ------------------------------------------------------------ subjects */
  function vSubjects(m) {
    var h = '<div class="view"><div class="phead"><div><div class="kicker">Semester</div><h1>Subjects</h1><p>Your six subjects, their classes, notes and files.</p></div></div><div class="grid subs">';
    S.subjects.forEach(function (s) {
      var sl = S.slots.filter(function (x) { return x.subject === s.id; }).sort(function (a, b) { return a.dow - b.dow || a.period - b.period; });
      var all = S.tasks.filter(function (t) { return t.subject === s.id; }), dn = all.filter(function (t) { return t.status === 'done'; }).length, nn = S.notes.filter(function (n) { return n.subject === s.id; }).length;
      var nx = null; for (var i = 0; i < 15 && !nx; i++) nx = classesOn(addDays(new Date(), i)).filter(function (c) { return c.subject === s.id && c.end > Date.now(); })[0];
      h += '<article class="card hl sub" style="--c:' + s.color + '" data-subj="' + s.id + '"><div class="row"><div class="ico">' + esc(s.short.slice(0, 2)) + '</div><div style="min-width:0"><h3>' + esc(s.name) + '</h3><div class="tiny muted">' + s.types.map(function (t) { return TYPES[t]; }).join(' · ') + '</div></div></div>' +
        '<div class="sl">' + sl.map(function (x) { return '<span class="chip">' + DOWS[x.dow] + ' · ' + TYPES[x.type].slice(0, 3) + (x.parity !== 'all' ? ' · wk ' + x.parity : '') + '</span>'; }).join('') + '</div>' +
        '<div class="row sp small"><span class="muted">' + (nx ? 'Next: ' + fdate(nx.start) + ' ' + ftime(nx.start) : 'No class soon') + '</span><span class="muted">' + plural(nn, 'note') + '</span></div>' +
        '<div><div class="row sp tiny muted" style="margin-bottom:5px"><span>Assignments</span><span>' + dn + ' / ' + all.length + ' done</span></div><div class="bar"><i style="width:' + (all.length ? dn / all.length * 100 : 0) + '%"></i></div></div></article>';
    });
    m.innerHTML = h + '</div></div>';
    $$('[data-subj]', m).forEach(function (c) { c.onclick = function () { openSubject(c.getAttribute('data-subj')); }; });
  }
  function openSubject(id) {
    var s = subj(id), ns = S.notes.filter(function (n) { return n.subject === id; }).sort(function (a, b) { return b.at - a.at; });
    var ts = S.tasks.filter(function (t) { return t.subject === id; }).sort(function (a, b) { return (a.status === 'done') - (b.status === 'done') || (pdt(a.due) || 9e15) - (pdt(b.due) || 9e15); });
    var files = []; ts.forEach(function (t) { t.files.forEach(function (f) { files.push(f); }); });
    var body = '<div class="two"><label class="field"><span>Teacher</span><input class="in" id="s-teacher" value="' + esc(s.teacher) + '" placeholder="Name"></label><label class="field"><span>Room</span><input class="in" id="s-room" value="' + esc(s.room) + '" placeholder="e.g. B-214"></label></div>' +
      '<label class="field"><span>Short name</span><input class="in" id="s-short" value="' + esc(s.short) + '" maxlength="28"></label>' +
      '<div class="field"><span>Colour</span><input type="color" id="s-color" value="' + s.color + '" style="width:60px;height:36px;border:0;background:none"></div>' +
      '<div><div class="row sp" style="margin-bottom:8px"><h3>Assignments</h3><button class="btn sm" id="s-addt">' + ic('plus') + 'Add</button></div><div class="grid" style="gap:8px">' + (ts.length ? ts.map(taskHtml).join('') : '<div class="empty">No assignments yet.</div>') + '</div></div>' +
      '<div><div class="row sp" style="margin-bottom:8px"><h3>Notes</h3><button class="btn sm" id="s-addn">' + ic('plus') + 'Add</button></div><div class="notes">' + (ns.length ? ns.map(noteHtml).join('') : '<div class="empty">No notes yet.</div>') + '</div></div>' +
      '<div><h3 style="margin-bottom:8px">All files · ' + files.length + '</h3><div class="files">' + (files.length ? files.map(function (f) { return fileHtml(f, false); }).join('') : '<div class="empty">Files you attach to assignments collect here.</div>') + '</div></div>';
    sheet(esc(s.name), body, '<button class="btn pri" id="s-save">' + ic('check') + 'Save</button>', function (sh) {
      bindNotes(sh); bindFiles(sh); thumbs(sh);
      $('#s-addt').onclick = function () { closeSheet(); openTask(null, { subject: id }); };
      $('#s-addn').onclick = function () { closeSheet(); openNote({ subject: id }); };
      $('#s-save').onclick = function () { s.teacher = $('#s-teacher').value.trim(); s.room = $('#s-room').value.trim(); s.short = $('#s-short').value.trim() || s.short; s.color = $('#s-color').value; save(); closeSheet(); toast('Subject saved', 'book', s.color); };
    });
  }

  /* ------------------------------------------------------------ settings */
  function vSettings(m) {
    var s = S.settings, perm = 'Notification' in window ? Notification.permission : 'unsupported';
    var h = '<div class="view"><div class="phead"><div><div class="kicker">Settings</div><h1>Your setup</h1><p>Timetable, class times, reminders and backups.</p></div></div><div class="set">';
    h += '<section class="card grid" style="gap:14px"><h2>' + ic('bell') + ' Reminders</h2>' +
      '<div class="row sp"><div><b>Browser notifications</b><div class="small muted">' + (perm === 'granted' && s.notify ? 'On. Reminders pop up while Reja is open or installed.' : perm === 'denied' ? 'Blocked in your browser settings for this site.' : perm === 'unsupported' ? 'This browser does not support notifications.' : 'Off') + '</div></div><label class="sw"><input type="checkbox" id="set-notify"' + (s.notify && perm === 'granted' ? ' checked' : '') + (perm === 'denied' || perm === 'unsupported' ? ' disabled' : '') + '><i></i></label></div>' +
      '<div class="row sp"><div><b>Before each class</b><div class="small muted">A heads-up so you are never late.</div></div><select class="in" id="set-cr" style="width:130px">' + [[0, 'Off'], [5, '5 min'], [10, '10 min'], [15, '15 min'], [30, '30 min']].map(function (o) { return '<option value="' + o[0] + '"' + (s.classRemind === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
      '<div class="row sp"><div><b>Test it</b><div class="small muted">Sends a sample reminder now.</div></div><button class="btn sm" id="set-test">' + ic('bell') + 'Test</button></div>' +
      '<div class="card" style="background:color-mix(in srgb,var(--acc2) 8%,transparent)"><b>Reminders on your phone, even when Reja is closed</b><p class="small muted" style="margin:6px 0 12px">Export your classes and deadlines to your phone’s calendar (Google Calendar, Apple Calendar, Outlook). Its alarms ring even when the browser is closed. Export again after adding new deadlines.</p><div class="row wrap"><button class="btn pri sm" id="set-ics">' + ic('cal') + 'Export to calendar (.ics)</button><span class="tiny muted">Classes repeat until</span><input class="in" type="date" id="set-end" value="' + s.semesterEnd + '" style="width:160px;min-height:34px;padding:4px 10px"></div></div></section>';
    h += '<section class="card grid" style="gap:12px"><h2>' + ic('clock') + ' Class times</h2><p class="small muted" style="margin:0">Set the start and end of each pair. Every class moves with it.</p>' + S.periods.map(function (p, i) { return '<div class="per"><b>' + (i + 1) + '</b><input class="in" type="time" data-per="' + i + ':0" value="' + p[0] + '"><input class="in" type="time" data-per="' + i + ':1" value="' + p[1] + '"></div>'; }).join('') + '</section>';
    h += '<section class="card grid" style="gap:12px;grid-column:1/-1"><div class="row sp wrap"><h2>' + ic('cal') + ' Weekly timetable</h2><div class="row wrap"><span class="chip parity">This week is week ' + parity(new Date()) + '</span><button class="btn sm" id="set-swap">Swap A and B</button><button class="btn sm pri" id="set-addslot">' + ic('plus') + 'Add class</button></div></div>' +
      '<p class="small muted" style="margin:0">Press and hold a class, then drag it to another day or pair. Tap a class to edit it, or an empty cell to add one. Week A has the Thursday ICT lecture.</p>' + ttGrid() + '</section>';
    h += '<section class="card grid" style="gap:12px"><h2>' + ic('down') + ' Backup</h2><p class="small muted" style="margin:0">Everything stays in this browser. Download a backup now and then, especially before clearing browser data. Files are not inside the backup; keep the originals too.</p><div class="row wrap"><button class="btn sm" id="set-export">' + ic('down') + 'Download backup</button><button class="btn sm" id="set-import">' + ic('up') + 'Restore backup</button></div><div class="small muted" id="set-usage"></div></section>';
    h += '<section class="card grid" style="gap:12px"><h2>' + ic('spark') + ' Appearance</h2><div class="row sp"><b>Theme</b><div class="seg"><button type="button" data-th="dark" aria-pressed="' + (s.theme === 'dark') + '">Dark</button><button type="button" data-th="light" aria-pressed="' + (s.theme === 'light') + '">Light</button></div></div><div class="row sp"><div><b>Start over</b><div class="small muted">Erase plans, notes and files in this browser.</div></div><button class="btn sm bad" id="set-reset">Erase</button></div></section>';
    m.innerHTML = h + '</div></div>';
    $('#set-notify').onchange = function (e) { if (e.target.checked) askNotify().then(render); else { S.settings.notify = false; save(); render(); } };
    $('#set-cr').onchange = function (e) { S.settings.classRemind = +e.target.value; save(); };
    $('#set-test').onclick = function () { notify('Reja test', 'Reminders work. You will get one like this before each deadline.', 'test' + Date.now()); };
    $('#set-ics').onclick = exportIcs;
    $('#set-end').onchange = function (e) { S.settings.semesterEnd = e.target.value; save(); };
    $$('[data-per]', m).forEach(function (inp) { inp.onchange = function () { var p = inp.getAttribute('data-per').split(':'); S.periods[+p[0]][+p[1]] = inp.value; save(); toast('Class times updated', 'clock'); }; });
    $('#set-swap').onclick = function () { var a = monday(pday(S.parityAnchor)); S.parityAnchor = ymd(addDays(a, 7)); save(); render(); toast('Swapped. This week is now week ' + parity(new Date()), 'cal'); };
    $('#set-addslot').onclick = function () { openSlot(null); };
    $$('[data-slot]', m).forEach(function (b) { b.onclick = function () { openSlot(b.getAttribute('data-slot')); }; holdDrag(b, ttDrag(b)); });
    $$('[data-cell]', m).forEach(function (c) { c.onclick = function (e) { if (e.target.closest('[data-slot]')) return; var p = c.getAttribute('data-cell').split(':'); openSlot(null, { dow: +p[0], period: +p[1] }); }; });
    $('#set-export').onclick = function () { download('reja-backup-' + ymd(new Date()) + '.json', JSON.stringify({ app: 'reja', v: 1, at: new Date().toISOString(), data: S }, null, 2), 'application/json'); };
    $('#set-import').onclick = function () {
      var fi = $('#backup-in'); fi.value = ''; fi.onchange = function () {
        var r = new FileReader(); r.onload = function () { try { var o = JSON.parse(r.result), d = o.data || o; if (!d.subjects || !d.slots) throw 0; localStorage.setItem(KEY, JSON.stringify(d)); S = load(); render(); toast('Backup restored', 'up'); } catch (e) { toast('That file is not a Reja backup.', 'x', 'var(--bad)'); } };
        r.readAsText(fi.files[0]);
      }; fi.click();
    };
    $$('[data-th]', m).forEach(function (b) { b.onclick = function () { S.settings.theme = b.getAttribute('data-th'); applyTheme(); save(); render(); }; });
    $('#set-reset').onclick = function () {
      if (!confirm('Erase all plans, notes and attached files in this browser? This cannot be undone.')) return;
      localStorage.removeItem(KEY); try { indexedDB.deleteDatabase('reja-files'); } catch (e) {} dbp = null; S = seed(); save(); render(); toast('Reja is fresh again', 'spark');
    };
    if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(function (q) { var u = $('#set-usage'); if (u) u.textContent = 'Using ' + fsize(q.usage || 0) + ' of about ' + fsize(q.quota || 0) + ' available to this site.'; });
  }
  function openSlot(id, pre) {
    var isNew = !id, s = isNew ? Object.assign({ id: uid(), dow: 1, period: 4, subject: S.subjects[0].id, type: 'lecture', parity: 'all' }, pre || {}) : JSON.parse(JSON.stringify(S.slots.filter(function (x) { return x.id === id; })[0]));
    var body = '<div class="field"><span>Subject</span><select class="in" id="sl-s">' + S.subjects.map(function (x) { return '<option value="' + x.id + '"' + (x.id === s.subject ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="two"><label class="field"><span>Day</span><select class="in" id="sl-d">' + [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<option value="' + d + '"' + (d === s.dow ? ' selected' : '') + '>' + DOW[d] + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span>Pair</span><select class="in" id="sl-p">' + S.periods.map(function (p, i) { return '<option value="' + (i + 1) + '"' + (i + 1 === s.period ? ' selected' : '') + '>' + (i + 1) + ' · ' + p[0] + '–' + p[1] + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="two"><label class="field"><span>Type</span><select class="in" id="sl-t">' + Object.keys(TYPES).map(function (t) { return '<option value="' + t + '"' + (t === s.type ? ' selected' : '') + '>' + TYPES[t] + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span>Which weeks</span><select class="in" id="sl-w">' + [['all', 'Every week'], ['A', 'Week A only'], ['B', 'Week B only']].map(function (w) { return '<option value="' + w[0] + '"' + (w[0] === s.parity ? ' selected' : '') + '>' + w[1] + '</option>'; }).join('') + '</select></label></div>';
    sheet(isNew ? 'Add class' : 'Edit class', body, (isNew ? '' : '<button class="btn ghost bad" id="sl-del">' + ic('trash') + 'Remove</button>') + '<button class="btn pri" id="sl-save">' + ic('check') + 'Save</button>', function () {
      $('#sl-save').onclick = function () { s.subject = $('#sl-s').value; s.dow = +$('#sl-d').value; s.period = +$('#sl-p').value; s.type = $('#sl-t').value; s.parity = $('#sl-w').value; if (isNew) S.slots.push(s); else S.slots = S.slots.map(function (x) { return x.id === s.id ? s : x; }); save(); closeSheet(); toast('Timetable updated', 'cal', scol(s.subject)); };
      var d = $('#sl-del'); if (d) d.onclick = function () { var o = S.slots.filter(function (x) { return x.id === id; })[0], i = S.slots.indexOf(o); S.slots.splice(i, 1); save(); closeSheet(); toast('Class removed', 'trash', null, function () { S.slots.splice(i, 0, o); save(); render(); }); };
    });
  }
  function download(name, text, type) { var a = document.createElement('a'), u = URL.createObjectURL(new Blob([text], { type: type })); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 1500); }

  /* ------------------------------------------------------------ calendar export (.ics) with alarms */
  function icsDate(ms) { var d = new Date(ms); return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00'; }
  function icsEsc(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&'); }
  function exportIcs() {
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Clive//Reja//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Reja', 'X-WR-TIMEZONE:Asia/Tashkent',
      'BEGIN:VTIMEZONE', 'TZID:Asia/Tashkent', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0500', 'TZOFFSETTO:+0500', 'TZNAME:UZT', 'END:STANDARD', 'END:VTIMEZONE'];
    var stamp = icsDate(Date.now()).replace('T', 'T') + 'Z', until = (S.settings.semesterEnd || '2027-01-31').replace(/-/g, '') + 'T235959', n = 0;
    function ev(uidv, start, end, sum, desc, rrule, alarms) {
      L.push('BEGIN:VEVENT', 'UID:' + uidv + '@reja.clive', 'DTSTAMP:' + stamp, 'DTSTART;TZID=Asia/Tashkent:' + icsDate(start), 'DTEND;TZID=Asia/Tashkent:' + icsDate(end), 'SUMMARY:' + icsEsc(sum));
      if (desc) L.push('DESCRIPTION:' + icsEsc(desc)); if (rrule) L.push('RRULE:' + rrule);
      (alarms || []).forEach(function (a) { L.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(sum), 'TRIGGER:-PT' + a + 'M', 'END:VALARM'); });
      L.push('END:VEVENT'); n++;
    }
    S.slots.forEach(function (sl) {
      var d = sod(new Date()); for (var i = 0; i < 14; i++) { var x = addDays(d, i); if (x.getDay() === sl.dow && (sl.parity === 'all' || parity(x) === sl.parity)) { d = x; break; } }
      var per = S.periods[sl.period - 1]; var s = subj(sl.subject);
      ev('slot-' + sl.id, at(d, per[0]).getTime(), at(d, per[1]).getTime(), s.short + ' · ' + TYPES[sl.type], s.name + (s.room ? '\nRoom ' + s.room : ''), 'FREQ=WEEKLY;INTERVAL=' + (sl.parity === 'all' ? 1 : 2) + ';UNTIL=' + until, S.settings.classRemind ? [S.settings.classRemind] : []);
    });
    S.tasks.filter(function (t) { return t.status !== 'done' && pdt(t.due); }).forEach(function (t) { var u = pdt(t.due); ev('task-' + t.id, u - 15 * 60000, u, '⚑ Due: ' + t.title + ' (' + sname(t.subject) + ')', t.notes + (t.files.length ? '\nFiles: ' + t.files.map(function (f) { return f.name; }).join(', ') : ''), null, t.remind); });
    S.events.forEach(function (e) { var d = pday(e.date); ev('ev-' + e.id, at(d, e.start).getTime(), at(d, e.end).getTime(), e.title, e.notes, e.repeat === 'daily' ? 'FREQ=DAILY' : e.repeat === 'weekly' ? 'FREQ=WEEKLY' : null, e.remind); });
    L.push('END:VCALENDAR');
    download('reja-calendar.ics', L.map(fold).join('\r\n') + '\r\n', 'text/calendar');
    toast('Exported ' + plural(n, 'calendar item') + '. Open the file to add it to your calendar.', 'cal');
  }
  function fold(l) { var o = ''; while (l.length > 74) { o += l.slice(0, 74) + '\r\n '; l = l.slice(74); } return o + l; }

  /* ------------------------------------------------------------ notifications */
  var reg = null;
  function notifyHint() {
    if (!('Notification' in window)) return '<span class="tiny muted">This browser cannot show notifications. Use “Export to calendar” in Settings.</span>';
    if (Notification.permission === 'granted' && S.settings.notify) return '<span class="tiny muted">You will get a notification. For alarms when the browser is closed, export to your calendar in Settings.</span>';
    if (Notification.permission === 'denied') return '<span class="tiny muted">Notifications are blocked for this site in your browser settings.</span>';
    return '<button type="button" class="btn sm" data-notify style="justify-self:start">' + ic('bell') + 'Allow notifications</button>';
  }
  function askNotify() {
    if (!('Notification' in window)) { toast('This browser cannot show notifications.', 'x', 'var(--bad)'); return Promise.resolve(); }
    return Promise.resolve(Notification.requestPermission()).then(function (p) {
      S.settings.notify = p === 'granted'; save();
      if (p === 'granted') toast('Notifications are on', 'bell', 'var(--ok)'); else toast('Notifications were not allowed.', 'x', 'var(--bad)');
    });
  }
  function notify(title, body, tag) {
    toast(title + ': ' + body, 'bell', 'var(--warn)');
    chime();
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    var o = { body: body, icon: 'icon-192.png', badge: 'icon-192.png', tag: tag, renotify: true };
    if (reg && reg.showNotification) reg.showNotification(title, o).catch(function () {}); else try { new Notification(title, o); } catch (e) {}
  }
  var AC = null;
  function chime() {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); var n = AC.currentTime;
      [880, 1318.5].forEach(function (f, i) { var o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0, n + i * .12); g.gain.linearRampToValueAtTime(.12, n + i * .12 + .02); g.gain.exponentialRampToValueAtTime(.0001, n + i * .12 + 1.2); o.connect(g); g.connect(AC.destination); o.start(n + i * .12); o.stop(n + i * .12 + 1.3); });
    } catch (e) {}
  }
  function checkReminders() {
    var now = Date.now(), changed = false;
    function fire(key, when, title, body, until) { if (now >= when && now - when < 6 * 3600e3 && when >= (S.created || 0) && (!until || now < until) && !S.fired[key]) { S.fired[key] = now; changed = true; notify(title, body, key); } }
    S.tasks.forEach(function (t) {
      if (t.status === 'done') return; var u = pdt(t.due); if (!u) return;
      (t.remind || []).forEach(function (r) { fire(t.id + ':' + r, u - r * 60000, r ? 'Due ' + rel(u) + ': ' + t.title : 'Due now: ' + t.title, sname(t.subject) + ' · ' + fdate(u) + ' ' + ftime(u), r ? u : u + 3600e3); });
    });
    var today = new Date();
    if (S.settings.classRemind) classesOn(today).forEach(function (c) { fire('c:' + c.key, c.start - S.settings.classRemind * 60000, sname(c.subject) + ' in ' + S.settings.classRemind + ' min', TYPES[c.type] + ' · ' + ftime(c.start) + (subj(c.subject).room ? ' · ' + subj(c.subject).room : ''), c.start); });
    eventsOn(today).forEach(function (e) { (e.ev.remind || []).forEach(function (r) { fire(e.key + ':' + r, e.start - r * 60000, e.ev.title + (r ? ' in ' + (r >= 60 ? r / 60 + ' h' : r + ' min') : ' now'), ftime(e.start) + '–' + ftime(e.end), e.start + 60000); }); });
    var tom = addDays(today, 1); eventsOn(tom).forEach(function (e) { if ((e.ev.remind || []).indexOf(1440) >= 0) fire(e.key + ':1440', e.start - 1440 * 60000, e.ev.title + ' tomorrow', ftime(e.start)); });
    if (changed) { var cut = now - 30 * 864e5; Object.keys(S.fired).forEach(function (k) { if (S.fired[k] < cut) delete S.fired[k]; }); save(); }
  }

  /* ------------------------------------------------------------ confetti */
  function confetti(c) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = document.createElement('canvas'); cv.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:70'; document.body.appendChild(cv);
    var W = cv.width = innerWidth, H = cv.height = innerHeight, x = cv.getContext('2d'), P = [], cols = [c, '#8B7CFF', '#2EE6C5', '#FFB547', '#FF5C9A'];
    for (var i = 0; i < 90; i++) P.push({ x: W / 2, y: H * .45, vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 3, r: 3 + Math.random() * 5, c: cols[i % cols.length], a: Math.random() * 6 });
    var t0 = performance.now();
    (function fr(t) { x.clearRect(0, 0, W, H); P.forEach(function (p) { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = Math.max(0, 1 - (t - t0) / 1800); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); }); if (t - t0 < 1800) requestAnimationFrame(fr); else cv.remove(); })(t0);
  }

  /* ------------------------------------------------------------ search */
  function openSearch() {
    var w = document.createElement('div'); w.className = 'search'; w.innerHTML = '<div class="box"><input placeholder="Search assignments, notes, files, events…" aria-label="Search"><div class="res"></div></div>'; document.body.appendChild(w);
    var inp = $('input', w), res = $('.res', w), sel = 0, items = [];
    function close() { w.remove(); }
    function run() {
      var q = inp.value.trim().toLowerCase(); items = [];
      if (q) {
        S.tasks.forEach(function (t) { if ((t.title + ' ' + t.notes).toLowerCase().indexOf(q) >= 0) items.push(['flag', t.title, sname(t.subject) + (t.due ? ' · ' + fdate(pdt(t.due)) : ''), function () { openTask(t.id); }, scol(t.subject)]); t.files.forEach(function (f) { if (f.name.toLowerCase().indexOf(q) >= 0) items.push(['clip', f.name, t.title, function () { openTask(t.id); }, scol(t.subject)]); }); });
        S.notes.forEach(function (n) { if (n.text.toLowerCase().indexOf(q) >= 0) items.push(['note', n.text.slice(0, 70), sname(n.subject) + ' · ' + fdate(pday(n.date)), function () { openSubject(n.subject); }, scol(n.subject)]); });
        S.events.forEach(function (e) { if (e.title.toLowerCase().indexOf(q) >= 0) items.push(['cal', e.title, fdate(pday(e.date)), function () { openEvent(e.id); }, e.color]); });
        S.subjects.forEach(function (s) { if ((s.name + ' ' + s.short).toLowerCase().indexOf(q) >= 0) items.push(['book', s.name, 'Subject', function () { openSubject(s.id); }, s.color]); });
      }
      sel = 0; res.innerHTML = items.slice(0, 30).map(function (it, i) { return '<div class="r' + (i === sel ? ' sel' : '') + '" data-i="' + i + '" style="color:' + it[4] + '">' + ic(it[0]) + '<span style="color:var(--ink)">' + esc(it[1]) + '</span><small>' + esc(it[2]) + '</small></div>'; }).join('') || (q ? '<div class="r muted">No matches</div>' : '<div class="r muted">Type to search</div>');
      $$('[data-i]', res).forEach(function (r) { r.onclick = function () { close(); items[+r.getAttribute('data-i')][3](); }; });
    }
    inp.oninput = run; run(); inp.focus();
    w.onclick = function (e) { if (e.target === w) close(); };
    inp.onkeydown = function (e) { if (e.key === 'Escape') close(); if (e.key === 'Enter' && items[sel]) { close(); items[sel][3](); } if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(items.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); $$('.r', res).forEach(function (r, i) { r.classList.toggle('sel', i === sel); }); } };
  }

  /* ------------------------------------------------------------ global wiring */
  function applyTheme() { document.documentElement.setAttribute('data-theme', S.settings.theme); $('#theme-btn').innerHTML = ic(S.settings.theme === 'dark' ? 'sun' : 'moon'); var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = S.settings.theme === 'dark' ? '#0B0E1E' : '#F4F5FB'; }
  $('#theme-btn').onclick = function () { S.settings.theme = S.settings.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
  $('#search-btn').innerHTML = ic('search'); $('#search-btn').onclick = openSearch;
  var fab = $('#fab'), fm = $('#fabmenu');
  fab.innerHTML = ic('plus');
  fm.innerHTML = [['task', 'flag', 'Assignment', 'N'], ['note', 'note', 'Note', 'Q'], ['event', 'cal', 'Event', 'E']].map(function (x) { return '<button type="button" data-add="' + x[0] + '">' + ic(x[1]) + x[2] + ' <kbd>' + x[3] + '</kbd></button>'; }).join('');
  fab.onclick = function () { var o = fm.hidden; fm.hidden = !o; fab.classList.toggle('open', o); };
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#fab,#fabmenu') && !fm.hidden) { fm.hidden = true; fab.classList.remove('open'); }
    var a = e.target.closest('[data-add]'); if (a) { fm.hidden = true; fab.classList.remove('open'); var k = a.getAttribute('data-add'); if (k === 'task') openTask(null, view === 'tasks' && tf.subject && tf.subject !== 'all' ? { subject: tf.subject } : null); else if (k === 'note') openNote(); else openEvent(null); return; }
    var ck = e.target.closest('[data-ck]'); if (ck) { e.stopPropagation(); var t = task(ck.getAttribute('data-ck')); if (t) { setStatus(t, t.status === 'done' ? 'todo' : 'done'); if (!$('#sheet').hidden) closeSheet(); } return; }
    var tk = e.target.closest('[data-task]'); if (tk && !e.target.closest('.ib')) { if (!$('#sheet').hidden) closeSheet(); openTask(tk.getAttribute('data-task')); return; }
    var cl = e.target.closest('[data-class]'); if (cl) { openClass(cl.getAttribute('data-class')); return; }
    var ev = e.target.closest('[data-event]'); if (ev) { openEvent(ev.getAttribute('data-event').split(':')[1]); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('#sheet').hidden) { closeSheet(); return; }
    var tg = (e.target.tagName || '').toLowerCase(); if (tg === 'input' || tg === 'textarea' || tg === 'select' || e.metaKey || e.ctrlKey || e.altKey || !$('#sheet').hidden || $('.search')) return;
    var k = e.key.toLowerCase();
    if (k === 'n') { e.preventDefault(); openTask(null); } else if (k === 'q') { e.preventDefault(); openNote(); } else if (k === 'e') { e.preventDefault(); openEvent(null); } else if (k === '/') { e.preventDefault(); openSearch(); }
    else if (k === 't') go('today'); else if (k === 'c') go('calendar'); else if (k === 'a') go('tasks'); else if (k === 's') go('subjects');
    else if (view === 'calendar' && (k === 'arrowleft' || k === 'arrowright')) { $('[data-cn="' + (k === 'arrowleft' ? -1 : 1) + '"]').click(); }
  });
  /* keep the Today view live: countdown ring, now line, reminders */
  setInterval(function () { checkReminders(); if ($('#sheet').hidden && !document.hidden && (view === 'today' || view === 'calendar') && !(document.activeElement && /input|textarea|select/i.test(document.activeElement.tagName))) render(); }, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { checkReminders(); if ($('#sheet').hidden) render(); } });
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('sw.js').then(function (r) { reg = r; return navigator.serviceWorker.ready; }).then(function (r) { reg = r; }).catch(function () {});
  applyTheme(); route(); checkReminders();
  if (!localStorage.getItem(KEY)) { save(); setTimeout(function () { toast('Your timetable is loaded. Check the class times in Settings.', 'spark', null, function () { go('settings'); }, 'Open'); }, 900); }
})();
