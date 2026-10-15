<script>
  /** Setzt die ganze Seite in Comic Sans, solange eingebunden. */
  $effect(() => {
    document.documentElement.classList.add('comic-sans');
    return () => document.documentElement.classList.remove('comic-sans');
  });
</script>

<style>
  /* !important, weil die Schriften der Komponenten sonst spezifischer sind. */
  :global(html.comic-sans *) {
    font-family: 'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive !important;
  }
</style>
