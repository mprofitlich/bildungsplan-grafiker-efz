<script>
  import { tick } from 'svelte';
  import Banane from './lib/Banane.svelte';
  import Erklaerung from './lib/Erklaerung.svelte';
  import Glossar from './lib/Glossar.svelte';
  import Hilfe from './lib/Hilfe.svelte';
  import Kompetenzen from './lib/Kompetenzen.svelte';
  import Kurs from './lib/Kurs.svelte';
  import MeineKurse from './lib/MeineKurse.svelte';
  import Neuigkeiten from './lib/Neuigkeiten.svelte';
  import Pfeil from './lib/Pfeil.svelte';
  import Uebersicht from './lib/Uebersicht.svelte';
  import { quelle } from './lib/bildungsplan.js';
  import { hinweise } from './lib/hinweise.svelte.js';
  import { aktiverKurs } from './lib/kurse.svelte.js';

  const stand = new Intl.DateTimeFormat('de-CH', { dateStyle: 'long' }).format(new Date(quelle.stand));

  /** @type {'kompetenzen' | 'uebersicht' | 'glossar' | 'meine-kurse' | 'kurs' | 'hilfe'} */
  let ansicht = $state('kompetenzen');
  const kurs = $derived(aktiverKurs());

  /** @type {HTMLElement} */
  let kopf = $state();
  /** @type {HTMLButtonElement} */
  let hilfeReiter = $state();

  // Klebende Elemente der Ansichten und Sprungziele halten diesen Abstand zum Menü.
  let menueHoehe = $state(0);
  $effect(() => {
    document.documentElement.style.setProperty('--menue', `${menueHoehe}px`);
  });

  // Wer die Hilfe einmal geöffnet hat, braucht den Pfeil nicht mehr.
  $effect(() => {
    if (ansicht === 'hilfe') hinweise.pfeil = false;
  });

  /** Öffnet die Ansicht «Kompetenzen» bei einer Handlungskompetenz. */
  async function zeigeKompetenz(kompetenzId) {
    // Die Ansicht startet ohne Filter, die Handlungskompetenz ist also immer sichtbar.
    ansicht = 'kompetenzen';
    await tick();
    document.getElementById(`hk-${kompetenzId}`)?.scrollIntoView();
  }

  // Suche, mit der «Kompetenzen» öffnet; über das Menü immer leer.
  let anfangssuche = $state('');

  function zeigeKompetenzen() {
    anfangssuche = '';
    ansicht = 'kompetenzen';
  }

  /** Öffnet «Kompetenzen» oben auf der Seite, mit einem Begriff in der Suche. */
  async function sucheBegriff(begriff) {
    anfangssuche = begriff;
    ansicht = 'kompetenzen';
    await tick();
    window.scrollTo(0, 0);
  }

  /** Öffnet das Glossar bei einem Abschnitt, etwa `taxonomiestufen`. */
  async function zeigeGlossar(abschnitt) {
    ansicht = 'glossar';
    await tick();
    document.getElementById(`glossar-${abschnitt}`)?.scrollIntoView();
  }

  // So lange ohne Eingabe, bis die Banane erscheint.
  const RUHEZEIT = 5 * 60 * 1000;
  let ruhend = $state(false);
  let uhr;

  /** Startet die Ruhezeit neu; liegt die Banane schon da, bleibt sie, bis jemand klickt. */
  function aufwecken() {
    if (ruhend) return;
    clearTimeout(uhr);
    uhr = setTimeout(() => (ruhend = true), RUHEZEIT);
  }

  function bananeWeg() {
    ruhend = false;
    aufwecken();
  }

  $effect(() => {
    aufwecken();
    return () => clearTimeout(uhr);
  });
</script>

<svelte:window
  onpointermove={aufwecken}
  onpointerdown={aufwecken}
  onkeydown={aufwecken}
  onwheel={aufwecken}
  onscroll={aufwecken}
/>

<header>
  <div class="innen">
    <h1>Bildungsplan Grafikerin/Grafiker EFZ</h1>
    <p class="quelle">{quelle.titel}, vom {stand}</p>
  </div>
</header>

