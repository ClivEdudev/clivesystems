from lib import *

CSS = '''
.hero{position:relative;min-height:min(94vh,900px);display:grid;align-items:end;overflow:hidden;margin-top:-84px;padding-top:84px}
.hero canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:pan-y}
.hero::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,var(--bg) 0%,color-mix(in srgb,var(--bg) 78%,transparent) 32%,transparent 58%)}
.hero .wrap{position:relative;z-index:2;padding-block:40px clamp(40px,7vh,88px);pointer-events:none}
.hero .wrap a,.hero .wrap button{pointer-events:auto}
.hero .copy{max-width:640px}
.hero h1{font-size:clamp(3.2rem,9.5vw,7.6rem);line-height:.94;letter-spacing:-.035em;font-weight:700}
.hero .roles{font:500 clamp(1.05rem,1.8vw,1.4rem)/1.35 var(--head);margin-top:22px;min-height:2.8em;color:var(--sub)}
.hero .roles span{display:inline-block;color:var(--ink);transition:opacity .45s,transform .45s}
.hero .roles span.out{opacity:0;transform:translateY(10px)}
.hero .lead{margin-top:14px}
.hero .ctas{margin-top:28px}
.hero .when{display:inline-flex;gap:8px;align-items:center;font-weight:600;font-size:.9rem;color:var(--sub);padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:color-mix(in srgb,var(--bg) 50%,transparent);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);margin-bottom:22px}
.hero .when svg{width:16px;height:16px;color:var(--gold)}
.planets{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.planets a{display:inline-flex;align-items:center;gap:8px;min-height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:color-mix(in srgb,var(--bg) 55%,transparent);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-weight:700;font-size:.85rem;transition:border-color .2s}
.planets a i{width:9px;height:9px;border-radius:50%;background:var(--c);box-shadow:0 0 10px var(--c)}
.planets a:hover{border-color:var(--c)}
@media(max-width:820px){
 .hero::after{display:none}
 .hero{min-height:0;align-items:start;margin-top:0;padding-top:0}
 .hero canvas{position:relative;height:min(108vw,520px)}
 .hero .wrap{padding-top:0;margin-top:-40px}
}
.now{grid-template-columns:1.3fr 1fr 1fr}
@media(max-width:980px){.now{grid-template-columns:1fr 1fr}.now .c1{grid-column:1/-1}}
@media(max-width:640px){.now{grid-template-columns:1fr}}
.now .card{display:flex;flex-direction:column;gap:10px;min-height:220px}
.now .big{font:600 clamp(2rem,4.2vw,3.2rem)/1 var(--head);font-variant-numeric:tabular-nums}
.now .foot2{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.bento{grid-template-columns:repeat(6,minmax(0,1fr))}
.bento .card{display:flex;flex-direction:column;min-height:300px}
.b-vaqt{grid-column:span 4;grid-row:span 2}
.b-clivedu,.b-class,.b-sprach,.b-vault,.b-reja,.b-shop{grid-column:span 2}
.b-wide{grid-column:span 3}
@media(max-width:980px){.bento{grid-template-columns:repeat(2,minmax(0,1fr))}.b-vaqt{grid-column:1/-1;grid-row:auto}.b-clivedu,.b-class,.b-sprach,.b-vault,.b-reja,.b-shop,.b-wide{grid-column:span 1}}
@media(max-width:640px){.bento{grid-template-columns:1fr}.bento .card{min-height:0}}
.bento .shot{margin:18px -28px -28px;border-top:1px solid var(--line);overflow:hidden;flex:1;min-height:150px;position:relative}
.bento .shot img{width:100%;height:100%;object-fit:cover;object-position:top left;position:absolute;inset:0;transition:transform .8s cubic-bezier(.2,.8,.2,1)}
.bento a.card:hover .shot img{transform:scale(1.04)}
.bento .top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.bento h3{font-size:1.4rem}
.b-vaqt{background:radial-gradient(120% 90% at 80% 100%,color-mix(in srgb,var(--green) 22%,var(--card)),var(--card) 60%)}
.b-vaqt h3{font-size:clamp(1.8rem,3vw,2.6rem)}
.b-vaqt .garden{flex:1;min-height:260px;display:grid;place-items:center;margin-top:10px}
.b-vaqt .garden svg{width:min(560px,100%);height:auto;overflow:visible}
.hats{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:980px){.hats{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.hats{grid-template-columns:1fr}}
.hats .card{min-height:250px;display:flex;flex-direction:column}
.hats .card .more{margin-top:auto;padding-top:16px;font-weight:700;color:var(--c);display:inline-flex;gap:6px;align-items:center}
.hats .card .more svg{width:16px;height:16px}
.facts{grid-template-columns:repeat(5,minmax(0,1fr));border-block:1px solid var(--line);padding-block:30px}
@media(max-width:980px){.facts{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:560px){.facts{grid-template-columns:1fr 1fr}}
.carousel{display:grid;grid-auto-flow:column;grid-auto-columns:min(620px,86%);gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:12px;scrollbar-width:thin}
.carousel>*{scroll-snap-align:start;min-width:0}
.wcard .meta{display:flex;justify-content:space-between;gap:12px;margin-top:16px;align-items:flex-start}
.wcard h3{font-size:1.2rem}
.wcard p{color:var(--sub);font-size:.95rem;margin-top:6px}
.wotd{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(18px,3vw,40px);align-items:center}
@media(max-width:820px){.wotd{grid-template-columns:1fr}}
.wotd .w{font:700 clamp(2.6rem,7vw,5.4rem)/1 var(--head);letter-spacing:-.03em}
.wotd .tr{display:grid;gap:10px}
.wotd .tr div{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;background:var(--card2);border:1px solid var(--line)}
.wotd .tr b{font:600 1.25rem/1.2 var(--head);flex:1}
.wotd .tr small{width:34px;font-weight:800;color:var(--mute);font-size:.8rem}
.wotd .tr button{flex:none}
.shopt{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(18px,3vw,48px);align-items:center}
@media(max-width:820px){.shopt{grid-template-columns:1fr}}
.shopt img{border-radius:18px;border:1px solid var(--line);box-shadow:var(--shadow)}
.price{font:700 2.4rem/1 var(--head)}
'''

