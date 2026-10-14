<script>
  import { erklaerung, verberge } from './erklaerung.svelte.js';
</script>

<svelte:window onscroll={verberge} onkeydown={(event) => event.key === 'Escape' && verberge()} />

{#if erklaerung.sichtbar}
  <div id="erklaerung" role="tooltip" style={erklaerung.stil}>{erklaerung.text}</div>
{/if}

<style>
  div {
    position: fixed;
    z-index: 10;
    width: max-content;
    padding: var(--abstand);
    background: var(--grund);
    border: 1px solid var(--linie);
    border-radius: var(--radius);
    box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 0.12);
    color: var(--text);
    pointer-events: none;
  }
</style>
