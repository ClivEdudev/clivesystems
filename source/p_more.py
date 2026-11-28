from lib import *
from p_data import PD, pd, P
import datetime

def crumbs(key, en, uz, ru, root=''):
    return f'<div class="crumbs"><a href="{root}index.html">Clive</a>{ic("chevr")}<span>{T(key,en,uz,ru)}</span></div>'

# ================================================================== LEARN
LEARN_CSS = '''
.live{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(16px,2vw,24px);align-items:stretch}
@media(max-width:860px){.live{grid-template-columns:1fr}}
.cd{background:radial-gradient(120% 120% at 0% 0%,color-mix(in srgb,var(--turq) 26%,var(--card)),var(--card) 65%);border-color:color-mix(in srgb,var(--turq) 35%,var(--line))}
.cd .big{font:700 clamp(2.6rem,7vw,5rem)/1 var(--head);letter-spacing:-.03em;font-variant-numeric:tabular-nums;margin:14px 0 10px}
.grp{display:grid;gap:14px}
.grp .card{display:grid;gap:8px}
.grp .when{font:600 1.15rem/1.2 var(--head);color:var(--c)}
.tt{min-width:640px;display:grid;grid-template-columns:64px repeat(7,minmax(0,1fr));grid-template-rows:44px repeat(8,38px);gap:4px;position:relative}
.tt .h{font-weight:800;font-size:.85rem;color:var(--sub);display:grid;place-items:center;border-radius:12px}
.tt .h.today{background:color-mix(in srgb,var(--acc) 18%,transparent);color:var(--ink)}
.tt .tm{font-size:.78rem;color:var(--mute);font-weight:700;text-align:right;padding-right:8px;transform:translateY(-8px)}
.tt .cell{border-top:1px dashed var(--line)}
.tt .blk{border-radius:12px;padding:8px 10px;font-weight:800;font-size:.82rem;line-height:1.2;color:var(--c);background:color-mix(in srgb,var(--c) 16%,transparent);border:1px solid color-mix(in srgb,var(--c) 45%,transparent);z-index:1;overflow:hidden}
.tt .blk small{display:block;font-weight:600;color:var(--sub);font-size:.74rem}
.tt .blk.open{border-bottom-style:dashed;-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent)}
.road{list-style:none;margin:0;padding:0;display:grid;gap:0;position:relative}
.road::before{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:2px;background:linear-gradient(var(--turq),var(--blue),transparent)}
.road li{display:grid;grid-template-columns:24px 120px 1fr;gap:14px;align-items:baseline;padding:12px 0;border-bottom:1px solid var(--line)}
.road li::before{content:"";width:12px;height:12px;border-radius:50%;background:var(--bg);border:2px solid var(--turq);margin-left:6px;transform:translateY(2px)}
.road .d{color:var(--mute);font-weight:700;font-size:.85rem;white-space:nowrap}
.road b{font-family:var(--head);font-weight:600}
.road span.s{color:var(--sub);font-size:.92rem;display:block}
@media(max-width:560px){.road li{grid-template-columns:24px 1fr}.road .d{grid-column:2}.road .x{grid-column:2}}
.metro svg{width:100%;height:auto}
.metro text{font:700 14px var(--body);fill:var(--ink)}
.metro text.s{font:600 12px var(--body);fill:var(--sub)}
.metro-list{display:none;columns:2;gap:24px;margin:0;padding-left:1.4em}
@media(max-width:700px){.metro svg{display:none}.metro-list{display:block}}
'''

LESSONS = [
 ('2026-11-26','Present simple with verbs','I work, she works · don’t / doesn’t · Do you…? Does she…?'),
 ('2026-11-26','Past continuous','was / were + -ing · What were you doing? · while'),
 ('2026-11-26','Time words','in, on, at · telling the time'),
 ('2026-11-23','Where is it?','in, on, under, next to, between'),
 ('2026-11-20','How often?','always, usually, sometimes, never'),
 ('2026-11-19','Plurals','-s, -es, -ies, -ves · men, women, children · these / those'),
 ('2026-11-19','Present simple or continuous?','every day vs now'),
 ('2026-11-16','Listening day','6 stories with sound'),
 ('2026-11-16','Week 1 review','games with all week 1 topics'),
 ('2026-11-14','Present continuous','now: I am reading'),
 ('2026-11-13','English Word Power','60 new words · classroom, family, house, food, town'),
 ('2026-11-13','My, your, his, her and ’s','possessives: Ali’s car · Whose…?'),
 ('2026-11-12','This, that, these, those','near and far · plurals'),
 ('2026-11-11','There is and there are','places and things: There is a bank'),
 ('2026-11-10','Can and can’t','ability: I can swim · Can you…?'),
 ('2026-11-09','Big Revision','sentences · to be · questions · commands · must · have to'),
]

STATIONS = [('Laute','Sounds'),('Hallo!','Greetings'),('Woher?','Origins'),('Zahlen','Numbers'),('Familie','Family'),('Essen','Food'),('Mein Tag','Daily life'),('Stadt','City'),('Wohnen','Home'),('Einkaufen','Shopping'),('Freizeit','Free time'),('Körper','Health'),('Reisen','Travel')]

def dfmt(iso):
    d = datetime.date.fromisoformat(iso)
    return f'{d.day} {d.strftime("%b")} {d.year}'

def learn_body():
    days = [('Mon',1),('Tue',2),('Wed',3),('Thu',4),('Fri',5),('Sat',6),('Sun',0)]
    J('l.d.Mon','Mon','Du','Пн');J('l.d.Tue','Tue','Se','Вт');J('l.d.Wed','Wed','Cho','Ср');J('l.d.Thu','Thu','Pa','Чт');J('l.d.Fri','Fri','Ju','Пт');J('l.d.Sat','Sat','Sha','Сб');J('l.d.Sun','Sun','Ya','Вс')
    cells = ['<div></div>'] + [f'<div class="h" data-dow="{n}" style="grid-column:{i+2};grid-row:1" data-i18n="l.d.{d}">{d}</div>' for i,(d,n) in enumerate(days)]
    slots = ['13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00']
    for r,s in enumerate(slots):
        cells.append(f'<div class="tm" style="grid-column:1;grid-row:{r+2}">{s}</div>')
        for c in range(7):
            cells.append(f'<div class="cell" style="grid-column:{c+2};grid-row:{r+2}"></div>')
    for i,(d,n) in enumerate(days):
        if n in (1,4,5):
            cells.append(f'<div class="blk" style="--c:var(--turq);grid-column:{i+2};grid-row:3 / 6">Elementary<small>14:00–15:30</small></div>')
        if n in (1,4):
            cells.append(f'<div class="blk open" style="--c:var(--gold);grid-column:{i+2};grid-row:6 / 9">Beginner<small>{T("l.from","from 15:30","15:30 dan","с 15:30")}</small></div>')
    tt = f'<div class="tt" id="tt">{"".join(cells)}</div>'

    road = ''.join(f'<li><span class="d">{dfmt(d)}</span><span class="x"><b>{esc(t)}</b><span class="s">{esc(s)}</span></span></li>' for d,t,s in LESSONS[:12])

    # metro line
    pts = [(70 + i*143, 80) for i in range(7)] + [(928 - i*143, 250) for i in range(6)]
    # pts[6] = (928,80); bottom row starts under it: 928,250 then leftwards
    d = f'M{pts[0][0]} 80 L928 80 A85 85 0 0 1 928 250 L{pts[-1][0]} 250'
    st = ''
    for i,((x,y),(de,en)) in enumerate(zip(pts, STATIONS)):
        ly = y - 46 if y < 150 else y + 40
        st += f'<circle cx="{x}" cy="{y}" r="14" fill="var(--card)" stroke="var(--gold)" stroke-width="4"/><text x="{x}" y="{y+5}" text-anchor="middle" style="font-size:12px">{i}</text>'
        st += f'<text x="{x}" y="{ly}" text-anchor="middle">{esc(de)}</text><text class="s" x="{x}" y="{ly+16}" text-anchor="middle">{esc(en)}</text>'
    metro = f'<svg viewBox="0 0 1040 320" role="img" aria-label="Linie A1: 13 stations"><path d="{d}" fill="none" stroke="var(--gold)" stroke-width="10" stroke-linecap="round" opacity=".9"/>{st}</svg>'
    mlist = ''.join(f'<li><b>{esc(de)}</b> · <span class="muted">{esc(en)}</span></li>' for de,en in STATIONS)

    feats = [('phone','l.f1','On every phone','Har bir telefonda','На каждом телефоне','The lesson opens on students’ phones the moment class starts.','Dars boshlanishi bilan o‘quvchilar telefonida ochiladi.','Урок открывается на телефонах учеников, как только начинается занятие.'),
             ('board','l.f2','On the board','Doskada','На доске','The same lesson runs on the smart board at the front of the room.','Xuddi shu dars xonadagi aqlli doskada ham ko‘rsatiladi.','Тот же урок идёт на интерактивной доске в классе.'),
             ('game','l.f3','Class game','Sinf o‘yini','Игра класса','A live quiz: students join with a code from the board.','Jonli viktorina: o‘quvchilar doskadagi kod bilan qo‘shiladi.','Живая викторина: ученики входят по коду с доски.'),
             ('calendar','l.f4','Daily challenge','Kunlik sinov','Ежедневный вызов','Two minutes a day to keep the streak alive.','Seriyani uzmaslik uchun kuniga ikki daqiqa.','Две минуты в день, чтобы не прерывать серию.'),
             ('cards','l.f5','Word bank','So‘z banki','Банк слов','Flashcards with Uzbek translations for every word.','Har bir so‘z uchun o‘zbekcha tarjimali kartochkalar.','Карточки с переводом каждого слова на узбекский.'),
             ('trophy','l.f6','Points and badges','Ballar va nishonlar','Баллы и значки','Levels and 12 badges; sign in with Telegram to keep them.','Darajalar va 12 ta nishon; saqlash uchun Telegram orqali kiring.','Уровни и 12 значков; войдите через Telegram, чтобы их сохранить.')]
    fc = ''.join(f'<article class="card glow" style="--c:var(--turq)" data-reveal="{i*50}"><span class="ico">{ic(icn)}</span>{T(k+".h",en,uz,ru,"h3")}{T(k+".p",pen,puz,pru,"p")}</article>' for i,(icn,k,en,uz,ru,pen,puz,pru) in enumerate(feats))
    J('l.cd.in','in {t}','{t} dan keyin','через {t}'); J('l.cd.live','Class is on now','Dars hozir ketyapti','Урок идёт сейчас')

    return f'''<section class="phero"><div class="wrap">
{crumbs('nav.learn','Learn','O‘rganish','Учёба')}
{T('l.h','Learn with Clive','Clive bilan o‘rganing','Учитесь с Clive','h1')}
{T('l.p','Live English groups on Tashkent time, a German line I’m riding myself, and tools to practise between classes.','Toshkent vaqti bo‘yicha jonli ingliz tili guruhlari, o‘zim yurayotgan nemis tili yo‘nalishi va darslar orasida mashq qilish uchun vositalar.','Живые группы английского по ташкентскому времени, немецкая линия, по которой я еду сам, и инструменты для практики между уроками.','p','lead')}
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap live">
<div class="card cd" data-reveal><span class="label" style="--acc:var(--turq)">{ic('clock')}<span id="cd-l">{T('l.cd.l','Next class','Keyingi dars','Следующий урок')}</span></span>
<div class="big" id="cd-big">—</div><p class="muted" id="cd-sub" style="margin:0">—</p>
<p class="small faint mt2">{T('l.cd.tz','All times are Tashkent time (UTC+5). It’s','Barcha vaqtlar Toshkent vaqti bilan (UTC+5). Hozir','Всё время — ташкентское (UTC+5). Сейчас')} <b class="num" data-tash-clock>--:--</b>.</p>
<div class="row mt2"><a class="btn primary" style="--c:var(--turq);--ci:#02201e" href="https://clivedu.me/" target="_blank" rel="noopener">{T('l.open','Open ClivEdu Class','ClivEdu Class’ni ochish','Открыть ClivEdu Class')}{ic('ext')}</a><a class="btn ghost" href="{TG}" target="_blank" rel="noopener">{ic('send')}{T('l.join','Ask to join','Qo‘shilishni so‘rash','Попроситься в группу')}</a></div></div>
<div class="grp">
<article class="card" style="--c:var(--turq)" data-reveal="80"><div class="row between"><h3>Elementary</h3><span class="chip c" style="--c:var(--turq)">A1–A2</span></div><div class="when">{T('l.e.when','Mon, Thu, Fri · 14:00–15:30','Du, Pa, Ju · 14:00–15:30','Пн, Чт, Пт · 14:00–15:30')}</div>{T('l.e.p','For students who know the basics. Grammar, vocabulary, listening days and class games.','Asoslarni biladigan o‘quvchilar uchun. Grammatika, lug‘at, tinglash kunlari va sinf o‘yinlari.','Для тех, кто знает основы. Грамматика, лексика, дни аудирования и игры класса.','p','muted')}</article>
<article class="card" style="--c:var(--gold)" data-reveal="140"><div class="row between"><h3>Beginner</h3><span class="chip c" style="--c:var(--gold)">{T('l.b.chip','From zero','Noldan','С нуля')}</span></div><div class="when">{T('l.b.when','Mon, Thu · from 15:30','Du, Pa · 15:30 dan','Пн, Чт · с 15:30')}</div>{T('l.b.p','For people who know no English yet. Slow pace and Uzbek translations in every lesson. Started 23 November 2026; so far: simple sentences, numbers, telling the time, can and can’t.','Hali ingliz tilini bilmaydiganlar uchun. Sekin sur’at va har darsda o‘zbekcha tarjima. 2026-yil 23-noyabrda boshlangan; hozircha: oddiy gaplar, sonlar, vaqtni aytish, can va can’t.','Для тех, кто пока не знает английского. Медленный темп и перевод на узбекский в каждом уроке. Старт 23 ноября 2026; пока: простые предложения, числа, время, can и can’t.','p','muted')}</article>
</div></div></section>
<section class="band tight"><div class="wrap">
{sh('l.tt.l','The week','Hafta','Неделя','l.tt.h','Timetable','Dars jadvali','Расписание')}
<div class="card scroll" data-reveal>{tt}</div>
<p class="small faint mt1">{T('l.tt.n','The Beginner block shows its start time only.','Beginner bloki faqat boshlanish vaqtini ko‘rsatadi.','Для группы Beginner указано только время начала.')}</p>
</div></section>
<section class="band"><div class="wrap">
{sh('l.how.l','In class','Darsda','На уроке','l.how.h','How a lesson works','Dars qanday o‘tadi','Как проходит урок')}
<div class="grid g3">{fc}</div></div></section>
<section class="band"><div class="wrap grid g2" style="align-items:start">
<div>{sh('l.road.l','The road so far','Bosib o‘tilgan yo‘l','Пройденный путь','l.road.h','Recent lessons','So‘nggi darslar','Последние уроки',('l.road.p','Straight from ClivEdu Class: what my groups have covered since the class site opened.','To‘g‘ridan-to‘g‘ri ClivEdu Class’dan: sinf sayti ochilgandan beri guruhlarim o‘tgan mavzular.','Прямо из ClivEdu Class: что прошли мои группы с открытия сайта.'))}</div>
<ol class="road" data-reveal>{road}</ol></div></section>
<section class="band"><div class="wrap">
{sh('l.de.l','German track','Nemis tili yo‘nalishi','Немецкий трек','l.de.h','Linie A1, station by station','Linie A1, bekatma-bekat','Linie A1, станция за станцией',('l.de.p','I’m learning German with Sprachwerk. The course is a metro line through the 13 Goethe A1 topics, starting with sounds.','Men nemis tilini Sprachwerk bilan o‘rganyapman. Kurs Goethe A1 ning 13 mavzusi bo‘ylab metro chizig‘i, tovushlardan boshlanadi.','Я учу немецкий со Sprachwerk. Курс — линия метро через 13 тем Goethe A1, начиная со звуков.'))}
<div class="card metro" data-reveal>{metro}<ol class="metro-list" start="0">{mlist}</ol></div>
<div class="row mt2"><a class="btn primary" style="--c:var(--gold);--ci:#1a1400" href="https://sprachwerkclive.netlify.app/" target="_blank" rel="noopener">{T('l.de.b','Ride Linie A1 in Sprachwerk','Sprachwerk’da Linie A1 bo‘ylab yurish','Поехать по Linie A1 в Sprachwerk')}{ic('ext')}</a><a class="btn ghost" href="products/sprachwerk.html">{T('o.details','Details','Batafsil','Подробнее')}</a></div>
</div></section>
<section class="band"><div class="wrap">
{sh('l.tools.l','Between classes','Darslar orasida','Между уроками','l.tools.h','Practise on your own','Mustaqil mashq qiling','Практикуйтесь сами')}
<div class="grid g3">
<a class="card glow" style="--c:var(--blue)" href="products/clivedu.html" data-reveal><span class="ico">{ic('star')}</span><h3>ClivEdu</h3>{T('l.t1','Self-study lessons and a Word Galaxy that grows with every word you learn.','Mustaqil darslar va siz o‘rgangan har bir so‘z bilan o‘sadigan So‘z galaktikasi.','Уроки для самостоятельного изучения и Галактика слов, растущая с каждым словом.','p')}</a>
<a class="card glow" style="--c:var(--green)" href="vaqt/index.html" data-reveal="60"><span class="ico">{ic('leaf')}</span><h3>Vaqt</h3>{T('l.t2','Study in focused blocks. Every session grows a plant; tag it “English” and watch the hours add up.','Diqqat bilan bloklarda o‘qing. Har bir sessiya o‘simlik o‘stiradi; uni “Ingliz tili” deb belgilang va soatlar qo‘shilishini kuzating.','Учитесь блоками. Каждая сессия растит растение; отметьте её тегом «Английский» и смотрите, как копятся часы.','p')}</a>
<a class="card glow" style="--c:var(--gold)" href="index.html#main" data-reveal="120"><span class="ico">{ic('sparkle')}</span>{T('l.t3h','Word of the day','Kun so‘zi','Слово дня','h3')}{T('l.t3','One word in English, Uzbek, Russian and German on the home page, with sound.','Bosh sahifada bitta so‘z ingliz, o‘zbek, rus va nemis tillarida, ovozi bilan.','На главной — одно слово на английском, узбекском, русском и немецком, с озвучкой.','p')}</a>
</div></div></section>
<section class="band"><div class="wrap"><div class="cta" style="--c:var(--turq)" data-reveal>
{T('l.cta.h','Want to join a group?','Guruhga qo‘shilmoqchimisiz?','Хотите в группу?','h2')}
{T('l.cta.p','Message me on Telegram with your level and which days and times suit you.','Telegram’da darajangiz va qaysi kun va vaqtlar sizga qulayligini yozing.','Напишите в Telegram свой уровень и какие дни и время вам подходят.','p','lead')}
<div class="row"><a class="btn primary" style="--c:var(--turq);--ci:#02201e" href="{TG}" target="_blank" rel="noopener">{ic('send')}Telegram @clive077</a></div>
</div></div></section>'''

