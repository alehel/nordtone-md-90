<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import HardwareButton from '../design-system/components/HardwareButton.svelte';
  import Segmented from '../design-system/components/Segmented.svelte';
  import ToggleSwitch from '../design-system/components/ToggleSwitch.svelte';
  import CassetteBay from '../design-system/components/CassetteBay.svelte';
  import TransportStrip from '../design-system/components/TransportStrip.svelte';
  import ModalWindow from '../design-system/components/ModalWindow.svelte';
  import Led from '../design-system/components/Led.svelte';
  import {
    vibe,
    tape,
    customMinutes,
    tapeInfo,
    ttsEngine,
    pickVoiceIdx,
    hostPreset,
    persona,
    talkLevel,
    currentVoice,
    clockSet,
    clockYear,
    clockMonth,
    clockLabel,
    editor,
    applyHostPreset,
    startCompose,
    openSettings,
  } from '../lib/store';
  import {
    LIBRARY,
    DEFAULT_VIBE,
    VIBE_CHIPS,
    SHOW_TITLE,
    TAPES,
    HOST_PRESETS,
    TALK_LEVELS,
    VOICES,
    TTS_ENGINES,
    MONTHS,
    type TtsEngineId,
  } from '../lib/mock';

  if (!$vibe) vibe.set(DEFAULT_VIBE);

  // Hand-editing the persona line releases the preset key — free text wins.
  $: if ($hostPreset && $persona !== HOST_PRESETS.find((p) => p.id === $hostPreset)?.persona) {
    hostPreset.set(null);
  }
  $: presetLabel = HOST_PRESETS.find((p) => p.id === $hostPreset)?.label ?? 'Custom host';

  const TAPE_OPTIONS = [...TAPES.map((t) => ({ id: t.id, label: t.id })), { id: 'CUSTOM', label: 'Custom…' }];
  function pickTape(id: string) {
    tape.set(id as typeof $tape);
    if (id === 'CUSTOM') editor.set('tape');
  }

  function pickTalk(id: string) {
    talkLevel.set(id as (typeof TALK_LEVELS)[number]);
  }

  $: voiceList = VOICES[$ttsEngine];
  function pickEngine(e: Event) {
    ttsEngine.set((e.currentTarget as HTMLSelectElement).value as TtsEngineId);
  }
  function pickVoice(e: Event) {
    pickVoiceIdx(Number((e.currentTarget as HTMLSelectElement).value));
  }

  // Mock voice preview: Phase 4 replaces the timer with real TTS playback.
  let previewing = false;
  let previewTimer: ReturnType<typeof setTimeout>;
  function previewVoice() {
    clearTimeout(previewTimer);
    previewing = true;
    previewTimer = setTimeout(() => (previewing = false), 1600);
  }

  function pickMonth(e: Event) {
    const v = (e.currentTarget as HTMLSelectElement).value;
    clockMonth.set(v === '' ? null : Number(v));
  }
</script>

