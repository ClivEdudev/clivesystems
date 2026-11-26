from lib import *

# product facts shared by the orbit page, product pages and comparison table: (en, uz, ru)
PD = {
 'vaqt': {
  'tag': ('Focus garden & time tracker', 'Fokus bog‘i va vaqt hisoblagichi', 'Сад фокуса и трекер времени'),
  'short': ('Focus sessions grow an Uzbek garden: 20 plants, a bazaar, levels, daily quests and 55 awards. Works offline.', 'Fokus sessiyalari o‘zbek bog‘ini o‘stiradi: 20 ta o‘simlik, bozor, darajalar, kunlik topshiriqlar va 55 ta yutuq. Oflayn ishlaydi.', 'Сессии фокуса растят узбекский сад: 20 растений, базар, уровни, ежедневные задания и 55 наград. Работает офлайн.'),
  'for': ('Anyone who wants to focus: students, teachers, makers', 'Diqqatini jamlamoqchi bo‘lgan har kim: o‘quvchilar, o‘qituvchilar, ijodkorlar', 'Всем, кто хочет сосредоточиться: ученикам, учителям, авторам'),
  'on': ('Any browser · installable · offline', 'Istalgan brauzer · o‘rnatiladi · oflayn', 'Любой браузер · устанавливается · офлайн'),
  'langs': ('English, Uzbek, Russian', 'Ingliz, o‘zbek, rus', 'Английский, узбекский, русский'),
  'price': ('Free', 'Bepul', 'Бесплатно'),
  'sign': ('None needed · optional sync code', 'Kerak emas · ixtiyoriy sinxron kod', 'Не нужен · по желанию код синхронизации'),
 },
 'clivedu': {
  'tag': ('English among the stars', 'Yulduzlar orasida ingliz tili', 'Английский среди звёзд'),
  'short': ('A personal English classroom: slide lessons, a Word Galaxy, games, homework and a teacher desk.', 'Shaxsiy ingliz tili sinfi: slayd darslar, So‘z galaktikasi, o‘yinlar, uy vazifasi va o‘qituvchi stoli.', 'Личный класс английского: уроки-слайды, Галактика слов, игры, домашние задания и стол учителя.'),
  'for': ('English learners and their teacher', 'Ingliz tili o‘rganuvchilar va ularning o‘qituvchisi', 'Изучающим английский и их учителю'),
  'on': ('Any browser · installable', 'Istalgan brauzer · o‘rnatiladi', 'Любой браузер · устанавливается'),
  'langs': ('Uzbek first, English', 'Avval o‘zbek, ingliz', 'Сначала узбекский, английский'),
  'price': ('Free for students', 'O‘quvchilar uchun bepul', 'Бесплатно для учеников'),
  'sign': ('Email or Google', 'Email yoki Google', 'Email или Google'),
 },
 'class': {
  'tag': ('The live classroom', 'Jonli sinfxona', 'Живой класс'),
  'short': ('My students’ site at clivedu.me: each lesson opens on their phones while it plays on the smart board.', 'O‘quvchilarimning clivedu.me’dagi sayti: har bir dars aqlli doskada ko‘rsatilayotganda telefonlarida ochiladi.', 'Сайт моих учеников на clivedu.me: каждый урок открывается у них на телефонах, пока идёт на интерактивной доске.'),
  'for': ('My two English groups', 'Mening ikki ingliz tili guruhim', 'Мои две группы английского'),
  'on': ('Phones in class · smart board', 'Darsda telefonlar · aqlli doska', 'Телефоны на уроке · интерактивная доска'),
  'langs': ('English with Uzbek translations', 'Ingliz tili, o‘zbekcha tarjimalar bilan', 'Английский с переводом на узбекский'),
  'price': ('Free for my students', 'O‘quvchilarim uchun bepul', 'Бесплатно для моих учеников'),
  'sign': ('Telegram', 'Telegram', 'Telegram'),
 },
 'sprachwerk': {
  'tag': ('German, engineered', 'Nemis tili, puxta qurilgan', 'Немецкий, собранный как механизм'),
  'short': ('My German-learning app: Linie A1, slide lessons, Berlin Missions, Shadow Studio, Memory Galaxy.', 'Nemis tilini o‘rganish ilovam: Linie A1, slayd darslar, Berlin Missions, Shadow Studio, Memory Galaxy.', 'Моё приложение для немецкого: Linie A1, уроки-слайды, Berlin Missions, Shadow Studio, Memory Galaxy.'),
  'for': ('Self-learners of German, starting with me', 'Nemis tilini mustaqil o‘rganuvchilar, mendan boshlab', 'Тем, кто учит немецкий сам, начиная с меня'),
  'on': ('Any browser · installable · offline', 'Istalgan brauzer · o‘rnatiladi · oflayn', 'Любой браузер · устанавливается · офлайн'),
  'langs': ('German, explained in English', 'Nemis tili, inglizcha tushuntirish bilan', 'Немецкий с объяснениями на английском'),
  'price': ('Free', 'Bepul', 'Бесплатно'),
  'sign': ('Optional Google sign-in', 'Ixtiyoriy Google orqali kirish', 'Вход через Google по желанию'),
 },
 'vault': {
  'tag': ('Video studio for WonderVault', 'WonderVault uchun video studiya', 'Видеостудия для WonderVault'),
  'short': ('Script, edit and thumbnail Shorts and long videos for my amazing-facts channel.', 'Ajoyib faktlar kanalim uchun Shorts va uzun videolarni yozish, montaj qilish va muqova yasash.', 'Сценарии, монтаж и обложки для Shorts и длинных видео моего канала об удивительных фактах.'),
  'for': ('The WonderVault YouTube channel', 'WonderVault YouTube kanali', 'YouTube-канал WonderVault'),
  'on': ('Phone and computer browsers', 'Telefon va kompyuter brauzerlari', 'Браузеры телефона и компьютера'),
  'langs': ('English', 'Ingliz', 'Английский'),
  'price': ('My own tool', 'Shaxsiy vositam', 'Мой личный инструмент'),
  'sign': ('None · saves in the browser', 'Kerak emas · brauzerda saqlanadi', 'Не нужен · сохраняет в браузере'),
 },
}

def pd(pid, field, tag='span', cls=''):
    en, uz, ru = PD[pid][field]
    return T(f'pd.{pid}.{field}', en, uz, ru, tag=tag, cls=cls)

def P(pid):
    return [p for p in PRODUCTS if p['id'] == pid][0]
