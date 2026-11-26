from lib import *
from p_data import PD, pd, P

ORBIT_CSS = '''
.const{position:relative;margin-top:8px}
.const svg{width:100%;height:auto;overflow:visible}
.const .ln{stroke:var(--line2);stroke-width:1.4;fill:none}
.const .lk{stroke-width:1.6;fill:none;stroke-dasharray:5 6}
.const .nd circle.o{fill:var(--card);stroke-width:2}
.const .nd text{font:700 15px var(--body);fill:var(--ink)}
.const .nd text.s{font:600 12px var(--body);fill:var(--sub)}
.const .pill rect{fill:var(--bg2);stroke:var(--line)}
.const .pill text{font:600 12px var(--body);fill:var(--sub)}
.const a:hover circle.o{stroke-width:3.5}
.conlist{display:none;list-style:none;margin:0;padding:0;gap:10px}
.conlist li{display:flex;gap:12px;align-items:flex-start;padding:14px;border-radius:16px;background:var(--card);border:1px solid var(--line)}
.conlist li i{width:10px;height:10px;border-radius:50%;margin-top:7px;flex:none;background:var(--c)}
@media(max-width:700px){.const{display:none}.conlist{display:grid}}
.prow{display:grid;grid-template-columns:1.05fr 1fr;gap:clamp(20px,3vw,44px);align-items:center}
.prow.flip>:first-child{order:2}
@media(max-width:860px){.prow{grid-template-columns:1fr}.prow.flip>:first-child{order:0}}
.prow .pic{position:relative;min-height:280px}
.prow .pic .browser{width:88%}
.prow .pic .phone{position:absolute;right:0;bottom:-18px;width:34%;min-width:120px;border-radius:30px;padding:7px}
.prow .pic .phone img{border-radius:24px}
.prow .pic .phone::before{width:50px;height:14px;top:12px}
.facts2{display:grid;grid-template-columns:auto 1fr;gap:8px 18px;margin:18px 0 22px;font-size:.95rem}
.facts2 dt{color:var(--mute);font-weight:700}
.facts2 dd{margin:0}
.vq-pic{display:grid;place-items:center;min-height:320px;border-radius:24px;background:radial-gradient(80% 80% at 50% 60%,color-mix(in srgb,var(--green) 18%,transparent),transparent 70%)}
.vq-pic svg{width:min(380px,100%)}
.ping .dot{background:var(--mute)}
.ping[data-s=up]{color:var(--green);border-color:color-mix(in srgb,var(--green) 40%,transparent)}
.ping[data-s=up] .dot{background:var(--green)}
'''

