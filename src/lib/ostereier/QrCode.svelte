<script>
  /**
   * Ein vorbildlich bemasster QR-Code, wie er auf ein Plakat gehört: Ruhezone
   * von vier Modulen, Mindestgrösse, Aufforderung zum Scannen. Wer scannt,
   * landet bei Rick Astley. Liegt über allem und lässt jeden Klick durch,
   * ausser auf den eigenen Knopf.
   */

  /** `onschliessen` beendet den QR-Code. */
  let { onschliessen } = $props();

  /** @param {KeyboardEvent} event */
  function beendeMitEscape(event) {
    if (event.key !== 'Escape') return;
    // Im Suchfeld löschte Escape sonst auch die Suche, und mit ihr die Treffer.
    event.preventDefault();
    onschliessen();
  }

  // Erzeugt mit `qrcode` 1.5.4 aus https://www.youtube.com/watch?v=dQw4w9WgXcQ,
  // Fehlerkorrektur M: Version 4, 33 × 33 Module, ein Modul je Einheit.
  const module =
    'M0 0h7v1h-7zM9 0h1v1h-1zM11 0h2v1h-2zM14 0h1v1h-1zM18 0h4v1h-4zM23 0h1v1h-1zM26 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM10 1h3v1h-3zM15 1h1v1h-1zM18 1h1v1h-1zM20 1h2v1h-2zM26 1h1v1h-1zM32 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h1v1h-1zM11 2h1v1h-1zM14 2h2v1h-2zM19 2h1v1h-1zM21 2h2v1h-2zM24 2h1v1h-1zM26 2h1v1h-1zM28 2h3v1h-3zM32 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h3v1h-3zM18 3h1v1h-1zM21 3h1v1h-1zM23 3h2v1h-2zM26 3h1v1h-1zM28 3h3v1h-3zM32 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM13 4h5v1h-5zM20 4h1v1h-1zM22 4h1v1h-1zM26 4h1v1h-1zM28 4h3v1h-3zM32 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM10 5h1v1h-1zM12 5h3v1h-3zM17 5h1v1h-1zM19 5h1v1h-1zM22 5h3v1h-3zM26 5h1v1h-1zM32 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h1v1h-1zM24 6h1v1h-1zM26 6h7v1h-7zM8 7h1v1h-1zM10 7h1v1h-1zM12 7h1v1h-1zM14 7h1v1h-1zM16 7h1v1h-1zM19 7h5v1h-5zM0 8h1v1h-1zM2 8h5v1h-5zM9 8h2v1h-2zM12 8h3v1h-3zM17 8h1v1h-1zM19 8h1v1h-1zM22 8h2v1h-2zM26 8h5v1h-5zM2 9h2v1h-2zM5 9h1v1h-1zM8 9h4v1h-4zM13 9h2v1h-2zM16 9h5v1h-5zM22 9h2v1h-2zM26 9h2v1h-2zM29 9h3v1h-3zM2 10h1v1h-1zM6 10h3v1h-3zM10 10h8v1h-8zM22 10h1v1h-1zM24 10h2v1h-2zM28 10h1v1h-1zM30 10h2v1h-2zM0 11h1v1h-1zM2 11h1v1h-1zM5 11h1v1h-1zM7 11h1v1h-1zM11 11h1v1h-1zM13 11h1v1h-1zM17 11h4v1h-4zM23 11h1v1h-1zM25 11h2v1h-2zM28 11h3v1h-3zM0 12h2v1h-2zM6 12h2v1h-2zM9 12h2v1h-2zM12 12h1v1h-1zM14 12h3v1h-3zM19 12h7v1h-7zM29 12h1v1h-1zM31 12h1v1h-1zM0 13h2v1h-2zM4 13h2v1h-2zM8 13h4v1h-4zM13 13h1v1h-1zM15 13h1v1h-1zM17 13h2v1h-2zM21 13h1v1h-1zM24 13h1v1h-1zM26 13h1v1h-1zM30 13h3v1h-3zM0 14h1v1h-1zM2 14h1v1h-1zM6 14h1v1h-1zM14 14h3v1h-3zM20 14h3v1h-3zM25 14h2v1h-2zM29 14h3v1h-3zM1 15h3v1h-3zM5 15h1v1h-1zM7 15h1v1h-1zM12 15h4v1h-4zM21 15h2v1h-2zM24 15h7v1h-7zM0 16h1v1h-1zM2 16h1v1h-1zM4 16h4v1h-4zM12 16h4v1h-4zM17 16h2v1h-2zM22 16h1v1h-1zM24 16h2v1h-2zM27 16h3v1h-3zM32 16h1v1h-1zM0 17h1v1h-1zM2 17h4v1h-4zM10 17h1v1h-1zM13 17h2v1h-2zM16 17h1v1h-1zM18 17h2v1h-2zM21 17h7v1h-7zM29 17h2v1h-2zM32 17h1v1h-1zM2 18h2v1h-2zM5 18h3v1h-3zM11 18h1v1h-1zM13 18h1v1h-1zM15 18h1v1h-1zM18 18h1v1h-1zM20 18h2v1h-2zM25 18h1v1h-1zM27 18h2v1h-2zM30 18h2v1h-2zM0 19h3v1h-3zM5 19h1v1h-1zM7 19h1v1h-1zM11 19h1v1h-1zM13 19h1v1h-1zM15 19h2v1h-2zM20 19h4v1h-4zM25 19h7v1h-7zM0 20h2v1h-2zM3 20h1v1h-1zM5 20h2v1h-2zM8 20h1v1h-1zM11 20h1v1h-1zM15 20h1v1h-1zM18 20h1v1h-1zM21 20h1v1h-1zM25 20h1v1h-1zM28 20h2v1h-2zM31 20h2v1h-2zM0 21h3v1h-3zM5 21h1v1h-1zM7 21h3v1h-3zM12 21h6v1h-6zM20 21h3v1h-3zM25 21h1v1h-1zM27 21h1v1h-1zM29 21h2v1h-2zM32 21h1v1h-1zM0 22h1v1h-1zM6 22h2v1h-2zM10 22h1v1h-1zM14 22h1v1h-1zM17 22h1v1h-1zM19 22h1v1h-1zM21 22h2v1h-2zM25 22h1v1h-1zM28 22h2v1h-2zM31 22h1v1h-1zM0 23h1v1h-1zM3 23h1v1h-1zM7 23h2v1h-2zM11 23h3v1h-3zM16 23h1v1h-1zM19 23h3v1h-3zM23 23h4v1h-4zM30 23h3v1h-3zM0 24h1v1h-1zM3 24h2v1h-2zM6 24h1v1h-1zM8 24h4v1h-4zM16 24h2v1h-2zM19 24h1v1h-1zM22 24h1v1h-1zM24 24h6v1h-6zM32 24h1v1h-1zM8 25h4v1h-4zM16 25h2v1h-2zM19 25h2v1h-2zM22 25h3v1h-3zM28 25h1v1h-1zM30 25h3v1h-3zM0 26h7v1h-7zM9 26h1v1h-1zM11 26h2v1h-2zM14 26h4v1h-4zM22 26h3v1h-3zM26 26h1v1h-1zM28 26h1v1h-1zM30 26h1v1h-1zM0 27h1v1h-1zM6 27h1v1h-1zM8 27h1v1h-1zM10 27h1v1h-1zM12 27h1v1h-1zM14 27h2v1h-2zM17 27h3v1h-3zM23 27h2v1h-2zM28 27h3v1h-3zM32 27h1v1h-1zM0 28h1v1h-1zM2 28h3v1h-3zM6 28h1v1h-1zM8 28h2v1h-2zM11 28h2v1h-2zM15 28h2v1h-2zM20 28h3v1h-3zM24 28h6v1h-6zM31 28h1v1h-1zM0 29h1v1h-1zM2 29h3v1h-3zM6 29h1v1h-1zM8 29h1v1h-1zM10 29h1v1h-1zM12 29h1v1h-1zM14 29h2v1h-2zM18 29h1v1h-1zM21 29h1v1h-1zM23 29h1v1h-1zM25 29h1v1h-1zM28 29h3v1h-3zM32 29h1v1h-1zM0 30h1v1h-1zM2 30h3v1h-3zM6 30h1v1h-1zM8 30h4v1h-4zM14 30h4v1h-4zM20 30h8v1h-8zM30 30h1v1h-1zM0 31h1v1h-1zM6 31h1v1h-1zM10 31h1v1h-1zM13 31h1v1h-1zM15 31h1v1h-1zM21 31h2v1h-2zM26 31h1v1h-1zM28 31h3v1h-3zM0 32h7v1h-7zM8 32h3v1h-3zM13 32h3v1h-3zM17 32h1v1h-1zM22 32h3v1h-3zM27 32h1v1h-1zM29 32h1v1h-1zM31 32h1v1h-1z';