def build_learn():
    return page('learn', '', 'pt.learn', 'Learn', 'O‘rganish', 'Учёба', 'English groups with Clive on Tashkent time, the German Linie A1 in Sprachwerk, and study tools.', learn_body(), LEARN_CSS, ['assets/js/learn.js'])

# ================================================================== JOURNAL
JOURNAL = [
 ('2026-11-28','build',('Reja: a planner for study and life','Reja: o‘qish va hayot uchun rejalashtiruvchi','Reja: планировщик для учёбы и жизни'),
  ('A new app for my own semester: the timetable with its every-other-week class, deadlines with files and reminders, and a note box for the class that is happening right now.','O‘z semestrim uchun yangi ilova: har ikki haftada bo‘ladigan darsi bilan dars jadvali, fayl va eslatmali muddatlar, hozir ketayotgan dars uchun eslatma oynasi.','Новое приложение для моего семестра: расписание с парой через неделю, дедлайны с файлами и напоминаниями и заметки к паре, которая идёт прямо сейчас.'),'reja/'),
 ('2026-11-27','build',('Vaqt sounds, recorded for real','Vaqt ovozlari endi haqiqiy','Звуки Vaqt теперь настоящие'),
  ('The generated noise is gone. Vaqt now plays real recordings: rain drops on leaves, a mountain stream, ocean waves, a campfire, wind in the trees and a ticking clock, plus four new ones for winding down: a thunderstorm, birdsong, night crickets and wind chimes. Each loops without a seam and works offline after the first play.','Sun’iy shovqin olib tashlandi. Endi Vaqt haqiqiy yozuvlarni chaladi: barglarga tushayotgan yomg‘ir tomchilari, tog‘ soyi, dengiz to‘lqinlari, gulxan, daraxtlardagi shamol va soat chiqillashi. Yana tinchlanish uchun to‘rtta yangisi: momaqaldiroq, qushlar sayrashi, tungi chirildoqlar va shamol qo‘ng‘iroqchalari. Har biri uzluksiz aylanadi va birinchi chalinishdan keyin oflayn ishlaydi.','Сгенерированный шум убран. Теперь Vaqt играет настоящие записи: капли дождя по листьям, горный ручей, морские волны, костёр, ветер в деревьях и тиканье часов, и ещё четыре для отдыха: гроза, пение птиц, ночные сверчки и музыка ветра. Каждая играет по кругу без шва и работает офлайн после первого запуска.'),'vaqt/index.html#sounds'),
 ('2026-11-27','build',('Vaqt 2.1: 34 plants with real light','Vaqt 2.1: haqiqiy yorug‘likdagi 34 o‘simlik','Vaqt 2.1: 34 растения с настоящим светом'),
  ('Every plant in Vaqt was redrawn with light from the upper left: shaded leaves, layered crowns, bark, fruit with a glint. Fourteen new ones joined the garden, from violet and poppy to fig, walnut, saxaul and a lotus in a stone basin, plus four new decorations: pumpkins, a tandir oven, an ariq stream and a little minaret.','Vaqtdagi har bir o‘simlik yuqori chapdan tushgan yorug‘lik bilan qayta chizildi: soyali barglar, qatlamli shox-shabba, po‘stloq, yaltiragan mevalar. Bog‘ga 14 ta yangi o‘simlik qo‘shildi: binafsha va lolaqizg‘aldoqdan anjir, yong‘oq, saksovul va tosh hovuzchadagi nilufargacha. Yana to‘rtta yangi bezak: qovoqlar, tandir, ariq va kichik minora.','Каждое растение Vaqt перерисовано со светом сверху слева: тени на листьях, многослойные кроны, кора, блик на плодах. В саду 14 новых растений, от фиалки и мака до инжира, грецкого ореха, саксаула и лотоса в каменной чаше, и четыре новых украшения: тыквы, тандыр, арык и маленький минарет.'),'vaqt/index.html'),
 ('2026-11-26','build',('Vaqt 2: a bazaar, levels and 55 awards','Vaqt 2: bozor, darajalar va 55 ta yutuq','Vaqt 2: базар, уровни и 55 наград'),
  ('Vaqt grew up on day one. Twenty plants in five rarity tiers, golden variants, a Bazaar with decorations and sceneries, levels with titles, three daily quests, 55 awards from bronze to diamond, and a dial whose sky follows the time of day.','Vaqt birinchi kunidayoq o‘sdi. Beshta noyoblik darajasidagi yigirmata o‘simlik, oltin variantlar, bezak va manzaralar sotiladigan Bozor, unvonli darajalar, uchta kunlik topshiriq, bronzadan olmosgacha 55 ta yutuq va osmoni kun vaqtiga qarab o‘zgaradigan siferblat.','Vaqt вырос в первый же день. Двадцать растений пяти уровней редкости, золотые варианты, Базар с украшениями и пейзажами, уровни со званиями, три ежедневных задания, 55 наград от бронзы до бриллианта и циферблат, небо в котором следует времени суток.'),'vaqt/index.html'),
 ('2026-11-26','launch',('The Clive orbit and Vaqt go live','Clive orbitasi va Vaqt ishga tushdi','Орбита Clive и Vaqt запущены'),
  ('Everything I make now lives in one place, in three languages. And there’s a new planet: Vaqt, a focus timer and time tracker that grows an Uzbek garden while you work.','Men yaratgan hamma narsa endi bir joyda, uch tilda. Va yangi sayyora bor: Vaqt — siz ishlayotganingizda o‘zbek bog‘ini o‘stiradigan fokus taymeri va vaqt hisoblagichi.','Всё, что я делаю, теперь в одном месте и на трёх языках. И есть новая планета: Vaqt — таймер фокуса и трекер времени, который растит узбекский сад, пока вы работаете.'),'vaqt/index.html'),
 ('2026-11-26','build',('Dilnura Edu, on the Class engine','Dilnura Edu — Class dvigatelida','Dilnura Edu на движке Class'),
  ('A class site for another teacher’s Navigate A1 group, built from my ClivEdu Class engine, with a teacher dashboard, payments table, room planner and a Telegram bot.','Boshqa o‘qituvchining Navigate A1 guruhi uchun sinf sayti: ClivEdu Class dvigatelim asosida, o‘qituvchi paneli, to‘lovlar jadvali, xona rejalashtiruvchisi va Telegram bot bilan.','Сайт класса для группы Navigate A1 другого учителя на моём движке ClivEdu Class: панель учителя, таблица оплат, планировщик кабинета и Telegram-бот.'),'https://dilnuraedu.netlify.app/'),
 ('2026-11-24','learn',('I started learning German','Nemis tilini o‘rganishni boshladim','Я начал учить немецкий'),
  ('No education centre and no hunting for YouTube lessons. I’m learning with my own app, Sprachwerk, starting from the Sound Lab.','Na o‘quv markazi, na YouTube darslarini qidirish. O‘z ilovam Sprachwerk bilan, Sound Lab’dan boshlab o‘rganyapman.','Без учебных центров и поиска уроков на YouTube. Учу со своим приложением Sprachwerk, начиная с Sound Lab.'),'products/sprachwerk.html'),
 ('2026-11-24','build',('Sprachwerk: slide lessons and sync','Sprachwerk: slayd darslar va sinxronlash','Sprachwerk: уроки-слайды и синхронизация'),
  ('Grammar decks in ClivEdu style (formula, colour-coded examples, a “Warum?” slide) and Google sign-in that merges progress between devices instead of overwriting it.','ClivEdu uslubidagi grammatika slaydlari (formula, rangli misollar, “Warum?” slaydi) va natijalarni qurilmalar orasida ustiga yozmasdan birlashtiruvchi Google orqali kirish.','Грамматические слайды в стиле ClivEdu (формула, цветные примеры, слайд «Warum?») и вход через Google, который объединяет прогресс между устройствами, а не перезаписывает его.'),'https://sprachwerkclive.netlify.app/'),
 ('2026-11-23','teach',('A new Beginner group','Yangi Beginner guruhi','Новая группа Beginner'),
  ('A slow-paced group for students who know no English yet, on Mondays and Thursdays from 15:30, with Uzbek in every lesson.','Hali ingliz tilini bilmaydigan o‘quvchilar uchun sekin sur’atli guruh: dushanba va payshanba kunlari 15:30 dan, har darsda o‘zbekcha bilan.','Неторопливая группа для тех, кто ещё не знает английского: по понедельникам и четвергам с 15:30, с узбекским в каждом уроке.'),'learn.html'),
 ('2026-11-16','teach',('clivedu.me now opens the classroom','clivedu.me endi sinfxonani ochadi','clivedu.me теперь открывает класс'),
  ('My domain points to ClivEdu Class, the site my students open on their phones in every lesson.','Domenim ClivEdu Class’ga yo‘naltirildi — o‘quvchilarim har darsda telefonida ochadigan sayt.','Мой домен ведёт на ClivEdu Class — сайт, который ученики открывают на телефонах на каждом уроке.'),'https://clivedu.me/'),
 ('2026-11-10','launch',('Technical Issues Q&amp;A eBook','Texnik muammolar: savol-javob kitobi','Книга «Технические проблемы: вопросы и ответы»'),
  ('60 everyday tech problems, each on one page with a diagram and a numbered fix. 78 pages, on Whop.','60 ta kundalik texnik muammo, har biri bir sahifada, chizma va raqamlangan yechim bilan. 78 sahifa, Whop’da.','60 бытовых технических проблем, каждая на одной странице со схемой и пошаговым решением. 78 страниц, на Whop.'),'shop.html'),
 ('2026-11-09','teach',('ClivEdu Class opens with Big Revision','ClivEdu Class Big Revision bilan ochildi','ClivEdu Class открылся уроком Big Revision'),
  ('The class site’s first lesson: sentences, to be, questions and commands. Sixteen lessons later, my groups follow every class on it.','Sinf saytining birinchi darsi: gaplar, to be, savollar va buyruqlar. O‘n olti darsdan keyin guruhlarim har bir darsni shu yerda kuzatadi.','Первый урок на сайте класса: предложения, to be, вопросы и команды. Шестнадцать уроков спустя группы следят за каждым занятием здесь.'),'products/class.html'),
 ('2026-11-09','launch',('My Whop store opens','Whop do‘konim ochildi','Открылся мой магазин на Whop'),
  ('A home for the digital products I make, under the name Digital Products.','Men yaratadigan raqamli mahsulotlar uchun uy, Digital Products nomi ostida.','Дом для цифровых продуктов, которые я делаю, под названием Digital Products.'),WHOP_STORE),
 ('2026-11-07','build',('TM HOTEL: an honest availability calendar','TM HOTEL: halol bandlik taqvimi','TM HOTEL: честный календарь занятости'),
  ('The hotel updates it by hand, and the site stays what it should be: information and availability, no fake bookings.','Mehmonxona uni qo‘lda yangilaydi, sayt esa o‘zi bo‘lishi kerak bo‘lgandek qoladi: ma’lumot va bandlik, soxta bronlarsiz.','Отель обновляет его вручную, а сайт остаётся тем, чем должен быть: информация и занятость, без фальшивых броней.'),'https://tmhotel.netlify.app/'),
 ('2026-11-05','build',('Vault Studio for WonderVault','WonderVault uchun Vault Studio','Vault Studio для WonderVault'),
  ('A browser studio to write, edit and thumbnail amazing-facts videos, on my phone or my computer.','Ajoyib faktlar videolarini yozish, montaj qilish va muqova yasash uchun brauzer studiyasi, telefonimda ham, kompyuterimda ham.','Студия в браузере, чтобы писать, монтировать и делать обложки для видео об удивительных фактах — на телефоне или компьютере.'),'products/vault-studio.html'),
 ('2026-11-01','build',('Frans Burger','Frans Burger','Frans Burger'),
  ('A burger and coffee shop site with builders for burgers, coffee, shawarma and hot dogs, and orders that land in the shop’s Telegram.','Burger, qahva, shaurma va hot-dog konstruktorlari bilan burger va qahva do‘koni sayti, buyurtmalar do‘kon Telegram’iga tushadi.','Сайт бургерной и кофейни с конструкторами бургеров, кофе, шаурмы и хот-догов; заказы приходят в Telegram заведения.'),'https://ffsand.netlify.app/'),
 ('2026-10-30','build',('RIVA HOTEL and Robiya mebellari','RIVA HOTEL va Robiya mebellari','RIVA HOTEL и Robiya mebellari'),
  ('Two Andijan businesses, two sites in three languages: a calm hotel and a furniture store whose rooms furnish themselves.','Andijondagi ikki biznes, uch tilda ikki sayt: sokin mehmonxona va xonalari o‘zi jihozlanadigan mebel do‘koni.','Два бизнеса из Андижана, два сайта на трёх языках: спокойный отель и мебельный магазин, где комнаты обставляются сами.'),'work.html'),
 ('2026-10-20','build',('ClivEdu: English among the stars','ClivEdu: yulduzlar orasida ingliz tili','ClivEdu: английский среди звёзд'),
  ('A personal English classroom with a Word Galaxy that grows with every word, games, homework and a teacher desk.','Har bir so‘z bilan o‘sadigan So‘z galaktikasi, o‘yinlar, uy vazifasi va o‘qituvchi stoli bilan shaxsiy ingliz tili sinfi.','Личный класс английского с Галактикой слов, которая растёт с каждым словом, играми, домашними заданиями и столом учителя.'),'products/clivedu.html'),
]
JCAT = {'launch':('j.c.launch','Launch','Ishga tushirish','Запуск','var(--rose)'),'build':('j.c.build','Build','Qurish','Разработка','var(--blue)'),'teach':('j.c.teach','Teach','Dars','Преподавание','var(--turq)'),'learn':('j.c.learn','Learn','O‘rganish','Учёба','var(--gold)')}

