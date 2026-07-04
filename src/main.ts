// Locally bundled fonts (the design's Google Fonts trio) — offline-safe.
import '@fontsource/vt323/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow-condensed/400.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';

import './design-system/tokens.css';
import './design-system/themes/charcoal.css';
import './app.css';

import App from './App.svelte';

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
