<script lang="ts">
  // svelte
  import { afterUpdate } from 'svelte';

  // components
  import ProfileGrid from '$components/ProfileGrid.svelte';

  // data
  export let data: {
    profiles: any,
    pageNumber: number,
  };

  afterUpdate(() => profiles = data.profiles);

  // state
  let isLoading: boolean = false;
  let pageNumber: number = data.pageNumber;
  let profiles: any = data.profiles;

  const limit: number = 47;
</script>

<div class="flex flex-col items-center gap-8">
  {#if isLoading}
    <p class="dark:text-white text-center">Loading...</p>
  {:else}
    <h1 class="dark:text-white text-center st-font-bold text-2xl">Profiles</h1>
    <ProfileGrid {profiles} />
    <div class="flex gap-4">
      <a
        href={`?page=${pageNumber}`}
        class={`rounded p-2 bg-blue-500 text-white st-font-bold disabled:opacity-50 flex justify-center items-center gap-2 ${pageNumber === 1 ? 'opacity-50 pointer-events-none' : ''}`}
        on:click={() => pageNumber = pageNumber - 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
        </svg>
        <span>Previous</span>
      </a>
      <a
        href={`?page=${pageNumber}`}
        class={`rounded p-2 bg-blue-500 text-white st-font-bold disabled:opacity-50 flex justify-center items-center gap-2 ${profiles.length <= limit ? 'opacity-50 pointer-events-none' : ''}`}
        on:click={() => pageNumber = pageNumber + 1}
      >
        <span>Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </a>
    </div>
  {/if}
</div>