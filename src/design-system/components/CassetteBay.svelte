<script lang="ts">
  export let title = 'Neon Rain Drivetime';
  export let side = 'SIDE A';
  export let spinning = false;
</script>

<div class="bay">
  <div class="shell">
    <div class="label">
      <div class="strip">
        <div>NORDTONE MD-90</div>
        <div>{side}</div>
      </div>
      <div class="title">{title}</div>
      <div class="window">
        <div class="reel left" class:spinning style={spinning ? 'animation-duration:2.6s' : ''}></div>
        <div class="tape"></div>
        <div class="reel right" class:spinning style={spinning ? 'animation-duration:2s' : ''}></div>
      </div>
    </div>
    <div class="shell-screws">
      <div class="hole"></div>
      <div class="hole"></div>
      <div class="hole"></div>
      <div class="hole"></div>
    </div>
  </div>
</div>

<style>
  .bay {
    background: var(--panel-inset);
    border-radius: 10px;
    box-shadow: var(--panel-inset-shadow);
    padding: 16px;
    display: grid;
    place-items: center;
  }
  .shell {
    position: relative;
    width: 100%;
    height: 214px;
    border-radius: 10px;
    background: linear-gradient(180deg, #35373c, #232529);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  .label {
    position: absolute;
    top: 12px;
    left: 14px;
    right: 14px;
    height: 136px;
    border-radius: 5px;
    background: var(--paper-label);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  }
  .strip {
    height: 26px;
    border-radius: 5px 5px 0 0;
    background: var(--accent-badge);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font: 700 12px var(--font-label);
    letter-spacing: 2px;
    color: #3a2708;
  }
  .title {
    padding: 8px 12px 0;
    font: 20px var(--font-lcd);
    color: var(--paper-ink);
  }
  .window {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    width: 236px;
    height: 62px;
    border-radius: 31px;
    background: #0d0d0f;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.9), 0 0 0 3px #c9c0aa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
  }
  .reel {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: repeating-conic-gradient(#e8e4da 0deg 26deg, #17181a 26deg 60deg);
  }
  /* Full left reel, near-empty right reel: the pack rings differ. */
  .reel.left {
    box-shadow: 0 0 0 3px #0c0c0e, 0 0 0 17px #241d16, 0 0 0 18px #141416;
  }
  .reel.right {
    box-shadow: 0 0 0 3px #0c0c0e, 0 0 0 7px #241d16, 0 0 0 8px #141416;
  }
  .spinning {
    animation: reelspin 2.6s linear infinite;
  }
  .tape {
    width: 70px;
    height: 8px;
    background: linear-gradient(180deg, #3b2f22, #241a10);
    border-radius: 2px;
  }
  .shell-screws {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 26px;
  }
  .hole {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #101113;
    box-shadow: inset 0 1px 2px #000;
  }
</style>
