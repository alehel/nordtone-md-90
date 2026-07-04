<script lang="ts">
  /** Raised metal key with physical travel; collapses when pressed. */
  export let active = false;
  export let accent = false;
  export let block = false;
</script>

<button class="key" class:active class:accent class:block on:click>
  <slot />
  {#if active}<div class="dot"></div>{/if}
</button>

<style>
  .key {
    position: relative;
    font: 600 13px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--btn-fg);
    background: var(--btn-face);
    border: none;
    border-radius: 5px;
    box-shadow: inset 0 1px 0 var(--btn-top), 0 3px 0 var(--btn-drop), 0 4px 6px rgba(0, 0, 0, 0.5);
    padding: 9px 14px;
    cursor: pointer;
    transition: transform 0.05s, box-shadow 0.05s;
  }
  .key:active {
    transform: translateY(2px);
    box-shadow: inset 0 1px 0 var(--btn-top), 0 1px 0 var(--btn-drop), 0 2px 3px rgba(0, 0, 0, 0.5);
  }
  .active {
    color: var(--btn-active-fg);
    background: var(--btn-active-bg);
    box-shadow: var(--btn-active-shadow);
  }
  .accent {
    font-size: 14px;
    letter-spacing: 2.5px;
    color: var(--accent-badge-fg);
    background: var(--accent-badge);
    border-radius: 6px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 0 var(--accent-btn-drop),
      0 6px 10px rgba(0, 0, 0, 0.5);
    padding: 13px 14px;
  }
  .accent:active {
    transform: translateY(3px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 var(--accent-btn-drop),
      0 2px 4px rgba(0, 0, 0, 0.5);
  }
  .block {
    display: block;
    width: 100%;
    text-align: center;
  }
  .dot {
    position: absolute;
    top: 4px;
    right: 5px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent-glow);
  }
</style>
