import daten from '../../daten/bildungsplan.json';

/**
 * @typedef {object} Textteil
 * @property {string} text
 * @property {string} [erklaerung] Definition aus Anhang 2, wenn der Teil ein Fachbegriff ist.
 */

/** Schlüssel, unter dem Schreibweisen wie «Motion Design» und «Motiondesign» zusammenfallen. */
function schluessel(begriff) {
  return begriff.toLowerCase().replace(/[ -]/g, '');
}

/**
 * @typedef {object} Glossarabschnitt
 * @property {string} id Sprungziel, etwa aus dem Filter «Taxonomiestufe».
 * @property {string} titel
 * @property {string} [zusatz] Steht nach dem Titel in der Überschrift, nicht in der Seitenleiste.
 * @property {{ begriff: string, definition: string }[]} eintraege
 */

// Der Bildungsplan führt die Begriffe nicht durchwegs geordnet.
const alphabetisch = (liste) => [...liste].sort((a, b) => a.begriff.localeCompare(b.begriff, 'de'));

/**
 * Fachbegriffe und Glossar der Berufsbildung alphabetisch, die Taxonomiestufen von K1 bis K6.
 * @type {Glossarabschnitt[]}
 */
export const glossar = [
  { id: 'fachbegriffe', titel: 'Fachbegriffe', eintraege: alphabetisch(daten.fachbegriffe) },
  {
    id: 'taxonomiestufen',
    titel: 'Taxonomiestufen',
    zusatz: 'für Leistungsziele (nach Bloom)',
    eintraege: daten.taxonomiestufen.map((eintrag) => ({
      begriff: `${eintrag.kuerzel} ${eintrag.begriff}`,
      definition: eintrag.beschreibung,
    })),
  },
  { id: 'berufsbildung', titel: 'Berufsbildung', eintraege: alphabetisch(daten.berufsbildungsglossar) },
];

const erklaerungen = new Map(
  daten.fachbegriffe.map((eintrag) => [schluessel(eintrag.begriff), eintrag.definition]),
);

// Längere Begriffe zuerst, damit «Corporate Design» nicht an einem kürzeren Begriff hängen bleibt.
const varianten = daten.fachbegriffe
  .map((eintrag) => eintrag.begriff)
  .sort((a, b) => b.length - a.length)
  .map((begriff) => begriff.replace(/ /g, '[ -]?'))
  .join('|');

// Der Begriff muss als ganzes Wort stehen, darf aber eine Beugungsendung tragen:
// «Briefings» und «Leitsystemen» zählen, «Layoutkonzept» und «Debriefing» (für «Briefing») nicht.
const muster = new RegExp(`(?<!\\p{L})(${varianten})(?:es|en|s|n|e)?(?!\\p{L})`, 'giu');

/**
 * Zerlegt einen Text in Abschnitte und versieht die Fachbegriffe aus Anhang 2
 * mit ihrer Erklärung.
 * @param {string} text
 * @returns {Textteil[]}
 */
export function zerlege(text) {
  const teile = [];
  let ende = 0;
  for (const treffer of text.matchAll(muster)) {
    if (treffer.index > ende) teile.push({ text: text.slice(ende, treffer.index) });
    teile.push({ text: treffer[0], erklaerung: erklaerungen.get(schluessel(treffer[1])) });
    ende = treffer.index + treffer[0].length;
  }
  if (ende < text.length) teile.push({ text: text.slice(ende) });
  return teile;
}
