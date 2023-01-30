<script lang="ts">
  // svelte
  import { afterUpdate } from 'svelte';

  // components
  import ItemCard from 'src/components/ItemCard.svelte';
  import Card from 'src/components/Card.svelte';

  // props
  export let items: any = [];

  // state
  let columns: any;

  const masonry = (_items: any, _columnsCount: number) => {
    let columnWrappers: any = {};

    for (let i = 0; i < _columnsCount; i++) {
      columnWrappers[`column${i}`] = [];
    }

    for (let i = 0; i < _items.length; i++) {
      const column = i % _columnsCount;
      columnWrappers[`column${column}`].push(_items[i]);
    }

    columns = columnWrappers;
  }

  afterUpdate(async () => {
    window.addEventListener('resize', () => {
      if (window.innerWidth < 640 && previousScreenSize >= 640) {
        masonry(items, 2);
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024 && (previousScreenSize < 640 || previousScreenSize >= 1024)) {
        masonry(items, 4);
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1536 && (previousScreenSize < 1024 || previousScreenSize >= 1536)) {
        masonry(items, 6);
      } else if (window.innerWidth >= 1536 && previousScreenSize < 1536) {
        masonry(items, 8);
      }

      previousScreenSize = window.innerWidth;
    });

    let previousScreenSize = window.innerWidth;

    if (previousScreenSize < 640) {
      masonry(items, 2);
    } else if (previousScreenSize >= 640 && previousScreenSize < 1024) {
      masonry(items, 4);
    } else if (previousScreenSize >= 1024 && previousScreenSize < 1536) {
      masonry(items, 6);
    } else {
      masonry(items, 8);
    }
  });
</script>

{#if items.length === 0}
  <Card>
    <p>No books</p>
  </Card>
{:else if items.length !== 0 && columns}
  <div class={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4`}>
    {#each Object.values(columns) as column}
      <div class="flex flex-col gap-4">
        {#each column as item}
          <a href={`/explore/books/${item.id}`}>
            <ItemCard {item} />
          </a>
        {/each}
      </div>
    {/each}
  </div>
{/if}