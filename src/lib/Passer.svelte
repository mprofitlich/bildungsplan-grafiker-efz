<script>
  /**
   * Zerlegt Kopf und Inhalt in Cyan, Magenta und Gelb und versetzt die
   * Auszüge gegeneinander, wie ein Druck ausser Passer. Solange eingebunden.
   */
  $effect(() => {
    document.documentElement.classList.add('passer');
    return () => document.documentElement.classList.remove('passer');
  });
</script>

<!--
  Jeder Auszug behält einen Kanal und setzt die anderen auf Weiss; multipliziert
  ergeben die drei wieder das Bild, versetzt bekommen alle Kanten Farbsäume.
-->
<svg class="filter" aria-hidden="true">
  <filter id="passer" color-interpolation-filters="sRGB">
    <feColorMatrix in="SourceGraphic" values="1 0 0 0 0  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
    <feOffset dx="-1.5" dy="0.75" result="cyan" />
    <feColorMatrix in="SourceGraphic" values="0 0 0 0 1  0 1 0 0 0  0 0 0 0 1  0 0 0 1 0" />
    <feOffset dx="1.25" dy="-0.5" result="magenta" />
    <feColorMatrix in="SourceGraphic" values="0 0 0 0 1  0 0 0 0 1  0 0 1 0 0  0 0 0 1 0" />
    <feOffset dx="0.5" dy="1.5" result="gelb" />
    <feBlend in="cyan" in2="magenta" mode="multiply" result="cyan-magenta" />
    <feBlend in="cyan-magenta" in2="gelb" mode="multiply" />
  </filter>
</svg>

<style>
  .filter {
    position: absolute;
    width: 0;
    height: 0;
  }

  /* Kopf und Inhalt statt body: Ein Filter auf body würde fixierte Elemente an ihn binden. */
  :global(html.passer :is(body > * > header, main)) {
    filter: url(#passer);
  }
</style>
