<script lang="ts">
  import Led from './Led.svelte';
  import { windowMinimize, windowToggleMaximize, windowClose, windowStartDragging, isTauri } from '../../lib/ipc';

  export let subtitle = 'Radio cassette composer';
  export let led: 'ok' | 'busy' | 'off' = 'off';
  export let onSettings: (() => void) | null = null;

  function drag(e: MouseEvent) {
    if (e.buttons === 1 && isTauri()) void windowStartDragging();
  }
</script>

<div class="chrome" on:mousedown|self={drag} role="presentation">
  <div class="wordmark" on:mousedown={drag} role="presentation">NORDTONE</div>
  <div class="badge">MD-90</div>
  <div class="subtitle" on:mousedown={drag} role="presentation">
    {#if led !== 'off'}<Led state={led} size={7} />{/if}
    {subtitle}
  </div>
  <div class="spacer" on:mousedown={drag} role="presentation"></div>
  <div class="right">
    {#if onSettings}
      <button class="ghost" on:click={onSettings}>Settings</button>
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
    gap: 12px;
    padding: 13px 20px;
    border-bottom: 1px solid var(--window-border);
  }
  .wordmark {
    font: 700 15px var(--font-label);
    letter-spacing: 3px;
    color: var(--text-hi);
  }
  .badge {
    font: 600 10.5px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--accent-fg);
    background: var(--accent-grad);
    padding: 1px 7px;
    border-radius: 3px;
  }
  .subtitle {
    display: flex;
    align-items: center;
    gap: 7px;
    font: 400 13px var(--font-ui);
    color: var(--text-dim);
  }
  .spacer {
    flex: 1;
    align-self: stretch;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ghost {
    font: 600 13px var(--font-ui);
    color: var(--accent);
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 5px 9px;
    cursor: pointer;
    margin-right: 8px;
  }
  .ghost:hover {
    background: var(--accent-soft-bg);
  }
  .winbtn {
    width: 26px;
    height: 22px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--text-dim);
    font: 500 13px var(--font-ui);
    cursor: pointer;
    padding: 0;
  }
  .winbtn:hover {
    background: var(--btn-bg);
    color: var(--text-hi);
  }
  .sq {
    font-size: 11px;
  }
</style>
