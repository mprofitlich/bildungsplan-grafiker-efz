<script>
  /**
   * Vermisst die Seite wie eine Übergabe an die Entwicklung: Innenabstände
   * schraffiert, Lücken zwischen Elementen, Schrift und Rahmen beschriftet,
   * jeweils mit der Variable aus app.css. Die Werte sind auf der Seite
   * gemessen und folgen Scrollen, Fensterbreite und Suchergebnis.
   * Liegt über allem und lässt jeden Klick durch.
   */
  import css from '../app.css?raw';
  import { inPixel, leseTokens, tokenFuer } from './styleguide.js';

  const tokens = leseTokens(css);

  /**
   * @typedef {object} Marke
   * @property {'zone' | 'schild'} art
   * @property {number} x
   * @property {number} y
   * @property {number} [breite]
   * @property {number} [hoehe]
   * @property {string} [text]
   * @property {boolean} [rechts] ob `x` die rechte Kante des Schilds ist
   */

  /** @type {Marke[]} */
  let marken = $state([]);

  /** Gerundet auf eine Nachkommastelle, damit 1.5 Pixel Rahmen nicht zu 2 werden. */
  const zahl = (px) => `${Math.round(px * 10) / 10}`;

  function abstand(px, rem) {
    const name = tokenFuer(px, tokens, 'abstand', rem);
    return name ? `${name} ${zahl(px)}` : zahl(px);
  }

  /** Breite des Texts selbst, nicht des Blocks, der ihn enthält. */
  function textBox(element) {
    const bereich = document.createRange();
    bereich.selectNodeContents(element);
    return bereich.getBoundingClientRect();
  }

  function messen() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    /** @type {Marke[]} */
    const neu = [];
    const finde = (selektor) => document.querySelector(selektor);

    /** Innenabstand oben und links, beschriftet im oberen Streifen. */
    function polster(element, schild = 'innen') {
      if (!element) return;
      const box = element.getBoundingClientRect();
      const stil = getComputedStyle(element);
      const rahmen = parseFloat(stil.borderTopWidth);
      const oben = parseFloat(stil.paddingTop);
      const links = parseFloat(stil.paddingLeft);
      const x = box.left + rahmen;
      const y = box.top + rahmen;
      neu.push({ art: 'zone', x, y, breite: box.width - 2 * rahmen, hoehe: oben });
      neu.push({ art: 'zone', x, y, breite: links, hoehe: box.height - 2 * rahmen });
      let text = `padding ${abstand(oben, rem)} / ${abstand(links, rem)}`;
      if (rahmen) {
        // Bei einfacher Pixeldichte rundet der Browser 1.5 Pixel Rahmen auf 1; dann gilt der Sollwert der Variable.
        const soll = inPixel(tokens.find((t) => t.name === 'rahmen-breite')?.hell ?? '', rem);
        const breite = Math.abs(soll - rahmen) <= 0.5 ? `--rahmen-breite ${zahl(soll)}` : zahl(rahmen);
        text += ` · Rahmen ${breite} · Ecken ${zahl(parseFloat(stil.borderTopLeftRadius))}`;
      }
      // Bei schmalen Streifen steht das Schild rechts über dem Element, wo keine Beschriftung ist, sonst darin.
      neu.push(
        schild === 'innen'
          ? { art: 'schild', x: x + links, y: y + oben / 2 - 8, text }
          : { art: 'schild', x: box.right, y: box.top - 20, text, rechts: true },
      );
    }

    /** Lücke zwischen den ersten beiden sichtbaren Kindern, beschriftet darunter. */
    function luecke(element) {
      if (!element) return;
      const [a, b] = [...element.children]
        .filter((kind) => kind.tagName !== 'LEGEND' && kind.getClientRects().length)
        .map((kind) => kind.getBoundingClientRect());
      if (!b) return;
      const breite = b.left - a.right;
      neu.push({ art: 'zone', x: a.right, y: a.top, breite, hoehe: a.height });
      neu.push({ art: 'schild', x: a.right, y: a.bottom + 2, text: `gap ${abstand(breite, rem)}` });
    }

    /** Schrift, Gewicht, Grösse und Zeilenhöhe, beschriftet rechts neben dem Text. */
    function schrift(element, oben = false) {
      if (!element) return;
      const box = textBox(element);
      const stil = getComputedStyle(element);
      const familie = stil.fontFamily.split(',')[0].replaceAll(/["']/g, '');
      const groesse = parseFloat(stil.fontSize);
      const zeile = parseFloat(stil.lineHeight);
      const text = `${familie} ${stil.fontWeight} · ${zahl(groesse)} / ${zahl(zeile)}`;
      neu.push(oben ? { art: 'schild', x: box.left, y: box.top - 18, text } : { art: 'schild', x: box.right + 8, y: box.top + zeile / 2 - 8, text });
    }

    polster(finde('header .innen'));
    schrift(finde('header h1'));
    luecke(finde('.menue nav'));
    polster(finde('.suche input'), 'oben');
    luecke(finde('.filter .chips:not(.gruppe)'));
    schrift(finde('main li .inhalt > p'), true);

    // Die Marken liegen selbst in main; ohne diesen Vergleich löste jedes Zeichnen das nächste Messen aus.
    if (JSON.stringify(neu) !== JSON.stringify(marken)) marken = neu;
  }

  $effect(() => {
    let bild = 0;
    const spaeter = () => {
      cancelAnimationFrame(bild);
      bild = requestAnimationFrame(messen);
    };
    messen();
    const main = document.querySelector('main');
    // Neue Treffer und Umbrüche verschieben die Elemente, nicht nur Scrollen und Fensterbreite.
    const beobachter = new MutationObserver(spaeter);
    beobachter.observe(main, { childList: true, subtree: true });
    window.addEventListener('scroll', spaeter, { passive: true });
    window.addEventListener('resize', spaeter);
    return () => {
      cancelAnimationFrame(bild);
      beobachter.disconnect();
      window.removeEventListener('scroll', spaeter);
      window.removeEventListener('resize', spaeter);
    };
  });
</script>

<div class="bemassung" aria-hidden="true">
  {#each marken as marke, i (i)}
    <span
      class={marke.art}
      class:rechts={marke.rechts}
      style:left="{marke.x}px"
      style:top="{marke.y}px"
      style:width={marke.breite === undefined ? null : `${marke.breite}px`}
      style:height={marke.hoehe === undefined ? null : `${marke.hoehe}px`}>{marke.text ?? ''}</span
    >
  {/each}
</div>

<style>
  /* Bemassungsrot wie bei den Redlines einer Übergabe; das Magenta gehört dem Raster. */
  .bemassung {
    --mass: #e03000;
    position: fixed;
    inset: 0;
    z-index: 10;
    overflow: hidden;
    pointer-events: none;
  }

  .zone,
  .schild {
    position: absolute;
  }

  .zone {
    background: repeating-linear-gradient(-45deg, rgb(224 48 0 / 0.22) 0 3px, transparent 3px 6px);
    outline: 1px solid var(--mass);
    outline-offset: -1px;
  }

  .schild {
    padding: 0 0.3rem;
    background: var(--mass);
    color: #fff;
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .rechts {
    transform: translateX(-100%);
  }
</style>
