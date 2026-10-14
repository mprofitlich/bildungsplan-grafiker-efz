<script>
  import { fassung } from './fassung.svelte.js';
  import { arbeitsphasen, wortlaut } from './bildungsplan.js';
  import Text from './Text.svelte';
  import Ziel from './Ziel.svelte';

  /**
   * `anker` gibt jedem Abschnitt eine Id, zu der die Übersicht springen kann;
   * `suche` hebt die Suchwörter in Titeln, Nummern und Zielen hervor.
   */
  let { gruppen: offiziell, hinweise = {}, anker = false, suche = '' } = $props();

  const gruppen = $derived(
    offiziell.map((gruppe) => ({ ...gruppe, kompetenz: wortlaut(gruppe.kompetenz, fassung.id) })),
  );

  /** Liefert die Phasen einer Handlungskompetenz in der Reihenfolge des Workflows. */
  function phasen(kompetenz) {
    return arbeitsphasen.filter((phase) => kompetenz.arbeitsphasen.includes(phase.id));
  }
</script>

{#each gruppen as gruppe (gruppe.kompetenz.id)}
  <section id={anker ? `hk-${gruppe.kompetenz.id}` : undefined}>
    <header>
      <ul class="phasen" aria-label="Arbeitsphasen">
        {#each phasen(gruppe.kompetenz) as phase (phase.id)}
          <li style:--phase={phase.farbe}>{phase.name}</li>
        {/each}
      </ul>
      <h3><span class="kennung"
          >{gruppe.kompetenz.id[0]}<span class="ziffer">{gruppe.kompetenz.id.slice(1)}</span></span
        > <Text text={gruppe.kompetenz.titel} {suche} /></h3>
    </header>
    <p class="beschreibung"><Text text={gruppe.kompetenz.beschreibung} /></p>
    <ul>
      {#each gruppe.ziele as ziel (ziel.id)}
        <Ziel {ziel} hinweis={hinweise[ziel.id]} {suche} />
      {/each}
    </ul>
  </section>
{/each}

<style>
  section {
    margin-top: var(--abstand-gross);
  }

  header {
    position: sticky;
    /* Unter einer klebenden Suche, sofern die Ansicht ihre Höhe mitgibt. */
    top: var(--oben, 0px);
    z-index: 1;
    margin-bottom: var(--abstand-klein);
    padding: var(--abstand-klein) 0;
    background: var(--grund);
    border-bottom: 1px solid var(--linie);
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.25;
  }

  /*
   * Die Phase steht klein in ihrer Farbe über dem Titel, wie im Graphic Design
   * Workflow. Die Farbe ist leicht zur Schriftfarbe gemischt, damit sie auf
   * hellem wie dunklem Grund lesbar bleibt.
   */
  .phasen {
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--abstand);
    margin-bottom: var(--abstand-klein);
    font-size: var(--schrift-klein);
    font-weight: 600;
  }

  .phasen li {
    color: color-mix(in oklch, var(--phase) 80%, var(--text));
  }

  .beschreibung {
    max-width: 62.75rem;
    margin: 0 0 var(--abstand);
  }

  .kennung {
    color: var(--text-leise);
  }

  .ziffer {
    margin-left: 0.1em;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
