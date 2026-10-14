import { expect, it } from 'vitest';
import { nachweis } from './nachweis.js';

it('gruppiert die Ziele nach Handlungskompetenz und nennt Lernort und K-Stufe', () => {
  const text = nachweis({
    titel: 'Typografie 1',
    beschrieb: 'Grundlagen der Schriftwahl.',
    ziele: ['e3.10-schule', 'b1.1-schule', 'unbekannt'],
  });
  expect(text).toBe(
    [
      'Typografie 1',
      '',
      'Grundlagen der Schriftwahl.',
      '',
      'Leistungsziele gemäss Bildungsplan Grafikerin/Grafiker EFZ vom 1. Januar 2023',
      'Grafikerinnen und Grafiker …',
      '',
      'b1 Briefing analysieren und mit den Auftraggebenden anpassen',
      'b1.1 (Berufsfachschule, K2) erklären die Bestandteile und den Aufbau eines Briefings.',
      '',
      'e3 Typografie- und Layoutkonzepte entwickeln',
      'e3.10 (Berufsfachschule, K2) erläutern die Kriterien der Schriftwahl und deren rechtliche Aspekte.',
    ].join('\n'),
  );
});