def orbit_body():
    # constellation diagram
    nodes = {
      'clive': (500, 300, 54, 'var(--blue)', 'Clive', None, 'index.html'),
      'vaqt': (500, 70, 34, 'var(--green)', 'Vaqt', 'pd.vaqt.tag', 'products/vaqt.html'),
      'clivedu': (210, 180, 34, 'var(--blue)', 'ClivEdu', 'pd.clivedu.tag', 'products/clivedu.html'),
      'class': (215, 430, 34, 'var(--turq)', 'ClivEdu Class', 'pd.class.tag', 'products/class.html'),
      'dilnura': (60, 530, 20, 'var(--turq)', 'Dilnura Edu', None, 'work.html'),
      'sprachwerk': (790, 180, 34, 'var(--gold)', 'Sprachwerk', 'pd.sprachwerk.tag', 'products/sprachwerk.html'),
      'vault': (785, 430, 30, 'var(--amber)', 'Vault Studio', 'pd.vault.tag', 'products/vault-studio.html'),
      'wv': (945, 530, 20, 'var(--rose)', 'WonderVault', None, YT),
      'shop': (500, 520, 28, 'var(--rose)', 'Whop shop', None, 'shop.html'),
    }
    J('o.l.style','same lesson style','bir xil dars uslubi','один стиль уроков')
    links = [
      ('clivedu','class','M210 214 L215 396','var(--turq)', 'o.l.style','same lesson style','bir xil dars uslubi','один стиль уроков', (150, 305)),
      ('class','dilnura','M190 455 L75 515','var(--turq)', 'o.l.engine','engine reused','dvigatel qayta ishlatilgan','тот же движок', (95, 470)),
      ('clivedu','sprachwerk','M244 186 Q500 250 756 186','var(--gold)', 'o.l.sync','same sign-in & progress sync','bir xil kirish va sinxronlash','один вход и синхронизация', (500, 214)),
      ('vaqt','clivedu','M470 84 Q330 90 240 160','var(--green)', 'o.l.focus','focus for study','o‘qish uchun fokus','фокус для учёбы', (330, 100)),
      ('vaqt','sprachwerk','M530 84 Q670 90 760 160','var(--green)', 'o.l.focus','focus for study','o‘qish uchun fokus','фокус для учёбы', (670, 100)),
      ('vault','wv','M810 450 L930 518','var(--rose)', 'o.l.videos','makes the videos','videolarni tayyorlaydi','делает видео', (905, 470)),
    ]
    svg = ['<svg viewBox="0 0 1000 580" role="img" aria-labelledby="ctitle"><title id="ctitle">How the Clive products connect</title>']
    for k,(x,y,r,c,n,sub,h) in nodes.items():
        if k in ('clive','dilnura','wv'): continue
        svg.append(f'<path class="ln" d="M500 300 L{x} {y}"/>')
    for a,b,d,c,key,en,uz,ru,(lx,ly) in links:
        svg.append(f'<path class="lk" d="{d}" style="stroke:{c}"/>')
    for k,(x,y,r,c,n,sub,h) in nodes.items():
        ext = h.startswith('http')
        tgt = ' target="_blank" rel="noopener"' if ext else ''
        inner = f'<circle class="o" cx="{x}" cy="{y}" r="{r}" style="stroke:{c}"/>'
        if k == 'clive':
            inner = f'<circle cx="{x}" cy="{y}" r="{r+26}" fill="color-mix(in srgb,var(--blue) 12%,transparent)"/>' + inner + f'<g transform="translate({x-30} {y-30}) scale(.94)">{mark("cm",64)}</g>'
        else:
            inner += f'<circle cx="{x}" cy="{y}" r="{max(6,r*.32)}" fill="{c}"/>'
        ty = y + r + 22
        inner += f'<text x="{x}" y="{ty}" text-anchor="middle">{esc(n)}</text>'
        if sub:
            en,uz,ru = PD[k]['tag']
            inner += f'<text class="s" x="{x}" y="{ty+17}" text-anchor="middle" data-i18n="{sub}">{esc(en)}</text>'
        svg.append(f'<a class="nd" href="{h}"{tgt}>{inner}</a>')
    for a,b,d,c,key,en,uz,ru,(lx,ly) in links:
        _ = T(key,en,uz,ru)
        w = len(en)*6.6+22
        svg.append(f'<g class="pill" transform="translate({lx} {ly})"><rect x="{-w/2:.0f}" y="-13" width="{w:.0f}" height="26" rx="13"/><text text-anchor="middle" y="4.5" data-i18n="{key}">{esc(en)}</text></g>')
    svg.append('</svg>')
    conl = ''.join(f'<li style="--c:{c}"><i></i><div><b>{esc(nodes[a][4])} ↔ {esc(nodes[b][4])}</b><br>{T(key,en,uz,ru,cls="muted")}</div></li>' for a,b,d,c,key,en,uz,ru,_ in links)

    hero = f'''<section class="phero"><div class="wrap">
<div class="crumbs"><a href="index.html">Clive</a>{ic('chevr')}<span>{T('nav.orbit','Orbit','Orbita','Орбита')}</span></div>
{T('o.h','The Clive orbit','Clive orbitasi','Орбита Clive','h1')}
{T('o.p','Five products and a shop, made by one person. What each one does, who it’s for, and how they help each other.','Bir inson yaratgan beshta mahsulot va do‘kon. Har biri nima qiladi, kim uchun va bir-biriga qanday yordam beradi.','Пять продуктов и магазин, сделанные одним человеком. Что делает каждый, для кого он и как они помогают друг другу.','p','lead')}
<div class="const card mt3" data-reveal>{''.join(svg)}</div>
<ul class="conlist mt2">{conl}</ul>
</div></section>'''

    rows = []
    order = ['vaqt','clivedu','class','sprachwerk','vault']
    for i,pid in enumerate(order):
        p = P(pid)
        if pid == 'vaqt':
            pic = f'<div class="vq-pic" id="vq-island" aria-hidden="true"></div>'
        else:
            dom = p['url'].replace('https://','').rstrip('/')
            pic = f'<div class="pic"><div class="browser"><div class="bar"><i></i><i></i><i></i><span>{dom}</span></div><img src="assets/img/{p["img"]}" alt="{esc(p["name"])} screenshot" loading="lazy" width="960" height="600"></div><div class="phone"><img src="assets/img/{p["phone"]}" alt="" loading="lazy" width="390" height="844"></div></div>'
        ext = p['ext']
        openb = f'<a class="btn primary" style="--c:{p["c"]};--ci:{p["ci"]}" href="{p["url"]}"{" target=_blank rel=noopener" if ext else ""}>{T("o.open","Open","Ochish","Открыть")} {p["name"]}{ic("ext" if ext else "arrow")}</a>'
        ping = f'<span class="chip ping" data-ping="{p["url"]}"><span class="dot"></span><span>{T("o.chk","Checking…","Tekshirilmoqda…","Проверяю…")}</span></span>' if ext else f'<span class="chip c" style="--c:var(--green)">{ic("sparkle")}{T("h.st.new","New today","Bugun yangi","Новинка")}</span>'
        rows.append(f'''<section class="band tight" id="{pid}"><div class="wrap prow{' flip' if i%2 else ''}">
<div data-reveal>{pic}</div>
<div data-reveal="80"><span class="label" style="--acc:{p['c']}">{ic(p['icon'])}{pd(pid,'tag')}</span>
<h2 class="mt1">{p['name']}</h2>
{pd(pid,'short','p','lead mt1')}
<dl class="facts2"><dt>{T('o.for','For','Kim uchun','Для кого')}</dt><dd>{pd(pid,'for')}</dd><dt>{T('o.on','Works on','Qayerda ishlaydi','Где работает')}</dt><dd>{pd(pid,'on')}</dd><dt>{T('o.langs','Languages','Tillar','Языки')}</dt><dd>{pd(pid,'langs')}</dd><dt>{T('o.price','Price','Narxi','Цена')}</dt><dd>{pd(pid,'price')}</dd></dl>
<div class="row">{openb}<a class="btn ghost" href="{p['page']}">{T('o.details','Details','Batafsil','Подробнее')}</a>{ping}</div>
</div></div></section>''')
    J('o.up','Online','Onlayn','Онлайн'); J('o.unk','Can’t check from here','Bu yerdan tekshirib bo‘lmaydi','Отсюда не проверить')

    # comparison table
    head = f'<tr><th>{T("o.t.p","Product","Mahsulot","Продукт")}</th><th>{T("o.for","For","Kim uchun","Для кого")}</th><th>{T("o.on","Works on","Qayerda ishlaydi","Где работает")}</th><th>{T("o.langs","Languages","Tillar","Языки")}</th><th>{T("o.t.sign","Sign-in","Kirish","Вход")}</th><th>{T("o.price","Price","Narxi","Цена")}</th></tr>'
    trs = ''.join(f'<tr><td><b>{P(pid)["name"]}</b></td><td>{pd(pid,"for")}</td><td>{pd(pid,"on")}</td><td>{pd(pid,"langs")}</td><td>{pd(pid,"sign")}</td><td>{pd(pid,"price")}</td></tr>' for pid in order)
    trs += f'<tr><td><b>{T("o.t.ebook","Q&amp;A eBook","Savol-javob kitobi","Книга вопросов и ответов")}</b></td><td>{T("o.t.ebook.f","People who fix their own tech problems","Texnik muammolarini o‘zi hal qiladiganlar","Тем, кто сам чинит технику")}</td><td>PDF</td><td>{T("o.t.en","English","Ingliz","Английский")}</td><td>Whop</td><td>$9</td></tr>'
    table = f'''<section class="band"><div class="wrap">
{sh('o.cmp.l','Side by side','Yonma-yon','Рядом','o.cmp.h','Which one is for you?','Qaysi biri siz uchun?','Что подойдёт вам?')}
<div class="card" style="padding:8px 18px" data-reveal><table class="stack"><thead>{head}</thead><tbody>{trs}</tbody></table></div>
</div></section>'''
    cta = f'''<section class="band"><div class="wrap"><div class="cta" style="--c:var(--green)" data-reveal>
{T('o.cta.h','Start with the newest planet','Eng yangi sayyoradan boshlang','Начните с самой новой планеты','h2')}
{T('o.cta.p','Vaqt needs no account. Pick a seed, press start, and keep the tab open.','Vaqt uchun hisob kerak emas. Urug‘ tanlang, boshlashni bosing va varaqni ochiq qoldiring.','Для Vaqt не нужен аккаунт. Выберите семя, нажмите «старт» и не закрывайте вкладку.','p','lead')}
<div class="row"><a class="btn primary" href="vaqt/index.html" style="--c:var(--green);--ci:#03170d">{ic('leaf')}{T('h.fc.cta','Start focusing','Fokusni boshlash','Начать фокус')}</a><a class="btn ghost" href="products/vaqt.html">{T('o.cta.b','What Vaqt can do','Vaqt nimalarni qila oladi','Что умеет Vaqt')}</a></div>
</div></div></section>'''
    return hero + ''.join(rows) + table + cta

