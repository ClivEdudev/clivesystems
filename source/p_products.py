from lib import *
from p_data import PD, pd, P
from p_more import vaqt_icon

R = '../'
CSS = '''
.ph{display:grid;grid-template-columns:1fr 1.05fr;gap:clamp(24px,4vw,64px);align-items:center;padding-block:clamp(32px,6vw,80px) clamp(24px,4vw,56px)}
@media(max-width:900px){.ph{grid-template-columns:1fr}}
.ph .logo{width:72px;height:72px;border-radius:22px;overflow:hidden;margin-bottom:22px;box-shadow:0 14px 40px -14px var(--c)}
.ph .logo img,.ph .logo svg{width:100%;height:100%}
.ph .logo.ic{display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,var(--card));color:var(--c)}
.ph .logo.ic svg{width:38px;height:38px}
.ph h1{font-size:clamp(2.3rem,4.4vw,3.9rem);hyphens:manual}
.comp{position:relative;min-height:360px}
.comp .browser{width:86%}
.comp .phone{position:absolute;right:0;bottom:-28px;width:36%;min-width:130px;padding:8px;border-radius:32px}
.comp .phone img{border-radius:25px}
.comp .phone::before{width:56px;height:15px;top:13px}
.comp .halo{position:absolute;inset:-10% -5%;z-index:-1;background:radial-gradient(50% 50% at 60% 50%,color-mix(in srgb,var(--c) 30%,transparent),transparent 70%)}
.feats{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:980px){.feats{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.feats{grid-template-columns:1fr}}
.how{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:820px){.how{grid-template-columns:1fr}}
.how .card{border-top:3px solid var(--c)}
.how .n{font:700 2.4rem/1 var(--head);color:var(--c);opacity:.9;margin-bottom:14px;display:block}
.dt{display:grid;grid-template-columns:200px 1fr;gap:0}
.dt>*{padding:14px 0;border-bottom:1px solid var(--line)}
.dt dt{color:var(--mute);font-weight:700}
.dt dd{margin:0}
@media(max-width:560px){.dt{grid-template-columns:1fr}.dt dt{border:0;padding-bottom:0}}
.nextp{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.nextp a{flex:1;min-width:220px}
.nextp small{display:block;color:var(--mute);font-weight:700}
.nextp b{font:600 1.4rem/1.2 var(--head)}
.isl{display:grid;place-items:center;min-height:380px}
.isl svg{width:min(440px,100%)}
.species{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:900px){.species{grid-template-columns:1fr 1fr}}
.species .card{text-align:center;padding:14px}
.species .pv{height:150px;display:grid;place-items:center}
.species .pv svg{height:150px;width:auto}
.species b{font-family:var(--head);font-weight:600;display:block}
.keys{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 24px}
@media(max-width:600px){.keys{grid-template-columns:1fr}}
.keys div{display:flex;gap:12px;align-items:center;color:var(--sub)}
.keys .kbd{min-width:52px;text-align:center;padding:7px 8px;font-size:.82rem}
.labs{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:980px){.labs{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.labs{grid-template-columns:1fr}}
'''

def feat_grid(pid, feats, c):
    return '<div class="grid feats">' + ''.join(f'<article class="card glow" style="--c:{c}" data-reveal="{(i%3)*60}"><span class="ico">{ic(icn)}</span>{T(f"pp.{pid}.f{i}.h",*h,tag="h3")}{T(f"pp.{pid}.f{i}.p",*p,tag="p")}</article>' for i,(icn,h,p) in enumerate(feats)) + '</div>'

def how_grid(pid, steps, c):
    return '<div class="grid how">' + ''.join(f'<article class="card" style="--c:{c}" data-reveal="{i*80}"><span class="n">{i+1}</span>{T(f"pp.{pid}.h{i}.h",*h,tag="h3")}{T(f"pp.{pid}.h{i}.p",*p,tag="p")}</article>' for i,(h,p) in enumerate(steps)) + '</div>'

ORDER = ['vaqt','clivedu','class','sprachwerk','vault']

