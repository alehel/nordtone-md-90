<script lang="ts">
  import type { Track } from '../../lib/mock';
  export let title = 'NEON RAIN\nDRIVETIME';
  export let vibeLine = '80s SYNTH-POP · UPBEAT, A LITTLE MELANCHOLY';
  export let tapeLabel = 'C90';
  export let date = '04.07.2026';
  export let sideA: Track[] = [];
  export let sideB: Track[] = [];
  export let durA = '44:38';
  export let durB = '44:51';
  export let scriptBy = 'CLAUDE';
</script>

<div class="jcard">
  <!-- front panel -->
  <div class="front">
    <div class="scanlines"></div>
    <div class="accent-line"></div>
    <div class="kicker">NORDTONE MD-90 · A RADIO SHOW FROM YOUR LIBRARY</div>
    <div class="title">
      {#each title.split('\n') as line}{line}<br />{/each}
    </div>
    <div class="vibe">{vibeLine}</div>
    <div class="meta">{tapeLabel} · {date}</div>
  </div>

  <!-- spine (fold) -->
  <div class="spine">
    <div class="spine-title">{title.replace('\n', ' ')}</div>
    <div class="spine-meta">NORDTONE MD-90 · {tapeLabel}</div>
  </div>

  <!-- tracklist flap -->
  <div class="flap">
    <div>
      <div class="side-head">
        <div class="side-name">SIDE A</div>
        <div class="side-dur">{durA}</div>
      </div>
      <div class="tracks">
        {#each sideA as t}
          <div class="track"><span>{t.n} {t.title}</span><span>{t.dur}</span></div>
        {/each}
        <div class="track note"><span>— flip-side reminder from Vesla —</span><span>0:22</span></div>
      </div>
    </div>
    <div>
      <div class="side-head">
        <div class="side-name">SIDE B</div>
        <div class="side-dur">{durB}</div>
      </div>
      <div class="tracks">
        {#each sideB as t}
          <div class="track"><span>{t.n} {t.title}</span><span>{t.dur}</span></div>
        {/each}
        <div class="track note"><span>— sign-off &amp; run-out groove —</span><span>0:41</span></div>
      </div>
      <div class="credits">
        HOSTED BY VESLA · SCRIPT BY {scriptBy} · MIXED AT −16 LUFS<br />
        MADE LOCALLY — YOUR FILES, YOUR KEYS, YOUR TAPE
      </div>
    </div>
  </div>
</div>

<style>
  .jcard {
    width: 560px;
    background: var(--paper);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.6);
    transform: rotate(-0.6deg);
  }
  .front {
    height: 250px;
    position: relative;
    background: var(--jcard-art);
    overflow: hidden;
  }
  .scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(255, 255, 255, 0.025) 3px 4px);
  }
  .accent-line {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 64px;
    height: 2px;
    background: var(--accent);
    box-shadow: 0 0 12px var(--accent-glow);
  }
  .kicker {
    position: absolute;
    top: 22px;
    left: 26px;
    font: 500 13px var(--font-label);
    letter-spacing: 3px;
    color: rgba(240, 231, 210, 0.65);
  }
  .title {
    position: absolute;
    top: 64px;
    left: 26px;
    right: 26px;
    font: 700 52px/1 var(--font-label);
    letter-spacing: 1px;
    color: var(--jcard-art-fg);
    text-transform: uppercase;
  }
  .vibe {
    position: absolute;
    bottom: 22px;
    left: 26px;
    font: 16px var(--font-lcd);
    color: var(--lcd-fg);
  }
  .meta {
    position: absolute;
    bottom: 22px;
    right: 26px;
    font: 16px var(--font-lcd);
    color: rgba(240, 231, 210, 0.7);
  }
  .spine {
    border-top: 1.5px dashed var(--paper-rule);
    border-bottom: 1.5px dashed var(--paper-rule);
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    background: var(--paper-mid);
  }
  .spine-title {
    font: 700 15px var(--font-label);
    letter-spacing: 3px;
    color: var(--paper-ink);
    text-transform: uppercase;
  }
  .spine-meta {
    font: 15px var(--font-lcd);
    color: var(--paper-mut);
  }
  .flap {
    padding: 16px 22px 18px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 24px;
    background: var(--paper);
  }
  .side-head {
    display: flex;
    justify-content: space-between;
    border-bottom: 1.5px solid var(--paper-ink);
    padding-bottom: 4px;
    margin-bottom: 7px;
  }
  .side-name {
    font: 700 13px var(--font-label);
    letter-spacing: 2px;
    color: var(--paper-ink);
  }
  .side-dur {
    font: 13px var(--font-lcd);
    color: var(--paper-mut);
  }
  .tracks {
    font: 13.5px/1.75 var(--font-lcd);
    color: var(--paper-ink-soft);
  }
  .track {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .note {
    color: var(--paper-mut);
  }
  .credits {
    margin-top: 8px;
    font: 11.5px/1.5 var(--font-label);
    letter-spacing: 0.5px;
    color: var(--paper-mut);
  }
</style>
