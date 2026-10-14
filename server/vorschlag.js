import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { baueAuftrag, pruefeAntwort, SCHEMA, SYSTEM } from './auftrag.js';

const PFAD = '/api/vorschlag';
const MODELL = 'opus';
const FRIST_MS = 120_000;
const HOECHSTLAENGE = 20_000;
const LERNORTE = ['', 'betrieb', 'schule'];

/** Fehler, dessen Meldung für die Oberfläche bestimmt ist. */
class Meldung extends Error {
  constructor(status, text) {
    super(text);
    this.status = status;
  }
}

async function leseAnfrage(req) {
  let text = '';
  for await (const stueck of req) {
    text += stueck;
    if (text.length > HOECHSTLAENGE) throw new Meldung(413, 'Der Kursbeschrieb ist zu lang.');
  }
  let anfrage;
  try {
    anfrage = JSON.parse(text);
  } catch {
    throw new Meldung(400, 'Die Anfrage ist nicht lesbar.');
  }
  const { titel, beschrieb, lernort } = anfrage ?? {};
  if (typeof titel !== 'string' || typeof beschrieb !== 'string' || !LERNORTE.includes(lernort)) {
    throw new Meldung(400, 'Die Anfrage ist unvollständig.');
  }
  if (beschrieb.trim() === '') throw new Meldung(400, 'Der Kurs hat noch keinen Beschrieb.');
  return { titel, beschrieb, lernort };
}

/**
 * Ruft die Claude-Kommandozeile auf und liefert ihre strukturierte Antwort.
 * Sie läuft mit der Anmeldung des Rechners, ohne Werkzeuge und ohne die
 * Einstellungen, Skills und MCP-Server der Person: Gefragt ist nur Text.
 */
function frageClaude(auftrag) {
  return new Promise((erfuellt, abgelehnt) => {
    const prozess = spawn(
      'claude',
      [
        '--print',
        '--model', MODELL,
        '--system-prompt', SYSTEM,
        '--json-schema', JSON.stringify(SCHEMA),
        '--output-format', 'json',
        '--tools', '',
        '--strict-mcp-config',
        '--setting-sources', '',
        '--disable-slash-commands',
        '--no-session-persistence',
      ],
      // Ausserhalb des Projekts, damit dessen CLAUDE.md nicht mitgelesen wird.
      { cwd: tmpdir(), timeout: FRIST_MS },
    );
    let ausgabe = '';
    let fehler = '';
    prozess.stdout.on('data', (stueck) => (ausgabe += stueck));
    prozess.stderr.on('data', (stueck) => (fehler += stueck));
    prozess.on('error', (ursache) =>
      abgelehnt(
        ursache.code === 'ENOENT'
          ? new Meldung(502, 'Die Claude-Kommandozeile wurde nicht gefunden.')
          : ursache,
      ),
    );
    prozess.on('close', (code, signal) => {
      if (signal) return abgelehnt(new Meldung(504, 'Claude hat nicht rechtzeitig geantwortet.'));
      let ergebnis;
      try {
        ergebnis = JSON.parse(ausgabe);
      } catch {
        return abgelehnt(new Meldung(502, `Claude hat nicht geantwortet. ${fehler.trim()}`.trim()));
      }
      if (code !== 0 || ergebnis.is_error) {
        return abgelehnt(new Meldung(502, `Claude meldet einen Fehler: ${ergebnis.result ?? fehler}`));
      }
      erfuellt(ergebnis.structured_output);
    });
    prozess.stdin.end(auftrag);
  });
}

/**
 * Vite-Plugin: Der Entwicklungsserver nimmt unter `/api/vorschlag` einen Kurs
 * entgegen und antwortet mit Leistungszielen, die Claude dazu vorschlägt.
 * @returns {import('vite').Plugin}
 */
export function vorschlag() {
  return {
    name: 'bildungsplan-vorschlag',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(PFAD, async (req, res) => {
        const antworte = (status, inhalt) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(inhalt));
        };
        try {
          if (req.method !== 'POST') throw new Meldung(405, 'Nur POST ist erlaubt.');
          // JSON als Inhaltstyp kann eine fremde Website nicht ohne Rückfrage
          // senden; so löst keine andere Seite im Browser Anfragen aus.
          if (!req.headers['content-type']?.startsWith('application/json')) {
            throw new Meldung(415, 'Die Anfrage muss JSON sein.');
          }
          const anfrage = await leseAnfrage(req);
          const daten = JSON.parse(
            await readFile(new URL('../daten/bildungsplan.json', import.meta.url), 'utf8'),
          );
          const antwort = await frageClaude(baueAuftrag(daten, anfrage));
          antworte(200, { vorschlaege: pruefeAntwort(antwort, daten, anfrage.lernort) });
        } catch (fehler) {
          if (fehler instanceof Meldung) return antworte(fehler.status, { meldung: fehler.message });
          server.config.logger.error(fehler.stack ?? String(fehler));
          antworte(500, { meldung: 'Beim Vorschlagen ist ein Fehler aufgetreten.' });
        }
      });
    },
  };
}
