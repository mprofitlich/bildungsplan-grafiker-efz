import { fassungen } from './katalog.js';

const SCHLUESSEL = 'bildungsplan.fassung';

function laden() {
  try {
    const gespeichert = localStorage.getItem(SCHLUESSEL);
    if (fassungen.some((fassung) => fassung.id === gespeichert)) return gespeichert;
  } catch {
    // Ohne Speicher gilt der Bildungsplan.
  }
  return 'bildungsplan';
}

/**
 * Die Fassung, in deren Wortlaut Katalog und Kurs die Leistungsziele zeigen.
 * @type {{ id: 'bildungsplan' | 'broschuere' }}
 */
export const fassung = $state({ id: laden() });

$effect.root(() => {
  $effect(() => {
    try {
      localStorage.setItem(SCHLUESSEL, fassung.id);
    } catch {
      // Die Wahl gilt dann nur bis zum Neuladen.
    }
  });
});
