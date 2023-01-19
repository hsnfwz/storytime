<script lang="ts">
  // svelte
  import { onMount, tick } from 'svelte';

  // api
  import { getRecords } from '$api/database';

  // components
  import ItemCard from '$components/ItemCard.svelte';
  import Button from '$components/Button.svelte';

  // state
  let isLoading: boolean = false;
  let items: any;
  let columns: any;
  let columnsCount: number;

  $: {
    if (columnsCount) {
      console.log(columnsCount);

      let columnWrappers: any = {};

      for (let i = 0; i < columnsCount; i++) {
        columnWrappers[`column${i}`] = [];
      }

      for (let i = 0; i < items.length; i++) {
        const column = i % columnsCount;
        columnWrappers[`column${column}`].push(items[i]);
      }

      columns = columnWrappers;
    }
  }

  onMount(async () => {
    isLoading = true;

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
    }

    let previousScreenSize = window.innerWidth;

    if (previousScreenSize < 640) {
      columnsCount = 2;
    } else if (previousScreenSize >= 640 && previousScreenSize < 1024) {
      columnsCount = 4;
    } else if (previousScreenSize >= 1024 && previousScreenSize < 1536) {
      columnsCount = 6;
    } else {
      columnsCount = 8;
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth < 640 && previousScreenSize >= 640) {
        columnsCount = 2;
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024 && (previousScreenSize < 640 || previousScreenSize >= 1024)) {
        columnsCount = 4;
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1536 && (previousScreenSize < 1024 || previousScreenSize >= 1536)) {
        columnsCount = 6;
      } else if (window.innerWidth >= 1536 && previousScreenSize < 1536) {
        columnsCount = 8;
      }

      previousScreenSize = window.innerWidth;
    });

    await tick();
    const exploreBooksScrollY: any = sessionStorage.getItem('explore-books-scroll-y');
    if (exploreBooksScrollY) {
      const _exploreBooksScrollY: any = JSON.parse(exploreBooksScrollY);
      window.scrollTo(0, _exploreBooksScrollY);
    }

    isLoading = false;
  });
</script>

{#if columns}
  <div class={`grid grid-cols-${columnsCount} gap-4`}>
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

{#if isLoading}
  <h1 class="dark:text-white">Loading...</h1>
{/if}

<Button
  label="Show More"
  handleClick={async () => {
    isLoading = true;

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
    sessionStorage.setItem('explore-books-scroll-y', JSON.stringify(window.scrollY));

    isLoading = false;
  }}
/>