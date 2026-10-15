import { describe, expect, it } from 'vitest';
import { springe, uebungen } from './animationen.js';

describe('springe', () => {
  const boden = 800;
  const fallen = (elastizitaet) =>
    springe({ x: 0, unten: 400, vx: 0, r: 20, boden: () => boden, elastizitaet, dauer: 4 });
  const hoechsterRuecksprung = (zustaende) => {
    const ersterAufprall = zustaende.findIndex((z) => z.unten === boden);
    return boden - Math.min(...zustaende.slice(ersterAufprall).map((z) => z.unten));
  };

  it('sinkt nie unter den Boden', () => {
    expect(fallen(0.7).every((z) => z.unten <= boden)).toBe(true);
  });

  it('springt mit mehr Elastizität höher zurück', () => {
    expect(hoechsterRuecksprung(fallen(0.8))).toBeGreaterThan(5 * hoechsterRuecksprung(fallen(0.15)));
  });

  it('kommt ohne Elastizität zur Ruhe', () => {
    expect(fallen(0.15).at(-1).vy).toBe(0);
  });
});

describe('uebungen', () => {
  it.each(uebungen.map((uebung) => [uebung.name, uebung]))('%s liefert Bilder mit endlichen Zahlen', (_, uebung) => {
    const { kulisse, bilder } = uebung.ablauf(1280, 900);
    expect(bilder.length).toBeGreaterThan(60);
    const zahlen = [...kulisse, ...bilder.flat()].flatMap((form) =>
      Object.values(form).filter((wert) => typeof wert === 'number'),
    );
    expect(zahlen.every(Number.isFinite)).toBe(true);
  });
});
