<script>
  import { verberge, zeige } from './erklaerung.svelte.js';
  import { taxonomiestufen } from './bildungsplan.js';

  /** `stufe` ist `null`, wo die Broschüre ein Ziel ohne Taxonomiestufe führt. */
  let { stufe } = $props();
  const eintrag = $derived(taxonomiestufen.find((eintrag) => eintrag.stufe === stufe));
  const erklaerung = $derived(
    eintrag
      ? `${eintrag.kuerzel} ${eintrag.begriff}: ${eintrag.beschreibung}`
      : 'Die Broschüre nennt für dieses Ziel keine Taxonomiestufe.',
  );
</script>

<button
  type="button"
  class="stufe"
  data-stufe={stufe}
  aria-describedby="erklaerung"
  onmouseenter={(event) => zeige(event.currentTarget, erklaerung)}
  onfocus={(event) => zeige(event.currentTarget, erklaerung)}
  onmouseleave={verberge}
  onblur={verberge}>{eintrag ? eintrag.kuerzel : 'K–'}</button
>

<style>
  button {
    border: 0;
    cursor: help;
  }
</style>
