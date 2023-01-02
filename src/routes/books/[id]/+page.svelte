<script lang="ts">
  // api
  import { insertRecords, updateRecords, getRecords, deleteRecords } from '$api/database';

  // stores
  import { profile } from '$stores/ProfileStore';

  // enums
  import E_BookStatus from '$enums/E_BookStatus';

  // interfaces
  import type I_Profile from '$interfaces/I_Profile';

  // components
  import ItemCard from '$components/ItemCard.svelte';

  // data
  export let data: { books: any };

  // state
  let currentProfile: I_Profile | undefined;
  let status: string = '';

  profile.subscribe(async (value) => {
    currentProfile = value;

    if (value) {
      const profileBooks: any = await getRecords(
        'profile_book',
        'id, status',
        { profile_id: currentProfile.id, book_id: data.books[0].id },
      );

      if (profileBooks[0]) {
        status = profileBooks[0].status;
      }
    }
  });

  const handleRemoveProfileBook = async () => {
    let countAttribute: string = '';
    let countValue: number = 0;

    if (status === E_BookStatus.READING.text) {
      countAttribute = 'book_reading_count';
      countValue = currentProfile.book_reading_count - 1;
    } else if (status === E_BookStatus.WANT_TO_READ.text) {
      countAttribute = 'book_want_to_read_count';
      countValue = currentProfile.book_want_to_read_count - 1;
    } else if (status === E_BookStatus.READ.text) {
      countAttribute = 'book_read_count';
      countValue = currentProfile.book_read_count - 1;
    } else if (status === E_BookStatus.DID_NOT_FINISH.text) {
      countAttribute = 'book_did_not_finish_count';
      countValue = currentProfile.book_did_not_finish_count - 1;
    }

    const _bookTotalCount = currentProfile.book_total_count - 1;

    const _updatedProfileData: any = {
      book_total_count: _bookTotalCount,
      [countAttribute]: countValue,
    };

    const [deletedProfileBookRecord, updatedProfileRecord] = await Promise.all([
      deleteRecords('profile_book', { profile_id: currentProfile.id, book_id: data.books[0].id }),
      updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
    ]);

    profile.set(updatedProfileRecord[0]);

    status = '';
  }

  const handleAddEditProfileBook = async (bookStatus: string) => {
    if (status) {
      // edit
      let plusCountAttribute: string = '';
      let plusCountValue: number = 0;

      let minusCountAttribute: string = '';
      let minusCountValue: number = 0;

      if (status === E_BookStatus.READING.text) {
        minusCountAttribute = 'book_reading_count';
        minusCountValue = currentProfile.book_reading_count - 1;
      } else if (status === E_BookStatus.WANT_TO_READ.text) {
        minusCountAttribute = 'book_want_to_read_count';
        minusCountValue = currentProfile.book_want_to_read_count - 1;
      } else if (status === E_BookStatus.READ.text) {
        minusCountAttribute = 'book_read_count';
        minusCountValue = currentProfile.book_read_count - 1;
      } else if (status === E_BookStatus.DID_NOT_FINISH.text) {
        minusCountAttribute = 'book_did_not_finish_count';
        minusCountValue = currentProfile.book_did_not_finish_count - 1;
      }

      if (bookStatus === E_BookStatus.READING.text) {
        plusCountAttribute = 'book_reading_count';
        plusCountValue = currentProfile.book_reading_count + 1;
      } else if (bookStatus === E_BookStatus.WANT_TO_READ.text) {
        plusCountAttribute = 'book_want_to_read_count';
        plusCountValue = currentProfile.book_want_to_read_count + 1;
      } else if (bookStatus === E_BookStatus.READ.text) {
        plusCountAttribute = 'book_read_count';
        plusCountValue = currentProfile.book_read_count + 1;
      } else if (bookStatus === E_BookStatus.DID_NOT_FINISH.text) {
        plusCountAttribute = 'book_did_not_finish_count';
        plusCountValue = currentProfile.book_did_not_finish_count + 1;
      }

      const _updatedProfileData: any = {
        [plusCountAttribute]: plusCountValue,
        [minusCountAttribute]: minusCountValue,
      };

      const _updatedProfileBookData: any = {
        status: bookStatus,
      };

      const [updatedProfileBookRecord, updatedProfileRecord] = await Promise.all([
        updateRecords('profile_book', _updatedProfileBookData, { profile_id: currentProfile.id, book_id: data.books[0].id }),
        updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
      ]);

      profile.set(updatedProfileRecord[0]);
    } else {
      // add
      let countAttribute: string = '';
      let countValue: number = 0;

      if (bookStatus === E_BookStatus.READING.text) {
        countAttribute = 'book_reading_count';
        countValue = currentProfile.book_reading_count + 1;
      } else if (bookStatus === E_BookStatus.WANT_TO_READ.text) {
        countAttribute = 'book_want_to_read_count';
        countValue = currentProfile.book_want_to_read_count + 1;
      } else if (bookStatus === E_BookStatus.READ.text) {
        countAttribute = 'book_read_count';
        countValue = currentProfile.book_read_count + 1;
      } else if (bookStatus === E_BookStatus.DID_NOT_FINISH.text) {
        countAttribute = 'book_did_not_finish_count';
        countValue = currentProfile.book_did_not_finish_count + 1;
      }

      const _bookTotalCount = currentProfile.book_total_count + 1;

      const _updatedProfileData: any = {
        book_total_count: _bookTotalCount,
        [countAttribute]: countValue,
      };

      const _newProfileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.books[0].id,
        status: bookStatus,
      };

      const [insertedProfileBookRecord, updatedProfileRecord] = await Promise.all([
        insertRecords('profile_book', [_newProfileBookData]),
        updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
      ]);

      profile.set(updatedProfileRecord[0]);
    }

    status = bookStatus;
  }
