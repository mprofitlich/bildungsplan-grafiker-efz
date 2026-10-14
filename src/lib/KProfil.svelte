<script>
  import { fassung } from './fassung.svelte.js';
  import { taxonomiestufen, wortlaut } from './katalog.js';

  let { ziele } = $props();

  const zeilen = $derived(
    taxonomiestufen.map((eintrag) => ({
      ...eintrag,
      anzahl: ziele.filter((ziel) => wortlaut(ziel, fassung.id).stufe === eintrag.stufe).length,
    })),
  );
  const hoechste = $derived(Math.max(1, ...zeilen.map((zeile) => zeile.anzahl)));
</script>

<ul>
  {#each zeilen as zeile (zeile.stufe)}
    <li>
      <span class="name">{zeile.kuerzel} {zeile.begriff}</span>
      <span class="spur">
        <span class="stufe" data-stufe={zeile.stufe} style:width="{(zeile.anzahl / hoechste) * 100}%"></span>
      </span>
      <span class="anzahl">{zeile.anzahl}</span>
    </li>
  {/each}
</ul>

<style>
  ul {
    display: grid;
    gap: var(--abstand-klein);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: 8rem 1fr 2rem;
    gap: var(--abstand);
    align-items: center;
  }

  .spur {
    display: block;
    height: 0.75rem;
    background: var(--flaeche);
    border-radius: var(--radius);
  }

  .spur .stufe {
    display: block;
    height: 100%;
    padding: 0;
    background: oklch(var(--k-kraeftig) var(--ton));
    border-radius: var(--radius);
  }

  .anzahl {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
</style>
