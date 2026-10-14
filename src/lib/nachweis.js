import { gruppiere, lernortName, wortlaut, ziel } from './bildungsplan.js';

const kStufe = (stufe) => (stufe === null ? 'ohne K-Stufe' : `K${stufe}`);

/**
 * Nennt, worin die Broschüre vom Bildungsplan abweicht, als Klammer mit den
 * offiziellen Werten; leer, wo sie übereinstimmen.
 * @param {object} offiziell Leistungsziel oder Handlungskompetenz.
 * @param {string[]} felder Felder, die im Nachweis stehen.
 * @returns {string}
 */
function abweichung(offiziell, felder) {
  const anders = felder.filter((feld) => offiziell.broschuere && feld in offiziell.broschuere);
  if (anders.length === 0) return '';
  const werte = anders.map((feld) =>
    feld === 'stufe' ? kStufe(offiziell.stufe) : feld === 'nummer' ? offiziell.nummer : `«${offiziell[feld]}»`,
  );
  return ` [SGD/SGV: ${werte.join(', ')}]`;
}

/**
 * Stellt die Leistungsziele eines Kurses als Text zusammen, gruppiert nach
 * Handlungskompetenz.
 * @param {{ titel: string, beschrieb: string, ziele: string[] }} kurs
 * @param {'bildungsplan' | 'broschuere'} [fassung] In der Fassung der Broschüre
 *   steht an jeder abweichenden Stelle der Wert des Bildungsplans.
 * @returns {string}
 */
export function nachweis(kurs, fassung = 'bildungsplan') {
  const broschuere = fassung === 'broschuere';
  const gewaehlt = kurs.ziele.map(ziel).filter(Boolean);
  const zeilen = [kurs.titel.trim() || 'Kurs ohne Titel', ''];
  if (kurs.beschrieb.trim()) zeilen.push(kurs.beschrieb.trim(), '');
  zeilen.push(
    broschuere
      ? 'Leistungsziele gemäss Broschüre zum «Graphic Design Workflow»; wo sie vom Bildungsplan Grafikerin/Grafiker EFZ vom 1. Januar 2023 (SGD/SGV) abweicht, steht dessen Wert in eckigen Klammern'
      : 'Leistungsziele gemäss Bildungsplan Grafikerin/Grafiker EFZ vom 1. Januar 2023',
    'Grafikerinnen und Grafiker …',
  );
  for (const gruppe of gruppiere(gewaehlt)) {
    const k = wortlaut(gruppe.kompetenz, fassung);
    const markierung = broschuere ? abweichung(gruppe.kompetenz, ['titel']) : '';
    zeilen.push('', `${k.id} ${k.titel}${markierung}`);
    for (const offiziell of gruppe.ziele) {
      const z = wortlaut(offiziell, fassung);
      const zusatz = broschuere ? abweichung(offiziell, ['nummer', 'stufe', 'text']) : '';
      zeilen.push(`${z.nummer} (${lernortName(z.lernort)}, ${kStufe(z.stufe)}) ${z.text}${zusatz}`);
    }
  }
  return zeilen.join('\n');
}
