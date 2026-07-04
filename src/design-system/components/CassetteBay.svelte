<script lang="ts">
  export let title = 'Neon Rain Drivetime';
  export let side = 'SIDE A';
  export let spinning = false;
  /** Stretch the bay to fill its column, centering the cassette in the deck. */
  export let grow = false;
</script>

<div class="bay" class:grow>
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
    <div class="trap">
      <div class="hole small"></div>
      <div class="hole"></div>
      <div class="hole"></div>
      <div class="hole small"></div>
    </div>
    <div class="corner c1"></div>
    <div class="corner c2"></div>
    <div class="corner c3"></div>
    <div class="corner c4"></div>
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
  .grow {
    flex: 1;
  }
  /* Real compact-cassette proportions: 100 × 63.5 mm ≈ 1.575:1 */
  .shell {
    position: relative;
    width: 100%;
    aspect-ratio: 1.575;
    border-radius: 10px;
    background: linear-gradient(180deg, #35373c, #232529);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  .label {
    position: absolute;
    top: 14px;
    left: 16px;
    right: 16px;
    height: 60%;
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
    bottom: 12px;
    width: 52%;
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
  /* The tape-guard trapezoid along the bottom edge, holes included. */
  .trap {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 58%;
    height: 24%;
    clip-path: polygon(14% 0, 86% 0, 100% 100%, 0 100%);
    background: linear-gradient(180deg, #2c2e33, #212327);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    padding-top: 8px;
  }
  .hole {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #101113;
    box-shadow: inset 0 1px 2px #000;
  }
  .hole.small {
    width: 6px;
    height: 6px;
  }
  .corner {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #55585e, #26282c 70%);
    box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.7);
  }
  .c1 { top: 7px; left: 7px; }
  .c2 { top: 7px; right: 7px; }
  .c3 { bottom: 7px; left: 7px; }
  .c4 { bottom: 7px; right: 7px; }
</style>
