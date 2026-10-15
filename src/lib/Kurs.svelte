<script>
  import { fassung } from './fassung.svelte.js';
  import { fassungen, gruppiere, ziel } from './bildungsplan.js';
  import KProfil from './KProfil.svelte';
  import { aktiverKurs, kursLoeschen } from './kurse.svelte.js';
  import { nachweis } from './nachweis.js';
  import Uebersicht from './Uebersicht.svelte';
  import Vorschlag from './Vorschlag.svelte';
  import { verfuegbar } from './vorschlag.svelte.js';
  import Zielgruppen from './Zielgruppen.svelte';

  /** `ongeloescht` führt nach dem Löschen zurück zur Übersicht der Kurse. */
  let { ongeloescht } = $props();

  const kurs = $derived(aktiverKurs());
  const gewaehlt = $derived(kurs.ziele.map(ziel).filter(Boolean));
  const gruppen = $derived(gruppiere(gewaehlt));
  const anzahl = $derived(
    Object.fromEntries(gruppen.map((gruppe) => [gruppe.kompetenz.id, gruppe.ziele.length])),
  );
  const text = $derived(nachweis(kurs, fassung.id));

  let meldung = $state('');

  /** @type {HTMLTextAreaElement} */
  let beschrieb;
  let fensterbreite = $state(0);

  /*
   * Der Beschrieb wächst mit dem Inhalt; `rows` bleibt die Mindesthöhe, weil
   * «auto» zuerst darauf zurückfällt. Per Script statt `field-sizing: content`,
   * das noch nicht alle Browser kennen. Die Fensterbreite zählt mit, weil sich
   * mit ihr der Umbruch ändert.
   */
  $effect(() => {
    kurs.beschrieb;
    fensterbreite;
    beschrieb.style.height = 'auto';
    beschrieb.style.height = `${beschrieb.scrollHeight + beschrieb.offsetHeight - beschrieb.clientHeight}px`;
  });

  async function kopieren() {
    await navigator.clipboard.writeText(text);
    meldung = 'Nachweis kopiert.';
  }

  function loeschen() {
    if (!confirm(`Kurs «${kurs.titel}» mit ${kurs.ziele.length} Leistungszielen löschen?`)) return;
    kursLoeschen();
    ongeloescht();
  }
</script>

<svelte:window bind:innerWidth={fensterbreite} />

<label class="feld">
  <span>Titel</span>
  <input type="text" bind:value={kurs.titel} />
</label>

<label class="feld">
  <span>Beschrieb</span>
  <textarea class="beschrieb" rows="4" bind:this={beschrieb} bind:value={kurs.beschrieb}></textarea>
</label>

{#if verfuegbar}
  <Vorschlag {kurs} />
{/if}

{#if gewaehlt.length === 0}
  <h2>Leistungsziele (0)</h2>
  <p class="leise">Noch keine Leistungsziele gewählt. Unter «Kompetenzen» lassen sie sich hinzufügen.</p>
{:else}
  <h2>Taxonomiestufen</h2>
  <KProfil ziele={gewaehlt} />

  <h2>Im Bildungsplan</h2>
  <Uebersicht {anzahl} />

  <h2>Leistungsziele ({gewaehlt.length})</h2>
  <Zielgruppen {gruppen} />

  <h2>Nachweis</h2>
  <p class="leise">
    Version {fassungen.find((eintrag) => eintrag.id === fassung.id).name}, umschaltbar unter «Kompetenzen».
  </p>
  <textarea class="nachweis" readonly rows="14" value={text}></textarea>
  <p><button onclick={kopieren}>Nachweis kopieren</button></p>
{/if}

<p class="leise" aria-live="polite">{meldung}</p>

<p><button class="loeschen" onclick={loeschen}>Kurs löschen</button></p>

<style>
  .feld {
    margin-bottom: var(--abstand);
  }

  /* Die Höhe folgt dem Inhalt; ein Ziehgriff und eine Bildlaufleiste wären dabei nur im Weg. */
  .beschrieb {
    overflow: hidden;
    resize: none;
  }

  h2 {
    margin: var(--abstand-gross) 0 var(--abstand);
    font-size: 1.375rem;
  }

  .loeschen {
    border-color: var(--gefahr);
    color: var(--gefahr);
  }

  .loeschen:hover {
    background: var(--gefahr);
    border-color: var(--gefahr);
    color: var(--gefahr-text);
  }

  .nachweis {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--schrift-klein);
  }

  p {
    margin: var(--abstand) 0;
  }

  .leise {
    color: var(--text-leise);
  }
</style>
