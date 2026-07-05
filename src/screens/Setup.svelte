<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import Lcd from '../design-system/components/Lcd.svelte';
  import Led from '../design-system/components/Led.svelte';
  import HardwareButton from '../design-system/components/HardwareButton.svelte';
  import ToggleSwitch from '../design-system/components/ToggleSwitch.svelte';
  import CassetteBay from '../design-system/components/CassetteBay.svelte';
  import TransportStrip from '../design-system/components/TransportStrip.svelte';
  import RoundButton from '../design-system/components/RoundButton.svelte';
  import ModalWindow from '../design-system/components/ModalWindow.svelte';
  import {
    vibe,
    tape,
    customMinutes,
    tapeInfo,
    premiumVoice,
    hostPreset,
    persona,
    talkLevel,
    eraNews,
    clockSet,
    clockYear,
    clockMonth,
    clockLabel,
    editor,
    applyHostPreset,
    startCompose,
    openSettings,
  } from '../lib/store';
  import { LIBRARY, DEFAULT_VIBE, VIBE_CHIPS, SHOW_TITLE, TAPES, HOST_PRESETS, TALK_LEVELS } from '../lib/mock';

  if (!$vibe) vibe.set(DEFAULT_VIBE);
  // Hand-editing the persona line releases the preset key — free text wins.
  $: if ($hostPreset && $persona !== HOST_PRESETS.find((p) => p.id === $hostPreset)?.persona) {
    hostPreset.set(null);
  }
  $: presetLabel = HOST_PRESETS.find((p) => p.id === $hostPreset)?.label ?? 'CUSTOM HOST';

  // Month steps cycle: year-only -> JAN ... DEC -> year-only.
  function stepMonth(dir: 1 | -1) {
    clockMonth.update((m) => {
      const next = (m === null ? (dir === 1 ? 0 : 11) : m + dir);
      return next < 0 || next > 11 ? null : next;
    });
  }
</script>

