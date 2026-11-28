# Vaqt sound credits

All ten recordings come from the open-source ambient sound app
[Moodist](https://github.com/remvze/moodist) by remvze. Moodist states that its
sounds are licensed under either [CC0](https://creativecommons.org/publicdomain/zero/1.0/)
or the [Pixabay Content License](https://pixabay.com/service/license-summary/).

For Vaqt each one was cut into a loop with an equal-power crossfade at the seam,
levelled, and re-encoded as MP3 (96 kbps stereo; the clock is 64 kbps mono).

| Vaqt file   | Moodist source                    | Loop length |
|-------------|-----------------------------------|-------------|
| rain.mp3    | sounds/rain/rain-on-leaves.mp3    | 37 s        |
| thunder.mp3 | sounds/rain/thunder.mp3           | 62 s        |
| river.mp3   | sounds/nature/river.mp3           | 67 s        |
| ocean.mp3   | sounds/nature/waves.mp3           | 76 s        |
| fire.mp3    | sounds/nature/campfire.mp3        | 67 s        |
| wind.mp3    | sounds/nature/wind-in-trees.mp3   | 52 s        |
| birds.mp3   | sounds/animals/birds.mp3          | 72 s        |
| night.mp3   | sounds/animals/crickets.mp3       | 67 s        |
| chimes.mp3  | sounds/things/wind-chimes.mp3     | 76 s        |
| clock.mp3   | sounds/things/clock.mp3           | 14 s        |

The loop length is also listed in `SOUNDS` in `vaqt.js`; it must match the file.
If you replace a recording, bump `SND_V` in `vaqt.js` and `SOUNDS` in `sw.js`.
