import { describe, expect, it } from 'vitest';
import daten from '../daten/bildungsplan.json';
import { baueAuftrag, HOECHSTENS, pruefeAntwort } from './auftrag.js';

describe('baueAuftrag', () => {
  const kurs = { titel: 'Typografie 1', beschrieb: 'Schriftwahl und Satzspiegel.' };

  it('enthält Kurs und nur die Ziele des gewählten Lernorts', () => {
    const auftrag = baueAuftrag(daten, { ...kurs, lernort: 'schule' });
    expect(auftrag).toContain('Titel: Typografie 1');
    expect(auftrag).toContain('Schriftwahl und Satzspiegel.');
    expect(auftrag).toContain('b1.1-schule | K2 | erklären die Bestandteile und den Aufbau eines Briefings.');
    expect(auftrag.match(/-schule \| K/g)).toHaveLength(204);
    expect(auftrag).not.toContain('-betrieb |');
  });

  it('enthält ohne Lernort alle 357 Ziele', () => {
    const auftrag = baueAuftrag(daten, { ...kurs, lernort: '' });
    expect(auftrag.match(/-(schule|betrieb) \| K/g)).toHaveLength(357);
  });
});

describe('pruefeAntwort', () => {
  it('übernimmt gültige Vorschläge in ihrer Reihenfolge', () => {
    const antwort = {
      vorschlaege: [
        { id: 'e3.10-schule', begruendung: ' Schriftwahl ist Thema. ' },
        { id: 'b1.1-schule', begruendung: 'Briefing.' },
      ],
    };
    expect(pruefeAntwort(antwort, daten, 'schule')).toEqual([
      { id: 'e3.10-schule', begruendung: 'Schriftwahl ist Thema.' },
      { id: 'b1.1-schule', begruendung: 'Briefing.' },
    ]);
  });

  it('verwirft erfundene Ids, den falschen Lernort, Wiederholungen und Unvollständiges', () => {
    const antwort = {
      vorschlaege: [
        { id: 'z9.9-schule', begruendung: 'erfunden' },
        { id: 'b1.1-betrieb', begruendung: 'falscher Lernort' },
        { id: 'b1.1-schule', begruendung: 'gültig' },
        { id: 'b1.1-schule', begruendung: 'doppelt' },
        { id: 'e3.10-schule' },
      ],
    };
    expect(pruefeAntwort(antwort, daten, 'schule')).toEqual([{ id: 'b1.1-schule', begruendung: 'gültig' }]);
  });

  it('begrenzt die Anzahl', () => {
    const alle = daten.bereiche
      .flatMap((bereich) => bereich.handlungskompetenzen)
      .flatMap((kompetenz) => kompetenz.leistungsziele)
      .map((ziel) => ({ id: ziel.id, begruendung: 'x' }));
    expect(pruefeAntwort({ vorschlaege: alle }, daten, '')).toHaveLength(HOECHSTENS);
  });

  it('kommt mit einer unbrauchbaren Antwort zurecht', () => {
    expect(pruefeAntwort(null, daten, 'schule')).toEqual([]);
    expect(pruefeAntwort({ vorschlaege: 'nein' }, daten, 'schule')).toEqual([]);
  });
});
