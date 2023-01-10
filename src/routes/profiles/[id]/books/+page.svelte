<script lang="ts">
  // svelte
  import { onMount } from 'svelte';

  // stores
  import { page } from '$app/stores';

  // enums
  import E_BookStatus from '$enums/E_BookStatus';

  // components
  import ItemGrid from '$components/ItemGrid.svelte';
  import Paginator from '$components/Paginator.svelte';

  // data
  export let data: {
    profile: any,
    items: any,
    currentPage: number,
    maxPageItemsCount: number,
  }
</script>

<div class="flex flex-col items-center gap-4">
  <h1 class="dark:text-white text-center text-2xl font-bold">Profile {data.profile.id} Books</h1>
  <div class="flex flex-wrap justify-center gap-4">
    <a href={`/profiles/${$page.params.id}/books`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>All ({data.profile.book_total_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.READING.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.READING.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.READING.text} ({data.profile.book_reading_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.WANT_TO_READ.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.WANT_TO_READ.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.WANT_TO_READ.text} ({data.profile.book_want_to_read_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.READ.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.READ.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.READ.text} ({data.profile.book_read_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.DID_NOT_FINISH.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.DID_NOT_FINISH.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.DID_NOT_FINISH.text} ({data.profile.book_did_not_finish_count})</a>
  </div>
  <slot />
  <ItemGrid items={data.items} />
  <Paginator
    currentPage={data.currentPage}
    currentItemsCount={data.items.length}
    maxPageItemsCount={data.maxPageItemsCount}
  />
</div>