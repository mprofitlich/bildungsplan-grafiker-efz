<script>
  import readme from '../../README.md?raw';
  import { alsHtml, hilfeteil } from './hilfe.js';

  const html = alsHtml(hilfeteil(readme));
</script>

<!-- Der Inhalt stammt aus der eigenen README; alsHtml maskiert ihn. -->
<article>
  {@html html}
</article>

<style>
  article {
    max-width: 48rem;
  }

  article :global(h2) {
    margin: var(--abstand-gross) 0 var(--abstand);
    font-size: 1.375rem;
  }

  article :global(h2:first-child) {
    margin-top: 0;
  }

  article :global(p),
  article :global(ul) {
    margin: 0 0 var(--abstand);
  }

  article :global(ul) {
    padding-left: 1.25rem;
  }

  article :global(li + li) {
    margin-top: var(--abstand-klein);
  }

  article :global(code) {
    padding: 0 0.25em;
    background: var(--flaeche);
    font-size: 0.9em;
  }

  article :global(a) {
    color: var(--akzent);
  }
</style>
