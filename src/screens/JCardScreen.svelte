<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import HardwareButton from '../design-system/components/HardwareButton.svelte';
  import JCard from '../design-system/components/JCard.svelte';
  import { newShow, openSettings, tapeInfo, clockSet, clockLabel } from '../lib/store';
  import { SIDE_A, SIDE_B, FIT_REPORT } from '../lib/mock';

  const now = new Date();
  const todayLabel = [
    String(now.getDate()).padStart(2, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    now.getFullYear(),
  ].join('.');
  // The J-card prints the show's recording date: the SHOW CLOCK when set,
  // otherwise the real date.
  $: dateLabel = $clockSet ? $clockLabel : todayLabel;
</script>

<Panel>
  <AppChrome subtitle="Show complete · J-card" led="ok" onSettings={openSettings} />

  <div class="main">
    <div class="tray">
      <JCard
        sideA={SIDE_A}
        sideB={SIDE_B}
        durA={FIT_REPORT.sideA.dur}
        durB={FIT_REPORT.sideB.dur}
        tapeLabel={$tapeInfo.label}
        date={dateLabel}
      />
    </div>

    <div class="col">
      <InsetPanel label="Output">
        <div class="out">
          {FIT_REPORT.sideA.file} · {FIT_REPORT.sideA.dur}<br />
          {FIT_REPORT.sideB.file} · {FIT_REPORT.sideB.dur}<br />
          <span class="dim">jcard.pdf · ready</span>
        </div>
      </InsetPanel>

      <div class="actions">
        <HardwareButton accent block>⎙ Print J-card</HardwareButton>
        <HardwareButton block>Export PDF</HardwareButton>
        <HardwareButton block>Reveal audio files</HardwareButton>
        <HardwareButton block on:click={newShow}>New show</HardwareButton>
      </div>

      <InsetPanel label="Fit report">
        <div class="report">
          Side A slack: {FIT_REPORT.sideA.slack}<br />
          Side B slack: {FIT_REPORT.sideB.slack}<br />
          Loudness: {FIT_REPORT.loudness}<br />
          Ducking events: {FIT_REPORT.duckingEvents}
        </div>
      </InsetPanel>
    </div>
  </div>
</Panel>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
    padding: 18px 20px;
  }
  .tray {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 24px;
    display: grid;
    place-items: center;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .out,
  .report {
    font: 400 13px/1.7 var(--font-ui);
    color: var(--text-body);
  }
  .dim {
    color: var(--text-dim);
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
