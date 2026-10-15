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
