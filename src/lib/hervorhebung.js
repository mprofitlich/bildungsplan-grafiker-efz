import { normalisiere } from './bildungsplan.js';

/**
 * @typedef {object} Abschnitt
 * @property {string} text
 * @property {boolean} treffer `true`, wenn der Abschnitt ein Suchwort ist.
 */

/**
 * Zerlegt die Suche in die Wörter, nach denen sie filtert.
 * @param {string} suche
 * @returns {string[]}
 */
export function suchwoerter(suche) {
  return normalisiere(suche).split(/\s+/).filter(Boolean);
}

/**
 * Teilt einen Text in Abschnitte und kennzeichnet die Stellen, an denen ein
 * Suchwort vorkommt. Verglichen wird wie in der Suche, also ohne Rücksicht
 * auf Gross- und Kleinschreibung und Umlaute.
 * @param {string} text
 * @param {string} suche
 * @returns {Abschnitt[]}
 */
export function markiere(text, suche) {
  const woerter = suchwoerter(suche);
  if (woerter.length === 0) return [{ text, treffer: false }];

  // Die Vereinheitlichung ändert die Länge («ß» wird zu «ss»); jede Stelle im
  // vereinheitlichten Text merkt sich deshalb, aus welchem Zeichen sie stammt.
  let vergleich = '';
  const herkunft = [];
  for (let i = 0; i < text.length; i++) {
    const teil = normalisiere(text[i]);
    vergleich += teil;
    for (let j = 0; j < teil.length; j++) herkunft.push(i);
  }

  const markiert = new Array(text.length).fill(false);
  for (const wort of woerter) {
    for (let start = vergleich.indexOf(wort); start !== -1; start = vergleich.indexOf(wort, start + 1)) {
      for (let k = herkunft[start]; k <= herkunft[start + wort.length - 1]; k++) markiert[k] = true;
    }
  }

  const abschnitte = [];
  for (let i = 0; i < text.length; i++) {
    const letzter = abschnitte.at(-1);
    if (letzter && letzter.treffer === markiert[i]) letzter.text += text[i];
    else abschnitte.push({ text: text[i], treffer: markiert[i] });
  }
  return abschnitte;
}

/**
 * Prüft, ob ein Suchwort in einem kurzen Text wie einer Nummer vorkommt.
 * @param {string} text
 * @param {string} suche
 * @returns {boolean}
 */
export function getroffen(text, suche) {
  const vergleich = normalisiere(text);
  return suchwoerter(suche).some((wort) => vergleich.includes(wort));
}
