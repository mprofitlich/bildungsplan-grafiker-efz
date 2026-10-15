import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { alsHtml, hilfeteil } from './hilfe.js';

describe('hilfeteil', () => {
  it('liefert nur den Teil zwischen den Markierungen', () => {
    const readme = '# Titel\n<!-- hilfe:start -->\n## Hilfe\n<!-- hilfe:end -->\n## Entwicklung';
    expect(hilfeteil(readme)).toBe('## Hilfe');
  });

  it('findet in der README einen Hilfeteil ohne Entwicklungsabschnitt', () => {
    const teil = hilfeteil(readFileSync(new URL('../../README.md', import.meta.url), 'utf8'));
    expect(teil).toContain('## Kompetenzen');
    expect(teil).not.toContain('## Entwicklung');
  });
});

describe('alsHtml', () => {
  it('setzt Überschriften, Absätze und Listen um', () => {
    expect(alsHtml('## Kurs\n\nEin Absatz\nüber zwei Zeilen.\n\n- **eins**: a\n- `zwei`')).toBe(
      '<h2>Kurs</h2>\n<p>Ein Absatz über zwei Zeilen.</p>\n<ul><li><strong>eins</strong>: a</li><li><code>zwei</code></li></ul>',
    );
  });

  it('maskiert HTML im Text', () => {
    expect(alsHtml('<b>x</b> & y')).toBe('<p>&lt;b&gt;x&lt;/b&gt; &amp; y</p>');
  });

  it('setzt Links um', () => {
    expect(alsHtml('[Seite](https://example.ch)')).toBe(
      '<p><a href="https://example.ch" target="_blank" rel="noopener">Seite</a></p>',
    );
  });
});
