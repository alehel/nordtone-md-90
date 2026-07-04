<script lang="ts">
  export let left = 'LOCAL';
  export let right = 'ELEVENLABS';
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
    gap: 10px;
  }
  .lab {
    font: 500 11px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--text-mut3);
  }
  .lit {
    color: var(--btn-active-fg);
    text-shadow: 0 0 8px var(--accent-glow);
  }
  .well {
    position: relative;
    width: 52px;
    height: 24px;
    border: none;
    border-radius: 12px;
    background: var(--switch-well);
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.07);
    cursor: pointer;
    padding: 0;
  }
  .knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--switch-knob);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transition: left 0.15s;
  }
  .knob.right {
    left: 30px;
  }
</style>