def product_page(pid, hero_pic, feats, steps, built, extra='', logo=None, open_label=None, sec_btn=''):
    p = P(pid); c = p['c']
    i = ORDER.index(pid); nx = P(ORDER[(i+1)%len(ORDER)]); pv = P(ORDER[(i-1)%len(ORDER)])
    url = p['url'] if p['ext'] else R + p['url']
    tgt = ' target="_blank" rel="noopener"' if p['ext'] else ''
    lg = logo or f'<div class="logo ic">{ic(p["icon"])}</div>'
    body = f'''<section class="wrap ph" style="--c:{c}">
<div data-reveal>
<div class="crumbs"><a href="{R}index.html">Clive</a>{ic('chevr')}<a href="{R}ecosystem.html">{T('nav.orbit','Orbit','Orbita','Орбита')}</a>{ic('chevr')}<span>{p['name']}</span></div>
{lg}
<span class="label" style="--acc:{c}">{ic(p['icon'])}{pd(pid,'tag')}</span>
<h1 class="mt1">{p['name']}</h1>
{pd(pid,'short','p','lead mt2')}
<div class="row mt3"><a class="btn primary" style="--c:{c};--ci:{p['ci']}" href="{url}"{tgt}>{open_label or (T('o.open','Open','Ochish','Открыть') + ' ' + p['name'])}{ic('ext' if p['ext'] else 'arrow')}</a>{sec_btn}</div>
<div class="row mt2"><span class="chip c" style="--c:{c}">{pd(pid,'price')}</span><span class="chip">{pd(pid,'langs')}</span></div>
</div>
<div data-reveal="100">{hero_pic}</div></section>
<section class="band"><div class="wrap" style="--acc:{c}">
{sh(f'pp.{pid}.fl','Inside','Ichida','Внутри',f'pp.{pid}.fh','What it does','Nima qiladi','Что умеет')}
{feat_grid(pid, feats, c)}</div></section>
<section class="band"><div class="wrap" style="--acc:{c}">
{sh(f'pp.{pid}.hl','How it works','Qanday ishlaydi','Как это работает',f'pp.{pid}.hh','Three steps','Uch qadam','Три шага')}
{how_grid(pid, steps, c)}</div></section>
{extra}
<section class="band"><div class="wrap grid g2" style="align-items:start;--acc:{c}">
<div>{sh(f'pp.{pid}.dl','Details','Tafsilotlar','Подробности',f'pp.{pid}.dh','The facts','Faktlar','Факты')}</div>
<dl class="dt card" data-reveal style="padding-block:6px">
<dt>{T('o.for','For','Kim uchun','Для кого')}</dt><dd>{pd(pid,'for')}</dd>
<dt>{T('o.on','Works on','Qayerda ishlaydi','Где работает')}</dt><dd>{pd(pid,'on')}</dd>
<dt>{T('o.langs','Languages','Tillar','Языки')}</dt><dd>{pd(pid,'langs')}</dd>
<dt>{T('o.t.sign','Sign-in','Kirish','Вход')}</dt><dd>{pd(pid,'sign')}</dd>
<dt>{T('o.price','Price','Narxi','Цена')}</dt><dd>{pd(pid,'price')}</dd>
<dt>{T('pp.built','Built with','Nima bilan qurilgan','Сделано на')}</dt><dd>{esc(built)}</dd>
</dl></div></section>
<section class="band tight"><div class="wrap nextp">
<a class="card glow" style="--c:{pv['c']}" href="{R}{pv['page']}"><small>{T('pp.prev','Previous planet','Oldingi sayyora','Предыдущая планета')}</small><b>← {pv['name']}</b></a>
<a class="card glow" style="--c:{nx['c']};text-align:right" href="{R}{nx['page']}"><small>{T('pp.next','Next planet','Keyingi sayyora','Следующая планета')}</small><b>{nx['name']} →</b></a>
</div></section>'''
    return body

def comp(pid, dom):
    p = P(pid)
    return f'<div class="comp" style="--c:{p["c"]}"><div class="halo"></div><div class="browser"><div class="bar"><i></i><i></i><i></i><span>{dom}</span></div><img src="{R}assets/img/{p["img"]}" alt="{esc(p["name"])} on a computer" width="960" height="600"></div><div class="phone"><img src="{R}assets/img/{p["phone"]}" alt="{esc(p["name"])} on a phone" width="390" height="844" loading="lazy"></div></div>'

