<script>
  /**
   * Eckiger Pfeil von unten auf ein Element in der Kopfleiste, mit kurzem `text`.
   * `ziel` ist das Element, `rahmen` der positionierte Vorfahr, in dem der Pfeil
   * liegt; `onweg` blendet ihn aus.
   */
  let { ziel, rahmen, text, onweg } = $props();

  // Die Spitze sitzt so weit vom linken Rand der Zeichnung.
  const SPITZE = 9;
  // Breite der Zeichnung und Mindestabstand des Textes zum Fensterrand.
  const BREITE = 48;
  const RAND = 16;

  // Unter dieser Breite steht der Text links vom Pfeil statt rechts.
  const MINDESTBREITE = 180;

  let stil = $state('');
  let platz = $state(288);
  let gespiegelt = $state(false);

  function messen() {
    const aussen = rahmen.getBoundingClientRect();
    const flaeche = ziel.getBoundingClientRect();
    const sichtbar = ziel.parentElement.getBoundingClientRect();
    // Ist die Reiterzeile weggescrollt, zeigt der Pfeil an ihren Rand.
    const mitte = Math.min(flaeche.left + flaeche.width / 2, sichtbar.right - SPITZE);
    const rechts = window.innerWidth - (mitte - SPITZE + BREITE) - RAND;
    gespiegelt = rechts < MINDESTBREITE;
    platz = gespiegelt ? mitte + SPITZE - BREITE - RAND : rechts;
    const waagrecht = gespiegelt
      ? `right: ${aussen.right - mitte - SPITZE}px`
      : `left: ${mitte - aussen.left - SPITZE}px`;
    stil = `${waagrecht}; top: ${flaeche.bottom - aussen.top}px`;
  }

  $effect(() => {
    const zeile = ziel.parentElement;
    // Auf schmalen Bildschirmen liegt der Reiter sonst ausserhalb der sichtbaren
    // Zeile; erst mit geladener Schrift steht fest, wie weit er hinausragt.
    document.fonts.ready.then(() => {
      const ueberstand = ziel.getBoundingClientRect().right - zeile.getBoundingClientRect().right;
      if (ueberstand > 0) zeile.scrollLeft += ueberstand;
      messen();
    });
    messen();
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(rahmen);
    zeile.addEventListener('scroll', messen);
    return () => {
      beobachter.disconnect();
      zeile.removeEventListener('scroll', messen);
    };
  });
</script>

<div class="pfeil" class:gespiegelt style={stil}>
  <svg viewBox="0 0 48 44" width="48" height="44" aria-hidden="true">
    <path d="M9 12V36H48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="miter" />
    <path d="M9 1L1 13H17Z" fill="currentColor" />
  </svg>
  <p style:max-width="min(18rem, {platz}px)">
    {text}
    <button type="button" aria-label="Hinweis schliessen" onclick={onweg}>
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="square" />
      </svg>
    </button>
  </p>
</div>

<style>
  .pfeil {
    position: absolute;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    color: var(--akzent);
    pointer-events: none;
    animation: wippen 1.4s ease-in-out infinite;
  }

  svg {
    flex: none;
  }

  .gespiegelt {
    flex-direction: row-reverse;
  }

  .gespiegelt > svg {
    transform: scaleX(-1);
  }

  p {
    display: flex;
    gap: var(--abstand);
    align-items: flex-start;
    /* Die waagrechte Linie des Pfeils (y = 36) trifft die erste Textzeile. */
    margin: 24px 0 0;
    padding: var(--abstand-klein) var(--abstand);
    background: var(--grund);
    border: var(--rahmen-breite) solid var(--rahmen);
    box-shadow: 0.25rem 0.25rem 0 var(--akzent);
    color: var(--text);
    font-size: var(--schrift-klein);
    pointer-events: auto;
  }

  button {
    display: grid;
    flex: none;
    place-items: center;
    padding: 0.2rem;
    border: 0;
    background: none;
  }

  @keyframes wippen {
    50% {
      transform: translateY(-4px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pfeil {
      animation: none;
    }
  }
</style>
