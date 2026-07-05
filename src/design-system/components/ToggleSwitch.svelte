<script lang="ts">
  export let left = 'Local';
  export let right = 'ElevenLabs';
  /** true = right position */
  export let value = true;
</script>

<div class="row">
  <div class="lab" class:lit={!value}>{left}</div>
  <button
    class="well"
    role="switch"
    aria-checked={value}
    aria-label="{left} / {right}"
    on:click={() => (value = !value)}
  >
    <div class="knob" class:right={value}></div>
  </button>
  <div class="lab" class:lit={value}>{right}</div>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .lab {
    font: 500 13px var(--font-ui);
    color: var(--text-dim);
  }
  .lit {
    color: var(--selected-fg);
    font-weight: 600;
  }
  .well {
    position: relative;
    width: 42px;
    height: 22px;
    border: 1px solid var(--field-border);
    border-radius: 11px;
    background: var(--field-bg);
    cursor: pointer;
    padding: 0;
  }
  .well:focus-visible {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--focus-ring);
  }
  .knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--text-mut);
    transition: left 0.15s, background 0.15s;
  }
  .knob.right {
    left: 22px;
    background: var(--accent);
  }
</style>
