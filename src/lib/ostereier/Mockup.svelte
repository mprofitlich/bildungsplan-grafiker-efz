<script>
  /**
   * Zeigt die Seite als Mockup auf dem Bildschirm eines MacBook Pro, das auf
   * einem Stuhl steht. Die Seite bleibt darin bedienbar und scrollt; der Knopf
   * rechts oben oder Escape beendet das Mockup. Nur ab Desktopbreite, auf
   * kleineren Bildschirmen wäre die Schrift im Laptop unlesbar.
   *
   * Bild: «MacBook on Modern Eames Style Chair» von Pixeden (pixeden.com),
   * Bildschirm ausgeschnitten und verkleinert. Die Lizenz erlaubt den Einsatz
   * im eigenen Werk, nicht die Weitergabe der Vorlage – die PSD gehört nicht ins Repo.
   */
  import { MediaQuery } from 'svelte/reactivity';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';
  import bild from './mockup.webp';
  import { lage } from './mockup.js';

  /** `onschliessen` beendet das Mockup. */
  let { onschliessen } = $props();

  const desktop = new MediaQuery('min-width: 64rem');
  let geladen = $state(false);
  const aktiv = $derived(desktop.current && geladen);
  const l = $derived(lage(innerWidth.current ?? 0, innerHeight.current ?? 0));

  // Die Seite scrollt im Bildschirm weiter, wo sie im Fenster stand, und umgekehrt.
  $effect(() => {
    if (!aktiv) return;
    const html = document.documentElement;
    const app = document.getElementById('app');
    const stand = scrollY;
    html.classList.add('mockup');
    app.scrollTop = stand;
    return () => {
      const stand = app.scrollTop;
      html.classList.remove('mockup');
      scrollTo(0, stand);
    };
  });

  $effect(() => {
    if (!aktiv) return;
    const werte = {
      '--bildschirm-links': `${l.bildschirm.links}px`,
      '--bildschirm-oben': `${l.bildschirm.oben}px`,
      '--inhalt-breite': `${l.inhaltBreite}px`,
      '--inhalt-hoehe': `${l.bildschirm.hoehe / l.massstab}px`,
      '--massstab': l.massstab,
    };
    const stil = document.documentElement.style;
    for (const [name, wert] of Object.entries(werte)) stil.setProperty(name, wert);
    return () => Object.keys(werte).forEach((name) => stil.removeProperty(name));
  });

  /** @param {KeyboardEvent} event */
  function beendeMitEscape(event) {
    if (!aktiv || event.key !== 'Escape') return;
    // Im Suchfeld löschte Escape sonst auch die Suche, und mit ihr die Treffer.
    event.preventDefault();
    onschliessen();
  }

  /**
   * Hängt das Element direkt an den Body, neben #app: Die App wird verkleinert
   * und scrollt, Bild und Knopf sollen am Fenster stehen bleiben.
   */
  function insBody(element) {
    document.body.append(element);
    return () => element.remove();
  }
</script>

<svelte:window onkeydown={beendeMitEscape} />

<!-- Ein einziges Wurzelelement, damit Svelte es nach dem Umhängen wieder sauber entfernt. -->
<div class="mockup" class:geladen={aktiv} {@attach insBody}>
  {#if desktop.current}
    <img
      class="szene"
      src={bild}
      alt=""
      decoding="async"
      onload={() => (geladen = true)}
      style:left="{l.szene.links}px"
      style:top="{l.szene.oben}px"
      style:width="{l.szene.breite}px"
      style:height="{l.szene.hoehe}px"
    />
    <div
      class="glanz"
      style:left="{l.bildschirm.links}px"
      style:top="{l.bildschirm.oben}px"
      style:width="{l.bildschirm.breite}px"
      style:height="{l.bildschirm.hoehe}px"
    ></div>
    <button type="button" class="schliessen" aria-label="Mockup beenden" onclick={onschliessen}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="square" />
      </svg>
    </button>
  {/if}
</div>

<style>
  /* Die Wand der Szene, falls ein Rand beim Umrechnen frei bleibt. */
  :global(html.mockup) {
    overflow: hidden;
    background: #d0ae9f;
  }

  /*
   * Die App liegt im Ausschnitt des Bildes, in Desktopbreite gesetzt und auf
   * den Bildschirm verkleinert. Sie scrollt selbst; klebende Elemente kleben
   * so am Rand des Bildschirms.
   */
  :global(html.mockup #app) {
    position: fixed;
    z-index: 0;
    left: var(--bildschirm-links);
    top: var(--bildschirm-oben);
    width: var(--inhalt-breite);
    height: var(--inhalt-hoehe);
    overflow: hidden auto;
    background: var(--grund);
    transform: scale(var(--massstab));
    transform-origin: 0 0;
    scroll-padding-top: var(--menue, 0px);
    scrollbar-width: thin;
  }

  /* Liegt über der App und lässt jeden Klick und jedes Scrollen durch, bis auf den Knopf. */
  .mockup {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    visibility: hidden;
  }

  .mockup.geladen {
    visibility: visible;
  }

  .szene,
  .glanz {
    position: absolute;
    max-width: none;
  }

  /* Ein Lichtschein schräg über das Glas, mit harter Kante wie eine Spiegelung. */
  .glanz {
    background: linear-gradient(
      115deg,
      rgb(255 255 255 / 0.14),
      rgb(255 255 255 / 0.05) 42%,
      transparent 42.2%
    );
  }

  .schliessen {
    position: fixed;
    top: var(--abstand-gross);
    right: var(--abstand-gross);
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #1a1a1a;
    color: #fff;
    box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 0.25);
    cursor: pointer;
    pointer-events: auto;
  }

  .schliessen:hover {
    background: var(--grundton);
  }

  .schliessen:focus-visible {
    outline: 2px solid #1a1a1a;
    outline-offset: 3px;
  }
</style>
