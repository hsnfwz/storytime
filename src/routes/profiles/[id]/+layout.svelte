<script lang="ts">
  // stores
  import { page } from '$app/stores';
  import { profile } from '$stores/ProfileStore';

  // enums
  import E_BookStatus from '$enums/E_BookStatus';

  // state
  let currentProfile: any = undefined;

  profile.subscribe((value) => currentProfile = value);
</script>

<div class="flex flex-col items-center gap-4">
  <h1 class="text-center text-xl font-bold">Books</h1>
  <div class="flex flex-wrap justify-center gap-4">
    <a href={`/profiles/${$page.params.id}/books`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>All ({currentProfile.book_total_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.READING.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.READING.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.READING.text} ({currentProfile.book_reading_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.WANT_TO_READ.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.WANT_TO_READ.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.WANT_TO_READ.text} ({currentProfile.book_want_to_read_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.READ.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.READ.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.READ.text} ({currentProfile.book_read_count})</a>
    <a href={`/profiles/${$page.params.id}/books/${E_BookStatus.DID_NOT_FINISH.url}`} class={`${$page.url.pathname === `/profiles/${$page.params.id}/books/${E_BookStatus.DID_NOT_FINISH.url}` ? 'bg-blue-500 text-white' : ''} text-center rounded px-4 py-2 bg-neutral-100`}>{E_BookStatus.DID_NOT_FINISH.text} ({currentProfile.book_did_not_finish_count})</a>
  </div>
  <slot />
</div>