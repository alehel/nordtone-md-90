<script lang="ts">
  /** Read-only display field (formerly the LCD well; now a flat field). */
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let cursor = false;
  export let center = false;
  export let grow = false;
  const fonts = { sm: '13px', md: '15px', lg: '15px', xl: '26px' };
</script>

<div class="field {size}" class:center class:grow style="font-size:{fonts[size]}">
  <slot />{#if cursor}<span class="caret"></span>{/if}
</div>

<style>
  .field {
    background: var(--field-bg);
    border: 1px solid var(--field-border);
    border-radius: 8px;
    padding: 10px 12px;
    font-family: var(--font-ui);
    line-height: 1.5;
    color: var(--text-hi);
    overflow: hidden;
  }
  .xl {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    padding: 6px 12px;
  }
  .center {
    text-align: center;
  }
  .grow {
    flex: 1;
  }
  .field :global(.dim) {
    color: var(--text-dim);
  }
  .field :global(.ok) {
    color: var(--ok-text);
  }
  .caret {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--accent);
    vertical-align: -0.12em;
    margin-left: 2px;
    animation: caret 1.1s steps(1) infinite;
  }
</style>
