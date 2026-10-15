# Bildungsplan Grafikerin/Grafiker EFZ

Werkzeug zur Kursplanung: Leistungsziele aus dem Bildungsplan finden, zu Kursen zusammenstellen und als Nachweis kopieren.

<!-- hilfe:start -->

## Grundidee

Dieses Tool hilft dir, die zu deinem Kurs passenden Leistungsziele zusammenzustellen – durch eine filterbare Liste, eine Suche und durch eine Übersicht. Du kannst beliebig viele Kurse anlegen. Sie werden in deinem Browser gespeichert und bleiben, bis du den Browsercache löschst (du kannst sie auch herunterladen unter Meine Kurse). Der Button ‹Hinzufügen› rechts in der Kompetenzenliste fügt ein Ziel zu deinem aktuellen Kurs hinzu. Zwischen den Kursen wechselst Du im Reiter ‹Meine Kurse›, dort kann du auch neue anlegen.

## Kompetenzen

Alle Handlungskompetenzen mit ihren Leistungszielen.

- **Version**: Texte im Wortlaut des Graphic Design Workflow (Vorgabe) oder des Bildungsplans (SGD/SGV). Gilt für alle Ansichten und den Nachweis.
- **Suche**: Stichwort oder Nummer, etwa `Moodboard` oder `b1.1`. Mehrere Wörter müssen alle vorkommen. Durchsucht Titel, Beschreibungen und Ziele; Treffer sind gelb markiert. Beim Scrollen bleibt das Feld oben stehen.
- **Ziele zeigen**: alle Ziele einer gefundenen Kompetenz oder nur die, in denen die Suche trifft.
- **Filter**: Lernort, Taxonomiestufe, Handlungskompetenzbereich und Arbeitsphase. Mehrere Werte in einem Filter erweitern die Auswahl, mehrere Filter engen sie ein. «Filter zurücksetzen» hebt alle auf.
- **Fachbegriffe**: Punktiert unterstrichene Begriffe erklären sich beim Überfahren. Sucht man nach einem Fachbegriff, steht seine Erklärung über der Liste.
- **Hinzufügen / Entfernen**: legt ein Leistungsziel in den aktiven Kurs oder nimmt es heraus.
- **Gegenstück**: zeigt das entsprechende Ziel des anderen Lernorts.

## Übersicht

Alle Handlungskompetenzen auf einen Blick, geordnet nach Bereichen. Die Farbmarken zeigen die Arbeitsphasen. Ein Klick öffnet die Kompetenz unter «Kompetenzen».

## Glossar

Begriffe aus dem Bildungsplan mit ihrer Erklärung, je alphabetisch.

- **Fachbegriffe**: dieselben Begriffe, die in den Texten punktiert unterstrichen sind.
- **Berufsbildung**: Begriffe der Berufsbildung wie Lerndokumentation, Qualifikationsverfahren oder überbetriebliche Kurse.

## Meine Kurse

- **Liste**: alle Kurse mit der Zahl ihrer Leistungsziele je Lernort und Taxonomiestufe. Ein Klick öffnet den Kurs.
- **Neuer Kurs**: legt einen leeren Kurs an und öffnet ihn.
- **Sicherung**: Die Kurse liegen nur in diesem Browser. «Sicherung herunterladen» speichert alle Kurse in eine Datei, «Sicherung einlesen» ersetzt alle Kurse durch deren Inhalt.

## Kurs

Der Reiter rechts zeigt den aktiven Kurs und die Zahl seiner Leistungsziele.

- **Titel und Beschrieb**: werden laufend gespeichert.
- **Vorschlag**: nur in der lokalen Fassung. Claude liest Titel und Beschrieb und schlägt Leistungsziele mit Begründung vor.
- **Taxonomiestufen**: Verteilung der gewählten Ziele auf K1 bis K6.
- **Im Bildungsplan**: welche Handlungskompetenzen der Kurs wie stark abdeckt.
- **Nachweis**: die gewählten Ziele als Text zum Kopieren, in der eingestellten Version.
- **Kurs löschen**: entfernt den Kurs nach einer Rückfrage.

## Neue Funktionen

Neue Funktionen meldet ein Fenster beim nächsten Besuch. Nach dem Schliessen erscheint es erst bei der nächsten Neuerung wieder.

<!-- hilfe:end -->

## Entwicklung

```sh
npm install
npm run dev                      # Entwicklungsserver, Port 5173
npm run dev -- --port 5180       # mit eigenem Port
npm test
npm run build
```

Die Vorschläge laufen nur auf dem Entwicklungsserver; er ruft die Claude-Kommandozeile auf dem Rechner auf. Der Teil zwischen `hilfe:start` und `hilfe:end` erscheint in der Anwendung unter «Hilfe» und unterstützt Überschriften, Absätze, Listen, **fett**, `Code` und Links.

Weitere Unterlagen: [Datenbasis](docs/datenbasis.md), [Abweichungen](docs/abweichungen.md).
