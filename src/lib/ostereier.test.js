import { describe, expect, it } from 'vitest';
import { enthaeltWort } from './ostereier.js';

describe('enthaeltWort', () => {
  it('findet das Wort ohne Rücksicht auf Gross- und Kleinschreibung', () => {
    expect(enthaeltWort('Banane', 'banane')).toBe(true);
    expect(enthaeltWort('die BANANE.', 'banane')).toBe(true);
  });

  it('findet nur das ganze Wort', () => {
    expect(enthaeltWort('Bananenbrot', 'banane')).toBe(false);
    expect(enthaeltWort('cmyk-Auszug', 'cmyk')).toBe(true);
    expect(enthaeltWort('Beschnittzugabe', 'beschnitt')).toBe(false);
  });

  it('zählt Umlaute als Buchstaben', () => {
    expect(enthaeltWort('Bananeä', 'banane')).toBe(false);
    expect(enthaeltWort('übanane', 'banane')).toBe(false);
  });

  it('findet eine Wortfolge auch mit mehreren Leerzeichen', () => {
    expect(enthaeltWort('comic  SANS ms', 'comic sans')).toBe(true);
    expect(enthaeltWort('comicsans', 'comic sans')).toBe(false);
  });
});
