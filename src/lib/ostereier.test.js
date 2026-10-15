import { describe, expect, it } from 'vitest';
import { enthaeltWortanfang } from './ostereier.js';

describe('enthaeltWortanfang', () => {
  it('findet das Wort ohne Rücksicht auf Gross- und Kleinschreibung', () => {
    expect(enthaeltWortanfang('Banane', 'banane')).toBe(true);
    expect(enthaeltWortanfang('die BANANE.', 'banane')).toBe(true);
  });

  it('findet Zusammensetzungen und Beugungen, die mit dem Wort beginnen', () => {
    expect(enthaeltWortanfang('Animationskonzept', 'animation')).toBe(true);
    expect(enthaeltWortanfang('Motionkonzept', 'motion')).toBe(true);
    expect(enthaeltWortanfang('Moodboards', 'moodboard')).toBe(true);
    expect(enthaeltWortanfang('cmyk-Auszug', 'cmyk')).toBe(true);
  });

  it('findet das Wort nicht mitten in einem anderen', () => {
    expect(enthaeltWortanfang('Emotion', 'motion')).toBe(false);
    expect(enthaeltWortanfang('Reanimation', 'animation')).toBe(false);
  });

  it('zählt Umlaute als Buchstaben', () => {
    expect(enthaeltWortanfang('übanane', 'banane')).toBe(false);
  });

  it('findet eine Wortfolge auch mit mehreren Leerzeichen', () => {
    expect(enthaeltWortanfang('comic  SANS ms', 'comic sans')).toBe(true);
    expect(enthaeltWortanfang('comicsans', 'comic sans')).toBe(false);
  });
});
