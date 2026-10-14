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

it('markiert in der Fassung der Broschüre jede Abweichung mit dem Wert des Bildungsplans', () => {
  const text = nachweis(
    { titel: 'Präsentation', beschrieb: '', ziele: ['g1.1-betrieb', 'g1.2-schule', 'g1.3-schule', 'b2.2-schule'] },
    'broschuere',
  );
  const zeilen = text.split('\n');
  expect(zeilen[2]).toMatch(/^Leistungsziele gemäss Broschüre zum «Graphic Design Workflow»/);
  expect(zeilen).toContain('b2 Recherchen für ein Gestaltungsprojekt durchführen [SGD/SGV: «Recherchen für Gestaltungsprojekte durchführen»]');
  expect(zeilen).toContain(
    'g1.1 (Betrieb, ohne K-Stufe) erstellen eine Präsentation, die das Projektziel inhaltlich systematisch, prägnant und nachvollziehbar visualisiert. [SGD/SGV: K5]',
  );
  expect(zeilen).toContain(
    'g1.2 (Berufsfachschule, K3) strukturieren eine Präsentation mit einem logischen und dramaturgisch interessanten Ablauf. [SGD/SGV: K5]',
  );
  expect(zeilen.find((zeile) => zeile.startsWith('g1.3'))).not.toContain('[');
});

it('zeigt die Nummer der Broschüre und nennt die offizielle', () => {
  const text = nachweis({ titel: 'Strategie', beschrieb: '', ziele: ['c3.3-schule'] }, 'broschuere');
  expect(text).toMatch(/^c3\.2 \(Berufsfachschule, K3\) .* \[SGD\/SGV: c3\.3\]$/m);
});
