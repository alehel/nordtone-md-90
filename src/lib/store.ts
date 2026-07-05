/**
 * App state machine (IMPLEMENTATION_PLAN §4.1): Setup → Composing → Complete.
 * Phase 1: transitions are driven by a mock composer on timers; Phase 3+
 * replaces the timers with real backend job events over Tauri IPC.
 */
import { writable, derived, get } from 'svelte/store';
import { SCRIPT_TEXT, NOW_FITTING, HOST_PRESETS, type TapeId, type HostPresetId, type TalkLevel } from './mock';

export type Screen = 'setup' | 'generation' | 'jcard' | 'settings';

export type StageState = 'done' | 'busy' | 'idle';
export interface Stage {
  label: string;
  state: StageState;
  status: string;
}

export const screen = writable<Screen>('setup');
/** Screen to return to when Settings closes. */
let settingsReturn: Screen = 'setup';

export function openSettings(): void {
  settingsReturn = get(screen) === 'settings' ? settingsReturn : get(screen);
  screen.set('settings');
}
export function closeSettings(): void {
  screen.set(settingsReturn);
}

export const vibe = writable<string>('');
export const tape = writable<TapeId | 'CUSTOM'>('C90');
/** Total minutes for a CUSTOM tape (both sides). Real tapes ran 46–120. */
export const customMinutes = writable<number>(74);
export const premiumVoice = writable<boolean>(true);

const AVG_TRACK_MIN = 3.75; // matches the design's C90 -> 24 tracks estimate

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;

/** Resolved tape selection: label, per-side length, track estimate. */
export const tapeInfo = derived([tape, customMinutes], ([t, mins]) => {
  // Typed input can be transiently empty/out of range — clamp, don't trust.
  const total = t === 'CUSTOM' ? Math.min(240, Math.max(10, Math.round(Number(mins) || 74))) : Number(t.slice(1));
  const perSideSec = (total * 60) / 2;
  return {
    label: `C${total}`,
    totalMin: total,
    perSideSec,
    perSide: fmt(perSideSec),
    est: Math.max(1, Math.round(total / AVG_TRACK_MIN)),
  };
});

/* SHOW FORMAT (§3.5) — structured show-definition settings that the Phase 3
   prompt builder merges with the free-text music description. Presets only
   ever write into the editable persona text; hand-edited text deselects the
   preset key (null) and is passed to the LLM verbatim. */
export const hostPreset = writable<HostPresetId | null>('warm');
export const persona = writable<string>(HOST_PRESETS[0].persona);
export const talkLevel = writable<TalkLevel>('BALANCED');
export const eraNews = writable<boolean>(true);

/** Which editor window is open on the Setup faceplate. */
export const editor = writable<'music' | 'format' | 'tape' | null>(null);

export function applyHostPreset(id: HostPresetId): void {
  hostPreset.set(id);
  persona.set(HOST_PRESETS.find((p) => p.id === id)?.persona ?? '');
}

const IDLE_STAGES: Stage[] = [
  { label: 'SCAN LIBRARY', state: 'idle', status: '' },
  { label: 'SELECT TRACKS', state: 'idle', status: '' },
  { label: 'WRITE SCRIPT', state: 'idle', status: '' },
  { label: 'VOICE HOST', state: 'idle', status: 'elevenlabs · "vesla"' },
  { label: 'MIX SIDES', state: 'idle', status: '−16 LUFS · crossfade · duck' },
];

export const stages = writable<Stage[]>(IDLE_STAGES);
export const scriptText = writable<string>('');
export const counterSec = writable<number>(0);
export const sideLenSec = writable<number>(45 * 60);
export const nowFitting = writable<string>(NOW_FITTING[0]);

export const counterLabel = derived([counterSec, sideLenSec], ([sec, len]) => {
  const f = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  return { elapsed: f(sec), total: fmt(len), pct: Math.min(100, (sec / len) * 100) };
});

let timers: ReturnType<typeof setInterval | typeof setTimeout>[] = [];
const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
const every = (fn: () => void, ms: number) => timers.push(setInterval(fn, ms));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

const setStage = (i: number, state: StageState, status: string) =>
  stages.update((s) => s.map((st, j) => (j === i ? { ...st, state, status } : st)));

/** Mock composer: walks the five stages, types the script, runs the counter. */
export function startCompose(): void {
  clearTimers();
  stages.set(IDLE_STAGES.map((s) => ({ ...s })));
  scriptText.set('');
  counterSec.set(0);
  sideLenSec.set(get(tapeInfo).perSideSec);
  screen.set('generation');

  setStage(0, 'busy', 'reading tags…');
  later(() => setStage(0, 'done', '1,284 tracks read'), 1600);
  later(() => setStage(1, 'busy', 'fitting to 2 × 45:00…'), 1700);
  later(() => setStage(1, 'done', '24 picked · 89:41 fitted'), 4200);
  later(() => setStage(2, 'busy', 'link 1 of 26…'), 4300);

  // Typewriter for the script monitor, then advance the remaining stages.
  later(() => {
    let i = 0;
    let link = 1;
    every(() => {
      i += 2;
      scriptText.set(SCRIPT_TEXT.slice(0, i));
      if (i % 40 === 0 && link < 26) setStage(2, 'busy', `link ${++link} of 26…`);
      if (i >= SCRIPT_TEXT.length) {
        clearTimers();
        setStage(2, 'done', '26 links written');
        setStage(3, 'busy', 'rendering voice…');
        later(() => {
          setStage(3, 'done', 'elevenlabs · "vesla"');
          setStage(4, 'busy', '−16 LUFS · crossfade · duck');
          runCounter();
        }, 2600);
      }
    }, 45);
  }, 4400);
}

function runCounter(): void {
  // Compressed demo timeline: ~26 tape-seconds per real tick.
  let fit = 0;
  every(() => {
    counterSec.update((s) => {
      const next = s + 26;
      if (next >= get(sideLenSec)) {
        clearTimers();
        setStage(4, 'done', '2 sides rendered');
        later(() => screen.set('jcard'), 900);
        return get(sideLenSec);
      }
      return next;
    });
    if (++fit % 9 === 0) nowFitting.set(NOW_FITTING[(fit / 9) % NOW_FITTING.length]);
  }, 250);
}

export function stopCompose(): void {
  clearTimers();
  screen.set('setup');
}

export function newShow(): void {
  clearTimers();
  stages.set(IDLE_STAGES.map((s) => ({ ...s })));
  screen.set('setup');
}
