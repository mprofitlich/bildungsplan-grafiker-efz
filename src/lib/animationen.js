/**
 * Die klassischen Übungen der Animationsausbildung, in der Reihenfolge, in der
 * sie aufeinander aufbauen. Jede rechnet ihre Bewegung vorab Bild für Bild aus,
 * in Pixeln des Fensters.
 */

/** Bilder pro Sekunde, in denen die Übungen gerechnet sind. */
export const BILDRATE = 60;

const SCHWERKRAFT = 2600; // px/s²
// Langsamer prallt ein Ball nicht mehr ab, er rollt.
const ROLLEN = 150; // px/s

/**
 * @typedef {{ typ: 'ball', cx: number, cy: number, rx: number, ry: number, winkel: number, farbe: string }
 *   | { typ: 'schatten', cx: number, cy: number, rx: number, deckung: number }
 *   | { typ: 'linie', x1: number, y1: number, x2: number, y2: number }
 *   | { typ: 'pfad', d: string, farbe?: string, breite: number }
 *   | { typ: 'punkt', cx: number, cy: number, r: number }} Form
 */

/**
 * @typedef {object} Ablauf
 * @property {Form[]} kulisse was die ganze Zeit stillsteht
 * @property {Form[][]} bilder je Bild die bewegten Formen
 */

/**
 * @typedef {object} Uebung
 * @property {string} name
 * @property {(breite: number, hoehe: number) => Ablauf} ablauf
 */

/**
 * @typedef {object} Zustand
 * @property {number} x Mitte
 * @property {number} unten Unterkante
 * @property {number} vx
 * @property {number} vy
 * @property {number} stauchen 0 in der Luft, bis 0.35 beim Aufprall
 */

/**
 * Lässt einen Ball fallen und springen, bis er rechts hinaus ist oder die Zeit um.
 * @param {object} a
 * @param {number} a.x
 * @param {number} a.unten Unterkante beim Start
 * @param {number} a.vx
 * @param {number} a.r
 * @param {(x: number) => number} a.boden Höhe des Bodens unter x
 * @param {number} a.elastizitaet Anteil der Geschwindigkeit, der beim Aufprall bleibt
 * @param {boolean} [a.starr] staucht sich beim Aufprall nicht
 * @param {number} [a.dauer] in Sekunden
 * @param {number} [a.ende] x, ab dem der Ball verschwunden ist
 * @returns {Zustand[]}
 */
export function springe({ x, unten, vx, r, boden, elastizitaet, starr = false, dauer = 20, ende = Infinity }) {
  let vy = 0;
  let stauchen = 0;
  /** @type {Zustand[]} */
  const zustaende = [];
  for (let bild = 0; bild < dauer * BILDRATE && x < ende; bild++) {
    vy += SCHWERKRAFT / BILDRATE;
    unten += vy / BILDRATE;
    x += vx / BILDRATE;
    const grund = boden(x);
    if (unten >= grund) {
      unten = grund;
      if (vy > ROLLEN) {
        // Ein harter Aufprall staucht stärker und länger.
        if (!starr) stauchen = Math.min(0.35, vy / 4000);
        vy = -vy * elastizitaet;
      } else {
        vy = 0;
      }
    }
    zustaende.push({ x, unten, vx, vy, stauchen });
    stauchen = Math.max(0, stauchen - 0.12);
  }
  return zustaende;
}

/**
 * Formt den Ball: gestaucht beim Aufprall, im Flug gestreckt in Flugrichtung.
 * @param {Zustand} z
 * @param {number} r
 * @param {string} farbe
 * @returns {Form}
 */
function ball(z, r, farbe) {
  if (z.stauchen > 0) {
    const sy = 1 - z.stauchen;
    return { typ: 'ball', cx: z.x, cy: z.unten - r * sy, rx: r / sy, ry: r * sy, winkel: 0, farbe };
  }
  const dehnung = z.vy === 0 ? 0 : Math.min(0.3, Math.hypot(z.vx, z.vy) / 6000);
  const sy = 1 + dehnung;
  // Die lange Achse der Ellipse ist ihre senkrechte; sie dreht sich in die Flugrichtung.
  const winkel = (Math.atan2(z.vy, z.vx) * 180) / Math.PI - 90;
  return { typ: 'ball', cx: z.x, cy: z.unten - r, rx: r / sy, ry: r * sy, winkel, farbe };
}

/**
 * Der Schatten wird kleiner und blasser, je höher der Ball springt.
 * @param {Zustand} z
 * @param {number} r
 * @param {number} boden
 * @returns {Form}
 */
function schatten(z, r, boden) {
  const naehe = Math.max(0.2, 1 - (boden - z.unten) / 500);
  return { typ: 'schatten', cx: z.x, cy: boden, rx: r * naehe, deckung: naehe };
}

const ROT = '#e5322a';

