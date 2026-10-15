import { describe, expect, it } from 'vitest';
import css from '../../app.css?raw';
import { inPixel, leseTokens, tokenFuer } from './styleguide.js';

const beispiel = `:root {
  --grund: #fff;
  /*
   * Kräftige Konturen
   * wie im Workflow.
   */
  --rahmen: #1a1a1a;
  --abstand: 0.75rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --grund: #151515;
  }
}
`;

describe('leseTokens', () => {
  it('liest helle und dunkle Werte', () => {
    const [grund, rahmen] = leseTokens(beispiel);
    expect(grund).toMatchObject({ name: 'grund', hell: '#fff', dunkel: '#151515' });
    expect(rahmen).toMatchObject({ hell: '#1a1a1a', dunkel: '#1a1a1a' });
  });

  it('hängt den Kommentar an die folgende Variable und nur an diese', () => {
    const [grund, rahmen, abstand] = leseTokens(beispiel);
    expect(grund.regel).toBe('');
    expect(rahmen.regel).toBe('Kräftige Konturen wie im Workflow.');
    expect(abstand.regel).toBe('');
  });

  it('nennt die Zeile der Variable', () => {
    expect(leseTokens(beispiel)[1].zeile).toBe(7);
  });

  it('kennt alle Variablen der Website', () => {
    const namen = leseTokens(css).map((t) => t.name);
    const imStylesheet = [...css.slice(0, css.indexOf('}')).matchAll(/--([\w-]+)\s*:/g)].map((t) => t[1]);
    expect(namen).toEqual(imStylesheet);
  });
});

describe('inPixel', () => {
  it('rechnet rem und px um', () => {
    expect(inPixel('0.75rem')).toBe(12);
    expect(inPixel('1.5px')).toBe(1.5);
    expect(inPixel('0.75rem', 20)).toBe(15);
  });

  it('lässt andere Werte aus', () => {
    expect(inPixel('#fff')).toBeNaN();
  });
});

describe('tokenFuer', () => {
  const tokens = leseTokens(beispiel);

  it('findet die Variable zu einer gemessenen Grösse', () => {
    expect(tokenFuer(12, tokens, 'abstand')).toBe('--abstand');
    expect(tokenFuer(12.3, tokens, 'abstand')).toBe('--abstand');
  });

  it('findet nichts, wenn keine Variable passt', () => {
    expect(tokenFuer(13, tokens, 'abstand')).toBe('');
    expect(tokenFuer(12, tokens, 'schrift')).toBe('');
  });
});
