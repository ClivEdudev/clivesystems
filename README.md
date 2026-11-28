# Clive · the orbit

Everything Clive makes, in one site: **ClivEdu**, **ClivEdu Class** (clivedu.me), **Sprachwerk**, **Vault Studio**, the Whop shop, client work, and a brand-new product, **Vaqt**, a focus timer and time tracker that grows an Uzbek garden.

Plain HTML, CSS and JavaScript. No framework, no build step needed to deploy. Every page works in **English, Uzbek and Russian**.

## What's inside

| Page | File | What it does |
|---|---|---|
| Home | `public/index.html` | Animated orbit (click a planet), live “next class” countdown, focus summary, products, selected work, word of the day in 4 languages |
| Orbit | `public/ecosystem.html` | How the products connect (diagram), one section per product with live status, comparison table |
| Work | `public/work.html` | Client sites with real screenshots and filters, the lab, how I build |
| Learn | `public/learn.html` | Both English groups on Tashkent time, live countdown, weekly timetable, recent lessons, German Linie A1 |
| Journal | `public/journal.html` + `feed.xml` | Dated log of launches, builds, classes and German, filterable, with RSS |
| Shop | `public/shop.html` | The Technical Issues Q&A eBook ($9 on Whop) with gallery, contents and FAQ |
| About | `public/about.html` | Story, a tilting Clive ID card, five rules, toolkit |
| Contact | `public/contact.html` | Telegram, email, Tashkent clock, a form that goes to Netlify Forms |
| Clive ID | `public/me.html` | Visitor profile, look and feel, saved words, Vaqt stats, sync code, backups |
| Brand kit | `public/brand.html` | Mark, colours (tap to copy), type, product marks, SVG downloads |
| Links | `public/links.html` | Link-in-bio page for Telegram and Instagram bios |
| Products | `public/products/*.html` | One page each: Vaqt, ClivEdu, ClivEdu Class, Sprachwerk, Vault Studio |
| **Vaqt app** | `public/vaqt/` | The focus garden itself (see below) |
| 404 | `public/404.html` | “Lost in orbit” |

Site-wide: language switch (EN/UZ/RU), settings drawer (night/day/auto, 7 accent colours, calm motion, text size), command palette (press `/` or `Ctrl K`), and an easter egg (type `clive` anywhere).

## Vaqt, the focus garden

