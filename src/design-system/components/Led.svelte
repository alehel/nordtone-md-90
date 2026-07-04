<script lang="ts">
  export let state: 'ok' | 'busy' | 'off' = 'ok';
  export let size = 7;
</script>

<div
  class="led {state}"
  style="width:{size}px;height:{size}px"
></div>

<style>
  .led {
    border-radius: 50%;
    flex: none;
  }
  .ok {
    background: var(--led-ok);
    box-shadow: 0 0 6px var(--led-ok-glow);
  }
  .busy {
    background: var(--led-busy);
    box-shadow: 0 0 8px var(--led-busy-glow);
    animation: ledblink 1.4s infinite;
  }
  .off {
    background: var(--led-off);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.7);
  }
</style>
