<script lang="ts">
  // svelte
  import { onMount, tick } from 'svelte';

  // api
  import { getRecords } from 'src/api/database';

  // components
  import ItemCard from 'src/components/ItemCard.svelte';
  import Button from 'src/components/Button.svelte';

  // state
  let items: any = [];
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

  onMount(async () => {
    const exploreBooks: any = sessionStorage.getItem('explore-books');

    if (exploreBooks) {
      items = JSON.parse(exploreBooks);
    } else {
      items = await getRecords(
        'book',
        'id, title',
        undefined,
        {
          column: 'release_date',
          ascending: false
        },
        {
          from: 0,
          to: 23,
        }
      );

      sessionStorage.setItem('explore-books', JSON.stringify(items));
    }

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

    await tick();
    const exploreBooksScrollY: any = sessionStorage.getItem('explore-books-scroll-y');
    if (exploreBooksScrollY) {
      const _exploreBooksScrollY: any = JSON.parse(exploreBooksScrollY);
      window.scrollTo(0, _exploreBooksScrollY);
    }
  });
</script>

{#if columns}
  <div class={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4`}>
    {#each Object.values(columns) as column}
      <div class="flex flex-col gap-4">
        {#each column as item}
          <a
            href={`/explore/books/${item.id}`}
            on:click={() => sessionStorage.setItem('explore-books-scroll-y', JSON.stringify(window.scrollY))}
          >
            <ItemCard {item} />
          </a>
        {/each}
      </div>
    {/each}
  </div>
{/if}

<Button
  label="Show More"
  handleClick={async () => {
    const limit = 23;
    const from = items.length;
    const to = items.length + limit;

    const _items = await getRecords(
      'book',
      'id, title',
      undefined,
      {
        column: 'release_date',
        ascending: false
      },
      {
        from,
        to,
      }
    );

    items = [...items, ..._items];

    sessionStorage.setItem('explore-books', JSON.stringify(items));

    masonry(items, Object.keys(columns).length);
  }}
  isDisabled={items.length === 0 || items.length % 24 !== 0}
/>