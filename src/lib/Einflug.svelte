<script>
  /**
   * Lässt jedes Leistungsziel hereinfliegen, sobald es ins Bild scrollt: von
   * unten, gestaffelt und mit leichtem Überschwingen, wie mit einer
   * Ease-out-back-Kurve im Motion Design. Bei reduzierter Bewegung bleibt alles stehen.
   */
  const ZIEL = 'main li:has(> .wahl)';
  const STAFFEL = 70; // ms zwischen zwei Zielen, die zugleich ins Bild kommen

  $effect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const html = document.documentElement;
    html.classList.add('einflug');

    const sichtbar = new IntersectionObserver(
      (eintraege) => {
        eintraege
          .filter((eintrag) => eintrag.isIntersecting)
          .forEach((eintrag, i) => {
            eintrag.target.style.transitionDelay = `${i * STAFFEL}ms`;
            eintrag.target.classList.add('eingeflogen');
            sichtbar.unobserve(eintrag.target);
          });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    const beobachte = () => document.querySelectorAll(`${ZIEL}:not(.eingeflogen)`).forEach((li) => sichtbar.observe(li));
    beobachte();
    // Eine geänderte Suche bringt neue Ziele, die ebenfalls hereinfliegen.
    const neu = new MutationObserver(beobachte);
    neu.observe(document.querySelector('main'), { childList: true, subtree: true });

    return () => {
      neu.disconnect();
      sichtbar.disconnect();
      html.classList.remove('einflug');
      document.querySelectorAll(ZIEL).forEach((li) => {
        li.classList.remove('eingeflogen');
        li.style.transitionDelay = '';
      });
    };
  });
</script>

<style>
  :global(html.einflug main li:has(> .wahl)) {
    transition:
      opacity 0.3s ease-out,
      translate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  :global(html.einflug main li:has(> .wahl):not(.eingeflogen)) {
    opacity: 0;
    translate: 0 3rem;
  }
</style>
