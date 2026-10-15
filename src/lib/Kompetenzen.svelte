<script>
  import {
    arbeitsphasen,
    bereiche,
    fassungen,
    filtere,
    findeFachbegriffe,
    gruppiere,
    imZiel,
    lernorte,
    taxonomiestufen,
    ziele,
  } from './bildungsplan.js';
  import { fassung } from './fassung.svelte.js';
  import Banane from './Banane.svelte';
  import Zielgruppen from './Zielgruppen.svelte';

  let suche = $state('');
  let lernort = $state('');
  let stufen = $state([]);
  let gewaehlteBereiche = $state([]);

  let phasen = $state([]);

  // Die Suche bleibt beim Scrollen stehen, solange sie etwas enthält oder bearbeitet wird.
  let fokus = $state(false);
  let hoeheSuche = $state(0);
  const fest = $derived(suche !== '' || fokus);

  /** @type {HTMLInputElement} */
  let suchfeld;

  /** Leert die Suche und lässt den Cursor im Feld, damit gleich weitergetippt werden kann. */
  function sucheLeeren() {
    suche = '';
    suchfeld.focus();
  }

  const treffer = $derived(
    filtere(ziele, {
      suche,
      lernort,
      stufen,
      bereiche: gewaehlteBereiche,
      phasen,
      fassung: fassung.id,
    }),
  );
  // Trifft die Suche nur Titel oder Beschreibung einer Kompetenz, bleibt bei
  // «nur mit Treffer» ihr Kopf stehen, damit der Treffer nicht verschwindet.
  let zielauswahl = $state('alle');
  const gruppen = $derived(
    gruppiere(treffer).map((gruppe) =>
      zielauswahl === 'treffer' && suche.trim()
        ? { ...gruppe, ziele: gruppe.ziele.filter((ziel) => imZiel(ziel, suche, fassung.id)) }
        : gruppe,
    ),
  );
  const angezeigt = $derived(gruppen.reduce((summe, gruppe) => summe + gruppe.ziele.length, 0));
  const begriffe = $derived(findeFachbegriffe(suche));
  const eingeschraenkt = $derived(treffer.length < ziele.length);
  // Nur das ganze Wort, nicht «Bananenbrot»; \b genügt nicht, weil es Umlaute nicht als Buchstaben kennt.
  const banane = $derived(/(^|\P{L})banane(\P{L}|$)/iu.test(suche));

  function zuruecksetzen() {
    suche = '';
    lernort = '';
    stufen = [];
    gewaehlteBereiche = [];
    phasen = [];
  }
</script>

