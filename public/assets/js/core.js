/* Clive core: settings, languages, navigation, command palette, helpers. No dependencies. */
(function () {
  'use strict';
  var root = document.documentElement;
  var ROOT = root.getAttribute('data-root') || '';
  var KEY = 'clive.settings';

  /* ---------- storage ---------- */
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  var S = load(KEY, {});
  if (!S.lang) {
    var nl = (navigator.language || 'en').slice(0, 2).toLowerCase();
    S.lang = (nl === 'uz' || nl === 'ru') ? nl : 'en';
  }

  /* ---------- i18n ---------- */
  var D = window.I18N || { en: {}, uz: {}, ru: {} };
  function t(k, fb) {
    var L = D[S.lang] || {};
    if (L[k] != null) return L[k];
    if (D.en && D.en[k] != null) return D.en[k];
    return fb != null ? fb : k;
  }
  function fmt(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
  function applyLang() {
    var lang = S.lang;
    root.lang = lang; root.setAttribute('data-lang', lang);
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], k = el.getAttribute('data-i18n'), html = el.hasAttribute('data-html');
      if (el._en == null) el._en = html ? el.innerHTML : el.textContent;
      var v = lang === 'en' ? el._en : ((D[lang] && D[lang][k] != null) ? D[lang][k] : el._en);
      if (html) el.innerHTML = v; else el.textContent = v;
    }
    var ats = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < ats.length; j++) {
      var a = ats[j]; a._ena = a._ena || {};
      a.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length < 2) return;
        var at = p[0].trim(), key = p[1].trim();
        if (a._ena[at] == null) a._ena[at] = a.getAttribute(at) || '';
        var val = lang === 'en' ? a._ena[at] : ((D[lang] && D[lang][key] != null) ? D[lang][key] : a._ena[at]);
        a.setAttribute(at, val);
      });
    }
    var tk = document.querySelector('meta[name=page-title-key]');
    if (tk && lang !== 'en' && D[lang] && D[lang][tk.content]) document.title = D[lang][tk.content] + ' · Clive';
    else if (tk && root._title) document.title = root._title;
    var lb = document.querySelectorAll('[data-setlang]');
    for (var m = 0; m < lb.length; m++) lb[m].setAttribute('aria-pressed', String(lb[m].getAttribute('data-setlang') === lang));
    document.dispatchEvent(new CustomEvent('clive:lang', { detail: lang }));
  }
  root._title = document.title;

  /* ---------- settings ---------- */
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: light)') : null;
  function applySettings() {
    var th = S.theme || root.getAttribute('data-theme') || 'dark';
    if (th === 'auto') th = mq && mq.matches ? 'light' : 'dark';
    root.setAttribute('data-theme', th);
    if (S.accent && S.accent !== 'blue') root.setAttribute('data-accent', S.accent); else root.removeAttribute('data-accent');
    var reduced = S.motion === 'reduced' || (!S.motion && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) root.setAttribute('data-motion', 'reduced'); else root.removeAttribute('data-motion');
    root.style.setProperty('--fs', S.fs || 1);
    var bs = document.querySelectorAll('[data-set]');
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i], kv = b.getAttribute('data-set').split('=');
      var cur = S[kv[0]] != null ? String(S[kv[0]]) : ({ theme: 'dark', accent: 'blue', motion: 'full', fs: '1' })[kv[0]];
      b.setAttribute('aria-pressed', String(cur === kv[1]));
    }
    document.dispatchEvent(new CustomEvent('clive:settings', { detail: S }));
  }
  function set(k, v) { S[k] = v; save(KEY, S); if (k === 'lang') applyLang(); applySettings(); }
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (S.theme === 'auto') applySettings(); });

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2400);
  }
  function copy(text, msg) {
    function done() { toast(msg || t('ui.copied', 'Copied')); }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fallback); return; }
    } catch (e) {}
    fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast(text); }
      document.body.removeChild(ta);
    }
  }
  /* Tashkent is UTC+5 all year (no daylight saving). */
  function tash(ms) { return new Date((ms == null ? Date.now() : ms) + 5 * 3600e3); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hm(d) { return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()); }

  /* class schedule (Tashkent time) */
  var CLASSES = [
    { id: 'elem', name: 'Elementary', days: [1, 4, 5], start: '14:00', end: '15:30', c: 'var(--turq)' },
    { id: 'beg', name: 'Beginner', days: [1, 4], start: '15:30', end: null, c: 'var(--gold)' }
  ];
  function mins(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function nextClass() {
    var now = tash(), nowMin = now.getUTCHours() * 60 + now.getUTCMinutes(), dow = now.getUTCDay(), best = null;
    for (var d = 0; d < 8; d++) {
      var day = (dow + d) % 7;
      CLASSES.forEach(function (c) {
        if (c.days.indexOf(day) < 0) return;
        var st = mins(c.start), en = c.end ? mins(c.end) : st + 60;
        var startsIn = d * 1440 + st - nowMin;
        var live = d === 0 && nowMin >= st && nowMin < en;
        if (startsIn < 0 && !live) return;
        var cand = { c: c, inMin: startsIn, live: live, day: day };
        if (live) { if (!best || !best.live || startsIn > best.inMin) best = cand; return; }
        if (!best || (!best.live && startsIn < best.inMin)) best = cand;
      });
    }
    return best;
  }
  var DAYS = { en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'], ru: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'] };
  var DSHORT = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], uz: ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'], ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] };
  function dur(m) {
    var h = Math.floor(m / 60), r = m % 60;
    if (S.lang === 'uz') return (h ? h + ' soat ' : '') + (r || !h ? r + ' daq' : '');
    if (S.lang === 'ru') return (h ? h + ' ч ' : '') + (r || !h ? r + ' мин' : '');
    return (h ? h + 'h ' : '') + (r || !h ? r + 'm' : '');
  }

  /* Vaqt data summary (shared with the focus app) */
  function vaqt() {
    var v = load('clive.vaqt.v1', null);
    if (!v || !v.sessions) return null;
    var dayKey = function (ms) { var d = new Date(ms); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
    var today = dayKey(Date.now()), todayMin = 0, total = 0, plants = 0, days = {};
    v.sessions.forEach(function (s) {
      if (s.mode === 'break') return;
      var m = Math.round((s.actual || 0) / 60);
      if (s.status !== 'withered') { total += m; days[dayKey(s.start)] = 1; if (s.mode !== 'manual') plants++; }
      if (dayKey(s.start) === today && s.status !== 'withered') todayMin += m;
    });
    var streak = 0, d = new Date();
    if (!days[dayKey(d.getTime())]) d.setDate(d.getDate() - 1);
    while (days[dayKey(d.getTime())]) { streak++; d.setDate(d.getDate() - 1); }
    return { today: todayMin, total: total, plants: plants, streak: streak, coins: v.coins || 0, sessions: v.sessions.length };
  }

  /* reachability: a page that answers a no-cors request is up; errors mean we can't tell from here */
  function ping(url, ms) {
    return new Promise(function (res) {
      var done = false, tm = setTimeout(function () { if (!done) { done = true; res('unknown'); } }, ms || 7000);
      try {
        fetch(url, { mode: 'no-cors', cache: 'no-store' }).then(function () { if (!done) { done = true; clearTimeout(tm); res('up'); } }, function () { if (!done) { done = true; clearTimeout(tm); res('unknown'); } });
      } catch (e) { clearTimeout(tm); res('unknown'); }
    });
  }

  /* ---------- UI wiring ---------- */
  function navInit() {
    var nav = $('.nav');
    if (nav) {
      var onS = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
      onS(); window.addEventListener('scroll', onS, { passive: true });
    }
    var sheet = $('#sheet');
    $$('[data-open=sheet]').forEach(function (b) { b.addEventListener('click', function () { sheet.classList.add('open'); document.body.style.overflow = 'hidden'; }); });
    $$('[data-close=sheet]').forEach(function (b) { b.addEventListener('click', function () { if (sheet) sheet.classList.remove('open'); document.body.style.overflow = ''; }); });
    var drawer = $('#drawer'), scrim = $('#scrim');
    function openD() { if (!drawer) return; drawer.classList.add('open'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); var f = drawer.querySelector('button'); if (f) f.focus(); }
    function closeD() { if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); } if (scrim) scrim.classList.remove('on'); closeK(); }
    $$('[data-open=drawer]').forEach(function (b) { b.addEventListener('click', function () { if (sheet) sheet.classList.remove('open'); document.body.style.overflow = ''; openD(); }); });
    $$('[data-close=drawer]').forEach(function (b) { b.addEventListener('click', closeD); });
    if (scrim) scrim.addEventListener('click', closeD);
    $$('[data-setlang]').forEach(function (b) { b.addEventListener('click', function () { set('lang', b.getAttribute('data-setlang')); }); });
    $$('[data-set]').forEach(function (b) {
      b.addEventListener('click', function () { var kv = b.getAttribute('data-set').split('='); set(kv[0], kv[0] === 'fs' ? +kv[1] : kv[1]); });
    });
    $$('[data-copy]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); copy(b.getAttribute('data-copy'), b.getAttribute('data-copy-msg') ? t(b.getAttribute('data-copy-msg')) : null); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeD(); if (sheet) { sheet.classList.remove('open'); document.body.style.overflow = ''; } } });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    /* live Tashkent clock */
    var clocks = $$('[data-tash-clock]');
    if (clocks.length) { var tick = function () { var s = hm(tash()); clocks.forEach(function (c) { c.textContent = s; }); }; tick(); setInterval(tick, 15000); }
    cmdkInit(closeD, scrim);
  }

  /* glow follows pointer on cards */
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.glow');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  function revealInit() {
    /* stagger cards inside the same grid */
    $$('.grid').forEach(function (g) { var k = 0; Array.prototype.forEach.call(g.children, function (c) { if (c.hasAttribute('data-reveal') && !+c.getAttribute('data-reveal')) { c.setAttribute('data-reveal', String(Math.min(k, 6) * 70)); } k++; }); });
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || root.getAttribute('data-motion') === 'reduced') { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { var d = +(x.target.getAttribute('data-reveal') || 0); setTimeout(function () { x.target.classList.add('in'); countUp(x.target); }, d); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { e.classList.add('in'); }); }, 4000);
  }

  /* numbers count up the first time they appear */
  function countUp(scope) {
    var list = scope.matches && scope.matches('.kpi b') ? [scope] : $$('.kpi b', scope);
    list.forEach(function (b) {
      if (b._counted) return; b._counted = true;
      var txt = b.textContent.trim(); if (!/^\d{1,6}$/.test(txt) || root.getAttribute('data-motion') === 'reduced') return;
      var to = +txt, t0 = performance.now(), dur = 1100;
      (function step(now) { var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); b.textContent = Math.round(to * e); if (p < 1) requestAnimationFrame(step); })(t0);
    });
  }

  /* scroll progress, spotlight, back to top */
  function chromeInit() {
    var nav = $('.nav'), tt = document.createElement('button');
    tt.className = 'totop'; tt.setAttribute('aria-label', t('a.top', 'Back to top')); tt.innerHTML = icon('arrow');
    tt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: root.getAttribute('data-motion') === 'reduced' ? 'auto' : 'smooth' }); });
    if (nav) document.body.appendChild(tt);
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, scrollY / h) : 0;
        if (nav) nav.style.setProperty('--sp', p.toFixed(4));
        tt.classList.toggle('on', scrollY > 1200);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    if (window.matchMedia && matchMedia('(hover:hover)').matches && !document.querySelector('.spot')) {
      var sp = document.createElement('div'); sp.className = 'spot'; sp.setAttribute('aria-hidden', 'true'); document.body.insertBefore(sp, document.body.firstChild);
      document.addEventListener('pointermove', function (e) { sp.style.setProperty('--px', e.clientX + 'px'); sp.style.setProperty('--py', e.clientY + 'px'); }, { passive: true });
    }
  }

  /* ---------- command palette ---------- */
  var K, kList, kInput, kItems = [], kSel = 0;
  function closeK() { if (K) { K.classList.remove('open'); var sc = $('#scrim'), dr = $('#drawer'); if (sc && !(dr && dr.classList.contains('open'))) sc.classList.remove('on'); } }
  function cmdkInit() {
    K = $('#cmdk'); if (!K) return;
    kList = $('ul', K); kInput = $('input', K);
    function items() {
      var P = function (k, en, href, ic, c, grp) { return { t: t(k, en), href: href, ic: ic, c: c, g: grp }; };
      var r = ROOT;
      return [
        P('nav.home', 'Home', r + 'index.html', 'home', null, 'pages'),
        P('nav.orbit', 'Orbit', r + 'ecosystem.html', 'orbit', null, 'pages'),
        P('nav.work', 'Work', r + 'work.html', 'layers', null, 'pages'),
        P('nav.learn', 'Learn', r + 'learn.html', 'cap', null, 'pages'),
        P('nav.journal', 'Journal', r + 'journal.html', 'feather', null, 'pages'),
        P('nav.shop', 'Shop', r + 'shop.html', 'bag', null, 'pages'),
        P('nav.about', 'About', r + 'about.html', 'user', null, 'pages'),
        P('nav.contact', 'Contact', r + 'contact.html', 'send', null, 'pages'),
        P('nav.me', 'Clive ID', r + 'me.html', 'id', null, 'pages'),
        P('nav.brand', 'Brand kit', r + 'brand.html', 'palette', null, 'pages'),
        P('nav.links', 'Links', r + 'links.html', 'link', null, 'pages'),
        { t: 'Vaqt', s: t('pd.vaqt.tag', 'Focus garden & time tracker'), href: r + 'vaqt/index.html', ic: 'leaf', c: 'var(--green)', g: 'products' },
        { t: 'ClivEdu', s: t('pd.clivedu.tag', 'English among the stars'), href: r + 'products/clivedu.html', ic: 'star', c: 'var(--blue)', g: 'products' },
        { t: 'ClivEdu Class', s: t('pd.class.tag', 'The live classroom'), href: r + 'products/class.html', ic: 'cap', c: 'var(--turq)', g: 'products' },
        { t: 'Sprachwerk', s: t('pd.sprachwerk.tag', 'German, engineered'), href: r + 'products/sprachwerk.html', ic: 'globe', c: 'var(--gold)', g: 'products' },
        { t: 'Vault Studio', s: t('pd.vault.tag', 'Video studio for WonderVault'), href: r + 'products/vault-studio.html', ic: 'video', c: 'var(--amber)', g: 'products' },
        { t: 'Reja', s: t('pd.reja.tag', 'Study & life planner'), href: r + 'reja/', ic: 'calendar', c: 'var(--violet)', g: 'products' },
        { t: t('cmd.focus25', 'Start a 25-minute focus'), href: r + 'vaqt/index.html#focus', ic: 'timer', c: 'var(--green)', g: 'actions', act: function () { try { sessionStorage.setItem('vaqt.autostart', '25'); } catch (e) {} } },
        { t: t('cmd.theme', 'Switch day / night'), ic: 'moon', g: 'actions', act: function () { set('theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); } },
        { t: 'English', ic: 'globe', g: 'actions', act: function () { set('lang', 'en'); } },
        { t: 'O‘zbekcha', ic: 'globe', g: 'actions', act: function () { set('lang', 'uz'); } },
        { t: 'Русский', ic: 'globe', g: 'actions', act: function () { set('lang', 'ru'); } },
        { t: t('cmd.email', 'Copy email address'), s: 'imonkulovclive@gmail.com', ic: 'mail', g: 'actions', act: function () { copy('imonkulovclive@gmail.com'); } },
        { t: 'Telegram @clive077', href: 'https://t.me/clive077', ic: 'send', c: 'var(--turq)', g: 'actions', ext: 1 }
      ];
    }
    var GN = function (g) { return t('cmd.g.' + g, { pages: 'Pages', products: 'Products', actions: 'Actions' }[g]); };
    function render() {
      var q = kInput.value.trim().toLowerCase();
      kItems = items().filter(function (i) { return !q || (i.t + ' ' + (i.s || '')).toLowerCase().indexOf(q) >= 0; });
      if (kSel >= kItems.length) kSel = 0;
      var html = '', last = '';
      kItems.forEach(function (i, n) {
        if (i.g !== last) { html += '<li class="grp" role="presentation">' + esc(GN(i.g)) + '</li>'; last = i.g; }
        var inner = '<span class="ci"' + (i.c ? ' style="--c:' + i.c + '"' : '') + '>' + icon(i.ic) + '</span><span>' + esc(i.t) + (i.s ? '<small>' + esc(i.s) + '</small>' : '') + '</span>';
        html += '<li role="option">' + (i.href && !i.act ? '<a data-n="' + n + '" href="' + esc(i.href) + '"' + (i.ext ? ' target="_blank" rel="noopener"' : '') + ' aria-selected="' + (n === kSel) + '">' + inner + '</a>' : '<button data-n="' + n + '" aria-selected="' + (n === kSel) + '">' + inner + '</button>') + '</li>';
      });
      kList.innerHTML = html || '<li class="grp">' + esc(t('cmd.none', 'Nothing found')) + '</li>';
    }
    function run(n) {
      var i = kItems[n]; if (!i) return;
      if (i.act) { i.act(); closeK(); if (i.href) location.href = i.href; return; }
      if (i.ext) window.open(i.href, '_blank', 'noopener'); else location.href = i.href;
    }
    function open() { K.classList.add('open'); $('#scrim').classList.add('on'); kInput.value = ''; kSel = 0; render(); setTimeout(function () { kInput.focus(); }, 30); }
    $$('[data-open=cmdk]').forEach(function (b) { b.addEventListener('click', open); });
    kInput.addEventListener('input', function () { kSel = 0; render(); });
    kList.addEventListener('click', function (e) { var b = e.target.closest('[data-n]'); if (b && b.tagName === 'BUTTON') run(+b.getAttribute('data-n')); });
    kInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { kSel = Math.min(kItems.length - 1, kSel + 1); render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { kSel = Math.max(0, kSel - 1); render(); e.preventDefault(); }
      else if (e.key === 'Enter') { run(kSel); e.preventDefault(); }
    });
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); K.classList.contains('open') ? closeK() : open(); }
      else if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && !e.target.isContentEditable) { e.preventDefault(); open(); }
      else if (e.key === 'Escape') closeK();
    });
    document.addEventListener('clive:lang', function () { if (K.classList.contains('open')) render(); });
  }

  /* icons used by script-rendered UI (subset of the page sprite) */
  function icon(n) { return '<svg aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }

  /* easter egg: type "clive" anywhere */
  var egg = '';
  document.addEventListener('keydown', function (e) {
    if (!e.key || e.key.length !== 1) return;
    egg = (egg + e.key.toLowerCase()).slice(-5);
    if (egg === 'clive') starBurst();
  });
  function starBurst() {
    if (root.getAttribute('data-motion') === 'reduced') { toast('★ Clive, just Clive'); return; }
    var cols = ['#5B7CFF', '#22CFC6', '#F5C04A', '#3DDC97', '#FF9B3D', '#FF5C7A', '#9B7BFF'];
    for (var i = 0; i < 36; i++) {
      (function (i) {
        var s = document.createElement('div'); var sz = 10 + Math.random() * 18;
        s.style.cssText = 'position:fixed;z-index:130;left:50%;top:50%;width:' + sz + 'px;height:' + sz + 'px;pointer-events:none;background:' + cols[i % cols.length] + ';clip-path:polygon(50% 0,61% 26%,85% 15%,74% 39%,100% 50%,74% 61%,85% 85%,61% 74%,50% 100%,39% 74%,15% 85%,26% 61%,0 50%,26% 39%,15% 15%,39% 26%);transition:transform 1.4s cubic-bezier(.1,.8,.2,1),opacity 1.4s';
        document.body.appendChild(s);
        var a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 380;
        requestAnimationFrame(function () { requestAnimationFrame(function () { s.style.transform = 'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px) rotate(' + (Math.random() * 360) + 'deg)'; s.style.opacity = '0'; }); });
        setTimeout(function () { s.remove(); }, 1500);
      })(i);
    }
    toast('★ Clive, just Clive');
  }

  /* ---------- boot ---------- */
  window.Clive = { t: t, fmt: fmt, set: set, S: S, toast: toast, copy: copy, esc: esc, tash: tash, hm: hm, pad: pad, nextClass: nextClass, CLASSES: CLASSES, DAYS: DAYS, DSHORT: DSHORT, dur: dur, vaqt: vaqt, ping: ping, load: load, save: save, icon: icon, root: ROOT, $: $, $$: $$, starBurst: starBurst };
  function boot() { window.Clive.booted = true; applySettings(); applyLang(); navInit(); revealInit(); chromeInit(); document.dispatchEvent(new CustomEvent('clive:ready')); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