<Panel>
  <AppChrome led="ok" ledLabel="PWR" onSettings={openSettings} />

  <div class="main">
    <div class="col">
      <InsetPanel label="SOURCE LIBRARY">
        <div slot="right" class="pill"><Led state="ok" /><span>INDEXED</span></div>
        <div class="edit-row">
          <Lcd grow>{LIBRARY.path} — {LIBRARY.tracks.toLocaleString('en-US')} tracks · {LIBRARY.size}</Lcd>
          <HardwareButton>BROWSE…</HardwareButton>
        </div>
      </InsetPanel>

      <InsetPanel label="TONIGHT'S MUSIC" grow>
        <div class="summary grow">
          <Lcd grow><span class="clamp">{$vibe}</span></Lcd>
          <div class="edit-line">
            <HardwareButton on:click={() => editor.set('music')}>EDIT…</HardwareButton>
          </div>
        </div>
      </InsetPanel>

      <InsetPanel label="SHOW FORMAT">
        <div class="summary">
          <Lcd>
            <span class="clamp two">{$persona}</span>
            <span class="dim">{presetLabel} · TALK: {$talkLevel} · ERA NEWS: {$eraNews ? 'ON' : 'OFF'}</span><br />
            <span class="dim">
              VOICE: {$premiumVoice ? 'ELEVENLABS · "VESLA"' : 'LOCAL · "PIPER NB"'}{$clockSet
                ? ` · CLOCK: ${$clockLabel}`
                : ''}
            </span>
          </Lcd>
          <div class="edit-line">
            <HardwareButton on:click={() => editor.set('format')}>EDIT…</HardwareButton>
          </div>
        </div>
      </InsetPanel>
    </div>

    <div class="col">
      <CassetteBay title={SHOW_TITLE} spinning={false} />
      <InsetPanel label="TAPE LENGTH">
        <div class="tapes">
          {#each TAPES as t}
            <HardwareButton active={$tape === t.id} on:click={() => tape.set(t.id)}>{t.id}</HardwareButton>
          {/each}
          <HardwareButton
            active={$tape === 'CUSTOM'}
            on:click={() => {
              tape.set('CUSTOM');
              editor.set('tape');
            }}
          >
            CUSTOM
          </HardwareButton>
        </div>
        <div class="readout"><Lcd size="md" center>{$tapeInfo.label} · {$tapeInfo.perSide} PER SIDE</Lcd></div>
      </InsetPanel>
    </div>
  </div>

  <TransportStrip>
    <svelte:fragment slot="status">
      <Lcd size="lg">
        READY · {$tapeInfo.label} · 2 × {$tapeInfo.perSide} · EST. {$tapeInfo.est} TRACKS + HOST LINKS<br />
        <span class="dim">YOUR FILES · YOUR KEYS · YOUR TAPE</span>
      </Lcd>
    </svelte:fragment>
    <svelte:fragment slot="action">
      <RoundButton variant="rec" on:click={startCompose} />
      <div class="caption">COMPOSE SHOW</div>
    </svelte:fragment>
  </TransportStrip>
</Panel>

{#if $editor === 'music'}
  <ModalWindow label="TONIGHT'S MUSIC" on:close={() => editor.set(null)}>
    <div class="hint-line">IN YOUR OWN WORDS — AS SIMPLE OR AS DETAILED AS YOU LIKE. IT GOES TO YOUR AI VERBATIM.</div>
    <div class="lcd-well tall">
      <textarea bind:value={$vibe} spellcheck="false" aria-label="Tonight's music"></textarea>
    </div>
    <div class="chips">
      {#each VIBE_CHIPS as chip}
        <button class="chip" on:click={() => vibe.update((v) => (v ? v + ' · ' + chip : chip))}>{chip}</button>
      {/each}
    </div>
  </ModalWindow>
{/if}

{#if $editor === 'format'}
  <ModalWindow label="SHOW FORMAT" on:close={() => editor.set(null)}>
    <div class="field-label">HOST PERSONALITY — PRESS A PRESET OR WRITE YOUR OWN</div>
    <div class="presets">
      {#each HOST_PRESETS as p}
        <HardwareButton active={$hostPreset === p.id} on:click={() => applyHostPreset(p.id)}>
          {p.label}
        </HardwareButton>
      {/each}
    </div>
    <div class="lcd-well">
      <textarea bind:value={$persona} spellcheck="false" aria-label="Host persona"></textarea>
    </div>
    <div class="format-row">
      <div>
        <div class="field-label">TALK AMOUNT</div>
        <div class="talk">
          {#each TALK_LEVELS as lvl}
            <HardwareButton active={$talkLevel === lvl} on:click={() => talkLevel.set(lvl)}>{lvl}</HardwareButton>
          {/each}
        </div>
      </div>
      <div>
        <div class="field-label">ERA NEWS</div>
        <ToggleSwitch left="OFF" right="ON" bind:value={$eraNews} />
      </div>
    </div>
    <div class="voice-row">
      <div>
        <div class="field-label">HOST VOICE</div>
        <ToggleSwitch bind:value={$premiumVoice} />
      </div>
      <Lcd size="md" grow center>{$premiumVoice ? '"VESLA" · WARM FM' : 'LOCAL · "PIPER NB"'}</Lcd>
    </div>
    <div class="voice-row">
      <div>
        <div class="field-label">SHOW CLOCK</div>
        <ToggleSwitch left="TODAY" right="SET" bind:value={$clockSet} />
      </div>
      {#if $clockSet}
        <div class="clock-ctl">
          <HardwareButton on:click={() => stepMonth(-1)}>◂</HardwareButton>
          <HardwareButton on:click={() => stepMonth(1)}>▸</HardwareButton>
          <Lcd size="md" grow center>{$clockLabel}</Lcd>
          <HardwareButton on:click={() => clockYear.update((y) => Math.max(1900, y - 1))}>−1</HardwareButton>
          <HardwareButton on:click={() => clockYear.update((y) => Math.min(2100, y + 1))}>+1</HardwareButton>
        </div>
      {:else}
        <Lcd size="md" grow center><span class="dim">BROADCASTS AS LIVE TODAY · ERA NEWS FOLLOWS THE MUSIC</span></Lcd>
      {/if}
    </div>
  </ModalWindow>
{/if}

{#if $editor === 'tape'}
  <ModalWindow label="CUSTOM TAPE LENGTH" width={460} on:close={() => editor.set(null)}>
    <div class="hint-line">TOTAL TAPE LENGTH — BOTH SIDES COMBINED (10–240 MIN)</div>
    <div class="stepper">
      <HardwareButton on:click={() => customMinutes.update((m) => Math.max(10, m - 5))}>−5</HardwareButton>
      <HardwareButton on:click={() => customMinutes.update((m) => Math.max(10, m - 1))}>−1</HardwareButton>
      <div class="min-well">
        <input type="number" min="10" max="240" bind:value={$customMinutes} aria-label="Total minutes" />
        <span class="unit">MIN</span>
      </div>
      <HardwareButton on:click={() => customMinutes.update((m) => Math.min(240, m + 1))}>+1</HardwareButton>
      <HardwareButton on:click={() => customMinutes.update((m) => Math.min(240, m + 5))}>+5</HardwareButton>
    </div>
    <div class="readout">
      <Lcd size="md" center>{$tapeInfo.label} · 2 × {$tapeInfo.perSide} PER SIDE · EST. {$tapeInfo.est} TRACKS</Lcd>
    </div>
  </ModalWindow>
{/if}

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 470px;
    gap: 22px;
    padding: 22px 34px 0;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 6px;
    font: 500 10px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--text-mut3);
  }
  .edit-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .summary {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .summary.grow {
    flex: 1;
  }
  .edit-line {
    display: flex;
    justify-content: flex-end;
  }
  .clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .clamp.two {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  .tapes {
    display: flex;
    gap: 8px;
  }
  .tapes :global(button) {
    flex: 1;
    padding: 9px 0;
    text-align: center;
  }
  .readout {
    margin-top: 10px;
  }

  /* Editor-window internals */
  .hint-line {
    font: 500 10px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--text-mut3);
    margin-bottom: 10px;
  }
  .field-label {
    font: 600 10px var(--font-label);
    letter-spacing: 2px;
    color: var(--text-mut3);
    margin-bottom: 6px;
  }
  .lcd-well {
    display: flex;
    min-height: 110px;
    background: var(--lcd-bg);
    border-radius: 6px;
    box-shadow: var(--lcd-shadow);
    padding: 10px 12px;
  }
  .lcd-well.tall {
    min-height: 170px;
  }
  .lcd-well textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font: 18px/1.45 var(--font-lcd);
    color: var(--lcd-fg);
    text-shadow: 0 0 8px var(--lcd-glow);
    caret-color: var(--lcd-fg);
  }
  .chips {
    margin-top: 10px;
    display: flex;
    gap: 8px;
  }
  .chip {
    font: 15px var(--font-lcd);
    color: var(--chip-fg);
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    border-radius: 99px;
    padding: 2px 12px;
    cursor: pointer;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .presets :global(button) {
    padding: 7px 10px;
    font-size: 12px;
  }
  .format-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    margin-top: 12px;
  }
  .talk {
    display: flex;
    gap: 8px;
  }
  .talk :global(button) {
    padding: 7px 10px;
    font-size: 12px;
  }
  .voice-row {
    display: flex;
    align-items: flex-end;
    gap: 18px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: var(--chrome-divider);
    box-shadow: var(--chrome-divider-glow);
  }
  .stepper {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }
  .clock-ctl {
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: stretch;
  }
  .clock-ctl :global(button) {
    padding: 7px 12px;
  }
  .min-well {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--lcd-bg);
    border-radius: 6px;
    box-shadow: var(--lcd-shadow);
    padding: 4px 14px;
  }
  .min-well input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    font: 28px var(--font-lcd);
    color: var(--lcd-fg);
    text-shadow: 0 0 8px var(--lcd-glow);
    caret-color: var(--lcd-fg);
    appearance: textfield;
    -moz-appearance: textfield;
  }
  .min-well input::-webkit-outer-spin-button,
  .min-well input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .unit {
    font: 16px var(--font-lcd);
    color: var(--lcd-fg-dim);
  }
</style>
