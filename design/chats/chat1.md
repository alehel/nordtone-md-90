# Nordtone MD-90 Cassette Radio

_Started 2026-07-04 17:45 UTC_

---

## User

NORDTONE MD-90 is a desktop app that turns your own music library into a complete radio show, made to be recorded onto a cassette. You point it at your music folder, describe a vibe ("80s synth-pop, upbeat, a little melancholy"), pick a tape length, and it produces two audio files — one per side — each fitted precisely to the tape.
What makes it a show rather than a playlist: an AI presenter hosts it. Claude selects and sequences tracks from your library to match the vibe, then writes a real DJ script — a cold open, links between songs with stories about the artists, little news items from the era of the music, a reminder to flip the tape at the end of side A, and a sign-off on side B. That script is voiced by a synthesized host (a free local voice by default, or a premium ElevenLabs voice), and everything is mixed together with proper radio craft: consistent loudness, crossfades, and the DJ talking over song intros with the music ducked underneath.

Alongside the audio, it prints a matching J-card — the folding inlay for the cassette case — with the tracklist, side durations, and credits. The whole thing runs locally on your machine with your own API keys: your files, your keys, your tape.

## Assistant

_[tool: set_project_title]_

_[tool: questions_v2]_

## Assistant

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- deliverable: Main app UI (the full desktop flow)
- aesthetic: Skeuomorphic hi-fi hardware (VU meters, brushed metal, tape reels)
- color_mood: Explore a few options
- platform: Frameless custom chrome (like a hardware device)
- flow_scope: Setup (pick folder, vibe prompt, tape length), Generation progress (script writing, mixing), J-card preview/print
- variations: One strong direction
- fidelity: Static hi-fi mockups

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_skill_prompt]_

Building the full flow now — dark-charcoal hardware direction plus two color studies to settle the mood.

_[tool: dc_write]_

_[tool: ready_for_verification]_

Full flow is up, one direction in charcoal/amber hardware:

- **1a** Setup — library slot, vibe LCD, cassette bay, C60/C90/C120, host-voice toggle, VU meters, red REC button
- **1b** Generation — stage LEDs, live script monitor, spinning reels, tape counter, animated VU needles
- **1c** J-card — print-ready unfolded inlay with fold lines, both tracklists, fit report
- **1d / 1e** Color studies: warm cream/orange and cool grey/blue

Tell me which palette to commit to, or ask for the Settings screen next.

## User

Save as standalone HTML: MD-90 App.dc.html

## Assistant

_[tool: read_file]_

_[tool: copy_files]_

_[tool: str_replace_edit]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: present_fs_item_for_download]_

Standalone file is ready above — fully self-contained (fonts and all), works offline.

