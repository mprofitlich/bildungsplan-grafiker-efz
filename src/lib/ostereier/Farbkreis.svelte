<script>
  /**
   * Dreht Kopf und Inhalt einmal durch den ganzen Farbkreis. Bei reduzierter
   * Bewegung zeigt die Seite statt dessen ruhig ihre Komplementärfarben.
   * Solange eingebunden.
   */
  $effect(() => {
    document.documentElement.classList.add('farbkreis');
    return () => document.documentElement.classList.remove('farbkreis');
  });
</script>

<style>
  :global(html.farbkreis :is(body > * > header, main)) {
    animation: farbkreis 6s ease-in-out;
  }

  @keyframes -global-farbkreis {
    to {
      filter: hue-rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(html.farbkreis :is(body > * > header, main)) {
      animation: none;
      filter: hue-rotate(180deg);
    }
  }
</style>