JOURNAL_CSS = '''
.jl{display:grid;gap:0;position:relative}
.je{display:grid;grid-template-columns:150px 1fr;gap:28px;padding:28px 0;border-top:1px solid var(--line)}
.je[hidden]{display:none}
.je time{font:600 .95rem/1.3 var(--head);color:var(--sub);white-space:nowrap}
.je h2{font-size:clamp(1.3rem,2.4vw,1.8rem)}
.je p{color:var(--sub);margin-top:10px;max-width:66ch}
.je .more{display:inline-flex;gap:6px;align-items:center;font-weight:700;margin-top:12px;color:var(--c)}
.je .more svg{width:16px;height:16px}
@media(max-width:640px){.je{grid-template-columns:1fr;gap:8px}}
'''
def journal_body():
    tabs = f'<button data-f="all" aria-pressed="true">{T("w.f.all","All","Hammasi","Все")}</button>' + ''.join(f'<button data-f="{k}" aria-pressed="false">{T(v[0],v[1],v[2],v[3])}</button>' for k,v in JCAT.items())
    es = []
    for i,(d,cat,title,body,link) in enumerate(JOURNAL):
        cc = JCAT[cat]
        ext = link.startswith('http')
        es.append(f'''<article class="je" data-cat="{cat}" id="j{i}" style="--c:{cc[4]}" data-reveal>
<div><time datetime="{d}">{dfmt(d)}</time><div class="mt1"><span class="chip c" style="--c:{cc[4]}">{T(cc[0],cc[1],cc[2],cc[3])}</span></div></div>
<div>{T(f"j.{i}.t",*title,tag="h2")}{T(f"j.{i}.b",*body,tag="p")}<a class="more" href="{link}"{" target=_blank rel=noopener" if ext else ""}>{T("j.more","Have a look","Ko‘rish","Посмотреть")}{ic("ext" if ext else "arrow")}</a></div></article>''')
    return f'''<section class="phero"><div class="wrap">
{crumbs('nav.journal','Journal','Kundalik','Дневник')}
{T('j.h','Journal','Kundalik','Дневник','h1')}
{T('j.p','What I’m building, teaching and learning, newest first. Also as an RSS feed.','Nima qurayotganim, o‘rgatayotganim va o‘rganayotganim, eng yangisi birinchi. RSS lenta sifatida ham bor.','Что я делаю, чему учу и что учу сам — сначала новое. Есть и RSS-лента.','p','lead')}
<div class="row mt2"><div class="tabs" role="group" aria-label="Filter" id="jf">{tabs}</div><a class="btn ghost sm" href="feed.xml">RSS</a></div>
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap jl" id="jl">{''.join(es)}</div></section>'''

def build_journal():
    return page('journal', '', 'pt.journal', 'Journal', 'Kundalik', 'Дневник', 'What Clive is building, teaching and learning.', journal_body(), JOURNAL_CSS, ['assets/js/work.js'])

def feed_xml(base='https://example.netlify.app/'):
    items = ''
    import re
    for i,(d,cat,title,body,link) in enumerate(JOURNAL):
        dt = datetime.datetime.fromisoformat(d + 'T12:00:00+05:00')
        url = link if link.startswith('http') else base + 'journal.html#j' + str(i)
        t = re.sub('&amp;','&',title[0])
        items += f'<item><title>{esc(t)}</title><link>{esc(url)}</link><guid isPermaLink="false">clive-journal-{d}-{i}</guid><pubDate>{dt.strftime("%a, %d %b %Y %H:%M:%S +0500")}</pubDate><category>{cat}</category><description>{esc(body[0])}</description></item>'
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Clive · Journal</title><link>{base}journal.html</link><description>What Clive is building, teaching and learning.</description><language>en</language>{items}</channel></rss>\n'

