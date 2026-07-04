<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import Lcd from '../design-system/components/Lcd.svelte';
  import Led from '../design-system/components/Led.svelte';
  import CassetteBay from '../design-system/components/CassetteBay.svelte';
  import TransportStrip from '../design-system/components/TransportStrip.svelte';
  import RoundButton from '../design-system/components/RoundButton.svelte';
  import { stages, scriptText, counterLabel, nowFitting, stopCompose } from '../lib/store';
  import { SHOW_TITLE } from '../lib/mock';
</script>

<Panel>
  <AppChrome subtitle="COMPOSING…" led="busy" ledLabel="BUSY" />

  <div class="main">
    <div class="col">
      <InsetPanel label="PROGRAM SEQUENCE">
        <div class="stages">
          {#each $stages as st}
            <div class="stage">
              <Led state={st.state === 'done' ? 'ok' : st.state === 'busy' ? 'busy' : 'off'} size={10} />
              <div class="stage-label" class:busy={st.state === 'busy'} class:idle={st.state === 'idle'}>
                {st.label}
              </div>
              <div
                class="stage-status"
                class:done={st.state === 'done'}
                class:busy={st.state === 'busy'}
                class:idle={st.state === 'idle'}
              >
                {st.status}
              </div>
            </div>
          {/each}
        </div>
      </InsetPanel>

      <InsetPanel label="SCRIPT MONITOR" grow>
        <div class="monitor">
          <Lcd size="lg" cursor grow>{$scriptText}</Lcd>
        </div>
      </InsetPanel>
    </div>

    <div class="col">
      <CassetteBay title={SHOW_TITLE} spinning grow />
      <InsetPanel label="TAPE COUNTER">
        <div slot="right" class="hint">SIDE A OF 2</div>
        <Lcd size="xl" center>{$counterLabel.elapsed} <span class="dim">/ {$counterLabel.total}</span></Lcd>
        <div class="bar">
          <div class="fill" style="width:{$counterLabel.pct}%"></div>
        </div>
      </InsetPanel>
    </div>
  </div>

  <TransportStrip>
    <svelte:fragment slot="status">
      <Lcd size="lg">
        NOW FITTING: {$nowFitting}<br />
        <span class="dim">DUCK −9 dB UNDER HOST · CROSSFADE 1.8 s</span>
      </Lcd>
    </svelte:fragment>
    <svelte:fragment slot="action">
      <RoundButton variant="stop" on:click={stopCompose} />
      <div class="caption">CANCEL</div>
    </svelte:fragment>
  </TransportStrip>
</Panel>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 470px;
    gap: 22px;
    padding: 22px 34px 0;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .stages {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }
  .stage {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .stage-label {
    font: 600 13px var(--font-label);
    letter-spacing: 2px;
    color: var(--text-mid);
    width: 150px;
  }
  .stage-label.busy {
    color: var(--btn-active-fg);
  }
  .stage-label.idle {
    color: var(--text-mut3);
  }
  .stage-status {
    font: 15px var(--font-lcd);
  }
  .stage-status.done {
    color: var(--lcd-ok);
  }
  .stage-status.busy {
    color: var(--lcd-fg);
    text-shadow: 0 0 8px var(--lcd-glow);
  }
  .stage-status.idle {
    color: var(--text-mut3);
  }
  .monitor {
    flex: 1;
    display: flex;
    min-height: 150px;
  }
  .hint {
    font: 500 10px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--text-mut3);
  }
  .bar {
    margin-top: 10px;
    height: 10px;
    border-radius: 5px;
    background: var(--progress-track);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: var(--progress-fill);
    box-shadow: 0 0 10px var(--progress-glow);
    transition: width 0.25s linear;
  }
</style>
