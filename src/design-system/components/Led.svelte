<script lang="ts">
  export let state: 'ok' | 'busy' | 'off' = 'ok';
  export let size = 7;
</script>

<div class="led {state}" style="width:{size}px;height:{size}px"></div>

<style>
  .led {
    border-radius: 50%;
    flex: none;
  }
  .ok {
    background: var(--dot-ok);
  }
  .busy {
    background: var(--dot-busy);
    animation: blink 1.4s infinite;
  }
  .off {
    background: var(--dot-off);
  }
</style>
