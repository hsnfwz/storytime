<script lang="ts">
  // svelte
  import { goto } from '$app/navigation';

  // components
  import ArrowLeftButton from 'src/components/ArrowLeftButton.svelte';
  import ArrowRightButton from 'src/components/ArrowRightButton.svelte';

  // props
  export let currentPage: number;
  export let currentItemsCount: number;
  export let maxPageItemsCount: number;
</script>

<div class="flex justify-center gap-2">
  <ArrowLeftButton
    handleClick={() => {
      currentPage = currentPage - 1;
      goto(`?page=${currentPage}`, { replaceState: false });
    }}
    isDisabled={currentPage === 1}
  />
  <ArrowRightButton
    handleClick={() => {
      currentPage = currentPage + 1;
      goto(`?page=${currentPage}`, { replaceState: false });
    }}
    isDisabled={currentItemsCount < maxPageItemsCount}
  />
</div>