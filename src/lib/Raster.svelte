<script>
  /**
   * Zeigt das Raster der Seite als Hilfslinien wie in InDesign: die Ränder
   * magenta, die Spalten eines Leistungsziels cyan. Die Lage wird auf der Seite
   * gemessen und folgt Fensterbreite und Suchergebnis.
   * Liegt über allem und lässt jeden Klick durch.
   */

  /** @type {{ x: number, rand: boolean }[]} */
  let linien = $state([]);

  function messen() {
    const main = document.querySelector('main');
    if (!main) return;
    const stil = getComputedStyle(main);
    const box = main.getBoundingClientRect();
    const neu = [
      { x: box.left + parseFloat(stil.paddingLeft), rand: true },
      // Die Linie liegt innerhalb des Satzspiegels, also ein Pixel vor seiner rechten Kante.
      { x: box.right - parseFloat(stil.paddingRight) - 1, rand: true },
    ];
    const ziel = main.querySelector('li:has(> .wahl)');
    for (const spalte of ['.stufe', '.inhalt', '.wahl']) {
      const element = ziel?.querySelector(`:scope > ${spalte}`);
      if (element) neu.push({ x: element.getBoundingClientRect().left, rand: false });
    }
    const eindeutig = neu.filter((linie, i) => neu.findIndex((andere) => Math.abs(andere.x - linie.x) < 1) === i);
    // Die Linien liegen selbst in main; ohne diesen Vergleich löste jedes Zeichnen das nächste Messen aus.
    if (JSON.stringify(eindeutig) !== JSON.stringify(linien)) linien = eindeutig;
  }

  $effect(() => {
    messen();
    const main = document.querySelector('main');
    // Neue Treffer und Umbrüche ändern die Spalten, nicht nur die Fensterbreite.
    const beobachter = new MutationObserver(messen);
    beobachter.observe(main, { childList: true, subtree: true });
    window.addEventListener('resize', messen);
    return () => {
      beobachter.disconnect();
      window.removeEventListener('resize', messen);
    };
  });
</script>

<div class="raster" aria-hidden="true">
  {#each linien as linie (linie.x)}
    <span class:rand={linie.rand} style:left="{Math.round(linie.x)}px"></span>
  {/each}
</div>

<style>
  .raster {
    position: fixed;
    inset: 0;
    z-index: 10;
    pointer-events: none;
  }

  /* Hilfslinien in Cyan, Ränder in Magenta – die Vorgaben von InDesign. */
  span {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #00b4ff;
  }

  .rand {
    background: #ff00ff;
  }
</style>
