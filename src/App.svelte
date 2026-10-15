<script>
  import { tick } from 'svelte';
  import Banane from './lib/Banane.svelte';
  import Erklaerung from './lib/Erklaerung.svelte';
  import Kompetenzen from './lib/Kompetenzen.svelte';
  import Kurs from './lib/Kurs.svelte';
  import MeineKurse from './lib/MeineKurse.svelte';
  import Uebersicht from './lib/Uebersicht.svelte';
  import { quelle } from './lib/bildungsplan.js';
  import { aktiverKurs } from './lib/kurse.svelte.js';

  const stand = new Intl.DateTimeFormat('de-CH', { dateStyle: 'long' }).format(new Date(quelle.stand));

  /** @type {'kompetenzen' | 'uebersicht' | 'meine-kurse' | 'kurs'} */
  let ansicht = $state('kompetenzen');
  const kurs = $derived(aktiverKurs());

  /** Öffnet die Ansicht «Kompetenzen» bei einer Handlungskompetenz. */
  async function zeigeKompetenz(kompetenzId) {
    // Die Ansicht startet ohne Filter, die Handlungskompetenz ist also immer sichtbar.
    ansicht = 'kompetenzen';
    await tick();
    document.getElementById(`hk-${kompetenzId}`)?.scrollIntoView();
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
    <div class="titel">
      <h1>Bildungsplan Grafikerin/Grafiker EFZ</h1>
      <p class="quelle">{quelle.titel}, vom {stand}</p>
    </div>
    <nav aria-label="Ansichten">
      <button
        aria-current={ansicht === 'kompetenzen' ? 'page' : undefined}
        onclick={() => (ansicht = 'kompetenzen')}
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
        aria-current={ansicht === 'meine-kurse' ? 'page' : undefined}
        onclick={() => (ansicht = 'meine-kurse')}
      >
        Meine Kurse
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
  </div>
</header>

<main>
  {#if ansicht === 'kompetenzen'}
    <Kompetenzen />
  {:else if ansicht === 'uebersicht'}
    <Uebersicht onwahl={zeigeKompetenz} />
  {:else if ansicht === 'meine-kurse'}
    <MeineKurse onoeffne={() => (ansicht = 'kurs')} />
  {:else}
    <Kurs ongeloescht={() => (ansicht = 'meine-kurse')} />
  {/if}
</main>

<Erklaerung />

{#if ruhend}
  <Banane onweg={bananeWeg} />
{/if}

<style>
  /* Die Kopfleiste läuft über die ganze Breite, ihr Inhalt so breit wie die Seite. */
  header {
    background: var(--grundton);
    color: var(--grundton-text);
  }

  .innen,
  main {
    max-width: 90rem;
    margin: 0 auto;
    padding: var(--abstand-gross) var(--abstand);
  }

  .innen {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand);
    align-items: baseline;
    justify-content: space-between;
    padding-bottom: 0;
  }

  .titel {
    flex: 1 1 30rem;
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

  header :focus-visible {
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
    flex: 1 1 100%;
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