# ================================================================== SHOP
SHOP_CSS = '''
.prod{display:grid;grid-template-columns:1.25fr 1fr;gap:clamp(20px,3vw,48px);align-items:start}
@media(max-width:900px){.prod{grid-template-columns:1fr}}
.gal{display:grid;grid-auto-flow:column;grid-auto-columns:100%;overflow-x:auto;scroll-snap-type:x mandatory;border-radius:20px;border:1px solid var(--line);scrollbar-width:none}
.gal::-webkit-scrollbar{display:none}
.gal img{scroll-snap-align:start;width:100%;aspect-ratio:16/9;object-fit:cover}
.galnav{display:flex;gap:8px;justify-content:center;margin-top:12px;align-items:center}
.galnav .dots{display:flex;gap:6px}
.galnav .dots i{width:8px;height:8px;border-radius:50%;background:var(--line2)}
.galnav .dots i.on{background:var(--rose);width:22px;border-radius:5px}
.buy{position:sticky;top:96px}
.buy .price{font:700 3.4rem/1 var(--head)}
.cats{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:820px){.cats{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.cats{grid-template-columns:1fr}}
.cats .card b{font:700 2.2rem/1 var(--head);color:var(--rose);display:block;margin-bottom:8px}
details.faq{border-top:1px solid var(--line);padding:18px 0}
details.faq summary{cursor:pointer;font:600 1.1rem/1.3 var(--head);list-style:none;display:flex;justify-content:space-between;gap:16px}
details.faq summary::-webkit-details-marker{display:none}
details.faq summary::after{content:"+";font-size:1.4rem;color:var(--mute)}
details.faq[open] summary::after{content:"−"}
details.faq p{color:var(--sub);margin-top:10px}
'''
def shop_body():
    cats = [(15,'s.c1','Website & browser errors','Sayt va brauzer xatolari','Ошибки сайтов и браузеров','404, 403, 500, 502, 503, DNS, certificates, redirects'),
            (12,'s.c2','Microsoft Excel','Microsoft Excel','Microsoft Excel','#REF!, #N/A, #VALUE!, slow files, macros, CSV'),
            (9,'s.c3','Microsoft Word','Microsoft Word','Microsoft Word','Crashes, lost documents, blank pages, page numbers'),
            (9,'s.c4','Outlook & PowerPoint','Outlook va PowerPoint','Outlook и PowerPoint','Loading profile, Outbox, search, video, fonts'),
            (5,'s.c5','Office accounts & syncing','Office hisoblari va sinxronlash','Учётные записи Office и синхронизация','Activation, repair, OneDrive, locked files'),
            (10,'s.c6','Meetings, PDFs, printing, PC','Uchrashuvlar, PDF, chop etish, kompyuter','Встречи, PDF, печать, ПК','Mic and camera, Teams, Zoom, PDFs, printers, Wi-Fi')]
    cc = ''.join(f'<article class="card" data-reveal="{i*50}"><b>{n}</b>{T(k,en,uz,ru,"h3")}<p class="small">{esc(sub)}</p></article>' for i,(n,k,en,uz,ru,sub) in enumerate(cats))
    inc = [('s.i1','A diagram for every answer: flow charts, decision trees, click paths','Har bir javob uchun chizma: blok-sxemalar, qaror daraxtlari, bosish yo‘llari','Схема к каждому ответу: блок-схемы, деревья решений, пути кликов'),
           ('s.i2','Every answer has five parts: what you see, why, where it breaks, the fix, a tip','Har bir javob besh qismdan iborat: nima ko‘rasiz, nega, qayerda buziladi, yechim, maslahat','В каждом ответе пять частей: что вы видите, почему, где ломается, решение, совет'),
           ('s.i3','Quick-reference tables for status codes, Excel errors and shortcuts','Holat kodlari, Excel xatolari va tezkor tugmalar uchun ma’lumot jadvallari','Справочные таблицы кодов ответа, ошибок Excel и горячих клавиш'),
           ('s.i4','Clickable contents, PDF bookmarks and an index of error codes','Bosiladigan mundarija, PDF xatcho‘plari va xato kodlari ko‘rsatkichi','Кликабельное оглавление, закладки PDF и указатель кодов ошибок'),
           ('s.i5','Written for Windows 10 and 11, Microsoft 365 and Office 2016 to 2024','Windows 10 va 11, Microsoft 365 hamda Office 2016–2024 uchun yozilgan','Для Windows 10 и 11, Microsoft 365 и Office 2016–2024')]
    il = ''.join(f'<li>{ic("check")}{T(k,en,uz,ru)}</li>' for k,en,uz,ru in inc)
    faqs = [('s.q1','How do I get the book after paying?','To‘lovdan keyin kitobni qanday olaman?','Как получить книгу после оплаты?','Whop gives you instant digital access as soon as the payment goes through.','To‘lov o‘tishi bilan Whop sizga darhol raqamli kirish beradi.','Whop открывает мгновенный цифровой доступ сразу после оплаты.'),
            ('s.q2','Is it a subscription?','Bu obunami?','Это подписка?','No. It’s a one-time purchase.','Yo‘q. Bu bir martalik xarid.','Нет. Это разовая покупка.'),
            ('s.q3','What language is it in?','Kitob qaysi tilda?','На каком языке книга?','English.','Ingliz tilida.','На английском.'),
            ('s.q4','Something isn’t clear. Who do I ask?','Nimadir tushunarsiz. Kimdan so‘rayman?','Что-то непонятно. К кому обратиться?','Me. Write on Telegram @clive077 or email imonkulovclive@gmail.com.','Menga. Telegram @clive077 yoki imonkulovclive@gmail.com ga yozing.','Ко мне. Пишите в Telegram @clive077 или на imonkulovclive@gmail.com.')]
    fq = ''.join(f'<details class="faq">{T(k+".q",q,quz,qru,"summary")}{T(k+".a",a,auz,aru,"p")}</details>' for k,q,quz,qru,a,auz,aru in faqs)
    free = ''.join(f'<a class="card glow" style="--c:{P(pid)["c"]}" href="{P(pid)["page"]}" data-reveal="{i*60}"><div class="row between"><span class="ico" style="margin:0">{ic(P(pid)["icon"])}</span><span class="chip c" style="--c:var(--green)">{pd(pid,"price")}</span></div><h3 class="mt2">{P(pid)["name"]}</h3>{pd(pid,"short","p")}</a>' for i,pid in enumerate(['vaqt','clivedu','sprachwerk']))
    return f'''<section class="phero"><div class="wrap">
{crumbs('nav.shop','Shop','Do‘kon','Магазин')}
{T('s.h','Shop','Do‘kon','Магазин','h1')}
{T('s.p','Digital products I make and sell on Whop. Almost everything else in the orbit is free.','Men yaratadigan va Whop’da sotadigan raqamli mahsulotlar. Orbitadagi deyarli hamma narsa bepul.','Цифровые продукты, которые я делаю и продаю на Whop. Почти всё остальное на орбите бесплатно.','p','lead')}
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap prod">
<div data-reveal><div class="gal" id="gal" tabindex="0" aria-label="Book previews">
<img src="assets/img/shop/ebook-1.webp" alt="Technical Issues Q&amp;A: cover and sample pages" width="1280" height="720">
<img src="assets/img/shop/ebook-2.webp" alt="Every answer has a diagram" width="1280" height="720" loading="lazy">
<img src="assets/img/shop/ebook-3.webp" alt="60 problems in 6 parts" width="1280" height="720" loading="lazy"></div>
<div class="galnav"><button class="iconbtn" data-g="-1" aria-label="Previous">{ic('chevl')}</button><div class="dots"><i class="on"></i><i></i><i></i></div><button class="iconbtn" data-g="1" aria-label="Next">{ic('chevr')}</button></div></div>
<aside class="card buy" style="--c:var(--rose)" data-reveal="80">
<span class="label" style="--acc:var(--rose)">{ic('book')}{T('s.b.l','eBook · PDF','Elektron kitob · PDF','Электронная книга · PDF')}</span>
<h2 class="mt1">{T('h.sp.h','Technical Issues Q&amp;A','Texnik muammolar: savol-javob','Технические проблемы: вопросы и ответы')}</h2>
{T('s.b.p','60 everyday tech problems, each with a diagram and a step-by-step fix.','60 ta kundalik texnik muammo, har biri chizma va bosqichma-bosqich yechim bilan.','60 бытовых технических проблем, у каждой схема и пошаговое решение.','p','muted mt1')}
<div class="row mt2" style="align-items:baseline"><span class="price">$9</span><span class="faint">{T('s.b.once','one-time','bir martalik','разово')}</span></div>
<ul class="list-check mt2" style="--c:var(--rose)"><li>{ic('check')}{T('s.b.1','60 problems across 78 pages','78 sahifada 60 ta muammo','60 проблем на 78 страницах')}</li><li>{ic('check')}{T('s.b.2','Instant digital access','Darhol raqamli kirish','Мгновенный цифровой доступ')}</li><li>{ic('check')}{T('s.b.3','Every answer fits on one page','Har bir javob bir sahifaga sig‘adi','Каждый ответ умещается на одной странице')}</li></ul>
<a class="btn primary block mt2" style="--c:var(--rose)" href="{WHOP_EBOOK}" target="_blank" rel="noopener">{T('h.sp.buy','Get it on Whop','Whop’da olish','Купить на Whop')}{ic('ext')}</a>
<a class="btn ghost block mt1" href="{WHOP_STORE}" target="_blank" rel="noopener">{T('s.store','See the whole store','Butun do‘konni ko‘rish','Весь магазин')}</a>
</aside></div></section>
<section class="band"><div class="wrap">
{sh('s.in.l','What’s inside','Ichida nima bor','Что внутри','s.in.h','60 problems in 6 parts','6 qismda 60 ta muammo','60 проблем в 6 частях')}
<div class="grid cats">{cc}</div>
<ul class="list-check mt3" style="--c:var(--rose);max-width:760px">{il}</ul>
</div></section>
<section class="band"><div class="wrap grid g2" style="align-items:start">
<div>{sh('s.fq.l','Questions','Savollar','Вопросы','s.fq.h','Before you buy','Sotib olishdan oldin','Перед покупкой')}</div>
<div data-reveal>{fq}</div></div></section>
<section class="band"><div class="wrap">
{sh('s.fr.l','Free in the orbit','Orbitada bepul','Бесплатно на орбите','s.fr.h','Tools that cost nothing','Hech narsa turmaydigan vositalar','Инструменты, которые ничего не стоят')}
<div class="grid g3">{free}</div></div></section>'''

def build_shop():
    return page('shop', '', 'pt.shop', 'Shop', 'Do‘kon', 'Магазин', 'Technical Issues Q&A eBook by Clive: 60 everyday tech problems with diagrams and fixes. $9 on Whop.', shop_body(), SHOP_CSS, ['assets/js/shop.js'])