</script>

<svelte:window onkeydown={beendeMitEscape} />

<div class="qr">
  <div class="blatt">
    <!-- Einheit ist ein Modul; die Ruhezone reicht von 0 bis 41, der Code liegt bei 4 bis 37. -->
    <svg viewBox="-8 -9 57 62" aria-hidden="true">
      <defs>
        <pattern id="qr-schraffur" width="1" height="1" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="0.5" height="1" fill="rgb(224 48 0 / 0.22)" />
        </pattern>
      </defs>

      <rect x="-8" y="-9" width="57" height="62" fill="#fff" />

      <path d="M0 0h41v41h-41z M4 4v33h33v-33z" fill="url(#qr-schraffur)" fill-rule="evenodd" />
      <path d="M0 0h41v41h-41z M4 4h33v33h-33z" class="linie" />
      <path d={module} transform="translate(4 4)" fill="#000" shape-rendering="crispEdges" />

      <!-- Kantenlänge des Codes ohne Ruhezone -->
      <path d="M4 -4.5v3M37 -4.5v3M4 -3h33" class="linie" />
      <text x="20.5" y="-4.5" text-anchor="middle" class="mass">min. 20 × 20 mm</text>

      <!-- Breite der Ruhezone -->
      <path d="M0 -7.5v3M4 -7.5v3M0 -6h4" class="linie" />
      <text x="-0.5" y="-6" text-anchor="end" dominant-baseline="middle" class="mass">4 Module</text>
      <text x="2" y="20.5" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 2 20.5)" class="mass"
        >Ruhezone</text
      >

      <text x="20.5" y="46.5" text-anchor="middle" class="aufruf">Jetzt scannen</text>
      <text x="20.5" y="50" text-anchor="middle" class="mass">Version 4 · Fehlerkorrektur M · Kontrast 21 : 1</text>
    </svg>
    <button type="button" class="schliessen" aria-label="QR-Code schliessen" onclick={onschliessen}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="square" />
      </svg>
    </button>
  </div>
</div>

<style>
  /* Über der klebenden Suche, ohne die Seite zu sperren. */
  .qr {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .blatt {
    position: relative;
    width: min(90vw, 26rem);
    box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 0.25);
    animation: aufhaengen 0.3s ease-out both;
  }

  .blatt > svg {
    display: block;
    width: 100%;
  }

  /* Wie beim Mockup, aber an der Ecke des Blatts statt des Fensters. */
  .schliessen {
    position: absolute;
    top: -1.25rem;
    right: -1.25rem;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
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

  /* Auf dem Handy reicht das Blatt fast an den Rand; der Knopf rückt hinein. */
  @media (width < 40rem) {
    .schliessen {
      top: 0.5rem;
      right: 0.5rem;
    }
  }

  /* Bemassungsrot wie bei «Styleguide». */
  .linie {
    fill: none;
    stroke: #e03000;
    stroke-width: 0.15;
  }

  .mass {
    fill: #e03000;
    font-size: 1.6px;
    font-weight: 500;
  }

  .aufruf {
    fill: #000;
    font-size: 3.2px;
    font-weight: 700;
  }

  @keyframes aufhaengen {
    from {
      opacity: 0;
      translate: 0 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .blatt {
      animation: none;
    }
  }
</style>
