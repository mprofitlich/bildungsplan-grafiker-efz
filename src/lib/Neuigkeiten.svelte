<script>
  import { hinweise, neuigkeitenGelesen } from './hinweise.svelte.js';
  import { offen } from './neuigkeiten.js';

  /** `onhilfe` öffnet die Hilfe. */
  let { onhilfe } = $props();

  // Nur beim Laden bestimmt, damit die Liste beim Schliessen nicht leer flackert.
  const liste = offen(hinweise);

  /** @type {HTMLDialogElement} */
  let fenster;

  $effect(() => {
    if (liste.length > 0) fenster.showModal();
  });

  function zurHilfe() {
    fenster.close();
    onhilfe();
  }
</script>

{#if liste.length > 0}
  <!-- Jedes Schliessen, auch mit Escape, gilt als gelesen. -->
  <dialog bind:this={fenster} aria-labelledby="neuigkeiten-titel" onclose={neuigkeitenGelesen}>
    <h2 id="neuigkeiten-titel">Neue Funktionen</h2>
    <ul>
      {#each liste as neuigkeit (neuigkeit.id)}
        <li><strong>{neuigkeit.titel}</strong>: {neuigkeit.text}</li>
      {/each}
    </ul>
    <div class="knoepfe">
      <button class="schlicht" onclick={zurHilfe}>Zur Hilfe</button>
      <!-- svelte-ignore a11y_autofocus -->
      <button class="schliessen" autofocus onclick={() => fenster.close()}>Schliessen</button>
    </div>
  </dialog>
{/if}

<style>
  dialog {
    width: min(28rem, calc(100vw - 2rem));
    padding: var(--abstand-gross);
    background: var(--grund);
    border: var(--rahmen-breite) solid var(--rahmen);
    box-shadow: 0.5rem 0.5rem 0 var(--akzent);
    color: var(--text);
  }

  dialog::backdrop {
    background: rgb(0 0 0 / 0.35);
  }

  h2 {
    margin: 0 0 var(--abstand);
    font-size: 1.125rem;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  li + li {
    margin-top: var(--abstand-klein);
  }

  .knoepfe {
    display: flex;
    gap: var(--abstand);
    align-items: center;
    justify-content: flex-end;
    margin-top: var(--abstand-gross);
  }

  .schliessen {
    background: var(--akzent);
    border-color: var(--akzent);
    color: var(--akzent-text);
  }
</style>
