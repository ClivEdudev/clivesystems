/* c-ID: the one Clive sign-in. Telegram sign-in through @clivedubot, the galaxy ID card,
   profile picture (anime, realistic or your own photo) and progress from clivedu.me.
   Talks to the ClivEdu API on clivedu.me, which only answers Clive websites. */
(function () {
  'use strict';
  var S = window.CID_SYNC || {};
  var API = S.api || 'https://clivedu.me/api';
  var AUTH = 'clive.cid';
  var L = {
    en: {
      specimen: 'Sample', name: 'Name', no: 'c-ID No.', issued: 'Issued', since: 'Member since', group: 'Group', rank: 'Rank',
      pts: 'points', streak: 'day streak', lessons: 'lessons', focus: 'focus min', citizen: 'Orbit citizen card',
      yourname: 'Your name', ga: 'Elementary', gb: 'Beginner', gnone: 'Explorer',
      get: 'Get your c-ID', getp: 'One ID for everything Clive makes. Sign in once with Telegram through @clivedubot and your number, picture and progress follow you to every device. One Telegram account, one c-ID.',
      students: 'Already in my class on clivedu.me? You already have a c-ID with your points inside. Just sign in.',
      signin: 'Sign in with Telegram', opening: 'Getting your sign-in link…', open: 'Open @clivedubot',
      steps: ['Tap <b>Open @clivedubot</b>', 'Press <b>START</b> in Telegram', 'Tap <b>Yes, it’s me</b>', 'Come back here, it opens by itself'],
      waiting: 'Waiting for Telegram…', cancel: 'Cancel', expired: 'The link expired. Try again.', refused: 'Sign-in was cancelled in Telegram.',
      fail: 'Couldn’t reach the c-ID server. Check your internet and try again.', many: 'Too many tries. Wait 10 minutes.',
      hi: 'Welcome back', pic: 'Change picture', editname: 'Edit name', flip: 'Turn the card', out: 'Sign out', outall: 'Sign out on every device',
      outallq: 'Sign out on every phone and computer where this c-ID is open?', yes: 'Yes, sign out everywhere', keep: 'Keep them',
      synced: 'Your Vaqt garden, Reja planner, words and settings save to this c‑ID.', syncnow: 'Saved', fromclass: 'English points come from clivedu.me',
      pick: 'Your picture', girls: 'Girls', boys: 'Boys', mine: 'My photo', upload: 'Choose a photo', uploadp: 'Square crop, saved small. Only you can see your photo; it is never public.',
      save: 'Save', saving: 'Saving…', remove: 'Remove photo', toobig: 'That photo could not be used. Try another one.', saved: 'Saved',
      newname: 'Your name on the card', namesave: 'Save name', realnote: 'These faces are AI-generated. None of them is a real person.',
      back: 'Back of the card', constellation: 'Your number as a constellation', belongs: 'This card belongs to', worksonly: 'It works only while you are signed in with Telegram.',
      daily: 'daily challenges', games: 'games played', best: 'best game', plants: 'plants grown', quizzes: 'quizzes', copy: 'Copy number', copied: 'c-ID number copied',
      rk: ['Stardust', 'Comet', 'Moon', 'Planet', 'Star', 'Nova', 'Galaxy']
    },
    uz: {
      specimen: 'Namuna', name: 'Ism', no: 'c-ID raqami', issued: 'Berilgan', since: 'A’zo', group: 'Guruh', rank: 'Daraja',
      pts: 'ball', streak: 'kun ketma-ket', lessons: 'dars', focus: 'fokus daq', citizen: 'Orbita fuqarosi kartasi',
      yourname: 'Ismingiz', ga: 'Elementary', gb: 'Beginner', gnone: 'Kashfiyotchi',
      get: 'c-ID oling', getp: 'Clive yaratgan hamma narsa uchun bitta ID. @clivedubot orqali Telegram bilan bir marta kiring: raqamingiz, rasmingiz va natijalaringiz har bir qurilmada siz bilan. Bitta Telegram hisob, bitta c-ID.',
      students: 'clivedu.me’dagi sinfimdamisiz? Sizda allaqachon ballaringiz bilan c-ID bor. Shunchaki kiring.',
      signin: 'Telegram orqali kirish', opening: 'Kirish havolasi tayyorlanmoqda…', open: '@clivedubot’ni ochish',
      steps: ['<b>@clivedubot’ni ochish</b>ni bosing', 'Telegramda <b>START</b>ni bosing', '<b>Ha, menman</b>ni bosing', 'Shu yerga qayting, o‘zi ochiladi'],
      waiting: 'Telegram kutilmoqda…', cancel: 'Bekor qilish', expired: 'Havola eskirdi. Qaytadan urinib ko‘ring.', refused: 'Kirish Telegramda bekor qilindi.',
      fail: 'c-ID serveriga ulanib bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.', many: 'Juda ko‘p urinish. 10 daqiqa kuting.',
      hi: 'Qaytganingiz bilan', pic: 'Rasmni o‘zgartirish', editname: 'Ismni o‘zgartirish', flip: 'Kartani aylantirish', out: 'Chiqish', outall: 'Barcha qurilmalardan chiqish',
      outallq: 'Bu c-ID ochiq turgan barcha telefon va kompyuterlardan chiqilsinmi?', yes: 'Ha, hammasidan chiqish', keep: 'Qoldirish',
      synced: 'Vaqt bog‘ingiz, Reja rejalashtirgichi, so‘zlar va sozlamalar shu c‑ID’ga saqlanadi.', syncnow: 'Saqlandi', fromclass: 'Ingliz tili ballari clivedu.me’dan',
      pick: 'Rasmingiz', girls: 'Qizlar', boys: 'O‘g‘illar', mine: 'Mening rasmim', upload: 'Rasm tanlash', uploadp: 'Kvadrat qilib qirqiladi va kichik saqlanadi. Rasmingizni faqat siz ko‘rasiz, u hech qachon ommaga ochilmaydi.',
      save: 'Saqlash', saving: 'Saqlanmoqda…', remove: 'Rasmni o‘chirish', toobig: 'Bu rasmni ishlatib bo‘lmadi. Boshqasini tanlang.', saved: 'Saqlandi',
      newname: 'Kartadagi ismingiz', namesave: 'Ismni saqlash', realnote: 'Bu yuzlarni sun’iy intellekt yaratgan. Ularning hech biri haqiqiy odam emas.',
      back: 'Kartaning orqasi', constellation: 'Raqamingiz yulduz turkumi ko‘rinishida', belongs: 'Bu karta egasi', worksonly: 'U faqat Telegram orqali kirganingizda ishlaydi.',
      daily: 'kunlik sinov', games: 'o‘yin', best: 'eng yaxshi o‘yin', plants: 'o‘simlik', quizzes: 'test', copy: 'Raqamni nusxalash', copied: 'c-ID raqami nusxalandi',
      rk: ['Yulduz changi', 'Kometa', 'Oy', 'Sayyora', 'Yulduz', 'Nova', 'Galaktika']
    },
    ru: {
      specimen: 'Образец', name: 'Имя', no: 'Номер c-ID', issued: 'Выдан', since: 'С нами с', group: 'Группа', rank: 'Ранг',
      pts: 'баллов', streak: 'дней подряд', lessons: 'уроков', focus: 'мин фокуса', citizen: 'Карта жителя орбиты',
      yourname: 'Ваше имя', ga: 'Elementary', gb: 'Beginner', gnone: 'Исследователь',
      get: 'Получите c-ID', getp: 'Один ID для всего, что делает Clive. Войдите один раз через Telegram в @clivedubot, и ваш номер, фото и прогресс будут с вами на любом устройстве. Один аккаунт Telegram — один c-ID.',
      students: 'Учитесь у меня на clivedu.me? У вас уже есть c-ID с вашими баллами. Просто войдите.',
      signin: 'Войти через Telegram', opening: 'Готовлю ссылку для входа…', open: 'Открыть @clivedubot',
      steps: ['Нажмите <b>Открыть @clivedubot</b>', 'Нажмите <b>START</b> в Telegram', 'Нажмите <b>Да, это я</b>', 'Вернитесь сюда, всё откроется само'],
      waiting: 'Жду Telegram…', cancel: 'Отмена', expired: 'Ссылка устарела. Попробуйте ещё раз.', refused: 'Вход отменён в Telegram.',
      fail: 'Не удалось связаться с сервером c-ID. Проверьте интернет и попробуйте снова.', many: 'Слишком много попыток. Подождите 10 минут.',
      hi: 'С возвращением', pic: 'Сменить фото', editname: 'Изменить имя', flip: 'Перевернуть карту', out: 'Выйти', outall: 'Выйти на всех устройствах',
      outallq: 'Выйти на всех телефонах и компьютерах, где открыт этот c-ID?', yes: 'Да, выйти везде', keep: 'Оставить',
      synced: 'Сад Vaqt, планировщик Reja, слова и настройки сохраняются в этот c‑ID.', syncnow: 'Сохранено', fromclass: 'Баллы по английскому — с clivedu.me',
      pick: 'Ваше фото', girls: 'Девушки', boys: 'Парни', mine: 'Моё фото', upload: 'Выбрать фото', uploadp: 'Обрежется до квадрата и сохранится в малом размере. Фото видите только вы, оно никогда не публикуется.',
      save: 'Сохранить', saving: 'Сохраняю…', remove: 'Удалить фото', toobig: 'Это фото не подошло. Попробуйте другое.', saved: 'Сохранено',
      newname: 'Имя на карте', namesave: 'Сохранить имя', realnote: 'Эти лица созданы ИИ. Ни одно из них не принадлежит реальному человеку.',
      back: 'Обратная сторона', constellation: 'Ваш номер в виде созвездия', belongs: 'Владелец карты', worksonly: 'Она работает, только когда вы вошли через Telegram.',
      daily: 'ежедневных заданий', games: 'игр', best: 'лучшая игра', plants: 'растений', quizzes: 'тестов', copy: 'Скопировать номер', copied: 'Номер c-ID скопирован',
      rk: ['Звёздная пыль', 'Комета', 'Луна', 'Планета', 'Звезда', 'Новая', 'Галактика']
    }
  };
  var RANKS = [0, 100, 300, 700, 1500, 3000, 6000];

  function go() {
    var C = window.Clive, $ = C.$, esc = C.esc;
    var stage = $('#cidstage'); if (!stage) return;
    var card = $('#cidcard'), side = $('#cidside');
    function tr(k) { var d = L[C.S.lang] || L.en; return d[k] != null ? d[k] : L.en[k]; }
    function auth() { return S.auth ? S.auth() : null; }
    function setAuth(a) { try { if (a) localStorage.setItem(AUTH, JSON.stringify(a)); else localStorage.removeItem(AUTH); } catch (e) {} }
    var me = null, photoURL = null, loginState = null, pollT = null, err = '';

    function api(path, o) {
      o = o || {}; var a = auth();
      var h = Object.assign({}, o.headers || {}); if (a) h.authorization = 'Bearer ' + a.token;
      var init = { method: o.method || 'GET', headers: h };
      if (o.json) { h['content-type'] = 'application/json'; init.body = JSON.stringify(o.json); }
      if (o.raw) { h['content-type'] = o.type || 'application/octet-stream'; init.body = o.raw; }
      return fetch(API + path, init).then(function (r) {
        if (r.status === 401 && a) { setAuth(null); me = null; render(); throw { status: 401 }; }
        if (o.blob) return r.ok ? r.blob() : null;
        return r.json().then(function (j) { if (!r.ok) throw Object.assign({ status: r.status }, j || {}); return j; });
      });
    }

    /* ---------------- the sky: every c-ID gets its own galaxy, drawn from its number ---------------- */
    function rng(seed) { var s = 0; for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0; s = s || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
    var PAL = [['#6c4ff0', '#22cfc6', '#ff6fae'], ['#3a5bff', '#9b7bff', '#22cfc6'], ['#ff6fae', '#9b7bff', '#f5c04a'], ['#22cfc6', '#3a5bff', '#ff9b3d']];
    function sky(cv, seed, back) {
      var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = Math.max(300, Math.round(r.width * dpr)), H = Math.round(W / 1.586);
      cv.width = W; cv.height = H;
      var g = cv.getContext('2d'), R = rng(seed + (back ? ':b' : '')), pal = PAL[Math.floor(R() * PAL.length)];
      var bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#05061a'); bg.addColorStop(.55, '#0b0a2c'); bg.addColorStop(1, '#120a2b');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter';
      /* nebula clouds */
      for (var i = 0; i < 9; i++) {
        var x = R() * W, y = R() * H, rad = (0.25 + R() * 0.45) * W, c = pal[i % 3];
        var ng = g.createRadialGradient(x, y, 0, x, y, rad);
        ng.addColorStop(0, hexA(c, 0.2 + R() * 0.2)); ng.addColorStop(0.5, hexA(c, 0.05)); ng.addColorStop(1, hexA(c, 0));
        g.fillStyle = ng; g.fillRect(0, 0, W, H);
      }
      for (i = 0; i < 260; i++) {             /* soft dust along a diagonal band, like the Milky Way */
        var t = R(), bx = t * W, by = H * (0.95 - t * 0.9) + (R() - .5) * H * 0.35, br = (0.01 + R() * 0.05) * W;
        var dg = g.createRadialGradient(bx, by, 0, bx, by, br); var cc = pal[Math.floor(R() * 3)];
        dg.addColorStop(0, hexA(cc, 0.05 + R() * 0.05)); dg.addColorStop(1, hexA(cc, 0));
        g.fillStyle = dg; g.beginPath(); g.arc(bx, by, br, 0, 6.283); g.fill();
      }
      /* spiral galaxy: drawn twice, once blurred for the glow and once sharp */
      var cx = W * (back ? 0.3 : 0.64), cy = H * (back ? 0.62 : 0.5), GR = W * (back ? 0.3 : 0.34), tilt = -0.5 + R() * 0.35, flat = 0.36 + R() * 0.14, arms = 2 + (R() > .55 ? 1 : 0), twist = 6.2 + R() * 2.5;
      var gal = document.createElement('canvas'); gal.width = W; gal.height = H; var q = gal.getContext('2d'); q.globalCompositeOperation = 'lighter';
      var N = Math.round(7000 * (W / 1200) + 1500);
      for (i = 0; i < N; i++) {
        var arm = i % arms, d = Math.pow(R(), 0.7), spread = (0.55 - d * 0.3) * (R() - .5);
        var ang = arm * (6.283 / arms) + d * twist + spread * 1.6;
        var rr = d * GR, px = Math.cos(ang) * rr + (R() - .5) * GR * 0.05, py = Math.sin(ang) * rr + (R() - .5) * GR * 0.05;
        var X = cx + px * Math.cos(tilt) - py * flat * Math.sin(tilt), Y = cy + px * Math.sin(tilt) + py * flat * Math.cos(tilt);
        var col = d < 0.12 ? '#fff1d6' : d < 0.3 ? (R() > .4 ? '#ffd2b0' : '#ffc4ec') : d < 0.6 ? (R() > .5 ? pal[0] : '#c9b8ff') : pal[1 + Math.floor(R() * 2)];
        q.fillStyle = hexA(col, (0.35 + R() * 0.5) * (1.05 - d * 0.45));
        var sz = (R() < 0.05 ? 2.2 : 0.8 + R() * 1.1) * dpr;
        q.fillRect(X, Y, sz, sz);
      }
      /* bright core */
      q.save(); q.translate(cx, cy); q.rotate(tilt); q.scale(1, flat);
      var core = q.createRadialGradient(0, 0, 0, 0, 0, GR * 0.42);
      core.addColorStop(0, 'rgba(255,246,228,1)'); core.addColorStop(0.1, 'rgba(255,220,180,.8)'); core.addColorStop(0.35, hexA(pal[0], .3)); core.addColorStop(1, 'rgba(0,0,0,0)');
      q.fillStyle = core; q.beginPath(); q.arc(0, 0, GR * 0.42, 0, 6.283); q.fill(); q.restore();
      g.save(); g.globalCompositeOperation = 'lighter';
      if ('filter' in g) { g.filter = 'blur(' + Math.round(6 * dpr) + 'px)'; g.globalAlpha = 0.75; g.drawImage(gal, 0, 0); g.filter = 'none'; g.globalAlpha = 1; }
      g.globalAlpha = 0.7; g.drawImage(gal, 0, 0); g.restore();
      g.globalCompositeOperation = 'source-over';
      /* stars */
      for (i = 0; i < 520 * (W / 1100); i++) {
        var sx = R() * W, sy = R() * H, a = R(), s2 = (a > 0.985 ? 1.8 : a > 0.9 ? 1.1 : 0.6) * dpr;
        g.fillStyle = 'rgba(255,255,255,' + (0.35 + R() * 0.65) + ')'; g.beginPath(); g.arc(sx, sy, s2, 0, 6.283); g.fill();
        if (a > 0.992) flare(g, sx, sy, 9 * dpr, pal[Math.floor(R() * 3)]);
      }
      /* a ringed planet and its moon */
      var pr = H * (0.17 + R() * 0.05), ppx = back ? W * 0.86 : W * 0.9, ppy = back ? H * 0.2 : H * 0.88;
      var pg = g.createRadialGradient(ppx - pr * 0.45, ppy - pr * 0.5, pr * 0.1, ppx, ppy, pr);
      pg.addColorStop(0, '#f6d7ff'); pg.addColorStop(0.35, pal[2]); pg.addColorStop(0.8, '#2a1652'); pg.addColorStop(1, '#0c0720');
      ring(g, ppx, ppy, pr, 'back', pal); g.fillStyle = pg; g.beginPath(); g.arc(ppx, ppy, pr, 0, 6.283); g.fill();
      g.save(); g.globalCompositeOperation = 'lighter'; var atm = g.createRadialGradient(ppx, ppy, pr * 0.9, ppx, ppy, pr * 1.25); atm.addColorStop(0, hexA(pal[1], .35)); atm.addColorStop(1, hexA(pal[1], 0)); g.fillStyle = atm; g.beginPath(); g.arc(ppx, ppy, pr * 1.25, 0, 6.283); g.fill(); g.restore();
      ring(g, ppx, ppy, pr, 'front', pal);
      var mx = ppx - pr * 2.1, my = ppy - pr * 0.9, mr = pr * 0.16, mg = g.createRadialGradient(mx - mr * .4, my - mr * .4, 0, mx, my, mr);
      mg.addColorStop(0, '#fff'); mg.addColorStop(1, '#6b6f9a'); g.fillStyle = mg; g.beginPath(); g.arc(mx, my, mr, 0, 6.283); g.fill();
      /* legibility: darken where the text sits */
      var sc = g.createLinearGradient(0, 0, W * 0.6, 0); sc.addColorStop(0, 'rgba(4,5,20,.35)'); sc.addColorStop(1, 'rgba(4,5,20,0)'); g.fillStyle = sc; g.fillRect(0, 0, W, H);
      var sb = g.createLinearGradient(0, H * 0.6, 0, H); sb.addColorStop(0, 'rgba(4,5,20,0)'); sb.addColorStop(1, 'rgba(4,5,20,.45)'); g.fillStyle = sb; g.fillRect(0, 0, W, H);
    }
    function ring(g, x, y, r, part, pal) {
      g.save(); g.translate(x, y); g.rotate(-0.35); g.scale(1, 0.28);
      g.beginPath(); if (part === 'back') g.rect(-r * 2.4, -r * 2.4, r * 4.8, r * 2.4); else g.rect(-r * 2.4, 0, r * 4.8, r * 2.4); g.clip();
      for (var k = 0; k < 3; k++) { g.strokeStyle = hexA(k === 1 ? '#ffe6c2' : pal[1], 0.5 - k * 0.12); g.lineWidth = r * (0.12 - k * 0.025); g.beginPath(); g.arc(0, 0, r * (1.55 + k * 0.22), 0, 6.283); g.stroke(); }
      g.restore();
    }
    function flare(g, x, y, s, c) {
      g.save(); g.globalCompositeOperation = 'lighter';
      var fg = g.createRadialGradient(x, y, 0, x, y, s); fg.addColorStop(0, 'rgba(255,255,255,.9)'); fg.addColorStop(0.3, hexA(c, .4)); fg.addColorStop(1, hexA(c, 0));
      g.fillStyle = fg; g.beginPath(); g.arc(x, y, s, 0, 6.283); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(x - s * 1.8, y); g.lineTo(x + s * 1.8, y); g.moveTo(x, y - s * 1.8); g.lineTo(x, y + s * 1.8); g.stroke();
      g.restore();
    }
    function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }

    /* twinkles and a shooting star now and then */
    var tw = [], twRAF = 0, twLast = 0, shoot = null, reduced = document.documentElement.getAttribute('data-motion') === 'reduced' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    function twinkle() {
      cancelAnimationFrame(twRAF);
      tw = Array.prototype.map.call(card.querySelectorAll('canvas.tw'), function (cv) {
        var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
        var R = rng('tw' + cv.width), st = []; for (var i = 0; i < 46; i++) st.push({ x: R() * cv.width, y: R() * cv.height, p: R() * 6.28, s: (0.8 + R() * 1.4) * dpr, v: 0.6 + R() * 1.8 });
        return { cv: cv, g: cv.getContext('2d'), st: st, dpr: dpr };
      });
      if (reduced) return;
      var vis = true;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(card);
      (function frame(now) {
        twRAF = requestAnimationFrame(frame);
        if (!vis || document.hidden || now - twLast < 33) return; twLast = now;
        var tt = now / 1000;
        tw.forEach(function (o, idx) {
          var g = o.g, W = o.cv.width, H = o.cv.height; g.clearRect(0, 0, W, H);
          o.st.forEach(function (s) { var a = 0.5 + 0.5 * Math.sin(tt * s.v + s.p); if (a < 0.55) return; g.fillStyle = 'rgba(255,255,255,' + ((a - 0.55) * 2).toFixed(2) + ')'; g.beginPath(); g.arc(s.x, s.y, s.s * a, 0, 6.283); g.fill(); });
          if (idx === 0) {
            if (!shoot && Math.random() < 0.006) shoot = { x: W * (0.2 + Math.random() * 0.6), y: -10, vx: W * 0.012, vy: H * 0.016, life: 1 };
            if (shoot) {
              var gr = g.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 9, shoot.y - shoot.vy * 9);
              gr.addColorStop(0, 'rgba(255,255,255,' + shoot.life + ')'); gr.addColorStop(1, 'rgba(155,123,255,0)');
              g.strokeStyle = gr; g.lineWidth = 2 * o.dpr; g.beginPath(); g.moveTo(shoot.x, shoot.y); g.lineTo(shoot.x - shoot.vx * 9, shoot.y - shoot.vy * 9); g.stroke();
              shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life -= 0.025; if (shoot.life <= 0 || shoot.y > H + 40) shoot = null;
            }
          }
        });
      })(0);
    }

    /* ---------------- the card ---------------- */
    function fmtNo(n) { return /^\d{12}$/.test(n || '') ? n.replace(/(\d{4})(?=\d)/g, '$1 ') : '•••• •••• ••••'; }
    function fdate(ms) { if (!ms) return '—'; return new Date(ms).toLocaleDateString(C.S.lang === 'uz' ? 'uz-UZ' : C.S.lang === 'ru' ? 'ru-RU' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
    function rankOf(p) { var i = 0; while (i < RANKS.length - 1 && p >= RANKS[i + 1]) i++; return i; }
    function latin(s) {
      var map = { 'ʻ': '', '‘': '', '’': '', "'": '', 'Ш': 'SH', 'ш': 'SH', 'Ч': 'CH', 'ч': 'CH', 'Ж': 'J', 'ж': 'J', 'Х': 'X', 'х': 'X', 'Ц': 'TS', 'ц': 'TS', 'Щ': 'SH', 'щ': 'SH', 'Ю': 'YU', 'ю': 'YU', 'Я': 'YA', 'я': 'YA', 'Ё': 'YO', 'ё': 'YO', 'Й': 'Y', 'й': 'Y', 'Ы': 'I', 'ы': 'I', 'Э': 'E', 'э': 'E', 'Ў': 'O', 'ў': 'O', 'Қ': 'Q', 'қ': 'Q', 'Ғ': 'G', 'ғ': 'G', 'Ҳ': 'H', 'ҳ': 'H' };
      var ab = 'АБВГДЕЗИКЛМНОПРСТУФ', la = 'ABVGDEZIKLMNOPRSTUF';
      return String(s || '').split('').map(function (ch) { if (map[ch] != null) return map[ch]; var i = ab.indexOf(ch.toUpperCase()); return i >= 0 ? la[i] : ch; }).join('').toUpperCase().replace(/[^A-Z ]/g, '').trim();
    }
    function mrz(name, no, issued) {
      var parts = latin(name).split(/\s+/).filter(Boolean), sur = parts.length > 1 ? parts.slice(1).join('<') : parts[0] || 'CLIVE', giv = parts.length > 1 ? parts[0] : '';
      var l1 = ('CID<ORB' + sur + '<<' + giv + '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0, 36);
      var d = new Date(issued || Date.now()), ds = String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
      var l2 = ((no || '000000000000') + '<UZB<' + ds + '<<CLIVEORBIT<<<<<<<<<<<<<<<<').slice(0, 36);
      return esc(l1) + '<br>' + esc(l2);
    }
    function face(u, size) {
      if (u && u.photo && photoURL) return '<img src="' + photoURL + '" alt="" width="' + size + '" height="' + size + '">';
      var av = (u && u.avatar) || (u ? '' : 'g08');
      if (/^[gbn]\d\d$/.test(av)) return '<img src="' + (C.root || '') + 'assets/img/avatars/' + av + '.webp?v=2" alt="" width="' + size + '" height="' + size + '">';
      return '<b>' + esc(String((u && u.name) || '?').charAt(0).toUpperCase()) + '</b>';
    }
    var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.6 6.9 7.4.4-5.8 4.6 2 7.1L12 16.4l-6.2 4.1 2-7.1L2 8.8l7.4-.4z" fill="currentColor"/></svg>';
    var CHIP = '<svg class="chip" viewBox="0 0 60 46" aria-hidden="true"><defs><linearGradient id="cidchipg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#e2b54a"/><stop offset="1" stop-color="#8a6417"/></linearGradient></defs><rect x="1" y="1" width="58" height="44" rx="9" fill="url(#cidchipg)" stroke="#6b4a0c" stroke-width="1"/><path d="M1 16h18M1 30h18M41 16h18M41 30h18M19 1v44M41 1v44M19 23h22" stroke="#6b4a0c" stroke-width="1.2" fill="none" opacity=".7"/></svg>';
    function constellation(no) {
      var d = (no && /^\d{12}$/.test(no) ? no : '314159265358').split('').map(Number), pts = d.map(function (v, i) { return [8 + i * (184 / 11), 10 + (9 - v) * 5.4 + (i % 2) * 4]; });
      var path = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      return '<svg class="const" viewBox="0 0 200 72" aria-hidden="true"><path d="' + path + '" fill="none" stroke="rgba(190,180,255,.55)" stroke-width=".7" stroke-dasharray="2 2"/>' + pts.map(function (p, i) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (1.3 + d[i] * 0.18).toFixed(2) + '" fill="#fff"/><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (3.5 + d[i] * 0.3).toFixed(2) + '" fill="rgba(155,123,255,.25)"/>'; }).join('') + '</svg>';
    }
    function cardHTML(data) {
      var u = data && data.user, s = (data && data.summary) || {}, v = C.vaqt() || { total: 0, plants: 0 };
      var pts = s.points || 0, rk = rankOf(pts), rn = tr('rk')[rk], grp = u ? (u.group === 'a' ? tr('ga') : u.group === 'b' ? tr('gb') : tr('gnone')) : '—';
      var nm = u ? u.name : tr('yourname');
      var front = '<div class="face front">' +
        '<canvas class="sky"></canvas><canvas class="tw"></canvas><div class="holo"></div><div class="glare"></div>' +
        (u ? '' : '<div class="specimen">' + esc(tr('specimen')) + '</div>') +
        '<div class="cf">' +
          '<header><span class="brand">' + STAR + 'CLIVE ORBIT</span>' + CHIP + '<span class="ttl"><b>c-ID</b><small>' + esc(tr('citizen')) + '</small></span></header>' +
          '<div class="mid"><div class="ph rk' + rk + '">' + face(u, 220) + '</div>' +
            '<div class="info"><small>' + esc(tr('name')) + '</small><h3 class="nm">' + esc(nm) + '</h3>' +
              '<span class="rank">' + STAR + esc(rn) + '</span>' +
              '<dl><div class="wide"><dt>' + esc(tr('no')) + '</dt><dd class="num">' + fmtNo(u && u.cid) + '</dd></div>' +
              '<div><dt>' + esc(tr('issued')) + '</dt><dd>' + esc(u ? fdate(data.cidAt || data.joined) : '—') + '</dd></div>' +
              '<div><dt>' + esc(tr('group')) + '</dt><dd>' + esc(grp) + '</dd></div></dl></div></div>' +
          '<div class="stats"><span><b>' + pts + '</b>' + esc(tr('pts')) + '</span><span><b>' + (s.streak || 0) + '</b>' + esc(tr('streak')) + '</span><span><b>' + (s.lessons || 0) + '</b>' + esc(tr('lessons')) + '</span><span><b>' + v.total + '</b>' + esc(tr('focus')) + '</span></div>' +
          '<div class="mrz" aria-hidden="true">' + mrz(nm, u && u.cid, u && (data.cidAt || data.joined)) + '</div>' +
        '</div></div>';
      var back = '<div class="face back" aria-label="' + esc(tr('back')) + '">' +
        '<canvas class="sky"></canvas><canvas class="tw"></canvas><div class="holo"></div>' +
        '<div class="cb"><div class="stripe"></div>' +
          '<div class="bgrid"><div class="emb rk' + rk + '">' + STAR + '<b>' + esc(rn) + '</b><small>' + esc(tr('rank')) + ' ' + (rk + 1) + '/7</small></div>' +
          '<div class="bst">' +
            [[pts, 'pts'], [s.lessons || 0, 'lessons'], [s.streak || 0, 'streak'], [s.daily || 0, 'daily'], [s.games || 0, 'games'], [s.bestGame || 0, 'best'], [v.total, 'focus'], [v.plants, 'plants']].map(function (x) { return '<span><b>' + x[0] + '</b>' + esc(tr(x[1])) + '</span>'; }).join('') +
          '</div></div>' +
          '<div class="cons"><small>' + esc(tr('constellation')) + '</small>' + constellation(u && u.cid) + '</div>' +
          '<p class="own">' + esc(tr('belongs')) + ' <b>' + esc(nm) + '</b>' + (u && u.username ? ' · @' + esc(u.username) : '') + '. ' + esc(tr('worksonly')) + '</p>' +
        '</div></div>';
      return '<div class="cidin">' + front + back + '</div>';
    }
    function paintCard() {
      card.innerHTML = cardHTML(me);
      var seed = (me && me.user && me.user.cid) || 'clive-sample';
      Array.prototype.forEach.call(card.querySelectorAll('canvas.sky'), function (cv, i) { sky(cv, seed, i === 1); });
      twinkle();
    }

    /* tilt and the holographic shine follow the pointer */
    var tiltOn = !reduced;
    stage.addEventListener('pointermove', function (e) {
      if (!tiltOn || e.pointerType === 'touch') return;
      var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg'); card.style.setProperty('--ry', ((x - 0.5) * 18).toFixed(2) + 'deg');
      card.style.setProperty('--hx', (x * 100).toFixed(1) + '%'); card.style.setProperty('--hy', (y * 100).toFixed(1) + '%'); card.style.setProperty('--ha', (x * 220).toFixed(0) + 'deg');
    });
    stage.addEventListener('pointerleave', function () { ['--rx', '--ry'].forEach(function (k) { card.style.setProperty(k, '0deg'); }); });
    card.addEventListener('dblclick', function () { card.classList.toggle('flip'); });
    var tx0 = null;
    card.addEventListener('touchstart', function (e) { tx0 = e.touches[0].clientX; }, { passive: true });
    card.addEventListener('touchend', function (e) { if (tx0 == null) return; var dx = e.changedTouches[0].clientX - tx0; if (Math.abs(dx) > 60) card.classList.toggle('flip'); tx0 = null; });

    /* ---------------- side panel ---------------- */
    function render() {
      paintCard();
      var h = '';
      if (me && me.user) {
        var u = me.user;
        h = '<span class="label" style="--acc:var(--violet)">' + C.icon('id') + 'c-ID ' + esc(fmtNo(u.cid)) + '</span>' +
          '<h2 class="mt1">' + esc(tr('hi')) + ', ' + esc(String(u.name || '').split(' ')[0]) + '</h2>' +
          '<p class="muted">' + esc(tr('synced')) + '</p>' +
          '<div class="row mt2"><button class="btn primary" style="--c:var(--violet);--ci:#120a2b" data-x="pic">' + C.icon('image') + esc(tr('pic')) + '</button>' +
          '<button class="btn ghost" data-x="name">' + C.icon('pen') + esc(tr('editname')) + '</button>' +
          '<button class="btn ghost" data-x="flip">' + C.icon('refresh') + esc(tr('flip')) + '</button>' +
          '<button class="btn ghost" data-x="copy">' + C.icon('copy') + esc(tr('copy')) + '</button></div>' +
          '<p class="small faint mt2">' + C.icon('link') + ' <a href="https://clivedu.me/me/" target="_blank" rel="noopener">' + esc(tr('fromclass')) + '</a></p>' +
          '<div class="row mt2"><button class="btn ghost sm" data-x="out">' + esc(tr('out')) + '</button><button class="btn ghost sm" data-x="outall" style="--c:var(--rose)">' + esc(tr('outall')) + '</button></div>' +
          '<div class="confirm mt1" id="cid-outall" role="alert"><span>' + esc(tr('outallq')) + '</span><button class="btn primary sm" data-x="outall2" style="--c:var(--rose)">' + esc(tr('yes')) + '</button><button class="btn ghost sm" data-x="outall0">' + esc(tr('keep')) + '</button></div>';
      } else if (loginState) {
        h = '<span class="label" style="--acc:var(--violet)">' + C.icon('send') + '@clivedubot</span><h2 class="mt1">' + esc(tr('get')) + '</h2>';
        if (loginState.link) {
          h += '<ol class="steps mt2">' + tr('steps').map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
            '<div class="row mt2"><a class="btn primary" style="--c:#2aabee;--ci:#fff" href="' + esc(loginState.link) + '" target="_blank" rel="noopener">' + C.icon('send') + esc(tr('open')) + '</a><button class="btn ghost" data-x="cancel">' + esc(tr('cancel')) + '</button></div>' +
            '<p class="small muted mt2 waiting"><span class="spin"></span>' + esc(tr('waiting')) + '</p>';
        } else h += '<p class="muted mt2 waiting"><span class="spin"></span>' + esc(tr('opening')) + '</p>';
      } else {
        h = '<span class="label" style="--acc:var(--violet)">' + C.icon('id') + 'c-ID</span><h2 class="mt1">' + esc(tr('get')) + '</h2>' +
          '<p class="muted">' + esc(tr('getp')) + '</p>' +
          '<p class="small mt1 cidnote">' + C.icon('cap') + esc(tr('students')) + '</p>' +
          '<div class="row mt2"><button class="btn primary" style="--c:#2aabee;--ci:#fff" data-x="signin">' + C.icon('send') + esc(tr('signin')) + '</button></div>';
      }
      if (err) h += '<p class="small mt1" style="color:var(--rose)" role="alert">' + esc(err) + '</p>';
      side.innerHTML = h;
      var sc = $('#sync-card'); if (sc) sc.hidden = !!(me && me.user);
    }
    side.addEventListener('click', function (e) {
      var b = e.target.closest('[data-x]'); if (!b) return;
      var x = b.getAttribute('data-x'); err = '';
      if (x === 'signin') return startLogin();
      if (x === 'cancel') { stopLogin(); return render(); }
      if (x === 'flip') return card.classList.toggle('flip');
      if (x === 'copy') return C.copy(me.user.cid, tr('copied'));
      if (x === 'pic') return picker();
      if (x === 'name') return nameSheet();
      if (x === 'out') { api('/logout', { method: 'POST' }).catch(function () {}); return signOut(); }
      if (x === 'outall') return $('#cid-outall').classList.add('on');
      if (x === 'outall0') return $('#cid-outall').classList.remove('on');
      if (x === 'outall2') { api('/logout-all', { method: 'POST' }).catch(function () {}).then(signOut); }
    });
    function signOut() { setAuth(null); try { localStorage.removeItem('clive.cid.sync'); } catch (e) {} me = null; if (photoURL) URL.revokeObjectURL(photoURL); photoURL = null; render(); }

    /* ---------------- sign-in through @clivedubot ---------------- */
    function startLogin() {
      loginState = { t: Date.now() }; render();
      api('/login/start', { method: 'POST' }).then(function (j) {
        if (!loginState) return;
        loginState = { code: j.code, link: j.link, until: Date.now() + (j.minutes || 10) * 60e3 };
        render(); poll();
      }).catch(function (e) { loginState = null; err = e && e.status === 429 ? tr('many') : tr('fail'); render(); });
    }
    function stopLogin() { loginState = null; clearTimeout(pollT); }
    function poll() {
      clearTimeout(pollT);
      if (!loginState || !loginState.code) return;
      if (Date.now() > loginState.until) { stopLogin(); err = tr('expired'); return render(); }
      pollT = setTimeout(function () {
        api('/login/status?code=' + encodeURIComponent(loginState.code)).then(function (j) {
          if (!loginState) return;
          if (j.state === 'done') { stopLogin(); setAuth({ token: j.token, at: Date.now() }); try { sessionStorage.removeItem('clive.cid.pulled'); } catch (e) {} refresh(true); }
          else if (j.state === 'expired') { stopLogin(); err = tr('expired'); render(); }
          else if (j.state === 'refused') { stopLogin(); err = tr('refused'); render(); }
          else poll();
        }).catch(function () { poll(); });
      }, document.hidden ? 4000 : 1800);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden && loginState && loginState.code) poll(); });

    function refresh(first) {
      if (!auth()) { me = null; render(); return; }
      api('/cid').then(function (j) {
        me = j;
        var done = function () { render(); if (first && S.pull) S.pull().then(function (ch) { if (ch) { render(); document.dispatchEvent(new CustomEvent('cid:synced')); } }); };
        if (j.user.photo) loadPhoto().then(done); else done();
      }).catch(function (e) { if (!(e && e.status === 401)) { err = tr('fail'); render(); } });
    }
    function loadPhoto() {
      return api('/cid/photo', { blob: true }).then(function (b) { if (photoURL) URL.revokeObjectURL(photoURL); photoURL = b ? URL.createObjectURL(b) : null; }).catch(function () {});
    }

    /* ---------------- picture picker ---------------- */
    var modal = null;
    function openModal(title, body, onMount) {
      closeModal();
      modal = document.createElement('div'); modal.className = 'cidmodal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', title);
      modal.innerHTML = '<div class="cm-bg" data-close></div><div class="cm"><div class="cm-h"><h3>' + esc(title) + '</h3><button class="iconbtn" data-close aria-label="Close">' + C.icon('x') + '</button></div><div class="cm-b">' + body + '</div></div>';
      document.body.appendChild(modal); document.body.style.overflow = 'hidden';
      modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(); });
      if (onMount) onMount(modal);
      var f = modal.querySelector('button,input'); if (f) f.focus();
    }
    function closeModal() { if (modal) { modal.remove(); modal = null; document.body.style.overflow = ''; } }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal) closeModal(); });
    function grid(prefix, n) {
      var cur = me.user.photo ? '' : me.user.avatar;
      var h = '<div class="avgrid">'; for (var i = 1; i <= n; i++) { var id = prefix + ('0' + i).slice(-2); h += '<button data-av="' + id + '" aria-pressed="' + (cur === id) + '" aria-label="' + id + '"><img src="' + (C.root || '') + 'assets/img/avatars/' + id + '.webp?v=2" alt="" loading="lazy" width="96" height="96"></button>'; }
      return h + '</div>';
    }
    function picker(tab) {
      tab = tab || (me.user.photo ? 'mine' : /^b/.test(me.user.avatar || '') ? 'boys' : 'girls');
      var tabs = '<div class="seg cmtabs" role="tablist">' + ['girls', 'boys', 'mine'].map(function (k) { return '<button role="tab" data-tab="' + k + '" aria-pressed="' + (tab === k) + '">' + esc(tr(k)) + '</button>'; }).join('') + '</div>';
      var body = tabs;
      if (tab === 'girls' || tab === 'boys') body += grid(tab === 'girls' ? 'g' : 'b', 16) + '<p class="small faint">' + esc(tr('realnote')) + '</p>';
      else body += '<div class="upl"><div class="upv">' + (me.user.photo && photoURL ? '<img src="' + photoURL + '" alt="">' : C.icon('user')) + '</div><div><p class="small muted">' + esc(tr('uploadp')) + '</p>' +
        '<div class="row mt1"><label class="btn primary" style="--c:var(--violet);--ci:#120a2b;cursor:pointer">' + C.icon('upload') + esc(tr('upload')) + '<input type="file" accept="image/*" id="cid-file" hidden></label>' +
        (me.user.photo ? '<button class="btn ghost" data-rmphoto>' + C.icon('trash') + esc(tr('remove')) + '</button>' : '') + '</div><p class="small mt1" id="cid-umsg" role="status"></p></div></div>';
      openModal(tr('pick'), body, function (m) {
        m.querySelectorAll('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { picker(b.getAttribute('data-tab')); }); });
        m.querySelectorAll('[data-av]').forEach(function (b) {
          b.addEventListener('click', function () {
            var id = b.getAttribute('data-av');
            m.querySelectorAll('[data-av]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
            var chain = me.user.photo ? api('/cid/photo', { method: 'DELETE' }) : Promise.resolve(null);
            chain.then(function () { return api('/profile', { method: 'POST', json: { avatar: id } }); }).then(function (j) { me.user = Object.assign(me.user, j.user, { photo: 0 }); render(); C.toast(tr('saved')); closeModal(); }).catch(function () { C.toast(tr('fail')); });
          });
        });
        var fi = m.querySelector('#cid-file'); if (fi) fi.addEventListener('change', function () { if (fi.files[0]) uploadPhoto(fi.files[0], m); });
        var rm = m.querySelector('[data-rmphoto]'); if (rm) rm.addEventListener('click', function () { api('/cid/photo', { method: 'DELETE' }).then(function (j) { me.user = Object.assign(me.user, j.user); photoURL = null; render(); picker('mine'); }); });
      });
    }
    function uploadPhoto(file, m) {
      var msg = m.querySelector('#cid-umsg'); msg.textContent = tr('saving');
      if (!/^image\//.test(file.type) || file.size > 25 * 1024 * 1024) { msg.textContent = tr('toobig'); return; }
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(url);
        /* redraw on a canvas: crops to a square, makes it small, and drops everything hidden in the file (like GPS location) */
        var S0 = Math.min(img.naturalWidth, img.naturalHeight), cv = document.createElement('canvas'), side = 384; cv.width = cv.height = side;
        var g = cv.getContext('2d'); g.imageSmoothingQuality = 'high';
        g.drawImage(img, (img.naturalWidth - S0) / 2, (img.naturalHeight - S0) / 2, S0, S0, 0, 0, side, side);
        var q = 0.86;
        (function tryEnc() {
          cv.toBlob(function (b) {
            if (!b) { msg.textContent = tr('toobig'); return; }
            if (b.size > 150 * 1024 && q > 0.45) { q -= 0.12; return tryEnc(); }
            api('/cid/photo', { method: 'POST', raw: b, type: b.type }).then(function (j) {
              me.user = Object.assign(me.user, j.user);
              if (photoURL) URL.revokeObjectURL(photoURL); photoURL = URL.createObjectURL(b);
              render(); closeModal(); C.toast(tr('saved'));
            }).catch(function (e) { msg.textContent = (e && e.error) || tr('toobig'); });
          }, 'image/webp', q);
        })();
      };
      img.onerror = function () { msg.textContent = tr('toobig'); };
      img.src = url;
    }
    function nameSheet() {
      openModal(tr('editname'), '<label class="fl"><span class="small" style="font-weight:700">' + esc(tr('newname')) + '</span><input class="input" id="cid-name" maxlength="40" autocomplete="name"></label><div class="row mt2"><button class="btn primary" style="--c:var(--violet);--ci:#120a2b" id="cid-nsave">' + esc(tr('namesave')) + '</button></div>', function (m) {
        var inp = m.querySelector('#cid-name'); inp.value = me.user.name || '';
        function go2() { var v = inp.value.trim(); if (!v) return; api('/profile', { method: 'POST', json: { name: v } }).then(function (j) { me.user = Object.assign(me.user, j.user); render(); closeModal(); C.toast(tr('saved')); }).catch(function () { C.toast(tr('fail')); }); }
        m.querySelector('#cid-nsave').addEventListener('click', go2);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go2(); });
      });
    }

    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(paintCard, 200); });
    document.addEventListener('clive:lang', render);
    document.addEventListener('cid:synced', function () { if (me) render(); });
    render(); refresh(false);
  }
  if (window.Clive && Clive.booted) go(); else document.addEventListener('clive:ready', go);
})();
