import { describe, expect, it } from 'vitest';
import { anfangsstand, offen } from './neuigkeiten.js';

const liste = [
  { id: 'b', titel: 'B', text: '' },
  { id: 'a', titel: 'A', text: '' },
];

describe('anfangsstand', () => {
  it('zeigt beim ersten Besuch den Pfeil und keine Neuigkeiten', () => {
    const stand = anfangsstand(null, false, liste);
    expect(stand.pfeil).toBe(true);
    expect(offen(stand, liste)).toEqual([]);
  });

  it('meldet bisherigen Nutzern alle Neuigkeiten, ohne Pfeil', () => {
    const stand = anfangsstand(null, true, liste);
    expect(stand.pfeil).toBe(false);
    expect(offen(stand, liste)).toEqual(liste);
  });

  it('übernimmt einen gespeicherten Stand', () => {
    const stand = anfangsstand({ gemeldet: ['a'], pfeil: true }, true, liste);
    expect(stand.pfeil).toBe(true);
    expect(offen(stand, liste).map((n) => n.id)).toEqual(['b']);
  });

  it('verwirft einen unvollständigen Stand', () => {
    expect(anfangsstand({ gemeldet: 'a' }, true, liste)).toEqual({ gemeldet: [], pfeil: false });
  });
});
