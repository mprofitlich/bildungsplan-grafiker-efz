import { describe, expect, it } from 'vitest';
import { sicherungsname } from './kurse.svelte.js';

describe('sicherungsname', () => {
  it('setzt Datum und Uhrzeit zweistellig in den Namen', () => {
    expect(sicherungsname(new Date(2026, 9, 15, 22, 28))).toBe(
      'bildungsplan-kurse-261015-2228-def-final-final2.json',
    );
  });

  it('füllt einstellige Werte mit einer Null auf', () => {
    expect(sicherungsname(new Date(2027, 0, 5, 7, 3))).toBe(
      'bildungsplan-kurse-270105-0703-def-final-final2.json',
    );
  });
});
