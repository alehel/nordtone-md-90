<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import Lcd from '../design-system/components/Lcd.svelte';
  import Led from '../design-system/components/Led.svelte';
  import HardwareButton from '../design-system/components/HardwareButton.svelte';
  import CassetteBay from '../design-system/components/CassetteBay.svelte';
  import TransportStrip from '../design-system/components/TransportStrip.svelte';
  import { stages, scriptText, counterLabel, nowFitting, stopCompose } from '../lib/store';
  import { SHOW_TITLE } from '../lib/mock';
</script>

<Panel>
  <AppChrome subtitle="Composing…" led="busy" />

  <div class="main">
    <div class="col">
      <InsetPanel label="Progress">
        <div class="stages">
          {#each $stages as st}
            <div class="stage">
              <Led state={st.state === 'done' ? 'ok' : st.state === 'busy' ? 'busy' : 'off'} size={9} />
              <div class="stage-label" class:busy={st.state === 'busy'} class:idle={st.state === 'idle'}>
                {st.label}
              </div>
              <div class="stage-status" class:done={st.state === 'done'} class:busy={st.state === 'busy'}>
                {st.status}
              </div>
            </div>
          {/each}
        </div>
      </InsetPanel>

      <InsetPanel label="Script" grow>
        <div class="monitor">
          <Lcd size="lg" cursor grow>{$scriptText}</Lcd>
        </div>
      </InsetPanel>
    </div>

    <div class="col">
      <InsetPanel>
        <CassetteBay title={SHOW_TITLE} spinning />
      </InsetPanel>
      <InsetPanel label="Tape counter">
        <div slot="right" class="sub">Side A of 2</div>
        <Lcd size="xl" center>{$counterLabel.elapsed} <span class="dim">/ {$counterLabel.total}</span></Lcd>
        <div class="bar">
          <div class="fill" style="width:{$counterLabel.pct}%"></div>
        </div>
      </InsetPanel>
    </div>
  </div>

  <TransportStrip>
    <svelte:fragment slot="status">
      Now fitting: <b>{$nowFitting}</b> · duck −9 dB under host · crossfade 1.8 s
    </svelte:fragment>
    <svelte:fragment slot="action">
      <HardwareButton on:click={stopCompose}>■ Stop</HardwareButton>
    </svelte:fragment>
  </TransportStrip>
</Panel>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 330px;
    gap: 16px;
    padding: 18px 20px;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .sub {
    font: 400 12.5px var(--font-ui);
    color: var(--text-dim);
  }
  .stages {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .stage {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .stage-label {
    font: 600 13.5px var(--font-ui);
    color: var(--text-body);
    width: 120px;
  }
  .stage-label.busy {
    color: var(--selected-fg);
  }
  .stage-label.idle {
    color: var(--text-dim);
  }
  .stage-status {
    font: 400 13px var(--font-ui);
    color: var(--text-dim);
  }
  .stage-status.done {
    color: var(--ok-text);
  }
  .stage-status.busy {
    color: var(--accent);
  }
  .monitor {
    flex: 1;
    display: flex;
    min-height: 150px;
  }
  .bar {
    margin-top: 10px;
    height: 8px;
    border-radius: 4px;
    background: var(--progress-track);
    border: 1px solid var(--field-border);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: var(--progress-fill);
    transition: width 0.25s linear;
  }
</style>
