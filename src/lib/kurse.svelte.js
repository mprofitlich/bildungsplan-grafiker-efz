const SCHLUESSEL = 'bildungsplan.kurse';

/**
 * @typedef {object} Kurs
 * @property {string} id
 * @property {string} titel
 * @property {string} beschrieb
 * @property {string[]} ziele Ids der gewählten Leistungsziele.
 */

/** @returns {Kurs} */
function leererKurs() {
  return { id: crypto.randomUUID(), titel: 'Neuer Kurs', beschrieb: '', ziele: [] };
}

/** Prüft, ob ein geladener Stand die erwartete Form hat. */
function istGueltig(stand) {
  return (
    Array.isArray(stand?.kurse) &&
    stand.kurse.length > 0 &&
    stand.kurse.every(
      (kurs) =>
        typeof kurs.id === 'string' &&
        typeof kurs.titel === 'string' &&
        typeof kurs.beschrieb === 'string' &&
        Array.isArray(kurs.ziele),
    ) &&
    stand.kurse.some((kurs) => kurs.id === stand.aktiv)
  );
}

function laden() {
  try {
    const stand = JSON.parse(localStorage.getItem(SCHLUESSEL));
    if (istGueltig(stand)) return stand;
  } catch {
    // Unlesbarer Speicher wird wie ein leerer behandelt.
  }
  const kurs = leererKurs();
  return { kurse: [kurs], aktiv: kurs.id };
}

/**
 * Alle Kurse und die Id des gerade bearbeiteten Kurses.
 * @type {{ kurse: Kurs[], aktiv: string }}
 */
export const zustand = $state(laden());

$effect.root(() => {
  $effect(() => {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(zustand));
  });
});

/**
 * Liefert den gerade bearbeiteten Kurs.
 * @returns {Kurs}
 */
export function aktiverKurs() {
  return zustand.kurse.find((kurs) => kurs.id === zustand.aktiv);
}

/**
 * Prüft, ob ein Leistungsziel im aktiven Kurs liegt.
 * @param {string} zielId
 * @returns {boolean}
 */
export function enthaelt(zielId) {
  return aktiverKurs().ziele.includes(zielId);
}

/**
 * Legt ein Leistungsziel in den aktiven Kurs oder nimmt es wieder heraus.
 * @param {string} zielId
 */
export function zielUmschalten(zielId) {
  const kurs = aktiverKurs();
  if (kurs.ziele.includes(zielId)) {
    kurs.ziele = kurs.ziele.filter((id) => id !== zielId);
  } else {
    kurs.ziele.push(zielId);
  }
}

/**
 * Legt mehrere Leistungsziele in den aktiven Kurs; vorhandene bleiben einmal.
 * @param {string[]} zielIds
 */
export function zieleHinzufuegen(zielIds) {
  const kurs = aktiverKurs();
  kurs.ziele = [...new Set([...kurs.ziele, ...zielIds])];
}

/** Legt einen leeren Kurs an und macht ihn zum aktiven. */
export function kursAnlegen() {
  const kurs = leererKurs();
  zustand.kurse.push(kurs);
  zustand.aktiv = kurs.id;
}

/** Löscht den aktiven Kurs. Der letzte Kurs wird durch einen leeren ersetzt. */
export function kursLoeschen() {
  zustand.kurse = zustand.kurse.filter((kurs) => kurs.id !== zustand.aktiv);
  if (zustand.kurse.length === 0) zustand.kurse.push(leererKurs());
  zustand.aktiv = zustand.kurse[0].id;
}

/**
 * Liefert alle Kurse als JSON-Text für eine Sicherungsdatei.
 * @returns {string}
 */
export function sicherung() {
  return JSON.stringify(zustand, null, 2);
}

/**
 * Ersetzt alle Kurse durch den Inhalt einer Sicherungsdatei.
 * @param {string} text Inhalt der Datei.
 * @returns {boolean} `false`, wenn die Datei keine gültige Sicherung ist.
 */
export function sicherungEinlesen(text) {
  let stand;
  try {
    stand = JSON.parse(text);
  } catch {
    return false;
  }
  if (!istGueltig(stand)) return false;
  zustand.kurse = stand.kurse;
  zustand.aktiv = stand.aktiv;
  return true;
}
