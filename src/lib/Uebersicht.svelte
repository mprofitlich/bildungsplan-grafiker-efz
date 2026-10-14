<script>
  import { fassung } from './fassung.svelte.js';
  import { arbeitsphasen, bereiche, wortlaut } from './katalog.js';

  /**
   * Die Übersicht der Handlungskompetenzen aus Kapitel 3.2 des Bildungsplans.
   * Mit `anzahl` zeigt sie, wie viele Ziele ein Kurs je Handlungskompetenz
   * enthält; mit `onwahl` werden die Felder anklickbar.
   */
  let { anzahl = undefined, onwahl = undefined } = $props();

  function phasen(kompetenz) {
    return arbeitsphasen.filter((phase) => kompetenz.arbeitsphasen.includes(phase.id));
  }
</script>

{#snippet inhalt(kompetenz, zahl)}
  <span class="kopf">
    <strong>{kompetenz.id[0]}<span class="ziffer">{kompetenz.id.slice(1)}</span></strong>
    {#each phasen(kompetenz) as phase (phase.id)}
      <span class="marke" style:background={phase.farbe} title={phase.name}></span>
    {/each}
    {#if zahl > 0}
      <span class="anzahl" title="{zahl} Leistungsziele im Kurs">{zahl}</span>
    {/if}
  </span>
  <span class="name">{wortlaut(kompetenz, fassung.id).titel}</span>
{/snippet}

<div class:fussabdruck={anzahl !== undefined}>
  {#each bereiche as bereich (bereich.id)}
    <section>
      <p class="bereich"><strong>{bereich.id}</strong> {bereich.titel}</p>
      <ul>
        {#each bereich.handlungskompetenzen as kompetenz (kompetenz.id)}
          {@const zahl = anzahl?.[kompetenz.id] ?? 0}
          <li class:belegt={zahl > 0}>
            {#if onwahl}
              <button type="button" class="feld" onclick={() => onwahl(kompetenz.id)}>
                {@render inhalt(kompetenz, zahl)}
              </button>
            {:else}
              <div class="feld">{@render inhalt(kompetenz, zahl)}</div>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  section {
    display: grid;
    grid-template-columns: 11rem 1fr;
    gap: var(--abstand);
    padding: var(--abstand-klein) 0;
    border-top: 1px solid var(--linie);
    font-size: var(--schrift-klein);
  }

  .bereich {
    margin: 0;
    padding-top: var(--abstand-klein);
  }

  /* Fünf Felder je Zeile wie im Bildungsplan; Bereich e bricht dort ebenfalls um. */
  ul {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--abstand-klein);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .feld {
    display: block;
    width: 100%;
    height: 100%;
    padding: var(--abstand-klein);
    background: var(--grund);
    border: 1px solid var(--linie);
    border-radius: var(--radius);
    font-size: inherit;
    text-align: left;
    hyphens: auto;
  }

  .kopf {
    display: flex;
    gap: var(--abstand-klein);
    align-items: center;
  }

  .ziffer {
    margin-left: 0.1em;
  }

  .marke {
    width: 0.625rem;
    height: 0.625rem;
  }

  .anzahl {
    margin-left: auto;
    padding: 0 0.45em;
    background: var(--akzent);
    border-radius: 1em;
    color: var(--akzent-text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .name {
    display: block;
  }

  .fussabdruck li:not(.belegt) .feld {
    border-style: dashed;
    color: var(--text-leise);
  }

  .fussabdruck .belegt .feld {
    background: var(--flaeche);
    border-color: var(--text-leise);
  }

  @media (max-width: 48rem) {
    section {
      grid-template-columns: 1fr;
    }

    ul {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
