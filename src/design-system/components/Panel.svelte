<script lang="ts">
  import Screw from './Screw.svelte';
</script>

<div class="panel">
  <div class="corner tl"><Screw angle={38} /></div>
  <div class="corner tr"><Screw angle={-24} /></div>
  <div class="corner bl"><Screw angle={64} /></div>
  <div class="corner br"><Screw angle={12} /></div>
  <slot />
</div>

<style>
  .panel {
    position: relative;
    width: 960px;
    border-radius: 16px;
    background: var(--panel-face);
    box-shadow: var(--panel-face-shadow);
    padding: 0 0 26px;
  }
  .corner {
    position: absolute;
    width: 12px;
    height: 12px;
    z-index: 2;
  }
  .tl { top: 11px; left: 11px; }
  .tr { top: 11px; right: 11px; }
  .bl { bottom: 11px; left: 11px; }
  .br { bottom: 11px; right: 11px; }
</style>
