<script lang="ts">
  import Led from './Led.svelte';
  import { windowMinimize, windowToggleMaximize, windowClose, windowStartDragging, isTauri } from '../../lib/ipc';

  export let subtitle = 'RADIO CASSETTE COMPOSER';
  export let led: 'ok' | 'busy' | 'off' = 'ok';
  export let ledLabel = 'PWR';
  export let onSettings: (() => void) | null = null;

  function drag(e: MouseEvent) {
    if (e.buttons === 1 && isTauri()) void windowStartDragging();
  }
</script>

<div class="chrome" on:mousedown|self={drag} role="presentation">
  <div class="wordmark" on:mousedown={drag} role="presentation">NORDTONE</div>
  <div class="badge">MD-90</div>
  <div class="subtitle" on:mousedown={drag} role="presentation">{subtitle}</div>
  <div class="spacer" on:mousedown={drag} role="presentation"></div>
  <div class="right">
    <Led state={led} />
    <div class="ledlabel">{ledLabel}</div>
    {#if onSettings}
      <button class="winbtn set" title="Settings" on:click={onSettings}>SET</button>
    {/if}
    <button class="winbtn" title="Minimize" on:click={() => windowMinimize()}>–</button>
    <button class="winbtn sq" title="Maximize" on:click={() => windowToggleMaximize()}>□</button>
    <button class="winbtn" title="Close" on:click={() => windowClose()}>×</button>
  </div>
</div>

<style>
  .chrome {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 34px 14px;
    border-bottom: var(--chrome-divider);
    box-shadow: var(--chrome-divider-glow);
  }
  .wordmark {
    font: 700 21px var(--font-label);
    letter-spacing: 5px;
    color: var(--wordmark);
    text-shadow: var(--wordmark-emboss);
  }
  .badge {
    font: 600 12px var(--font-label);
    letter-spacing: 2px;
    color: var(--accent-badge-fg);
    background: var(--accent-badge);
    padding: 2px 8px;
    border-radius: 3px;
    box-shadow: var(--accent-badge-shadow);
  }
  .subtitle {
    font: 500 11px var(--font-label);
    letter-spacing: 2.5px;
    color: var(--text-mut2);
    text-shadow: var(--emboss);
  }
  .spacer {
    flex: 1;
    align-self: stretch;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ledlabel {
    font: 500 10px var(--font-label);
    letter-spacing: 2px;
    color: var(--text-mut2);
    margin-right: 10px;
  }
  .winbtn {
    width: 22px;
    height: 16px;
    border: none;
    border-radius: 3px;
    background: var(--btn-face);
    box-shadow: inset 0 1px 0 var(--btn-top), 0 2px 3px rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    color: var(--text-mut);
    font: 600 10px var(--font-ui);
    cursor: pointer;
    padding: 0;
  }
  .winbtn:active {
    transform: translateY(1px);
  }
  .sq {
    font-size: 9px;
  }
  .set {
    width: auto;
    padding: 0 6px;
    font: 600 8px var(--font-label);
    letter-spacing: 1px;
    margin-right: 6px;
  }
</style>
