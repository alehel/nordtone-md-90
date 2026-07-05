<script lang="ts">
  import Panel from '../design-system/components/Panel.svelte';
  import AppChrome from '../design-system/components/AppChrome.svelte';
  import InsetPanel from '../design-system/components/InsetPanel.svelte';
  import HardwareButton from '../design-system/components/HardwareButton.svelte';
  import { closeSettings } from '../lib/store';

  const PROVIDERS = ['Anthropic', 'OpenAI', 'Gemini', 'Groq', 'Ollama (local)', 'Custom URL'];
  let provider = 'Anthropic';
  let model = 'claude-sonnet-5';
  let apiKey = '';
  let elevenKey = '';
  const THEMES = [
    { id: 'charcoal', label: 'Charcoal', ready: true },
    { id: 'cream', label: 'Cream · soon', ready: false },
    { id: 'grey', label: 'Grey · soon', ready: false },
  ];
  let theme = 'charcoal';
</script>

<Panel>
  <AppChrome subtitle="Settings" />

  <div class="main">
    <div class="col">
      <InsetPanel label="AI provider">
        <div slot="right" class="sub">your keys · stored in the OS keychain</div>
        <div class="providers">
          {#each PROVIDERS as p}
            <HardwareButton active={provider === p} on:click={() => (provider = p)}>{p}</HardwareButton>
          {/each}
        </div>
        <div class="field">
          <div class="label-line">Model</div>
          <input class="input" bind:value={model} spellcheck="false" aria-label="Model" />
        </div>
        <div class="field">
          <div class="label-line">API key</div>
          <input class="input" type="password" bind:value={apiKey} placeholder="sk-…" aria-label="API key" />
        </div>
        <div class="test-row">
          <HardwareButton>Test connection</HardwareButton>
          <span class="sub">Not tested</span>
        </div>
      </InsetPanel>

      <InsetPanel label="Host voice · ElevenLabs">
        <div class="field">
          <div class="label-line">API key</div>
          <input
            class="input"
            type="password"
            bind:value={elevenKey}
            placeholder="optional — the local voice is free"
            aria-label="ElevenLabs key"
          />
        </div>
      </InsetPanel>
    </div>

    <div class="col">
      <InsetPanel label="Appearance">
        <div class="providers">
          {#each THEMES as t}
            <HardwareButton active={theme === t.id} on:click={() => t.ready && (theme = t.id)}>{t.label}</HardwareButton>
          {/each}
        </div>
      </InsetPanel>

      <InsetPanel label="Defaults">
        <div class="field">
          <div class="label-line">Output folder</div>
          <input class="input" value="~/Music/MD-90 Shows" readonly />
        </div>
        <div class="field">
          <div class="label-line">Loudness target</div>
          <input class="input" value="−16.0 LUFS" readonly />
        </div>
      </InsetPanel>

      <div class="back">
        <HardwareButton accent block on:click={closeSettings}>◂ Back</HardwareButton>
      </div>
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
  .col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .sub {
    font: 400 12.5px var(--font-ui);
    color: var(--text-dim);
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
  .label-line {
    font: 600 13px var(--font-ui);
    color: var(--text-body);
    margin-bottom: 6px;
  }
  .test-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .back {
    margin-top: auto;
  }
</style>
