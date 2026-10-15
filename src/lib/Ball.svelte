<script>
  /**
   * Der hüpfende Ball, die erste Übung jeder Animationsausbildung: Er springt
   * einmal am unteren Rand quer über die Seite, gestreckt im Flug und
   * gestaucht beim Aufprall. Bei reduzierter Bewegung steht statt dessen die
   * ganze Bahn als Zwiebelhaut da. Liegt über allem und lässt jeden Klick durch.
   */
  const RADIUS = 24;
  const SCHWERKRAFT = 2600; // px/s²
  const ELASTIZITAET = 0.7;
  const DAUER = 4; // s für die ganze Breite
  const BILDRATE = 60;

  /** @typedef {{ x: number, y: number, dehnung: number }} Bild */

  /** Rechnet die Bahn vorab Bild für Bild aus; y ist die Unterkante des Balls. */
  function bahn(breite, hoehe) {
    const boden = hoehe - 16;
    const vx = (breite + 4 * RADIUS) / DAUER;
    let x = -2 * RADIUS;
    let y = boden - Math.min(420, hoehe * 0.6);
    let vy = 0;
    let stauchen = 0;
    /** @type {Bild[]} */
    const bilder = [];
    while (x < breite + 2 * RADIUS) {
      vy += SCHWERKRAFT / BILDRATE;
      y += vy / BILDRATE;
      x += vx / BILDRATE;
      if (y >= boden) {
        y = boden;
        // Ein harter Aufprall staucht stärker und länger; kleine Hüpfer rollen aus.
        if (vy > 150) stauchen = Math.min(0.35, vy / 4000);
        vy = vy > 150 ? -vy * ELASTIZITAET : 0;
      }
      // Gestaucht beim Aufprall, sonst gestreckt nach der Geschwindigkeit.
      const dehnung = stauchen > 0 ? -stauchen : Math.min(0.3, Math.abs(vy) / 5000);
      stauchen = Math.max(0, stauchen - 0.12);
      bilder.push({ x, y, dehnung });
    }
    return bilder;
  }

  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bilder = bahn(innerWidth, innerHeight);
  const boden = innerHeight - 16;
  // Für die Zwiebelhaut jedes sechste Bild, also zehn Phasen pro Sekunde.
  const zwiebelhaut = ruhig ? bilder.filter((_, i) => i % 6 === 0) : [];

  let jetzt = $state(0);

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

  /** Streckt oder staucht von der Unterkante aus, die Fläche bleibt ungefähr gleich. */
  function form(bild) {
    const sy = 1 + bild.dehnung;
    return `translate(${bild.x - RADIUS}px, ${bild.y - 2 * RADIUS}px) scale(${1 / sy}, ${sy})`;
  }

  /** Der Schatten wird kleiner und blasser, je höher der Ball springt. */
  function schatten(bild) {
    const naehe = Math.max(0.2, 1 - (boden - bild.y) / 500);
    return { transform: `translate(${bild.x - RADIUS}px, ${boden - 6}px) scaleX(${naehe})`, opacity: naehe * 0.35 };
  }
</script>

<div class="buehne" aria-hidden="true">
  {#if ruhig}
    {#each zwiebelhaut as bild, i (i)}
      <span class="ball" style:transform={form(bild)} style:opacity={0.15 + (0.85 * i) / zwiebelhaut.length}></span>
    {/each}
  {:else if jetzt < bilder.length}
    {@const bild = bilder[jetzt]}
    {@const s = schatten(bild)}
    <span class="schatten" style:transform={s.transform} style:opacity={s.opacity}></span>
    <span class="ball" style:transform={form(bild)}></span>
  {/if}
</div>

<style>
  .buehne {
    position: fixed;
    inset: 0;
    z-index: 10;
    overflow: hidden;
    pointer-events: none;
  }

  .ball,
  .schatten {
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
  }

  .ball {
    height: 48px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ff9a8a, #e5322a 45%, #9c1410);
    transform-origin: 50% 100%;
  }

  .schatten {
    height: 12px;
    border-radius: 50%;
    background: #000;
    filter: blur(3px);
  }
</style>
