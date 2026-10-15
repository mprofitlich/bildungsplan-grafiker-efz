/**
 * @typedef {object} Rechteck
 * @property {number} links
 * @property {number} oben
 * @property {number} breite
 * @property {number} hoehe
 */

/**
 * @typedef {object} Lage
 * @property {Rechteck} szene das ganze Bild, in Pixeln des Fensters
 * @property {Rechteck} bildschirm der durchsichtige Bildschirm darin
 * @property {number} inhaltBreite so breit wird die Seite im Bildschirm gesetzt
 * @property {number} massstab Verkleinerung der Seite auf die Breite des Bildschirms
 */

/** Grösse von mockup.webp. */
export const BILD = { breite: 4000, hoehe: 3139 };

/** Der durchsichtige Bildschirm in mockup.webp, gemessen am Alphakanal. */
export const BILDSCHIRM = { links: 1172, oben: 790, breite: 1786, hoehe: 1150 };

// Der Bildschirm füllt höchstens diese Anteile des Fensters, damit vom Laptop und vom Stuhl genug bleibt.
const ANTEIL_BREITE = 0.6;
const ANTEIL_HOEHE = 0.65;
// Seine Mitte liegt etwas über der Fenstermitte, damit das Unterteil des Laptops Platz hat.
const MITTE_HOEHE = 0.45;
// Schmaler gesetzt würde die Seite in ihren schmalen Aufbau umbrechen und nicht mehr wie am Desktop aussehen.
const INHALT_MINDESTBREITE = 1100;

/**
 * Wo die Szene im Fenster liegt und wie die Seite in ihren Bildschirm passt.
 * Die Szene deckt das Fenster, soweit ihr Seitenverhältnis das zulässt.
 * @param {number} fensterBreite
 * @param {number} fensterHoehe
 * @returns {Lage}
 */
export function lage(fensterBreite, fensterHoehe) {
  const verhaeltnis = BILDSCHIRM.breite / BILDSCHIRM.hoehe;
  const gewuenscht = Math.min(fensterBreite * ANTEIL_BREITE, fensterHoehe * ANTEIL_HOEHE * verhaeltnis);
  // Mindestens so gross, dass die Szene das Fenster in beiden Richtungen deckt.
  const breite = Math.max(
    gewuenscht,
    (fensterBreite * BILDSCHIRM.breite) / BILD.breite,
    (fensterHoehe * BILDSCHIRM.breite) / BILD.hoehe,
  );
  const faktor = breite / BILDSCHIRM.breite;

  const szeneBreite = BILD.breite * faktor;
  const szeneHoehe = BILD.hoehe * faktor;
  const links = klemme(
    fensterBreite / 2 - (BILDSCHIRM.links + BILDSCHIRM.breite / 2) * faktor,
    fensterBreite - szeneBreite,
  );
  const oben = klemme(
    fensterHoehe * MITTE_HOEHE - (BILDSCHIRM.oben + BILDSCHIRM.hoehe / 2) * faktor,
    fensterHoehe - szeneHoehe,
  );

  const inhaltBreite = Math.max(INHALT_MINDESTBREITE, breite);
  return {
    szene: { links, oben, breite: szeneBreite, hoehe: szeneHoehe },
    bildschirm: {
      links: links + BILDSCHIRM.links * faktor,
      oben: oben + BILDSCHIRM.oben * faktor,
      breite,
      hoehe: BILDSCHIRM.hoehe * faktor,
    },
    inhaltBreite,
    massstab: breite / inhaltBreite,
  };
}

/** Hält die Szene am Fensterrand: zwischen `minimum` (≤ 0) und 0, damit kein leerer Rand entsteht. */
function klemme(wert, minimum) {
  return Math.min(0, Math.max(minimum, wert));
}
