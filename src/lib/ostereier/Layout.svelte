<script>
  /**
   * Zeigt die Seite wie in InDesign mit eingeblendeten Rahmenkanten. Ein Klick
   * wählt einen Rahmen aus: Er bekommt Anfasser und die Ports für den
   * Textfluss und lässt sich ziehen oder mit den Pfeiltasten verschieben, mit
   * Umschalt in grösseren Schritten. Ist das Gegenstück eines Leistungsziels
   * zugeklappt, steht im Ausgang das rote Plus für Übersatz. Solange
   * eingebunden; danach liegt alles wieder an seinem Platz.
   */
  // Dieselbe Auswahl wie bei den Rahmenkanten im Stil.
  const RAHMEN = 'main :is(h1, h2, h3, p, fieldset, li:has(> .wahl))';

  /**
   * Der äusserste Rahmen um das Ziel des Klicks. Wie eine Gruppe in InDesign
   * wird ein Leistungsziel als Ganzes gewählt, nicht sein Absatz.
   * @param {Element} element
   * @returns {HTMLElement | null}
   */
  function aeussererRahmen(element) {
    let gefunden = null;
    for (let rahmen = element.closest(RAHMEN); rahmen; rahmen = rahmen.parentElement?.closest(RAHMEN) ?? null) {
      gefunden = rahmen;
    }
    return /** @type {HTMLElement | null} */ (gefunden);
  }

  /** @type {HTMLElement | null} */
  let auswahl = null;
  /** @type {Map<HTMLElement, { x: number, y: number }>} */
  const versatz = new Map();
  /** @type {{ id: number, x: number, y: number, start: { x: number, y: number } } | null} */
  let zug = null;

  /**
   * @param {HTMLElement} element
   * @param {number} x
   * @param {number} y
   */
  function setze(element, x, y) {
    versatz.set(element, { x, y });
    element.style.translate = `${x}px ${y}px`;
    element.dataset.verschoben = '';
  }

  /** @param {HTMLElement | null} element */
  function waehle(element) {
    if (auswahl === element) return;
    delete auswahl?.dataset.ausgewaehlt;
    auswahl = element;
    if (element) element.dataset.ausgewaehlt = '';
  }

  /** @param {PointerEvent} event */
  function druecken(event) {
    if (!(event.target instanceof Element)) return;
    const ziel = aeussererRahmen(event.target);
    // Knöpfe, Links und Chips im Rahmen bleiben bedienbar, statt ihn zu verschieben.
    if (!ziel || event.target.closest('button, a, input, label')) {
      waehle(null);
      return;
    }
    // Sonst landeten die Pfeiltasten im Suchfeld, in dem «Layout» eben getippt wurde.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    waehle(ziel);
    zug = { id: event.pointerId, x: event.clientX, y: event.clientY, start: versatz.get(ziel) ?? { x: 0, y: 0 } };
  }

  /** @param {PointerEvent} event */
  function ziehen(event) {
    if (!zug || !auswahl || event.pointerId !== zug.id) return;
    setze(auswahl, zug.start.x + event.clientX - zug.x, zug.start.y + event.clientY - zug.y);
  }

  /** @param {PointerEvent} event */
  function loslassen(event) {
    if (zug?.id === event.pointerId) zug = null;
  }

  /**
   * Ein absolut gesetztes Kind des Feldsets beginnt erst unter dessen Legende.
   * Der Überstand von Legende und Abstand wird gemessen, damit die Rahmenkante
   * die Legende einschliesst.
   */
  function legendenMessen() {
    for (const feld of document.querySelectorAll('main fieldset')) {
      const legende = feld.querySelector(':scope > legend');
      const ueberstand = legende
        ? legende.getBoundingClientRect().bottom -
          feld.getBoundingClientRect().top +
          parseFloat(getComputedStyle(legende).marginBottom) +
          parseFloat(getComputedStyle(feld).paddingTop)
        : 0;
      /** @type {HTMLElement} */ (feld).style.setProperty('--ueberstand', `${ueberstand}px`);
    }
  }

  /** @param {KeyboardEvent} event */
  function taste(event) {
    if (!auswahl || !auswahl.isConnected) return;
    if (event.key === 'Escape') {
      waehle(null);
      return;
    }
    const richtung = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!richtung || document.activeElement?.matches('input, textarea, select')) return;
    event.preventDefault();
    const schritt = event.shiftKey ? 10 : 1;
    const { x, y } = versatz.get(auswahl) ?? { x: 0, y: 0 };
    setze(auswahl, x + richtung[0] * schritt, y + richtung[1] * schritt);
  }

  $effect(() => {
    document.documentElement.classList.add('layout');
    legendenMessen();
    // Neue Feldsets und umbrechende Legenden ändern den Überstand.
    const beobachter = new MutationObserver(legendenMessen);
    beobachter.observe(document.querySelector('main'), { childList: true, subtree: true });
    window.addEventListener('resize', legendenMessen);
    document.addEventListener('pointerdown', druecken);
    document.addEventListener('pointermove', ziehen);
    document.addEventListener('pointerup', loslassen);
    // Auf dem Handy bricht der Browser den Zug ab, wenn er scrollt.
    document.addEventListener('pointercancel', loslassen);
    document.addEventListener('keydown', taste);
    return () => {
      document.documentElement.classList.remove('layout');
      beobachter.disconnect();
      window.removeEventListener('resize', legendenMessen);
      for (const feld of document.querySelectorAll('main fieldset')) {
        /** @type {HTMLElement} */ (feld).style.removeProperty('--ueberstand');
      }
      document.removeEventListener('pointerdown', druecken);
      document.removeEventListener('pointermove', ziehen);
      document.removeEventListener('pointerup', loslassen);
      document.removeEventListener('pointercancel', loslassen);
      document.removeEventListener('keydown', taste);
      waehle(null);
      for (const element of versatz.keys()) {
        element.style.translate = '';
        delete element.dataset.verschoben;
      }
    };
  });
