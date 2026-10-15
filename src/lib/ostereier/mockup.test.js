import { describe, expect, it } from 'vitest';
import { BILD, BILDSCHIRM, lage } from './mockup.js';

const fenster = [
  [1024, 768],
  [1440, 900],
  [1920, 1080],
  [2560, 1080],
  [1280, 1024],
];

describe('lage', () => {
  it.each(fenster)('deckt das Fenster %i × %i mit der Szene', (breite, hoehe) => {
    const { szene } = lage(breite, hoehe);
    expect(szene.links).toBeLessThanOrEqual(0);
    expect(szene.oben).toBeLessThanOrEqual(0);
    expect(szene.links + szene.breite).toBeGreaterThanOrEqual(breite - 0.001);
    expect(szene.oben + szene.hoehe).toBeGreaterThanOrEqual(hoehe - 0.001);
  });

  it.each(fenster)('lässt den Bildschirm im Fenster %i × %i ganz sichtbar', (breite, hoehe) => {
    const { bildschirm } = lage(breite, hoehe);
    expect(bildschirm.links).toBeGreaterThanOrEqual(0);
    expect(bildschirm.oben).toBeGreaterThanOrEqual(0);
    expect(bildschirm.links + bildschirm.breite).toBeLessThanOrEqual(breite);
    expect(bildschirm.oben + bildschirm.hoehe).toBeLessThanOrEqual(hoehe);
  });

  it('setzt den Bildschirm an die Stelle des Lochs im Bild', () => {
    const { szene, bildschirm } = lage(1440, 900);
    const faktor = szene.breite / BILD.breite;
    expect(bildschirm.links).toBeCloseTo(szene.links + BILDSCHIRM.links * faktor);
    expect(bildschirm.oben).toBeCloseTo(szene.oben + BILDSCHIRM.oben * faktor);
    expect(bildschirm.hoehe / bildschirm.breite).toBeCloseTo(BILDSCHIRM.hoehe / BILDSCHIRM.breite);
  });

  it('setzt die Seite mindestens in Desktopbreite und verkleinert sie auf den Bildschirm', () => {
    const { bildschirm, inhaltBreite, massstab } = lage(1440, 900);
    expect(inhaltBreite).toBe(1100);
    expect(inhaltBreite * massstab).toBeCloseTo(bildschirm.breite);
  });

  it('vergrössert die Seite nie über ihre wahre Grösse', () => {
    expect(lage(3840, 2160).massstab).toBe(1);
  });
});
