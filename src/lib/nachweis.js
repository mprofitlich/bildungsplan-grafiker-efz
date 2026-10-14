import { gruppiere, lernortName, ziel } from './katalog.js';

/**
 * Stellt die Leistungsziele eines Kurses als Text zusammen, gruppiert nach
 * Handlungskompetenz.
 * @param {{ titel: string, beschrieb: string, ziele: string[] }} kurs
 * @returns {string}
 */
export function nachweis(kurs) {
  const gewaehlt = kurs.ziele.map(ziel).filter(Boolean);
  const zeilen = [kurs.titel.trim() || 'Kurs ohne Titel', ''];
  if (kurs.beschrieb.trim()) zeilen.push(kurs.beschrieb.trim(), '');
  zeilen.push(
    'Leistungsziele gemäss Bildungsplan Grafikerin/Grafiker EFZ vom 1. Januar 2023',
    'Grafikerinnen und Grafiker …',
  );
  for (const gruppe of gruppiere(gewaehlt)) {
    zeilen.push('', `${gruppe.kompetenz.id} ${gruppe.kompetenz.titel}`);
    for (const z of gruppe.ziele) {
      zeilen.push(`${z.nummer} (${lernortName(z.lernort)}, K${z.stufe}) ${z.text}`);
    }
  }
  return zeilen.join('\n');
}