# ================================================================== ABOUT
ABOUT_CSS = '''
.ab{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(24px,4vw,64px);align-items:center}
@media(max-width:900px){.ab{grid-template-columns:1fr}}
.idc{position:relative;aspect-ratio:1.586;width:min(520px,100%);margin-inline:auto;border-radius:26px;padding:clamp(18px,3vw,28px);color:#EEF1FF;overflow:hidden;
 background:radial-gradient(120% 120% at 100% 0%,#2a2f8f 0%,transparent 55%),radial-gradient(90% 90% at 0% 100%,#0f5f6a 0%,transparent 60%),linear-gradient(135deg,#0b1030,#111a48);
 box-shadow:0 40px 80px -30px rgba(10,16,60,.7),inset 0 0 0 1px rgba(255,255,255,.12);transform:perspective(900px) rotateX(var(--rx,4deg)) rotateY(var(--ry,-8deg));transition:transform .3s ease-out;display:grid;grid-template-rows:auto 1fr auto}
.idc::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.16) 45%,rgba(160,200,255,.12) 50%,transparent 62%);background-size:250% 100%;background-position:var(--sx,60%) 0;mix-blend-mode:screen;pointer-events:none}
.idc .hd{display:flex;justify-content:space-between;align-items:center;font:700 .78rem/1 var(--body);opacity:.8}
.idc .hd svg{width:42px;height:42px}
.idc .nm{align-self:center}
.idc .nm b{font:700 clamp(2rem,5vw,3rem)/1 var(--head);letter-spacing:-.02em;display:block}
.idc .nm span{opacity:.75;font-weight:600}
.idc dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;margin:0;font-size:.78rem}
.idc dt{opacity:.6;font-weight:700}
.idc dd{margin:0;font-weight:700}
.story p{font-size:1.12rem;color:var(--sub);max-width:62ch}
.story p b{color:var(--ink)}
.tk{display:grid;gap:18px}
.tk .row b{width:120px;flex:none;font-family:var(--head);font-weight:600}
@media(max-width:560px){.tk .row b{width:100%}}
.princ{grid-template-columns:repeat(5,minmax(0,1fr))}
@media(max-width:1000px){.princ{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.princ{grid-template-columns:1fr}}
'''
def about_body():
    principles = [('phone','a.p1','Phones first','Avvalo telefon','Сначала телефон','My students and customers open everything on phones, often cheap ones.','O‘quvchilarim va mijozlarim hamma narsani telefonda, ko‘pincha arzon telefonlarda ochadi.','Мои ученики и клиенты открывают всё на телефонах, часто недорогих.'),
                  ('globe','a.p2','Three languages','Uch til','Три языка','Uzbek, Russian and English, because that’s how people here talk.','O‘zbek, rus va ingliz tillari, chunki bu yerda odamlar shunday gaplashadi.','Узбекский, русский и английский — потому что здесь так говорят.'),
                  ('shield','a.p3','No fake numbers','Soxta raqamlarsiz','Без фальшивых цифр','Prices, phones and reviews stay “to be confirmed” until the business confirms them.','Narxlar, telefonlar va sharhlar biznes tasdiqlamaguncha “tasdiqlanadi” bo‘lib qoladi.','Цены, телефоны и отзывы остаются «уточняется», пока бизнес их не подтвердит.'),
                  ('zap','a.p4','Light code','Yengil kod','Лёгкий код','Plain HTML, CSS and TypeScript. Fast to load, easy to hand over.','Oddiy HTML, CSS va TypeScript. Tez yuklanadi, topshirish oson.','Чистые HTML, CSS и TypeScript. Быстро грузится, легко передать.'),
                  ('board','a.p5','Old screens too','Eski ekranlarda ham','И на старых экранах','My class site runs on an old smart-board browser, so it works everywhere.','Sinf saytim eski aqlli doska brauzerida ishlaydi, demak hamma joyda ishlaydi.','Сайт моего класса работает в старом браузере интерактивной доски — значит, работает везде.')]
    pc = ''.join(f'<article class="card" data-reveal="{i*50}"><span class="ico">{ic(icn)}</span>{T(k+".h",en,uz,ru,"h3")}{T(k+".p",pen,puz,pru,"p")}</article>' for i,(icn,k,en,uz,ru,pen,puz,pru) in enumerate(principles))
    tk = [('a.tk1','Build','Qurish','Разработка',['HTML','CSS','JavaScript','TypeScript','Canvas & SVG','PWA · offline','Web Speech']),
          ('a.tk2','Back end','Server','Сервер',['Netlify Functions','Netlify Blobs','Netlify Forms','Google sign-in','Telegram bots']),
          ('a.tk3','Ship','Chiqarish','Выпуск',['GitHub','Netlify']),
          ('a.tk4','Sell & grow','Sotish va o‘sish','Продажи и рост',['Whop','Metricool','vidIQ']),
          ('a.tk5','Teach','O‘qitish','Преподавание',['Smart board','Live class quiz','PDF homework','Telegram'])]
    tks = ''.join(f'<div class="row" style="align-items:flex-start;flex-wrap:nowrap">{T(k,en,uz,ru,"b")}<div class="row">{"".join(f"<span class=chip>{esc(x)}</span>" for x in items)}</div></div>' for k,en,uz,ru,items in tk)
    return f'''<section class="phero"><div class="wrap ab">
<div>{crumbs('nav.about','About','Men haqimda','Обо мне')}
{T('a.h','Hi, I’m Clive.','Salom, men Clive.','Привет, я Clive.','h1')}
<div class="story mt2">
{T('a.s1','My name is <b>Baxriddin Imonqulov</b>. Online I go by Clive, just Clive. I teach English to Uzbek students, and I build the websites and apps that my students, my clients and I actually use.','Mening ismim <b>Baxriddin Imonqulov</b>. Internetda men Clive, shunchaki Clive. O‘zbek o‘quvchilariga ingliz tilini o‘rgataman va o‘quvchilarim, mijozlarim va o‘zim haqiqatan foydalanadigan sayt va ilovalarni quraman.','Меня зовут <b>Бахриддин Имонкулов</b>. В сети я Clive, просто Clive. Я преподаю английский узбекским ученикам и делаю сайты и приложения, которыми действительно пользуются мои ученики, клиенты и я сам.','p')}
{T('a.s2','My classroom runs on a site I wrote. When a lesson starts, it opens on every student’s phone and on the smart board. When I decided to learn German, I didn’t look for a course. I built Sprachwerk and started from the first sound.','Sinfxonam o‘zim yozgan saytda ishlaydi. Dars boshlanganda u har bir o‘quvchining telefonida va aqlli doskada ochiladi. Nemis tilini o‘rganishga qaror qilganimda kurs qidirmadim. Sprachwerk’ni qurdim va birinchi tovushdan boshladim.','Мой класс работает на сайте, который я написал. Когда начинается урок, он открывается на телефоне каждого ученика и на доске. Решив учить немецкий, я не стал искать курс: я сделал Sprachwerk и начал с первого звука.','p')}
{T('a.s3','For hotels, shops and cafés in Andijan I make sites that work on cheap phones and speak three languages. And when I need to focus, I grow a garden. That’s Vaqt, the newest planet here.','Andijondagi mehmonxonalar, do‘konlar va kafelar uchun arzon telefonlarda ishlaydigan va uch tilda gapiradigan saytlar yarataman. Diqqatimni jamlashim kerak bo‘lganda esa bog‘ o‘stiraman. Bu Vaqt — bu yerdagi eng yangi sayyora.','Для отелей, магазинов и кафе Андижана я делаю сайты, которые работают на дешёвых телефонах и говорят на трёх языках. А когда мне нужно сосредоточиться, я выращиваю сад. Это Vaqt — самая новая планета здесь.','p')}
</div><div class="row mt2"><a class="btn primary" href="contact.html">{T('a.cta','Say hi','Salom deng','Напишите мне')}{ic('arrow')}</a><a class="btn ghost" href="journal.html">{T('h.hat4.a','Read the journal','Kundalikni o‘qish','Читать дневник')}</a></div></div>
<div data-reveal><div class="idc" id="idc" aria-label="Clive ID card">
<div class="hd"><span>c-ID · UZ</span>{mark("idm", 42)}</div>
<div class="nm"><b>Clive</b><span>Imonqulov Baxriddin</span></div>
<dl><div><dt>{T('a.id.r','Roles','Rollar','Роли')}</dt><dd>{T('a.id.rv','Teacher · Dev · Maker','O‘qituvchi · Dasturchi · Yaratuvchi','Учитель · Разработчик · Автор')}</dd></div>
<div><dt>{T('a.id.b','Base','Joy','Где')}</dt><dd>{T('a.id.bv','Uzbekistan · UTC+5','O‘zbekiston · UTC+5','Узбекистан · UTC+5')}</dd></div>
<div><dt>{T('a.id.l','Learning','O‘rganyapti','Учит')}</dt><dd>{T('a.id.lv','German · A1','Nemis · A1','Немецкий · A1')}</dd></div>
<div><dt>{T('a.id.p','Products','Mahsulotlar','Продукты')}</dt><dd>5</dd></div>
<div><dt>{T('a.id.s','Live sites','Saytlar','Сайты')}</dt><dd>14</dd></div>
<div><dt>Telegram</dt><dd>@clive077</dd></div></dl>
</div></div></div></section>
<section class="band"><div class="wrap">
{sh('a.pr.l','How I work','Qanday ishlayman','Как я работаю','a.pr.h','Five rules I keep','Men amal qiladigan beshta qoida','Пять правил, которых я держусь')}
<div class="grid princ">{pc}</div></div></section>
<section class="band"><div class="wrap grid g2" style="align-items:start">
<div>{sh('a.tk.l','Toolkit','Asboblar','Инструменты','a.tk.h','What I build with','Nima bilan quraman','С чем я работаю')}</div>
<div class="card tk" data-reveal>{tks}</div></div></section>
<section class="band"><div class="wrap"><div class="cta" data-reveal>
{T('a.c.h','The rest is in the journal','Qolgani kundalikda','Остальное — в дневнике','h2')}
{T('a.c.p','Every launch, class change and German milestone goes there first.','Har bir ishga tushirish, dars o‘zgarishi va nemis tilidagi yutuq avval o‘sha yerga yoziladi.','Каждый запуск, изменение в классе и шаг в немецком сначала попадают туда.','p','lead')}
<div class="row"><a class="btn primary" href="journal.html">{T('h.hat4.a','Read the journal','Kundalikni o‘qish','Читать дневник')}{ic('arrow')}</a><a class="btn ghost" href="{TG}" target="_blank" rel="noopener">{ic('send')}Telegram</a></div>
</div></div></section>'''

def build_about():
    return page('about', '', 'pt.about', 'About', 'Men haqimda', 'Обо мне', 'About Clive (Baxriddin Imonqulov): English teacher, web developer and maker in Uzbekistan.', about_body(), ABOUT_CSS, ['assets/js/about.js'])

# ================================================================== CONTACT
CONTACT_CSS = '''
.ct{display:grid;grid-template-columns:1fr 1.15fr;gap:clamp(20px,3vw,48px);align-items:start}
@media(max-width:900px){.ct{grid-template-columns:1fr}}
.way{display:flex;gap:16px;align-items:center}
.way .ico{margin:0}
.way b{display:block;font:600 1.15rem/1.2 var(--head)}
.way .row{margin-left:auto}
@media(max-width:520px){.way{flex-wrap:wrap}.way .row{margin-left:0}}
form .grid{gap:16px}
.fl{display:grid;gap:8px}
.fl span{font-weight:700;font-size:.92rem}
.done{display:none}
.done.on{display:grid;gap:14px}
.done pre{white-space:pre-wrap;background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:14px;font:500 .92rem/1.5 var(--body);margin:0}
'''
def contact_body():
    topics = [('c.t1','A website for my business','Biznesim uchun sayt','Сайт для моего бизнеса'),('c.t2','Joining an English group','Ingliz tili guruhiga qo‘shilish','Запись в группу английского'),('c.t3','A question about a product','Mahsulot haqida savol','Вопрос о продукте'),('c.t4','Something else','Boshqa narsa','Другое')]
    opts = ''.join(f'<option value="{esc(en)}" data-i18n="{k}">{esc(en)}</option>' for k,en,uz,ru in topics)
    for k,en,uz,ru in topics: STR.setdefault(k,{'en':en,'uz':uz,'ru':ru})
    J('c.ok','Thanks! Your message is on its way. I’ll reply soon.','Rahmat! Xabaringiz yuborildi. Tez orada javob beraman.','Спасибо! Сообщение отправлено. Скоро отвечу.')
    J('c.fb','This preview can’t send messages. Copy your message and send it on Telegram or by email:','Bu ko‘rinish xabar yubora olmaydi. Xabaringizni nusxalab, Telegram yoki email orqali yuboring:','Этот предпросмотр не может отправлять сообщения. Скопируйте текст и отправьте в Telegram или на почту:')
    J('c.err','Sending didn’t work. Copy your message and send it on Telegram or by email:','Yuborib bo‘lmadi. Xabaringizni nusxalab, Telegram yoki email orqali yuboring:','Не удалось отправить. Скопируйте текст и отправьте в Telegram или на почту:')
    J('c.need','Please fill in your name and message.','Iltimos, ismingiz va xabaringizni yozing.','Пожалуйста, укажите имя и сообщение.')
    return f'''<section class="phero"><div class="wrap">
{crumbs('nav.contact','Contact','Aloqa','Контакты')}
{T('c.h','Let’s talk','Keling, gaplashamiz','Давайте поговорим','h1')}
{T('c.p','Telegram is the fastest way. Email works too. I reply in Uzbek or English.','Eng tezi Telegram. Email ham bo‘ladi. O‘zbek yoki ingliz tilida javob beraman.','Быстрее всего — Telegram. Почта тоже подойдёт. Отвечаю на узбекском или английском.','p','lead')}
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap ct">
<div class="grid">
<div class="card glow way" style="--c:var(--turq)" data-reveal><span class="ico">{ic('send')}</span><div><b>Telegram</b><span class="muted">@clive077</span></div><div class="row"><a class="btn primary sm" style="--c:var(--turq);--ci:#02201e" href="{TG}" target="_blank" rel="noopener">{T('c.open','Open','Ochish','Открыть')}</a><button class="iconbtn" data-copy="@clive077" aria-label="Copy">{ic('copy')}</button></div></div>
<div class="card glow way" style="--c:var(--blue)" data-reveal="60"><span class="ico">{ic('mail')}</span><div><b>Email</b><span class="muted" style="overflow-wrap:anywhere">{EMAIL}</span></div><div class="row"><a class="btn ghost sm" href="mailto:{EMAIL}">{T('c.write','Write','Yozish','Написать')}</a><button class="iconbtn" data-copy="{EMAIL}" aria-label="Copy">{ic('copy')}</button></div></div>
<div class="card way" style="--c:var(--gold)" data-reveal="120"><span class="ico">{ic('clock')}</span><div><b>{T('c.tz','Uzbekistan · UTC+5','O‘zbekiston · UTC+5','Узбекистан · UTC+5')}</b><span class="muted">{T('ft.time','Tashkent time','Toshkent vaqti','Время в Ташкенте')} <b class="num" style="display:inline;font-size:1rem" data-tash-clock>--:--</b></span></div></div>
<div class="card" data-reveal="180">{T('c.tip.h','Asking about a website?','Sayt haqida so‘ramoqchimisiz?','Спрашиваете о сайте?','h3')}{T('c.tip.p','Send your business name, what you sell, your phone and address, and the languages your customers use. Photos help a lot.','Biznesingiz nomi, nima sotishingiz, telefon va manzilingiz hamda mijozlaringiz qaysi tillarda gaplashishini yuboring. Suratlar juda yordam beradi.','Пришлите название бизнеса, что вы продаёте, телефон и адрес, а также языки ваших клиентов. Фото очень помогают.','p')}</div>
</div>
<form class="card" id="cform" name="contact" method="POST" data-netlify="true" netlify-honeypot="website" data-reveal="80">
<input type="hidden" name="form-name" value="contact">
<p hidden><label>Website <input name="website"></label></p>
<div class="grid" id="cfields">
{T('c.f.h','Send a message','Xabar yuborish','Отправить сообщение','h3')}
<label class="fl"><span>{T('c.f.n','Your name','Ismingiz','Ваше имя')}</span><input class="input" name="name" id="cf-name" autocomplete="name" required></label>
<label class="fl"><span>{T('c.f.c','Telegram or email, so I can reply','Javob berishim uchun Telegram yoki email','Telegram или email, чтобы я ответил')}</span><input class="input" name="contact" id="cf-contact" autocomplete="email"></label>
<label class="fl"><span>{T('c.f.t','Topic','Mavzu','Тема')}</span><select class="input select" name="topic" id="cf-topic">{opts}</select></label>
<label class="fl"><span>{T('c.f.m','Message','Xabar','Сообщение')}</span><textarea class="input" name="message" id="cf-msg" required></textarea></label>
<button class="btn primary" type="submit">{ic('send')}{T('c.f.s','Send','Yuborish','Отправить')}</button>
<p class="small faint" id="cf-err" role="alert"></p>
</div>
<div class="done" id="cdone" aria-live="polite"><p id="cd-msg"></p><pre id="cd-pre"></pre>
<div class="row"><button class="btn primary sm" type="button" id="cd-copy">{ic('copy')}{T('c.cp','Copy message','Xabarni nusxalash','Скопировать текст')}</button><a class="btn ghost sm" href="{TG}" target="_blank" rel="noopener">{ic('send')}Telegram</a><a class="btn ghost sm" id="cd-mail" href="mailto:{EMAIL}">{ic('mail')}Email</a></div>
<p class="small faint">{EMAIL} · @clive077</p></div>
</form>
</div></section>'''

def build_contact():
    return page('contact', '', 'pt.contact', 'Contact', 'Aloqa', 'Контакты', 'Contact Clive on Telegram @clive077 or by email.', contact_body(), CONTACT_CSS, ['assets/js/contact.js'])

