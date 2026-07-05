/** Phase 1 mock data — content from the design handoff, restyled for the
 * "quiet studio" direction (IMPLEMENTATION_PLAN §3.5). */

export interface Track {
  n: string;
  title: string;
  dur: string;
}

export const LIBRARY = { path: '~/Music/Library', tracks: 1284, size: '96 GB' };

export const DEFAULT_VIBE =
  '80s synth-pop, upbeat, a little melancholy. Late-night drive energy — neon, rain on the windshield.';

export const VIBE_CHIPS = ['synthwave', 'new wave', 'italo disco'];

export const SHOW_TITLE = 'Neon Rain Drivetime';

export const TAPES = [
  { id: 'C60', perSide: '30:00', est: 16 },
  { id: 'C90', perSide: '45:00', est: 24 },
  { id: 'C120', perSide: '60:00', est: 32 },
] as const;
export type TapeId = (typeof TAPES)[number]['id'];

/** SHOW FORMAT presets (IMPLEMENTATION_PLAN §3.5) — one-press host personas. */
export const HOST_PRESETS = [
  { id: 'warm', label: 'Warm FM', persona: 'warm, unhurried — stories between songs' },
  { id: 'hype', label: 'Top-40 hype', persona: 'fast, bright — countdown energy' },
  { id: 'wit', label: 'Dry wit', persona: 'laconic, deadpan — one-liners' },
  { id: 'jazz', label: 'Midnight jazz', persona: 'velvet, slow — after-hours' },
] as const;
export type HostPresetId = (typeof HOST_PRESETS)[number]['id'];

export const TALK_LEVELS = ['Minimal', 'Balanced', 'Chatty'] as const;
export type TalkLevel = (typeof TALK_LEVELS)[number];

/** Voice lists are engine-specific (IMPLEMENTATION_PLAN §3.5): LOCAL = Piper
 * voice models installed via Settings; ELEVENLABS = voices fetched from the
 * user's account. Mocked until Phase 4. */
export const VOICES = {
  local: [
    { id: 'nora', label: '"Nora" · clear & close' },
    { id: 'finn', label: '"Finn" · soft baritone' },
    { id: 'eir', label: '"Eir" · bright morning' },
  ],
  elevenlabs: [
    { id: 'vesla', label: '"Vesla" · warm FM' },
    { id: 'bjorn', label: '"Bjørn" · deep late-night' },
    { id: 'liv', label: '"Liv" · crisp Top-40' },
  ],
} as const;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const SIDE_A: Track[] = [
  { n: '01', title: 'Cold open — your host, Vesla', dur: '1:12' },
  { n: '02', title: 'A-ha — Take On Me', dur: '3:48' },
  { n: '03', title: 'Kim Wilde — Cambodia', dur: '3:56' },
  { n: '04', title: 'Depeche Mode — But Not Tonight', dur: '4:16' },
  { n: '05', title: 'Alphaville — Forever Young', dur: '3:45' },
  { n: '06', title: 'Yazoo — Only You', dur: '3:13' },
  { n: '07', title: 'OMD — Souvenir', dur: '3:39' },
  { n: '08', title: 'New Order — Ceremony', dur: '4:23' },
];

export const SIDE_B: Track[] = [
  { n: '01', title: 'Welcome back — a word from Vesla', dur: '0:58' },
  { n: '02', title: "Talk Talk — It's My Life", dur: '3:52' },
  { n: '03', title: 'Ultravox — Vienna', dur: '4:36' },
  { n: '04', title: 'Eurythmics — Here Comes the Rain Again', dur: '3:55' },
  { n: '05', title: 'Simple Minds — Someone Somewhere', dur: '4:24' },
  { n: '06', title: 'The Blue Nile — Tinseltown in the Rain', dur: '3:56' },
  { n: '07', title: 'China Crisis — Wishful Thinking', dur: '4:17' },
];

export const SCRIPT_TEXT =
  "…that was A-ha, three Norwegians and a synth line they nearly threw away. " +
  "It's 1985 somewhere, and in that spirit — here's Kim Wilde, over the intro, " +
  'don’t touch that dial…';

export const NOW_FITTING = [
  'A-ha — Take On Me (3:48)',
  'Kim Wilde — Cambodia (3:56)',
  'Depeche Mode — But Not Tonight (4:16)',
  'Alphaville — Forever Young (3:45)',
];

export const FIT_REPORT = {
  sideA: { file: 'side-a.wav', dur: '44:38', slack: '22 s' },
  sideB: { file: 'side-b.wav', dur: '44:51', slack: '9 s' },
  loudness: '−16.0 LUFS ±0.3',
  duckingEvents: 26,
};
