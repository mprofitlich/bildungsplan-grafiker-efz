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

  let aktuell = $state(glossar[0].id);

  /**
   * Bestimmt den Abschnitt, in dem man gerade liest: den letzten, dessen
   * Anfang das obere Drittel unter dem Menü erreicht hat. Ganz unten gilt der
   * letzte, auch wenn er zu kurz ist, um so weit nach oben zu kommen.
   */
  function bestimmeAktuell() {
    const menue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menue')) || 0;
    const grenze = menue + (window.innerHeight - menue) / 3;
    const unten = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let id = glossar[0].id;
    for (const abschnitt of glossar) {
      if (document.getElementById(`glossar-${abschnitt.id}`)?.getBoundingClientRect().top <= grenze) id = abschnitt.id;
    }
    aktuell = unten ? glossar.at(-1).id : id;
  }

  $effect(bestimmeAktuell);

  /** Scrollt zum Abschnitt, ohne die Adresse zu ändern: Die App kennt keine Adressen für Ansichten. */
  function springe(event, id) {
    event.preventDefault();
    // Wer im System weniger Bewegung eingestellt hat, springt weiterhin direkt.
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`glossar-${id}`)?.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth' });
  }
</script>

<svelte:window onscroll={bestimmeAktuell} onresize={bestimmeAktuell} />

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
          <a
            href="#glossar-{abschnitt.id}"
            aria-current={aktuell === abschnitt.id ? 'location' : undefined}
            onclick={(event) => springe(event, abschnitt.id)}>{abschnitt.titel}</a
          >
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

  nav li {
    position: relative;
  }

  nav a[aria-current] {
    color: var(--akzent);
    font-weight: 600;
  }

  /* Der Balken liegt auf der Linie der Leiste, wie der Strich an Zielen im aktiven Kurs. */
  nav a[aria-current]::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(-1 * var(--abstand) - 1px);
    width: 3px;
    background: var(--akzent);
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

    /* Ohne Linie kein Balken; Farbe und Gewicht genügen. */
    nav a[aria-current]::before {
      content: none;
    }
  }

  @media (max-width: 40rem) {
    dl div {
      grid-template-columns: 1fr;
      gap: var(--abstand-klein);
    }
  }
</style>
