/* Home page: rotating roles, live class countdown, focus summary, mini garden, carousel, word of the day. */
(function () {
  'use strict';
  function ready(fn) { if (window.Clive && Clive.booted) fn(); else document.addEventListener('clive:ready', fn); }
  ready(function () {
    var C = window.Clive, t = C.t, $ = C.$;

    /* rotating roles */
    var role = $('#role'), ri = 0;
    function setRole() { role.textContent = t('h.role.' + ri); }
    setRole();
    if (document.documentElement.getAttribute('data-motion') !== 'reduced') {
      setInterval(function () {
        role.classList.add('out');
        setTimeout(function () { ri = (ri + 1) % 5; setRole(); role.classList.remove('out'); }, 450);
      }, 3600);
    }

    /* next class */
    function nextClass() {
      var n = C.nextClass(); if (!n) return;
      var lang = C.S.lang, big = $('#nc-big'), sub = $('#nc-sub'), chip = $('#nc-chip'), lab = $('#nc-label');
      chip.textContent = n.c.name; chip.style.setProperty('--c', n.c.c);
      if (n.live) {
        lab.textContent = t('h.nc.live'); big.textContent = n.c.start;
        sub.textContent = C.fmt(t('h.nc.subl'), { group: n.c.name, time: n.c.start });
      } else {
        lab.textContent = t('h.nc.l', 'Next English class');
        big.textContent = C.fmt(t('h.nc.in'), { t: C.dur(n.inMin) });
        var nowDow = C.tash().getUTCDay(), day = n.day === nowDow ? t('h.nc.today') : (n.day === (nowDow + 1) % 7 ? t('h.nc.tomorrow') : C.DAYS[lang][n.day]);
        sub.textContent = C.fmt(t('h.nc.sub'), { group: n.c.name, day: day, time: n.c.start });
      }
    }
    nextClass(); setInterval(nextClass, 30000);

    /* focus card */
    function focus() {
      var v = C.vaqt(); if (!v || !v.sessions) return;
      $('#fc-big').innerHTML = v.today + '<small style="font-size:.4em;color:var(--sub)"> ' + C.esc(t('u.min')) + '</small>';
      $('#fc-sub').textContent = C.fmt(t('h.fc.has'), { plants: v.plants, streak: v.streak });
    }
    focus();

    /* mini garden: the visitor's own plants if they have any, otherwise an illustration */
    var mg = $('#mini-garden');
    if (mg && window.Garden) {
      var items = [], data = C.load('clive.vaqt.v1', null);
      if (data && data.sessions && data.sessions.length) {
        data.sessions.filter(function (s) { return s.mode !== 'manual' && s.mode !== 'break'; }).slice(-18).forEach(function (s) { items.push({ species: s.species || 'lola', withered: s.status === 'withered', golden: !!s.golden }); });
      }
      if (items.length < 3) items = ['chinor', 'lola', 'anor', 'paxta', 'orik', 'lola', 'archa', 'uzum', 'tut', 'lola', 'paxta', 'anor', 'orik', 'lola'].map(function (s) { return { species: s }; });
      mg.innerHTML = Garden.scene(items, { size: 5, animate: true, plantScale: .66 });
    }

    /* carousel */
    var car = $('#car');
    C.$$('[data-car]').forEach(function (b) {
      b.addEventListener('click', function () { var w = car.firstElementChild ? car.firstElementChild.getBoundingClientRect().width + 20 : 400; car.scrollBy({ left: w * +b.getAttribute('data-car'), behavior: 'smooth' }); });
    });
    car.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); car.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 420, behavior: 'smooth' }); } });

    /* word of the day */
    var W = [
      ['time', 'vaqt', 'время', 'die Zeit'], ['hello', 'salom', 'привет', 'hallo'], ['book', 'kitob', 'книга', 'das Buch'], ['teacher', 'o‘qituvchi', 'учитель', 'der Lehrer'],
      ['friend', 'do‘st', 'друг', 'der Freund'], ['water', 'suv', 'вода', 'das Wasser'], ['bread', 'non', 'хлеб', 'das Brot'], ['tea', 'choy', 'чай', 'der Tee'],
      ['city', 'shahar', 'город', 'die Stadt'], ['morning', 'ertalab', 'утро', 'der Morgen'], ['family', 'oila', 'семья', 'die Familie'], ['school', 'maktab', 'школа', 'die Schule'],
      ['garden', 'bog‘', 'сад', 'der Garten'], ['star', 'yulduz', 'звезда', 'der Stern'], ['sun', 'quyosh', 'солнце', 'die Sonne'], ['moon', 'oy', 'луна', 'der Mond'],
      ['apple', 'olma', 'яблоко', 'der Apfel'], ['house', 'uy', 'дом', 'das Haus'], ['work', 'ish', 'работа', 'die Arbeit'], ['dream', 'orzu', 'мечта', 'der Traum'],
      ['way', 'yo‘l', 'путь', 'der Weg'], ['heart', 'yurak', 'сердце', 'das Herz'], ['music', 'musiqa', 'музыка', 'die Musik'], ['world', 'dunyo', 'мир', 'die Welt'],
      ['question', 'savol', 'вопрос', 'die Frage'], ['answer', 'javob', 'ответ', 'die Antwort'], ['today', 'bugun', 'сегодня', 'heute'], ['tomorrow', 'ertaga', 'завтра', 'morgen'],
      ['beautiful', 'chiroyli', 'красивый', 'schön'], ['to learn', 'o‘rganmoq', 'учить', 'lernen'], ['pomegranate', 'anor', 'гранат', 'der Granatapfel'], ['tulip', 'lola', 'тюльпан', 'die Tulpe'],
      ['window', 'deraza', 'окно', 'das Fenster'], ['light', 'yorug‘lik', 'свет', 'das Licht']
    ];
    var start = new Date(new Date().getFullYear(), 0, 0), doy = Math.floor((Date.now() - start) / 864e5), wi = doy % W.length;
    var voices = ('speechSynthesis' in window);
    function say(text, lang) { try { var u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }
    function renderWord() {
      var w = W[wi], langs = [['EN', w[0], 'en-GB'], ['UZ', w[1], null], ['RU', w[2], 'ru-RU'], ['DE', w[3], 'de-DE']];
      $('#wd-en').textContent = w[0];
      $('#wd-tr').innerHTML = langs.map(function (l) {
        return '<div><small>' + l[0] + '</small><b lang="' + l[0].toLowerCase() + '">' + C.esc(l[1]) + '</b>' + (voices && l[2] ? '<button class="iconbtn" data-say="' + C.esc(l[1]) + '" data-l="' + l[2] + '" aria-label="' + C.esc(t('w.listen')) + ' ' + C.esc(l[1]) + '">' + C.icon('volume') + '</button>' : '') + '</div>';
      }).join('');
      $('#wd-save span').textContent = t('w.save');
    }
    $('#wd-tr').addEventListener('click', function (e) { var b = e.target.closest('[data-say]'); if (b) say(b.getAttribute('data-say'), b.getAttribute('data-l')); });
    $('#wd-next').addEventListener('click', function () { wi = (wi + 1) % W.length; renderWord(); });
    $('#wd-save').addEventListener('click', function () {
      var list = C.load('clive.words', []), w = W[wi];
      if (!list.some(function (x) { return x[0] === w[0]; })) { list.unshift(w); C.save('clive.words', list.slice(0, 200)); }
      C.toast(t('w.saved'));
    });
    renderWord();

    document.addEventListener('clive:lang', function () { setRole(); nextClass(); focus(); renderWord(); });
  });
})();
