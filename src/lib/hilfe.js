/**
 * Die Hilfe ist ein Teil der README. Statt einer Markdown-Bibliothek genügt
 * hier ein Umsetzer für die wenigen Elemente, die die README dort verwendet.
 */

const START = '<!-- hilfe:start -->';
const ENDE = '<!-- hilfe:end -->';

function maskiere(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Setzt `Code`, **fett** und [Links](ziel) innerhalb einer Zeile um. */
function zeile(text) {
  return maskiere(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

/**
 * Schneidet den Hilfeteil aus der README.
 * @param {string} readme Inhalt der README.
 * @returns {string} Markdown zwischen den Markierungen, ohne sie leer.
 */
export function hilfeteil(readme) {
  const anfang = readme.indexOf(START);
  const schluss = readme.indexOf(ENDE);
  if (anfang === -1 || schluss < anfang) return '';
  return readme.slice(anfang + START.length, schluss).trim();
}

/**
 * Setzt Markdown mit Überschriften, Absätzen und Listen in HTML um.
 * @param {string} markdown
 * @returns {string}
 */
export function alsHtml(markdown) {
  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const ueberschrift = block.match(/^(#{2,4}) (.*)$/);
      if (ueberschrift) {
        const ebene = ueberschrift[1].length;
        return `<h${ebene}>${zeile(ueberschrift[2])}</h${ebene}>`;
      }
      if (block.startsWith('- ')) {
        const punkte = block.split(/\n- /).map((punkt) => punkt.replace(/^- /, '').replace(/\s*\n\s*/g, ' '));
        return `<ul>${punkte.map((punkt) => `<li>${zeile(punkt)}</li>`).join('')}</ul>`;
      }
      return `<p>${zeile(block.replace(/\s*\n\s*/g, ' '))}</p>`;
    })
    .join('\n');
}
