/**
 * @typedef {object} Vorschlag
 * @property {'laeuft' | 'fertig' | 'fehler'} status
 * @property {{ id: string, begruendung: string }[]} liste
 * @property {string} meldung Fehlertext, sonst leer.
 */

/**
 * Die Vorschläge je Kurs, nach Kurs-Id. Sie gelten bis zum Neuladen der Seite.
 * @type {Record<string, Vorschlag>}
 */
export const vorschlaege = $state({});

/**
 * Die Vorschläge funktionieren nur, wenn der Entwicklungsserver läuft: Er ruft
 * die Claude-Kommandozeile auf dem Rechner auf.
 */
export const verfuegbar = import.meta.env.DEV;

/**
 * Holt für einen Kurs Vorschläge von Claude und legt sie in {@link vorschlaege} ab.
 * @param {{ id: string, titel: string, beschrieb: string }} kurs
 * @param {string} lernort `betrieb`, `schule` oder leer für beide.
 */
export async function vorschlagen(kurs, lernort) {
  const kursId = kurs.id;
  vorschlaege[kursId] = { status: 'laeuft', liste: [], meldung: '' };
  try {
    const antwort = await fetch('/api/vorschlag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titel: kurs.titel, beschrieb: kurs.beschrieb, lernort }),
    });
    const inhalt = await antwort.json();
    vorschlaege[kursId] = antwort.ok
      ? { status: 'fertig', liste: inhalt.vorschlaege, meldung: '' }
      : { status: 'fehler', liste: [], meldung: inhalt.meldung };
  } catch {
    vorschlaege[kursId] = {
      status: 'fehler',
      liste: [],
      meldung: 'Der Entwicklungsserver ist nicht erreichbar.',
    };
  }
}
