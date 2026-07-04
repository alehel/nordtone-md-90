<script lang="ts">
  import Setup from './screens/Setup.svelte';
  import Generation from './screens/Generation.svelte';
  import JCardScreen from './screens/JCardScreen.svelte';
  import Settings from './screens/Settings.svelte';
  import { screen } from './lib/store';
</script>

{#if $screen === 'setup'}
  <Setup />
{:else if $screen === 'generation'}
  <Generation />
{:else if $screen === 'jcard'}
  <JCardScreen />
{:else}
  <Settings />
{/if}
