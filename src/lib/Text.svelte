<script>
  import { zerlege } from './begriffe.js';
  import { verberge, zeige } from './erklaerung.svelte.js';
  import { markiere } from './hervorhebung.js';

  /** `suche` hebt die Suchwörter im Text hervor. */
  let { text, suche = '' } = $props();
  const teile = $derived(zerlege(text).map((teil) => ({ ...teil, abschnitte: markiere(teil.text, suche) })));
</script>

{#snippet abschnitte(teil)}{#each teil.abschnitte as abschnitt}{#if abschnitt.treffer}<mark
        >{abschnitt.text}</mark
      >{:else}{abschnitt.text}{/if}{/each}{/snippet}

<!-- Ohne Umbrüche zwischen den Teilen, damit keine Leerzeichen in den Text geraten. -->
{#each teile as teil}{#if teil.erklaerung}<button
      type="button"
      aria-describedby="erklaerung"
      onmouseenter={(event) => zeige(event.currentTarget, teil.erklaerung)}
      onfocus={(event) => zeige(event.currentTarget, teil.erklaerung)}
      onmouseleave={verberge}
      onblur={verberge}>{@render abschnitte(teil)}</button
    >{:else}{@render abschnitte(teil)}{/if}{/each}

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
