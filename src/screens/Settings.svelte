<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import Lcd from '../design-system/components/Lcd.svelte';
  import HardwareButton from '../design-system/components/HardwareButton.svelte';
  import { closeSettings } from '../lib/store';

  const PROVIDERS = ['ANTHROPIC', 'OPENAI', 'GEMINI', 'GROQ', 'OLLAMA (LOCAL)', 'CUSTOM URL'];
  let provider = 'ANTHROPIC';
  let model = 'claude-sonnet-5';
  let apiKey = '';
  let elevenKey = '';
  const THEMES = [
    { id: 'charcoal', label: 'CHARCOAL', ready: true },
    { id: 'cream', label: 'CREAM', ready: false },
    { id: 'grey', label: 'GREY', ready: false },
  ];
  let theme = 'charcoal';
</script>

<Panel>
  <AppChrome subtitle="SETTINGS" led="ok" ledLabel="PWR" />

  <div class="main">
    <div class="col">
      <InsetPanel label="AI PROVIDER">
        <div slot="right" class="hint">YOUR KEYS · STORED IN OS KEYCHAIN</div>
        <div class="providers">
          {#each PROVIDERS as p}
            <HardwareButton active={provider === p} on:click={() => (provider = p)}>{p}</HardwareButton>
          {/each}
        </div>
        <div class="field">
          <div class="field-label">MODEL</div>
          <div class="lcd-input">
            <input bind:value={model} spellcheck="false" aria-label="Model" />
          </div>
        </div>
        <div class="field">
          <div class="field-label">API KEY</div>
          <div class="lcd-input">
            <input type="password" bind:value={apiKey} placeholder="sk-…" aria-label="API key" />
          </div>
        </div>
        <div class="test-row">
          <HardwareButton>TEST CONNECTION</HardwareButton>
          <Lcd size="sm" grow><span class="dim">NOT TESTED</span></Lcd>
        </div>
      </InsetPanel>

      <InsetPanel label="HOST VOICE · ELEVENLABS">
        <div class="field">
          <div class="field-label">API KEY</div>
          <div class="lcd-input">
            <input type="password" bind:value={elevenKey} placeholder="optional — local voice is free" aria-label="ElevenLabs key" />
          </div>
        </div>
      </InsetPanel>
    </div>

    <div class="col">
      <InsetPanel label="FACEPLATE">
        <div class="providers">
          {#each THEMES as t}
            <HardwareButton active={theme === t.id} on:click={() => t.ready && (theme = t.id)}>
              {t.label}{t.ready ? '' : ' · SOON'}
            </HardwareButton>
          {/each}
        </div>
      </InsetPanel>

      <InsetPanel label="DEFAULTS">
        <div class="field">
          <div class="field-label">OUTPUT FOLDER</div>
          <Lcd size="sm">~/Music/MD-90 Shows</Lcd>
        </div>
        <div class="field">
          <div class="field-label">LOUDNESS TARGET</div>
          <Lcd size="sm">−16.0 LUFS</Lcd>
        </div>
      </InsetPanel>

      <div class="back">
        <HardwareButton accent block on:click={closeSettings}>◂ BACK</HardwareButton>
      </div>
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
  .col {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .hint {
    font: 500 10px var(--font-label);
    letter-spacing: 1.5px;
    color: var(--text-mut3);
  }
  .providers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .field {
    margin-bottom: 10px;
  }
  .field-label {
    font: 600 10px var(--font-label);
    letter-spacing: 2px;
    color: var(--text-mut3);
    margin-bottom: 5px;
  }
  .lcd-input {
    display: flex;
    background: var(--lcd-bg);
    border-radius: 6px;
    box-shadow: var(--lcd-shadow);
    padding: 8px 12px;
  }
  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font: 17px var(--font-lcd);
    color: var(--lcd-fg);
    text-shadow: 0 0 8px var(--lcd-glow);
    caret-color: var(--lcd-fg);
  }
  input::placeholder {
    color: var(--lcd-fg-dim);
    text-shadow: none;
  }
  .test-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .back {
    margin-top: auto;
  }
</style>
