<script>
  /**
   * Das Erscheinungsbild der Seite als Blatt eines Styleguides: Farben,
   * Schrift, Abstände und Formen mit den Regeln dahinter. Variablen und Regeln
   * stammen aus app.css und seinen Kommentaren, Schrift und Ecken sind auf der
   * Seite gemessen – das Blatt kann deshalb nicht veralten.
   */
  import css from '../../app.css?raw';
  import { inPixel, leseTokens } from './styleguide.js';

  const tokens = leseTokens(css);
  const nachName = new Map(tokens.map((token) => [token.name, token]));

  // Eine Textfarbe gehört zur Fläche gleichen Namens und erscheint in deren Feld.
  const farben = tokens
    .filter((token) => token.hell.startsWith('#') && !token.name.endsWith('-text'))
    .map((token) => ({ ...token, text: nachName.get(`${token.name}-text`) }));
  const abstaende = tokens.filter((token) => token.name.startsWith('abstand'));
  const rahmen = nachName.get('rahmen-breite');

  /** Schreibt einen rem-Wert mit seinem Gegenwert in Pixeln. */
  const mitPixel = (wert) => (wert.endsWith('rem') ? `${wert} · ${inPixel(wert)}px` : wert);

  /** @type {{ familie: string, titel: number, grund: number, zeile: number, ecken: number } | undefined} */
  let gemessen = $state();
  /** @type {HTMLButtonElement} */
  let muster;

  $effect(() => {
    const titel = getComputedStyle(document.querySelector('header h1'));
    const grund = getComputedStyle(document.body);
    gemessen = {
      familie: grund.fontFamily.split(',')[0].replaceAll(/["']/g, ''),
      titel: parseFloat(titel.fontSize),
      grund: parseFloat(grund.fontSize),
      zeile: Math.round((parseFloat(grund.lineHeight) / parseFloat(grund.fontSize)) * 100) / 100,
      ecken: parseFloat(getComputedStyle(muster).borderTopLeftRadius),
    };
  });
</script>

<article>
  <header class="blattkopf">
    <h2>Styleguide</h2>
    <p>Das Erscheinungsbild dieser Seite. Werte und Regeln stammen aus <code>src/app.css</code>, links jeweils hell, rechts dunkel.</p>
  </header>

  <section>
    <h3>Farbe</h3>
    <div class="farben">
      {#each farben as farbe (farbe.name)}
        <div class="farbe">
          <div class="feld">
            {#each ['hell', 'dunkel'] as modus (modus)}
              <span style:background={farbe[modus]} style:color={farbe.text?.[modus]}>{farbe.text ? 'Aa' : ''}</span>
            {/each}
          </div>
          <strong>{farbe.name}</strong>
          <span class="wert">{farbe.hell} · {farbe.dunkel}</span>
          {#if farbe.text}
            <span class="wert">Text {farbe.text.hell} · {farbe.text.dunkel}</span>
          {/if}
          {#if farbe.regel}
            <p class="regel">{farbe.regel} <span class="zeile">Zeile {farbe.zeile}</span></p>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h3>Schrift</h3>
    <div class="schrift">
      <div class="aa" aria-hidden="true">Aa</div>
      {#if gemessen}
        <dl>
          <div><dt>Schrift</dt><dd>{gemessen.familie}</dd></div>
          <div><dt>Titel · {gemessen.titel}px</dt><dd class="titel">Bildungsplan</dd></div>
          <div><dt>Grundtext · {gemessen.grund}px</dt><dd>erstellen Gestaltungsanleitungen</dd></div>
          <div>
            <dt>klein · {mitPixel(nachName.get('schrift-klein').hell)}</dt>
            <dd class="klein">1 von 327 Leistungszielen</dd>
          </div>
          <div><dt>Zeilenabstand</dt><dd>{gemessen.zeile}</dd></div>
        </dl>
      {/if}
    </div>
  </section>

  <section>
    <h3>Abstand</h3>
    <dl class="skala">
      {#each abstaende as eintrag (eintrag.name)}
        <div>
          <dt>--{eintrag.name}</dt>
          <dd><span class="balken" style:width="var(--{eintrag.name})"></span>{mitPixel(eintrag.hell)}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <section>
    <h3>Form</h3>
    <div class="formen">
      <p class="masse">Rahmen {rahmen.hell} · Ecken {gemessen?.ecken ?? 0}</p>
      <div class="zustaende">
        <div><button type="button" bind:this={muster}>Kompetenzen</button><span>ruhend</span></div>
        <div><span class="knopf ueberfahren">Kompetenzen</span><span>überfahren</span></div>
        <div><button type="button" aria-pressed="true">Kompetenzen</button><span>gewählt</span></div>
        <div><button type="button" class="schlicht">Filter zurücksetzen</button><span>schlicht</span></div>
      </div>
      {#if nachName.get('rahmen').regel}
        <p class="regel">{nachName.get('rahmen').regel} <span class="zeile">Zeile {nachName.get('rahmen').zeile}</span></p>
      {/if}
      {#if nachName.get('hover').regel}
        <p class="regel">{nachName.get('hover').regel} <span class="zeile">Zeile {nachName.get('hover').zeile}</span></p>
      {/if}
    </div>
  </section>
</article>

<style>
  article {
    max-width: 62.75rem;
    display: grid;
    gap: var(--abstand-gross);
  }

  .blattkopf {
    padding-bottom: var(--abstand);
    border-bottom: var(--rahmen-breite) solid var(--rahmen);
  }

  /* Gleich wie die Titel unter «Meine Kurse» und «Kurs». */
  h2 {
    margin: 0;
    font-size: 1.375rem;
  }

  .blattkopf p {
    margin: var(--abstand-klein) 0 0;
    color: var(--text-leise);
    font-size: var(--schrift-klein);
  }

  code {
    padding: 0 0.25em;
    background: var(--flaeche);
    font-size: 0.9em;
  }

  section {
    display: grid;
    grid-template-columns: 8rem minmax(0, 1fr);
    gap: var(--abstand-gross);
  }

  h3 {
    margin: 0;
    font-size: var(--schrift-klein);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .farben {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: var(--abstand-gross) var(--abstand);
    align-items: start;
  }

  .farbe {
    display: grid;
    gap: 0.125rem;
    font-size: var(--schrift-klein);
  }

  .feld {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 4.5rem;
    margin-bottom: var(--abstand-klein);
    border: 1px solid var(--linie);
  }

  .feld span {
    display: grid;
    place-items: center;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .wert,
  .zeile,
  dt,
  .masse,
  .zustaende span:last-child {
    color: var(--text-leise);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }

  .regel {
    margin: var(--abstand-klein) 0 0;
    padding-left: var(--abstand);
    border-left: 3px solid var(--akzent);
    font-size: var(--schrift-klein);
  }

  .zeile {
    white-space: nowrap;
  }

  .schrift {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand-gross);
    align-items: center;
  }

  .aa {
    font-size: 6rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  dl {
    display: grid;
    gap: var(--abstand-klein);
    margin: 0;
  }

  dl div {
    display: grid;
    grid-template-columns: 9rem minmax(0, 1fr);
    gap: var(--abstand);
    align-items: baseline;
  }

  dd {
    margin: 0;
  }

  .titel {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .klein {
    font-size: var(--schrift-klein);
  }

  /* Die Balken stehen in einer Spalte so breit wie der grösste, damit die Werte daneben fluchten. */
  .skala dd {
    display: grid;
    grid-template-columns: var(--abstand-gross) auto;
    gap: var(--abstand);
    align-items: center;
    color: var(--text-leise);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }

  .balken {
    height: 1rem;
    background: var(--akzent);
  }

  .formen {
    display: grid;
    gap: var(--abstand);
  }

  .masse {
    margin: 0;
  }

  .zustaende {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand-gross);
    align-items: start;
  }

  .zustaende div {
    display: grid;
    gap: var(--abstand-klein);
    justify-items: start;
  }

  /* Der Zustand beim Überfahren, festgehalten; ein echter Knopf zeigt ihn nur unter dem Mauszeiger. */
  .knopf {
    padding: var(--abstand-klein) var(--abstand);
    background: var(--hover);
    border: var(--rahmen-breite) solid var(--akzent);
  }

  @media (max-width: 40rem) {
    section {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--abstand);
    }
  }
</style>
