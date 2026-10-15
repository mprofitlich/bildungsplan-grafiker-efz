/**
 * Prüft, ob die Suche ein Wort oder eine Wortfolge als Ganzes enthält, ohne
 * Rücksicht auf Gross- und Kleinschreibung: «Banane» trifft «die banane.»,
 * aber nicht «Bananenbrot».
 * @param {string} suche
 * @param {string} wort ein Wort oder mehrere, durch Leerzeichen getrennt
 * @returns {boolean}
 */
export function enthaeltWort(suche, wort) {
  // \b genügt nicht, weil es Umlaute nicht als Buchstaben kennt.
  const muster = wort.trim().split(/\s+/).join('\\s+');
  return new RegExp(`(^|\\P{L})${muster}(\\P{L}|$)`, 'iu').test(suche);
}
