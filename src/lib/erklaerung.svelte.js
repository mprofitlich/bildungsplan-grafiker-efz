const BREITE = 352;
const RAND = 12;
const ABSTAND = 6;
// Unterhalb dieser Resthöhe erscheint die Erklärung über dem Begriff statt darunter.
const PLATZ_UNTEN = 180;

/** Die gerade angezeigte Erklärung eines Fachbegriffs. */
export const erklaerung = $state({ sichtbar: false, text: '', stil: '' });

/**
 * Zeigt die Erklärung neben einem Element an, innerhalb des Fensters.
 * @param {Element} element Der Begriff im Text.
 * @param {string} text Die Erklärung.
 */
export function zeige(element, text) {
  const flaeche = element.getBoundingClientRect();
  const breite = Math.min(BREITE, window.innerWidth - 2 * RAND);
  const links = Math.max(RAND, Math.min(flaeche.left, window.innerWidth - breite - RAND));
  const senkrecht =
    flaeche.bottom > window.innerHeight - PLATZ_UNTEN
      ? `bottom: ${window.innerHeight - flaeche.top + ABSTAND}px`
      : `top: ${flaeche.bottom + ABSTAND}px`;
  erklaerung.text = text;
  erklaerung.stil = `left: ${links}px; max-width: ${breite}px; ${senkrecht}`;
  erklaerung.sichtbar = true;
}

/** Blendet die Erklärung aus. */
export function verberge() {
  erklaerung.sichtbar = false;
}
