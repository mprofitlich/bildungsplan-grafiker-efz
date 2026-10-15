<script>
  /**
   * Zeigt die Seite wie freigestellt in Photoshop: Zwischen den Elementen
   * liegt das Schachbrett der Transparenz, und um den Rahmen unter dem Zeiger
   * laufen die Ameisen einer Auswahl. Bei reduzierter Bewegung stehen sie
   * still. Liegt über allem und lässt jeden Klick durch.
   */
  import { aeussererRahmen } from './ostereier.js';

  /** @type {HTMLElement | null} */
  let element = null;
  /** @type {{ x: number, y: number, breite: number, hoehe: number } | null} */
  let auswahl = $state(null);

  function messen() {
    if (!element?.isConnected) {
      auswahl = null;
      return;
    }
    const kante = element.getBoundingClientRect();
    auswahl = { x: kante.left, y: kante.top, breite: kante.width, hoehe: kante.height };
  }

  /** @param {PointerEvent} event */
  function zeigen(event) {
    if (!(event.target instanceof Element)) return;
    const rahmen = aeussererRahmen(event.target);
    if (rahmen === element) return;
    element = rahmen;
    messen();
  }

  $effect(() => {
    document.documentElement.classList.add('freistellen');
    document.addEventListener('pointerover', zeigen);
    // Beim Scrollen bleibt der Zeiger stehen, der Rahmen aber wandert unter ihm weg.
    window.addEventListener('scroll', messen, { passive: true });
    window.addEventListener('resize', messen);
    return () => {
      document.documentElement.classList.remove('freistellen');
      document.removeEventListener('pointerover', zeigen);
      window.removeEventListener('scroll', messen);
      window.removeEventListener('resize', messen);
    };
  });
</script>

{#if auswahl}
  <div
    class="ameisen"
    aria-hidden="true"
    style:left="{auswahl.x - 1}px"
    style:top="{auswahl.y - 1}px"
    style:width="{auswahl.breite + 2}px"
    style:height="{auswahl.hoehe + 2}px"
  ></div>
{/if}

<style>
  /* Durchsichtig ist nur die Seite; die Elemente darauf sind freigestellt. */
  :global(html.freistellen body) {
    background: repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 0 0 / 16px 16px;
  }

  /* Wie die dunkle Rasterfarbe in Photoshop. */
  @media (prefers-color-scheme: dark) {
    :global(html.freistellen body) {
      background: repeating-conic-gradient(#2c2c2c 0 25%, #1c1c1c 0 50%) 0 0 / 16px 16px;
    }
  }

  /*
   * Die Rahmen aus RAHMEN in ostereier.js behalten ihren Grund, damit die
   * Texte lesbar bleiben. Die Legende steht über der Kante des Feldsets und
   * braucht ihren eigenen.
   */
  :global(html.freistellen main :is(h1, h2, h3, p, fieldset, legend, li:has(> .wahl))) {
    background: var(--grund);
  }

  /*
   * Vier gestrichelte Kanten, deren Striche ringsum im Uhrzeigersinn laufen.
   * Schwarz und Weiss im Wechsel, damit die Auswahl auf jedem Grund sichtbar bleibt.
   */
  .ameisen {
    position: fixed;
    z-index: 10;
    pointer-events: none;
    background-image:
      linear-gradient(to right, #000 50%, #fff 50%),
      linear-gradient(to right, #000 50%, #fff 50%),
      linear-gradient(to bottom, #000 50%, #fff 50%),
      linear-gradient(to bottom, #000 50%, #fff 50%);
    background-size:
      8px 1px,
      8px 1px,
      1px 8px,
      1px 8px;
    background-position:
      0 0,
      0 100%,
      100% 0,
      0 0;
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    animation: ameisen 0.5s linear infinite;
  }

  @keyframes ameisen {
    to {
      background-position:
        8px 0,
        -8px 100%,
        100% 8px,
        0 -8px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ameisen {
      animation: none;
    }
  }
</style>