ORBIT_JS = 'assets/js/orbitpage.js'

def build_orbit():
    return page('ecosystem', '', 'pt.orbit', 'The orbit', 'Orbita', 'Орбита',
                'All Clive products in one place: Vaqt, ClivEdu, ClivEdu Class, Sprachwerk and Vault Studio, and how they connect.',
                orbit_body(), ORBIT_CSS, ['assets/js/garden.js', ORBIT_JS])

# ------------------------------------------------------------------ work
WORK_CSS = '''
.filters{margin-bottom:28px}
.wgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
@media(max-width:820px){.wgrid{grid-template-columns:1fr}}
.wk{display:flex;flex-direction:column;gap:16px}
.wk[hidden]{display:none}
.wk .browser{transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.wk .browser:hover{transform:translateY(-4px)}
.wk h3{font-size:1.45rem}
.wk .meta{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap}
.wk ul{margin:0;padding-left:1.1em;color:var(--sub);display:grid;gap:6px}
.lab{grid-template-columns:repeat(5,minmax(0,1fr))}
@media(max-width:1100px){.lab{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:640px){.lab{grid-template-columns:1fr 1fr}}
@media(max-width:420px){.lab{grid-template-columns:1fr}}
.lab .card{padding:0}
.lab img{aspect-ratio:16/10;object-fit:cover;object-position:top;border-bottom:1px solid var(--line)}
.lab .in{padding:16px}
.lab h3{font-size:1rem}
.lab p{font-size:.88rem;margin-top:4px}
.steps{grid-template-columns:repeat(5,minmax(0,1fr));counter-reset:s}
@media(max-width:1000px){.steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.steps{grid-template-columns:1fr}}
.steps .card{min-height:200px}
'''

