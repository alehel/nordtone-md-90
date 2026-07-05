<script lang="ts">
  /** Editor dialog (IMPLEMENTATION_PLAN §3.5). */
  import { createEventDispatcher } from 'svelte';
  import HardwareButton from './HardwareButton.svelte';

  export let label = '';
  export let width = 640;

  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={onKey} />

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="backdrop" on:mousedown|self={close}>
  <div class="dialog" role="dialog" aria-modal="true" aria-label={label} style="width:{width}px">
    <div class="head">
      <div class="title">{label}</div>
      <button class="close" title="Close" on:click={close}>×</button>
    </div>
    <div class="body">
      <slot />
    </div>
    <div class="foot">
      <HardwareButton accent on:click={close}>Done</HardwareButton>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(5, 6, 8, 0.6);
    display: grid;
    place-items: center;
  }
  .dialog {
    max-width: calc(100vw - 48px);
    max-height: calc(100vh - 48px);
    overflow: auto;
    border-radius: 12px;
    background: var(--overlay-bg);
    border: 1px solid var(--window-border);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px 12px;
    border-bottom: 1px solid var(--window-border);
  }
  .title {
    font: 600 15px var(--font-ui);
    color: var(--text-hi);
  }
  .close {
    width: 26px;
    height: 22px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--text-dim);
    font: 500 15px var(--font-ui);
    cursor: pointer;
    padding: 0;
  }
  .close:hover {
    background: var(--btn-bg);
    color: var(--text-hi);
  }
  .body {
    padding: 16px 18px 0;
  }
  .foot {
    display: flex;
    justify-content: flex-end;
    padding: 16px 18px;
  }
</style>
