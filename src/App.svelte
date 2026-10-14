<script>
  import Erklaerung from './lib/Erklaerung.svelte';
  import Katalog from './lib/Katalog.svelte';
  import Kurs from './lib/Kurs.svelte';
  import { quelle } from './lib/katalog.js';
  import { aktiverKurs } from './lib/kurse.svelte.js';

  const stand = new Intl.DateTimeFormat('de-CH', { dateStyle: 'long' }).format(new Date(quelle.stand));

  let ansicht = $state('katalog');
  const kurs = $derived(aktiverKurs());
</script>

<header>
  <div>
    <h1>Bildungsplan Grafikerin/Grafiker EFZ</h1>
    <p class="quelle">{quelle.titel}, vom {stand}</p>
  </div>
  <nav aria-label="Ansichten">
    <button aria-current={ansicht === 'katalog' ? 'page' : undefined} onclick={() => (ansicht = 'katalog')}>
      Katalog
    </button>
    <button aria-current={ansicht === 'kurs' ? 'page' : undefined} onclick={() => (ansicht = 'kurs')}>
      Kurs: {kurs.titel || 'ohne Titel'} ({kurs.ziele.length})
    </button>
  </nav>
</header>

<main>
  {#if ansicht === 'katalog'}
    <Katalog />
  {:else}
    <Kurs />
  {/if}
</main>

<Erklaerung />

<style>
  header,
  main {
    max-width: 90rem;
    margin: 0 auto;
    padding: var(--abstand-gross) var(--abstand);
  }

  header {
    display: flex;
    flex-wrap: wrap;
    gap: var(--abstand);
    align-items: baseline;
    justify-content: space-between;
    padding-bottom: 0;
  }

  header > div {
    flex: 1 1 30rem;
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  .quelle {
    max-width: 62.75rem;
    margin: var(--abstand-klein) 0 0;
    color: var(--text-leise);
    font-size: var(--schrift-klein);
  }

  nav {
    display: flex;
    gap: var(--abstand-klein);
  }
</style>
