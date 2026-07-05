<script lang="ts">
  /**
   * Editor window (IMPLEMENTATION_PLAN §3.5): a smaller hardware module
   * overlaying the dimmed faceplate. Contents are free to change/grow
   * without affecting the main view's layout.
   */
  import { createEventDispatcher } from 'svelte';
  import HardwareButton from './HardwareButton.svelte';

  export let label = '';
  export let width = 660;

  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={onKey} />

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="backdrop" on:mousedown|self={close}>
  <div class="module" role="dialog" aria-modal="true" aria-label={label} style="width:{width}px">
    <div class="head">
      <div class="label">{label}</div>
      <button class="close" title="Close" on:click={close}>×</button>
    </div>
    <div class="body">
      <slot />
    </div>
    <div class="foot">
      <HardwareButton accent on:click={close}>DONE</HardwareButton>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(5, 6, 8, 0.62);
    display: grid;
    place-items: center;
  }
  .module {
    max-width: calc(100vw - 48px);
    max-height: calc(100vh - 48px);
    overflow: auto;
    border-radius: 12px;
    background: var(--panel-face);
    box-shadow: var(--panel-face-shadow);
    padding: 0 0 16px;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 20px 11px;
    border-bottom: var(--chrome-divider);
    box-shadow: var(--chrome-divider-glow);
  }
  .label {
    font: 600 13px var(--font-label);
    letter-spacing: 3px;
    color: var(--wordmark);
    text-shadow: var(--wordmark-emboss);
  }
  .close {
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
  .body {
    padding: 18px 20px 0;
  }
  .foot {
    display: flex;
    justify-content: flex-end;
    padding: 16px 20px 0;
  }
  .foot :global(button) {
    min-width: 140px;
  }
</style>
