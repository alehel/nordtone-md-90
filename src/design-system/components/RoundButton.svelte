<script lang="ts">
  /** The big round transport buttons: red REC and grey STOP. */
  export let variant: 'rec' | 'stop' = 'rec';
</script>

{#if variant === 'rec'}
  <button class="rec" on:click>
    <div class="ring">⏺ REC</div>
  </button>
{:else}
  <button class="stop" on:click>■ STOP</button>
{/if}

<style>
  button {
    border: none;
    cursor: pointer;
    padding: 0;
  }
  .rec {
    width: 86px;
    height: 86px;
    border-radius: 50%;
    background: var(--rec-btn);
    box-shadow: 0 5px 0 var(--rec-drop), 0 8px 16px rgba(0, 0, 0, 0.6),
      inset 0 2px 3px rgba(255, 255, 255, 0.35);
    display: grid;
    place-items: center;
    transition: transform 0.05s, box-shadow 0.05s;
  }
  .rec:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 var(--rec-drop), 0 4px 8px rgba(0, 0, 0, 0.6),
      inset 0 2px 3px rgba(255, 255, 255, 0.35);
  }
  .ring {
    width: 66px;
    height: 66px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18);
    display: grid;
    place-items: center;
    font: 700 15px var(--font-label);
    letter-spacing: 2px;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  .stop {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--btn-face);
    box-shadow: 0 4px 0 var(--btn-drop), 0 7px 12px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    display: grid;
    place-items: center;
    font: 700 13px var(--font-label);
    letter-spacing: 2px;
    color: var(--btn-fg);
    transition: transform 0.05s, box-shadow 0.05s;
  }
  .stop:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 var(--btn-drop), 0 4px 8px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
</style>
