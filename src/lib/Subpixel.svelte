<script>
  /**
   * Zeigt die Seite wie unter der Lupe am Bildschirm: Jeder Bildpunkt zerfällt
   * in einen roten, grünen und blauen Streifen. Gegenstück zum Passer bei CMYK.
   * Liegt über allem und lässt jeden Klick durch.
   */
</script>

<div class="subpixel" aria-hidden="true"></div>

<style>
  /*
   * Multipliziert lässt jeder Streifen nur seinen Kanal durch; abgeschwächt,
   * damit die Seite nicht auf ein Drittel ihrer Helligkeit fällt.
   */
  .subpixel {
    position: fixed;
    inset: 0;
    z-index: 10;
    pointer-events: none;
    background:
      repeating-linear-gradient(to bottom, transparent 0 10px, rgb(0 0 0 / 0.5) 10px 12px),
      repeating-linear-gradient(to right, #ff0000 0 4px, #00ff00 4px 8px, #0000ff 8px 12px);
    mix-blend-mode: multiply;
    opacity: 0.5;
  }
</style>
