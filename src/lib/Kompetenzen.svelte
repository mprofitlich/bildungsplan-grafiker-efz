<script>
  import {
    arbeitsphasen,
    bereiche,
    fassungen,
    filtere,
    findeFachbegriffe,
    gruppiere,
    lernorte,
    taxonomiestufen,
    ziele,
  } from './bildungsplan.js';
  import { fassung } from './fassung.svelte.js';
  import Zielgruppen from './Zielgruppen.svelte';

  let suche = $state('');
  let lernort = $state('');
  let stufen = $state([]);
  let gewaehlteBereiche = $state([]);

  let phasen = $state([]);

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
  const gruppen = $derived(gruppiere(treffer));
  const begriffe = $derived(findeFachbegriffe(suche));
  const eingeschraenkt = $derived(treffer.length < ziele.length);

  function zuruecksetzen() {
    suche = '';
    lernort = '';
    stufen = [];
    gewaehlteBereiche = [];
    phasen = [];
  }
</script>

<form class="filter" onsubmit={(event) => event.preventDefault()}>
  <fieldset class="chips gruppe">
    <legend>Version</legend>
    {#each fassungen as eintrag (eintrag.id)}
      <label><input type="radio" bind:group={fassung.id} value={eintrag.id} /><span>{eintrag.name}</span></label>
    {/each}
  </fieldset>

  <label class="feld">
    <span>Suche</span>
    <input type="search" bind:value={suche} placeholder="Stichwort oder Nummer, etwa Moodboard oder b1.1" />
  </label>

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
</form>

<p class="stand" aria-live="polite">
  {treffer.length} von {ziele.length} Leistungszielen
  {#if eingeschraenkt}
    <button class="schlicht" onclick={zuruecksetzen}>Filter zurücksetzen</button>
  {/if}
</p>

{#each begriffe as eintrag (eintrag.begriff)}
  <p class="begriff"><strong>{eintrag.begriff}:</strong> {eintrag.definition}</p>
{/each}

<Zielgruppen {gruppen} anker />

<style>
  /* So breit wie die Beschreibung einer Handlungskompetenz. */
  .filter {
    max-width: 62.75rem;
    display: grid;
    gap: var(--abstand);
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
