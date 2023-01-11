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
  import Counter from '$components/Counter.svelte';

  // data
  export let data: { item: any };

  // state
  let currentProfile: I_Profile | undefined;
  let status: string = '';
  let rating: number = 5;
  let review: string = '';

  let profileBook: any;

  profile.subscribe(async (value) => {
    currentProfile = value;

    if (value) {
      const profileBooks: any = await getRecords(
        'profile_book',
        '*',
        {
          profile_id: currentProfile.id,
          book_id: data.item.id
        },
      );

      if (profileBooks[0]) {
        profileBook = profileBooks[0];
        status = profileBook.status;
      }
    }
  });

  const handleRemoveProfileBook = async () => {
    // todo: update additional attrbiutes
    let countAttribute: string = '';
    let countValue: number = 0;

    if (profileBook.status === E_BookStatus.READING.text) {
      countAttribute = 'book_reading_status_count';
      countValue = currentProfile.book_reading_status_count - 1;
    } else if (profileBook.status === E_BookStatus.WANT_TO_READ.text) {
      countAttribute = 'book_want_to_read_status_count';
      countValue = currentProfile.book_want_to_read_status_count - 1;
    } else if (profileBook.status === E_BookStatus.READ.text) {
      countAttribute = 'book_read_status_count';
      countValue = currentProfile.book_read_status_count - 1;
    } else if (profileBook.status === E_BookStatus.DID_NOT_FINISH.text) {
      countAttribute = 'book_did_not_finish_status_count';
      countValue = currentProfile.book_did_not_finish_status_count - 1;
    }

    const _bookTotalCount = currentProfile.book_total_status_count - 1;

    const _updatedProfileData: any = {
      book_total_status_count: _bookTotalCount,
      [countAttribute]: countValue,
    };

    const [deletedProfileBookRecord, updatedProfileRecord] = await Promise.all([
      deleteRecords('profile_book', { profile_id: currentProfile.id, book_id: data.item.id }),
      updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
    ]);

    profile.set(updatedProfileRecord[0]);
    profileBook = undefined;
    status = '';
  }

  const handleAddEditProfileBook = async (bookStatus: string) => {
    // todo: update additional attrbiutes
    if (profileBook && profileBook.status) {
      // edit
      let plusCountAttribute: string = '';
      let plusCountValue: number = 0;

      let minusCountAttribute: string = '';
      let minusCountValue: number = 0;

      if (profileBook.status === E_BookStatus.READING.text) {
        minusCountAttribute = 'book_reading_status_count';
        minusCountValue = currentProfile.book_reading_status_count - 1;
      } else if (profileBook.status === E_BookStatus.WANT_TO_READ.text) {
        minusCountAttribute = 'book_want_to_read_status_count';
        minusCountValue = currentProfile.book_want_to_read_status_count - 1;
      } else if (profileBook.status === E_BookStatus.READ.text) {
        minusCountAttribute = 'book_read_status_count';
        minusCountValue = currentProfile.book_read_status_count - 1;
      } else if (profileBook.status === E_BookStatus.DID_NOT_FINISH.text) {
        minusCountAttribute = 'book_did_not_finish_status_count';
        minusCountValue = currentProfile.book_did_not_finish_status_count - 1;
      }

      if (bookStatus === E_BookStatus.READING.text) {
        plusCountAttribute = 'book_reading_status_count';
        plusCountValue = currentProfile.book_reading_status_count + 1;
      } else if (bookStatus === E_BookStatus.WANT_TO_READ.text) {
        plusCountAttribute = 'book_want_to_read_status_count';
        plusCountValue = currentProfile.book_want_to_read_status_count + 1;
      } else if (bookStatus === E_BookStatus.READ.text) {
        plusCountAttribute = 'book_read_status_count';
        plusCountValue = currentProfile.book_read_status_count + 1;
      } else if (bookStatus === E_BookStatus.DID_NOT_FINISH.text) {
        plusCountAttribute = 'book_did_not_finish_status_count';
        plusCountValue = currentProfile.book_did_not_finish_status_count + 1;
      }

      const _updatedProfileData: any = {
        [plusCountAttribute]: plusCountValue,
        [minusCountAttribute]: minusCountValue,
      };

      const _updatedProfileBookData: any = {
        status: bookStatus,
        status_updated_at: new Date(),
      };

      const [updatedProfileBookRecord, updatedProfileRecord] = await Promise.all([
        updateRecords('profile_book', _updatedProfileBookData, { profile_id: currentProfile.id, book_id: data.item.id }),
        updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
      ]);

      profile.set(updatedProfileRecord[0]);
      profileBook = updatedProfileBookRecord;
    } else {
      // add
      let countAttribute: string = '';
      let countValue: number = 0;

      if (bookStatus === E_BookStatus.READING.text) {
        countAttribute = 'book_reading_status_count';
        countValue = currentProfile.book_reading_status_count + 1;
      } else if (bookStatus === E_BookStatus.WANT_TO_READ.text) {
        countAttribute = 'book_want_to_read_status_count';
        countValue = currentProfile.book_want_to_read_status_count + 1;
      } else if (bookStatus === E_BookStatus.READ.text) {
        countAttribute = 'book_read_status_count';
        countValue = currentProfile.book_read_status_count + 1;
      } else if (bookStatus === E_BookStatus.DID_NOT_FINISH.text) {
        countAttribute = 'book_did_not_finish_status_count';
        countValue = currentProfile.book_did_not_finish_status_count + 1;
      }

      const _bookTotalCount = currentProfile.book_total_status_count + 1;

      const _updatedProfileData: any = {
        book_total_status_count: _bookTotalCount,
        [countAttribute]: countValue,
      };

      const _newProfileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status: bookStatus,
        status_created_at: new Date(),
      };

      const [insertedProfileBookRecord, updatedProfileRecord] = await Promise.all([
        insertRecords('profile_book', [_newProfileBookData]),
        updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
      ]);

      profile.set(updatedProfileRecord[0]);
      profileBook = insertedProfileBookRecord;
    }

    status = '';
  }

  const handleAddEditRatingReview = async () => {
    // todo: "delete" rating and/or review (clear the attributes and update relevent tables)
    if (profileBook && profileBook.rating !== null) {
      console.log('edit')
      // edit

      const profileMinusCountAttribute: string = `book_${profileBook.rating}_rating_count`;
      const profileMinusCountValue: number = currentProfile[profileMinusCountAttribute] - 1;

      const profilePlusCountAttribute: string = `book_${rating}_rating_count`;
      const profilePlusCountValue: number = currentProfile[profilePlusCountAttribute] + 1;

      const bookMinusCountAttribute: string = `${profileBook.rating}_rating_count`;
      const bookMinusCountValue: number = currentProfile[bookMinusCountAttribute] - 1;

      const bookPlusCountAttribute: string = `${rating}_rating_count`;
      const bookPlusCountValue: number = currentProfile[bookPlusCountAttribute] + 1;

      const _updatedProfileData: any = {
        [profileMinusCountAttribute]: profileMinusCountValue,
        [profilePlusCountAttribute]: profilePlusCountValue,
      };

      const _updatedProfileBookData: any = {
        rating,
        rating_updated_at: new Date(),
        // review,
      };

      const _updatedBookData: any = {
        [bookMinusCountAttribute]: bookMinusCountValue,
        [bookPlusCountAttribute]: bookPlusCountValue,
      }

      const [updatedProfileBookRecord, updatedProfileRecord, updatedBookRecord] = await Promise.all([
        updateRecords('profile_book', _updatedProfileBookData, { profile_id: currentProfile.id, book_id: data.item.id }),
        updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', _updatedBookData, { id: data.item.id }),
      ]);

      profile.set(updatedProfileRecord[0]);

      data.item = updatedBookRecord[0];
    } else {
      // add

      const profileCountAttribute: string = `book_${rating}_rating_count`;
      const profileCountValue: number = currentProfile[profileCountAttribute] + 1;

      const bookCountAttribute: string = `${rating}_rating_count`;
      const bookCountValue: number = data.item[bookCountAttribute] + 1;

      const profileBookTotalRatingCount = currentProfile.book_total_rating_count + 1;
      const bookTotalRatingCount = data.item.total_rating_count + 1;

      const _updatedProfileData: any = {
        book_total_rating_count: profileBookTotalRatingCount,
        [profileCountAttribute]: profileCountValue,
      };

      const _updatedProfileBookData: any = {
        rating,
        rating_created_at: new Date(),
        // review,
      };

      const _updatedBookData: any = {
        total_rating_count: bookTotalRatingCount,
        [bookCountAttribute]: bookCountValue,
      };

      const [updatedProfileBookData, updatedProfileRecord, updatedBookRecord] = await Promise.all([
        updateRecords('profile_book', _updatedProfileBookData, { profile_id: currentProfile.id, book_id: data.item.id }),
        updateRecords('profile', _updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', _updatedBookData, { id: data.item.id }),
      ]);

      profile.set(updatedProfileRecord[0]);

      data.item = updatedBookRecord[0];
    }
  }
</script>

<div class="flex flex-col items-center gap-4">
  <div class="flex flex-col gap-2">
    <h1 class="dark:text-white st-font-bold text-2xl text-center">{data.item.title}</h1>
    <p class="dark:text-white text-center">
      Published on {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(data.item.release_date))}
    </p>
    {#if data.item.total_rating_count === 0}
      <p class="text-center dark:text-white">Not rated</p>
    {:else}
      <p class="dark:text-white text-center">
        {(0*(data.item['0_rating_count']) + 1*(data.item['1_rating_count']) + 2*(data.item['2_rating_count']) + 3*(data.item['3_rating_count']) + 4*(data.item['4_rating_count']) + 5*(data.item['5_rating_count']) + 6*(data.item['6_rating_count']) + 7*(data.item['7_rating_count']) + 8*(data.item['8_rating_count']) + 9*(data.item['9_rating_count']) + 10*(data.item['10_rating_count'])) / data.item.total_rating_count.toFixed(1)} / 10 ({data.item.total_rating_count} ratings)
      </p>
    {/if}
  </div>
  <ItemCard item={data.item} />
  {#if currentProfile}
    <div class="flex gap-4">
      <div class="flex flex-col gap-4">
        {#each Object.values(E_BookStatus) as bookStatus}
          <button
            class={`px-4 py-2 rounded st-font-bold ${status === bookStatus.text ? 'bg-green-500 text-white pointer-events-none' : 'bg-neutral-100 dark:bg-neutral-900 dark:text-white'}`}
            type="button"
            on:click={async () => await handleAddEditProfileBook(bookStatus.text)}
          >
            {bookStatus.text}
          </button>
        {/each}
        <button
          class="px-4 py-2 rounded st-font-bold bg-red-500 text-white disabled:opacity-50"
          type="button"
          on:click={async () => await handleRemoveProfileBook()}
          disabled={status === ''}
        >
          Remove
        </button>
      </div>
      <div class="flex flex-col gap-4">
        <button
          class={`px-4 py-2 rounded st-font-bold bg-neutral-100 dark:bg-neutral-900 dark:text-white disabled:opacity-50`}
          type="button"
          on:click={() => console.log('queue')}
          disabled
        >
          Queue
        </button>
        <button
          class={`px-4 py-2 rounded st-font-bold bg-neutral-100 dark:bg-neutral-900 dark:text-white disabled:opacity-50`}
          type="button"
          on:click={() => console.log('rank')}
          disabled
        >
          Rank
        </button>
        <button
          class={`px-4 py-2 rounded st-font-bold bg-neutral-100 dark:bg-neutral-900 dark:text-white disabled:opacity-50`}
          type="button"
          on:click={() => console.log('review')}
          disabled
        >
          Review
        </button>
      </div>
    </div>
    {#if profileBook && profileBook.rating !== null}
      <p class="text-center dark:text-white">Your rating is {profileBook.rating}/10</p>
    {:else if profileBook && profileBook.rating === null && (profileBook.status === E_BookStatus.READ.text || profileBook.status === E_BookStatus.DID_NOT_FINISH.text)}
      <div class="flex flex-col gap-4 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
        <div class="flex flex-col gap-2">
          <p class="dark:text-white">Rating</p>
          <div class="flex flex-col gap-4 items-center bg-neutral-200 dark:bg-neutral-800 p-4 rounded-lg">
            <p class="flex justify-center items-center w-16 h-16 rounded-full dark:text-white"><span class={`st-font-bold text-2xl`}>{rating}</span>/10</p>
            <Counter bind:value={rating} />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label for="review" class="dark:text-white">Review</label>
          <textarea
            rows="5"
            maxlength="4000"
            class={`p-2 box-border w-full rounded-lg dark:bg-neutral-800 dark:text-white`}
            placeholder="Write a review (maximum 4000 characters)"
            value={review}
          />
        </div>
        <button
          class="rounded px-4 py-2 bg-blue-500 text-white st-font-bold disabled:opacity-50"
          on:click={async () => await handleAddEditRatingReview()}
        >
          Submit
        </button>
      </div>
    {:else}
      <p class="text-center dark:text-white">Mark this book as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DID_NOT_FINISH.text}</span> before rating</p>
    {/if}
  {:else}
    <p class="dark:text-white text-center"><a href='/sign-in' class="text-blue-500">Sign in</a> to start managing your books</p>
  {/if}
</div>