def build_all():
    out = {}
    # ---------------- ClivEdu
    feats = [
     ('star',('Word Galaxy','So‘z galaktikasi','Галактика слов'),('Every word you learn becomes a star. Similar words link up into constellations.','O‘rgangan har bir so‘zingiz yulduzga aylanadi. O‘xshash so‘zlar yulduz turkumlariga bog‘lanadi.','Каждое выученное слово становится звездой. Похожие слова складываются в созвездия.')),
     ('book',('Slide lessons','Slayd darslar','Уроки-слайды'),('Lessons from the teacher’s own slides. The first slides are a free preview; the rest unlock with access.','O‘qituvchining o‘z slaydlaridan darslar. Dastlabki slaydlar bepul ko‘rinadi, qolgani ruxsat bilan ochiladi.','Уроки на слайдах учителя. Первые слайды — бесплатный предпросмотр, остальные открываются с доступом.')),
     ('game',('Games and class arena','O‘yinlar va sinf arenasi','Игры и арена класса'),('Solo games, plus a class arena on the projector: pick a game, a word set and teams; keys 1–6 give points.','Yakka o‘yinlar va proyektordagi sinf arenasi: o‘yin, so‘z to‘plami va jamoalarni tanlang; 1–6 tugmalari ball beradi.','Одиночные игры и арена класса на проекторе: выберите игру, набор слов и команды; клавиши 1–6 дают баллы.')),
     ('bell',('Homework with notifications','Bildirishnomali uy vazifasi','Домашка с уведомлениями'),('Send homework to the class, a group or chosen students. They see a badge and, if they opt in, a notification.','Uy vazifasini sinfga, guruhga yoki tanlangan o‘quvchilarga yuboring. Ular belgi va, xohlasa, bildirishnoma oladi.','Отправляйте задания классу, группе или отдельным ученикам. Они увидят значок и, по желанию, уведомление.')),
     ('users',('Teacher desk','O‘qituvchi stoli','Стол учителя'),('Lessons, students, levels A1–C1, groups, vocabulary and announcements, all live without a redeploy.','Darslar, o‘quvchilar, A1–C1 darajalar, guruhlar, lug‘at va e’lonlar — hammasi qayta joylashtirmasdan darhol.','Уроки, ученики, уровни A1–C1, группы, словарь и объявления — всё сразу, без передеплоя.')),
     ('user',('Student profiles','O‘quvchi profillari','Профили учеников'),('24 illustrated characters or a real photo, a poster to show off progress, and a level only the teacher sets.','24 ta chizilgan qahramon yoki haqiqiy surat, natijani ko‘rsatish uchun poster va faqat o‘qituvchi belgilaydigan daraja.','24 нарисованных персонажа или фото, постер с прогрессом и уровень, который ставит только учитель.')),
     ('refresh',('Progress that follows you','Siz bilan yuradigan natijalar','Прогресс всегда с вами'),('XP, streaks, words and badges are saved on the account and move between devices.','XP, seriyalar, so‘zlar va nishonlar hisobda saqlanadi va qurilmalar orasida ko‘chadi.','XP, серии, слова и значки хранятся в аккаунте и переходят между устройствами.')),
     ('globe',('Uzbek first','Avval o‘zbekcha','Сначала по-узбекски'),('Menus and word translations open in Uzbek. One tap switches to English.','Menyular va so‘z tarjimalari o‘zbekcha ochiladi. Bir bosish bilan inglizchaga o‘tadi.','Меню и переводы слов открываются на узбекском. Одно касание — и всё на английском.')),
     ('cards',('35 lessons, 23 word sets','35 dars, 23 so‘z to‘plami','35 уроков, 23 набора слов'),('Starter lessons and word sets come built in, all with Uzbek translations.','Boshlang‘ich darslar va so‘z to‘plamlari ichida bor, hammasi o‘zbekcha tarjimalar bilan.','Стартовые уроки и наборы слов уже встроены, все с переводом на узбекский.')),
    ]
    steps = [(('The teacher adds a lesson','O‘qituvchi dars qo‘shadi','Учитель добавляет урок'),('Upload the slides as a PDF (and the PowerPoint), paste the new words, choose who can see it.','Slaydlarni PDF (va PowerPoint) sifatida yuklang, yangi so‘zlarni joylang, kim ko‘rishini tanlang.','Загрузите слайды в PDF (и PowerPoint), вставьте новые слова, выберите, кому доступно.')),
             (('Students sign in and learn','O‘quvchilar kirib o‘rganadi','Ученики входят и учатся'),('With email or Google. They study the slides, play the games and save words.','Email yoki Google orqali. Slaydlarni o‘rganadi, o‘yin o‘ynaydi va so‘zlarni saqlaydi.','Через email или Google. Изучают слайды, играют и сохраняют слова.')),
             (('The galaxy grows','Galaktika o‘sadi','Галактика растёт'),('Every word becomes a star. Homework and the arena keep the class moving.','Har bir so‘z yulduzga aylanadi. Uy vazifasi va arena sinfni harakatda ushlaydi.','Каждое слово — звезда. Домашка и арена не дают классу стоять на месте.'))]
    out['clivedu'] = product_page('clivedu', comp('clivedu','clivedu · netlify.app'), feats, steps, 'HTML, CSS, JavaScript · Netlify Functions · Netlify Blobs · Google Identity · pdf.js',
        logo=f'<div class="logo"><img src="{R}assets/img/clivedu-logo.webp" alt="ClivEdu logo" width="72" height="72"></div>')

    # ---------------- ClivEdu Class
    feats = [
     ('phone',('Opens when class starts','Dars boshlanganda ochiladi','Открывается со звонком'),('The lesson opens on every student’s phone the moment class begins.','Dars boshlanishi bilan har bir o‘quvchining telefonida ochiladi.','Урок открывается на телефоне каждого ученика в момент начала занятия.')),
     ('board',('Made for the smart board','Aqlli doska uchun','Для интерактивной доски'),('It runs on the old built-in browser of the classroom’s smart board.','Sinfdagi aqlli doskaning eski ichki brauzerida ishlaydi.','Работает во встроенном старом браузере доски в классе.')),
     ('game',('Class game','Sinf o‘yini','Игра класса'),('A live quiz on the board; students join with a code and answer on their phones.','Doskada jonli viktorina; o‘quvchilar kod bilan qo‘shilib, telefonda javob beradi.','Живая викторина на доске; ученики входят по коду и отвечают с телефонов.')),
     ('calendar',('Daily challenge','Kunlik sinov','Ежедневный вызов'),('Two minutes a day to keep the streak going.','Seriyani davom ettirish uchun kuniga ikki daqiqa.','Две минуты в день, чтобы серия не прерывалась.')),
     ('target',('Practice','Mashq','Практика'),('Play the lesson games alone, any time.','Dars o‘yinlarini istalgan vaqtda yakka o‘ynang.','Играйте в игры урока сами, в любое время.')),
     ('cards',('Word bank','So‘z banki','Банк слов'),('Flashcards for every word, with Uzbek on the back.','Har bir so‘z uchun kartochkalar, orqasida o‘zbekcha.','Карточки для каждого слова, на обороте — узбекский.')),
     ('trophy',('Levels and 12 badges','Darajalar va 12 nishon','Уровни и 12 значков'),('Points, streaks and badges like “Five lessons” and “7 days in a row”.','Ballar, seriyalar va “Besh dars”, “7 kun ketma-ket” kabi nishonlar.','Баллы, серии и значки вроде «Пять уроков» и «7 дней подряд».')),
     ('send',('Sign in with Telegram','Telegram orqali kirish','Вход через Telegram'),('Keep points and badges on every phone.','Ballar va nishonlarni har bir telefonda saqlang.','Баллы и значки сохраняются на любом телефоне.')),
     ('globe',('Uzbek in every lesson','Har darsda o‘zbekcha','Узбекский в каждом уроке'),('Translations everywhere; Beginner lessons stick to what the group already knows.','Hamma joyda tarjimalar; Beginner darslari guruh bilgan narsaga tayanadi.','Переводы везде; уроки Beginner опираются на то, что группа уже знает.')),
    ]
    steps = [(('Pick your group','Guruhingizni tanlang','Выберите группу'),('Elementary (Mon, Thu, Fri 14:00) or Beginner (Mon, Thu 15:30).','Elementary (Du, Pa, Ju 14:00) yoki Beginner (Du, Pa 15:30).','Elementary (Пн, Чт, Пт 14:00) или Beginner (Пн, Чт 15:30).')),
             (('Class starts','Dars boshlanadi','Урок начинается'),('Today’s lesson opens on your phone and on the board at the same time.','Bugungi dars telefoningizda va doskada bir vaqtda ochiladi.','Сегодняшний урок открывается на телефоне и на доске одновременно.')),
             (('Play, earn, revise','O‘yna, yig‘, takrorla','Играй, копи, повторяй'),('Answer in the class game, collect points, and revise any lesson later on your road.','Sinf o‘yinida javob bering, ball yig‘ing va istalgan darsni keyinroq takrorlang.','Отвечайте в игре класса, копите баллы и повторяйте любой урок позже.'))]
    extra = f'''<section class="band tight"><div class="wrap"><div class="cta" style="--c:var(--turq)" data-reveal>
{T('pp.class.x.h','See this week’s timetable','Shu haftaning jadvalini ko‘ring','Расписание на эту неделю','h2')}
{T('pp.class.x.p','Both groups, on Tashkent time, with a live countdown to the next lesson.','Ikkala guruh, Toshkent vaqti bilan, keyingi darsgacha jonli hisoblagich bilan.','Обе группы по ташкентскому времени и живой отсчёт до следующего урока.','p','lead')}
<div class="row"><a class="btn primary" style="--c:var(--turq);--ci:#02201e" href="{R}learn.html">{T('h.nc.cta','Timetable','Dars jadvali','Расписание')}{ic('arrow')}</a></div></div></div></section>'''
    out['class'] = product_page('class', comp('class','clivedu.me'), feats, steps, 'JavaScript lesson engine · Netlify · Telegram login · live quiz rounds', extra,
        logo=f'<div class="logo"><img src="{R}assets/img/clivedu-logo.webp" alt="ClivEdu Class logo" width="72" height="72"></div>', open_label=T('pp.class.open','Open clivedu.me','clivedu.me’ni ochish','Открыть clivedu.me'))

    # ---------------- Sprachwerk
    feats = [
     ('train',('Linie A1','Linie A1','Linie A1'),('A metro line through 13 stations that follow the Goethe A1 topics, from Laute to Reisen.','Goethe A1 mavzulari bo‘yicha 13 bekatli metro chizig‘i: Laute’dan Reisen’gacha.','Линия метро из 13 станций по темам Goethe A1: от Laute до Reisen.')),
     ('board',('Slide lessons','Slayd darslar','Уроки-слайды'),('Grammar as slides: the formula, colour-coded examples, and a “Warum?” slide on why German works that way.','Grammatika slaydlarda: formula, rangli misollar va nemis tili nega shunday ekani haqida “Warum?” slaydi.','Грамматика в слайдах: формула, цветные примеры и слайд «Warum?» о том, почему в немецком так.')),
     ('refresh',('Review','Takrorlash','Повторение'),('Words come back when you’re about to forget them.','So‘zlar unutayotganingizda qaytib keladi.','Слова возвращаются, когда вы вот-вот их забудете.')),
     ('send',('Berlin Missions','Berlin Missions','Berlin Missions'),('Voiced role-plays: café, train station, doctor, hotel, a party.','Ovozli rolli o‘yinlar: kafe, vokzal, shifokor, mehmonxona, ziyofat.','Озвученные ролевые сценки: кафе, вокзал, врач, отель, вечеринка.')),
     ('mic',('Shadow Studio','Shadow Studio','Shadow Studio'),('Speak along with native audio, karaoke-style, then get scored.','Karaoke uslubida asl audio bilan birga gapiring va baho oling.','Говорите вместе с носителем, как в караоке, и получайте оценку.')),
     ('headphones',('Lazy Mode','Lazy Mode','Lazy Mode'),('A hands-free audio loop. Put the phone down and just listen.','Qo‘l tegizmasdan audio aylanma. Telefonni qo‘ying va shunchaki tinglang.','Аудио без рук. Положите телефон и просто слушайте.')),
     ('star',('Memory Galaxy','Memory Galaxy','Memory Galaxy'),('Every word is a star; watch your forgetting curve live.','Har bir so‘z yulduz; unutish egri chizig‘ingizni jonli kuzating.','Каждое слово — звезда; следите за кривой забывания вживую.')),
     ('bridge',('English Bridge','English Bridge','English Bridge'),('Decode German with your English: water → Wasser, ten → zehn.','Nemischani inglizchangiz bilan oching: water → Wasser, ten → zehn.','Расшифровывайте немецкий через английский: water → Wasser, ten → zehn.')),
     ('radar',('Genus Radar','Genus Radar','Genus Radar'),('Type any noun; the radar predicts der, die or das from its ending.','Istalgan otni yozing; radar oxiriga qarab der, die yoki das ni taxmin qiladi.','Введите любое существительное — радар угадает der, die или das по окончанию.')),
     ('wave',('Sound Lab','Sound Lab','Sound Lab'),('The alphabet, umlauts and minimal-pair ear training.','Alifbo, umlautlar va minimal juftliklar bilan eshitish mashqi.','Алфавит, умлауты и тренировка слуха на минимальных парах.')),
     ('game',('Games','O‘yinlar','Игры'),('Der·Die·Das Rush, Memory, Blitz and Zahlen-Funk.','Der·Die·Das Rush, Memory, Blitz va Zahlen-Funk.','Der·Die·Das Rush, Memory, Blitz и Zahlen-Funk.')),
     ('clock',('Hear the time','Vaqtni eshiting','Услышать время'),('Tap the clock on the start screen to hear the time in German.','Bosh ekrandagi soatni bosing — vaqtni nemischa eshitasiz.','Нажмите на часы на главном экране, чтобы услышать время по-немецки.')),
    ]
    steps = [(('Start at the Sound Lab','Sound Lab’dan boshlang','Начните с Sound Lab'),('Ten minutes with the sounds makes every word after it easier to read aloud.','Tovushlar bilan o‘n daqiqa keyingi har bir so‘zni ovoz chiqarib o‘qishni osonlashtiradi.','Десять минут со звуками — и каждое следующее слово легче читать вслух.')),
             (('Ride the line','Chiziq bo‘ylab yuring','Едьте по линии'),('One station at a time: greetings, numbers, family, food, the city.','Bekatma-bekat: salomlashish, sonlar, oila, ovqat, shahar.','Станция за станцией: приветствия, числа, семья, еда, город.')),
             (('Review and speak','Takrorlang va gapiring','Повторяйте и говорите'),('Daily review, then speak along in Shadow Studio and the Berlin Missions.','Kunlik takrorlash, keyin Shadow Studio va Berlin Missions’da birga gapiring.','Ежедневное повторение, затем говорите в Shadow Studio и Berlin Missions.'))]
    extra = f'''<section class="band tight"><div class="wrap"><div class="card" style="--c:var(--gold)" data-reveal>
<ul class="list-check" style="--c:var(--gold)">
<li>{ic('wifi')}{T('pp.sw.n1','Works offline after the first visit, and installs like an app.','Birinchi tashrifdan keyin oflayn ishlaydi va ilova kabi o‘rnatiladi.','Работает офлайн после первого визита и устанавливается как приложение.')}</li>
<li>{ic('mic')}{T('pp.sw.n2','Pronunciation scoring uses the browser’s German speech recognition; Chrome on desktop or Android works best.','Talaffuzni baholash brauzerning nemischa nutqni tanish funksiyasidan foydalanadi; kompyuter yoki Android’dagi Chrome eng yaxshi ishlaydi.','Оценка произношения использует распознавание немецкой речи в браузере; лучше всего — Chrome на компьютере или Android.')}</li>
<li>{ic('cloud')}{T('pp.sw.n3','Progress stays in your browser; optional Google sign-in merges it between devices without overwriting.','Natijalar brauzeringizda qoladi; ixtiyoriy Google orqali kirish ularni qurilmalar orasida ustiga yozmasdan birlashtiradi.','Прогресс хранится в браузере; вход через Google по желанию объединяет его между устройствами без перезаписи.')}</li>
</ul></div></div></section>'''
    out['sprachwerk'] = product_page('sprachwerk', comp('sprachwerk','sprachwerkclive.netlify.app'), feats, steps, 'HTML, CSS, JavaScript · service worker · Web Speech API · Netlify Functions · Netlify Blobs', extra,
        logo=f'<div class="logo"><img src="{R}assets/img/sprachwerk-logo.webp" alt="Sprachwerk logo" width="72" height="72"></div>')

    # ---------------- Vault Studio
    feats = [
     ('pen',('Script','Ssenariy','Сценарий'),('Write the script for a Short or a long video right next to the edit.','Shorts yoki uzun video ssenariysini montaj yonida yozing.','Пишите сценарий Short или длинного видео прямо рядом с монтажом.')),
     ('scissors',('Timeline','Taymlayn','Монтаж'),('Edit on a timeline with captions and transitions.','Subtitr va o‘tishlar bilan taymlaynda montaj qiling.','Монтируйте на таймлайне с субтитрами и переходами.')),
     ('download',('Export','Eksport','Экспорт'),('Export the finished video to your device.','Tayyor videoni qurilmangizga eksport qiling.','Экспортируйте готовое видео на устройство.')),
     ('image',('Thumbnails','Muqovalar','Обложки'),('Make the thumbnail in the same place.','Muqovani shu yerning o‘zida yasang.','Делайте обложку там же.')),
     ('sparkle',('Idea bank','G‘oyalar banki','Банк идей'),('Video ideas from the WonderVault brief, ready to start with one tap.','WonderVault brifidan video g‘oyalari, bir bosishda boshlashga tayyor.','Идеи видео из брифа WonderVault — старт одним касанием.')),
     ('phone',('Phone and computer','Telefon va kompyuter','Телефон и компьютер'),('The same studio on both screens.','Ikkala ekranda bir xil studiya.','Одна и та же студия на обоих экранах.')),
    ]
    steps = [(('Pick an idea','G‘oya tanlang','Выберите идею'),('Start from the idea bank or a blank Short or long-form project.','G‘oyalar bankidan yoki bo‘sh Shorts yoki uzun video loyihasidan boshlang.','Начните из банка идей или с пустого проекта Short или длинного видео.')),
             (('Write and edit','Yozing va montaj qiling','Пишите и монтируйте'),('Script, then cut it together with captions and transitions.','Ssenariy yozing, so‘ng subtitr va o‘tishlar bilan yig‘ing.','Сценарий, затем монтаж с субтитрами и переходами.')),
             (('Export and post','Eksport qiling va joylang','Экспорт и публикация'),('Export the video and thumbnail, then publish to WonderVault.','Video va muqovani eksport qilib, WonderVault’ga joylang.','Экспортируйте видео и обложку и публикуйте на WonderVault.'))]
    extra = f'''<section class="band tight"><div class="wrap"><div class="cta" style="--c:var(--amber)" data-reveal>
{T('pp.vault.x.h','WonderVault on YouTube','YouTube’da WonderVault','WonderVault на YouTube','h2')}
{T('pp.vault.x.p','Amazing facts and mysteries, in English, as Shorts and long videos. This studio makes them.','Ajoyib faktlar va sirlar, ingliz tilida, Shorts va uzun videolar ko‘rinishida. Bu studiya ularni yaratadi.','Удивительные факты и тайны на английском — Shorts и длинные видео. Их делает эта студия.','p','lead')}
<div class="row"><a class="btn primary" style="--c:var(--amber);--ci:#1b0d00" href="{YT}" target="_blank" rel="noopener">{ic('youtube')}@wondervaultclive{ic('ext')}</a></div></div></div></section>'''
    out['vault'] = product_page('vault', comp('vault','wondervaultyoutube.netlify.app'), feats, steps, 'One static HTML page · Canvas · browser storage · Netlify', extra)

    # ---------------- Vaqt
    feats = [
     ('leaf',('Grow a garden','Bog‘ o‘stiring','Растите сад'),('Twenty Uzbek plants in five rarity tiers, from lola to the eight-point star flower. About one session in 25 grows a golden one.','Beshta noyoblik darajasidagi yigirmata o‘zbek o‘simligi: loladan sakkiz qirrali yulduzgulgacha. Taxminan har 25 sessiyadan biri oltin o‘simlik beradi.','Двадцать узбекских растений пяти уровней редкости, от лолы до восьмиконечного звёздного цветка. Примерно каждая 25-я сессия даёт золотое.')),
     ('store',('The Bazaar','Bozor','Базар'),('Spend focus coins on seeds, twelve decorations, six sceneries and streak freezes.','Fokus tangalarini urug‘lar, o‘n ikkita bezak, oltita manzara va seriya himoyasiga sarflang.','Тратьте монеты фокуса на семена, двенадцать украшений, шесть пейзажей и заморозки серии.')),
     ('star',('Levels and daily quests','Darajalar va kunlik topshiriqlar','Уровни и ежедневные задания'),('Every focused minute is XP. Climb from Seed to Elder chinor, and pick up three fresh quests each day.','Har bir fokusli daqiqa XP beradi. Urug‘dan Keksa chinorgacha ko‘tariling va har kuni uchta yangi topshiriq oling.','Каждая минута фокуса — это XP. Растите от Семени до Старой чинары и берите три новых задания каждый день.')),
     ('trophy',('55 awards','55 ta yutuq','55 наград'),('Bronze to diamond, across growth, time, streaks, depth, habits and more. Each one pays out coins.','Bronzadan olmosgacha: o‘sish, vaqt, seriyalar, chuqurlik, odatlar va boshqalar. Har biri tanga beradi.','От бронзы до бриллианта: рост, время, серии, глубина, привычки и другое. Каждая приносит монеты.')),
     ('shield',('Deep focus','Chuqur fokus','Глубокий фокус'),('Strict: leave the tab and your plant wilts. Gentle: it only counts the interruptions.','Qat’iy: varaqni tark etsangiz, o‘simlik so‘liydi. Yumshoq: faqat chalg‘ishlar sanaladi.','Строгий: ушли с вкладки — растение вянет. Мягкий: только считаются отвлечения.')),
     ('timer',('Three ways to time','Vaqtni o‘lchashning uch usuli','Три режима времени'),('Timer with one-tap presets, Pomodoro cycles with short and long breaks, or Flow that counts up.','Bir bosishda tanlanadigan taymer, qisqa va uzun tanaffusli Pomodoro yoki oldinga sanaydigan Flow.','Таймер с быстрыми пресетами, циклы Pomodoro с короткими и длинными перерывами или Flow со счётом вверх.')),
     ('sun',('A living dial','Jonli siferblat','Живой циферблат'),('The sky in the dial follows your time of day. Breaks bring a breathing circle and a stretch tip.','Siferblatdagi osmon kun vaqtiga qarab o‘zgaradi. Tanaffusda nafas doirasi va cho‘zilish maslahati chiqadi.','Небо в циферблате меняется со временем суток. В перерывах — дыхательный круг и совет размяться.')),
     ('tag',('Tags and tasks','Teglar va vazifalar','Теги и задачи'),('See where your hours go, pick a task, focus on it and tick it off.','Soatlaringiz qayerga ketishini ko‘ring, vazifani tanlang, unga e’tibor qarating va belgilang.','Смотрите, куда уходят часы, выбирайте задачу, сосредоточьтесь и отметьте её.')),
     ('chart',('Stats','Statistika','Статистика'),('The week by tag, a month calendar, your best hours, how focused you felt, and a 26-week heatmap.','Teglar bo‘yicha hafta, oylik taqvim, eng samarali soatlaringiz, fokus hissiyotingiz va 26 haftalik xarita.','Неделя по тегам, календарь месяца, лучшие часы, ваши оценки фокуса и тепловая карта за 26 недель.')),
     ('clock',('Time tracker','Vaqt hisoblagichi','Трекер времени'),('Log time you spent away from the screen, edit any session, export to CSV.','Ekrandan tashqarida o‘tkazgan vaqtni yozing, istalgan sessiyani tahrirlang, CSV ga eksport qiling.','Записывайте время вне экрана, правьте любую сессию, экспортируйте в CSV.')),
     ('headphones',('Sounds and mini timer','Ovozlar va mini taymer','Звуки и мини-таймер'),('Rain, brown noise, waves, fireplace, wind and a clock, made live in the browser, plus a floating timer window where supported.','Yomg‘ir, jigarrang shovqin, to‘lqinlar, gulxan, shamol va soat brauzerda jonli yaratiladi; qo‘llansa, suzuvchi taymer oynasi ham bor.','Дождь, коричневый шум, волны, камин, ветер и часы создаются в браузере; где поддерживается — плавающее окно таймера.')),
     ('wifi',('Offline and private','Oflayn va shaxsiy','Офлайн и приватно'),('Works without internet and installs like an app. Your data stays on your device unless you sync it.','Internetsiz ishlaydi va ilova kabi o‘rnatiladi. Sinxronlamaguningizcha ma’lumotlaringiz qurilmangizda qoladi.','Работает без интернета и ставится как приложение. Данные остаются на устройстве, пока вы их не синхронизируете.')),
    ]
    steps = [(('Choose a seed and a tag','Urug‘ va teg tanlang','Выберите семя и тег'),('Set the time on the dial, pick what you’re working on.','Siferblatda vaqtni belgilang, nima ustida ishlayotganingizni tanlang.','Задайте время на циферблате и выберите, над чем работаете.')),
             (('Press start, stay','Boshlashni bosing, qoling','Нажмите старт и останьтесь'),('Keep the tab open. Your plant grows in real time.','Varaqni ochiq qoldiring. O‘simligingiz real vaqtda o‘sadi.','Не закрывайте вкладку. Растение растёт в реальном времени.')),
             (('Watch the garden grow','Bog‘ o‘sishini kuzating','Смотрите, как растёт сад'),('Every session lands in your garden and your stats.','Har bir sessiya bog‘ingizga va statistikangizga tushadi.','Каждая сессия попадает в ваш сад и статистику.'))]
    keys = [('Space',('Start or pause','Boshlash yoki pauza','Старт или пауза')),('1 · 2 · 3',('Timer, Pomodoro, Flow','Taymer, Pomodoro, Flow','Таймер, Pomodoro, Flow')),('↑ ↓',('Add or remove 5 minutes','5 daqiqa qo‘shish yoki ayirish','Прибавить или убавить 5 минут')),('F',('Full screen','To‘liq ekran','Полный экран')),('M',('Sounds on or off','Ovozlarni yoqish yoki o‘chirish','Звуки вкл. или выкл.')),('G · B · A',('Garden, Bazaar, awards','Bog‘, bozor, yutuqlar','Сад, базар, награды')),('S · T',('Stats, tasks','Statistika, vazifalar','Статистика, задачи'))]
    kk = ''.join(f'<div><span class="kbd">{esc(k)}</span>{T(f"pp.vaqt.k{i}",*v)}</div>' for i,(k,v) in enumerate(keys))
    extra = f'''<section class="band"><div class="wrap" style="--acc:var(--green)">
{sh('pp.vaqt.sp.l','The seeds','Urug‘lar','Семена','pp.vaqt.sp.h','Twenty plants from home','Uyimizdan yigirmata o‘simlik','Двадцать растений из дома',('pp.vaqt.sp.p','Lola and paxta are free. The other 18 unlock in the Bazaar with coins you earn by focusing, from common to legendary. Bigger trees want longer sessions.','Lola va paxta bepul. Qolgan 18 tasi fokus orqali topgan tangalaringiz bilan Bozorda ochiladi: oddiydan afsonaviygacha. Katta daraxtlar uzunroq sessiyalarni xohlaydi.','Лола и пахта бесплатны. Остальные 18 открываются на Базаре за монеты, заработанные фокусом, — от обычных до легендарных. Большим деревьям нужны сессии длиннее.'))}
<div class="grid species" id="species"></div></div></section>
<section class="band tight"><div class="wrap grid g2" style="align-items:start;--acc:var(--green)">
<div>{sh('pp.vaqt.k.l','Keyboard','Klaviatura','Клавиатура','pp.vaqt.k.h','Shortcuts','Tezkor tugmalar','Горячие клавиши')}</div>
<div class="card keys" data-reveal>{kk}</div></div></section>'''
    J('pp.vaqt.free','Free','Bepul','Бесплатно'); J('pp.vaqt.coins','{n} coins','{n} tanga','{n} монет'); J('pp.vaqt.min','best from {n} min','{n} daqiqadan','лучше от {n} мин')
    pic = f'<div class="isl" id="vq-island" aria-hidden="true"></div>'
    out['vaqt'] = product_page('vaqt', pic, feats, steps, 'HTML, CSS, JavaScript · SVG plants · Web Audio · service worker · Document Picture-in-Picture', extra,
        logo=f'<div class="logo">{vaqt_icon("pvi")}</div>', open_label=T('pp.vaqt.open','Open Vaqt','Vaqt’ni ochish','Открыть Vaqt'),
        sec_btn=f'<button class="btn ghost" id="vq-25" style="--c:var(--green)">{ic("timer")}{T("pp.vaqt.25","Start 25 minutes now","Hozir 25 daqiqa boshlash","Начать 25 минут сейчас")}</button>')
    return out

