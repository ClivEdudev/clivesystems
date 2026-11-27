from lib import *
from p_more import vaqt_icon

R = '../'
VIEWS = [('focus','timer',('Focus','Fokus','Фокус')),('garden','leaf',('Garden','Bog‘','Сад')),('bazaar','store',('Bazaar','Bozor','Базар')),
         ('awards','trophy',('Awards','Yutuqlar','Награды')),('stats','chart',('Stats','Statistika','Статистика')),('tasks','list',('Tasks','Vazifalar','Задачи')),
         ('log','clock',('Log','Jurnal','Журнал')),('sounds','headphones',('Sounds','Ovozlar','Звуки')),('prefs','sliders',('Settings','Sozlamalar','Настройки'))]

S = [
 # focus
 ('v.ready','Ready to plant a {plant}','{plant} ekishga tayyor','Готово посадить: {plant}'),
 ('v.growing','Growing your {plant}. Stay on this tab.','{plant} o‘smoqda. Shu varaqda qoling.','{plant} растёт. Оставайтесь на этой вкладке.'),
 ('v.growing.g','Growing your {plant}.','{plant} o‘smoqda.','{plant} растёт.'),
 ('v.paused','Paused','Pauza','Пауза'),
 ('v.break','Break time. Follow the circle and breathe.','Tanaffus. Doira bilan birga nafas oling.','Перерыв. Дышите вместе с кругом.'),
 ('v.longbreak','Long break. You earned it.','Uzun tanaffus. Bunga loyiqsiz.','Длинный перерыв. Вы его заслужили.'),
 ('v.flow','Flow: counting up. Finish when you’re done.','Flow: oldinga sanaydi. Tugatganingizda to‘xtating.','Flow: счёт вверх. Завершите, когда закончите.'),
 ('v.start','Plant & start','Ekish va boshlash','Посадить и начать'),
 ('v.startbreak','Start break','Tanaffusni boshlash','Начать перерыв'),
 ('v.skip','Skip break','Tanaffusni o‘tkazib yuborish','Пропустить перерыв'),
 ('v.pause','Pause','Pauza','Пауза'),('v.resume','Resume','Davom etish','Продолжить'),
 ('v.giveup','Hold to give up','Voz kechish uchun bosib turing','Удерживайте, чтобы сдаться'),
 ('v.stop','Finish','Tugatish','Завершить'),
 ('v.plus5','+5 min','+5 daq','+5 мин'),
 ('v.cancel','Cancel','Bekor qilish','Отмена'),
 ('v.cancel.ok','Cancelled in the first seconds. No plant lost.','Dastlabki soniyalarda bekor qilindi. O‘simlik yo‘qolmadi.','Отменено в первые секунды. Растение не потеряно.'),
 ('v.tooshort','Under {n} minutes is too short to plant. Nothing was saved.','{n} daqiqadan kam vaqt ekish uchun juda qisqa. Hech narsa saqlanmadi.','Меньше {n} минут — слишком мало для посадки. Ничего не сохранено.'),
 ('v.done.t','You grew a {plant}!','Siz {plant} o‘stirdingiz!','Вы вырастили: {plant}!'),
 ('v.done.gold','A golden {plant}!','Oltin {plant}!','Золотой {plant}!'),
 ('v.done.p','{min} minutes of focus, now part of your garden.','{min} daqiqalik fokus endi bog‘ingizning bir qismi.','{min} минут фокуса теперь в вашем саду.'),
 ('v.done.goldp','A rare golden plant. About 1 in 25 sessions grows one.','Nodir oltin o‘simlik. Taxminan har 25 sessiyadan birida chiqadi.','Редкое золотое растение. Вырастает примерно в 1 из 25 сессий.'),
 ('v.coins','+{n} coins','+{n} tanga','+{n} монет'),
 ('v.xp','+{n} XP','+{n} XP','+{n} XP'),
 ('v.rate','How was your focus?','Fokusingiz qanday bo‘ldi?','Как прошёл фокус?'),
 ('v.rate.note','A note for future you (optional)','Kelajakdagi o‘zingizga eslatma (ixtiyoriy)','Заметка для себя (необязательно)'),
 ('v.rate.r1','Scattered','Tarqoq','Рассеянно'),('v.rate.r2','Shaky','Beqaror','Неровно'),('v.rate.r3','Okay','Yaxshi','Нормально'),('v.rate.r4','Focused','Diqqatli','Сосредоточенно'),('v.rate.r5','In the zone','Butunlay berilib','В потоке'),
 ('v.taskdone','Mark “{task}” done','“{task}” ni bajarildi deb belgilash','Отметить «{task}» выполненной'),
 ('v.again','Plant another','Yana ekish','Посадить ещё'),
 ('v.close','Close','Yopish','Закрыть'),
 ('v.wither.t','Your {plant} wilted','{plant} so‘lib qoldi','{plant} завял'),
 ('v.wither.p','You left the tab for longer than {n} seconds during deep focus. It stays in your garden as a reminder.','Chuqur fokus paytida varaqni {n} soniyadan ko‘proq tark etdingiz. U eslatma sifatida bog‘ingizda qoladi.','Во время глубокого фокуса вы ушли с вкладки больше чем на {n} секунд. Он останется в саду как напоминание.'),
 ('v.wither.g','You gave up this session. It stays in your garden as a reminder.','Siz bu sessiyadan voz kechdingiz. U eslatma sifatida bog‘ingizda qoladi.','Вы прервали сессию. Она останется в саду как напоминание.'),
 ('v.tryagain','Try again','Qayta urinish','Попробовать снова'),
 ('v.back','Welcome back! You were away {s}s. Deep focus allows {n}s.','Xush kelibsiz! {s} soniya yo‘q edingiz. Chuqur fokus {n} soniyaga ruxsat beradi.','С возвращением! Вас не было {s} с. Глубокий фокус допускает {n} с.'),
 ('v.interrupt','Interruptions: {n}','Chalg‘ishlar: {n}','Отвлечения: {n}'),
 ('v.minfor','{plant} needs at least {n} minutes.','{plant} uchun kamida {n} daqiqa kerak.','Для {plant} нужно минимум {n} минут.'),
 ('v.notask','No task','Vazifasiz','Без задачи'),
 ('v.notag','No tag','Tegsiz','Без тега'),
 ('v.today','Today','Bugun','Сегодня'),
 ('v.goal','{a} of {b} min','{b} daqiqadan {a}','{a} из {b} мин'),
 ('v.goalmet','Daily goal reached','Kunlik maqsadga erishildi','Дневная цель достигнута'),
 ('v.round','Round {a} of {b}','{b} tadan {a}-raund','Раунд {a} из {b}'),
 ('v.min','min','daq','мин'),
 ('v.plants','plants','o‘simlik','растений'),('v.sessions','sessions','sessiya','сессий'),('v.streak','day streak','kunlik seriya','дней подряд'),
 ('v.moreseeds','More seeds in the Bazaar','Ko‘proq urug‘lar Bozorda','Больше семян на Базаре'),
 ('v.preset','Quick start','Tez boshlash','Быстрый старт'),
 ('v.recmin','{n}+ min','{n}+ daq','{n}+ мин'),
 ('v.hold','Keep holding…','Bosib turing…','Держите…'),
 ('v.intent','What will you focus on?','Nimaga e’tibor qaratasiz?','На чём сосредоточитесь?'),
 ('v.saved','Saved','Saqlandi','Сохранено'),
 ('v.undo','Undo','Qaytarish','Отменить'),
 ('v.deleted','Deleted','O‘chirildi','Удалено'),
 # breathing + break tips
 ('v.br.in','Breathe in','Nafas oling','Вдох'),('v.br.hold','Hold','Ushlab turing','Задержка'),('v.br.out','Breathe out','Nafas chiqaring','Выдох'),
 ('v.tip.0','Stand up and stretch your back.','O‘rningizdan turib, belingizni cho‘zing.','Встаньте и потяните спину.'),
 ('v.tip.1','Drink a glass of water.','Bir stakan suv iching.','Выпейте стакан воды.'),
 ('v.tip.2','Look at something 6 metres away for 20 seconds.','20 soniya davomida 6 metr uzoqdagi narsaga qarang.','20 секунд смотрите на что-то в 6 метрах.'),
 ('v.tip.3','Roll your shoulders and relax your jaw.','Yelkalaringizni aylantiring, jag‘ingizni bo‘shashtiring.','Покрутите плечами и расслабьте челюсть.'),
 ('v.tip.4','Walk to a window and get some light.','Deraza oldiga borib, yorug‘lik oling.','Подойдите к окну, побудьте на свету.'),
 ('v.tip.5','Stay off the phone. Let your eyes rest.','Telefonga qaramang. Ko‘zlaringizga dam bering.','Без телефона. Дайте глазам отдохнуть.'),
 # level
 ('v.lv','Level {n}','{n}-daraja','Уровень {n}'),
 ('v.lv.next','{a} / {b} XP to level {n}','{n}-darajagacha {a} / {b} XP','{a} / {b} XP до уровня {n}'),
 ('v.lv.up','Level up!','Yangi daraja!','Новый уровень!'),
 ('v.lv.upp','You are now a {title}. Here are {n} coins for the road.','Endi siz — {title}. Yo‘l uchun {n} tanga.','Теперь вы — {title}. Держите {n} монет в дорогу.'),
 ('v.title.0','Seed','Urug‘','Семя'),('v.title.1','Sprout','Nihol','Росток'),('v.title.2','Sapling','Ko‘chat','Саженец'),('v.title.3','Gardener','Bog‘bon','Садовник'),('v.title.4','Master gardener','Usta bog‘bon','Мастер-садовник'),('v.title.5','Elder chinor','Keksa chinor','Старая чинара'),
 # quests
 ('v.q.h','Daily quests','Kunlik topshiriqlar','Задания дня'),
 ('v.q.reset','New quests at midnight.','Yangi topshiriqlar yarim tunda.','Новые задания в полночь.'),
 ('v.q.claim','Claim','Olish','Забрать'),('v.q.done','Claimed','Olindi','Получено'),
 ('v.q.claimed','Quest complete: +{n} coins','Topshiriq bajarildi: +{n} tanga','Задание выполнено: +{n} монет'),
 ('v.q.min','Focus {n} minutes today','Bugun {n} daqiqa fokus qiling','Сфокусируйтесь {n} минут сегодня'),
 ('v.q.plants','Grow {n} plants today','Bugun {n} ta o‘simlik o‘stiring','Вырастите сегодня {n} растения'),
 ('v.q.pomo','Finish a Pomodoro','Bitta Pomodoro’ni tugating','Завершите один помодоро'),
 ('v.q.long','One session of {n}+ minutes','{n}+ daqiqalik bitta sessiya','Одна сессия от {n} минут'),
 ('v.q.tags','Focus on {n} different tags','{n} xil tegda fokus qiling','Фокус в {n} разных тегах'),
 ('v.q.task','Complete a task','Bitta vazifani bajaring','Выполните задачу'),
 ('v.q.early','Start a session before 10:00','10:00 dan oldin sessiya boshlang','Начните сессию до 10:00'),
 ('v.q.rate','Rate a session','Sessiyaga baho bering','Оцените сессию'),
 ('v.q.nowilt','{n} sessions, no wilting','{n} ta sessiya, so‘lishsiz','{n} сессии без увядания'),
 # garden
 ('v.period.day','Day','Kun','День'),('v.period.week','Week','Hafta','Неделя'),('v.period.month','Month','Oy','Месяц'),('v.period.year','Year','Yil','Год'),('v.period.all','All time','Butun vaqt','Всё время'),
 ('v.thisweek','This week','Shu hafta','Эта неделя'),
 ('v.g.sum','{min} focused · {plants} plants · {dead} wilted','{min} fokus · {plants} o‘simlik · {dead} so‘lgan','{min} фокуса · {plants} растений · {dead} увядших'),
 ('v.g.empty','Nothing planted here yet.','Bu yerda hali hech narsa ekilmagan.','Здесь пока ничего не посажено.'),
 ('v.g.more','+{n} more plants not shown','yana {n} ta o‘simlik ko‘rsatilmagan','ещё {n} растений не показано'),
 ('v.g.theme','Scenery','Manzara','Пейзаж'),('v.g.decor','Decorations','Bezaklar','Украшения'),
 ('v.g.nodecor','Buy decorations in the Bazaar and they appear here.','Bozordan bezak sotib oling, ular shu yerda paydo bo‘ladi.','Купите украшения на Базаре — они появятся здесь.'),
 ('v.sample','Load a sample fortnight','Namuna ikki haftani yuklash','Загрузить пример двух недель'),
 ('v.sample.rm','Remove sample data','Namuna ma’lumotlarni o‘chirish','Удалить пример'),
 ('v.sample.note','Sample data is marked and can be removed any time.','Namuna ma’lumotlar belgilangan, istalgan vaqtda o‘chirish mumkin.','Пример помечен, его можно удалить в любой момент.'),
 ('v.share','Save garden image','Bog‘ rasmini saqlash','Сохранить картинку сада'),
 # bazaar
 ('v.bz.h','Bazaar','Bozor','Базар'),
 ('v.bz.p','Spend the coins you earn by focusing: one coin for every focused minute, more from quests and awards.','Fokus orqali topgan tangalaringizni sarflang: har bir fokusli daqiqa uchun bitta tanga, topshiriq va yutuqlardan ko‘proq.','Тратьте монеты, заработанные фокусом: одна за каждую минуту, больше — за задания и награды.'),
 ('v.bz.seeds','Seeds','Urug‘lar','Семена'),('v.bz.decor','Decor','Bezaklar','Декор'),('v.bz.themes','Scenery','Manzaralar','Пейзажи'),
 ('v.bz.buy','Buy · {n}','Sotib olish · {n}','Купить · {n}'),
 ('v.bz.owned','Owned','Sizda bor','Есть'),
 ('v.bz.plant','Plant this','Shuni ekish','Посадить'),
 ('v.bz.use','Use','Tanlash','Выбрать'),('v.bz.inuse','In use','Tanlangan','Выбрано'),
 ('v.bz.show','In garden','Bog‘da','В саду'),('v.bz.hide','Hidden','Yashirin','Скрыто'),
 ('v.bz.need','{n} more coins','yana {n} tanga','ещё {n} монет'),
 ('v.bz.sure','Tap again to buy','Sotib olish uchun yana bosing','Нажмите ещё раз'),
 ('v.bz.bought','{item} is yours!','{item} endi sizniki!','{item} теперь ваш!'),
 ('v.bz.freeze','Streak freeze','Seriya himoyasi','Заморозка серии'),
 ('v.bz.freeze.p','Protects your streak for one missed day. You can hold two.','Bir kun o‘tkazib yuborilsa seriyangizni saqlaydi. Ikkitagacha saqlash mumkin.','Сохраняет серию за один пропущенный день. Можно держать две.'),
 ('v.bz.freeze.have','You hold {n} of 2','Sizda 2 tadan {n} ta','У вас {n} из 2'),
 ('v.bz.freeze.full','You already hold two.','Sizda allaqachon ikkita bor.','У вас уже есть две.'),
 ('v.bz.freeze.used','A streak freeze saved your {n}-day streak.','Seriya himoyasi {n} kunlik seriyangizni saqlab qoldi.','Заморозка сохранила вашу серию в {n} дн.'),
 ('v.bz.mins','Grows in {n}+ min','{n}+ daqiqada o‘sadi','Растёт от {n} мин'),
 # stats
 ('v.k.today','Today','Bugun','Сегодня'),('v.k.week','This week','Shu hafta','Эта неделя'),('v.k.total','All time','Jami','Всего'),('v.k.streak','Streak','Seriya','Серия'),
 ('v.k.best','Best streak','Eng uzun seriya','Лучшая серия'),('v.k.rate','Survival rate','Saqlanish','Выживаемость'),('v.k.avg','Average session','O‘rtacha sessiya','Средняя сессия'),('v.k.plants','Plants grown','O‘stirilgan o‘simliklar','Выращено растений'),
 ('v.k.golden','Golden plants','Oltin o‘simliklar','Золотые растения'),('v.k.mood','Average focus','O‘rtacha fokus','Средний фокус'),('v.k.level','Level','Daraja','Уровень'),('v.k.coins','Coins earned','Topilgan tangalar','Заработано монет'),
 ('v.days','{n} days','{n} kun','{n} дн.'),
 ('v.s.week','This week by tag','Teglar bo‘yicha shu hafta','Неделя по тегам'),
 ('v.s.tags','Where the time goes','Vaqt qayerga ketadi','Куда уходит время'),
 ('v.s.cal','Month','Oy','Месяц'),
 ('v.s.heat','Last 26 weeks','So‘nggi 26 hafta','Последние 26 недель'),
 ('v.s.hours','Your focus hours','Fokus soatlaringiz','Ваши часы фокуса'),
 ('v.s.ins','Insights','Xulosalar','Выводы'),
 ('v.s.coll','Seed collection','Urug‘ to‘plami','Коллекция семян'),
 ('v.s.none','Finish a few sessions and your stats appear here.','Bir nechta sessiyani tugating, statistikangiz shu yerda paydo bo‘ladi.','Завершите несколько сессий — и здесь появится статистика.'),
 ('v.i.hour','You focus best around {h}.','Siz eng yaxshi {h} atrofida diqqat qilasiz.','Лучше всего вы сосредоточены около {h}.'),
 ('v.i.tag','Most of your time goes to {tag} ({p}%).','Vaqtingizning ko‘p qismi {tag} ga ketadi ({p}%).','Больше всего времени уходит на {tag} ({p}%).'),
 ('v.i.long','Your longest session: {min}.','Eng uzun sessiyangiz: {min}.','Самая долгая сессия: {min}.'),
 ('v.i.day','Your strongest day is {d}.','Eng kuchli kuningiz — {d}.','Ваш самый сильный день — {d}.'),
 ('v.i.rate','{p}% of your plants survived. Gentle mode is there if strict feels too hard.','O‘simliklaringizning {p}% i saqlanib qoldi. Qat’iy rejim og‘ir bo‘lsa, yumshoq rejim bor.','{p}% растений выжили. Если строгий режим слишком жёсткий, есть мягкий.'),
 ('v.i.mood','Sessions you rated highest were around {min} long.','Eng yuqori baholagan sessiyalaringiz taxminan {min} davom etgan.','Сессии с лучшей оценкой длились около {min}.'),
 ('v.r.week','Week','Hafta','Неделя'),('v.r.month','Month','Oy','Месяц'),('v.r.all','All','Hammasi','Всё'),
 # awards
 ('v.a.h','Awards','Yutuqlar','Награды'),
 ('v.a.sum','{a} of {b} unlocked','{b} tadan {a} tasi ochilgan','Открыто {a} из {b}'),
 ('v.a.pts','{n} reward coins earned','{n} mukofot tangasi topildi','Получено {n} наградных монет'),
 ('v.a.all','All','Hammasi','Все'),('v.a.got','Unlocked','Ochilgan','Открытые'),('v.a.prog','In progress','Jarayonda','В процессе'),('v.a.lock','Locked','Yopiq','Закрытые'),
 ('v.a.cat.growth','Growth','O‘sish','Рост'),('v.a.cat.time','Time','Vaqt','Время'),('v.a.cat.streak','Streaks','Seriyalar','Серии'),('v.a.cat.depth','Depth','Chuqurlik','Глубина'),
 ('v.a.cat.habit','Habits','Odatlar','Привычки'),('v.a.cat.coll','Collection','To‘plam','Коллекция'),('v.a.cat.org','Organiser','Tartib','Порядок'),('v.a.cat.bazaar','Bazaar','Bozor','Базар'),('v.a.cat.goal','Goals','Maqsadlar','Цели'),
 ('v.a.on','Unlocked {d}','{d} da ochilgan','Открыто {d}'),
 ('v.a.reward','+{n} coins','+{n} tanga','+{n} монет'),
 ('v.newaward','Award unlocked: {a}','Yutuq ochildi: {a}','Награда получена: {a}'),
 ('v.tier.bronze','Bronze','Bronza','Бронза'),('v.tier.silver','Silver','Kumush','Серебро'),('v.tier.gold','Gold','Oltin','Золото'),('v.tier.platinum','Platinum','Platina','Платина'),('v.tier.diamond','Diamond','Olmos','Алмаз'),
 # tasks + log
 ('v.t.ph','What needs doing?','Nima qilish kerak?','Что нужно сделать?'),('v.t.add','Add task','Vazifa qo‘shish','Добавить задачу'),('v.t.est','Sessions','Sessiyalar','Сессии'),
 ('v.t.open','To do','Qilinadigan','К выполнению'),('v.t.done','Done','Bajarilgan','Готово'),
 ('v.t.empty','No tasks here. Add one above, then focus on it.','Bu yerda vazifa yo‘q. Yuqoridan qo‘shing va unga e’tibor qarating.','Задач нет. Добавьте выше и сосредоточьтесь на ней.'),
 ('v.t.focus','Focus on this','Bunga e’tibor qaratish','Сосредоточиться'),('v.t.spent','{t} spent','{t} sarflandi','потрачено {t}'),
 ('v.t.del','Delete','O‘chirish','Удалить'),('v.t.edit','Edit','Tahrirlash','Изменить'),('v.t.save','Save','Saqlash','Сохранить'),
 ('v.l.add','Add time by hand','Vaqtni qo‘lda qo‘shish','Добавить время вручную'),
 ('v.l.date','Date','Sana','Дата'),('v.l.from','From','Dan','С'),('v.l.to','To','Gacha','До'),('v.l.note','Note','Izoh','Заметка'),('v.l.notep','What did you do?','Nima qildingiz?','Что вы делали?'),
 ('v.l.bad','The end time has to be after the start time.','Tugash vaqti boshlanishdan keyin bo‘lishi kerak.','Время окончания должно быть позже начала.'),
 ('v.l.added','Time added to your log.','Vaqt jurnalingizga qo‘shildi.','Время добавлено в журнал.'),
 ('v.l.empty','No sessions on this day.','Bu kunda sessiyalar yo‘q.','В этот день сессий нет.'),
 ('v.l.manual','Logged by hand','Qo‘lda yozilgan','Добавлено вручную'),('v.l.withered','Wilted','So‘lgan','Увял'),
 ('v.l.csv','Export CSV','CSV eksport','Экспорт CSV'),('v.l.json','Export backup','Zaxira eksport','Экспорт копии'),('v.l.import','Import backup','Zaxirani import qilish','Импорт копии'),
 ('v.l.imported','Imported {n} sessions.','{n} ta sessiya import qilindi.','Импортировано сессий: {n}.'),
 ('v.l.badfile','That file isn’t a Vaqt or Clive backup.','Bu fayl Vaqt yoki Clive zaxirasi emas.','Это не копия Vaqt или Clive.'),
 ('v.l.dur','Minutes','Daqiqalar','Минуты'),
 # sounds
 ('v.snd.rain','Rain drops','Yomg‘ir tomchilari','Капли дождя'),('v.snd.thunder','Thunderstorm','Momaqaldiroq','Гроза'),('v.snd.river','Mountain stream','Tog‘ soyi','Горный ручей'),
 ('v.snd.ocean','Ocean waves','Dengiz to‘lqinlari','Морские волны'),('v.snd.fire','Campfire','Gulxan','Костёр'),('v.snd.wind','Wind in the trees','Daraxtlardagi shamol','Ветер в деревьях'),
 ('v.snd.birds','Birdsong','Qushlar sayrashi','Пение птиц'),('v.snd.night','Night crickets','Tungi chirildoqlar','Ночные сверчки'),('v.snd.chimes','Wind chimes','Shamol qo‘ng‘iroqchalari','Музыка ветра'),
 ('v.snd.clock','Ticking clock','Soat chiqillashi','Тиканье часов'),('v.snd.all','All sounds','Barcha ovozlar','Все звуки'),
 ('v.snd.err','Could not load that sound. Check your connection and try again.','Ovozni yuklab bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.','Не удалось загрузить звук. Проверьте соединение и попробуйте снова.'),
 ('v.snd.master','Master volume','Umumiy ovoz','Общая громкость'),('v.snd.only','Play only while a session runs','Faqat sessiya ketayotganda chalish','Играть только во время сессии'),
 ('v.snd.stop','Stop all','Hammasini to‘xtatish','Остановить всё'),('v.snd.note','Real recordings of rain, water, fire and nature. Mix as many as you like. Each one loads the first time you play it, then works offline.','Yomg‘ir, suv, olov va tabiatning haqiqiy yozuvlari. Istaganingizcha aralashtiring. Har biri birinchi marta yoqilganda yuklanadi, keyin oflayn ishlaydi.','Настоящие записи дождя, воды, огня и природы. Смешивайте сколько угодно. Каждая загружается при первом включении, а потом работает офлайн.'),
 # prefs
 ('v.p.durs','Durations','Davomiyliklar','Длительность'),('v.p.focus','Focus','Fokus','Фокус'),('v.p.short','Short break','Qisqa tanaffus','Короткий перерыв'),('v.p.long','Long break','Uzun tanaffus','Длинный перерыв'),
 ('v.p.rounds','Rounds before a long break','Uzun tanaffusgacha raundlar','Раундов до длинного перерыва'),
 ('v.p.autobreak','Start breaks automatically','Tanaffuslarni avtomatik boshlash','Начинать перерывы автоматически'),
 ('v.p.autofocus','Start the next focus after a break','Tanaffusdan keyin keyingi fokusni boshlash','Начинать следующий фокус после перерыва'),
 ('v.p.deep','Deep focus','Chuqur fokus','Глубокий фокус'),('v.p.strict','Strict','Qat’iy','Строгий'),('v.p.gentle','Gentle','Yumshoq','Мягкий'),('v.p.off','Off','O‘chiq','Выкл.'),
 ('v.p.deep.s','Leave the tab longer than the grace time and the plant wilts. Pause is hidden.','Varaqni ruxsat etilgan vaqtdan uzoqroq tark etsangiz, o‘simlik so‘liydi. Pauza yashiriladi.','Ушли с вкладки дольше допустимого — растение вянет. Паузы нет.'),
 ('v.p.deep.g','Leaving the tab is counted, never punished. Pause is allowed.','Varaqni tark etish sanaladi, lekin jazolanmaydi. Pauza mumkin.','Уходы считаются, но не наказываются. Пауза разрешена.'),
 ('v.p.deep.o','No checks at all.','Hech qanday tekshiruv yo‘q.','Никаких проверок.'),
 ('v.p.grace','Grace time (seconds)','Ruxsat etilgan vaqt (soniya)','Допустимое время (сек)'),
 ('v.p.goal','Daily goal (minutes)','Kunlik maqsad (daqiqa)','Дневная цель (минуты)'),
 ('v.p.chime','Chime at the end','Oxirida qo‘ng‘iroq','Сигнал в конце'),
 ('v.p.notify','System notification at the end','Oxirida tizim bildirishnomasi','Системное уведомление в конце'),
 ('v.p.notify.no','Notifications are blocked in this browser.','Bu brauzerda bildirishnomalar bloklangan.','Уведомления в этом браузере заблокированы.'),
 ('v.p.wake','Keep the screen awake during a session','Sessiya paytida ekranni yoqiq tutish','Не гасить экран во время сессии'),
 ('v.p.haptics','Vibrate on start and finish (phones)','Boshlash va tugashda tebranish (telefonlar)','Вибрация при старте и финише (телефоны)'),
 ('v.p.confetti','Celebrate finished sessions','Tugagan sessiyalarni nishonlash','Праздновать завершённые сессии'),
 ('v.p.tags','Tags','Teglar','Теги'),('v.p.addtag','Add tag','Teg qo‘shish','Добавить тег'),('v.p.tagname','Tag name','Teg nomi','Название тега'),
 ('v.p.data','Your data','Ma’lumotlaringiz','Ваши данные'),
 ('v.p.data.p','Everything is saved in this browser. Back it up, or move it with your Clive ID sync code.','Hammasi shu brauzerda saqlanadi. Zaxira oling yoki Clive ID sinxron kodi bilan ko‘chiring.','Всё хранится в этом браузере. Сделайте копию или перенесите кодом Clive ID.'),
 ('v.p.clear','Clear Vaqt data','Vaqt ma’lumotlarini tozalash','Очистить данные Vaqt'),
 ('v.p.clear.q','This deletes every session, task, coin and award in Vaqt on this device. It can’t be undone.','Bu qurilmadagi Vaqt’ning barcha sessiya, vazifa, tanga va yutuqlarini o‘chiradi. Qaytarib bo‘lmaydi.','Это удалит все сессии, задачи, монеты и награды Vaqt на этом устройстве. Отменить нельзя.'),
 ('v.p.clear.y','Delete everything','Hammasini o‘chirish','Удалить всё'),('v.p.keep','Keep it','Qoldirish','Оставить'),
 ('v.p.cleared','Vaqt data cleared.','Vaqt ma’lumotlari tozalandi.','Данные Vaqt очищены.'),
 ('v.p.look','Look','Ko‘rinish','Вид'),('v.p.tour','Show the welcome tour again','Tanishuvni qayta ko‘rsatish','Показать знакомство снова'),
 ('v.pip.no','Your browser can’t open a floating window here.','Brauzeringiz bu yerda suzuvchi oyna ocha olmaydi.','Браузер не может открыть здесь плавающее окно.'),
 ('v.more','More','Yana','Ещё'),
 ('v.notif.t','{plant} is fully grown','{plant} to‘liq o‘sdi','{plant} полностью вырос'),
 ('v.notif.b','Break over. Ready for the next session?','Tanaffus tugadi. Keyingi sessiyaga tayyormisiz?','Перерыв окончен. Готовы к следующей сессии?'),
 ('v.tag.0','Study','O‘qish','Учёба'),('v.tag.1','Work','Ish','Работа'),('v.tag.2','Teaching','Dars berish','Уроки'),('v.tag.3','German','Nemis tili','Немецкий'),('v.tag.4','Code','Kod','Код'),('v.tag.5','Reading','Kitob o‘qish','Чтение'),
 # onboarding
 ('v.ob.1t','Plant a seed','Urug‘ eking','Посадите семя'),
 ('v.ob.1p','Pick a plant and how long you want to focus. Lola and paxta are free; 18 more wait in the Bazaar.','O‘simlik va qancha diqqat qilishni tanlang. Lola va paxta bepul; Bozorda yana 18 tasi kutmoqda.','Выберите растение и время фокуса. Лола и пахта бесплатны; ещё 18 ждут на Базаре.'),
 ('v.ob.2t','Stay with it','Diqqatingizni saqlang','Не отвлекайтесь'),
 ('v.ob.2p','Your plant grows while you work. In strict deep focus, leaving this tab for too long makes it wilt.','Siz ishlayotganingizda o‘simlik o‘sadi. Qat’iy chuqur fokusda varaqni uzoq tark etsangiz, u so‘liydi.','Растение растёт, пока вы работаете. В строгом режиме долгий уход с вкладки — и оно вянет.'),
 ('v.ob.3t','Grow your world','Dunyoingizni o‘stiring','Растите свой мир'),
 ('v.ob.3p','Earn coins, level up, finish daily quests, unlock 57 awards and decorate your garden.','Tanga yig‘ing, darajangizni oshiring, kunlik topshiriqlarni bajaring, 57 ta yutuqni oching va bog‘ingizni bezang.','Копите монеты, растите в уровне, выполняйте задания, открывайте 57 наград и украшайте сад.'),
 ('v.ob.next','Next','Keyingi','Далее'),('v.ob.skip','Skip','O‘tkazib yuborish','Пропустить'),('v.ob.go','Plant my first seed','Birinchi urug‘imni ekish','Посадить первое семя'),
 ('v.keys','Keyboard: Space start/pause · 1 2 3 modes · ↑↓ ±5 min · F full screen · M sounds · G B A garden, bazaar, awards','Klaviatura: Space boshlash/pauza · 1 2 3 rejimlar · ↑↓ ±5 daq · F to‘liq ekran · M ovozlar · G B A bog‘, bozor, yutuqlar','Клавиши: Space старт/пауза · 1 2 3 режимы · ↑↓ ±5 мин · F полный экран · M звуки · G B A сад, базар, награды'),
]