<fieldset class="chips gruppe">
  <legend>Version</legend>
  {#each fassungen as eintrag (eintrag.id)}
    <label><input type="radio" bind:group={fassung.id} value={eintrag.id} /><span>{eintrag.name}</span></label>
  {/each}
</fieldset>

<!-- Direkt in der Seite statt in einem Block, damit sie über die ganze Liste kleben kann. -->
<div class="suche" class:fest bind:clientHeight={hoeheSuche}>
  <div class="feld">
    <label for="suche">Suche</label>
    <div class="eingabe">
      <input
        id="suche"
        type="search"
        bind:this={suchfeld}
        bind:value={suche}
        onfocus={() => (fokus = true)}
        onblur={() => (fokus = false)}
        placeholder="Stichwort oder Nummer, etwa Moodboard oder b1.1"
      />
      {#if suche}
        <button type="button" class="leeren" aria-label="Suche löschen" onclick={sucheLeeren}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="square" />
          </svg>
        </button>
      {/if}
    </div>
  </div>
  <fieldset class="chips gruppe">
    <legend>Ziele zeigen</legend>
    <label><input type="radio" bind:group={zielauswahl} value="alle" /><span>alle der Kompetenz</span></label>
    <label><input type="radio" bind:group={zielauswahl} value="treffer" /><span>nur mit Treffer</span></label>
  </fieldset>
</div>

<div class="filter">
  <div class="nebeneinander">
    <fieldset class="chips gruppe">
      <legend>Lernort</legend>
      <label><input type="radio" bind:group={lernort} value="" /><span>Beide</span></label>
      {#each lernorte as ort (ort.id)}
        <label><input type="radio" bind:group={lernort} value={ort.id} /><span>{ort.name}</span></label>
      {/each}
    </fieldset>

    <fieldset class="chips">
      <legend>Taxonomiestufe</legend>
      {#each taxonomiestufen as eintrag (eintrag.stufe)}
        <label title={eintrag.beschreibung} data-stufe={eintrag.stufe}>
          <input type="checkbox" bind:group={stufen} value={eintrag.stufe} />
          <span>{eintrag.kuerzel} {eintrag.begriff}</span>
        </label>
      {/each}
    </fieldset>
  </div>

  <fieldset class="chips">
    <legend>Handlungskompetenzbereich</legend>
    {#each bereiche as bereich (bereich.id)}
      <label>
        <input type="checkbox" bind:group={gewaehlteBereiche} value={bereich.id} />
        <span><strong>{bereich.id}</strong> {bereich.titel}</span>
      </label>
    {/each}
  </fieldset>

  <fieldset class="chips">
    <legend
      >Arbeitsphase <span class="zusatz"
        >nach <a href="https://graphicdesignworkflow.ch/" target="_blank" rel="noopener">Graphic Design Workflow</a></span
      ></legend
    >
    {#each arbeitsphasen as phase (phase.id)}
      <label>
        <input type="checkbox" bind:group={phasen} value={phase.id} />
        <span class="phase" style:--phase={phase.farbe}>{phase.name}</span>
      </label>
    {/each}
  </fieldset>
</div>

<p class="stand" aria-live="polite">
  {angezeigt} von {ziele.length} Leistungszielen
  {#if eingeschraenkt}
    <button class="schlicht" onclick={zuruecksetzen}>Filter zurücksetzen</button>
  {/if}
</p>

{#each begriffe as eintrag (eintrag.begriff)}
  <p class="begriff"><strong>{eintrag.begriff}:</strong> {eintrag.definition}</p>
{/each}

<div style:--oben="{fest ? hoeheSuche : 0}px">
  <Zielgruppen {gruppen} anker {suche} />
</div>

{#if banane}
  <Banane />
{/if}

<style>
  /* So breit wie die Beschreibung einer Handlungskompetenz. */
  .filter {
    max-width: 62.75rem;
    display: grid;
    gap: var(--abstand);
  }

  /* Bricht auf schmalen Bildschirmen wieder untereinander um. */
  .nebeneinander {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand) var(--abstand-gross);
  }

  /*
   * Die Suche hat immer Grund und Innenabstand, damit beim Umschalten auf
   * «fest» nichts springt; fest läuft der Grund über die ganze Breite.
   */
  .suche {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand-klein) var(--abstand);
    align-items: end;
    padding-block: var(--abstand);
    background: var(--grund);
  }

  /* Das Feld nimmt den Platz neben dem Umschalter, höchstens so breit wie bisher. */
  .feld {
    flex: 1 1 20rem;
    max-width: 62.75rem;
  }

  .eingabe {
    position: relative;
  }

  /*
   * Platz rechts für das eigene X; das eingebaute der Browser fällt weg.
   * Schrift und Zeilenhöhe der Buttons, damit das Feld so hoch ist wie der Umschalter daneben.
   */
  .eingabe input {
    padding-right: 2.75rem;
    font-size: var(--schrift-klein);
    line-height: inherit;
  }

  .eingabe input::-webkit-search-cancel-button {
    appearance: none;
  }

  .leeren {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    width: 2.75rem;
    padding: 0;
    background: none;
    border: 0;
    color: var(--text-leise);
  }

  .leeren:hover {
    color: var(--akzent);
  }

  .fest {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .zusatz {
    color: var(--text-leise);
    font-weight: 300;
  }

  .zusatz a {
    color: inherit;
  }

  .zusatz a:hover {
    color: var(--akzent);
  }

  /* Die Phasenfarbe füllt innerhalb der Kontur einen Streifen über die volle Höhe. */
  .phase {
    padding-left: calc(0.75rem + var(--abstand));
    box-shadow: inset 0.75rem 0 var(--phase);
  }

  .stand {
    display: flex;
    gap: var(--abstand);
    align-items: baseline;
    margin: var(--abstand-gross) 0 0;
    color: var(--text-leise);
  }

  .begriff {
    margin: var(--abstand) 0 0;
    padding: var(--abstand);
    background: var(--flaeche);
  }
</style>
