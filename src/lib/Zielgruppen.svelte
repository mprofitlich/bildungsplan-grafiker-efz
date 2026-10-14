<script>
  import { arbeitsphasen } from './katalog.js';
  import Text from './Text.svelte';
  import Ziel from './Ziel.svelte';

  /** `anker` gibt jedem Abschnitt eine Id, zu der die Übersicht springen kann. */
  let { gruppen, hinweise = {}, anker = false } = $props();

  /** Liefert die Phasen einer Handlungskompetenz in der Reihenfolge des Workflows. */
  function phasen(kompetenz) {
    return arbeitsphasen.filter((phase) => kompetenz.arbeitsphasen.includes(phase.id));
  }
</script>

{#each gruppen as gruppe (gruppe.kompetenz.id)}
  <section id={anker ? `hk-${gruppe.kompetenz.id}` : undefined}>
    <header>
      <h3><span class="kennung"
          >{gruppe.kompetenz.id[0]}<span class="ziffer">{gruppe.kompetenz.id.slice(1)}</span></span
        > <Text text={gruppe.kompetenz.titel} /></h3>
      <ul class="phasen" aria-label="Arbeitsphasen">
        {#each phasen(gruppe.kompetenz) as phase (phase.id)}
          <li><span class="marke" style:background={phase.farbe}></span>{phase.name}</li>
        {/each}
      </ul>
    </header>
    <p class="beschreibung"><Text text={gruppe.kompetenz.beschreibung} /></p>
    <ul>
      {#each gruppe.ziele as ziel (ziel.id)}
        <Ziel {ziel} hinweis={hinweise[ziel.id]} />
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
    top: 0;
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

  .phasen {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand-klein) var(--abstand);
    margin-top: var(--abstand-klein);
    font-size: var(--schrift-klein);
  }

  .phasen li {
    display: flex;
    gap: var(--abstand-klein);
    align-items: center;
  }

  .marke {
    width: 0.75rem;
    height: 0.75rem;
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
