<script>
  /**
   * Lässt Buttons, Chips und das Suchfeld aussehen wie von Hand skizziert:
   * Ihre Rahmen zittern, die Beschriftung bleibt ruhig. Solange eingebunden.
   */
  $effect(() => {
    document.documentElement.classList.add('skizze');
    return () => document.documentElement.classList.remove('skizze');
  });
</script>

<!--
  Das Rauschen verschiebt das ganze Element; darüber liegt sein unverschobenes
  Inneres, 4 px vom Rand eingezogen. Sichtbar zittert so nur der Rand.
-->
<svg class="filter" aria-hidden="true">
  <filter id="skizze" x="-5%" y="-25%" width="110%" height="150%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="rauschen" />
    <feDisplacementMap in="SourceGraphic" in2="rauschen" scale="5" xChannelSelector="R" yChannelSelector="G" result="verzerrt" />
    <feMorphology in="SourceAlpha" operator="erode" radius="4" result="innen" />
    <feComposite in="SourceGraphic" in2="innen" operator="in" result="ruhig" />
    <feMerge>
      <feMergeNode in="verzerrt" />
      <feMergeNode in="ruhig" />
    </feMerge>
  </filter>
</svg>

<style>
  .filter {
    position: absolute;
    width: 0;
    height: 0;
  }

  /* Nur Elemente mit Rahmen; Reiter, Textknöpfe und K-Stufen bleiben, wie sie sind. */
  :global(html.skizze :is(button:not(.schlicht, .stufe, nav *), .chips label span, input[type='search'])) {
    filter: url(#skizze);
  }

  /*
   * Das ruhige Innere braucht einen deckenden Grund, sonst fiele die Schrift
   * mit dem Rand weg. Ohne Spezifität, damit Überfahren und Auswahl ihre Farbe behalten.
   */
  :global(:where(html.skizze .chips label span)) {
    background: var(--grund);
  }
</style>
