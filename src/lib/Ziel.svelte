<script>
  import { fassung } from './fassung.svelte.js';
  import { gegenstueck, lernortName, wortlaut } from './bildungsplan.js';
  import { getroffen } from './hervorhebung.js';
  import { enthaelt, zielUmschalten } from './kurse.svelte.js';
  import Stufe from './Stufe.svelte';
  import Text from './Text.svelte';

  /** `suche` hebt die Suchwörter in Nummer und Text hervor. */
  let { ziel: offiziell, hinweis = '', suche = '' } = $props();
  let offen = $state(false);
  const ziel = $derived(wortlaut(offiziell, fassung.id));
  const anderes = $derived(gegenstueck(offiziell) && wortlaut(gegenstueck(offiziell), fassung.id));
  const imKurs = $derived(enthaelt(ziel.id));
</script>

<li class:im-kurs={imKurs}>
  <div class="kopf">
    <span class="nummer"
      ><svelte:element this={getroffen(ziel.nummer, suche) ? 'mark' : 'span'}
        >{ziel.nummer[0]}<span class="ziffer">{ziel.nummer.slice(1)}</span></svelte:element
      ></span
    >
    <span class="lernort">{lernortName(ziel.lernort)}</span>
  </div>
  <Stufe stufe={ziel.stufe} />
  <div class="inhalt">
    <p><Text text={ziel.text} {suche} /></p>
    {#if hinweis}
      <p class="hinweis">{hinweis}</p>
    {/if}
    {#if anderes}
      <button class="schlicht" aria-expanded={offen} onclick={() => (offen = !offen)}>
        Gegenstück {lernortName(anderes.lernort)}
      </button>
      {#if offen}
        <p class="gegenstueck"><Stufe stufe={anderes.stufe} /> <Text text={anderes.text} /></p>
      {/if}
    {/if}
  </div>
  <button class="wahl" aria-pressed={imKurs} onclick={() => zielUmschalten(ziel.id)}>
    {imKurs ? 'Entfernen' : 'Hinzufügen'}
  </button>
</li>

<style>
  li {
    display: grid;
    grid-template-columns: 7rem 2.25rem 1fr 7.5rem;
    gap: var(--abstand);
    align-items: start;
    padding: var(--abstand) 0 var(--abstand) calc(var(--abstand) - 3px);
    border-top: 1px solid var(--linie);
    border-left: 3px solid transparent;
  }

  /* Ziele im aktiven Kurs tragen links einen Strich, wie der aktive Kurs in «Meine Kurse». */
  li.im-kurs {
    border-left-color: var(--akzent);
  }

  .kopf {
    display: flex;
    flex-direction: column;
  }

  .nummer {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .ziffer {
    margin-left: 0.1em;
  }

  .lernort {
    color: var(--text-leise);
    font-size: var(--schrift-klein);
  }

  /* Auch im breiten Layout bleibt die Zeile lesbar kurz. */
  p {
    max-width: 52rem;
    margin: 0;
  }

  .hinweis {
    margin-top: var(--abstand-klein);
    color: var(--text-leise);
    font-size: var(--schrift-klein);
  }

  .gegenstueck {
    margin-top: var(--abstand-klein);
    padding-left: var(--abstand);
    border-left: 2px solid var(--linie);
    color: var(--text-leise);
  }

  .wahl {
    width: 100%;
  }

  @media (max-width: 40rem) {
    li {
      grid-template-columns: 1fr auto;
    }

    .kopf {
      flex-direction: row;
      gap: var(--abstand-klein);
      align-items: baseline;
    }

    .inhalt {
      grid-column: 1 / -1;
      grid-row: 2;
    }

    .wahl {
      grid-column: 1 / -1;
    }
  }
</style>