def build():
    pages = build_all()
    titles = {'clivedu':('ClivEdu','ClivEdu','ClivEdu','ClivEdu: an English classroom among the stars, with a Word Galaxy, games, homework and a teacher desk.'),
              'class':('ClivEdu Class','ClivEdu Class','ClivEdu Class','ClivEdu Class at clivedu.me: the live classroom for Clive’s English groups.'),
              'sprachwerk':('Sprachwerk','Sprachwerk','Sprachwerk','Sprachwerk: learn German with Linie A1, slide lessons, Berlin Missions and Shadow Studio.'),
              'vault':('Vault Studio','Vault Studio','Vault Studio','Vault Studio: a browser video studio for the WonderVault YouTube channel.'),
              'vaqt':('Vaqt · focus garden','Vaqt · fokus bog‘i','Vaqt · сад фокуса','Vaqt: a focus timer and time tracker that grows an Uzbek garden. 20 plants, a bazaar, levels and 55 awards. Free, offline, in three languages.')}
    out = {}
    for pid, body in pages.items():
        en,uz,ru,desc = titles[pid]
        scripts = ['assets/js/garden.js','assets/js/vaqtpage.js'] if pid == 'vaqt' else []
        out[P(pid)['page']] = page('product', R, f'pt.p.{pid}', en, uz, ru, desc, body, CSS, scripts)
    return out
