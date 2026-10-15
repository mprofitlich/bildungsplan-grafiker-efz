<script>
  /**
   * Zeigt die Seite als Druckbogen: weisser Papierrand mit Schnittmarken,
   * Passkreuzen, Farbkontrollstreifen und der Infozeile, die InDesign an den
   * Rand druckt. Liegt über allem und lässt jeden Klick durch.
   */
  const jetzt = new Date();
  const datum = new Intl.DateTimeFormat('de-CH', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(jetzt);
  const zeit = new Intl.DateTimeFormat('de-CH', { hour: '2-digit', minute: '2-digit' }).format(jetzt);

  const kanten = ['oben', 'rechts', 'unten', 'links'];
  const ecken = ['oben-links', 'oben-rechts', 'unten-rechts', 'unten-links'];
  // Cyan, Magenta, Gelb und Schwarz als Volltöne, dann zu 50 und 25 %.
  const felder = ['#00a0e3', '#e5007e', '#ffed00', '#1a1a1a'];
  const raster = [1, 0.5, 0.25];

  $effect(() => {
    document.documentElement.classList.add('beschnitt');
    return () => document.documentElement.classList.remove('beschnitt');
  });
</script>

<div class="bogen" aria-hidden="true">
  {#each ecken as ecke (ecke)}
    <span class="marke waagrecht {ecke}"></span>
    <span class="marke senkrecht {ecke}"></span>
  {/each}

  {#each kanten as kante (kante)}
    <svg class="passkreuz {kante}" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="5" fill="none" stroke="#000" stroke-width="0.75" />
      <path d="M10 0v20M0 10h20" stroke="#000" stroke-width="0.75" />
    </svg>
  {/each}

  <div class="kontrollstreifen">
    {#each raster as deckung (deckung)}
      {#each felder as farbe (farbe)}
        <span style:background={farbe} style:opacity={deckung}></span>
      {/each}
    {/each}
  </div>

  <p class="infozeile">bildungsplan-grafiker-efz.indd&ensp;1&ensp;{datum}&ensp;{zeit}</p>
</div>

<style>
  /*
   * Endformat --format vom Rand des Fensters; der Inhalt läuft --anschnitt
   * darüber hinaus, der Rest ist Papier.
   */
  :global(html.beschnitt) {
    --format: 2rem;
    --anschnitt: 0.375rem;
    --papier: calc(var(--format) - var(--anschnitt));
  }

  /* Die Seite rückt ein, damit das Papier nichts abdeckt; nur der Anschnitt liegt ausserhalb des Endformats. */
  :global(html.beschnitt body) {
    padding: var(--papier);
  }

  .bogen {
    --laenge: calc(var(--papier) - 0.5rem);

    position: fixed;
    inset: 0;
    z-index: 10;
    border: var(--papier) solid #fff;
    pointer-events: none;
  }

  /* Schnittmarken stehen im Papier und verlängern die Kanten des Endformats. */
  .marke {
    position: fixed;
    background: #000;
  }

  .waagrecht {
    width: var(--laenge);
    height: 1px;
  }

  .senkrecht {
    width: 1px;
    height: var(--laenge);
  }

  .waagrecht.oben-links,
  .waagrecht.unten-links {
    left: 0.25rem;
  }

  .waagrecht.oben-rechts,
  .waagrecht.unten-rechts {
    right: 0.25rem;
  }

  .waagrecht.oben-links,
  .waagrecht.oben-rechts {
    top: var(--format);
  }

  .waagrecht.unten-links,
  .waagrecht.unten-rechts {
    bottom: var(--format);
  }

  .senkrecht.oben-links,
  .senkrecht.oben-rechts {
    top: 0.25rem;
  }

  .senkrecht.unten-links,
  .senkrecht.unten-rechts {
    bottom: 0.25rem;
  }

  .senkrecht.oben-links,
  .senkrecht.unten-links {
    left: var(--format);
  }

  .senkrecht.oben-rechts,
  .senkrecht.unten-rechts {
    right: var(--format);
  }

  .passkreuz {
    position: fixed;
    width: 1rem;
    height: 1rem;
  }

  .passkreuz.oben,
  .passkreuz.unten {
    left: calc(50% - 0.5rem);
  }

  .passkreuz.oben {
    top: calc(var(--papier) / 2 - 0.5rem);
  }

  .passkreuz.unten {
    bottom: calc(var(--papier) / 2 - 0.5rem);
  }

  .passkreuz.links,
  .passkreuz.rechts {
    top: calc(50% - 0.5rem);
  }

  .passkreuz.links {
    left: calc(var(--papier) / 2 - 0.5rem);
  }

  .passkreuz.rechts {
    right: calc(var(--papier) / 2 - 0.5rem);
  }

  .kontrollstreifen {
    position: fixed;
    right: calc(var(--format) + 2rem);
    bottom: calc(var(--papier) / 2 - 0.3125rem);
    display: flex;
  }

  .kontrollstreifen span {
    width: 0.625rem;
    height: 0.625rem;
  }

  .infozeile {
    position: fixed;
    left: calc(var(--format) + 2rem);
    bottom: calc(var(--papier) / 2 - 0.375rem);
    margin: 0;
    color: #000;
    font-size: 0.625rem;
    line-height: 0.75rem;
  }

  /* Auf dem Handy bleibt nur Platz für Marken und Kreuze. */
  @media (width < 40rem) {
    .kontrollstreifen,
    .infozeile {
      display: none;
    }
  }
</style>
