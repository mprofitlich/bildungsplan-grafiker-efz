<script>
  import { glossar } from './begriffe.js';
</script>

<!-- Die Fachbegriffe sind dieselben, die im Text beim Überfahren ihre Erklärung zeigen. -->
{#each glossar as abschnitt (abschnitt.titel)}
  <section>
    <h2>{abschnitt.titel}</h2>
    <dl>
      {#each abschnitt.eintraege as eintrag (eintrag.begriff)}
        <div>
          <dt>{eintrag.begriff}</dt>
          <dd>{eintrag.definition}</dd>
        </div>
      {/each}
    </dl>
  </section>
{/each}

<style>
  section {
    max-width: 62.75rem;
  }

  section + section {
    margin-top: var(--abstand-gross);
  }

  h2 {
    margin: 0 0 var(--abstand-klein);
    font-size: 1.125rem;
  }

  dl {
    margin: 0;
  }

  div {
    display: grid;
    /* Fasst auch lange Namen wie «Kommission für Berufsentwicklung und Qualität» in wenigen Zeilen. */
    grid-template-columns: 17.5rem 1fr;
    gap: var(--abstand);
    padding: var(--abstand) 0;
    border-top: 1px solid var(--linie);
  }

  /* Ein Wort, breiter als die Spalte, wird getrennt, statt in die Erklärung zu laufen. */
  dt {
    padding-right: var(--abstand);
    font-weight: 600;
    hyphens: auto;
    overflow-wrap: break-word;
  }

  dd {
    max-width: 52rem;
    margin: 0;
  }

  @media (max-width: 40rem) {
    div {
      grid-template-columns: 1fr;
      gap: var(--abstand-klein);
    }
  }
</style>
