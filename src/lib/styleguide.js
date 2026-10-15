/**
 * @typedef {object} Token
 * @property {string} name ohne die beiden Striche, etwa `abstand-klein`
 * @property {string} hell
 * @property {string} dunkel im dunklen Modus; ohne eigenen Wert derselbe wie `hell`
 * @property {string} regel der Kommentar unmittelbar davor, ohne Sternchen; sonst leer
 * @property {number} zeile Zeile in der Datei, ab 1
 */

const DEKLARATION = /\/\*([\s\S]*?)\*\/|--([\w-]+)\s*:\s*([^;]+);/g;

/**
 * Liest die Variablen aus dem ersten `:root`-Block eines Stylesheets und ihre
 * dunklen Werte aus dem `:root` unter `prefers-color-scheme: dark`. So zeigt der
 * Styleguide genau die Werte und Regeln, die auch gelten.
 * @param {string} css
 * @returns {Token[]}
 */
export function leseTokens(css) {
  const hell = deklarationen(css, css.indexOf(':root'));
  const dunkelAb = css.indexOf('prefers-color-scheme: dark');
  const dunkel = new Map(
    dunkelAb === -1 ? [] : deklarationen(css, css.indexOf(':root', dunkelAb)).map((t) => [t.name, t.hell]),
  );
  return hell.map((token) => ({ ...token, dunkel: dunkel.get(token.name) ?? token.hell }));
}

/** Variablen des Blocks, der beim ersten `{` nach `ab` beginnt. */
function deklarationen(css, ab) {
  if (ab === -1) return [];
  const anfang = css.indexOf('{', ab) + 1;
  const ende = css.indexOf('}', anfang);
  const tokens = [];
  let regel = '';
  for (const treffer of css.slice(anfang, ende).matchAll(DEKLARATION)) {
    if (treffer[1] !== undefined) {
      regel = kommentar(treffer[1]);
      continue;
    }
    const zeile = css.slice(0, anfang + treffer.index).split('\n').length;
    tokens.push({ name: treffer[2], hell: treffer[3].trim(), dunkel: '', regel, zeile });
    regel = '';
  }
  return tokens;
}

/** Text eines Kommentars ohne die Sternchen am Zeilenanfang. */
function kommentar(text) {
  return text
    .split('\n')
    .map((zeile) => zeile.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ');
}

/**
 * Rechnet einen Wert in `rem` oder `px` in Pixel um.
 * @param {string} wert
 * @param {number} [rem] Pixel pro rem
 * @returns {number} `NaN` bei anderen Einheiten
 */
export function inPixel(wert, rem = 16) {
  const treffer = wert.trim().match(/^(-?[\d.]+)(rem|px)$/);
  if (!treffer) return NaN;
  return parseFloat(treffer[1]) * (treffer[2] === 'rem' ? rem : 1);
}

/**
 * Sucht die Variable, deren Wert einer gemessenen Grösse entspricht – etwa den
 * Abstand hinter 12 Pixeln Innenabstand.
 * @param {number} px gemessen
 * @param {Token[]} tokens
 * @param {string} anfang nur Variablen, deren Name so beginnt, etwa `abstand`
 * @param {number} [rem]
 * @returns {string} Name mit den beiden Strichen oder leer
 */
export function tokenFuer(px, tokens, anfang, rem = 16) {
  // Halbe Pixel Spielraum, weil der Browser Masse auf Geräte-Pixel rundet.
  const token = tokens.find((t) => t.name.startsWith(anfang) && Math.abs(inPixel(t.hell, rem) - px) < 0.5);
  return token ? `--${token.name}` : '';
}