# ================================================================== BRAND
def vaqt_icon(uid='vi', size=None):
    s = f' width="{size}" height="{size}"' if size else ''
    return (f'<svg viewBox="0 0 64 64"{s} aria-hidden="true"><defs><linearGradient id="{uid}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F3D2C"/><stop offset="1" stop-color="#07231A"/></linearGradient></defs>'
            f'<rect width="64" height="64" rx="16" fill="url(#{uid}b)"/>'
            f'<circle cx="32" cy="32" r="22" fill="none" stroke="#1E5C45" stroke-width="4"/>'
            f'<path d="M32 10 A22 22 0 1 1 10.3 35.5" fill="none" stroke="#3DDC97" stroke-width="4" stroke-linecap="round"/>'
            f'<path d="M32 46 Q31 38 32 30" stroke="#3DDC97" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
            f'<path d="M32 44 C27 42 24 38 24 34 C28 35 31 39 32 44Z" fill="#3DDC97"/>'
            f'<path d="M24.5 30 C24 24 27 20 32 18.5 C37 20 40 24 39.5 30 C37 32 27 32 24.5 30Z" fill="#E5484D"/>'
            f'<path d="M28 29 C27.5 24 29.5 21 32 19.5 C32 23 32 26.5 32 30.5Z" fill="#FF8A8E"/></svg>')

BRAND_CSS = '''
.logos{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:860px){.logos{grid-template-columns:1fr}}
.lg{display:grid;gap:14px}
.lg .stage{aspect-ratio:4/3;border-radius:18px;display:grid;place-items:center;border:1px solid var(--line)}
.lg .stage svg{width:42%;height:auto}
.lg .stage.wm{gap:12px;grid-auto-flow:column;place-content:center}
.lg .stage.wm svg{width:64px}
.lg .stage.wm b{font:700 2.4rem/1 var(--head);letter-spacing:-.03em}
.sw{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:900px){.sw{grid-template-columns:1fr 1fr}}
.sw button{display:grid;text-align:left;border-radius:18px;overflow:hidden;border:1px solid var(--line);background:var(--card)}
.sw .chipc{height:96px;background:var(--c)}
.sw .txt{padding:12px 14px;display:grid;gap:2px}
.sw .txt b{font-family:var(--head);font-weight:600}
.sw .txt code{color:var(--sub);font-size:.85rem}
.type{grid-template-columns:1fr 1fr}
@media(max-width:860px){.type{grid-template-columns:1fr}}
.type .spec{font:700 clamp(3rem,7vw,5rem)/1 var(--head);letter-spacing:-.03em}
.type .spec.m{font-family:var(--body);font-weight:700}
.marks{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:860px){.marks{grid-template-columns:1fr 1fr}}
.marks .card{display:grid;justify-items:center;gap:12px;text-align:center}
.marks img,.marks svg{width:96px;height:96px;border-radius:24px}
'''
def brand_body():
    colours = [('Night','#070A18','#F4F6FC','bg'),('ClivEdu blue','#5B7CFF','#2F55E8','blue'),('Class turquoise','#22CFC6','#0B8E88','turq'),('Sprachwerk gold','#F5C04A','#9A7000','gold'),('Vaqt green','#3DDC97','#13884F','green'),('Vault amber','#FF9B3D','#B35A00','amber'),('Shop pomegranate','#FF5C7A','#D22A50','rose'),('Glow violet','#9B7BFF','#6A45E0','violet')]
    sw = ''.join(f'<button data-copy="{d}" style="--c:{d}" data-reveal="{i*40}"><span class="chipc"></span><span class="txt"><b>{esc(n)}</b><code>{T("b.night","Night","Tun","Ночь")} {d} · {T("b.day","Day","Kun","День")} {l}</code></span></button>' for i,(n,d,l,v) in enumerate(colours))
    m = mark('bm1', None)
    J('b.svgc','SVG copied','SVG nusxalandi','SVG скопирован')
    return f'''<section class="phero"><div class="wrap">
{crumbs('nav.brand','Brand kit','Brend to‘plami','Бренд-кит')}
{T('b.h','Brand kit','Brend to‘plami','Бренд-кит','h1')}
{T('b.p','The mark, colours and type of the Clive orbit. Use them when you write about my products or link to them.','Clive orbitasining belgisi, ranglari va shriftlari. Mahsulotlarim haqida yozganda yoki ularga havola berganda foydalaning.','Знак, цвета и шрифты орбиты Clive. Используйте их, когда пишете о моих продуктах или ссылаетесь на них.','p','lead')}
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap">
{sh('b.m.l','The mark','Belgi','Знак','b.m.h','A star that opens into a C','C ga ochiladigan yulduz','Звезда, раскрывающаяся в C',('b.m.p','An eight-point star from Uzbek tilework, open on the right like a C, with one planet on its orbit.','O‘zbek koshinkorligidagi sakkiz qirrali yulduz, o‘ng tomonda C kabi ochiq, orbitasida bitta sayyora bilan.','Восьмиконечная звезда из узбекских изразцов, открытая справа как буква C, с одной планетой на орбите.'))}
<div class="grid logos">
<div class="lg" data-reveal><div class="stage" style="background:#070A18" id="lg1">{mark('bl1')}</div><div class="row"><b>{T('b.l1','On night','Tun fonida','На тёмном')}</b><button class="btn ghost sm" data-svg="lg1" style="margin-left:auto">{ic('copy')}SVG</button><a class="btn ghost sm" href="assets/brand/clive-mark.svg" download>{ic('download')}</a></div></div>
<div class="lg" data-reveal="60"><div class="stage" style="background:#F4F6FC" id="lg2">{mark('bl2')}</div><div class="row"><b>{T('b.l2','On day','Kun fonida','На светлом')}</b><button class="btn ghost sm" data-svg="lg2" style="margin-left:auto">{ic('copy')}SVG</button><a class="btn ghost sm" href="assets/brand/clive-mark.svg" download>{ic('download')}</a></div></div>
<div class="lg" data-reveal="120"><div class="stage wm" style="background:#0B1024;color:#EEF1FF" id="lg3">{mark('bl3')}<b>Clive</b></div><div class="row"><b>{T('b.l3','Wordmark','So‘z belgisi','Логотип со словом')}</b><button class="btn ghost sm" data-svg="lg3" style="margin-left:auto">{ic('copy')}SVG</button><a class="btn ghost sm" href="assets/brand/clive-wordmark.svg" download>{ic('download')}</a></div></div>
</div>
<ul class="list-check mt3" style="max-width:760px">
<li>{ic('check')}{T('b.r1','Keep the opening on the right. That’s the C.','Ochiq tomonni o‘ngda qoldiring. Bu — C.','Оставляйте разрыв справа. Это и есть C.')}</li>
<li>{ic('check')}{T('b.r2','Give the mark space around it, at least the size of its planet.','Belgi atrofida kamida sayyorasi kattaligida bo‘sh joy qoldiring.','Оставляйте вокруг знака место не меньше размера его планеты.')}</li>
<li>{ic('check')}{T('b.r3','Each product keeps its own colour; don’t swap them.','Har bir mahsulot o‘z rangini saqlaydi; ularni almashtirmang.','У каждого продукта свой цвет; не меняйте их местами.')}</li>
</ul></div></section>
<section class="band"><div class="wrap">
{sh('b.c.l','Colours','Ranglar','Цвета','b.c.h','One colour per planet','Har bir sayyoraga bitta rang','Один цвет на планету',('b.c.p','Tap a colour to copy its night hex. Day values are darker so text stays readable on light backgrounds.','Rangni bosing — tun HEX kodi nusxalanadi. Kun qiymatlari to‘qroq, shunda matn och fonda ham o‘qiladi.','Нажмите на цвет, чтобы скопировать ночной HEX. Дневные значения темнее, чтобы текст читался на светлом фоне.'))}
<div class="grid sw">{sw}</div></div></section>
<section class="band"><div class="wrap">
{sh('b.t.l','Type','Shriftlar','Шрифты','b.t.h','Unbounded and Manrope','Unbounded va Manrope','Unbounded и Manrope')}
<div class="grid type">
<div class="card" data-reveal><div class="spec">Aa Бб Oʻo‘</div><h3 class="mt2">Unbounded</h3>{T('b.t1','Titles and numbers. Wide, round and confident; covers Latin and Cyrillic.','Sarlavhalar va raqamlar uchun. Keng, yumaloq va ishonchli; lotin va kirillni qamrab oladi.','Для заголовков и цифр. Широкий, округлый, уверенный; поддерживает латиницу и кириллицу.','p')}<p class="small faint">G‘alaba · O‘qituvchi · Привет · Grüße</p></div>
<div class="card" data-reveal="60"><div class="spec m">Aa Бб Oʻo‘</div><h3 class="mt2">Manrope</h3>{T('b.t2','Everything you read. Clear on small phones, with full Cyrillic.','O‘qiladigan hamma narsa uchun. Kichik telefonlarda aniq, to‘liq kirill bilan.','Для всего, что читается. Чётко на маленьких экранах, полная кириллица.','p')}<p class="small faint">G‘alaba · O‘qituvchi · Привет · Grüße</p></div>
</div></div></section>
<section class="band"><div class="wrap">
{sh('b.p.l','Product marks','Mahsulot belgilari','Знаки продуктов','b.p.h','The planets','Sayyoralar','Планеты')}
<div class="grid marks">
<div class="card" data-reveal>{vaqt_icon('bv')}<b>Vaqt</b><span class="chip c" style="--c:var(--green)">#3DDC97</span></div>
<div class="card" data-reveal="60"><img src="assets/img/clivedu-logo.webp" alt="ClivEdu logo" width="96" height="96"><b>ClivEdu · Class</b><span class="chip c" style="--c:var(--blue)">#5B7CFF</span></div>
<div class="card" data-reveal="120"><img src="assets/img/sprachwerk-logo.webp" alt="Sprachwerk logo" width="96" height="96"><b>Sprachwerk</b><span class="chip c" style="--c:var(--gold)">#F5C04A</span></div>
<div class="card" data-reveal="180"><span style="width:96px;height:96px;border-radius:24px;display:grid;place-items:center;background:#1b1206;color:var(--amber)">{ic('video')}</span><b>Vault Studio</b><span class="chip c" style="--c:var(--amber)">#FF9B3D</span></div>
</div></div></section>'''

def build_brand():
    return page('brand', '', 'pt.brand', 'Brand kit', 'Brend to‘plami', 'Бренд-кит', 'Clive brand kit: the mark, colours and type.', brand_body(), BRAND_CSS + '.marks .card>span svg{width:44px;height:44px}', ['assets/js/brand.js'])

# ================================================================== LINKS (bare)
LINKS_CSS = '''
.lk{min-height:100vh;display:grid;place-items:start center;padding:48px 18px 40px}
.lk .in{width:min(480px,100%);display:grid;gap:12px;text-align:center}
.lk .av{width:96px;height:96px;margin:0 auto;border-radius:30px;display:grid;place-items:center;background:var(--card);border:1px solid var(--line2)}
.lk .av svg{width:64px;height:64px}
.lk h1{font-size:2.2rem}
.lk a.l{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:18px;border:1px solid var(--line);background:var(--card);text-align:left;font-weight:700;transition:transform .2s,border-color .2s}
.lk a.l:hover{transform:translateY(-2px);border-color:var(--c)}
.lk a.l .ico{margin:0;width:40px;height:40px}
.lk a.l span.s{display:block;font-weight:500;color:var(--sub);font-size:.88rem}
.lk a.l>svg{margin-left:auto;width:18px;height:18px;color:var(--mute);flex:none}
'''
def links_body():
    L = [('var(--green)','leaf','Vaqt','vaqt/index.html','pd.vaqt.tag'),('var(--turq)','cap','ClivEdu Class','https://clivedu.me/','pd.class.tag'),('var(--blue)','star','ClivEdu',P('clivedu')['url'],'pd.clivedu.tag'),('var(--gold)','globe','Sprachwerk',P('sprachwerk')['url'],'pd.sprachwerk.tag'),('var(--violet)','calendar','Reja','reja/','pd.reja.tag'),('var(--rose)','book','Technical Issues Q&amp;A',WHOP_EBOOK,None),('var(--amber)','youtube','WonderVault',YT,None),('var(--turq)','send','Telegram @clive077',TG,None),('var(--blue)','mail','Email','mailto:'+EMAIL,None),('var(--violet)','orbit','clive · orbit','index.html',None)]
    out = ''
    for i,(c,icn,n,u,sub) in enumerate(L):
        ext = u.startswith('http')
        s = ''
        if sub:
            pid = sub.split('.')[1]; en,uz,ru = PD[pid]['tag']; s = T(sub,en,uz,ru,'span','s')
        elif 'WonderVault' in n: s = T('lk.wv','Amazing facts & mysteries on YouTube','YouTube’da ajoyib faktlar va sirlar','Удивительные факты и тайны на YouTube','span','s')
        elif 'Q&amp;A' in n: s = T('lk.eb','eBook · $9 on Whop','Elektron kitob · Whop’da $9','Электронная книга · $9 на Whop','span','s')
        elif n == 'Email': s = f'<span class="s">{EMAIL}</span>'
        elif 'orbit' in n: s = T('lk.all','Everything I make, in one place','Men yaratgan hamma narsa bir joyda','Всё, что я делаю, в одном месте','span','s')
        out += f'<a class="l" style="--c:{c}" href="{u}"{" target=_blank rel=noopener" if ext else ""} data-reveal="{i*40}"><span class="ico" style="--c:{c}">{ic(icn)}</span><span>{n}{s}</span>{ic("ext" if ext else "arrow")}</a>'
    return f'''<div class="lk"><div class="in">
<div class="av">{mark('lkm')}</div>
<h1>Clive</h1>
{T('lk.p','Teacher · Web developer · Maker','O‘qituvchi · Veb-dasturchi · Yaratuvchi','Учитель · Веб-разработчик · Автор','p','muted')}
<div class="langsel" role="group" aria-label="Language" style="margin:4px auto 10px;width:max-content"><button data-setlang="en">EN</button><button data-setlang="uz">UZ</button><button data-setlang="ru">RU</button></div>
{out}
<p class="small faint mt2">© <span data-year>2026</span> Imonqulov Baxriddin</p>
</div></div>'''

