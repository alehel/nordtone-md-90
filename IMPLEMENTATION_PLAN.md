# NORDTONE MD-90 — Implementation Plan

**A cross-platform desktop app that turns your own music library into a complete, DJ-hosted radio show, fitted to a cassette and printed with a matching J-card.**

This plan translates the Claude Design handoff (`project/NORDTONE MD-90.html`, standalone `project/MD-90 App.dc.html`, and `chats/chat1.md`) into a buildable engineering plan.

---

## 1. Decisions locked in

| Decision | Choice | Rationale |
|---|---|---|
| **Desktop framework** | **Tauri 2** (Rust core + web UI) | Small binaries, native performance, and a Rust backend that is a natural fit for the heavy audio DSP/mixing work. The webview reproduces the skeuomorphic UI with full fidelity. |
| **Color direction** | **Charcoal / amber** (design 1a–1c) as the **default theme** | The committed primary — the full three-screen flow is designed in it. The two color studies, cream/orange (1d) and cool grey/blue (1e), ship as **built-in alternate themes** selectable in Settings (see §3.4). |
| **Scope** | **Full app, phased** | UI shell → library indexing → AI selection/script → TTS → audio mix engine → J-card → polish/packaging, with an end-to-end MVP milestone mid-way. |
| **AI provider** | **Vendor-agnostic** via the `genai` crate | The user picks their own LLM — Anthropic, OpenAI, Gemini, Groq, xAI, DeepSeek, or a local model via Ollama — plus any OpenAI-compatible endpoint. No provider is hard-wired. |
| **Local-first** | Everything runs on the user's machine with their own API keys | "Your files, your keys, your tape." No backend server, no telemetry. Keys live in the OS keychain. |

---

## 2. Product summary (what the app does)

1. **Point** at a music folder → the app indexes it (tags, durations, basic audio features).
2. **Describe tonight's music** — free text, as simple or as detailed as the user likes, e.g. *"80s synth-pop, upbeat, a little melancholy."* Experienced prompters can write full instructions here; it goes to the LLM verbatim.
3. **Pick a tape length** — C60 / C90 / C120 (2 × 30 / 45 / 60 min sides), or CUSTOM: a popup where the user sets the total tape length themselves (10–240 min, e.g. a real C74).
4. **Choose a host voice** — a free local voice by default, or a premium ElevenLabs voice.
5. **Compose** (the red REC button):
   - The user's chosen LLM **selects and sequences** tracks from the library to match the vibe and fit each side.
   - The LLM **writes a DJ script** — cold open, inter-song links with artist stories, era news items, a "flip the tape" reminder at the end of Side A, and a Side B sign-off.
   - The script is **voiced** (local TTS or ElevenLabs).
   - Everything is **mixed with radio craft**: consistent loudness (−16 LUFS), crossfades, and the host talking over song intros with the music **ducked** underneath.
6. **Output**: two audio files, `side-a.wav` and `side-b.wav`, each fitted precisely to the tape side.
7. **J-card**: a print-ready folding inlay (front panel art, spine, both tracklists, credits, fit report) — print or export to PDF.

---

## 3. Design fidelity — extracted spec

The design must be recreated **pixel-perfectly**, not by copying the prototype's inline-style markup but by rebuilding it as a proper component system driven by design tokens. The three primary screens are all `960px` wide "hardware faces" with four corner screws and a frameless custom-chrome header.

### 3.1 Design tokens (from the source)

**Typography**
- `Barlow` — body / general UI (400/500/600)
- `Barlow Condensed` — panel labels, headings, badges, buttons (400–700, wide letter-spacing 1.5–5px)
- `VT323` — all LCD / seven-segment style readouts (monospace)
- All three fonts are **bundled locally** (self-hosted `.woff2`) so the app works fully offline.