/** @type {Uebung[]} */
export const uebungen = [
  {
    name: 'Der hüpfende Ball',
    ablauf(breite, hoehe) {
      const r = 24;
      const boden = hoehe - 16;
      const zustaende = springe({
        x: -2 * r,
        unten: boden - Math.min(420, hoehe * 0.6),
        vx: (breite + 4 * r) / 4,
        r,
        boden: () => boden,
        elastizitaet: 0.7,
        ende: breite + 2 * r,
      });
      return { kulisse: [], bilder: zustaende.map((z) => [schatten(z, r, boden), ball(z, r, ROT)]) };
    },
  },
  {
    // Beide fallen gleich schnell; erst der Aufprall verrät das Gewicht.
    name: 'Bowlingkugel und Pingpongball',
    ablauf(breite, hoehe) {
      const boden = hoehe - 16;
      const start = boden - Math.min(420, hoehe * 0.6);
      const gemeinsam = { unten: start, vx: 0, boden: () => boden, dauer: 4.5 };
      const schwer = springe({ ...gemeinsam, x: breite * 0.38, r: 32, elastizitaet: 0.15, starr: true });
      const leicht = springe({ ...gemeinsam, x: breite * 0.62, r: 11, elastizitaet: 0.8 });
      return {
        kulisse: [],
        bilder: schwer.map((z, i) => [
          schatten(z, 32, boden),
          schatten(leicht[i], 11, boden),
          ball(z, 32, '#2b2a6b'),
          ball(leicht[i], 11, '#ff8a00'),
        ]),
      };
    },
  },
  {
    name: 'Ball über die Treppe',
    ablauf(breite, hoehe) {
      const r = 20;
      const boden = hoehe - 16;
      const stufen = 5;
      const tritt = Math.min(140, (breite * 0.55) / stufen);
      const steigung = 44;
      const anfang = breite - stufen * tritt - 3 * r;
      const oben = boden - stufen * steigung;
      const grund = (x) => (x < anfang ? oben : Math.min(boden, oben + Math.ceil((x - anfang) / tritt) * steigung));
      const zustaende = springe({
        x: -2 * r,
        unten: oben - 260,
        vx: (breite + 4 * r) / 5,
        r,
        boden: grund,
        elastizitaet: 0.55,
        ende: breite + 2 * r,
      });
      let d = `M0 ${oben} H${anfang}`;
      for (let i = 1; i <= stufen; i++) d += ` V${oben + i * steigung} H${anfang + i * tritt}`;
      d += ` H${breite}`;
      return { kulisse: [{ typ: 'pfad', d, breite: 2 }], bilder: zustaende.map((z) => [ball(z, r, ROT)]) };
    },
  },
  {
    // Langsam an den Umkehrpunkten, schnell in der Mitte, und immer auf dem Bogen.
    name: 'Das Pendel',
    ablauf(breite, hoehe) {
      const r = 22;
      const laenge = Math.min(hoehe * 0.7, 520);
      const ax = breite / 2;
      const kreisfrequenz = Math.sqrt(SCHWERKRAFT / laenge);
      /** @type {Form[][]} */
      const bilder = [];
      for (let bild = 0; bild < 6 * BILDRATE; bild++) {
        const t = bild / BILDRATE;
        const winkel = Math.exp(-0.15 * t) * Math.cos(kreisfrequenz * t);
        const x = ax + laenge * Math.sin(winkel);
        const y = laenge * Math.cos(winkel);
        bilder.push([
          { typ: 'linie', x1: ax, y1: 0, x2: x, y2: y },
          { typ: 'ball', cx: x, cy: y, rx: r, ry: r, winkel: 0, farbe: ROT },
        ]);
      }
      return { kulisse: [{ typ: 'punkt', cx: ax, cy: 0, r: 5 }], bilder };
    },
  },
  {
    // Der Schwanz folgt der Bahn des Balls mit Verzögerung und schwingt nach.
    name: 'Ball mit Schwanz',
    ablauf(breite, hoehe) {
      const r = 22;
      const boden = hoehe - 16;
      const zustaende = springe({
        x: -2 * r,
        unten: boden - Math.min(420, hoehe * 0.6),
        vx: (breite + 4 * r) / 4,
        r,
        boden: () => boden,
        elastizitaet: 0.7,
        ende: breite + 12 * r,
      });
      const mitte = (z) => `${z.x.toFixed(1)} ${(z.unten - r).toFixed(1)}`;
      const GLIEDER = 8;
      return {
        kulisse: [],
        bilder: zustaende.map((z, i) => {
          const punkte = Array.from({ length: GLIEDER + 1 }, (_, k) => zustaende[Math.max(0, i - 2 * k)]);
          // Ein Stück pro Glied, jedes dünner als das vorige; die runden Enden verbinden sie.
          const schwanz = punkte.slice(1).map((punkt, k) => ({
            typ: 'pfad',
            d: `M${mitte(punkte[k])} L${mitte(punkt)}`,
            farbe: ROT,
            breite: 12 - (10 * k) / (GLIEDER - 1),
          }));
          return [schatten(z, r, boden), ...schwanz, ball(z, r, ROT)];
        }),
      };
    },
  },
];