</script>

<style>
  /* Die Farbe der ersten Ebene in InDesign, Hellblau. */
  :global(html.layout) {
    --ebene: #4f99ff;
  }

  :global(html.layout main :is(h1, h2, h3, p, li:has(> .wahl))) {
    box-shadow: 0 0 0 1px var(--ebene);
  }

  /*
   * Beim Feldset reicht die Kante über die Legende, die oben aus seiner Box
   * ragt; zur Messung siehe legendenMessen. Sie liegt einen Pixel tiefer, auf
   * der Legende, weil die klebende Suche bis an deren Oberkante deckt.
   */
  :global(html.layout main fieldset::before) {
    content: '';
    position: absolute;
    inset: calc(1px - var(--ueberstand, 0px)) 0 0;
    box-shadow: 0 0 0 1px var(--ebene);
    pointer-events: none;
  }

  /*
   * Verschiebbar ist der äusserste Rahmen; der Absatz eines Leistungsziels
   * zeigt nur seine Kante. Ziehen soll den Rahmen bewegen, nicht Text markieren,
   * und der Zeiger zeigt das an. Knöpfe und Chips behalten ihren eigenen.
   */
  :global(html.layout main :is(h1, h2, h3, p, fieldset, li:has(> .wahl)):not(li:has(> .wahl) *)) {
    position: relative;
    user-select: none;
    cursor: move;
  }

  @media (hover: hover) {
    :global(html.layout main :is(h1, h2, h3, p, li:has(> .wahl)):not(li:has(> .wahl) *):hover),
    :global(html.layout main fieldset:hover::before) {
      box-shadow: 0 0 0 2px var(--ebene);
    }
  }

  /*
   * Verschobenes liegt über dem Rest und deckt ihn ab, damit es lesbar bleibt.
   * Ohne Spezifität, damit eine eigene Fläche wie die des Begriffs bleibt.
   */
  :global(:where(html.layout main [data-verschoben])) {
    z-index: 1;
    background: var(--grund);
  }

  /* Ausgewählt liegt zuoberst; auf dem Handy zieht der Finger es dann, statt zu scrollen. */
  :global(html.layout main [data-ausgewaehlt]) {
    z-index: 2;
    touch-action: none;
  }

  /*
   * Anfasser und Ports als Hintergrund eines Rahmens, der 5 px über die Kante
   * reicht, und dazu über den Rand des Elements. Je Quadrat eine blaue Fläche
   * und darauf eine weisse, 1 px kleiner auf jeder Seite.
   * Die erste Ebene liegt zuoberst: Plus, dann Weiss, dann Blau.
   */
  :global(html.layout main [data-ausgewaehlt]::after) {
    --port: 1.25rem;
    --port-weiss: #fff;
    --port-blau: var(--ebene);

    content: '';
    position: absolute;
    inset: -5px;
    pointer-events: none;
    background-image:
      /* Plus im Ausgang, nur bei Übersatz */
      linear-gradient(var(--plus, transparent), var(--plus, transparent)),
      linear-gradient(var(--plus, transparent), var(--plus, transparent)),
      /* Weiss: acht Anfasser, Eingang, Ausgang */
      linear-gradient(#fff, #fff), linear-gradient(#fff, #fff), linear-gradient(#fff, #fff),
      linear-gradient(#fff, #fff), linear-gradient(#fff, #fff),
      linear-gradient(#fff, #fff), linear-gradient(#fff, #fff), linear-gradient(#fff, #fff),
      linear-gradient(var(--port-weiss), var(--port-weiss)), linear-gradient(var(--port-weiss), var(--port-weiss)),
      /* Blau: dieselben Quadrate */
      linear-gradient(var(--ebene), var(--ebene)), linear-gradient(var(--ebene), var(--ebene)),
      linear-gradient(var(--ebene), var(--ebene)), linear-gradient(var(--ebene), var(--ebene)),
      linear-gradient(var(--ebene), var(--ebene)), linear-gradient(var(--ebene), var(--ebene)),
      linear-gradient(var(--ebene), var(--ebene)), linear-gradient(var(--ebene), var(--ebene)),
      linear-gradient(var(--port-blau), var(--port-blau)), linear-gradient(var(--port-blau), var(--port-blau));
    background-size:
      6px 2px, 2px 6px,
      5px 5px, 5px 5px, 5px 5px, 5px 5px, 5px 5px, 5px 5px, 5px 5px, 5px 5px, 8px 8px, 8px 8px,
      7px 7px, 7px 7px, 7px 7px, 7px 7px, 7px 7px, 7px 7px, 7px 7px, 7px 7px, 10px 10px, 10px 10px;
    background-position:
      calc(100% - 2px) calc(100% - var(--port) - 4px),
      calc(100% - 4px) calc(100% - var(--port) - 2px),
      2px 2px, 50% 2px, calc(100% - 2px) 2px,
      2px 50%, calc(100% - 2px) 50%,
      2px calc(100% - 2px), 50% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px),
      1px calc(var(--port) + 1px), calc(100% - 1px) calc(100% - var(--port) - 1px),
      1px 1px, 50% 1px, calc(100% - 1px) 1px,
      1px 50%, calc(100% - 1px) 50%,
      1px calc(100% - 1px), 50% calc(100% - 1px), calc(100% - 1px) calc(100% - 1px),
      0 var(--port), 100% calc(100% - var(--port));
    background-repeat: no-repeat;
  }

  /* Der Rahmen schliesst den Rand des Ziels ein, links den Strich für den Kurs. */
  :global(html.layout main li[data-ausgewaehlt]::after) {
    inset: -6px -5px -5px -8px;
  }

  /* Ports hat nur ein Rahmen mit Text, eine Gruppe von Chips nicht. */
  :global(html.layout main fieldset[data-ausgewaehlt]::after) {
    top: calc(-5px - var(--ueberstand, 0px));
    --port-weiss: transparent;
    --port-blau: transparent;
  }

  /* Ein zugeklapptes Gegenstück ist Text, der nicht in den Rahmen passt. */
  :global(html.layout main li[data-ausgewaehlt]:has(> .inhalt > button[aria-expanded='false'])::after) {
    --plus: #e2001a;
  }
</style>