**Color palette (charcoal / amber — the default theme's values for the semantic tokens in §3.4)**

| Token | Value |
|---|---|
| `--app-bg` | `#101114` |
| `--panel-face` | `linear-gradient(180deg,#45484e 0%,#33353a 8%,#2a2c30 60%,#242629 100%)` |
| `--panel-inset` | `#1d1e21` |
| `--lcd-bg` | `linear-gradient(180deg,#0e0b06,#1a130a)` |
| `--lcd-amber` | `#ffb14e` (glow `rgba(255,150,40,.45)`) |
| `--lcd-amber-dim` | `#8f6a35` |
| `--accent-amber` | `linear-gradient(180deg,#ffc36b,#f09a2e)`; solid `#ffab40` |
| `--metal-btn` | `linear-gradient(180deg,#4c4f55,#33353a)` (drop `#1a1b1e`) |
| `--rec-red` | `radial-gradient(circle at 38% 30%,#ff7a70,#c0392b 55%,#8e2418)` (drop `#5f180f`) |
| `--led-green` | `radial-gradient(circle at 35% 30%,#9dffb8,#2ea052)` (glow `rgba(70,220,120,.7)`) |
| `--led-busy` | `radial-gradient(circle at 35% 30%,#ffd9a0,#e08a1e)` (glow `rgba(255,171,64,.9)`) |
| `--led-off` | `#3a3c40` |
| `--text-hi` | `#e8e4da` / `#d8d4ca` / `#c9ccd2` |
| `--text-mut` | `#9aa0a8` / `#84888f` / `#6f747c` |
| `--paper` | `#faf6ec`; label cream `linear-gradient(180deg,#f2ecdc,#e6ddc6)` |

**Signature shadows**
- Panel face: `inset 0 1px 0 rgba(255,255,255,.14), inset 0 -3px 6px rgba(0,0,0,.5), 0 24px 60px rgba(0,0,0,.55)`
- Inset panel: `inset 0 2px 6px rgba(0,0,0,.6), 0 1px 0 rgba(255,255,255,.06)`
- LCD well: `inset 0 2px 8px rgba(0,0,0,.9)`
- Raised hardware button: `inset 0 1px 0 rgba(255,255,255,.15), 0 3px 0 #1a1b1e, 0 4px 6px rgba(0,0,0,.5)` (the `0 3px 0` gives the physical "key travel"; pressed state collapses it)

**Animations** (from `<style>` in the source — port verbatim as keyframes)
- `ledblink` — busy/active LED pulse (1.4s)
- `cursor` — blinking block cursor in LCD text (1.1s steps)
- `reelspin` — cassette reels rotate (2–2.6s linear) while generating

### 3.2 Reusable components (design system)

Rebuild the prototype as these primitives (framework-agnostic names):

- `AppChrome` — frameless window frame: NORDTONE wordmark + MD-90 badge + subtitle + status LED/label + custom min/□/× window buttons. Draggable region. Corner screws.
- `Panel` — the raised charcoal face (screws optional).
- `InsetPanel` — recessed `#1d1e21` sub-panel with a `LABEL` header + optional status pill.
- `Lcd` — amber-on-black readout well; variants: single line, multiline (with blinking cursor), big-counter (tape counter), tag-chips.
- `HardwareButton` — raised metal key with travel; variants: default, active/lit, wide.
- `SegmentedControl` — the C60/C90/C120 selector (lit = amber-inset with corner LED).
- `ToggleSwitch` — LOCAL ↔ ELEVENLABS rocker.
- `Led` — green (ok) / amber (busy, blinking) / off.
- `CassetteBay` — the cassette graphic: label header, title, reel window with two conic-gradient reels (spin when active), shell screws.
- `StageList` — the PROGRESS SEQUENCE rows (LED + label + VT323 status) for the five generation stages.
- `TransportStrip` — bottom bar: status LCD + primary action button (REC / STOP / PRINT). *(The design's VU meters were dropped — see §3.5.)*
- `ModalWindow` — a smaller hardware module overlaying the dimmed faceplate: label header, × close key, DONE key. Hosts the editor windows (§3.5).
- `ShowFormat` — the granular show-definition controls (§3.5): host-personality preset keys with a persona LCD readout, talk-amount selector, era-news toggle. Lives inside an editor window.
- `JCard` — the unfolded, print-scaled inlay (front art panel, dashed fold + spine, two-column tracklist flap, credits). The mockup's credit line ("SCRIPT BY CLAUDE") is rendered dynamically from the configured provider/model — e.g. "SCRIPT BY GPT-4O" or "SCRIPT BY LLAMA 3 (LOCAL)".

### 3.3 Screens

1. **Setup** (`1a`) — SOURCE LIBRARY slot (path + track count/size + BROWSE + INDEXED led), TONIGHT'S MUSIC and SHOW FORMAT **summary panels** (LCD summary of the current choices + EDIT key bottom-right, opening editor windows — §3.5), CASSETTE BAY, TAPE LENGTH segmented control + "45:00 PER SIDE" readout, transport strip with **REC · COMPOSE SHOW**. The host-voice engine toggle lives inside the SHOW FORMAT editor with the rest of the host settings.
2. **Generation** (`1b`) — PROGRAM SEQUENCE stage LEDs (Scan → Select → Write Script → Voice → Mix), SCRIPT MONITOR (streams the DJ script live), spinning CASSETTE BAY, TAPE COUNTER (`00:17:26 / 45:00` + progress bar), transport strip with **STOP · CANCEL** and a "now fitting / duck / crossfade" status line.
3. **J-card** (`1c`) — the unfolded inlay in a paper tray, OUTPUT list (`side-a.wav`, `side-b.wav`, `jcard.pdf`), **PRINT J-CARD / EXPORT PDF / REVEAL AUDIO FILES**, and a FIT REPORT (side slack, LUFS, ducking events).
4. **Settings** (new — flagged in the transcript as the likely next screen) — **AI provider picker** (provider + model + API key, or Ollama/custom endpoint URL for local models) and ElevenLabs key, all secrets stored in the OS keychain; local voice model management; default tape length; output folder; loudness target; **FACEPLATE theme selector** (§3.4). Styled to match (inset panels + LCD fields).

### 3.4 Theming

The app is themeable from day one. A theme is a complete "faceplate" for the hardware: every component consumes only **semantic design tokens** (CSS custom properties), and a theme is a file that assigns values to those tokens. No component ever references a raw color.

**Mechanics**
- Tokens are defined per-theme in `design-system/themes/*.css`, applied by setting `data-theme` on the document root; switching is instant (no reload) with a short cross-fade.
- Token roles (superset of §3.1): `panel-face`, `panel-inset`, `lcd-bg`, `lcd-fg`, `lcd-fg-dim`, `lcd-glow`, `accent`, `accent-badge`, `metal-btn`, `btn-drop`, `btn-active-bg`, `btn-active-fg`, `rec-btn`, `rec-drop`, `led-ok`, `led-busy`, `led-off`, `text-hi`, `text-mut`, `wordmark`, `screw`, plus the signature shadow groups — light-face themes flip the inset/emboss shadow directions (dark text-shadows become light, `0 -1px` embossing becomes `0 1px`), so shadows are tokens too, not hard-coded.
- Semantics stay stable across themes: `led-ok` is always green, `led-busy` always blinks warm, and paper goods (cassette label, J-card tracklist) stay print-cream. What changes is the *hardware*: faceplate metal/plastic, LCD phosphor color, accent, and the REC button's color.
- The selected theme persists in settings; an optional "follow OS appearance" mode maps light OS → the chosen light theme, dark OS → charcoal.
- The **J-card** front panel accent line and highlight colors follow the active theme, so the printed inlay matches the tape's "hardware" (the paper/tracklist side stays print-black-on-cream in every theme).

**Built-in themes** (values from the design source)

| Token role | `charcoal` (default, 1a–1c) | `cream` (1d) | `grey` (1e) |
|---|---|---|---|
| Faceplate | `#45484e→#33353a→#2a2c30→#242629` | `#f4efe3→#e9e2d1→#ddd5c2` | `#e6e9ee→#d5dae1→#c4cad3` |
| Wordmark | `#d8d4ca` (dark-embossed) | `#5c554a` (light-embossed) | `#4b5158` (light-embossed) |
| Badge / accent | amber `#ffc36b→#f09a2e` | orange `#f07a2e→#d05a12` | signal blue `#3d7bf5→#2356c9` |
| LCD | `#0e0b06→#1a130a`, text `#ffb14e` | `#171310→#241c14`, text `#ff9b4a` | `#0d1219→#141d2a`, text `#7fb2ff` |
| Buttons | `#4c4f55→#33353a`, drop `#1a1b1e` | `#fbf7ee→#e4dcc9`, drop `#b8ae99` | `#f2f4f7→#d8dde4`, drop `#9aa2ad` |
| Active key | `#3a3226→#2b2115`, text `#ffd9a0` | `#f4e3d2→#ecd2b8`, text `#d05a12` | `#dbe6fb→#c4d6f6`, text `#2356c9` |
| REC button | red `#ff7a70→#c0392b→#8e2418` | orange `#ff9557→#e2621a→#a8430c` | blue `#6e9bff→#2b62d9→#183e96` |
| Mood (from the design) | night-radio charcoal & amber | "quiet Scandinavian desk object — warm paper, bakelite, one orange accent" | "lab-instrument cool — Dieter Rams greys, ice-blue displays, clinical calm" |

The 1d/1e studies only cover a subset of the UI, so building them as full themes means **extrapolating the missing token values in each study's spirit** (e.g. cream's inset panels, grey's paper tray); those extrapolations should be reviewed against the studies' mood lines above. Third-party/user themes are out of scope for v1, but the token architecture leaves the door open (a theme is just a CSS file).

### 3.5 Deliberate deltas from the handoff design

Two changes were decided after the handoff and supersede the mockups:

**VU meters removed.** The design's analog VU meters were decorative — they never carried information the tape counter and progress bar don't already show. The transport strip is now status LCD + primary action button; the `vuwig` animations and `--vu-*` tokens are gone. (If a themed VU ever earns its place — e.g. true level metering during a Phase 5 preview-render — it can return as a component, but it is not planned.)

**SHOW FORMAT panel added (Setup), and "TONIGHT'S VIBE" renamed "TONIGHT'S MUSIC".** A free-text field alone assumes the user is comfortable prompting; the rename makes its job obvious, and a structured panel beside it gives non-prompters granular, discoverable controls that the app composes into the LLM prompts (§6). The guiding rule is **presets assist, free text wins**: every structured control only ever writes into editable text, and hand-edited text deselects the preset and reaches the LLM verbatim — the panel must never cap what a skilled prompter can express.

- **HOST PERSONALITY** — one-press preset keys, each mapping to a persona description shown on an LCD readout: e.g. *WARM FM* ("warm, unhurried, stories between songs"), *TOP-40 HYPE* ("fast, bright, countdown energy"), *DRY WIT* ("laconic, deadpan, one-liners"), *MIDNIGHT JAZZ* ("velvet, slow, after-hours"). The persona line is editable text; editing it releases the preset key.
- **TALK AMOUNT** — MINIMAL / BALANCED / CHATTY, controlling link frequency and length (and feeding the fit solver's time budget for speech).
- **ERA NEWS** — on/off toggle for the "news items from the era of the music" segments.

TONIGHT'S MUSIC describes the *music*; SHOW FORMAT shapes the *host and script*. Both are merged by the prompt builder, so a novice gets a great show having typed nothing but a genre, while a prompter can write exactly what they want in either field.

**Editor windows instead of inline panels.** TONIGHT'S MUSIC and SHOW FORMAT appear on the main faceplate as compact **summary panels** — an LCD readout of what's currently chosen plus an EDIT key — and editing happens in a **modal hardware module** (`ModalWindow`) over the dimmed faceplate. Two reasons:

- The main view stays stable: controls can be added, removed, or reorganized inside an editor without rebalancing the faceplate layout every time.
- Editor contents can be **dynamic**: options adapt to context — the SHOW FORMAT editor already holds the host-voice engine toggle (LOCAL/ELEVENLABS) alongside the persona controls, so engine-specific voice options (ElevenLabs voice picker and style settings vs. local Piper voice-model list) appear right there when Phase 4 lands, and future provider-specific knobs follow the same pattern without touching the main screen.

---

## 4. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Frontend  (Tauri webview)                                     │
│  Svelte + TypeScript + Vite                                    │
│  ├─ design-system/  (tokens, themes/, components)              │
│  ├─ screens/  Setup · Generation · JCard · Settings            │
│  ├─ state store (app state machine)                            │
│  └─ ipc.ts  (typed wrappers over invoke() + event listeners)   │
└───────────────▲───────────────────────────┬──────────────────┘
        Tauri events (progress,             │  invoke() commands
        script tokens, mix progress)        ▼
┌──────────────────────────────────────────────────────────────┐
│  Core  (Rust)                                                  │
│  ├─ library    scan folder, read tags/duration, feature probe │
│  │             → SQLite index (sqlx/rusqlite)                  │
│  ├─ ai         provider-agnostic LLM client (genai): user-    │
│  │             selected provider/model, streaming, retries    │
│  ├─ selection  via `ai`: pick + sequence tracks to fit side   │
│  ├─ script     via `ai`: DJ script (cold open, links, news,   │
│  │             flip reminder, sign-off) → timed segments      │
│  ├─ tts        Piper (local, bundled) | ElevenLabs (HTTP)     │
│  ├─ mix        decode → LUFS-normalize → crossfade → duck →   │
│  │             fit-to-side → WAV encode  (per side)           │
│  ├─ jcard      render J-card → PDF / print                    │
│  ├─ keys       OS keychain (keyring crate)                    │
│  └─ jobs       async task orchestration + cancellation +      │
│                progress events                                │
└──────────────────────────────────────────────────────────────┘
```

### 4.1 Frontend stack

- **Svelte + TypeScript + Vite.** Chosen over React to keep the bundle small (matches Tauri's lightweight ethos) and because the UI is highly visual/stateful with little need for a large ecosystem. *(If the team strongly prefers React, it substitutes cleanly — the design-system + IPC layer is framework-neutral.)*
- CSS design tokens as documented in §3.1; components as §3.2. No CSS framework — the look is bespoke.
- SVG/CSS for the cassette reels (ported from the prototype).
- A small **app state machine**: `Setup → Composing → Complete`, plus `error` and `cancelled`. Drives which screen renders and what the transport button does.

### 4.2 Backend stack (Rust crates)

| Concern | Crate(s) |
|---|---|
| Tauri shell, IPC, events, dialog, fs, shell-open | `tauri` 2 + official plugins |
| Music tag/metadata + duration | `lofty` |
| Audio decode (mp3/flac/aac/ogg/wav/m4a) | `symphonia` |
| Loudness measurement (EBU R128 / LUFS) | `ebur128` |
| Resampling | `rubato` |
| WAV encode | `hound` |
| Library index DB | `rusqlite` (bundled SQLite) or `sqlx` |
| LLM client (multi-provider) | `genai` — one chat API across Anthropic, OpenAI, Gemini, Groq, xAI, DeepSeek, Cohere, and Ollama (local models); supports streaming and structured/JSON output. Custom OpenAI-compatible base URLs cover self-hosted/other providers. |
| Local TTS | **Piper** (bundled binary + voice model) invoked as a sidecar, or `sherpa-rs` bindings |
| Secret storage | `keyring` (macOS Keychain / Windows Credential Manager / libsecret) |
| PDF (fallback path) | `printpdf` or Typst; primary path is webview print-to-PDF |
| Async orchestration | `tokio` + cancellation tokens |

---

## 5. The hard part: the audio mix engine

This is the core technical risk and the piece that makes it "a show, not a playlist." Pipeline per side:

1. **Decode** every selected track and the host voice segments to `f32` PCM at a common sample rate (48 kHz stereo) via `symphonia` + `rubato`.
2. **Loudness-normalize** each track to a shared target using `ebur128` integrated loudness, so nothing jumps in volume (design says **−16 LUFS**; expose as a setting).
3. **Sequence & place** on a side timeline: track → crossfade → track, with host links positioned to start over a song's intro or in the gap.
4. **Duck** the music under host speech: sidechain-style gain reduction (design shows **−9 dB** duck) with smooth attack/release around each spoken segment.
5. **Crossfade** between tracks (design shows **~1.8 s** equal-power crossfades).
6. **Fit to side**: total side runtime must be ≤ side length with minimal slack (design targets ~9–22 s slack). This is a **bin-packing / sequencing problem** — see §6.
7. **Limit / true-peak guard**, then **encode** to `side-a.wav` / `side-b.wav` with `hound`.
8. Emit **elapsed time / progress** events during the mix so the tape counter and progress bar reflect real render progress.

**Fit report** (J-card screen) is a by-product: per-side slack, measured integrated loudness, and count of ducking events.

**Risk mitigation:** prototype the decode→normalize→concat→WAV path in isolation (Phase 5a) before adding ducking/crossfade/fit. Keep an option to **shell out to a bundled `ffmpeg`** for decode/encode if `symphonia` coverage of a user's formats proves insufficient.

---

## 6. AI integration (vendor-agnostic)

All LLM access goes through a single `ai` module built on the **`genai`** crate, so the rest of the app never touches a provider SDK directly. The user chooses their provider and model in Settings:

- **Cloud:** Anthropic, OpenAI, Google Gemini, Groq, xAI, DeepSeek, Cohere — with their own API key.
- **Local:** Ollama (no key, fully offline showmaking with local TTS).
- **Anything else:** a custom OpenAI-compatible base URL + key.

The `ai` module owns provider/model config, key retrieval from the keychain, streaming, retries/backoff, and a **capability shim**: structured output is requested via native JSON mode where the provider supports it, and falls back to prompt-enforced JSON + parse-and-repair where it doesn't, so both calls below behave identically on every provider. A "test connection" action in Settings validates the chosen provider/model before composing.

A **prompt builder** sits in front of both calls: it merges the free-text TONIGHT'S MUSIC field with the structured SHOW FORMAT settings (§3.5 — host persona, talk amount, era news) into the system/user prompts, so casual users get well-formed prompts without writing them, and user-written text is always passed through verbatim (§3.5's "presets assist, free text wins"). Talk amount also sets the speech-time budget handed to the fit solver.

Two distinct LLM calls, both using the user's configured provider:

1. **Track selection & sequencing.** Input: the vibe prompt + a compact digest of the indexed library (artist, title, duration, tags/features) + target side length and count. Output (via **structured JSON** through the capability shim): an ordered tracklist per side with durations that fit, plus where host links go. Model must respect the total-time budget; the app validates and, if over/under, re-prompts or applies the fit solver in §5.6.
2. **DJ script writing.** Input: the chosen sequence + era/artist context. Output: timed script segments — cold open, inter-song links (artist stories, era news), the **Side A flip reminder**, and the **Side B sign-off** — each tagged with which track it precedes/overlaps and an estimated spoken duration. **Stream** the response so the SCRIPT MONITOR fills live (matches the design's streaming LCD + blinking cursor).

Spoken-duration estimates feed back into the fit solver so voice + music together still fit the side.

---

## 7. Phased delivery

Each phase is independently demoable. **MVP milestone = end of Phase 5.**

### Phase 0 — Scaffold & design foundation
- Tauri 2 + Svelte + TS + Vite project; frameless window (`decorations: false`), custom `AppChrome` with working min/max/close + drag region.
- Bundle the three fonts locally; establish the **semantic token + theme architecture** (§3.4) with the charcoal theme as the only theme yet, and port the keyframe animations.
- CI: build + typecheck + `cargo clippy`/`fmt` on macOS/Windows/Linux.
- **Demo:** empty charcoal window with real custom chrome and correct fonts/colors.

### Phase 1 — Static UI shell (the design, pixel-perfect)
- Build every component in §3.2 and all four screens with **mocked data** and the design's animations (reels, blinking cursors, stage LEDs), including the SHOW FORMAT panel (§3.5). Components consume semantic tokens only — theme-readiness is enforced here, while only charcoal exists.
- Screen navigation wired to the app state machine (fake transitions).
- **Demo:** the full flow clickable end-to-end, visually indistinguishable from `MD-90 App.dc.html`. *(This alone satisfies the original "static hi-fi mockups" fidelity bar.)*

### Phase 2 — Library indexing
- Folder picker (Tauri dialog); recursive scan with `lofty` for tags + duration; store in SQLite; show real path, track count, total size, INDEXED led.
- Incremental re-scan; progress feedback; handle unreadable/unsupported files gracefully.
- **Demo:** point at a real folder → accurate "N tracks · X GB · INDEXED".

### Phase 3 — AI selection + script
- Settings screen with the AI provider picker (provider, model, key or Ollama/custom endpoint) — secrets stored via `keyring` — plus a "test connection" check.
- The `ai` module (`genai` wrapper, streaming, retries, structured-output capability shim).
- Track selection/sequencing call (§6.1) → populates the tracklist that fits the side.
- Script writing call (§6.2) **streamed** into the SCRIPT MONITOR; stage LEDs advance for real.
- **Demo:** vibe prompt → a real, fitted tracklist + a live-written DJ script.

### Phase 4 — Text-to-speech
- Bundle **Piper** + a default warm voice ("VESLA" persona) as the free local option; run as a sidecar, render script segments to audio.
- ElevenLabs HTTP path behind the toggle (key in keychain); voice preview button.
- **Demo:** the written script is spoken; toggle switches voice engines.

### Phase 5 — Audio mix engine  ⟶ **MVP**
- Implement §5 in stages: 5a decode+normalize+concat+WAV; 5b crossfades; 5c ducking; 5d fit-to-side solver.
- Drive the tape counter + progress bar from real render-progress events; STOP cancels the job cleanly.
- Output `side-a.wav` / `side-b.wav`; compute fit-report metrics.
- **Demo:** folder + vibe + C90 → two playable WAVs, each fitting a side, host ducked over intros. **This is the first fully working tape.**

### Phase 6 — J-card & output
- Render the J-card (§3.2 `JCard`) from real show data; **print** and **export PDF** (webview print-to-PDF primary; `printpdf` fallback); REVEAL audio files in OS file manager.
- FIT REPORT populated from Phase 5 metrics.
- **Demo:** print/export a correct J-card matching the finished tape.

### Phase 7 — Polish, theming, packaging, release
- **Alternate themes**: build `cream` (1d) and `grey` (1e) as full themes per §3.4 (extrapolating the studies to full token coverage), add the FACEPLATE selector to Settings with instant switch, persistence, and optional follow-OS-appearance; theme the J-card accent.
- Error/empty/edge states for every screen (no key, tiny library, generation failure, format unsupported, disk full).
- Persistence of settings/last session; optional re-generate.
- **Packaging & signing:** macOS `.dmg` (signed + **notarized**), Windows `.msi`/NSIS (signed), Linux AppImage + `.deb`. Auto-update via Tauri updater.
- Accessibility pass (focus order, ARIA on the custom controls, reduced-motion honoring the reel animation), performance pass (large libraries, mix throughput).
- **Demo:** installable, signed builds on all three platforms.

---

## 8. Cross-platform & packaging notes

- **Frameless chrome** is per-OS: implement drag regions and window controls for macOS/Windows/Linux; respect platform conventions (traffic-light spacing on macOS if desired, or keep the unified hardware chrome everywhere — the design intends the latter).
- **Piper/ffmpeg sidecars** must be bundled per-arch (x64 + arm64) and declared as Tauri external binaries.
- **Signing:** Apple Developer ID + notarization; Windows Authenticode; Linux unsigned AppImage/deb. Document the CI secrets required.
- **Keychain** backends differ (Keychain / Credential Manager / libsecret) — `keyring` abstracts these; Linux needs a Secret Service provider present.

---

## 9. Testing strategy

- **Rust unit tests** for: fit-to-side solver (fixtures with known optimal packings), LUFS normalization (golden PCM), tag reading, keychain round-trip (mocked).
- **Golden-audio tests**: fixed inputs → assert output duration ≤ side length, integrated loudness within ±0.5 LUFS of target, expected ducking-event count.
- **Frontend component tests** (Vitest) + visual-regression snapshots of each screen **per theme** (charcoal validated against 1a–1c; cream/grey against the 1d/1e studies where they overlap). A lint/test guard fails on raw color literals in components — everything must go through semantic tokens.
- **E2E smoke** (Tauri driver / WebDriver): folder → compose → outputs exist, on each OS in CI.

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Audio format coverage in `symphonia` | Bundle `ffmpeg` sidecar as decode/encode fallback. |
| LLM time-budget accuracy (over/under-fit) | Deterministic fit solver validates & repairs the AI's sequence; re-prompt on gross miss. |
| Capability variance across providers (structured output, context size, small local models) | Capability shim (§6) + JSON parse-and-repair; chunk the library digest to fit smaller context windows; document recommended models. |
| Local TTS quality/size | Piper default; ElevenLabs for premium; make voice models downloadable rather than all-bundled. |
| Mix performance on large libraries | Index/feature-probe incrementally; mix only selected tracks; stream progress; run off the UI thread. |
| Signing/notarization friction | Set up signing in CI early (Phase 7 spike can start in Phase 0). |

## 11. Repository layout (proposed)

```
/                     Tauri project root
├─ src/               Svelte frontend
│  ├─ design-system/  tokens.css, themes/{charcoal,cream,grey}.css, components/*.svelte
│  ├─ screens/        Setup, Generation, JCard, Settings
│  ├─ lib/            store.ts (state machine), ipc.ts
│  └─ assets/fonts/   VT323, Barlow, Barlow Condensed (.woff2)
├─ src-tauri/
│  ├─ src/            library/ ai/ selection/ script/ tts/ mix/ jcard/ keys/ jobs/
│  ├─ binaries/       piper, ffmpeg sidecars (per-arch)
│  └─ tauri.conf.json
├─ tests/
└─ design/            copies of the handoff HTML for reference
```

---

## 12. Immediate next steps (on plan approval)

1. Scaffold Phase 0 (Tauri + Svelte + custom chrome + tokens/fonts).
2. Build Phase 1 static UI to pixel-match `MD-90 App.dc.html` — the fastest way to a shareable, verifiable artifact.
3. Spike the Phase 5a audio path (decode → −16 LUFS → concat → WAV) in parallel, since it carries the most technical risk.