<Panel>
  <AppChrome onSettings={openSettings} />

  <div class="main">
    <div class="col">
      <InsetPanel label="Music library">
        <div slot="right" class="pill"><Led state="ok" /><span>Indexed</span></div>
        <div class="row">
          <input class="input" value="{LIBRARY.path} — {LIBRARY.tracks.toLocaleString('en-US')} tracks · {LIBRARY.size}" readonly />
          <HardwareButton>Browse…</HardwareButton>
        </div>
      </InsetPanel>

      <InsetPanel grow>
        <div slot="right" class="sub">in your own words — simple or detailed</div>
        <svelte:fragment>
          <div class="label-line">Tonight's music</div>
          <textarea class="input music" bind:value={$vibe} spellcheck="false" aria-label="Tonight's music"></textarea>
          <div class="chips">
            {#each VIBE_CHIPS as chip}
              <button class="chip" on:click={() => vibe.update((v) => (v ? v + ' · ' + chip : chip))}>{chip}</button>
            {/each}
          </div>
        </svelte:fragment>
      </InsetPanel>

      <InsetPanel label="The show">
        <div class="show-sum">
          Host: <b>{presetLabel}</b> — {$persona} · Talk: {$talkLevel}<br />
          Voice: {$currentVoice.engineLabel} · {$currentVoice.label} · Recorded: {$clockLabel}
        </div>
        <div class="show-edit">
          <HardwareButton on:click={() => editor.set('format')}>Edit show format…</HardwareButton>
        </div>
      </InsetPanel>
    </div>

    <div class="col">
      <InsetPanel>
        <CassetteBay title={SHOW_TITLE} spinning={false} />
        <div class="label-line" style="margin-top:14px">Tape length</div>
        <Segmented options={TAPE_OPTIONS} value={$tape} on:change={(e) => pickTape(e.detail)} />
        <div class="sub" style="margin-top:8px">
          {$tapeInfo.label} · {$tapeInfo.perSide} per side · est. {$tapeInfo.est} tracks + host links
        </div>
      </InsetPanel>
    </div>
  </div>

  <TransportStrip>
    <svelte:fragment slot="status">
      Ready · <b>{$tapeInfo.label}</b> · 2 × {$tapeInfo.perSide} · your files, your keys, your tape
    </svelte:fragment>
    <svelte:fragment slot="action">
      <HardwareButton accent on:click={startCompose}>● Record show</HardwareButton>
    </svelte:fragment>
  </TransportStrip>
</Panel>

{#if $editor === 'format'}
  <ModalWindow label="Show format" on:close={() => editor.set(null)}>
    <div class="label-line">Host personality <span class="sub">— press a preset or write your own</span></div>
    <div class="presets">
      {#each HOST_PRESETS as p}
        <HardwareButton active={$hostPreset === p.id} on:click={() => applyHostPreset(p.id)}>{p.label}</HardwareButton>
      {/each}
    </div>
    <textarea class="input persona" bind:value={$persona} spellcheck="false" aria-label="Host persona"></textarea>

    <div class="frow">
      <div>
        <div class="label-line">Talk amount</div>
        <Segmented
          options={TALK_LEVELS.map((t) => ({ id: t, label: t }))}
          value={$talkLevel}
          on:change={(e) => pickTalk(e.detail)}
        />
      </div>
    </div>

    <div class="frow divider">
      <div class="voice-grid">
        <div>
          <div class="label-line">Voice service</div>
          <select class="input" value={$ttsEngine} on:change={pickEngine} aria-label="Voice service">
            {#each TTS_ENGINES as e}
              <option value={e.id}>{e.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <div class="label-line">Host voice</div>
          <div class="voice-pick">
            <select class="input" value={String($currentVoice.idx)} on:change={pickVoice} aria-label="Voice">
              {#each voiceList as v, i}
                <option value={String(i)}>{v.label}</option>
              {/each}
            </select>
            <HardwareButton active={previewing} on:click={previewVoice}>
              {previewing ? 'Playing…' : '▶ Preview'}
            </HardwareButton>
          </div>
        </div>
      </div>
    </div>

    <div class="frow divider">
      <div>
        <div class="label-line">Recorded</div>
        <ToggleSwitch left="Today" right="Set date" bind:value={$clockSet} />
      </div>
      {#if $clockSet}
        <div class="clock-pick">
          <select class="input" value={$clockMonth === null ? '' : String($clockMonth)} on:change={pickMonth} aria-label="Month">
            <option value="">Year only</option>
            {#each MONTHS as m, i}
              <option value={String(i)}>{m}</option>
            {/each}
          </select>
          <input class="input year" type="number" min="1900" max="2100" bind:value={$clockYear} aria-label="Year" />
        </div>
      {:else}
        <div class="sub clock-note">Recorded today — whole library eligible. A set date filters the music and period-locks the host's world.</div>
      {/if}
    </div>
  </ModalWindow>
{/if}

{#if $editor === 'tape'}
  <ModalWindow label="Custom tape length" width={440} on:close={() => editor.set(null)}>
    <div class="sub" style="margin-bottom:10px">Total tape length, both sides combined (10–240 min)</div>
    <div class="stepper">
      <HardwareButton on:click={() => customMinutes.update((m) => Math.max(10, m - 5))}>−5</HardwareButton>
      <div class="min-wrap">
        <input class="input min" type="number" min="10" max="240" bind:value={$customMinutes} aria-label="Total minutes" />
        <span class="sub">min</span>
      </div>
      <HardwareButton on:click={() => customMinutes.update((m) => Math.min(240, m + 5))}>+5</HardwareButton>
    </div>
    <div class="sub" style="margin-top:10px;text-align:center">
      {$tapeInfo.label} · 2 × {$tapeInfo.perSide} per side · est. {$tapeInfo.est} tracks
    </div>
  </ModalWindow>
{/if}

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 330px;
    gap: 16px;
    padding: 18px 20px;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 6px;
    font: 500 12px var(--font-ui);
    color: var(--text-dim);
  }
  .sub {
    font: 400 12.5px/1.5 var(--font-ui);
    color: var(--text-dim);
  }
  .row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .label-line {
    font: 600 13px var(--font-ui);
    color: var(--text-body);
    margin-bottom: 7px;
  }
  .label-line .sub {
    font-weight: 400;
  }
  .music {
    min-height: 108px;
    flex: 1;
  }
  .chips {
    margin-top: 10px;
    display: flex;
    gap: 8px;
  }
  .chip {
    font: 500 12.5px var(--font-ui);
    color: var(--accent-soft-fg);
    background: var(--accent-soft-bg);
    border: 1px solid var(--accent-soft-border);
    border-radius: 99px;
    padding: 3px 12px;
    cursor: pointer;
  }
  .show-sum {
    font: 400 13px/1.6 var(--font-ui);
    color: var(--text-dim);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .show-sum b {
    color: var(--text-hi);
    font-weight: 600;
  }
  .show-edit {
    margin-top: 10px;
  }

  /* Editor internals */
  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }
  .persona {
    min-height: 84px;
  }
  .frow {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    margin-top: 14px;
  }
  .frow.divider {
    border-top: 1px solid var(--window-border);
    padding-top: 12px;
  }
  .frow > div:first-child {
    flex: none;
  }
  .voice-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
  }
  .voice-pick,
  .clock-pick {
    flex: 1;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .voice-pick select,
  .clock-pick select {
    flex: 1;
    padding: 8px 10px;
  }
  .clock-pick .year {
    width: 96px;
    flex: none;
  }
  .clock-note {
    flex: 1;
    padding-bottom: 4px;
  }
  .stepper {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .min-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .min {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
</style>
