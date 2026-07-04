<script lang="ts">
  export let label = '';
  export let grow = false;
</script>

<div class="inset" class:grow>
  {#if label || $$slots.right}
    <div class="head">
      <div class="label">{label}</div>
      <slot name="right" />
    </div>
  {/if}
  <slot />
</div>

<style>
  .inset {
    background: var(--panel-inset);
    border-radius: 10px;
    box-shadow: var(--panel-inset-shadow);
    padding: 14px 16px;
  }
  .grow {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .label {
    font: 600 11px var(--font-label);
    letter-spacing: 2.5px;
    color: var(--text-mut);
    text-shadow: var(--emboss);
  }
</style>
