# NORDTONE MD-90

**Turn your own music library into a complete, DJ-hosted radio show — fitted precisely to a cassette, with a print-ready J-card.**

Point it at your music folder, describe a vibe ("80s synth-pop, upbeat, a little melancholy"), pick a tape length (C60/C90/C120), and the MD-90 produces two audio files — one per side — hosted by an AI presenter with real radio craft: consistent loudness, crossfades, and the DJ talking over song intros with the music ducked underneath.

**Your files · your keys · your tape.** Everything runs locally. Bring your own LLM (Anthropic, OpenAI, Gemini, Groq, Ollama, or any OpenAI-compatible endpoint) and optionally an ElevenLabs voice; a free local voice works offline.

See [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) for the full plan and [`design/`](design/) for the original Claude Design handoff.

## Status

**Phase 0–1** (of 7): Tauri scaffold + full static UI with mocked data.
The full flow is clickable — Setup → Generation (mock composer) → J-card — plus Settings, in the "quiet studio" charcoal/amber design (conventional controls; the cassette illustration and printed J-card carry the retro character). No real indexing, AI, TTS, or mixing yet.

## Development

Prerequisites: Node 20+, Rust stable, and on Linux the [Tauri system deps](https://tauri.app/start/prerequisites/) (`libwebkit2gtk-4.1-dev` etc.).

```sh
npm install
npm run dev          # frontend only, in a browser (window controls are no-ops)
npm run tauri dev    # the real frameless desktop app
npm run check        # svelte-check / typescript
npm run build        # frontend production build
npm run tauri build  # desktop bundles (packaging is finalized in Phase 7)
```

## Layout

```
src/                  Svelte frontend
  design-system/      tokens.css, themes/, components/
  screens/            Setup · Generation · JCard · Settings
  lib/                store.ts (state machine), ipc.ts, mock.ts
src-tauri/            Rust core (Tauri 2)
design/               Claude Design handoff (reference designs — read-only)
scripts/              icon generator
```
