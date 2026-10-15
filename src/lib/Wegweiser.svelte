<script>
  /**
   * Ein gelber Wanderwegweiser, wie er an Schweizer Wanderwegen steht, mit den
   * Stationen der Lehre als Ziele. Das Qualifikationsverfahren ist ein
   * Bergwanderweg: weiss-rot-weisse Spitze. Liegt unten rechts über der Seite
   * und lässt jeden Klick durch.
   */
  const ziele = [
    { name: 'Lehrbetrieb', zeit: '5 min', richtung: 'links' },
    { name: 'Berufsfachschule', zeit: '1 h 30 min', richtung: 'rechts' },
    { name: 'Überbetriebliche Kurse', zeit: '2 h 45 min', richtung: 'rechts' },
    { name: 'Qualifikationsverfahren', zeit: '4 Jahre', richtung: 'rechts', berg: true },
  ];

  const beschreibung = `Gelber Wanderwegweiser, Standort Bildungsplan: ${ziele
    .map((ziel) => `${ziel.name} ${ziel.zeit}`)
    .join(', ')}`;
</script>

<div class="wegweiser" role="img" aria-label={beschreibung}>
  <div class="standort">
    <span>Bildungsplan</span>
    <span>512 m</span>
  </div>
  {#each ziele as ziel (ziel.name)}
    <div class="schild {ziel.richtung}" class:berg={ziel.berg}>
      <span>{ziel.name}</span>
      <span class="zeit">{ziel.zeit}</span>
    </div>
  {/each}
</div>

<style>
  /* Die Farben der Signalisation bleiben auch im dunklen Modus, wie draussen. */
  .wegweiser {
    --gelb: #f7d117;
    --spitze: 1.1em;

    position: fixed;
    right: clamp(0.5rem, 4vw, 3rem);
    bottom: 0;
    z-index: 10;
    display: grid;
    gap: 0.2em;
    width: 21em;
    padding-bottom: clamp(3rem, 18vh, 9rem);
    font-size: clamp(0.65rem, 2.4vw, 0.9rem);
    font-weight: 700;
    line-height: 1.2;
    color: #111;
    pointer-events: none;
    filter: drop-shadow(0.15em 0.3em 0.3em rgb(0 0 0 / 0.3));
    animation: aufstellen 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.1) both;
  }

  /* Der Pfosten: ein Metallrohr hinter den Schildern bis zum Boden. */
  .wegweiser::before {
    content: '';
    position: absolute;
    top: 0.5em;
    bottom: 0;
    left: calc(50% - 0.7em);
    z-index: -1;
    width: 1.4em;
    background: linear-gradient(90deg, #7d8287, #c9cdd1 40%, #9a9fa4 70%, #6c7176);
  }

  .standort,
  .schild {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    padding: 0.45em 0.7em;
  }

  /* Name über der Höhe, schmal über dem Pfosten, wie die Standorttafel am Mast. */
  .standort {
    flex-direction: column;
    align-items: center;
    gap: 0;
    justify-self: center;
    margin-bottom: 0.2em;
    padding: 0.35em 0.6em;
    font-size: 0.8em;
    background: #fff;
    border: 0.12em solid #111;
  }

  .schild {
    position: relative;
    background: var(--gelb);
  }

  .zeit {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .rechts {
    padding-right: calc(var(--spitze) + 0.4em);
    clip-path: polygon(0 0, calc(100% - var(--spitze)) 0, 100% 50%, calc(100% - var(--spitze)) 100%, 0 100%);
  }

  .links {
    padding-left: calc(var(--spitze) + 0.4em);
    clip-path: polygon(var(--spitze) 0, 100% 0, 100% 100%, var(--spitze) 100%, 0 50%);
  }

  /* Bergwanderweg: Die Spitze trägt Weiss-Rot-Weiss, die Schrift rückt davor. */
  .berg {
    padding-right: calc(var(--spitze) + 1.4em);
  }

  .berg::after {
    content: '';
    position: absolute;
    inset: 0 0 0 auto;
    width: calc(var(--spitze) + 1em);
    background: linear-gradient(#fff 0 33%, #d52b1e 33% 67%, #fff 67%);
  }

  @keyframes aufstellen {
    from {
      translate: 0 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wegweiser {
      animation: none;
    }
  }
</style>