# 57 awards: (id, icon, tier, category, en, uz, ru, desc_en, desc_uz, desc_ru)
AW = [
 ('g1','sprout','bronze','growth','First sprout','Birinchi nihol','Первый росток','Grow your first plant','Birinchi o‘simligingizni o‘stiring','Вырастите первое растение'),
 ('g10','leaf','bronze','growth','Little orchard','Kichik bog‘','Маленький сад','Grow 10 plants','10 ta o‘simlik o‘stiring','Вырастите 10 растений'),
 ('g50','leaf','silver','growth','Real garden','Haqiqiy bog‘','Настоящий сад','Grow 50 plants','50 ta o‘simlik o‘stiring','Вырастите 50 растений'),
 ('g100','leaf','gold','growth','Hundred plants','Yuz o‘simlik','Сто растений','Grow 100 plants','100 ta o‘simlik o‘stiring','Вырастите 100 растений'),
 ('g250','leaf','platinum','growth','Forest of focus','Fokus o‘rmoni','Лес фокуса','Grow 250 plants','250 ta o‘simlik o‘stiring','Вырастите 250 растений'),
 ('g500','leaf','diamond','growth','Botanical garden','Botanika bog‘i','Ботанический сад','Grow 500 plants','500 ta o‘simlik o‘stiring','Вырастите 500 растений'),
 ('t60','clock','bronze','time','First hour','Birinchi soat','Первый час','60 minutes of focus in total','Jami 60 daqiqa fokus','60 минут фокуса всего'),
 ('t600','clock','bronze','time','Ten hours','O‘n soat','Десять часов','10 hours of focus','10 soat fokus','10 часов фокуса'),
 ('t3000','hourglass','silver','time','Fifty hours','Ellik soat','Пятьдесят часов','50 hours of focus','50 soat fokus','50 часов фокуса'),
 ('t6000','hourglass','gold','time','Hundred hours','Yuz soat','Сто часов','100 hours of focus','100 soat fokus','100 часов фокуса'),
 ('t15000','hourglass','platinum','time','Quarter thousand','Ikki yuz ellik soat','Двести пятьдесят часов','250 hours of focus','250 soat fokus','250 часов фокуса'),
 ('t60000','trophy','diamond','time','A thousand hours','Ming soat','Тысяча часов','1,000 hours of focus','1000 soat fokus','1000 часов фокуса'),
 ('s3','flame','bronze','streak','Three in a row','Ketma-ket uch','Три подряд','A 3-day streak','3 kunlik seriya','Серия 3 дня'),
 ('s7','flame','silver','streak','Full week','To‘liq hafta','Целая неделя','A 7-day streak','7 kunlik seriya','Серия 7 дней'),
 ('s14','flame','silver','streak','Fortnight','Ikki hafta','Две недели','A 14-day streak','14 kunlik seriya','Серия 14 дней'),
 ('s30','flame','gold','streak','Month of focus','Fokus oyi','Месяц фокуса','A 30-day streak','30 kunlik seriya','Серия 30 дней'),
 ('s60','flame','platinum','streak','Two moons','Ikki oy','Два месяца','A 60-day streak','60 kunlik seriya','Серия 60 дней'),
 ('s100','flame','diamond','streak','Hundred days','Yuz kun','Сто дней','A 100-day streak','100 kunlik seriya','Серия 100 дней'),
 ('l60','target','bronze','depth','Full hour','To‘liq soat','Полный час','One session of 60+ minutes','60+ daqiqalik bitta sessiya','Одна сессия от 60 минут'),
 ('l90','target','silver','depth','Deep dive','Chuqur sho‘ng‘ish','Глубокое погружение','One session of 90+ minutes','90+ daqiqalik bitta sessiya','Одна сессия от 90 минут'),
 ('l120','target','gold','depth','Marathon','Marafon','Марафон','One session of 2+ hours','2+ soatlik bitta sessiya','Одна сессия от 2 часов'),
 ('l180','target','platinum','depth','Ultramarathon','Ultramarafon','Ультрамарафон','One session of 3 hours','3 soatlik bitta sessiya','Одна сессия на 3 часа'),
 ('d120','sun','bronze','depth','Two-hour day','Ikki soatlik kun','Двухчасовой день','2 hours of focus in one day','Bir kunda 2 soat fokus','2 часа фокуса за день'),
 ('d240','sun','silver','depth','Four-hour day','To‘rt soatlik kun','Четырёхчасовой день','4 hours of focus in one day','Bir kunda 4 soat fokus','4 часа фокуса за день'),
 ('d360','sun','gold','depth','Six-hour day','Olti soatlik kun','Шестичасовой день','6 hours of focus in one day','Bir kunda 6 soat fokus','6 часов фокуса за день'),
 ('p4','repeat','silver','habit','Full cycle','To‘liq sikl','Полный цикл','4 Pomodoros in one day','Bir kunda 4 ta Pomodoro','4 помидора за день'),
 ('p8','repeat','gold','habit','Double cycle','Ikki karra sikl','Двойной цикл','8 Pomodoros in one day','Bir kunda 8 ta Pomodoro','8 помидоров за день'),
 ('early','sun','bronze','habit','Early bird','Erta qush','Жаворонок','Start a session before 7:00','7:00 dan oldin sessiya boshlang','Начните сессию до 7:00'),
 ('owl','moon','bronze','habit','Night owl','Tungi boyo‘g‘li','Сова','Start a session after 23:00','23:00 dan keyin sessiya boshlang','Начните сессию после 23:00'),
 ('weekend','calendar','silver','habit','Weekend warrior','Dam olish qahramoni','Воин выходных','Focus on both Saturday and Sunday of one weekend','Bitta dam olishning shanba va yakshanbasida fokus qiling','Фокус и в субботу, и в воскресенье одних выходных'),
 ('modes','timer','bronze','habit','Three ways','Uch usul','Три способа','Finish a Timer, a Pomodoro and a Flow session','Taymer, Pomodoro va Flow sessiyalarini tugating','Завершите сессии Таймер, Pomodoro и Flow'),
 ('iron','shield','gold','habit','Iron will','Temir iroda','Железная воля','10 strict sessions in a row without wilting','Ketma-ket 10 ta qat’iy sessiya, so‘lishsiz','10 строгих сессий подряд без увядания'),
 ('c5','grid','bronze','coll','Five kinds','Besh tur','Пять видов','Grow 5 different plants','5 xil o‘simlik o‘stiring','Вырастите 5 разных растений'),
 ('c10','grid','silver','coll','Ten kinds','O‘n tur','Десять видов','Grow 10 different plants','10 xil o‘simlik o‘stiring','Вырастите 10 разных растений'),
 ('c20','grid','gold','coll','Twenty kinds','Yigirma tur','Двадцать видов','Grow 20 different plants','20 xil o‘simlik o‘stiring','Вырастите 20 разных растений'),
 ('call','grid','diamond','coll','Complete collection','To‘liq to‘plam','Полная коллекция','Grow all 34 plants','34 ta o‘simlikning hammasini o‘stiring','Вырастите все 34 растения'),
 ('gold1','sparkle','gold','coll','Golden touch','Oltin teginish','Золотое касание','Grow a golden plant','Oltin o‘simlik o‘stiring','Вырастите золотое растение'),
 ('gold5','sparkle','platinum','coll','Gold rush','Oltin isitmasi','Золотая лихорадка','Grow 5 golden plants','5 ta oltin o‘simlik o‘stiring','Вырастите 5 золотых растений'),
 ('leg','star','platinum','coll','Legend','Afsona','Легенда','Grow a legendary plant','Afsonaviy o‘simlik o‘stiring','Вырастите легендарное растение'),
 ('tk10','check','bronze','org','Getting things done','Ishlarni bitiruvchi','Делаю дела','Complete 10 tasks','10 ta vazifani bajaring','Выполните 10 задач'),
 ('tk50','check','silver','org','Finisher','Oxiriga yetkazuvchi','Доводящий до конца','Complete 50 tasks','50 ta vazifani bajaring','Выполните 50 задач'),
 ('tags5','tag','bronze','org','Many sides','Ko‘p qirrali','Многогранность','Focus in 5 different tags','5 xil tegda diqqat qiling','Фокус в 5 разных тегах'),
 ('manual','pen','bronze','org','Off-screen time','Ekrandan tashqari vaqt','Время вне экрана','Log time by hand','Vaqtni qo‘lda yozing','Добавьте время вручную'),
 ('refl10','heart','silver','org','Reflective','O‘ylovchi','Вдумчивый','Rate 10 sessions','10 ta sessiyaga baho bering','Оцените 10 сессий'),
 ('dec1','store','bronze','bazaar','First decoration','Birinchi bezak','Первое украшение','Buy a decoration','Bezak sotib oling','Купите украшение'),
 ('dec6','store','silver','bazaar','Decorator','Bezakchi','Декоратор','Own 6 decorations','6 ta bezakka ega bo‘ling','Соберите 6 украшений'),
 ('dec12','store','gold','bazaar','Bazaar regular','Bozor doimiysi','Завсегдатай базара','Own 12 decorations','12 ta bezakka ega bo‘ling','Соберите 12 украшений'),
 ('decall','store','platinum','bazaar','The whole bazaar','Butun bozor','Весь базар','Own all 16 decorations','16 ta bezakning hammasiga ega bo‘ling','Соберите все 16 украшений'),
 ('theme1','image','silver','bazaar','New scenery','Yangi manzara','Новый пейзаж','Unlock a new scenery','Yangi manzarani oching','Откройте новый пейзаж'),
 ('seeds10','sprout','gold','bazaar','Seed merchant','Urug‘ savdogari','Торговец семенами','Own 10 kinds of seed','10 xil urug‘ga ega bo‘ling','Соберите 10 видов семян'),
 ('goal1','target','bronze','goal','Goal keeper','Maqsadga sodiq','Держу цель','Reach your daily goal','Kunlik maqsadingizga erishing','Достигните дневной цели'),
 ('goal7','target','silver','goal','Seven good days','Yetti yaxshi kun','Семь хороших дней','Reach your daily goal on 7 days','7 kun kunlik maqsadga erishing','Достигайте дневной цели 7 дней'),
 ('goal30','target','gold','goal','Thirty good days','O‘ttiz yaxshi kun','Тридцать хороших дней','Reach your daily goal on 30 days','30 kun kunlik maqsadga erishing','Достигайте дневной цели 30 дней'),
 ('q10','check','silver','goal','Quest seeker','Topshiriq izlovchi','Искатель заданий','Complete 10 daily quests','10 ta kunlik topshiriqni bajaring','Выполните 10 заданий дня'),
 ('q50','check','gold','goal','Quest master','Topshiriq ustasi','Мастер заданий','Complete 50 daily quests','50 ta kunlik topshiriqni bajaring','Выполните 50 заданий дня'),
 ('lv10','trophy','gold','goal','Level 10','10-daraja','Уровень 10','Reach level 10','10-darajaga yeting','Достигните уровня 10'),
 ('lv25','trophy','platinum','goal','Level 25','25-daraja','Уровень 25','Reach level 25','25-darajaga yeting','Достигните уровня 25'),
]

