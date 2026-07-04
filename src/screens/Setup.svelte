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
  import {
    vibe,
    tape,
    premiumVoice,
    hostPreset,
    persona,
    talkLevel,
    eraNews,
    applyHostPreset,
    startCompose,
    openSettings,
  } from '../lib/store';
  import { LIBRARY, DEFAULT_VIBE, VIBE_CHIPS, SHOW_TITLE, TAPES, HOST_PRESETS, TALK_LEVELS } from '../lib/mock';

  if (!$vibe) vibe.set(DEFAULT_VIBE);
  $: selected = TAPES.find((t) => t.id === $tape) ?? TAPES[1];
</script>

<Panel>
  <AppChrome led="ok" ledLabel="PWR" onSettings={openSettings} />

  <div class="main">
    <div class="col">
      <InsetPanel label="SOURCE LIBRARY">
        <div slot="right" class="pill"><Led state="ok" /><span>INDEXED</span></div>
        <div class="src-row">
          <Lcd grow>{LIBRARY.path} — {LIBRARY.tracks.toLocaleString('en-US')} tracks · {LIBRARY.size}</Lcd>
          <HardwareButton>BROWSE…</HardwareButton>
        </div>
      </InsetPanel>

      <InsetPanel label="TONIGHT'S VIBE" grow>
        <div slot="right" class="hint">THE MUSIC — DESCRIBE THE SHOW</div>
        <div class="vibe-well">
          <textarea bind:value={$vibe} spellcheck="false" aria-label="Tonight's vibe"></textarea>
        </div>
        <div class="chips">
          {#each VIBE_CHIPS as chip}
            <button class="chip" on:click={() => vibe.update((v) => (v ? v + ' · ' + chip : chip))}>{chip}</button>
          {/each}
        </div>
      </InsetPanel>

      <InsetPanel label="SHOW FORMAT">
        <div slot="right" class="hint">THE HOST — NO PROMPTING NEEDED</div>
        <div class="field-label">HOST PERSONALITY</div>
        <div class="presets">
          {#each HOST_PRESETS as p}
            <HardwareButton active={$hostPreset === p.id} on:click={() => applyHostPreset(p.id)}>
              {p.label}
            </HardwareButton>
          {/each}
        </div>
        <div class="persona-well">
          <input bind:value={$persona} spellcheck="false" aria-label="Host persona" />
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
      </InsetPanel>
    </div>

    <div class="col">
      <CassetteBay title={SHOW_TITLE} spinning={false} />

      <div class="pair">
        <InsetPanel label="TAPE LENGTH">
          <div class="tapes">
            {#each TAPES as t}
              <HardwareButton active={$tape === t.id} on:click={() => tape.set(t.id)}>{t.id}</HardwareButton>
            {/each}
          </div>
          <div class="readout"><Lcd size="md" center>{selected.perSide} PER SIDE</Lcd></div>
        </InsetPanel>
        <InsetPanel label="HOST VOICE">
          <ToggleSwitch bind:value={$premiumVoice} />
          <div class="readout">
            <Lcd size="md" center>{$premiumVoice ? '"VESLA" · WARM FM' : 'LOCAL · "PIPER NB"'}</Lcd>
          </div>
        </InsetPanel>
      </div>
    </div>
  </div>

  <TransportStrip>
    <svelte:fragment slot="status">
      <Lcd size="lg">
        READY · {selected.id} · 2 × {selected.perSide} · EST. {selected.est} TRACKS + HOST LINKS<br />
        <span class="dim">YOUR FILES · YOUR KEYS · YOUR TAPE</span>
      </Lcd>
    </svelte:fragment>
    <svelte:fragment slot="action">
      <RoundButton variant="rec" on:click={startCompose} />
      <div class="caption">COMPOSE SHOW</div>
    </svelte:fragment>
  </TransportStrip>
</Panel>

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
  .hint {
    font: 500 10px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--text-mut3);
  }
  .src-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .src-row :global(.lcd) {
    white-space: nowrap;
  }
  .vibe-well {
    flex: 1;
    display: flex;
    min-height: 112px;
    background: var(--lcd-bg);
    border-radius: 6px;
    box-shadow: var(--lcd-shadow);
    padding: 12px 14px;
  }
  textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font: 19px/1.45 var(--font-lcd);
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
  .field-label {
    font: 600 10px var(--font-label);
    letter-spacing: 2px;
    color: var(--text-mut3);
    margin-bottom: 6px;
  }
  .presets {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .presets :global(button) {
    padding: 7px 10px;
    font-size: 12px;
  }
  .persona-well {
    display: flex;
    margin-top: 10px;
    background: var(--lcd-bg);
    border-radius: 6px;
    box-shadow: var(--lcd-shadow);
    padding: 7px 12px;
  }
  .persona-well input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font: 17px var(--font-lcd);
    color: var(--lcd-fg);
    text-shadow: 0 0 8px var(--lcd-glow);
    caret-color: var(--lcd-fg);
  }
  .format-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    margin-top: 12px;
  }
  .format-row > div:last-child {
    padding-bottom: 2px;
  }
  .talk {
    display: flex;
    gap: 8px;
  }
  .talk :global(button) {
    padding: 7px 10px;
    font-size: 12px;
  }
  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
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
</style>
