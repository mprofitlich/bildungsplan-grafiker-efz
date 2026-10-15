<script>
  import { gruppiere, lernorte, ziel } from './bildungsplan.js';
  import { enthaelt, zieleHinzufuegen } from './kurse.svelte.js';
  import { vorschlaege, vorschlagen } from './vorschlag.svelte.js';
  import Zielgruppen from './Zielgruppen.svelte';

  let { kurs } = $props();
  let lernort = $state('schule');

  const stand = $derived(vorschlaege[kurs.id]);
  const liste = $derived(stand?.liste ?? []);
  const gruppen = $derived(gruppiere(liste.map((eintrag) => ziel(eintrag.id)).filter(Boolean)));
  const hinweise = $derived(Object.fromEntries(liste.map((eintrag) => [eintrag.id, eintrag.begruendung])));
  const offen = $derived(liste.filter((eintrag) => !enthaelt(eintrag.id)));
  const laeuft = $derived(stand?.status === 'laeuft');
  const bereit = $derived(kurs.beschrieb.trim() !== '' && !laeuft);

  let sekunden = $state(0);
  $effect(() => {
    if (!laeuft) return;
    sekunden = 0;
    const takt = setInterval(() => sekunden++, 1000);
    return () => clearInterval(takt);
  });
</script>

<h2>Vorschlag</h2>
<p class="leise">Claude liest Titel und Beschrieb und schlägt passende Leistungsziele vor.</p>

<fieldset class="chips gruppe">
  <legend>Vorschläge für</legend>
  {#each lernorte as ort (ort.id)}
    <label><input type="radio" bind:group={lernort} value={ort.id} /><span>{ort.name}</span></label>
  {/each}
  <label><input type="radio" bind:group={lernort} value="" /><span>Beide</span></label>
</fieldset>

<p>
  <button disabled={!bereit} aria-busy={laeuft} onclick={() => vorschlagen(kurs, lernort)}>
    {laeuft ? 'Claude arbeitet …' : 'Leistungsziele vorschlagen'}
  </button>
</p>

<div aria-live="polite">
  {#if kurs.beschrieb.trim() === ''}
    <p class="leise">Dafür braucht der Kurs einen Beschrieb.</p>
  {:else if laeuft}
    <p class="beschaeftigt">
      <span class="kreisel" aria-hidden="true"></span>
      <span>
        <strong>Claude liest Beschrieb und Bildungsplan.</strong><br />
        Das dauert meist unter zehn Sekunden. Bisher {sekunden} s.
      </span>
    </p>
  {:else if stand?.status === 'fehler'}
    <p class="fehler">{stand.meldung}</p>
  {:else if stand?.status === 'fertig' && liste.length === 0}
    <p class="leise">Claude hat kein passendes Leistungsziel gefunden. Ein ausführlicherer Beschrieb hilft.</p>
  {:else if stand?.status === 'fertig'}
    <p class="stand">
      {liste.length} Vorschläge, {liste.length - offen.length} davon im Kurs
      {#if offen.length > 0}
        <button onclick={() => zieleHinzufuegen(offen.map((eintrag) => eintrag.id))}>
          Alle {offen.length} hinzufügen
        </button>
      {/if}
    </p>
  {/if}
</div>

{#if stand?.status === 'fertig'}
  <Zielgruppen {gruppen} {hinweise} />
{/if}

<style>
  h2 {
    margin: var(--abstand-gross) 0 var(--abstand);
    font-size: 1.375rem;
  }

  p {
    margin: var(--abstand) 0;
  }

  .stand {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand);
    align-items: center;
  }

  .leise {
    color: var(--text-leise);
  }

  .beschaeftigt {
    display: flex;
    gap: var(--abstand);
    align-items: center;
    padding: var(--abstand);
    background: var(--flaeche);
    border-left: 3px solid var(--akzent);
  }

  .kreisel {
    flex: none;
    width: 1.5rem;
    height: 1.5rem;
    border: 3px solid var(--linie);
    border-top-color: var(--akzent);
    border-radius: 50%;
    animation: drehen 0.9s linear infinite;
  }

  @keyframes drehen {
    to {
      transform: rotate(360deg);
    }
  }

  /* Ohne Drehung bleibt der Sekundenzähler als Zeichen, dass etwas läuft. */
  @media (prefers-reduced-motion: reduce) {
    .kreisel {
      animation: none;
    }
  }

  .fehler {
    padding: var(--abstand);
    background: var(--flaeche);
    border-left: 3px solid var(--warnung);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
