<script lang="ts">
  /** Flat cassette illustration (the one intentionally playful element). */
  export let title = 'Neon Rain Drivetime';
  export let side = 'SIDE A';
  export let spinning = false;
</script>

<div class="shell">
  <div class="label">
    <div class="strip">
      <div>NORDTONE MD-90</div>
      <div>{side}</div>
    </div>
    <div class="title">{title}</div>
    <div class="window">
      <div class="reel" class:spinning style={spinning ? 'animation-duration:2.6s' : ''}></div>
      <div class="reel" class:spinning style={spinning ? 'animation-duration:2s' : ''}></div>
    </div>
  </div>
</div>

<style>
  .shell {
    position: relative;
    width: 100%;
    aspect-ratio: 1.575;
    border-radius: 8px;
    background: var(--cas-shell);
    border: 1px solid var(--cas-shell-border);
  }
  .label {
    position: absolute;
    inset: 10px 12px 26%;
    background: var(--cas-label);
    border-radius: 4px;
    overflow: hidden;
  }
  .strip {
    height: 24px;
    background: var(--cas-strip);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 9px;
    font: 700 10.5px var(--font-label);
    letter-spacing: 1.3px;
    color: var(--cas-strip-ink);
  }
  .title {
    padding: 6px 10px 0;
    font: 17px var(--font-lcd);
    color: var(--cas-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .window {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    width: 48%;
    height: 44px;
    border-radius: 22px;
    background: var(--cas-window);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
  .reel {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--cas-reel);
    outline: 6px solid var(--cas-reel-ring);
  }
  .spinning {
    animation: reelspin 2.6s linear infinite;
  }
</style>
