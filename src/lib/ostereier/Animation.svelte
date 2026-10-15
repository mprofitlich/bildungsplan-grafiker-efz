<script>
  /**
   * Spielt eine der klassischen Übungen der Animationsausbildung ab, bei jedem
   * Aufruf die nächste. Bei reduzierter Bewegung steht statt dessen die ganze
   * Bewegung als Zwiebelhaut da. Liegt über allem und lässt jeden Klick durch.
   */
  import { BILDRATE, uebungen } from './animationen.js';

  // Am Ende blendet die Übung aus, statt abzubrechen.
  const AUSBLENDEN = 20;

  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { kulisse, bilder } = naechsteUebung().ablauf(innerWidth, innerHeight);
  // Für die Zwiebelhaut jedes sechste Bild, also zehn Phasen pro Sekunde.
  const zwiebelhaut = ruhig ? bilder.filter((_, i) => i % 6 === 0) : [];

  let jetzt = $state(0);
  const deckung = $derived(Math.min(1, (bilder.length - jetzt) / AUSBLENDEN));

  $effect(() => {
    if (ruhig) return;
    let anfang;
    let schritt = requestAnimationFrame(function zeichne(zeit) {
      anfang ??= zeit;
      jetzt = Math.floor(((zeit - anfang) / 1000) * BILDRATE);
      if (jetzt < bilder.length) schritt = requestAnimationFrame(zeichne);
    });
    return () => cancelAnimationFrame(schritt);
  });
</script>

<script module>
  const SCHLUESSEL = 'bildungsplan:animation';
  // Ohne Browserspeicher, etwa im privaten Fenster, zählt die Seite bis zum Neuladen selbst.
  let gezeigt = 0;

  /** Die Übung, die als nächste an der Reihe ist; der Stand bleibt im Browser. */
  function naechsteUebung() {
    let stand = gezeigt;
    try {
      stand = Number(localStorage.getItem(SCHLUESSEL)) || 0;
      localStorage.setItem(SCHLUESSEL, String(stand + 1));
    } catch {
      // Ohne Speicher bleibt es beim Zähler der Seite.
    }
    gezeigt = stand + 1;
    return uebungen[stand % uebungen.length];
  }
</script>

{#snippet form(f)}
  {#if f.typ === 'ball'}
    <ellipse cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry} fill={f.farbe} transform="rotate({f.winkel} {f.cx} {f.cy})" />
  {:else if f.typ === 'schatten'}
    <ellipse cx={f.cx} cy={f.cy} rx={f.rx} ry={f.rx / 5} fill="currentColor" opacity={f.deckung * 0.15} />
  {:else if f.typ === 'linie'}
    <line x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} stroke="currentColor" stroke-width="2" />
  {:else if f.typ === 'pfad'}
    <path
      d={f.d}
      fill="none"
      stroke={f.farbe ?? 'currentColor'}
      stroke-width={f.breite}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  {:else if f.typ === 'punkt'}
    <circle cx={f.cx} cy={f.cy} r={f.r} fill="currentColor" />
  {/if}
{/snippet}

<svg class="buehne" viewBox="0 0 {innerWidth} {innerHeight}" aria-hidden="true">
  {#if ruhig}
    {#each kulisse as f, i (i)}{@render form(f)}{/each}
    {#each zwiebelhaut as formen, i (i)}
      <g opacity={0.15 + (0.85 * i) / zwiebelhaut.length}>
        {#each formen as f, j (j)}{@render form(f)}{/each}
      </g>
    {/each}
  {:else if jetzt < bilder.length}
    <g opacity={deckung}>
      {#each kulisse as f, i (i)}{@render form(f)}{/each}
      {#each bilder[jetzt] as f, i (i)}{@render form(f)}{/each}
    </g>
  {/if}
</svg>

<style>
  .buehne {
    position: fixed;
    inset: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    color: var(--text);
    pointer-events: none;
  }
</style>