def body():
    P = {p['id']: p for p in PRODUCTS}
    chips = ''.join(f'<a href="{p["page"]}" style="--c:{p["c"]}"><i></i>{p["name"]}</a>' for p in PRODUCTS)
    chips += f'<a href="shop.html" style="--c:var(--rose)"><i></i>{T("h.pl.shop","Shop","Do‘kon","Магазин")}</a><a href="work.html" style="--c:var(--violet)"><i></i>{T("h.pl.work","Client work","Mijozlar uchun ishlar","Работы для клиентов")}</a>'
    J('h.role.0','I teach English to Uzbek students, live, five lessons a week.','Men o‘zbek o‘quvchilariga ingliz tilini jonli o‘rgataman, haftasiga besh dars.','Я вживую преподаю английский узбекским ученикам, пять уроков в неделю.')
    J('h.role.1','I build websites for hotels, shops and cafés, in three languages.','Men mehmonxonalar, do‘konlar va kafelar uchun uch tilda sayt quraman.','Я делаю сайты для отелей, магазинов и кафе на трёх языках.')
    J('h.role.2','I make digital products and sell them on Whop.','Men raqamli mahsulotlar yarataman va ularni Whop’da sotaman.','Я создаю цифровые продукты и продаю их на Whop.')
    J('h.role.3','I’m learning German with an app I built for myself.','Men o‘zim uchun yaratgan ilova orqali nemis tilini o‘rganyapman.','Я учу немецкий с приложением, которое сделал для себя.')
    J('h.role.4','I grow focus gardens. One session, one tulip.','Men fokus bog‘larini o‘stiraman. Bitta sessiya — bitta lola.','Я выращиваю сады фокуса. Одна сессия — один тюльпан.')
    for i,(k,en,uz,ru) in enumerate([('vaqt','Vaqt','Vaqt','Vaqt'),('clivedu','ClivEdu','ClivEdu','ClivEdu'),('class','Class','Class','Class'),('sprachwerk','Sprachwerk','Sprachwerk','Sprachwerk'),('vault','Vault Studio','Vault Studio','Vault Studio'),('reja','Reja','Reja','Reja'),('shop','Shop','Do‘kon','Магазин'),('work','Work','Ishlar','Работы')]):
        J('orb.'+k,en,uz,ru)

    hero = f'''<section class="hero" aria-label="Intro">
<canvas id="orbit" aria-hidden="true"></canvas>
<div class="wrap"><div class="copy">
<div class="when">{ic('sparkle')}<span>{T('h.when','Uzbekistan · it’s','O‘zbekiston · hozir','Узбекистан · сейчас')}</span> <b class="num" data-tash-clock>--:--</b> <span>{T('h.when2','in Tashkent','Toshkentda','в Ташкенте')}</span></div>
<h1>{T('h.t1','Clive,','Clive,','Clive,')}<br>{T('h.t2','just Clive.','shunchaki Clive.','просто Clive.')}</h1>
<p class="roles" aria-live="polite"><span id="role">I teach English to Uzbek students, live, five lessons a week.</span></p>
{T('h.lead','One person, one orbit. Every class, app and website I make lives here, and you can switch it all to Uzbek or Russian.','Bir inson, bitta orbita. Men yaratgan har bir dars, ilova va sayt shu yerda, hammasini o‘zbek yoki rus tiliga o‘tkazish mumkin.','Один человек — одна орбита. Все мои уроки, приложения и сайты здесь, и всё можно переключить на узбекский или русский.',tag='p',cls='lead')}
<div class="row ctas"><a class="btn primary" href="ecosystem.html">{T('h.cta1','Explore the orbit','Orbitani ko‘rish','Исследовать орбиту')}{ic('arrow')}</a><a class="btn ghost" href="vaqt/index.html" style="--c:var(--green)">{ic('leaf')}{T('h.cta2','Grow a focus garden','Fokus bog‘ini o‘stirish','Вырастить сад фокуса')}</a></div>
<nav class="planets" aria-label="Products">{chips}</nav>
</div></div></section>'''

    words = [('h.mq.1','Salom','Salom','Salom'),]
    mq_items = ['Salom','Hello','Привет','Hallo','Teach','Build','Ship','Focus','Learn','O‘rgan','Учись','Lernen']
    mq = ''.join(f'<span><b>{w}</b>{ic("sparkle")}</span>' for w in mq_items)
    marquee = f'<div class="marquee" aria-hidden="true"><div class="track">{mq}{mq}</div></div>'

    now = f'''<section class="band tight"><div class="wrap">
{sh('h.now.l','Right now','Ayni paytda','Прямо сейчас','h.now.h','What’s happening in the orbit today','Bugun orbitada nimalar bo‘lyapti','Что происходит на орбите сегодня')}
<div class="grid now">
<article class="card glow c1" style="--c:var(--turq)" data-reveal><span class="label" style="--acc:var(--turq)">{ic('cap')}<span id="nc-label">{T('h.nc.l','Next English class','Keyingi ingliz tili darsi','Следующий урок английского')}</span></span>
<div class="big" id="nc-big">—</div><p class="muted" id="nc-sub" style="margin:0">{T('h.nc.wait','Checking the timetable…','Jadval tekshirilmoqda…','Проверяю расписание…')}</p>
<div class="foot2"><span class="chip c" style="--c:var(--turq)" id="nc-chip">Elementary</span><a class="btn ghost sm" href="learn.html">{T('h.nc.cta','Timetable','Dars jadvali','Расписание')}{ic('arrow')}</a></div></article>
<article class="card glow" style="--c:var(--gold)" data-reveal="80"><span class="label" style="--acc:var(--gold)">{ic('globe')}{T('h.lr.l','Learning','O‘rganyapman','Учу')}</span>
{T('h.lr.h','German, from the first sound','Nemis tili, birinchi tovushdan','Немецкий, с первого звука','h3')}
{T('h.lr.p','Riding Linie A1 in Sprachwerk: 13 stations from “Laute” to “Reisen”.','Sprachwerk’dagi Linie A1 bo‘ylab: “Laute”dan “Reisen”gacha 13 bekat.','Еду по Linie A1 в Sprachwerk: 13 станций от «Laute» до «Reisen».','p')}
<div class="foot2"><span class="chip c" style="--c:var(--gold)">A1</span><a class="btn ghost sm" href="products/sprachwerk.html">Sprachwerk{ic('arrow')}</a></div></article>
<article class="card glow" style="--c:var(--green)" data-reveal="160" id="focus-card"><span class="label" style="--acc:var(--green)">{ic('leaf')}{T('h.fc.l','Your focus today','Bugungi fokusingiz','Ваш фокус сегодня')}</span>
<div class="big" id="fc-big">0<small style="font-size:.4em;color:var(--sub)"> min</small></div>
<p class="muted" id="fc-sub" style="margin:0">{T('h.fc.empty','No seeds planted yet. A 25-minute session grows your first tulip.','Hali urug‘ ekilmagan. 25 daqiqalik sessiya birinchi lolangizni o‘stiradi.','Семена ещё не посажены. 25 минут фокуса — и вырастет первый тюльпан.')}</p>
<div class="foot2"><span class="chip c" style="--c:var(--green)" id="fc-chip">Vaqt</span><a class="btn primary sm" href="vaqt/index.html" style="--c:var(--green);--ci:#03170d">{T('h.fc.cta','Start focusing','Fokusni boshlash','Начать фокус')}{ic('arrow')}</a></div></article>
</div></div></section>'''
    J('h.nc.live','In class right now','Hozir dars ketyapti','Урок идёт прямо сейчас')
    J('h.nc.in','in {t}','{t} dan keyin','через {t}')
    J('h.nc.sub','{group} · {day} at {time}, Tashkent time','{group} · {day}, soat {time} (Toshkent vaqti)','{group} · {day}, в {time} по Ташкенту')
    J('h.nc.subl','{group} started at {time}, Tashkent time','{group} soat {time} da boshlandi (Toshkent vaqti)','{group} начался в {time} по Ташкенту')
    J('h.nc.today','today','bugun','сегодня')
    J('h.nc.tomorrow','tomorrow','ertaga','завтра')
    J('h.fc.has','{plants} plants in your garden · {streak}-day streak','Bog‘ingizda {plants} ta o‘simlik · {streak} kunlik seriya','{plants} растений в саду · серия {streak} дн.')
    J('u.min','min','daq','мин')

    def pcard(cls, pid, title_key, t_en, t_uz, t_ru, d_key, d_en, d_uz, d_ru, status=None, delay=0):
        p = P[pid]
        st = status or ('live', T('h.st.live','Live','Ishlayapti','Работает'))
        img = f'<div class="shot"><img src="assets/img/{p["img"]}" alt="" loading="lazy" width="960" height="600"></div>' if p.get('img') else ''
        return f'''<a class="card glow {cls}" style="--c:{p['c']}" href="{p['page']}" data-reveal="{delay}">
<div class="top"><span class="ico" style="margin:0">{ic(p['icon'])}</span><span class="chip c live" style="--c:{p['c']}"><span class="dot"></span>{st[1]}</span></div>
<h3 class="mt2">{p['name']}</h3>{T(d_key,d_en,d_uz,d_ru,'p')}{img}</a>'''

    vaqt_card = f'''<a class="card glow b-vaqt" style="--c:var(--green)" href="products/vaqt.html" data-reveal>
<div class="top"><span class="ico" style="margin:0">{ic('leaf')}</span><span class="chip c" style="--c:var(--green)">{ic('sparkle')}{T('h.st.new','New today','Bugun yangi','Новинка')}</span></div>
<h3 class="mt2">Vaqt</h3>
{T('h.vq.p','A focus timer and time tracker that grows an Uzbek garden. Leave the tab during deep focus and your tulip wilts. Stay, and your orchard grows: lola, paxta, anor, o‘rik, chinor.','Fokus taymeri va vaqt hisoblagichi, u o‘zbek bog‘ini o‘stiradi. Chuqur fokus paytida varaqni tark etsangiz, lola so‘liydi. Qolsangiz, bog‘ingiz o‘sadi: lola, paxta, anor, o‘rik, chinor.','Таймер фокуса и трекер времени, который растит узбекский сад. Уйдёте с вкладки во время глубокого фокуса — тюльпан завянет. Останетесь — сад растёт: лола, пахта, анор, урюк, чинара.','p')}
<div class="garden" id="mini-garden" aria-hidden="true"></div>
<div class="row mt1"><span class="chip">{ic('timer')}Pomodoro · Flow · Timer</span><span class="chip">{ic('headphones')}{T('h.vq.c2','6 ambient sounds','6 ta fon ovozi','6 фоновых звуков')}</span><span class="chip">{ic('wifi')}{T('h.vq.c3','Works offline','Oflayn ishlaydi','Работает офлайн')}</span></div>
</a>'''
    bento = f'''<section class="band"><div class="wrap">
{sh('h.orb.l','The orbit','Orbita','Орбита','h.orb.h','Six products, one maker','Oltita mahsulot, bitta yaratuvchi','Шесть продуктов, один автор',('h.orb.p','Each one started as something I needed: for my students, for my German, for my YouTube channel, for my own focus and my own university week.','Ularning har biri menga kerak bo‘lgan narsadan boshlangan: o‘quvchilarim, nemis tilim, YouTube kanalim, o‘z fokusim va universitet haftam uchun.','Каждый начался с того, что было нужно мне: моим ученикам, моему немецкому, моему YouTube-каналу, моему фокусу и моей учебной неделе.'))}
<div class="grid bento">
{vaqt_card}
{pcard('b-clivedu','clivedu','','','','','h.cd.p','An English classroom among the stars: lessons, a Word Galaxy that grows with every word, games and a teacher desk.','Yulduzlar orasidagi ingliz tili sinfi: darslar, har bir so‘z bilan o‘sadigan So‘z galaktikasi, o‘yinlar va o‘qituvchi stoli.','Класс английского среди звёзд: уроки, Галактика слов, которая растёт с каждым словом, игры и стол учителя.',delay=80)}
{pcard('b-class','class','','','','','h.cl.p','The live classroom at clivedu.me. My students open each lesson on their phones while it plays on the board.','clivedu.me’dagi jonli sinf. O‘quvchilarim har bir darsni doskada ko‘rsatilayotganda telefonlarida ochadi.','Живой класс на clivedu.me. Ученики открывают урок на телефонах, пока он идёт на доске.',delay=160)}
{pcard('b-sprach','sprachwerk','','','','','h.sw.p','German, engineered: a metro line to A1, voiced Berlin missions, a shadowing studio and a radar that guesses der, die or das.','Nemis tili, muhandislik bilan: A1 gacha metro chizig‘i, ovozli Berlin topshiriqlari, takrorlash studiyasi va der, die yoki das ni taxmin qiluvchi radar.','Немецкий, собранный как механизм: линия метро до A1, озвученные берлинские миссии, студия повторения и радар, угадывающий der, die или das.',delay=0)}
{pcard('b-vault','vault','','','','','h.vs.p','My browser video studio for the WonderVault channel: scripts, a timeline with captions, exports and thumbnails.','WonderVault kanali uchun brauzerdagi video studiyam: ssenariylar, subtitrli taymlayn, eksport va muqovalar.','Моя видеостудия в браузере для канала WonderVault: сценарии, монтаж с субтитрами, экспорт и обложки.',status=('live',T('h.st.tool','My tool','Mening vositam','Мой инструмент')),delay=80)}
{pcard('b-reja','reja','','','','','h.rj.p','My study and life planner: classes in their pairs, A and B weeks, deadlines with files, and a timetable you rearrange by holding and dragging.','O‘qish va hayot rejalashtirgichim: juftliklardagi darslar, A va B haftalar, fayl biriktirilgan muddatlar va bosib turib suriladigan jadval.','Мой планировщик учёбы и жизни: пары на своих местах, недели A и B, дедлайны с файлами и расписание, которое меняется зажатием и перетаскиванием.',status=('live',T('h.st.new','New today','Bugun yangi','Новинка')),delay=160)}
</div></div></section>'''

    hats = f'''<section class="band"><div class="wrap">
{sh('h.who.l','Who is Clive','Clive kim','Кто такой Clive','h.who.h','Four hats, one head','To‘rtta shapka, bitta bosh','Четыре шляпы, одна голова')}
<div class="grid hats">
<article class="card glow" style="--c:var(--turq)" data-reveal><span class="ico">{ic('cap')}</span>{T('h.hat1.h','Teacher','O‘qituvchi','Учитель','h3')}{T('h.hat1.p','Two English groups, Elementary and Beginner, every lesson with Uzbek translations.','Ikki ingliz tili guruhi, Elementary va Beginner, har bir darsda o‘zbekcha tarjima bor.','Две группы английского, Elementary и Beginner, в каждом уроке есть перевод на узбекский.','p')}<a class="more" href="learn.html">{T('h.hat1.a','See the timetable','Jadvalni ko‘rish','Смотреть расписание')}{ic('arrow')}</a></article>
<article class="card glow" style="--c:var(--blue)" data-reveal="80"><span class="ico">{ic('code')}</span>{T('h.hat2.h','Web developer','Veb-dasturchi','Веб-разработчик','h3')}{T('h.hat2.p','Hotels, a furniture store, a burger shop: fast, phone-first sites in Uzbek, Russian and English.','Mehmonxonalar, mebel do‘koni, burger do‘koni: o‘zbek, rus va ingliz tillarida tez, telefonga mo‘ljallangan saytlar.','Отели, мебельный магазин, бургерная: быстрые сайты для телефонов на узбекском, русском и английском.','p')}<a class="more" href="work.html">{T('h.hat2.a','See the work','Ishlarni ko‘rish','Смотреть работы')}{ic('arrow')}</a></article>
<article class="card glow" style="--c:var(--rose)" data-reveal="160"><span class="ico">{ic('bag')}</span>{T('h.hat3.h','Maker','Yaratuvchi','Автор','h3')}{T('h.hat3.p','Digital products on Whop, starting with a 78-page eBook that fixes 60 everyday tech problems.','Whop’dagi raqamli mahsulotlar: 60 ta kundalik texnik muammoni hal qiluvchi 78 sahifalik elektron kitobdan boshlab.','Цифровые продукты на Whop, начиная с 78-страничной электронной книги, которая решает 60 бытовых технических проблем.','p')}<a class="more" href="shop.html">{T('h.hat3.a','Visit the shop','Do‘konga kirish','В магазин')}{ic('arrow')}</a></article>
<article class="card glow" style="--c:var(--gold)" data-reveal="240"><span class="ico">{ic('globe')}</span>{T('h.hat4.h','Learner','O‘quvchi','Ученик','h3')}{T('h.hat4.p','Learning German on my own, with my own app, in public. Follow along in the journal.','Nemis tilini mustaqil, o‘z ilovam bilan, ochiq o‘rganyapman. Kundalikda kuzatib boring.','Учу немецкий сам, со своим приложением и открыто. Следите в дневнике.','p')}<a class="more" href="journal.html">{T('h.hat4.a','Read the journal','Kundalikni o‘qish','Читать дневник')}{ic('arrow')}</a></article>
</div></div></section>'''

    facts = f'''<section class="band tight"><div class="wrap grid facts">
<div class="kpi" data-reveal><b>14</b>{T('h.f1','websites live on Netlify','Netlify’da ishlayotgan saytlar','сайтов работают на Netlify')}</div>
<div class="kpi" data-reveal="60"><b>3</b>{T('h.f2','languages on every hotel, shop and café site','mehmonxona, do‘kon va kafe saytlaridagi tillar','языка на сайтах отелей, магазинов и кафе')}</div>
<div class="kpi" data-reveal="120"><b>5</b>{T('h.f3','English lessons a week, live','haftasiga jonli ingliz tili darslari','живых уроков английского в неделю')}</div>
<div class="kpi" data-reveal="180"><b>60</b>{T('h.f4','tech fixes in my first eBook','birinchi elektron kitobimdagi texnik yechimlar','технических решений в моей первой книге')}</div>
<div class="kpi" data-reveal="240"><b>13</b>{T('h.f5','stations on my road to German A1','nemis tili A1 sari yo‘limdagi bekatlar','станций на пути к немецкому A1')}</div>
</div></section>'''

    works = [('riva','RIVA HOTEL','rivehotel.netlify.app','https://rivehotel.netlify.app/','h.w.riva','Hotel in Andijan · map pin with a copyable Plus Code, FAQ, swipeable gallery.','Andijondagi mehmonxona · nusxa olinadigan Plus Code bilan xarita, FAQ, suriladigan galereya.','Отель в Андижане · метка на карте с Plus Code, FAQ, галерея со свайпом.'),
             ('robiya','Robiya mebellari','andijonmebel.netlify.app','https://andijonmebel.netlify.app/','h.w.robiya','Furniture store · an empty room furnishes itself as you scroll.','Mebel do‘koni · bo‘sh xona siz aylantirganingiz sari jihozlanadi.','Мебельный магазин · пустая комната обставляется сама, пока вы листаете.'),
             ('frans','Frans Burger','ffsand.netlify.app','https://ffsand.netlify.app/','h.w.frans','Burger & coffee · a new drink-and-burger pair on every visit.','Burger va qahva · har tashrifda yangi ichimlik va burger jufti.','Бургеры и кофе · новая пара напиток + бургер при каждом визите.'),
             ('tm','TM HOTEL','tmhotel.netlify.app','https://tmhotel.netlify.app/','h.w.tm','Boutique hotel · availability calendar the hotel updates by hand.','Butik mehmonxona · mehmonxona o‘zi yangilaydigan bandlik taqvimi.','Бутик-отель · календарь занятости, который отель обновляет вручную.'),
             ('dilnura','Dilnura Edu','dilnuraedu.netlify.app','https://dilnuraedu.netlify.app/','h.w.dilnura','A teacher’s class site · built on my ClivEdu Class engine.','O‘qituvchining sinf sayti · ClivEdu Class dvigatelim asosida.','Сайт класса для учителя · на движке ClivEdu Class.')]
    wc = ''.join(f'''<article class="wcard"><a href="{u}" target="_blank" rel="noopener" class="browser"><div class="bar"><i></i><i></i><i></i><span>{d}</span></div><img src="assets/img/work/{k}.webp" alt="{esc(n)} website" loading="lazy" width="960" height="600"></a>
<div class="meta"><div><h3>{n}</h3>{T(key,en,uz,ru,'p')}</div><a class="iconbtn" href="{u}" target="_blank" rel="noopener" aria-label="Open {esc(n)}">{ic('ext')}</a></div></article>''' for k,n,d,u,key,en,uz,ru in works)
    work = f'''<section class="band"><div class="wrap">
<div class="row between" style="align-items:flex-end;margin-bottom:28px">{sh('h.wk.l','Selected work','Tanlangan ishlar','Избранные работы','h.wk.h','Real businesses, real sites','Haqiqiy bizneslar, haqiqiy saytlar','Настоящий бизнес — настоящие сайты')}
<div class="row" style="margin-bottom:clamp(28px,4vw,48px)"><button class="iconbtn" data-car="-1" aria-label="Previous">{ic('chevl')}</button><button class="iconbtn" data-car="1" aria-label="Next">{ic('chevr')}</button><a class="btn ghost sm" href="work.html">{T('h.wk.all','All work','Barcha ishlar','Все работы')}{ic('arrow')}</a></div></div>
<div class="carousel" id="car" tabindex="0" aria-label="Selected work">{wc}</div>
</div></section>'''

    J('w.save','Save word','So‘zni saqlash','Сохранить слово')
    J('w.saved','Saved to your Clive ID','Clive ID’ingizga saqlandi','Сохранено в ваш Clive ID')
    J('w.listen','Listen','Tinglash','Слушать')
    wotd = f'''<section class="band"><div class="wrap">
<div class="card" style="padding:clamp(22px,4vw,48px)"><div class="wotd">
<div><span class="label" style="--acc:var(--gold)">{ic('sparkle')}{T('h.wd.l','Word of the day, four ways','Kun so‘zi, to‘rt tilda','Слово дня на четырёх языках')}</span>
<div class="w mt2" id="wd-en">time</div>
{T('h.wd.p','One word in English, Uzbek, Russian and German. My students learn the first two, I’m learning the last one.','Bitta so‘z ingliz, o‘zbek, rus va nemis tillarida. O‘quvchilarim dastlabki ikkitasini o‘rganadi, men esa oxirgisini.','Одно слово на английском, узбекском, русском и немецком. Мои ученики учат первые два, я учу последний.','p','muted mt1')}
<div class="row mt2"><button class="btn ghost sm" id="wd-next">{ic('refresh')}{T('h.wd.next','Another word','Boshqa so‘z','Другое слово')}</button><button class="btn ghost sm" id="wd-save">{ic('heart')}<span>Save word</span></button></div></div>
<div class="tr" id="wd-tr"></div>
</div></div></div></section>'''

    shop = f'''<section class="band"><div class="wrap"><div class="shopt">
<img src="assets/img/shop/ebook-1.webp" alt="Technical Issues Q&amp;A eBook cover and pages" loading="lazy" width="1280" height="720" data-reveal>
<div data-reveal="100">{sh('h.sp.l','From the shop','Do‘kondan','Из магазина','h.sp.h','Technical Issues Q&amp;A','Texnik muammolar: savol-javob','Технические проблемы: вопросы и ответы')}
{T('h.sp.p','60 everyday tech problems: website errors, Word, Excel, Outlook, Teams, Wi-Fi and printers. Each one fits on a page with a diagram and a numbered fix.','60 ta kundalik texnik muammo: sayt xatolari, Word, Excel, Outlook, Teams, Wi-Fi va printerlar. Har biri bir sahifada, chizma va raqamlangan yechim bilan.','60 бытовых технических проблем: ошибки сайтов, Word, Excel, Outlook, Teams, Wi-Fi и принтеры. Каждая на одной странице, со схемой и пошаговым решением.','p','lead')}
<div class="row mt2"><span class="price">$9</span><span class="chip">{T('h.sp.c','78-page PDF · one-time','78 sahifali PDF · bir martalik','PDF на 78 страниц · разово')}</span></div>
<div class="row mt2"><a class="btn primary" style="--c:var(--rose)" href="{WHOP_EBOOK}" target="_blank" rel="noopener">{T('h.sp.buy','Get it on Whop','Whop’da olish','Купить на Whop')}{ic('ext')}</a><a class="btn ghost" href="shop.html">{T('h.sp.more','What’s inside','Ichida nima bor','Что внутри')}</a></div>
</div></div></div></section>'''

    cta = f'''<section class="band"><div class="wrap"><div class="cta" data-reveal>
{T('h.ct.h','Need a site, a class or a hand with something?','Sayt, dars yoki biror narsada yordam kerakmi?','Нужен сайт, урок или помощь?','h2')}
{T('h.ct.p','Telegram is the fastest way to reach me. I reply in Uzbek or English.','Menga eng tez Telegram orqali yetib borasiz. O‘zbek yoki ingliz tilida javob beraman.','Быстрее всего — в Telegram. Отвечаю на узбекском или английском.','p','lead')}
<div class="row"><a class="btn primary" href="{TG}" target="_blank" rel="noopener">{ic('send')}Telegram @clive077</a><a class="btn ghost" href="contact.html">{T('h.ct.b','Other ways','Boshqa yo‘llar','Другие способы')}{ic('arrow')}</a></div>
</div></div></section>'''
    return hero + marquee + now + bento + hats + facts + work + wotd + shop + cta

def build():
    return page('index', '', 'pt.home', 'Clive, just Clive', 'Clive, shunchaki Clive', 'Clive, просто Clive',
                'Clive (Baxriddin Imonqulov): English teacher, web developer and maker. ClivEdu, Sprachwerk, Vaqt and more in one orbit.',
                body(), CSS, ['assets/js/garden.js', 'assets/js/orbit.js', 'assets/js/home.js'])
