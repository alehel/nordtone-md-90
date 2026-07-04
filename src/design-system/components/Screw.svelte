<script lang="ts">
  export let angle = 38;
</script>

<div class="screw">
  <div class="slot" style="transform: rotate({angle}deg)"></div>
</div>

<style>
  .screw {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--screw);
    box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.6);
  }
  .slot {
    position: absolute;
    top: 5px;
    left: 2px;
    right: 2px;
    height: 1.5px;
    background: var(--screw-slot);
  }
</style>
