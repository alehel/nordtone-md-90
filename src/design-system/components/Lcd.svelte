<script lang="ts">
  /** Amber-on-black readout well. */
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let cursor = false;
  export let center = false;
  export let grow = false;
  const fonts = { sm: '15px', md: '16px', lg: '18px', xl: '26px' };
</script>

<div
  class="lcd"
  class:center
  class:grow
  style="font-size:{fonts[size]}"
>
  <slot />{#if cursor}<span class="cursor"></span>{/if}
</div>

<style>
  .lcd {
    background: var(--lcd-bg);
    border-radius: 6px;
    box-shadow: var(--lcd-shadow);
    padding: 9px 12px;
    font-family: var(--font-lcd);
    line-height: 1.5;
    color: var(--lcd-fg);
    text-shadow: 0 0 8px var(--lcd-glow);
    overflow: hidden;
  }
  .center {
    text-align: center;
    padding: 5px 12px;
  }
  .grow {
    flex: 1;
  }
  .lcd :global(.dim) {
    color: var(--lcd-fg-dim);
    text-shadow: none;
  }
  .lcd :global(.ok) {
    color: var(--lcd-ok);
    text-shadow: none;
  }
  .cursor {
    display: inline-block;
    width: 10px;
    height: 1em;
    background: var(--lcd-fg);
    vertical-align: -0.15em;
    margin-left: 2px;
    animation: cursor 1.1s steps(1) infinite;
    box-shadow: 0 0 8px var(--lcd-glow);
  }
</style>
