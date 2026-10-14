import daten from '../../daten/bildungsplan.json';

/**
 * @typedef {object} Ziel
 * @property {string} id Eindeutig, etwa `b1.1-schule`.
 * @property {string} nummer Nummer aus dem Bildungsplan, etwa `b1.1`.
 * @property {'betrieb' | 'schule'} lernort
 * @property {string} text
 * @property {number} stufe Taxonomiestufe 1–6.
 * @property {number} seite Seite im offiziellen Bildungsplan.
 * @property {string} kompetenz Id der Handlungskompetenz, etwa `b1`.
 * @property {string} bereich Id des Handlungskompetenzbereichs, etwa `b`.
 */

/**
 * @typedef {object} Filter
 * @property {string} [suche] Freitext; alle Wörter müssen vorkommen.
 * @property {string} [lernort] `betrieb`, `schule` oder leer für beide.
 * @property {number[]} [stufen] Leer bedeutet alle Taxonomiestufen.
 * @property {string[]} [bereiche] Leer bedeutet alle Bereiche.
 * @property {string[]} [phasen] Ids von Arbeitsphasen; leer bedeutet alle. Eine
 *   Handlungskompetenz mit mehreren Phasen zählt zu jeder davon.
 */

/** Titel und Stand des offiziellen Bildungsplans. */
export const quelle = daten.quelle;

/** Die sieben Handlungskompetenzbereiche in der Reihenfolge des Bildungsplans. */
export const bereiche = daten.bereiche;

/** Die Taxonomiestufen K1 bis K6 mit Begriff und Beschreibung. */
export const taxonomiestufen = daten.taxonomiestufen;

/** Die fünf Arbeitsphasen des «Graphic Design Workflow» mit ihrer Farbe. */
export const arbeitsphasen = daten.arbeitsphasen;

/** Die beiden Lernorte. */
export const lernorte = daten.lernorte;

/** Alle Handlungskompetenzen, je mit der Id ihres Bereichs. */
export const kompetenzen = bereiche.flatMap((bereich) =>
  bereich.handlungskompetenzen.map((kompetenz) => ({ ...kompetenz, bereich: bereich.id })),
);

/**
 * Alle Leistungsziele in der Reihenfolge des Bildungsplans.
 * @type {Ziel[]}
 */
export const ziele = kompetenzen.flatMap((kompetenz) =>
  kompetenz.leistungsziele.map((ziel) => ({
    ...ziel,
    kompetenz: kompetenz.id,
    bereich: kompetenz.bereich,
  })),
);

const zielNachId = new Map(ziele.map((ziel) => [ziel.id, ziel]));
const kompetenzNachId = new Map(kompetenzen.map((kompetenz) => [kompetenz.id, kompetenz]));
const position = new Map(ziele.map((ziel, index) => [ziel.id, index]));

/**
 * Vereinheitlicht Text für den Vergleich: Kleinschreibung, Umlaute ohne Punkte.
 * @param {string} text
 * @returns {string}
 */
export function normalisiere(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss');
}

const suchtext = new Map(
  ziele.map((ziel) => [
    ziel.id,
    normalisiere(`${ziel.nummer} ${ziel.text} ${kompetenzNachId.get(ziel.kompetenz).titel}`),
  ]),
);

/**
 * Sucht ein Leistungsziel anhand seiner Id.
 * @param {string} id
 * @returns {Ziel | undefined}
 */
export function ziel(id) {
  return zielNachId.get(id);
}

/**
 * Sucht eine Handlungskompetenz anhand ihrer Id.
 * @param {string} id
 * @returns {object | undefined}
 */
export function kompetenz(id) {
  return kompetenzNachId.get(id);
}

/**
 * Liefert die Bezeichnung eines Lernorts.
 * @param {string} id `betrieb` oder `schule`.
 * @returns {string}
 */
export function lernortName(id) {
  return lernorte.find((lernort) => lernort.id === id)?.name ?? id;
}

/**
 * Liefert das Leistungsziel mit derselben Nummer am anderen Lernort.
 * @param {Ziel} ziel
 * @returns {Ziel | undefined} `undefined`, wenn die Nummer nur an einem Lernort vorkommt.
 */
export function gegenstueck(ziel) {
  const anderer = ziel.lernort === 'betrieb' ? 'schule' : 'betrieb';
  return zielNachId.get(`${ziel.nummer}-${anderer}`);
}

/**
 * Schränkt eine Liste von Leistungszielen ein. Die Kriterien werden verknüpft.
 * @param {Ziel[]} liste
 * @param {Filter} filter
 * @returns {Ziel[]}
 */
export function filtere(
  liste,
  { suche = '', lernort = '', stufen = [], bereiche = [], phasen = [] } = {},
) {
  const woerter = normalisiere(suche).split(/\s+/).filter(Boolean);
  return liste.filter(
    (ziel) =>
      (lernort === '' || ziel.lernort === lernort) &&
      (stufen.length === 0 || stufen.includes(ziel.stufe)) &&
      (bereiche.length === 0 || bereiche.includes(ziel.bereich)) &&
      (phasen.length === 0 ||
        kompetenzNachId.get(ziel.kompetenz).arbeitsphasen.some((phase) => phasen.includes(phase))) &&
      woerter.every((wort) => suchtext.get(ziel.id).includes(wort)),
  );
}

/**
 * Bringt Leistungsziele in die Reihenfolge des Bildungsplans und fasst sie
 * nach Handlungskompetenz zusammen.
 * @param {Ziel[]} liste
 * @returns {{ kompetenz: object, ziele: Ziel[] }[]}
 */
export function gruppiere(liste) {
  const gruppen = new Map();
  const sortiert = [...liste].sort((a, b) => position.get(a.id) - position.get(b.id));
  for (const ziel of sortiert) {
    if (!gruppen.has(ziel.kompetenz)) {
      gruppen.set(ziel.kompetenz, { kompetenz: kompetenzNachId.get(ziel.kompetenz), ziele: [] });
    }
    gruppen.get(ziel.kompetenz).ziele.push(ziel);
  }
  return [...gruppen.values()];
}

/**
 * Findet Fachbegriffe aus Anhang 2, die zur Suche passen.
 * @param {string} suche
 * @returns {{ begriff: string, definition: string }[]}
 */
export function findeFachbegriffe(suche) {
  const gesucht = normalisiere(suche.trim());
  // Kürzere Eingaben träfen fast jeden Begriff.
  if (gesucht.length < 3) return [];
  return daten.fachbegriffe.filter((eintrag) => normalisiere(eintrag.begriff).includes(gesucht));
}