<!-- Ausserhalb des Kopfs, damit das Menü über die ganze Seite kleben kann und nicht nur innerhalb des Kopfs. -->
<div class="menue" bind:clientHeight={menueHoehe}>
  <div class="innen" bind:this={kopf}>
    <nav aria-label="Ansichten">
      <button
        aria-current={ansicht === 'kompetenzen' ? 'page' : undefined}
        onclick={zeigeKompetenzen}
      >
        Kompetenzen
      </button>
      <button
        aria-current={ansicht === 'uebersicht' ? 'page' : undefined}
        onclick={() => (ansicht = 'uebersicht')}
      >
        Übersicht
      </button>
      <button
        aria-current={ansicht === 'glossar' ? 'page' : undefined}
        onclick={() => (ansicht = 'glossar')}
      >
        Glossar
      </button>
      <button
        aria-current={ansicht === 'meine-kurse' ? 'page' : undefined}
        onclick={() => (ansicht = 'meine-kurse')}
      >
        Meine Kurse
      </button>
      <button
        bind:this={hilfeReiter}
        aria-current={ansicht === 'hilfe' ? 'page' : undefined}
        onclick={() => (ansicht = 'hilfe')}
      >
        Hilfe
      </button>
      <button
        class="aktiver-kurs"
        aria-current={ansicht === 'kurs' ? 'page' : undefined}
        onclick={() => (ansicht = 'kurs')}
      >
        Kurs: {kurs.titel || 'ohne Titel'}
        <span class="zahl" title="{kurs.ziele.length} Leistungsziele">{kurs.ziele.length}</span>
      </button>
    </nav>
    {#if hinweise.pfeil && hilfeReiter}
      <Pfeil ziel={hilfeReiter} rahmen={kopf} onweg={() => (hinweise.pfeil = false)} />
    {/if}
  </div>
</div>

<main>
  {#if ansicht === 'kompetenzen'}
    <Kompetenzen onglossar={zeigeGlossar} {anfangssuche} />
  {:else if ansicht === 'uebersicht'}
    <Uebersicht onwahl={zeigeKompetenz} />
  {:else if ansicht === 'glossar'}
    <Glossar onsuche={sucheBegriff} />
  {:else if ansicht === 'meine-kurse'}
    <MeineKurse onoeffne={() => (ansicht = 'kurs')} />
  {:else if ansicht === 'hilfe'}
    <Hilfe />
  {:else}
    <Kurs ongeloescht={() => (ansicht = 'meine-kurse')} />
  {/if}
</main>

<Erklaerung />
<Neuigkeiten onhilfe={() => (ansicht = 'hilfe')} />

{#if ruhend}
  <Banane onweg={bananeWeg} />
{/if}

<style>
  /* Kopf und Menü laufen über die ganze Breite, ihr Inhalt so breit wie die Seite. */
  header,
  .menue {
    background: var(--grundton);
    color: var(--grundton-text);
  }

  /* Beim Scrollen bleibt nur das Menü stehen, der Titel geht mit. */
  .menue {
    position: sticky;
    top: 0;
    z-index: 4;
  }

  .innen,
  main {
    max-width: 90rem;
    margin: 0 auto;
    padding: var(--abstand-gross) var(--abstand);
  }

  header .innen {
    padding-bottom: var(--abstand);
  }

  .menue .innen {
    position: relative;
    padding-top: 0;
    padding-bottom: 0;
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  .quelle {
    max-width: 62.75rem;
    margin: var(--abstand-klein) 0 0;
    color: var(--grundton-text);
    font-size: var(--schrift-klein);
  }

  .menue :focus-visible {
    outline-color: var(--grundton-text);
  }

  /*
   * Reiter über die ganze Breite; der aktive Kurs steht rechts abgesetzt.
   * Auf schmalen Bildschirmen scrollt die Zeile, statt umzubrechen. Die Linie
   * ist deshalb ein Schatten: Ein Rahmen mit negativem Rand würde vom
   * Scrollbereich abgeschnitten.
   */
  nav {
    display: flex;
    gap: var(--abstand-gross);
    overflow-x: auto;
    scrollbar-width: none;
  }

  nav button {
    display: flex;
    flex: none;
    gap: var(--abstand-klein);
    align-items: center;
    padding: var(--abstand) 0;
    white-space: nowrap;
    background: none;
    border: 0;
    border-bottom: 3px solid transparent;
    color: var(--grundton-text);
    font-weight: 500;
  }

  /* Weiss ist auf dem Violett schon an der Kontrastgrenze; der Hover zeigt sich deshalb am Unterstrich. */
  nav button:hover {
    border-bottom-color: color-mix(in srgb, var(--grundton-text) 50%, transparent);
  }

  nav button[aria-current='page'] {
    background: none;
    border-bottom-color: var(--grundton-text);
    color: var(--grundton-text);
    font-weight: 600;
  }

  .aktiver-kurs {
    margin-left: auto;
  }

  .zahl {
    padding: 0 0.45em;
    background: color-mix(in srgb, var(--grundton-text) 18%, transparent);
    color: var(--grundton-text);
    font-size: var(--schrift-klein);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  [aria-current='page'] .zahl {
    background: var(--grundton-text);
    color: var(--grundton);
  }
</style>
