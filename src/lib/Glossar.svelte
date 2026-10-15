<script>
  import { glossar } from './begriffe.js';
  import { filtere, ziele } from './bildungsplan.js';
  import { fassung } from './fassung.svelte.js';

  /** `onsuche` öffnet «Kompetenzen» mit einem Fachbegriff in der Suche. */
  let { onsuche } = $props();

  // Begriffe, die so in keinem Ziel stehen, deren Anfang aber schon:
  // Der Bildungsplan schreibt «Animations- und Motionkonzepte».
  const SUCHWORT = { Animationskonzept: 'Animation' };

  // Suchwort und Zielzahl je Fachbegriff; ohne Treffer wird der Begriff kein Link, weil er auf eine leere Liste führte.
  const treffer = $derived(
    new Map(
      glossar
        .find((abschnitt) => abschnitt.id === 'fachbegriffe')
        .eintraege.map(({ begriff }) => {
          const wort = SUCHWORT[begriff] ?? begriff;
          return [begriff, { wort, zahl: filtere(ziele, { suche: wort, fassung: fassung.id }).length }];
        }),
    ),
  );

  /** Scrollt zum Abschnitt, ohne die Adresse zu ändern: Die App kennt keine Adressen für Ansichten. */
  function springe(event, id) {
    event.preventDefault();
    // Wer im System weniger Bewegung eingestellt hat, springt weiterhin direkt.
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`glossar-${id}`)?.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth' });
  }
</script>

<div class="glossar">
  <div class="abschnitte">
    <!-- Die Fachbegriffe sind dieselben, die im Text beim Überfahren ihre Erklärung zeigen. -->
    {#each glossar as abschnitt (abschnitt.id)}
      <section id="glossar-{abschnitt.id}">
        <h2>
          {abschnitt.titel}
          {#if abschnitt.zusatz}<span class="zusatz">{abschnitt.zusatz}</span>{/if}
        </h2>
        <dl>
          {#each abschnitt.eintraege as eintrag (eintrag.begriff)}
            {@const { wort, zahl } = treffer.get(eintrag.begriff) ?? {}}
            <div>
              <dt>
                {#if zahl}
                  <!-- Ein abweichendes Suchwort ist unterstrichen, der Rest des Begriffs nicht. -->
                  <a
                    href="#suche"
                    title="{zahl} Leistungsziele mit «{wort}» unter «Kompetenzen»"
                    onclick={(event) => {
                      event.preventDefault();
                      onsuche(wort);
                    }}>{wort}</a
                  >{eintrag.begriff.slice(wort.length)}
                  <span class="anzahl">{zahl}</span>
                {:else}
                  {eintrag.begriff}
                {/if}
              </dt>
              <dd>{eintrag.definition}</dd>
            </div>
          {/each}
        </dl>
      </section>
    {/each}
  </div>

  <nav aria-label="Abschnitte des Glossars">
    <ul>
      {#each glossar as abschnitt (abschnitt.id)}
        <li>
          <a href="#glossar-{abschnitt.id}" onclick={(event) => springe(event, abschnitt.id)}>{abschnitt.titel}</a>
          <span class="anzahl">{abschnitt.eintraege.length}</span>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .glossar {
    display: grid;
    grid-template-columns: minmax(0, 62.75rem) 12rem;
    gap: var(--abstand-gross);
    align-items: start;
  }

  /* Bleibt beim Scrollen unter dem Menü stehen. */
  nav {
    position: sticky;
    top: calc(var(--menue, 0px) + var(--abstand));
    font-size: var(--schrift-klein);
  }

  nav ul {
    margin: 0;
    padding: 0 0 0 var(--abstand);
    border-left: 1px solid var(--linie);
    list-style: none;
  }

  nav li + li {
    margin-top: var(--abstand-klein);
  }

  /* Nur die Linie schalten: Die Kurzform «text-decoration» setzte die Dicke aus app.css zurück. */
  nav a {
    color: inherit;
    text-decoration-line: none;
  }

  nav a:hover {
    color: var(--akzent);
    text-decoration-line: underline;
  }

  .anzahl {
    color: var(--text-leise);
    font-variant-numeric: tabular-nums;
  }

  /*
   * Der Abstand gehört zum Abschnitt, damit er beim Sprung unter dem Menü
   * erhalten bleibt; ein Aussenabstand fiele beim Scrollen weg. Der erste
   * Abschnitt hält ihn nur beim Sprung, oben auf der Seite steht schon der
   * Innenabstand der Seite.
   */
  section + section {
    padding-top: var(--abstand-gross);
  }

  section:first-child {
    scroll-margin-top: var(--abstand-gross);
  }

  h2 {
    margin: 0 0 var(--abstand-klein);
    font-size: 1.125rem;
  }

  .zusatz {
    font-weight: 400;
  }

  dl {
    margin: 0;
  }

  dl div {
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

  dt a {
    color: inherit;
    text-decoration-color: var(--akzent);
  }

  dt a:hover {
    color: var(--akzent);
  }

  dt .anzahl {
    margin-left: var(--abstand-klein);
    font-weight: 400;
  }

  dd {
    max-width: 52rem;
    margin: 0;
  }

  /* Ohne Platz für die Leiste stehen die Links als Zeile über dem Glossar. */
  @media (max-width: 60rem) {
    .glossar {
      grid-template-columns: minmax(0, 1fr);
    }

    nav {
      position: static;
      order: -1;
    }

    nav ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--abstand-klein) var(--abstand-gross);
      padding: 0;
      border-left: 0;
    }

    nav li + li {
      margin-top: 0;
    }
  }

  @media (max-width: 40rem) {
    dl div {
      grid-template-columns: 1fr;
      gap: var(--abstand-klein);
    }
  }
</style>
