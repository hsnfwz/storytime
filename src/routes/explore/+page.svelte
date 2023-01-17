<script lang="ts">
  // components
  import ItemGrid from '$components/ItemGrid.svelte';
  import Paginator from '$components/Paginator.svelte';

  // data
  export let data: {
    items: any,
    currentPage: number,
    maxPageItemsCount: number,
  };

  // state
  let isLoading: boolean = false;
</script>

<div class="flex flex-col items-center gap-4">
  {#if isLoading}
    <p class="dark:text-white text-center">Loading...</p>
  {:else}
    <h1 class="dark:text-white text-center st-font-bold text-xl">Explore</h1>
    <ItemGrid items={data.items} />
    <Paginator
      currentPage={data.currentPage}
      currentItemsCount={data.items.length}
      maxPageItemsCount={data.maxPageItemsCount}
    />
  {/if}
</div>

<!-- todo: use in profile page -->
<!-- <div class="flex flex-col items-center gap-4">
  <ItemGrid items={data.books} />
  <div class="flex gap-4">
    <button
      type="button"
      class="rounded p-2 bg-blue-500 text-white st-font-bold disabled:opacity-50"
      on:click={() => page = 1}
      disabled={page === 1}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z" clip-rule="evenodd" />
      </svg>
    </button>
    <button
      type="button"
      class="rounded p-2 bg-blue-500 text-white st-font-bold disabled:opacity-50"
      on:click={() => page = page - 1}
      disabled={page === 1}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
      </svg>
    </button>
    <p class="dark:text-white flex items-center">{page} / {data.books.length}</p>
    <button
      type="button"
      class="rounded p-2 bg-blue-500 text-white st-font-bold disabled:opacity-50"
      on:click={() => page = page + 1}
      disabled={page === data.books.length}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
      </svg>    
    </button>
    <button
      type="button"
      class="rounded p-2 bg-blue-500 text-white st-font-bold disabled:opacity-50"
      on:click={() => page = data.books.length}
      disabled={page === data.books.length}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        <path fill-rule="evenodd" d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <div class="flex gap-2">
    <input
      class="p-2 border border-neutral-100 rounded"
      type="number"
      min={1}
      max={data.books.length}
      value={page}
      on:change={(e) => page = +e.target.value}
    />
    <p class="dark:text-white p-2">/ {data.books.length}</p>
    <button
      type="button"
      class="px-4 py-2 bg-green-500 text-white st-font-bold rounded disabled:opacity-50"
      on:click={() => {
        if (page <= 0) {
          page = 1;
        } else if (page > data.books.length) {
          page = data.books.length;
        }
      }}
      disabled={page > data.books.length}
    >
      Go
    </button>
  </div>
</div> -->