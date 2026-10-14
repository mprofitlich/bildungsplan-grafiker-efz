<script>
  import { zerlege } from './begriffe.js';
  import { verberge, zeige } from './erklaerung.svelte.js';

  let { text } = $props();
  const teile = $derived(zerlege(text));
</script>

<!-- Ohne Umbrüche zwischen den Teilen, damit keine Leerzeichen in den Text geraten. -->
{#each teile as teil}{#if teil.erklaerung}<button
      type="button"
      aria-describedby="erklaerung"
      onmouseenter={(event) => zeige(event.currentTarget, teil.erklaerung)}
      onfocus={(event) => zeige(event.currentTarget, teil.erklaerung)}
      onmouseleave={verberge}
      onblur={verberge}>{teil.text}</button
    >{:else}{teil.text}{/if}{/each}

<style>
  button {
    display: inline;
    padding: 0;
    background: none;
    border: 0;
    font: inherit;
    color: inherit;
    text-align: inherit;
    text-decoration: underline dotted;
    text-underline-offset: 0.2em;
    cursor: help;
  }
</style>
