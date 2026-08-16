/*
  Ported from the approved "Sunny Booty Bounce (1).html" reference — a real
  composition-engine dance, not a pose flipbook, so it doesn't reuse
  SunnyPoseAnimation. All 20 poses stay mounted the whole time and only their
  opacity changes (swapping `src` on a single <img> forces a fresh decode on
  every switch, which flashes one unpainted frame — that's the "black
  flicker" the reference calls out). Three nested, pot-anchored CSS
  transforms (hips sway, squash/stretch, cheek/soft-body follow-through) ride
  on top, matching the reference's own math exactly — this file is a
  same-behavior port of sunny-dance-standalone.jsx, not a rewrite.

  Timing model: OM_SCENES defines four named sections with a "dur" (real
  playback seconds) and a "nat" (authored seconds the choreography is keyed
  to — here they're equal for 3 of 4 sections, ~8% different for "Turn
  Around"). `deriveCues`/`warpToAuthored` reproduce the reference engine's
  own dur->nat warp so the sections land at the exact authored times they
  were tuned at, not an approximation.
*/

const SPRITE_W = 340;
const SPRITE_H = 320;

const SCENES = [
  { name: "Front Bounce", dur: 0.6, nat: 0.6 },
  { name: "Turn Around", dur: 0.6, nat: 0.55 },
  { name: "Booty Clap", dur: 0.6, nat: 0.6 },
  { name: "Front Return", dur: 0.55, nat: 0.55 }
];

function deriveCues(scenes) {
  let playStart = 0;
  let authStart = 0;
  const sections = [];
  const table = {};
  for (const s of scenes) {
    const nat = typeof s.nat === "number" && isFinite(s.nat) && s.nat > 0 ? s.nat : s.dur;
    sections.push({ name: s.name, playStart, dur: s.dur, authStart, nat });
    if (!(s.name in table)) table[s.name] = Math.round(authStart * 1000) / 1000;
    playStart += s.dur;
    authStart += nat;
  }
  return {
    sections,
    table,
    total: Math.round(playStart * 1000) / 1000,
    authoredTotal: Math.round(authStart * 1000) / 1000
  };
}

function warpToAuthored(d, t) {
  const ss = d.sections;
  if (!ss.length) return 0;
  let idx = ss.length - 1;
  for (let i = 0; i < ss.length; i++) {
    if (t < ss[i].playStart + ss[i].dur) { idx = i; break; }
  }
  const s = ss[idx];
  const local = Math.min(Math.max(t - s.playStart, 0), s.dur);
  const T = s.authStart + (s.dur > 0 ? local * (s.nat / s.dur) : 0);
  return Math.min(T, d.authoredTotal);
}

export const Easing = {
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutQuart: (t) => 1 - (--t) * t * t * t,
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2
};

export const CUE_DATA = deriveCues(SCENES);
export const CUES = CUE_DATA.table;
export const LOOP = CUE_DATA.authoredTotal; // 2.3s
const BEATS = 4;
const BEAT = LOOP / BEATS;

/* choreography: section name -> [poseIndex, rhythmic weight] */
const TRACK = [
  ["Front Bounce", [[1, 1.35], [2, 1], [3, 1], [4, 1], [5, 1.2]]],
  ["Turn Around", [[6, 1.1], [7, 1], [8, 1.35], [9, 1]]],
  ["Booty Clap", [[10, 1.3], [11, 1], [12, 1.25], [13, 1], [14, 1.1]]],
  ["Front Return", [[15, 1], [16, 1], [17, 1], [18, 1.15], [19, 1], [20, 1.3]]]
];

function poseTimeline(cues, authoredTotal) {
  const starts = TRACK.map(([name]) => (Number.isFinite(cues[name]) ? cues[name] : 0));
  const out = [];
  TRACK.forEach(([, items], si) => {
    const start = starts[si];
    const end = si + 1 < starts.length ? starts[si + 1] : (authoredTotal || LOOP);
    const total = items.reduce((a, [, w]) => a + w, 0);
    let t = start;
    items.forEach(([pose, w]) => {
      const dur = ((end - start) * w) / total;
      out.push({ pose, start: t, end: t + dur });
      t += dur;
    });
  });
  return out;
}

export const TRACK_TIMELINE = poseTimeline(CUES, CUE_DATA.authoredTotal);

/* exactly three motion helpers — nothing else eases or transforms */
export const MOTION = {
  // one bounce beat: slow anticipation -> compression -> fast pop -> settle
  compress(t) {
    const b = ((t % BEAT) + BEAT) % BEAT / BEAT;
    return b < 0.42
      ? Easing.easeInOutQuad(b / 0.42)
      : 1 - Easing.easeOutQuart((b - 0.42) / 0.58);
  },
  // long body sway across the whole loop
  sway(t) { return Math.sin((2 * Math.PI * t) / LOOP); },
  // soft-body follow: lagged compression minus a longer lag = overshoot + settle
  spring(t, lag, lag2) {
    return MOTION.compress(t - lag) - 0.45 * MOTION.compress(t - lag2);
  }
};

export { SPRITE_W, SPRITE_H, warpToAuthored };