def build_links():
    return page('links', '', 'pt.links', 'Links', 'Havolalar', 'Ссылки', 'All of Clive’s links in one place.', links_body(), LINKS_CSS, [], bare=True)

# ================================================================== 404
NF_CSS = '''
.nf{min-height:70vh;display:grid;place-items:center;text-align:center;padding:40px 18px}
.nf .n{font:700 clamp(6rem,24vw,14rem)/.9 var(--head);letter-spacing:-.05em;background:linear-gradient(180deg,var(--ink),transparent);-webkit-background-clip:text;background-clip:text;color:transparent}
.nf .pl{width:110px;height:110px;margin:0 auto 10px;animation:float 5s ease-in-out infinite}
@keyframes float{50%{transform:translateY(-12px) rotate(8deg)}}
:root[data-motion=reduced] .nf .pl{animation:none}
'''
def nf_body(root):
    return f'''<section class="nf"><div>
<div class="pl">{mark('nfm', 110)}</div>
<div class="n">404</div>
{T('nf.h','Lost in orbit','Orbitada adashdingiz','Потерялись на орбите','h1')}
{T('nf.p','This page drifted off. The rest of the orbit is right where you left it.','Bu sahifa uchib ketdi. Orbitaning qolgan qismi joyida.','Эта страница улетела. Остальная орбита на месте.','p','lead mt1')}
<div class="row mt2" style="justify-content:center"><a class="btn primary" href="{root}index.html">{T('nf.b','Back home','Bosh sahifaga','На главную')}{ic('home')}</a><button class="btn ghost" data-open="cmdk">{ic('search')}{T('a.search2','Search','Qidirish','Поиск')}</button></div>
</div></section>'''

def build_404():
    return page('404', '/', 'pt.404', 'Lost in orbit', 'Orbitada adashdingiz', 'Потерялись на орбите', 'Page not found.', nf_body('/'), NF_CSS, [])

