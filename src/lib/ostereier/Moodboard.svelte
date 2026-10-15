<script>
  /**
   * Hängt die Leistungsziele als Karten an eine Pinnwand aus Kork, leicht
   * schräg, mit Stecknadel oder Klebeband. Solange eingebunden.
   */
  $effect(() => {
    document.documentElement.classList.add('moodboard');
    return () => document.documentElement.classList.remove('moodboard');
  });
</script>

<style>
  /* Kork als Grund; Schrift dunkel, auch im dunklen Modus, damit sie auf dem Kork lesbar bleibt. */
  :global(html.moodboard) {
    --grund: #c9a47a;
    --text: #1a1a1a;
    --text-leise: #4d3b26;
    --linie: rgb(0 0 0 / 0.15);
    --rahmen: #1a1a1a;
    --flaeche: #fffdf6;
    --hover: #ece4ff;
  }

  :global(html.moodboard body) {
    background-image:
      radial-gradient(rgb(0 0 0 / 0.1) 1px, transparent 1.5px),
      radial-gradient(rgb(255 255 255 / 0.12) 1px, transparent 1.5px);
    background-size: 7px 7px, 11px 11px;
    background-position: 0 0, 3px 5px;
  }

  :global(html.moodboard main ul:has(> li > .wahl)) {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem 1.5rem;
    padding: var(--abstand-gross) 0;
  }

  /* Jede Karte im schmalen Aufbau der Ziele, wie auf dem Handy. */
  /*
   * Auf der Karte ist wieder Papier der Grund, auch für ihre Buttons. Das Papier
   * bleibt im dunklen Modus hell, die Suchtreffer deshalb im hellen Gelb.
   */
  :global(html.moodboard main ul > li:has(> .wahl)) {
    --grund: #fffdf6;
    --treffer: #ffd84d;

    position: relative;
    flex: 0 1 19rem;
    grid-template-columns: 1fr auto;
    padding: 1.25rem 1rem 1rem;
    background: #fffdf6;
    border-top: 0;
    box-shadow: 0.125rem 0.375rem 0.75rem rgb(0 0 0 / 0.3);
    rotate: -1.5deg;
  }

  :global(html.moodboard main ul > li:has(> .wahl):nth-child(3n + 2)) {
    rotate: 1deg;
  }

  :global(html.moodboard main ul > li:has(> .wahl):nth-child(3n)) {
    rotate: -0.5deg;
  }

  :global(html.moodboard main li:has(> .wahl) > .inhalt) {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  :global(html.moodboard main li:has(> .wahl) > .wahl) {
    grid-column: 1 / -1;
  }

  /* Stecknadel */
  :global(html.moodboard main ul > li:has(> .wahl)::before) {
    content: '';
    position: absolute;
    top: -0.375rem;
    left: calc(50% - 0.5rem);
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #ff8a8a, #d01818 60%, #8a0a0a);
    box-shadow: 0.125rem 0.25rem 0.25rem rgb(0 0 0 / 0.35);
  }

  /* Jede zweite Karte klebt statt dessen mit einem Streifen Klebeband. */
  :global(html.moodboard main ul > li:has(> .wahl):nth-child(even)::before) {
    top: -0.625rem;
    left: calc(50% - 2.5rem);
    width: 5rem;
    height: 1.25rem;
    border-radius: 0;
    background: rgb(240 235 210 / 0.75);
    box-shadow: 0 0.0625rem 0.125rem rgb(0 0 0 / 0.15);
    rotate: -3deg;
  }
</style>
