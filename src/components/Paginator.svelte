<script lang="ts">
  // props
  export let currentPage: number;
  export let currentItemsCount: number;
  export let maxPageItemsCount: number;
</script>

<div class="flex justify-center gap-4">
  <a
    href={`?page=${currentPage}`}
    class={`rounded-full w-8 h-8 bg-slate-600 text-white st-font-bold disabled:opacity-50 flex justify-center items-center gap-2 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
    on:click={() => currentPage = currentPage - 1}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
    </svg>
  </a>
  <a
    href={`?page=${currentPage}`}
    class={`rounded-full w-8 h-8 bg-slate-600 text-white st-font-bold disabled:opacity-50 flex justify-center items-center gap-2 ${currentItemsCount < maxPageItemsCount ? 'opacity-50 pointer-events-none' : ''}`}
    on:click={() => currentPage = currentPage + 1}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
    </svg>
  </a>
</div>