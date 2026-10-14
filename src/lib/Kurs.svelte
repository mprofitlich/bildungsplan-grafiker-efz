<script>
  import { fassung } from './fassung.svelte.js';
  import { fassungen, gruppiere, ziel } from './katalog.js';
  import KProfil from './KProfil.svelte';
  import {
    aktiverKurs,
    kursAnlegen,
    kursLoeschen,
    sicherung,
    sicherungEinlesen,
    zustand,
  } from './kurse.svelte.js';
  import { nachweis } from './nachweis.js';
  import Uebersicht from './Uebersicht.svelte';
  import Vorschlag from './Vorschlag.svelte';
  import { verfuegbar } from './vorschlag.svelte.js';
  import Zielgruppen from './Zielgruppen.svelte';

  const kurs = $derived(aktiverKurs());
  const gewaehlt = $derived(kurs.ziele.map(ziel).filter(Boolean));
  const gruppen = $derived(gruppiere(gewaehlt));
  const anzahl = $derived(
    Object.fromEntries(gruppen.map((gruppe) => [gruppe.kompetenz.id, gruppe.ziele.length])),
  );
  const text = $derived(nachweis(kurs, fassung.id));

  let meldung = $state('');

  async function kopieren() {
    await navigator.clipboard.writeText(text);
    meldung = 'Nachweis kopiert.';
  }

  function loeschen() {
    if (confirm(`Kurs «${kurs.titel}» mit ${kurs.ziele.length} Leistungszielen löschen?`)) kursLoeschen();
  }

  function sichern() {
    const verweis = document.createElement('a');
    verweis.href = URL.createObjectURL(new Blob([sicherung()], { type: 'application/json' }));
    verweis.download = 'bildungsplan-kurse.json';
    verweis.click();
    URL.revokeObjectURL(verweis.href);
  }

  async function einlesen(event) {
    const datei = event.currentTarget.files[0];
    event.currentTarget.value = '';
    if (!datei) return;
    if (!confirm('Alle Kurse durch den Inhalt der Sicherung ersetzen?')) return;
    meldung = sicherungEinlesen(await datei.text())
      ? 'Sicherung eingelesen.'
      : 'Die Datei ist keine gültige Sicherung.';
  }
</script>

<div class="auswahl">
  <label class="feld">
    <span>Kurs</span>
    <select bind:value={zustand.aktiv}>
      {#each zustand.kurse as eintrag (eintrag.id)}
        <option value={eintrag.id}>{eintrag.titel || 'Kurs ohne Titel'} ({eintrag.ziele.length})</option>
      {/each}
    </select>
  </label>
  <button onclick={kursAnlegen}>Neuer Kurs</button>
  <button onclick={loeschen}>Kurs löschen</button>
</div>

<label class="feld">
  <span>Titel</span>
  <input type="text" bind:value={kurs.titel} />
</label>

<label class="feld">
  <span>Beschrieb</span>
  <textarea rows="4" bind:value={kurs.beschrieb}></textarea>
</label>

{#if verfuegbar}
  <Vorschlag {kurs} />
{/if}

{#if gewaehlt.length === 0}
  <h2>Leistungsziele (0)</h2>
  <p class="leise">Noch keine Leistungsziele gewählt. Im Katalog lassen sie sich hinzufügen.</p>
{:else}
  <h2>Taxonomiestufen</h2>
  <KProfil ziele={gewaehlt} />

  <h2>Im Bildungsplan</h2>
  <Uebersicht {anzahl} />

  <h2>Leistungsziele ({gewaehlt.length})</h2>
  <Zielgruppen {gruppen} />

  <h2>Nachweis</h2>
  <p class="leise">
    Version {fassungen.find((eintrag) => eintrag.id === fassung.id).name}, umschaltbar im Katalog.
  </p>
  <textarea class="nachweis" readonly rows="14" value={text}></textarea>
  <p><button onclick={kopieren}>Nachweis kopieren</button></p>
{/if}

<h2>Sicherung</h2>
<p class="leise">Die Kurse liegen nur in diesem Browser. Eine Sicherungsdatei schützt vor Verlust.</p>
<div class="auswahl">
  <button onclick={sichern}>Sicherung herunterladen</button>
  <label class="feld">
    <span>Sicherung einlesen</span>
    <input type="file" accept="application/json" onchange={einlesen} />
  </label>
</div>

<p class="leise" aria-live="polite">{meldung}</p>

<style>
  .auswahl {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand);
    align-items: end;
  }

  .auswahl {
    margin-bottom: var(--abstand);
  }

  .auswahl .feld {
    flex: 1 1 16rem;
    margin-bottom: 0;
  }

  .feld {
    margin-bottom: var(--abstand);
  }

  h2 {
    margin: var(--abstand-gross) 0 var(--abstand);
    font-size: 1.375rem;
  }

  .nachweis {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--schrift-klein);
  }

  .leise {
    color: var(--text-leise);
  }
</style>
