# Datenbasis

`daten/bildungsplan.json` enthält den Bildungsplan Grafikerin/Grafiker EFZ in strukturierter Form. Alle Ansichten des Tools lesen aus dieser Datei; der Wortlaut eines Leistungsziels stammt immer von hier.

## Quellen

| Datei | Rolle |
| --- | --- |
| `quellen/grafiker-in-efz_bildungsplan.pdf` | Stammquelle: offizieller Bildungsplan des SBFI vom 1. Januar 2023 (Berufsnummer 90306). Liefert Nummern, Wortlaut, Lernort, K-Stufen, Fachbegriffe und Glossar. |
| `quellen/BiPla_Lernziele_230204.pdf` | Broschüre von Tobias Klauser und Felix Pfäffli. Liefert nur die Arbeitsphase je Handlungskompetenz. |

Weichen die beiden voneinander ab, gilt der offizielle Bildungsplan.

## Umfang

| | Anzahl |
| --- | --- |
| Handlungskompetenzbereiche (a–g) | 7 |
| Handlungskompetenzen | 33 |
| Leistungsziele | 357 |
| davon Betrieb | 153 |
| davon Berufsfachschule | 204 |
| Nummern an beiden Lernorten | 125 |
| Nummern an nur einem Lernort | 107 |
| Fachbegriffe (Anhang 2) | 21 |
| Einträge im Glossar der Berufsbildung | 25 |

Verteilung der Taxonomiestufen:

| | K1 | K2 | K3 | K4 | K5 | K6 |
| --- | --- | --- | --- | --- | --- | --- |
| Betrieb | 0 | 1 | 39 | 40 | 53 | 20 |
| Berufsfachschule | 9 | 59 | 53 | 46 | 29 | 8 |
| Total | 9 | 60 | 92 | 86 | 82 | 28 |

## Aufbau

```txt
quelle                  Titel, Stand, Berufsnummer, Dateinamen
lernorte[]              id (betrieb | schule), name
taxonomiestufen[]       stufe (1–6), kuerzel, begriff, beschreibung
arbeitsphasen[]         id, name, farbe (die fünf Phasen des «Graphic Design Workflow»)
bereiche[]              id (a–g), titel
  handlungskompetenzen[]  id (a1 …), titel, beschreibung, arbeitsphasen[], seite
    leistungsziele[]        id, nummer, lernort, text, stufe, seite
fachbegriffe[]          begriff, definition
berufsbildungsglossar[] begriff, definition
```

- `nummer` ist die Nummer aus dem Bildungsplan, etwa `b1.1`. Sie ist nicht eindeutig: Dieselbe Nummer steht oft an beiden Lernorten und bezeichnet dann die aufeinander abgestimmten Ziele.
- `id` ist eindeutig und setzt sich aus Nummer und Lernort zusammen, etwa `b1.1-betrieb` und `b1.1-schule`.
- `text` setzt den Satzanfang «Grafikerinnen und Grafiker …» fort und endet mit einem Punkt. Die K-Stufe steht nicht im Text, sondern in `stufe`.
- `seite` verweist auf die Seite im offiziellen Bildungsplan.
- `arbeitsphasen` einer Handlungskompetenz enthält die Ids ihrer Phasen. 31 Handlungskompetenzen gehören zu einer Phase; a4 gehört zu Vorbereitung, Entwicklung und Ausführung, g1 zu Vorbereitung, Entwicklung, Ausführung und Produktion.

## Arbeitsphasen

Die Broschüre kennzeichnet jede Seite mit einer Farbmarke am Seitenrand und nennt die Phase in derselben Farbe im Seitenkopf. Seiten mit der Bezeichnung «Mehrere Arbeitsphasen» tragen mehrere Marken. Die Farbwerte sind die RGB-Werte aus dem PDF.

| Phase | Farbe | Handlungskompetenzen |
| --- | --- | --- |
| Vorbereitung | `#ef3fa9` | a1, a2, a3, a4, b1, g1 |
| Entwicklung | `#009fe3` | a4, b2–b5, c1–c3, d1–d3, e1–e9, g1 |
| Ausführung | `#00ae41` | a4, f1–f4, g1 |
| Produktion | `#783cbd` | f5, g1 |
| Abschluss | `#fe5000` | a5, g2, g3 |

## Korrekturen an der Stammquelle

Der Wortlaut ist unverändert übernommen, auch wo er grammatikalisch holpert. Korrigiert sind nur diese Stellen:

| Stelle | Quelle | Datenbasis |
| --- | --- | --- |
| f3.4 Berufsfachschule | Taxonomiestufe «(F2)» | K2 |
| e8.3 Betrieb | «K5» ohne Klammern | K5 |
| a2.1 Berufsfachschule | «Projetvorgaben» | «Projektvorgaben» |
| a2.1 Berufsfachschule, c1.6 Betrieb | Punkt nach der Nummer («a2.1.») | Nummer ohne Punkt |
| e3.2 Berufsfachschule, e5.10 Betrieb | Schlusspunkt fehlt | Schlusspunkt ergänzt |
| Glossar | Fussnotenziffern im Fliesstext («BBG2», «20063») | entfernt |

Dazu kommen Trennfehler, die erst beim Auslesen des PDF entstehen, etwa «Auftrag gebenden» oder «Kommu nikationsstrategie». Sie sind in 19 Leistungszielen sowie in einzelnen Beschreibungen und Definitionen bereinigt und betreffen den Wortlaut nicht.

## Eigenheit der Stammquelle

Bei f1 steht das Ziel «formulieren anhand der Erkenntnisse ihrer Analyse gegebenenfalls die nötigen Anpassungen …» im Betrieb unter f1.2, an der Berufsfachschule unter f1.3. Die Nummer f1.2 der Berufsfachschule ist ein anderes Ziel («analysieren die Bestandteile eines exemplarischen Gestaltungskonzepts …»). Die Datenbasis folgt der offiziellen Nummerierung; die Broschüre führt das Betriebsziel als f1.3.

## Abweichungen der Broschüre

Sie sind nicht in die Datenbasis übernommen.

| Stelle | Offiziell | Broschüre |
| --- | --- | --- |
| g1.2 Berufsfachschule | K5 | K3 |
| g1.1 Betrieb | K5 | ohne K-Stufe |
| c3.3 Berufsfachschule | Nummer c3.3 | Nummer c3.2 (doppelt vergeben) |
| f1.2 Betrieb | Nummer f1.2 | Nummer f1.3 |
| e3.2, e3.9, e6.1, e7.2 Berufsfachschule | «alle benötigten Funktionen» | «Basisfunktionen» |
| f3.3 Betrieb | «Mikro- und Makrotypografie» | «Makrotypografie» |
| f3.3 Berufsfachschule | «typografische Regeln von Mikro- und Makrotypografie» | «typografische Regeln» |
| f2.1 Betrieb | «konsistent umgesetzt» | «konsistent eingesetzt» |
| Titel b2, b3, b4, c2, f1 | Mehrzahl, etwa b2 «Recherchen für Gestaltungsprojekte durchführen» | Einzahl, etwa b2 «Recherchen für ein Gestaltungsprojekt durchführen» |
