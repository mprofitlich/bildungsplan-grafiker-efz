/**
 * Prüft, ob in der Suche ein Wort mit diesem Anfang steht, ohne Rücksicht auf
 * Gross- und Kleinschreibung: «Animation» trifft «Animationen» und
 * «Animationskonzept», aber nicht «Reanimation». Erst ab Wortanfang, weil
 * sonst «Emotion» das Ei für «Motion» auslöste.
 * @param {string} suche
 * @param {string} wort ein Wort oder mehrere, durch Leerzeichen getrennt
 * @returns {boolean}
 */
export function enthaeltWortanfang(suche, wort) {
  // \b genügt nicht, weil es Umlaute nicht als Buchstaben kennt.
  const muster = wort.trim().split(/\s+/).join('\\s+');
  return new RegExp(`(^|\\P{L})${muster}`, 'iu').test(suche);
}

/** Die Rahmen der Seite, wie sie ein Layoutprogramm sähe. */
export const RAHMEN = 'main :is(h1, h2, h3, p, fieldset, li:has(> .wahl))';

/**
 * Der äusserste Rahmen um ein Element. Wie eine Gruppe in InDesign gilt ein
 * Leistungsziel als Ganzes, nicht sein Absatz.
 * @param {Element} element
 * @returns {HTMLElement | null}
 */
export function aeussererRahmen(element) {
  let gefunden = null;
  for (let rahmen = element.closest(RAHMEN); rahmen; rahmen = rahmen.parentElement?.closest(RAHMEN) ?? null) {
    gefunden = rahmen;
  }
  return /** @type {HTMLElement | null} */ (gefunden);
}
