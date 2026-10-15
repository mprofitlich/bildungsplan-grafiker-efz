<script>
  /**
   * Eine mit Klebeband an die Seite geklebte Banane, nach «Comedian» von
   * Maurizio Cattelan (2019). Liegt über allem und lässt jeden Klick durch –
   * ausser mit `onweg`: Dann fängt sie den nächsten Klick ab und meldet ihn.
   */
  let { onweg = undefined } = $props();
</script>

<!-- Ein Klick irgendwohin, also bewusst ohne eigene Tastenbedienung. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="banane" class:fangen={onweg} onclick={onweg}>
  <svg viewBox="0 0 400 300" role="img" aria-label="Banane, mit grauem Klebeband an die Seite geklebt">
    <defs>
      <!-- Links die stumpfe Spitze, rechts der Hals zum Stiel; unten die äussere Krümmung -->
      <path
        id="banane-form"
        d="M30 134 L34 154 C 90 215, 220 235, 300 180 C 330 162, 350 142, 362 118 L 346 110 C 320 142, 280 166, 210 166 C 140 166, 70 150, 30 134 Z"
      />
      <clipPath id="banane-umriss">
        <use href="#banane-form" />
      </clipPath>
      <polygon
        id="banane-streifen"
        points="178,101 185,97 192,102 200,96 208,101 216,97 224,102 232,98 236,101 236,275 229,279 221,274 213,280 205,275 197,279 189,274 182,279 178,275"
      />
      <clipPath id="banane-band-umriss">
        <use href="#banane-streifen" />
      </clipPath>

      <linearGradient id="banane-schale" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffe866" />
        <stop offset="0.6" stop-color="#f5c816" />
        <stop offset="1" stop-color="#d9a400" />
      </linearGradient>
      <linearGradient id="banane-band" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#b4b8bc" />
        <stop offset="0.5" stop-color="#c6c9cc" />
        <stop offset="1" stop-color="#b0b4b8" />
      </linearGradient>
      <pattern id="banane-gewebe" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M0 0h4M0 2h4" stroke="#000" stroke-opacity="0.06" stroke-width="0.6" />
      </pattern>
      <!-- Quer über die Banane: Glanz auf der Rundung, dunkel an den Flanken -->
      <linearGradient id="banane-woelbung" x1="0" y1="164" x2="0" y2="214" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#000" stop-opacity="0.3" />
        <stop offset="0.14" stop-color="#000" stop-opacity="0.08" />
        <stop offset="0.32" stop-color="#fff" stop-opacity="0.45" />
        <stop offset="0.5" stop-color="#fff" stop-opacity="0.12" />
        <stop offset="0.82" stop-color="#000" stop-opacity="0.12" />
        <stop offset="1" stop-color="#000" stop-opacity="0.38" />
      </linearGradient>
      <!-- Wo das Band vom Papier zur Banane hochsteigt -->
      <linearGradient id="banane-anstieg" x1="0" y1="148" x2="0" y2="168" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset="1" stop-color="#fff" stop-opacity="0.35" />
      </linearGradient>
      <linearGradient id="banane-abstieg" x1="0" y1="210" x2="0" y2="236" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#000" stop-opacity="0.3" />
        <stop offset="1" stop-color="#000" stop-opacity="0" />
      </linearGradient>

      <filter id="banane-schatten" x="-10%" y="-20%" width="130%" height="160%">
        <feDropShadow dx="3" dy="7" stdDeviation="5" flood-opacity="0.28" />
      </filter>
      <filter id="banane-band-kante" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0.4" dy="0.8" stdDeviation="0.6" flood-opacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#banane-schatten)">
      <use href="#banane-form" fill="url(#banane-schale)" />
      <!-- Längskanten, an Spitze und Hals zusammenlaufend -->
      <path d="M32 140 C 100 180, 240 192, 354 116" fill="none" stroke="#c99400" stroke-width="1.5" opacity="0.5" />
      <path d="M33 147 C 96 198, 236 214, 358 118" fill="none" stroke="#b88a00" stroke-width="1.5" opacity="0.55" />
      <!-- Reifeflecken -->
      <ellipse cx="120" cy="180" rx="4" ry="2.5" fill="#7a4e0e" opacity="0.45" />
      <ellipse cx="250" cy="194" rx="3" ry="2" fill="#7a4e0e" opacity="0.4" />
      <ellipse cx="300" cy="170" rx="5" ry="2.5" fill="#7a4e0e" opacity="0.35" />
      <!-- Spitze -->
      <path d="M30 134 L34 154 L26 152 L24 137 Z" fill="#4a3516" />
      <!-- Stiel -->
      <path d="M346 110 L362 118 Q 368 106, 374 100 L 362 93 Q 354 102, 346 110 Z" fill="#b5a032" />
      <path d="M362 93 L374 100 L377 95 L365 88 Z" fill="#4a3516" />
    </g>

    <!-- Klebeband, quer über die Mitte: klebt flach auf dem Papier und wölbt sich über die Banane -->
    <g transform="rotate(-8 205 189)">
      <g filter="url(#banane-band-kante)">
        <use href="#banane-streifen" fill="url(#banane-band)" opacity="0.94" />
      </g>
      <use href="#banane-streifen" fill="url(#banane-gewebe)" />

      <g clip-path="url(#banane-band-umriss)">
        <rect x="170" y="148" width="74" height="20" fill="url(#banane-anstieg)" />
        <rect x="170" y="210" width="74" height="26" fill="url(#banane-abstieg)" />
      </g>

      <!-- Knitterfalten, wo das Band an den Kanten vom Papier abhebt -->
      <g fill="none" stroke-linecap="round">
        <path d="M179 156 L191 166 M179 150 L186 158 M235 154 L224 165 M235 148 L228 156" stroke="#fff" stroke-opacity="0.55" />
        <path d="M179 158 L190 168 M235 156 L225 167" stroke="#000" stroke-opacity="0.15" />
        <path d="M179 226 L191 214 M179 232 L186 224 M235 228 L223 215 M235 234 L228 225" stroke="#000" stroke-opacity="0.2" />
        <path d="M179 228 L190 217 M235 230 L224 218" stroke="#fff" stroke-opacity="0.4" />
      </g>
    </g>

    <!-- Die Wölbung nur dort, wo das Band über der Banane liegt -->
    <g clip-path="url(#banane-umriss)">
      <g transform="rotate(-8 205 189)">
        <use href="#banane-streifen" fill="url(#banane-woelbung)" />
      </g>
    </g>
  </svg>
</div>

<style>
  /* Über der klebenden Suche, ohne die Seite zu sperren. */
  .banane {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .fangen {
    pointer-events: auto;
  }

  svg {
    width: min(95vw, 51rem);
    rotate: -18deg;
    animation: ankleben 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
  }

  @keyframes ankleben {
    from {
      opacity: 0;
      scale: 1.4;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      animation: none;
    }
  }
</style>