WORKS = [
 ('riva','hotel','RIVA HOTEL ANDIJON','https://rivehotel.netlify.app/','w.riva', 'Hotel · Andijan', 'Mehmonxona · Andijon', 'Отель · Андижан',
  ('A calm, mobile-first hotel site with an “at a glance” strip, stay facts and FAQ, and a bottom enquiry bar on phones.','Telefonga mo‘ljallangan sokin mehmonxona sayti: “bir qarashda” paneli, turar joy faktlari, FAQ va telefonda pastki so‘rov paneli.','Спокойный сайт отеля для телефонов: блок «коротко», факты о проживании, FAQ и нижняя панель запроса на телефонах.'),
  [('Working map pin with a copyable Plus Code','Nusxa olinadigan Plus Code bilan ishlaydigan xarita belgisi','Рабочая метка на карте с копируемым Plus Code'),('Gallery with previous/next and swipe','Oldingi/keyingi va surish bilan galereya','Галерея с листанием и свайпом'),('Booking enquiries through a Netlify Function','Netlify Function orqali bron so‘rovlari','Запросы на бронь через Netlify Function')],
  ['TypeScript','Zero dependencies','UZ · RU · EN','Netlify Functions']),
 ('robiya','shop','Robiya mebellari','https://andijonmebel.netlify.app/','w.robiya','Furniture store · Andijan','Mebel do‘koni · Andijon','Мебельный магазин · Андижан',
  ('A furniture store where an empty room furnishes itself as you scroll, then shows the room’s total with “add this whole room”.','Mebel do‘koni: siz aylantirganingiz sari bo‘sh xona jihozlanadi, so‘ng xonaning umumiy narxi va “butun xonani qo‘shish” tugmasi chiqadi.','Мебельный магазин: пустая комната обставляется сама, пока вы листаете, а затем показывает сумму и кнопку «добавить всю комнату».'),
  [('Room studio: drag real-scale furniture, see distances in cm','Xona studiyasi: haqiqiy o‘lchamdagi mebelni suring, masofani sm da ko‘ring','Студия комнаты: мебель в реальном масштабе, расстояния в см'),('Dowry (kelin sepi) bundles and a 3-step checkout','Kelin sepi to‘plamlari va 3 bosqichli buyurtma','Наборы приданого (келин сепи) и оформление в 3 шага'),('Orders go to Netlify Forms; nothing is charged online','Buyurtmalar Netlify Forms’ga tushadi; onlayn to‘lov olinmaydi','Заказы уходят в Netlify Forms; онлайн ничего не списывается')],
  ['TypeScript','Zero dependencies','UZ · RU · EN','Netlify Forms']),
 ('frans','food','Frans Burger','https://ffsand.netlify.app/','w.frans','Burger & coffee · Andijan','Burger va qahva · Andijon','Бургеры и кофе · Андижан',
  ('A burger and coffee shop with a new drink-and-burger pair on every visit, built layer by layer as you scroll, with a printed receipt.','Har tashrifda yangi ichimlik va burger jufti chiqadigan burger va qahva do‘koni: aylantirganingiz sari qatlam-baqatlam yig‘iladi va chek chiqadi.','Бургерная и кофейня: при каждом визите новая пара напиток + бургер, которая собирается слоями при прокрутке и печатает чек.'),
  [('Menu that opens on coffee before noon and food after, by Tashkent time','Toshkent vaqti bo‘yicha tushgacha qahva, keyin taomlar bilan ochiladigan menyu','Меню открывается на кофе до полудня и на еде после — по времени Ташкента'),('Burger, coffee, shawarma and hot-dog builders','Burger, qahva, shaurma va hot-dog konstruktorlari','Конструкторы бургеров, кофе, шаурмы и хот-догов'),('Split the bill, table QR ordering, orders to the shop’s Telegram','Hisobni bo‘lish, stol QR orqali buyurtma, buyurtmalar do‘kon Telegram’iga','Разделить счёт, заказ по QR со стола, заказы в Telegram заведения')],
  ['TypeScript','Zero dependencies','UZ · RU · EN','Telegram'],),
 ('tm','hotel','TM HOTEL','https://tmhotel.netlify.app/','w.tm','Boutique hotel · Andijan','Butik mehmonxona · Andijon','Бутик-отель · Андижан',
  ('A premium concept site for a boutique hotel. It stays honest: rates, phones and facilities read “to be confirmed” until the hotel confirms them.','Butik mehmonxona uchun premium konsept sayt. U halol: narxlar, telefonlar va qulayliklar mehmonxona tasdiqlamaguncha “tasdiqlanadi” deb turadi.','Премиальный концепт-сайт бутик-отеля. Он честный: цены, телефоны и удобства помечены «уточняется», пока отель их не подтвердит.'),
  [('Availability calendar the hotel updates by hand','Mehmonxona qo‘lda yangilaydigan bandlik taqvimi','Календарь занятости, который отель обновляет вручную'),('Enquiry form with an estimate, never a fake booking','Taxminiy narxli so‘rov shakli, soxta bron yo‘q','Форма запроса с оценкой, без фальшивых броней'),('Night mode and three languages','Tungi rejim va uch til','Ночной режим и три языка')],
  ['TypeScript','Zero dependencies','UZ · RU · EN','Netlify Functions']),
 ('dilnura','edu','Dilnura Edu','https://dilnuraedu.netlify.app/','w.dilnura','Class site for a teacher','O‘qituvchi uchun sinf sayti','Сайт класса для учителя',
  ('English lessons for a Navigate A1 Beginner class, built on my ClivEdu Class engine and handed to another teacher.','Navigate A1 Beginner sinfi uchun ingliz tili darslari: ClivEdu Class dvigatelim asosida qurilib, boshqa o‘qituvchiga topshirilgan.','Уроки английского для класса Navigate A1 Beginner на моём движке ClivEdu Class, переданные другому учителю.'),
  [('Teacher dashboard: students, payments by month, groups','O‘qituvchi paneli: o‘quvchilar, oylik to‘lovlar, guruhlar','Панель учителя: ученики, оплаты по месяцам, группы'),('Shared room plan with an automatic planner','Avtomatik rejalashtiruvchili umumiy xona rejasi','Общий план кабинета с автопланировщиком'),('Live class quiz on the board and phones, Telegram bot','Doska va telefonlarda jonli viktorina, Telegram bot','Живая викторина на доске и телефонах, Telegram-бот')],
  ['JavaScript','Netlify Blobs','Telegram bot','EN · UZ']),
 ('class','edu','ClivEdu Class','https://clivedu.me/','w.class','My own classroom','Mening sinfxonam','Мой собственный класс',
  ('The site my students use in every class. Lessons open on their phones when class starts, on the smart board at the front.','O‘quvchilarim har darsda foydalanadigan sayt. Dars boshlanganda telefonlarida ochiladi, oldinda aqlli doskada ham.','Сайт, которым мои ученики пользуются на каждом уроке. Уроки открываются на их телефонах, когда начинается занятие, и на доске.'),
  [('Class game with a code from the board','Doskadagi kod bilan sinf o‘yini','Игра класса по коду с доски'),('Points, levels and 12 badges','Ballar, darajalar va 12 ta nishon','Баллы, уровни и 12 значков'),('Runs on an old smart-board browser','Eski aqlli doska brauzerida ishlaydi','Работает в старом браузере интерактивной доски')],
  ['JavaScript','Telegram sign-in','EN + UZ','Netlify']),
 ('vault','tool','Vault Studio','https://wondervaultyoutube.netlify.app/','w.vault','Tool for my YouTube channel','YouTube kanalim uchun vosita','Инструмент для моего YouTube-канала',
  ('A browser video studio for WonderVault: scripts, a timeline with captions and transitions, exports and thumbnails.','WonderVault uchun brauzer video studiyasi: ssenariylar, subtitr va o‘tishli taymlayn, eksport va muqovalar.','Видеостудия в браузере для WonderVault: сценарии, монтаж с субтитрами и переходами, экспорт и обложки.'),
  [('Idea bank from the channel brief','Kanal brifidan g‘oyalar banki','Банк идей из брифа канала'),('Shorts and long-form projects','Shorts va uzun videolar loyihalari','Проекты Shorts и длинных видео'),('Works on phone and computer','Telefon va kompyuterda ishlaydi','Работает на телефоне и компьютере')],
  ['Single HTML page','No build step','Canvas','Netlify']),
 ('clivedu','edu','ClivEdu','https://mellifluous-elf-d3aaf0.netlify.app/','w.clivedu','English platform','Ingliz tili platformasi','Платформа английского',
  ('A personal English classroom among the stars: lessons with your own slides, a Word Galaxy, games and a teacher desk.','Yulduzlar orasidagi shaxsiy ingliz tili sinfi: o‘z slaydlaringiz bilan darslar, So‘z galaktikasi, o‘yinlar va o‘qituvchi stoli.','Личный класс английского среди звёзд: уроки на своих слайдах, Галактика слов, игры и стол учителя.'),
  [('35 starter lessons and 23 word sets with Uzbek','O‘zbekcha bilan 35 ta boshlang‘ich dars va 23 ta so‘z to‘plami','35 стартовых уроков и 23 набора слов с узбекским'),('Class arena for team games on the projector','Proyektorda jamoaviy o‘yinlar uchun sinf arenasi','Арена класса для командных игр на проекторе'),('Google sign-in, progress saved with Netlify Blobs','Google orqali kirish, natijalar Netlify Blobs’da saqlanadi','Вход через Google, прогресс хранится в Netlify Blobs')],
  ['JavaScript','Netlify Functions','Netlify Blobs','UZ · EN']),
]