def vt(k, tag='span', cls='', attrs=''):
    hit = [x for x in S if x[0]==k]
    en = hit[0][1] if hit else STR[k]['en']
    c = f' class="{cls}"' if cls else ''
    a = f' {attrs}' if attrs else ''
    return f'<{tag}{c}{a} data-i18n="{k}">{esc(en)}</{tag}>'

ASSET_V = '4'  # bump with sw.js CACHE when Vaqt assets change

def html():
    for k,en,uz,ru in S: J(k,en,uz,ru)
    for v,i,(en,uz,ru) in VIEWS: J('v.view.'+v,en,uz,ru)
    for a in AW:
        J('v.a.'+a[0], a[4], a[5], a[6]); J('v.a.'+a[0]+'.d', a[7], a[8], a[9])
    tabs = ''.join(f'<button data-view="{v}" title="{esc(en)}">{ic(i)}<span data-i18n="v.view.{v}">{esc(en)}</span></button>' for v,i,(en,uz,ru) in VIEWS)
    bottom = ''.join(f'<button data-view="{v}">{ic(i)}<span data-i18n="v.view.{v}">{esc(en)}</span></button>' for v,i,(en,uz,ru) in VIEWS[:4]) + f'<button data-open-more>{ic("menu")}<span data-i18n="v.more">More</span></button>'
    more = ''.join(f'<button data-view="{v}" class="btn ghost block">{ic(i)}<span data-i18n="v.view.{v}">{esc(en)}</span></button>' for v,i,(en,uz,ru) in VIEWS[4:])
    body = f'''
<header class="vbar"><div class="vin">
<a class="vbrand" href="{R}products/vaqt.html" aria-label="Vaqt">{vaqt_icon('hv', 38)}<span><b>Vaqt</b><small>by <span>Clive</span></small></span></a>
<nav class="vtabs" aria-label="Views">{tabs}</nav>
<div class="vtools">
<button class="lvchip" id="h-level" data-view="awards" title="Level"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="tr"/><circle cx="18" cy="18" r="15" class="pr" id="h-lvarc"/></svg><b id="h-lvnum">1</b></button>
<button class="chip coins" id="h-coins" data-view="bazaar" title="Coins">{ic('coin')}<b>0</b></button>
<div class="langsel" role="group" aria-label="Language"><button data-setlang="en">EN</button><button data-setlang="uz">UZ</button><button data-setlang="ru">RU</button></div>
<button class="iconbtn" id="theme-btn" aria-label="Day or night">{ic('moon')}</button>
<a class="iconbtn hideS" href="{R}index.html" aria-label="Clive home" title="Clive">{mark('vbm', 22)}</a>
</div></div></header>

<main id="main" class="vmain">
<section class="view" id="v-focus" aria-label="Focus">
<div class="fgrid">
<aside class="fleft">
<div class="card lvl"><div class="lvbadge"><svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6BEFB4"/><stop offset="1" stop-color="#5B7CFF"/></linearGradient></defs><path d="{star_path(32,32,29)}" fill="url(#lvg)"/><circle cx="32" cy="32" r="17" fill="var(--card)"/></svg><b id="lv-num">1</b></div>
<div class="lvtxt"><b id="lv-title">Seed</b><span class="small muted" id="lv-xp"></span><div class="xpbar"><i id="lv-bar"></i></div></div></div>
<div class="card today"><div class="goal"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" class="tr"/><circle cx="60" cy="60" r="50" class="pr" id="goal-arc"/></svg>
<div><b id="goal-num" class="num">0</b><span class="small muted" id="goal-txt"></span></div></div>
<div class="mini3"><div><b id="ft-plants">0</b>{vt('v.plants','small')}</div><div><b id="ft-sessions">0</b>{vt('v.sessions','small')}</div><div><b id="ft-streak">0</b>{vt('v.streak','small')}</div></div>
<div class="tl" id="f-timeline" aria-label="Today"></div></div>
<div class="card quests"><div class="row between"><h3>{vt('v.q.h')}</h3><span class="chip" id="q-count">0/3</span></div><ul class="qlist" id="quests"></ul><p class="small faint">{vt('v.q.reset')}</p></div>
</aside>
<div class="fcenter">
<div class="seg modes" id="modes" role="group" aria-label="Mode"><button data-mode="timer">{T('v.m.timer','Timer','Taymer','Таймер')}</button><button data-mode="pomo">Pomodoro</button><button data-mode="flow">Flow</button></div>
<div class="presets" id="presets" role="group" aria-label="Quick start"></div>
<div class="pomodots" id="pomodots" aria-hidden="true"></div>
<div class="dialwrap" id="dialwrap">
<div class="dsky" id="sky" aria-hidden="true"><i class="orb"></i><span class="stars"></span></div>
<div class="motes" id="motes" aria-hidden="true"></div>
<svg viewBox="0 0 320 320" id="dial" role="slider" tabindex="0" aria-label="Minutes" aria-valuemin="10" aria-valuemax="180" aria-valuenow="25">
<defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8CF5C4"/><stop offset=".55" stop-color="#3DDC97"/><stop offset="1" stop-color="#1FA6B8"/></linearGradient></defs>
<g id="ticks"></g>
<circle cx="160" cy="160" r="146" class="track"/>
<circle cx="160" cy="160" r="146" class="arc" id="arc"/>
<circle cx="160" cy="14" r="14" class="knob" id="knob"/>
</svg>
<div class="isle" id="island"></div>
<div class="breath" id="breath" hidden><i></i><b id="breath-t"></b></div>
</div>
<div class="time num" id="time">25:00</div>
<p class="status" id="status" aria-live="polite"></p>
<p class="tip small muted" id="tip" hidden></p>
<div class="ctrls" id="ctrls">
<button class="btn primary big" id="start" style="--c:var(--green);--ci:#03170d">{ic('play')}<span>Plant &amp; start</span></button>
<button class="btn ghost" id="pause" hidden>{ic('pause')}<span>Pause</span></button>
<button class="btn ghost hold" id="giveup" hidden><i class="fill"></i>{ic('x')}<span>Hold to give up</span></button>
<button class="btn ghost" id="stopflow" hidden>{ic('check')}<span>Finish</span></button>
<button class="btn ghost" id="plus5" hidden>{ic('plus')}{vt('v.plus5')}</button>
<button class="btn ghost" id="skip" hidden>{ic('chevr')}<span>Skip break</span></button>
</div>
<div class="row tools2"><button class="iconbtn" id="pip" title="Mini timer" aria-label="Mini timer">{ic('pip')}</button><button class="iconbtn" id="fs" title="Full screen" aria-label="Full screen">{ic('max')}</button><button class="iconbtn" id="mute" title="Sounds" aria-label="Sounds on or off">{ic('volume')}</button></div>
</div>
<aside class="card fright">
<div class="fl"><div class="row between"><span>{T('v.h.seed','Seed','Urug‘','Семя')}</span><button class="linkbtn small" data-view="bazaar">{vt('v.moreseeds')}{ic('arrow')}</button></div><div class="seeds" id="seeds"></div><p class="small muted" id="seednote"></p></div>
<div class="fl"><span>{T('v.h.tag','Tag','Teg','Тег')}</span><div class="tagpick" id="tagpick"></div></div>
<label class="fl"><span>{T('v.h.task','Task','Vazifa','Задача')}</span><select class="input select" id="f-task"></select></label>
<label class="fl"><span>{T('v.h.intent','Intention','Niyat','Намерение')}</span><input class="input" id="intent" maxlength="80" placeholder="What will you focus on?" data-i18n-attr="placeholder:v.intent"></label>
<div class="fl"><span>{vt('v.p.deep')}</span><div class="seg" id="deep"><button data-deep="strict">{vt('v.p.strict')}</button><button data-deep="gentle">{vt('v.p.gentle')}</button><button data-deep="off">{vt('v.p.off')}</button></div><p class="small muted" id="deepnote"></p></div>
<div class="fl"><span>{T('v.h.snd','Sounds','Ovozlar','Звуки')}</span><div class="qsnd" id="qsnd"></div></div>
</aside>
</div>
<p class="small faint center keys">{vt('v.keys')}</p>
</section>

<section class="view" id="v-garden" hidden>
<div class="vhead"><h1>{T('v.g.h','Your garden','Bog‘ingiz','Ваш сад')}</h1><div class="tabs" id="g-period" role="group"></div></div>
<div class="row gnav"><button class="iconbtn" id="g-prev" aria-label="Previous">{ic('chevl')}</button><b id="g-label">Today</b><button class="iconbtn" id="g-next" aria-label="Next">{ic('chevr')}</button><span class="muted small" id="g-sum"></span></div>
<div class="card gstage" id="gstage"><div id="g-scene"></div><p class="small faint center" id="g-more"></p></div>
<div class="grid s2 mt2">
<div class="card"><h3>{vt('v.g.theme')}</h3><div class="chips" id="g-themes"></div></div>
<div class="card"><h3>{vt('v.g.decor')}</h3><div class="chips" id="g-decor"></div></div></div>
<div class="row mt2"><button class="btn ghost sm" id="g-share">{ic('image')}{vt('v.share')}</button><button class="btn ghost sm" id="g-sample">{ic('sparkle')}{vt('v.sample')}</button><button class="btn ghost sm" id="g-unsample" hidden>{ic('trash')}{vt('v.sample.rm')}</button></div>
<p class="small faint" id="g-samplenote"></p>
</section>

<section class="view" id="v-bazaar" hidden>
<div class="vhead"><div><h1>{vt('v.bz.h','span')}</h1><p class="muted" style="max-width:62ch;margin-top:6px">{vt('v.bz.p')}</p></div><div class="purse"><span class="small muted">Vaqt</span><b id="bz-coins">0</b>{ic('coin')}</div></div>
<div class="card special" id="bz-special"></div>
<div class="tabs mt2" id="bz-tabs" role="group"><button data-bz="seeds" aria-pressed="true">{vt('v.bz.seeds')}</button><button data-bz="decor" aria-pressed="false">{vt('v.bz.decor')}</button><button data-bz="themes" aria-pressed="false">{vt('v.bz.themes')}</button></div>
<div class="grid bzgrid mt2" id="bz-grid"></div>
</section>

<section class="view" id="v-awards" hidden>
<div class="vhead"><h1>{vt('v.a.h','span')}</h1></div>
<div class="card asum" id="a-sum"></div>
<div class="row mt2 afilters"><div class="tabs" id="a-filter" role="group"><button data-af="all" aria-pressed="true">{vt('v.a.all')}</button><button data-af="got" aria-pressed="false">{vt('v.a.got')}</button><button data-af="prog" aria-pressed="false">{vt('v.a.prog')}</button><button data-af="lock" aria-pressed="false">{vt('v.a.lock')}</button></div><div class="chips" id="a-cats"></div></div>
<div class="grid agrid mt2" id="a-grid"></div>
</section>

<section class="view" id="v-stats" hidden>
<div class="vhead"><h1>{T('v.s.h','Stats','Statistika','Статистика')}</h1></div>
<div class="grid kpis" id="s-kpi"></div>
<div class="grid s2 mt2">
<div class="card"><h3>{vt('v.s.week')}</h3><div class="wk" id="s-week"></div></div>
<div class="card"><div class="row between"><h3>{vt('v.s.tags')}</h3><div class="seg sm" id="s-range"><button data-r="week">{vt('v.r.week')}</button><button data-r="month">{vt('v.r.month')}</button><button data-r="all">{vt('v.r.all')}</button></div></div><div class="tagbars" id="s-tags"></div></div>
</div>
<div class="grid s2 mt2">
<div class="card"><div class="row between"><h3 id="cal-label">{vt('v.s.cal')}</h3><div class="row"><button class="iconbtn" id="cal-prev" aria-label="Previous month">{ic('chevl')}</button><button class="iconbtn" id="cal-next" aria-label="Next month">{ic('chevr')}</button></div></div><div class="cal" id="s-cal"></div></div>
<div class="card"><h3>{vt('v.s.hours')}</h3><div class="hours" id="s-hours"></div><h3 class="mt2">{vt('v.s.ins')}</h3><ul class="list-check" id="s-ins" style="--c:var(--green)"></ul></div>
</div>
<div class="card mt2"><h3>{vt('v.s.heat')}</h3><div class="heatwrap"><div class="heat" id="s-heat"></div></div></div>
<div class="card mt2"><h3>{vt('v.s.coll')}</h3><div class="coll" id="s-coll"></div></div>
</section>

<section class="view" id="v-tasks" hidden>
<div class="vhead"><h1>{T('v.t.h','Tasks','Vazifalar','Задачи')}</h1></div>
<form class="card tform" id="t-form" autocomplete="off">
<input class="input" id="t-title" maxlength="120" required placeholder="What needs doing?" data-i18n-attr="placeholder:v.t.ph" aria-label="Task">
<select class="input select" id="t-tag" aria-label="Tag"></select>
<label class="est"><span class="small muted" data-i18n="v.t.est">Sessions</span><input class="input" id="t-est" type="number" min="1" max="20" value="2"></label>
<button class="btn primary" type="submit" style="--c:var(--green);--ci:#03170d">{ic('plus')}<span data-i18n="v.t.add">Add task</span></button>
</form>
<div class="tabs mt2" id="t-filter" role="group"><button data-tf="open" aria-pressed="true" data-i18n="v.t.open">To do</button><button data-tf="done" aria-pressed="false" data-i18n="v.t.done">Done</button></div>
<ul class="tlist" id="t-list"></ul>
</section>

<section class="view" id="v-log" hidden>
<div class="vhead"><h1>{T('v.l.h','Time log','Vaqt jurnali','Журнал времени')}</h1><div class="row"><button class="btn ghost sm" id="l-csv">{ic('download')}<span data-i18n="v.l.csv">Export CSV</span></button><button class="btn ghost sm" id="l-json">{ic('download')}<span data-i18n="v.l.json">Export backup</span></button><label class="btn ghost sm" style="cursor:pointer">{ic('upload')}<span data-i18n="v.l.import">Import backup</span><input type="file" id="l-import" accept=".json,application/json" hidden></label></div></div>
<div class="row gnav"><button class="iconbtn" id="l-prev" aria-label="Previous day">{ic('chevl')}</button><b id="l-label">Today</b><button class="iconbtn" id="l-next" aria-label="Next day">{ic('chevr')}</button><span class="muted small" id="l-sum"></span></div>
<div class="card"><div class="tl big" id="l-timeline"></div><div class="hrs"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div></div>
<form class="card lform mt2" id="l-form">
<h3 data-i18n="v.l.add">Add time by hand</h3>
<div class="lgrid">
<label class="fl"><span data-i18n="v.l.date">Date</span><input class="input" type="date" id="l-date" required></label>
<label class="fl"><span data-i18n="v.l.from">From</span><input class="input" type="time" id="l-from" required value="09:00"></label>
<label class="fl"><span data-i18n="v.l.to">To</span><input class="input" type="time" id="l-to" required value="10:00"></label>
<label class="fl"><span>{T('v.h.tag','Tag','Teg','Тег')}</span><select class="input select" id="l-tag"></select></label>
<label class="fl wide"><span data-i18n="v.l.note">Note</span><input class="input" id="l-note" maxlength="120" placeholder="What did you do?" data-i18n-attr="placeholder:v.l.notep"></label>
<button class="btn primary" type="submit" style="--c:var(--green);--ci:#03170d">{ic('plus')}<span data-i18n="v.l.add">Add time by hand</span></button>
</div><p class="small" id="l-err" role="alert"></p></form>
<ul class="loglist mt2" id="l-list"></ul>
</section>

<section class="view" id="v-sounds" hidden>
<div class="vhead"><h1>{T('v.snd.h','Sounds','Ovozlar','Звуки')}</h1><button class="btn ghost sm" id="snd-stop">{ic('stop')}<span data-i18n="v.snd.stop">Stop all</span></button></div>
<p class="muted" data-i18n="v.snd.note">Real recordings of rain, water, fire and nature. Mix as many as you like. Each one loads the first time you play it, then works offline.</p>
<div class="card row mt1 sndm"><label class="fl" style="flex:1"><span data-i18n="v.snd.master">Master volume</span><input type="range" id="snd-master" min="0" max="1" step="0.01"></label><label class="sw"><input type="checkbox" id="snd-only"><i></i><span data-i18n="v.snd.only">Play only while a session runs</span></label></div>
<div class="grid sgrid mt2" id="snd-grid"></div>
</section>

<section class="view" id="v-prefs" hidden>
<div class="vhead"><h1>{T('v.p.h','Settings','Sozlamalar','Настройки')}</h1></div>
<div class="grid s2">
<div class="card stackf"><h3 data-i18n="v.p.durs">Durations</h3>
<label class="numrow"><span data-i18n="v.p.focus">Focus</span><input class="input" type="number" min="5" max="180" step="5" id="p-focus"></label>
<label class="numrow"><span data-i18n="v.p.short">Short break</span><input class="input" type="number" min="1" max="30" id="p-short"></label>
<label class="numrow"><span data-i18n="v.p.long">Long break</span><input class="input" type="number" min="5" max="60" id="p-long"></label>
<label class="numrow"><span data-i18n="v.p.rounds">Rounds before a long break</span><input class="input" type="number" min="2" max="8" id="p-rounds"></label>
<label class="numrow"><span data-i18n="v.p.goal">Daily goal (minutes)</span><input class="input" type="number" min="10" max="720" step="10" id="p-goal"></label>
<label class="sw"><input type="checkbox" id="p-autobreak"><i></i><span data-i18n="v.p.autobreak">Start breaks automatically</span></label>
<label class="sw"><input type="checkbox" id="p-autofocus"><i></i><span data-i18n="v.p.autofocus">Start the next focus after a break</span></label>
</div>
<div class="card stackf"><h3 data-i18n="v.p.deep">Deep focus</h3>
<div class="seg" id="p-deep"><button data-deep="strict" data-i18n="v.p.strict">Strict</button><button data-deep="gentle" data-i18n="v.p.gentle">Gentle</button><button data-deep="off" data-i18n="v.p.off">Off</button></div>
<p class="small muted" id="p-deepnote"></p>
<label class="numrow"><span data-i18n="v.p.grace">Grace time (seconds)</span><input class="input" type="number" min="3" max="60" id="p-grace"></label>
<label class="sw"><input type="checkbox" id="p-chime"><i></i><span data-i18n="v.p.chime">Chime at the end</span></label>
<label class="sw"><input type="checkbox" id="p-notify"><i></i><span data-i18n="v.p.notify">System notification at the end</span></label>
<label class="sw"><input type="checkbox" id="p-wake"><i></i><span data-i18n="v.p.wake">Keep the screen awake during a session</span></label>
<label class="sw"><input type="checkbox" id="p-haptics"><i></i><span data-i18n="v.p.haptics">Vibrate on start and finish (phones)</span></label>
<label class="sw"><input type="checkbox" id="p-confetti"><i></i><span data-i18n="v.p.confetti">Celebrate finished sessions</span></label>
<p class="small faint" id="p-notenote"></p>
</div>
<div class="card stackf"><h3 data-i18n="v.p.tags">Tags</h3><ul class="tagedit" id="p-tags"></ul>
<form class="row" id="p-tagform"><input class="input" id="p-tagname" maxlength="24" placeholder="Tag name" data-i18n-attr="placeholder:v.p.tagname" style="flex:1"><button class="btn ghost" type="submit">{ic('plus')}<span data-i18n="v.p.addtag">Add tag</span></button></form></div>
<div class="card stackf"><h3 data-i18n="v.p.look">Look</h3>
<div class="seg"><button data-set="theme=dark">{ic('moon')}{T('dr.night','Night','Tun','Ночь')}</button><button data-set="theme=light">{ic('sun')}{T('dr.day','Day','Kun','День')}</button><button data-set="theme=auto">{ic('auto')}{T('dr.auto','Auto','Avto','Авто')}</button></div>
<div class="seg"><button data-setlang="en">English</button><button data-setlang="uz">O‘zbekcha</button><button data-setlang="ru">Русский</button></div>
<div class="seg"><button data-set="motion=full">{T('dr.full','Full','To‘liq','Полная')}</button><button data-set="motion=reduced">{T('dr.calm','Calm','Sokin','Спокойная')}</button></div>
<button class="btn ghost sm" id="p-tour">{ic('sparkle')}<span data-i18n="v.p.tour">Show the welcome tour again</span></button>
<h3 class="mt2" data-i18n="v.p.data">Your data</h3><p class="small muted" data-i18n="v.p.data.p">Everything is saved in this browser.</p>
<div class="row"><a class="btn ghost sm" href="{R}me.html">{ic('id')}Clive ID</a><button class="btn ghost sm" id="p-clear">{ic('trash')}<span data-i18n="v.p.clear">Clear Vaqt data</span></button></div>
<div class="confirm" id="p-clearbox" role="alert"><span data-i18n="v.p.clear.q">This deletes every session.</span><button class="btn primary sm" id="p-clear-y" style="--c:var(--rose)" data-i18n="v.p.clear.y">Delete everything</button><button class="btn ghost sm" id="p-clear-n" data-i18n="v.p.keep">Keep it</button></div>
</div></div>
</section>
</main>

<nav class="vbottom" aria-label="Views">{bottom}</nav>
<div class="vmore" id="vmore" hidden><div class="card">{more}<button class="btn ghost block" data-close-more>{ic('x')}<span data-i18n="v.close">Close</span></button></div></div>
<canvas id="confetti" aria-hidden="true"></canvas>
<div class="vtoasts" id="vtoasts" aria-live="polite"></div>

<div class="modal" id="m-done" role="dialog" aria-modal="true" aria-labelledby="d-title" hidden><div class="card mcard">
<div class="misl" id="d-island"></div><h2 id="d-title"></h2><p class="muted" id="d-text"></p>
<div class="rewards"><span class="chip c" style="--c:var(--gold)" id="d-coins">{ic('coin')}<b></b></span><span class="chip c" style="--c:var(--green)" id="d-xp">{ic('zap')}<b></b></span></div>
<div class="xpbar big"><i id="d-xpbar"></i></div><span class="small faint" id="d-xptxt"></span>
<div class="rate"><span class="small" style="font-weight:700">{vt('v.rate')}</span><div class="rstars" id="d-rate" role="radiogroup"></div><input class="input" id="d-note" maxlength="140" placeholder="A note for future you (optional)" data-i18n-attr="placeholder:v.rate.note"></div>
<div class="mbtns"><button class="btn ghost" id="d-task" hidden>{ic('check')}<span></span></button><button class="btn primary" id="d-next" style="--c:var(--green);--ci:#03170d">{ic('play')}<span></span></button><button class="btn ghost" id="d-close">{ic('x')}<span data-i18n="v.close">Close</span></button></div></div></div>
<div class="modal" id="m-wither" role="dialog" aria-modal="true" aria-labelledby="w-title" hidden><div class="card mcard">
<div class="misl" id="w-island"></div><h2 id="w-title"></h2><p class="muted" id="w-text"></p>
<div class="mbtns"><button class="btn primary" id="w-again" style="--c:var(--green);--ci:#03170d">{ic('refresh')}<span data-i18n="v.tryagain">Try again</span></button><button class="btn ghost" id="w-close">{ic('x')}<span data-i18n="v.close">Close</span></button></div></div></div>
<div class="modal" id="m-level" role="dialog" aria-modal="true" aria-labelledby="lu-title" hidden><div class="card mcard lvup">
<div class="bigbadge"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="{star_path(32,32,30)}" fill="url(#lvg)"/><circle cx="32" cy="32" r="18" fill="var(--card)"/></svg><b id="lu-num">2</b></div>
<h2 id="lu-title">{vt('v.lv.up','span')}</h2><p class="muted" id="lu-text"></p>
<div class="mbtns"><button class="btn primary" id="lu-ok" style="--c:var(--green);--ci:#03170d">{ic('check')}<span data-i18n="v.close">Close</span></button></div></div></div>
<div class="modal" id="m-onboard" role="dialog" aria-modal="true" aria-labelledby="ob-title" hidden><div class="card mcard onb">
<div class="obart" id="ob-art"></div><h2 id="ob-title"></h2><p class="muted" id="ob-text"></p>
<div class="obdots" id="ob-dots"><i></i><i></i><i></i></div>
<div class="langsel" role="group" aria-label="Language" style="margin:0 auto"><button data-setlang="en">EN</button><button data-setlang="uz">UZ</button><button data-setlang="ru">RU</button></div>
<div class="mbtns"><button class="btn ghost" id="ob-skip">{vt('v.ob.skip')}</button><button class="btn primary" id="ob-next" style="--c:var(--green);--ci:#03170d"><span></span>{ic('arrow')}</button></div></div></div>
'''
    head_extra = '<link rel="manifest" href="manifest.webmanifest">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="Vaqt">\n<link rel="stylesheet" href="vaqt.css">\n'
    out = page('vaqt', R, 'pt.vaqt', 'Vaqt · focus garden', 'Vaqt · fokus bog‘i', 'Vaqt · сад фокуса',
               'Vaqt: a focus timer and time tracker that grows an Uzbek garden. 34 plants, a bazaar, 57 awards. Free, offline, in English, Uzbek and Russian.',
               body, '', ['assets/js/garden.js', 'vaqt/catalog.js', 'vaqt/vaqt.js'], bare=True, extra_head=head_extra)
    for a in ('assets/css/core.css', 'assets/js/i18n.js', 'assets/js/core.js', 'assets/js/garden.js', 'vaqt/catalog.js', 'vaqt/vaqt.js'):
        out = out.replace(R + a + '"', R + a + '?v=' + ASSET_V + '"')
    out = out.replace('href="vaqt.css"', 'href="vaqt.css?v=' + ASSET_V + '"')
    out = out.replace('<link rel="manifest" href="../site.webmanifest">', '')
    out = out.replace('<link rel="icon" href="../favicon.svg" type="image/svg+xml">', '<link rel="icon" id="fav" href="icon.svg" type="image/svg+xml">')
    out = out.replace('<link rel="apple-touch-icon" href="../assets/img/icon-180.png">', '<link rel="apple-touch-icon" href="icon-180.png">')
    out = out.replace('<meta name="theme-color" content="#070A18">', '<meta name="theme-color" content="#07231A">')
    return out

AWARDS = AW
