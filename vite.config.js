import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { vorschlag } from './server/vorschlag.js';

export default defineConfig({
  // Relative Pfade, weil GitHub Pages die Anwendung in einem Unterordner ausliefert.
  base: './',
  plugins: [svelte(), vorschlag()],
});
