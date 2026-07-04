<script lang="ts">
  /**
   * Analog VU meter, SVG ported from the design source.
   * mode: 'static' parks the needle at −38°; 'anim1'/'anim2' run the two
   * independent wiggle animations; Phase 5 adds a level-driven mode.
   */
  export let label = 'LEFT';
  export let mode: 'static' | 'anim1' | 'anim2' = 'static';
</script>

<svg width="150" height="86" viewBox="0 0 170 96" class="vu">
  <rect x="0" y="0" width="170" height="96" rx="6" class="face" />
  <path d="M34 46 A66 66 0 0 1 136 46" class="scale" fill="none" />
  <path d="M108 26 A66 66 0 0 1 136 46" class="hot" stroke-width="3" fill="none" />
  <line x1="39" y1="49.4" x2="31.4" y2="43" class="tick" />
  <line x1="55" y1="36" x2="50" y2="27.4" class="tick" />
  <line x1="74.6" y1="28.9" x2="72.8" y2="19" class="tick" />
  <line x1="95.4" y1="28.9" x2="97.2" y2="19" class="tick" />
  <line x1="115" y1="36" x2="120" y2="27.4" class="tick" />
  <line x1="131" y1="49.4" x2="138.6" y2="43" class="tick" />
  <text x="30" y="66" class="txt mut">−20</text>
  <text x="130" y="66" class="txt hot-txt">+3</text>
  <text x="78" y="70" class="txt vu-txt">VU</text>
  <text x="10" y="90" class="txt lab">{label}</text>
  <g class="needle {mode}"><line x1="85" y1="88" x2="85" y2="24" /></g>
  <circle cx="85" cy="88" r="5" class="hub" />
</svg>

<style>
  .vu {
    display: block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }
  .face {
    fill: var(--vu-face);
  }
  .scale,
  .tick {
    stroke: var(--vu-ink);
    stroke-width: 1.5;
  }
  .tick {
    stroke-width: 1;
  }
  .hot {
    stroke: var(--vu-hot);
  }
  .txt {
    font-family: var(--font-label);
    font-size: 11px;
  }
  .mut {
    fill: var(--vu-mut);
  }
  .hot-txt {
    fill: var(--vu-hot);
  }
  .vu-txt {
    font-weight: 700;
    font-size: 15px;
    fill: var(--paper-ink);
  }
  .lab {
    font-size: 10px;
    letter-spacing: 1px;
    fill: var(--vu-mut);
  }
  .needle line {
    stroke: #1c1c1c;
    stroke-width: 2;
  }
  .needle {
    transform-origin: 85px 88px;
  }
  .static {
    transform: rotate(-38deg);
  }
  .anim1 {
    animation: vuwig1 2.8s ease-in-out infinite;
  }
  .anim2 {
    animation: vuwig2 3.1s ease-in-out infinite;
  }
  .hub {
    fill: #1c1c1c;
  }
</style>