LAB = [
 ('staypilot','StayPilot AI','https://fastidious-profiterole-01c63f.netlify.app/','w.l.sp','A landing page concept for an AI front desk for hotels.','Mehmonxonalar uchun AI qabulxona konsepti landing sahifasi.','Концепт лендинга ИИ-ресепшена для отелей.'),
 ('organizer','Organizer','https://precious-phoenix-f88a88.netlify.app/','w.l.org','Sort files by swiping: keep, trash, edit, or let it decide.','Fayllarni surib saralash: saqlash, o‘chirish, tahrirlash yoki o‘zi hal qilsin.','Сортировка файлов свайпом: оставить, удалить, править — или пусть решит само.'),
 ('cartwise','Cartwise','https://sprightly-sable-96968d.netlify.app/','w.l.cw','Grocery lists with prices in so‘m and a budget bar.','So‘mdagi narxlar va byudjet paneli bilan xarid ro‘yxatlari.','Списки покупок с ценами в сумах и шкалой бюджета.'),
 ('campuspulse','CampusPulse','https://funny-wisp-c98593.netlify.app/','w.l.cp','A university student hub concept: schedule, tasks, rooms.','Universitet talabalari uchun hub konsepti: jadval, vazifalar, xonalar.','Концепт хаба для студентов: расписание, задачи, аудитории.'),
 ('omninote','OmniNote','https://omninoteai2.netlify.app/','w.l.on','An iOS-style notes workspace with a scheduler.','Rejalashtiruvchili iOS uslubidagi eslatmalar ish maydoni.','Рабочее пространство заметок в стиле iOS с планировщиком.'),
]

