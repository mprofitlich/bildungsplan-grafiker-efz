import { describe, expect, it } from 'vitest';
import { getroffen, markiere } from './hervorhebung.js';

const treffer = (abschnitte) => abschnitte.filter((a) => a.treffer).map((a) => a.text);

describe('markiere', () => {
  it('lässt den Text ohne Suche unverändert', () => {
    expect(markiere('erstellen Moodboards.', '')).toEqual([{ text: 'erstellen Moodboards.', treffer: false }]);
  });

  it('findet Wörter ohne Rücksicht auf Gross- und Kleinschreibung und Umlaute', () => {
    expect(treffer(markiere('entwickeln visuelle Ansätze für Moodboards.', 'ANSATZE moodboard'))).toEqual([
      'Ansätze',
      'Moodboard',
    ]);
  });

  it('markiert das ganze «ß», auch wenn die Suche «ss» schreibt', () => {
    const abschnitte = markiere('gemäss den Maßnahmen.', 'massnahmen');
    expect(treffer(abschnitte)).toEqual(['Maßnahmen']);
    expect(abschnitte.map((a) => a.text).join('')).toBe('gemäss den Maßnahmen.');
  });

  it('fasst überlappende Treffer zu einem Abschnitt zusammen', () => {
    expect(treffer(markiere('Typografie', 'typo grafie'))).toEqual(['Typografie']);
  });
});

describe('getroffen', () => {
  it('erkennt eine Nummer in der Suche', () => {
    expect(getroffen('b1.1', 'Briefing b1.1')).toBe(true);
    expect(getroffen('b1.2', 'b1.1')).toBe(false);
  });
});
