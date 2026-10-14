import { describe, expect, it } from 'vitest';
import {
  filtere,
  findeFachbegriffe,
  gegenstueck,
  gruppiere,
  wortlaut,
  ziel,
  ziele,
} from './bildungsplan.js';

describe('filtere', () => {
  it('liefert ohne Kriterien alle 357 Leistungsziele', () => {
    expect(filtere(ziele, {})).toHaveLength(357);
  });

  it('verknüpft Lernort und Taxonomiestufe', () => {
    const treffer = filtere(ziele, { lernort: 'betrieb', stufen: [6] });
    expect(treffer).toHaveLength(20);
    expect(treffer.every((z) => z.lernort === 'betrieb' && z.stufe === 6)).toBe(true);
  });

  it('schränkt auf Bereiche ein', () => {
    expect(filtere(ziele, { bereiche: ['d'] })).toHaveLength(25);
  });

  it('schränkt auf Arbeitsphasen ein und zählt Kompetenzen mit mehreren Phasen mit', () => {
    const treffer = filtere(ziele, { phasen: ['produktion'] });
    expect([...new Set(treffer.map((z) => z.kompetenz))]).toEqual(['f5', 'g1']);
    expect(treffer).toHaveLength(15);
  });

  it('sucht ohne Rücksicht auf Gross- und Kleinschreibung und Umlaute', () => {
    const treffer = filtere(ziele, { suche: 'ANSATZE moodboards' });
    expect(treffer.map((z) => z.id)).toEqual(['c2.5-schule']);
  });

  it('findet ein Ziel über seine Nummer', () => {
    expect(filtere(ziele, { suche: 'b1.1' }).map((z) => z.id)).toEqual(['b1.1-betrieb', 'b1.1-schule']);
  });

  it('prüft Taxonomiestufe und Suche im Wortlaut der gewählten Fassung', () => {
    const k3 = (fassung) => filtere(ziele, { stufen: [3], suche: 'präsentation', fassung }).map((z) => z.id);
    expect(k3('bildungsplan')).not.toContain('g1.2-schule');
    expect(k3('broschuere')).toContain('g1.2-schule');
    expect(filtere(ziele, { suche: 'basisfunktionen' })).toHaveLength(0);
    expect(filtere(ziele, { suche: 'basisfunktionen', fassung: 'broschuere' })).toHaveLength(4);
  });
});

describe('wortlaut', () => {
  it('überschreibt nur die Felder, in denen die Broschüre abweicht', () => {
    const z = wortlaut(ziel('c3.3-schule'), 'broschuere');
    expect(z.nummer).toBe('c3.2');
    expect(z.text).toBe(ziel('c3.3-schule').text);
    expect(wortlaut(ziel('c3.3-schule'), 'bildungsplan').nummer).toBe('c3.3');
  });
});

describe('gegenstueck', () => {
  it('liefert das Ziel mit derselben Nummer am anderen Lernort', () => {
    expect(gegenstueck(ziel('b1.1-schule')).id).toBe('b1.1-betrieb');
  });

  it('liefert nichts, wenn die Nummer nur an einem Lernort vorkommt', () => {
    expect(gegenstueck(ziel('a1.2-schule'))).toBeUndefined();
  });
});

describe('gruppiere', () => {
  it('ordnet nach Bildungsplan, unabhängig von der Reihenfolge der Eingabe', () => {
    const gruppen = gruppiere([ziel('e3.2-schule'), ziel('a1.3-schule'), ziel('a1.1-schule')]);
    expect(gruppen.map((g) => g.kompetenz.id)).toEqual(['a1', 'e3']);
    expect(gruppen[0].ziele.map((z) => z.nummer)).toEqual(['a1.1', 'a1.3']);
  });
});

describe('findeFachbegriffe', () => {
  it('findet Begriffe aus Anhang 2', () => {
    expect(findeFachbegriffe('moodb').map((e) => e.begriff)).toEqual(['Moodboard']);
  });

  it('bleibt bei zu kurzer Eingabe leer', () => {
    expect(findeFachbegriffe('mo')).toEqual([]);
  });
});