def work_body():
    cats = [('all','w.f.all','All','Hammasi','Все'),('hotel','w.f.hotel','Hotels','Mehmonxonalar','Отели'),('shop','w.f.shop','Shops','Do‘konlar','Магазины'),('food','w.f.food','Food','Ovqatlanish','Еда'),('edu','w.f.edu','Education','Ta’lim','Образование'),('tool','w.f.tool','Tools','Vositalar','Инструменты')]
    tabs = ''.join(f'<button data-f="{c}" aria-pressed="{"true" if c=="all" else "false"}">{T(k,en,uz,ru)}</button>' for c,k,en,uz,ru in cats)
    cards = []
    for i,(img,cat,name,url,key,ten,tuz,tru,desc,feats,stack) in enumerate(WORKS):
        dom = url.replace('https://','').rstrip('/')
        fl = ''.join(f'<li>{T(f"{key}.f{j}",*ft)}</li>' for j,ft in enumerate(feats))
        st = ''.join(f'<span class="chip">{esc(s)}</span>' for s in stack)
        cards.append(f'''<article class="wk" data-cat="{cat}" data-reveal="{(i%2)*80}">
<a class="browser" href="{url}" target="_blank" rel="noopener"><div class="bar"><i></i><i></i><i></i><span>{dom}</span></div><img src="assets/img/work/{img}.webp" alt="{esc(name)} website screenshot" loading="lazy" width="960" height="600"></a>
<div class="meta"><div><h3>{esc(name)}</h3><span class="faint small">{T(key+'.t',ten,tuz,tru)}</span></div><a class="btn ghost sm" href="{url}" target="_blank" rel="noopener">{T('w.visit','Visit site','Saytga o‘tish','Открыть сайт')}{ic('ext')}</a></div>
{T(key+'.d',*desc,tag='p',cls='muted')}<ul>{fl}</ul><div class="row">{st}</div></article>''')
    lab = ''.join(f'''<a class="card glow" href="{u}" target="_blank" rel="noopener" data-reveal="{i*60}"><img src="assets/img/work/{k}.webp" alt="{esc(n)} screenshot" loading="lazy" width="960" height="600"><div class="in"><h3>{esc(n)}</h3>{T(key,en,uz,ru,'p')}</div></a>''' for i,(k,n,u,key,en,uz,ru) in enumerate(LAB))
    steps = [('listen','w.s1','Listen','Tinglash','Выслушать','What does the business sell, and which language do its customers speak?','Biznes nima sotadi va mijozlari qaysi tilda gapiradi?','Что продаёт бизнес и на каком языке говорят его клиенты?'),
             ('palette','w.s2','Design','Dizayn','Дизайн','Colours, type and one idea from the business’s own world, before any code.','Kodgacha: ranglar, shriftlar va biznesning o‘z dunyosidan bitta g‘oya.','Цвета, шрифты и одна идея из мира бизнеса — до любого кода.'),
             ('code','w.s3','Build','Qurish','Сборка','TypeScript or plain JavaScript, no heavy frameworks, fast on cheap phones.','TypeScript yoki oddiy JavaScript, og‘ir freymvorksiz, arzon telefonlarda ham tez.','TypeScript или чистый JavaScript, без тяжёлых фреймворков, быстро даже на дешёвых телефонах.'),
             ('rocket','w.s4','Launch','Ishga tushirish','Запуск','Netlify hosting, forms and orders straight to the owner’s Telegram.','Netlify hosting, shakllar va buyurtmalar to‘g‘ridan-to‘g‘ri egasining Telegram’iga.','Хостинг на Netlify, формы и заказы прямо в Telegram владельца.'),
             ('book','w.s5','Hand over','Topshirish','Передача','A README so the owner knows where to change prices, texts and photos.','Egasi narx, matn va rasmlarni qayerdan o‘zgartirishni bilishi uchun README.','README, чтобы владелец знал, где менять цены, тексты и фото.')]
    st = ''.join(f'<article class="card" data-reveal="{i*60}"><span class="ico">{ic(icn)}</span>{T(k+".h",en,uz,ru,"h3")}{T(k+".p",pen,puz,pru,"p")}</article>' for i,(icn,k,en,uz,ru,pen,puz,pru) in enumerate(steps))
    return f'''<section class="phero"><div class="wrap">
<div class="crumbs"><a href="index.html">Clive</a>{ic('chevr')}<span>{T('nav.work','Work','Ishlar','Работы')}</span></div>
{T('w.h','Websites for real businesses','Haqiqiy bizneslar uchun saytlar','Сайты для настоящего бизнеса','h1')}
{T('w.p','Hotels, a furniture store, a burger shop and classrooms. Mobile-first, fast, and in Uzbek, Russian and English.','Mehmonxonalar, mebel do‘koni, burger do‘koni va sinfxonalar. Avvalo telefon uchun, tez, o‘zbek, rus va ingliz tillarida.','Отели, мебельный магазин, бургерная и классы. Сначала для телефонов, быстро, на узбекском, русском и английском.','p','lead')}
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap">
<div class="tabs filters" role="group" aria-label="Filter">{tabs}</div>
<div class="grid wgrid" id="wgrid">{''.join(cards)}</div>
</div></section>
<section class="band"><div class="wrap">
{sh('w.lab.l','The lab','Laboratoriya','Лаборатория','w.lab.h','Experiments and concepts','Tajribalar va konseptlar','Эксперименты и концепты',('w.lab.p','Smaller things I built to try an idea. Some became parts of bigger projects.','G‘oyani sinash uchun qurgan kichikroq narsalarim. Ba’zilari kattaroq loyihalarning bir qismiga aylandi.','Небольшие вещи, которые я сделал, чтобы проверить идею. Некоторые стали частью больших проектов.'))}
<div class="grid lab">{lab}</div></div></section>
<section class="band"><div class="wrap">
{sh('w.how.l','How I build','Qanday quraman','Как я делаю','w.how.h','From first message to handover','Birinchi xabardan topshirishgacha','От первого сообщения до передачи')}
<div class="grid steps">{st}</div></div></section>
<section class="band"><div class="wrap"><div class="cta" data-reveal>
{T('w.cta.h','Want a site like these?','Shunga o‘xshash sayt kerakmi?','Хотите такой же сайт?','h2')}
{T('w.cta.p','Send me your business name, what you sell and the languages your customers use.','Biznesingiz nomi, nima sotishingiz va mijozlaringiz qaysi tillarda gapirishini yuboring.','Пришлите название бизнеса, что вы продаёте и на каких языках говорят ваши клиенты.','p','lead')}
<div class="row"><a class="btn primary" href="{TG}" target="_blank" rel="noopener">{ic('send')}Telegram @clive077</a><a class="btn ghost" href="contact.html">{T('nav.contact','Contact','Aloqa','Контакты')}{ic('arrow')}</a></div>
</div></div></section>'''

def build_work():
    return page('work', '', 'pt.work', 'Work', 'Ishlar', 'Работы',
                'Websites by Clive: RIVA HOTEL, TM HOTEL, Robiya mebellari, Frans Burger, Dilnura Edu and more, in Uzbek, Russian and English.',
                work_body(), WORK_CSS, ['assets/js/work.js'])