# ================================================================== ME (Clive ID)
ME_CSS = '''
.me{display:grid;grid-template-columns:360px 1fr;gap:clamp(18px,2.4vw,28px);align-items:start}
@media(max-width:940px){.me{grid-template-columns:1fr}}
.pcard{position:sticky;top:96px;display:grid;gap:16px;text-align:center}
@media(max-width:940px){.pcard{position:static}}
.avatar{width:132px;height:132px;margin:0 auto;border-radius:40px;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,color-mix(in srgb,var(--av,var(--blue)) 55%,#fff 10%),var(--av,var(--blue)));box-shadow:0 20px 50px -20px var(--av,var(--blue));position:relative}
.avatar b{font:700 2.6rem/1 var(--head);color:#fff;position:relative;z-index:1}
.avatar svg{position:absolute;inset:10px;width:calc(100% - 20px);height:calc(100% - 20px);opacity:.25;color:#fff;transition:opacity .3s}
.avatar.empty svg{opacity:.85}
.avc{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.avc button{width:30px;height:30px;border-radius:50%;background:var(--c);border:3px solid transparent;box-shadow:0 0 0 1px var(--line)}
.avc button[aria-pressed=true]{border-color:var(--bg);box-shadow:0 0 0 2px var(--c)}
.sect{display:grid;gap:18px}
.sect>.card>h2{font-size:1.4rem;margin-bottom:6px}
.chk{display:flex;flex-wrap:wrap;gap:8px}
.chk button{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--line2);font-weight:700;font-size:.9rem;color:var(--sub)}
.chk button[aria-pressed=true]{background:color-mix(in srgb,var(--acc) 18%,transparent);border-color:var(--acc);color:var(--ink)}
.stats4{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:640px){.stats4{grid-template-columns:1fr 1fr}}
.code{font:700 1.6rem/1 var(--head);letter-spacing:.08em;padding:16px;border-radius:16px;background:var(--card2);border:1px dashed var(--line2);text-align:center}
.words{display:grid;gap:8px;max-height:320px;overflow:auto}
.words div{display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) 40px;gap:8px;align-items:center;padding:10px 12px;border-radius:12px;background:var(--card2);font-size:.92rem}
@media(max-width:560px){.words div{grid-template-columns:1fr 1fr 40px}.words div span:nth-child(3),.words div span:nth-child(4){display:none}}
.confirm{display:none;gap:10px;align-items:center;flex-wrap:wrap;padding:12px;border-radius:14px;border:1px solid var(--rose);background:color-mix(in srgb,var(--rose) 10%,transparent)}
.confirm.on{display:flex}

/* ---------- c-ID ---------- */
.cidwrap{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(20px,3vw,44px);align-items:center}
@media(max-width:980px){.cidwrap{grid-template-columns:1fr}}
.cidstage{perspective:1600px;padding:clamp(6px,2vw,24px) 0;position:relative}
.cidstage::before{content:"";position:absolute;inset:8% 4%;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--violet) 45%,transparent),transparent);filter:blur(40px);opacity:.7;z-index:-1}
.cidcard{--rx:0deg;--ry:0deg;--hx:50%;--hy:30%;--ha:40deg;width:min(100%,640px);margin:0 auto;aspect-ratio:1.586;container-type:inline-size;position:relative;transform:rotateX(var(--rx)) rotateY(var(--ry));transition:transform .25s ease-out;transform-style:preserve-3d;cursor:grab}
.cidin{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.cidcard.flip .cidin{transform:rotateY(180deg)}
.cidcard .face{position:absolute;inset:0;border-radius:5.4cqw;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#07071c;color:#fff;box-shadow:0 4cqw 9cqw -3cqw rgba(60,30,200,.65),0 0 0 1px rgba(255,255,255,.16) inset,0 1px 0 rgba(255,255,255,.35) inset}
.cidcard .back{transform:rotateY(180deg)}
.cidcard canvas{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;pointer-events:none}
.cidcard .holo{position:absolute;inset:0;pointer-events:none;mix-blend-mode:color-dodge;opacity:.28;background:conic-gradient(from var(--ha) at var(--hx) var(--hy),#ff6fae,#f5c04a,#22cfc6,#9b7bff,#ff6fae);mask:linear-gradient(115deg,transparent 20%,#000 45%,transparent 60%,#000 80%,transparent);-webkit-mask:linear-gradient(115deg,transparent 20%,#000 45%,transparent 60%,#000 80%,transparent);transition:opacity .3s}
.cidcard:hover .holo{opacity:.45}
.cidcard .glare{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--hx) var(--hy),rgba(255,255,255,.22),transparent 45%);mix-blend-mode:overlay}
.specimen{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-18deg);font:700 11cqw/1 var(--head);letter-spacing:.08em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.22);pointer-events:none;z-index:3}
.cf,.cb{position:absolute;inset:0;padding:4.6cqw 5.2cqw 3.6cqw;display:flex;flex-direction:column;z-index:2;font-size:2.4cqw;text-shadow:0 1px 3px rgba(4,3,20,.9),0 0 14px rgba(4,3,20,.85)}
.cf header{display:flex;justify-content:space-between;align-items:flex-start}
.cf .brand{display:flex;align-items:center;gap:1.2cqw;font:700 2.1cqw/1 var(--head);letter-spacing:.32em;opacity:.92}
.cf .brand svg,.rank svg{width:3cqw;height:3cqw;color:#f5c04a;filter:drop-shadow(0 0 1cqw rgba(245,192,74,.7))}
.cf .ttl{text-align:right;line-height:1}
.cf .ttl b{display:block;font:700 7.4cqw/1 var(--head);letter-spacing:-.02em;background:linear-gradient(100deg,#fff 10%,#cbbcff 40%,#7ff1e8 70%,#ffd6f0);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 2cqw rgba(155,123,255,.55))}
.cf .ttl small{display:block;margin-top:.8cqw;font-size:1.6cqw;letter-spacing:.24em;text-transform:uppercase;opacity:.75}
.cf .mid{flex:1;display:flex;gap:4.2cqw;align-items:center;position:relative;min-height:0}
.cf .ph{flex:none;width:25cqw;aspect-ratio:1;border-radius:4.4cqw;position:relative;display:grid;place-items:center;background:linear-gradient(135deg,#2b1a6b,#0d1a3a);box-shadow:0 0 0 .5cqw rgba(255,255,255,.85),0 0 0 1.1cqw rgba(155,123,255,.55),0 0 6cqw rgba(155,123,255,.7)}
.cf .ph img{width:100%;height:100%;object-fit:cover;border-radius:inherit}
.cf .ph b{font:700 10cqw/1 var(--head)}
.cf .ph.rk4,.cf .ph.rk5,.cf .ph.rk6{box-shadow:0 0 0 .5cqw #fff4c9,0 0 0 1.1cqw rgba(245,192,74,.75),0 0 7cqw rgba(245,192,74,.6)}
.cf .info{min-width:0;flex:1}
.cf .info>small,.cf dt{display:block;font-size:1.5cqw;letter-spacing:.2em;text-transform:uppercase;opacity:.8}
.cf .nm{font:700 5cqw/1.05 var(--head);margin:.6cqw 0 1.2cqw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff}
.cf .rank{display:inline-flex;align-items:center;gap:1cqw;padding:.7cqw 1.8cqw;border-radius:99px;font-weight:800;font-size:1.9cqw;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(6px)}
.cf dl{display:grid;grid-template-columns:1fr 1fr;gap:1.6cqw 3cqw;margin:2.2cqw 0 0}
.cf dl .wide{grid-column:1/-1}
.cf dd{margin:.4cqw 0 0;font-weight:700;font-size:2.4cqw}
.cf dd.num{font:600 3.6cqw/1 ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;letter-spacing:.1em;color:#fff4d6;filter:drop-shadow(0 0 1.2cqw rgba(4,3,20,.95)) drop-shadow(0 0 .6cqw rgba(245,192,74,.45))}
.cf .chip{width:7.4cqw;margin:.4cqw 2.6cqw 0 auto;filter:drop-shadow(0 .6cqw 1.2cqw rgba(0,0,0,.5))}
.cf .nm.long{font-size:3.8cqw;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.cidside p svg{display:inline-block;width:16px;height:16px;vertical-align:-3px}
.cf .ttl b,.cf dd.num{text-shadow:none}
.cf .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4cqw;margin-top:2cqw}
.cf .stats span,.cb .bst span{display:flex;flex-direction:column;gap:.3cqw;padding:1.2cqw 1.6cqw;border-radius:2cqw;background:rgba(10,8,40,.42);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(8px);font-size:1.55cqw;opacity:.95;line-height:1.15}
.cf .stats b,.cb .bst b{font:700 3.3cqw/1 var(--head)}
.cf .mrz{margin-top:1.8cqw;font:500 1.75cqw/1.35 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.18em;opacity:.5;white-space:nowrap;overflow:hidden}
.cb .stripe{position:absolute;left:0;right:0;top:7cqw;height:8cqw;background:linear-gradient(90deg,#0a0a14,#1b1840 50%,#0a0a14);opacity:.85}
.cb .bgrid{position:relative;margin-top:14cqw;display:grid;grid-template-columns:22cqw 1fr;gap:3cqw;align-items:center}
.cb .emb{display:grid;place-items:center;text-align:center;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.25),rgba(108,79,240,.25) 45%,rgba(10,8,40,.6));border:1px solid rgba(255,255,255,.3);box-shadow:0 0 5cqw rgba(155,123,255,.5);align-content:center;gap:.6cqw}
.cb .emb svg{width:7cqw;height:7cqw;color:#f5c04a;filter:drop-shadow(0 0 2cqw rgba(245,192,74,.8))}
.cb .emb b{font:700 2.4cqw/1 var(--head)}.cb .emb small{font-size:1.4cqw;opacity:.7}
.cb .bst{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2cqw}
.cb .bst b{font-size:2.8cqw}
.cb .cons{margin-top:2.4cqw;position:relative}.cb .cons small{font-size:1.5cqw;letter-spacing:.2em;text-transform:uppercase;opacity:.6}
.cb .cons svg{display:block;width:100%;height:9cqw}
.cb .own{position:relative;margin:auto 0 0;font-size:1.7cqw;opacity:.75}
.cidhint{text-align:center;margin-top:12px}
.cidside h2{font-size:clamp(1.5rem,2.6vw,2.1rem)}
.cidside .steps{margin:0;padding-left:1.3em;display:grid;gap:8px}
.cidnote{display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,var(--turq) 12%,transparent);border:1px solid color-mix(in srgb,var(--turq) 35%,transparent)}
.cidnote svg{width:18px;height:18px;flex:none;margin-top:2px}
.waiting{display:flex;align-items:center;gap:10px}
.spin{width:16px;height:16px;border-radius:50%;border:2px solid var(--line2);border-top-color:var(--violet);animation:cidspin .8s linear infinite;flex:none}
@keyframes cidspin{to{transform:rotate(360deg)}}
.cidmodal{position:fixed;inset:0;z-index:300;display:grid;place-items:center;padding:16px}
.cidmodal .cm-bg{position:absolute;inset:0;background:rgba(3,4,16,.7);backdrop-filter:blur(6px)}
.cidmodal .cm{position:relative;width:min(640px,100%);max-height:min(86vh,760px);overflow:auto;border-radius:24px;background:var(--bg2,#0d1030);border:1px solid var(--line2);padding:18px 20px 22px;box-shadow:0 30px 80px -20px rgba(0,0,0,.6)}
.cm-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.cm-h h3{font-size:1.25rem}
.cmtabs{margin-bottom:14px}
.avgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:10px;margin-bottom:12px}
.avgrid button{aspect-ratio:1;border-radius:18px;overflow:hidden;padding:0;border:2px solid transparent;box-shadow:0 0 0 1px var(--line);transition:transform .15s}
.avgrid button:hover{transform:translateY(-2px) scale(1.03)}
.avgrid button[aria-pressed=true]{border-color:var(--violet);box-shadow:0 0 0 3px color-mix(in srgb,var(--violet) 40%,transparent)}
.avgrid img{width:100%;height:100%;object-fit:cover;display:block}
.upl{display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:start}
.upv{width:120px;height:120px;border-radius:24px;display:grid;place-items:center;background:var(--card2);border:1px dashed var(--line2);overflow:hidden}
.upv img{width:100%;height:100%;object-fit:cover}.upv svg{width:40px;height:40px;opacity:.5}
@media(max-width:520px){.upl{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.cidin,.cidcard{transition:none}}
'''
def me_body():
    sw = ''.join(f'<button data-av="{v}" style="--c:var(--{v})" aria-label="{v}"></button>' for v in ['blue','turq','gold','green','amber','rose','violet'])
    goals = [('learn-en','m.g1','Learning English','Ingliz tilini o‘rganyapman','Учу английский'),('learn-de','m.g2','Learning German','Nemis tilini o‘rganyapman','Учу немецкий'),('focus','m.g3','Focus & time','Fokus va vaqt','Фокус и время'),('site','m.g4','A website','Sayt','Сайт'),('look','m.g5','Just looking','Shunchaki ko‘ryapman','Просто смотрю')]
    gb = ''.join(f'<button data-goal="{g}" aria-pressed="false">{T(k,en,uz,ru)}</button>' for g,k,en,uz,ru in goals)
    sw2 = ''.join(f'<button data-set="accent={a}" style="--c:var(--{a})" aria-label="{a}"></button>' for a in ['blue','turq','gold','green','amber','rose','violet'])
    for k in [('m.saved','Saved','Saqlandi','Сохранено'),('m.nosync','Sync works on the published site. Here, use a backup file or copy.','Sinxronlash e’lon qilingan saytda ishlaydi. Bu yerda zaxira fayl yoki nusxadan foydalaning.','Синхронизация работает на опубликованном сайте. Здесь используйте файл копии или копирование.'),
              ('m.up.ok','Uploaded. Use this code on your other device.','Yuklandi. Bu kodni boshqa qurilmangizda ishlating.','Загружено. Введите этот код на другом устройстве.'),('m.pull.ok','Restored from your sync code.','Sinxron kod orqali tiklandi.','Восстановлено по коду синхронизации.'),
              ('m.pull.none','No data found for that code.','Bu kod uchun ma’lumot topilmadi.','По этому коду ничего не найдено.'),('m.err','Something went wrong. Try again in a moment.','Nimadir xato ketdi. Birozdan so‘ng qayta urinib ko‘ring.','Что-то пошло не так. Попробуйте чуть позже.'),
              ('m.imp.ok','Backup restored.','Zaxira tiklandi.','Резервная копия восстановлена.'),('m.imp.bad','That file isn’t a Clive backup.','Bu fayl Clive zaxirasi emas.','Это не резервная копия Clive.'),
              ('m.reset.ok','Everything on this device was cleared.','Bu qurilmadagi hamma narsa o‘chirildi.','Всё на этом устройстве удалено.'),('m.nowords','No saved words yet. Save one from the word of the day on the home page.','Hali saqlangan so‘z yo‘q. Bosh sahifadagi kun so‘zidan birini saqlang.','Сохранённых слов пока нет. Сохраните слово дня на главной.'),
              ('m.copied.bk','Backup copied. Paste it into a note to keep it.','Zaxira nusxalandi. Saqlash uchun eslatmaga joylang.','Копия скопирована. Вставьте её в заметку, чтобы сохранить.'),('m.guest','Guest','Mehmon','Гость')]:
        J(*k)
    return f'''<section class="phero" style="padding-bottom:12px"><div class="wrap">
{crumbs('nav.me','c-ID','c-ID','c-ID')}
{T('m.h','c-ID','c-ID','c-ID','h1')}
{T('m.p','One ID for the whole Clive orbit. You get it by signing in with Telegram through @clivedubot, so every person has exactly one. Your number, your picture and your progress live inside it.','Butun Clive orbitasi uchun bitta ID. Uni @clivedubot orqali Telegram bilan kirib olasiz, shuning uchun har bir insonda faqat bittasi bo‘ladi. Raqamingiz, rasmingiz va natijalaringiz uning ichida.','Один ID для всей орбиты Clive. Его получают, войдя через Telegram в @clivedubot, поэтому у каждого он ровно один. Внутри — ваш номер, фото и прогресс.','p','lead')}
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap cidwrap">
<div><div class="cidstage" id="cidstage"><div class="cidcard" id="cidcard" aria-label="c-ID card"></div></div>
{T('m.hint','Double-click or swipe the card to turn it over.','Kartani aylantirish uchun ikki marta bosing yoki suring.','Дважды нажмите или проведите по карте, чтобы перевернуть её.','p','small faint cidhint')}</div>
<div class="card cidside" id="cidside" aria-live="polite"></div>
</div></section>
<section class="band tight" style="padding-top:0"><div class="wrap">
<div class="sect">
<div class="card" data-reveal style="--c:var(--green)"><div class="row between"><h2>{T('m.f.h','Your focus','Fokusingiz','Ваш фокус')}</h2><a class="btn primary sm" href="vaqt/index.html" style="--c:var(--green);--ci:#03170d">{ic('leaf')}Vaqt</a></div>
<div class="grid stats4 mt2"><div class="kpi"><b id="st-today">0</b>{T('m.f1','minutes today','bugun daqiqa','минут сегодня')}</div><div class="kpi"><b id="st-total">0</b>{T('m.f2','minutes in total','jami daqiqa','минут всего')}</div><div class="kpi"><b id="st-plants">0</b>{T('m.f3','plants grown','o‘stirilgan o‘simlik','выращено растений')}</div><div class="kpi"><b id="st-streak">0</b>{T('m.f4','day streak','kunlik seriya','дней подряд')}</div></div></div>
<div class="card" data-reveal><h2>{T('m.a.h','Look and feel','Ko‘rinish','Внешний вид')}</h2>
<div class="grid g2 mt2">
<div class="field"><span>{T('dr.theme','Sky','Osmon','Небо')}</span><div class="seg"><button data-set="theme=dark">{ic('moon')}{T('dr.night','Night','Tun','Ночь')}</button><button data-set="theme=light">{ic('sun')}{T('dr.day','Day','Kun','День')}</button><button data-set="theme=auto">{ic('auto')}{T('dr.auto','Auto','Avto','Авто')}</button></div></div>
<div class="field"><span>{T('dr.lang','Language','Til','Язык')}</span><div class="seg"><button data-setlang="en">EN</button><button data-setlang="uz">UZ</button><button data-setlang="ru">RU</button></div></div>
<div class="field"><span>{T('dr.motion','Motion','Harakat','Анимация')}</span><div class="seg"><button data-set="motion=full">{T('dr.full','Full','To‘liq','Полная')}</button><button data-set="motion=reduced">{T('dr.calm','Calm','Sokin','Спокойная')}</button></div></div>
<div class="field"><span>{T('dr.size','Text size','Matn o‘lchami','Размер текста')}</span><div class="seg"><button data-set="fs=0.92">A−</button><button data-set="fs=1">A</button><button data-set="fs=1.1">A+</button></div></div>
<div class="field"><span>{T('dr.accent','Accent colour','Asosiy rang','Акцентный цвет')}</span><div class="swatches">{sw2}</div></div>
</div></div>
<div class="card" data-reveal><h2>{T('m.w.h','Saved words','Saqlangan so‘zlar','Сохранённые слова')}</h2><div class="words mt1" id="words"></div></div>
<div class="card" id="sync-card" data-reveal style="--c:var(--blue)"><h2>{T('m.s.h','Move to another device','Boshqa qurilmaga ko‘chirish','Перенос на другое устройство')}</h2>
{T('m.s.p','Upload creates a private sync code. Type the same code on your other phone or computer to bring your profile, settings, words and Vaqt garden with you.','Yuklash shaxsiy sinxron kod yaratadi. Profil, sozlamalar, so‘zlar va Vaqt bog‘ingizni olib o‘tish uchun xuddi shu kodni boshqa telefon yoki kompyuterda kiriting.','Загрузка создаёт личный код синхронизации. Введите тот же код на другом телефоне или компьютере, чтобы перенести профиль, настройки, слова и сад Vaqt.','p','muted')}
<div class="grid g2 mt2" style="align-items:end">
<div class="field"><span>{T('m.s.mine','Your sync code','Sinxron kodingiz','Ваш код синхронизации')}</span><div class="code" id="sync-code">—</div><div class="row"><button class="btn primary sm" id="sync-up">{ic('upload')}{T('m.s.up','Upload now','Hozir yuklash','Загрузить сейчас')}</button><button class="btn ghost sm" id="sync-copy">{ic('copy')}{T('m.s.cp','Copy code','Kodni nusxalash','Скопировать код')}</button></div></div>
<div class="field"><span>{T('m.s.have','Have a code from another device?','Boshqa qurilmadan kod bormi?','Есть код с другого устройства?')}</span><input class="input" id="sync-in" placeholder="CLV-XXXX-XXXX" autocomplete="off" spellcheck="false"><button class="btn ghost sm" id="sync-pull">{ic('download')}{T('m.s.pull','Restore from code','Koddan tiklash','Восстановить по коду')}</button></div>
</div><p class="small faint mt1" id="sync-msg" role="status"></p></div>
<div class="card" data-reveal><h2>{T('m.b.h','Backup','Zaxira','Резервная копия')}</h2>
<div class="row mt1"><button class="btn ghost sm" id="bk-dl">{ic('download')}{T('m.b.dl','Download backup','Zaxirani yuklab olish','Скачать копию')}</button><button class="btn ghost sm" id="bk-copy">{ic('copy')}{T('m.b.cp','Copy backup','Zaxirani nusxalash','Скопировать копию')}</button><label class="btn ghost sm" style="cursor:pointer">{ic('upload')}{T('m.b.im','Restore from file','Fayldan tiklash','Восстановить из файла')}<input type="file" id="bk-file" accept="application/json,.json" hidden></label><button class="btn ghost sm" id="rs-ask" style="--c:var(--rose)">{ic('trash')}{T('m.r','Clear this device','Bu qurilmani tozalash','Очистить устройство')}</button></div>
<div class="confirm mt1" id="rs-box" role="alert">{T('m.r.q','This deletes your profile, settings, saved words and Vaqt garden from this browser. It can’t be undone.','Bu brauzerdan profilingiz, sozlamalar, saqlangan so‘zlar va Vaqt bog‘ingizni o‘chiradi. Qaytarib bo‘lmaydi.','Это удалит профиль, настройки, сохранённые слова и сад Vaqt из этого браузера. Отменить нельзя.','span')}<button class="btn primary sm" id="rs-yes" style="--c:var(--rose)">{T('m.r.y','Delete everything','Hammasini o‘chirish','Удалить всё')}</button><button class="btn ghost sm" id="rs-no">{T('m.r.n','Keep it','Qoldirish','Оставить')}</button></div>
<p class="small faint mt1" id="bk-msg" role="status"></p></div>
</div></div></section>'''

def build_me():
    return page('me', '', 'pt.me', 'c-ID', 'c-ID', 'c-ID', 'c-ID: one sign-in for the whole Clive orbit, through Telegram. Your galaxy ID card with your number, picture and progress.', me_body(), ME_CSS, ['assets/js/me.js','assets/js/cid.js'])