- **Timer** (drag the dial, arrow keys or one-tap presets), **Pomodoro** with short and long breaks, and **Flow** that counts up.
- **34 Uzbek plants in five rarity tiers** (common → legendary), drawn in `public/assets/js/garden.js` with light from the upper left (shaded leaves, layered crowns, bark, fruit glints). Lola and paxta are free; the rest are bought in the Bazaar. Bigger plants need longer sessions. About 1 session in 25 grows a **golden** plant.
- **Bazaar**: seeds, 16 decorations, 6 sceneries for the garden, and streak freezes (hold up to two; they cover missed days automatically).
- **Levels and titles**: every focused minute is 1 XP (Seed → Sprout → Sapling → Gardener → Master gardener → Elder chinor). Each level-up pays coins.
- **Daily quests**: three per day, picked from a pool, claimed for coins.
- **57 awards** in nine categories and five tiers (bronze 15 → diamond 400 coins), with filters and progress bars. The list lives in `AW` in `source/p_vaqt.py`; `build.py` writes it to `public/vaqt/catalog.js`.
- **Living dial**: the sky inside the dial follows the local time of day; breaks show a breathing circle and a stretch tip.
- **After each session**: coins, XP bar, a 1–5 focus rating and a note.
- **Deep focus**: *Strict* wilts the plant if you leave the tab longer than the grace time (15 s by default); *Gentle* only counts interruptions; *Off*. Cancelling in the first 10 seconds costs nothing.
- **Garden** by day, week, month, year or all time, in any owned scenery and with decorations; save it as an image.
- **Stats**: 12 KPIs, week by tag, tag breakdown, month calendar, best hours, 26-week heatmap, insights, seed collection.
- **Tasks** linked to sessions, **time log** with a 24-hour timeline, manual entries, edit/delete with undo, CSV export, backup import/export.
- **Ambient sounds** made live with Web Audio (rain, brown noise, waves, fireplace, wind, clock) with a mixer.
- Welcome tour, confetti, haptics on phones, chime, optional system notifications, screen wake lock, full-screen zen mode, a floating **mini timer** (Chrome's Document Picture-in-Picture), a live favicon and tab title.
- **Works offline** and installs like an app (`vaqt/sw.js`, `vaqt/manifest.webmanifest`). When you change Vaqt files, bump `ASSET_V` in `source/p_vaqt.py` and `CACHE`/`V` in `public/vaqt/sw.js` so returning visitors get the new version.
- “Load a sample fortnight” fills an empty garden for demos; sample data is marked, removable, and never counts towards awards, levels or quests.

Keyboard: `Space` start/pause · `1 2 3` modes · `↑ ↓` ±5 min · `F` full screen · `M` sounds · `G B A S T` garden, Bazaar, awards, stats, tasks.

All Vaqt data lives in the browser under `clive.vaqt.v1`. The Clive ID page reads it for the stats and moves it between devices.

## Put it online (Netlify)

1. Create a GitHub repository (for example `ClivEdudev/clive`) and upload this whole folder.
2. Netlify → **Add new site → Import an existing project** → pick the repository. `netlify.toml` already says: publish `public`, functions in `netlify/functions`. Deploy.
3. **Site configuration → Forms**: make sure form detection is on, so the contact form arrives in Netlify → Forms → `contact`. Add an email notification there.
4. Domain: `clivedu.me` currently points to ClivEdu Class, so give this site its own name (for example `clive.netlify.app`) or a subdomain such as `orbit.clivedu.me` in **Domain management**.
5. Optional: set the real address in the sitemap and RSS feed: `SITE_URL=https://your-domain python3 source/build.py`, then push.

Nothing else needs configuring. The sync function uses Netlify Blobs, which works on Netlify with no setup.

### Clive ID sync

`netlify/functions/sync.mjs` answers `/api/sync`. “Upload now” on the Clive ID page creates a code like `CLV-7K2Q-9MXA-4PRT` and stores the visitor's profile, settings, saved words and Vaqt garden under a hash of that code. Typing the code on another device restores it. The code is the only key, so it works like a password: don't post it publicly. Each backup is capped at 600 KB.

## Editing text and translations

Every page is generated from the Python files in `source/` (English, Uzbek and Russian side by side in one place), which also write `public/assets/js/i18n.js`.

```
python3 source/build.py          # rebuilds every page and the translations
npm run serve                    # preview at http://localhost:8765
```

- New journal entry: add a line at the top of `JOURNAL` in `source/p_more.py`.
- Class times: `CLASSES` in `public/assets/js/core.js` (Tashkent time) and the timetable/text in `learn_body()` in `source/p_more.py`.
- Product facts: `source/p_data.py`. Product pages: `source/p_products.py`.
- Client work: `WORKS` and `LAB` in `source/p_orbit_work.py`. Screenshots are in `public/assets/img/work/` (960×600 WebP).
- Shop: `shop_body()` in `source/p_more.py`.

You can also edit the HTML in `public/` directly; just remember the next `build.py` run will overwrite it.

## Files

```
public/
  index.html, ecosystem.html, work.html, learn.html, journal.html, shop.html,
  about.html, contact.html, me.html, brand.html, links.html, 404.html
  products/        vaqt, clivedu, class, sprachwerk, vault-studio
  vaqt/            the app: index.html, vaqt.css, vaqt.js, catalog.js (generated), sw.js, manifest, icons
  assets/css/      core.css (design tokens and components)
  assets/js/       core.js (settings, languages, palette), i18n.js (generated),
                   garden.js (all plants and gardens), orbit.js (home canvas), page scripts
  assets/img/      screenshots, phone shots, shop images, icons, og.png
  assets/brand/    clive-mark.svg, clive-wordmark.svg, vaqt-icon.svg
  feed.xml, sitemap.xml, robots.txt, site.webmanifest, favicon.svg
netlify/functions/sync.mjs
source/            page generator (Python 3, no packages needed)
```

Made by Imonqulov Baxriddin (Clive) · Telegram @clive077 · imonkulovclive@gmail.com

## Reja, the study and life planner (`public/reja/`)

A standalone app at `/reja/` (plain HTML, CSS and JS, no build step).

- Timetable with numbered pairs and an alternating A/B week (the Thursday ICT lecture is week A only). Edit pairs, class times and the week parity in Settings.
- Calendar: day, week, month and agenda views; lectures, seminars and labs styled differently; deadlines shown as flags; tap an empty slot to add an event.
- Assignments with a deadline date and time, priority, status (list or board), reminders (at the deadline up to 1 week before) and attached files of any type (up to 60 MB each, stored in IndexedDB in the browser).
- Quick notes during a live class: plain notes, homework (becomes an assignment due at the next class of that subject), or an extra lesson (added to the calendar).
- Reminders: browser notifications while Reja is open or installed, plus a `.ics` export with alarms for phone calendars.
- Data stays in the browser (`localStorage` key `reja.v1`, files in IndexedDB `reja-files`); JSON backup and restore in Settings.
