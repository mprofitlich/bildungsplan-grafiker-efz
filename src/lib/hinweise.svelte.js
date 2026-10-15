import { anfangsstand, neuigkeiten } from './neuigkeiten.js';

const SCHLUESSEL = 'bildungsplan.hinweise';

function laden() {
  try {
    // Läuft beim Import, bevor kurse.svelte.js seinen ersten Stand schreibt:
    // Dessen Speichern ist ein Effekt und kommt erst nach dem Laden der Module.
    const warSchonDa = localStorage.getItem('bildungsplan.kurse') !== null;
    return anfangsstand(JSON.parse(localStorage.getItem(SCHLUESSEL)), warSchonDa);
  } catch {
    // Ohne Speicher gibt es weder Pfeil noch Meldung, sonst kämen sie bei jedem Besuch.
    return { gemeldet: neuigkeiten.map((n) => n.id), pfeil: false };
  }
}

/**
 * Was dieser Browser an Hinweisen schon gesehen hat.
 * @type {import('./neuigkeiten.js').Hinweise}
 */
export const hinweise = $state(laden());

$effect.root(() => {
  $effect(() => {
    try {
      localStorage.setItem(SCHLUESSEL, JSON.stringify(hinweise));
    } catch {
      // Dann gilt der Stand nur bis zum Neuladen.
    }
  });
});

/**
 * Der Reiter «Styleguide», den die Suche nach «Styleguide» freischaltet, und
 * der Pfeil darauf. Nicht gespeichert: Nach dem Neuladen ist das Ei wieder versteckt.
 */
export const styleguide = $state({ frei: false, pfeil: false });

/** Schaltet den Reiter «Styleguide» frei; beim ersten Mal zeigt ein Pfeil darauf. */
export function styleguideGefunden() {
  if (styleguide.frei) return;
  styleguide.frei = true;
  styleguide.pfeil = true;
}

/** Merkt sich alle aktuellen Neuigkeiten als gemeldet. */
export function neuigkeitenGelesen() {
  hinweise.gemeldet = [...new Set([...hinweise.gemeldet, ...neuigkeiten.map((n) => n.id)])];
}
