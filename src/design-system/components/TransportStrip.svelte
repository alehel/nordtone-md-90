<script lang="ts">
  import VuMeter from './VuMeter.svelte';
  export let vuMode: 'static' | 'anim' = 'static';
</script>

<div class="strip">
  <div class="vus">
    <VuMeter label="LEFT" mode={vuMode === 'anim' ? 'anim1' : 'static'} />
    <VuMeter label="RIGHT" mode={vuMode === 'anim' ? 'anim2' : 'static'} />
  </div>
  <div class="status"><slot name="status" /></div>
  <div class="action"><slot name="action" /></div>
</div>

<style>
  .strip {
    display: flex;
    align-items: center;
    gap: 26px;
    margin: 22px 34px 0;
    padding: 16px 20px;
    background: var(--transport-bg);
    border-radius: 12px;
    box-shadow: var(--transport-shadow);
  }
  .vus {
    display: flex;
    gap: 14px;
  }
  .status {
    flex: 1;
    min-width: 0;
  }
  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .action :global(.caption) {
    font: 600 11px var(--font-label);
    letter-spacing: 2.5px;
    color: var(--text-mut);
    text-shadow: var(--emboss);
  }
</style>
