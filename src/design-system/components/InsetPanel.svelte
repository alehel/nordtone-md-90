<script lang="ts">
  /** Card — the standard content container. */
  export let label = '';
  export let grow = false;
</script>

<div class="card" class:grow>
  {#if label || $$slots.right}
    <div class="head">
      <div class="label">{label}</div>
      <slot name="right" />
    </div>
  {/if}
  <slot />
</div>

<style>
  .card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 16px;
  }
  .grow {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 9px;
  }
  .label {
    font: 600 13px var(--font-ui);
    color: var(--text-body);
  }
</style>
