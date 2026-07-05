<script lang="ts">
  /** Standard button. `active` = selected state; `accent` = primary action. */
  export let active = false;
  export let accent = false;
  export let block = false;
</script>

<button class="btn" class:active class:accent class:block on:click>
  <slot />
</button>

<style>
  .btn {
    font: 600 13.5px var(--font-ui);
    color: var(--text-hi);
    background: var(--btn-bg);
    border: 1px solid var(--btn-border);
    border-radius: 8px;
    padding: 8px 14px;
    cursor: pointer;
  }
  .btn:hover {
    background: var(--btn-bg-hover);
  }
  .btn:focus-visible {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--focus-ring);
  }
  .active {
    background: var(--selected-bg);
    color: var(--selected-fg);
    border-color: var(--selected-border);
  }
  .accent {
    font-weight: 600;
    font-size: 15px;
    color: var(--accent-fg);
    background: var(--accent-grad);
    border: none;
    border-radius: 10px;
    padding: 12px 26px;
  }
  .accent:hover {
    filter: brightness(1.06);
    background: var(--accent-grad);
  }
  .block {
    display: block;
    width: 100%;
    text-align: center;
  }
</style>