</script>

<div class="flex flex-col items-center gap-4">
  <div class="flex flex-col gap-2">
    <h1 class="font-bold text-xl text-center">{data.books[0].title}</h1>
    <p class="text-center">
      Published on {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(data.books[0].release_date))}
    </p>
  </div>
  <ItemCard item={data.books[0]} />
  {#if currentProfile}
    <div class="flex gap-4">
      <div class="flex flex-col gap-4">
        {#each Object.values(E_BookStatus) as bookStatus}
          <button
            class={`px-4 py-2 rounded font-bold ${status === bookStatus.text ? 'bg-green-500 text-white pointer-events-none' : 'bg-neutral-100'}`}
            type="button"
            on:click={async () => await handleAddEditProfileBook(bookStatus.text)}
          >
            {bookStatus.text}
          </button>
        {/each}
        <button
          class="px-4 py-2 rounded font-bold bg-red-500 text-white disabled:opacity-50"
          type="button"
          on:click={async () => await handleRemoveProfileBook()}
          disabled={status === ''}
        >
          Remove
        </button>
      </div>
      <div class="flex flex-col gap-4">
        <button
          class={`px-4 py-2 rounded font-bold bg-neutral-100 disabled:opacity-50`}
          type="button"
          on:click={() => console.log('queue')}
          disabled
        >
          Queue
        </button>
        <button
          class={`px-4 py-2 rounded font-bold bg-neutral-100 disabled:opacity-50`}
          type="button"
          on:click={() => console.log('rank')}
          disabled
        >
          Rank
        </button>
        <button
          class={`px-4 py-2 rounded font-bold bg-neutral-100 disabled:opacity-50`}
          type="button"
          on:click={() => console.log('review')}
          disabled
        >
          Review
        </button>
      </div>
    </div>
  {:else}
    <p class="text-center"><a href='/sign-in' class="text-blue-500">Sign in</a> to start managing your books</p>
  {/if}
</div>