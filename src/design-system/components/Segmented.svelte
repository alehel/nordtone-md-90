<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let options: { id: string; label: string }[] = [];
  export let value = '';
  const dispatch = createEventDispatcher<{ change: string }>();
</script>

<div class="seg" role="radiogroup">
  {#each options as o}
    <button role="radio" aria-checked={value === o.id} class:on={value === o.id} on:click={() => dispatch('change', o.id)}>
      {o.label}
    </button>
  {/each}
</div>

<style>
  .seg {
    display: inline-flex;
    background: var(--field-bg);
    border: 1px solid var(--field-border);
    border-radius: 9px;
    padding: 3px;
    gap: 2px;
  }
  button {
    font: 600 13px var(--font-ui);
    color: var(--text-mut);
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 6px 14px;
    cursor: pointer;
  }
  button:hover {
    color: var(--text-hi);
  }
  .on {
    background: var(--selected-bg);
    color: var(--selected-fg);
  }
</style>
