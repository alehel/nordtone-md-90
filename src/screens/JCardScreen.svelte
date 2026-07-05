<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import Lcd from '../design-system/components/Lcd.svelte';
  import HardwareButton from '../design-system/components/HardwareButton.svelte';
  import JCard from '../design-system/components/JCard.svelte';
  import { newShow, openSettings, tapeInfo } from '../lib/store';
  import { SIDE_A, SIDE_B, FIT_REPORT } from '../lib/mock';
</script>

<Panel>
  <AppChrome subtitle="SHOW COMPLETE · J-CARD" led="ok" ledLabel="DONE" onSettings={openSettings} />

  <div class="main">
    <div class="tray">
      <JCard
        sideA={SIDE_A}
        sideB={SIDE_B}
        durA={FIT_REPORT.sideA.dur}
        durB={FIT_REPORT.sideB.dur}
        tapeLabel={$tapeInfo.label}
      />
    </div>

    <div class="col">
      <InsetPanel label="OUTPUT">
        <Lcd size="md">
          {FIT_REPORT.sideA.file} · {FIT_REPORT.sideA.dur}<br />
          {FIT_REPORT.sideB.file} · {FIT_REPORT.sideB.dur}<br />
          <span class="dim">jcard.pdf · ready</span>
        </Lcd>
      </InsetPanel>

      <div class="actions">
        <HardwareButton accent block>⎙ PRINT J-CARD</HardwareButton>
        <HardwareButton block>EXPORT PDF</HardwareButton>
        <HardwareButton block>REVEAL AUDIO FILES</HardwareButton>
        <HardwareButton block on:click={newShow}>NEW SHOW</HardwareButton>
      </div>

      <InsetPanel label="FIT REPORT">
        <div class="report">
          SIDE A SLACK: {FIT_REPORT.sideA.slack}<br />
          SIDE B SLACK: {FIT_REPORT.sideB.slack}<br />
          LOUDNESS: {FIT_REPORT.loudness}<br />
          DUCKING EVENTS: {FIT_REPORT.duckingEvents}
        </div>
      </InsetPanel>
    </div>
  </div>
</Panel>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 22px;
    padding: 22px 34px 0;
  }
  .tray {
    background: var(--panel-inset);
    border-radius: 10px;
    box-shadow: var(--panel-tray-shadow);
    padding: 26px;
    display: grid;
    place-items: center;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .report {
    font: 14px/1.7 var(--font-lcd);
    color: var(--text-mut);
  }
</style>
