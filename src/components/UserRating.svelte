<script lang="ts">
  // svelte
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords } from 'src/api/database';

  // helpers
  import { formatDate } from 'src/helpers/helpers';

  // enums
  import E_BookStatus from 'src/enums/E_BookStatus';
  import E_Rating from 'src/enums/E_Rating';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Button from 'src/components/Button.svelte';
  import InfoCard from 'src/components/InfoCard.svelte';
  import Link from 'src/components/Link.svelte';
  import SuccessCard from 'src/components/SuccessCard.svelte';
  import Slider from 'src/components/Slider.svelte';

  // data
  const session: any = $page.data.session;

  // props
  export let userProfile: any;
  export let userBook: any;
  export let book: any;

  // state
  let isLoading: boolean = false;
  let rating: number = userBook ? userBook.user_book_rating ? userBook.user_book_rating.rating : 5 : 5;

  onMount(() => {
    // grab records for timeline
  });

  const handleAddNewRating = async () => {
    const ratingInstanceData: any = {
      user_id: session.user.id,
      book_id: book.id,
      rating,
    };

    const newRatingInstanceRecords = await insertRecords('user_book_rating', [ratingInstanceData]);

    const updatedUserBookData: any = {
      latest_user_book_rating_id: newRatingInstanceRecords[0].id,
    };

    const updatedProfileData: any = {
      [`book_rating_${userBook.user_book_rating.rating}_count`]: userProfile[`book_rating_${userBook.user_book_rating.rating}_count`] - 1,
      [`book_rating_${rating}_count`]: userProfile[`book_rating_${rating}_count`] + 1,
    };

    const updatedBookData: any = {
      [`rating_${userBook.user_book_rating.rating}_count`]: book[`rating_${userBook.user_book_rating.rating}_count`] - 1,
      [`rating_${rating}_count`]: book[`rating_${rating}_count`] + 1,
    };;

    const [
      latestUserBookRecords,
      latestProfileRecords,
      latestBookRecords
    ] = await Promise.all([
      updateRecords('user_book', updatedUserBookData, { id: userBook.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
      updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
      updateRecords('book', updatedBookData, { id: book.id }),
    ]);

    book = latestBookRecords[0];
    userProfile = latestProfileRecords[0];
    userBook = latestUserBookRecords[0];
  }

  const handleRating = async () => {
    isLoading = true;

    if (userBook && userBook.user_book_rating) {
      const updatedRatingData: any = {
        updated_at: new Date(),
        rating,
      }

      const updatedProfileData: any = {
        [`book_rating_${userBook.user_book_rating.rating}_count`]: userProfile[`book_rating_${userBook.user_book_rating.rating}_count`] - 1,
        [`book_rating_${rating}_count`]: userProfile[`book_rating_${rating}_count`] + 1,
      };

      const updatedBookData: any = {
        [`rating_${userBook.user_book_rating.rating}_count`]: book[`rating_${userBook.user_book_rating.rating}_count`] - 1,
        [`rating_${rating}_count`]: book[`rating_${rating}_count`] + 1,
      };

      const [
        latestUserBookRatingRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book_rating', updatedRatingData, { id: userBook.latest_user_book_rating_id }, `*`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook.user_book_rating = latestUserBookRatingRecords[0];
    } else if (userBook && !userBook.user_book_rating) {
      const ratingInstanceData: any = {
        user_id: session.user.id,
        book_id: book.id,
        rating,
      };

      const newRatingInstanceRecords = await insertRecords('user_book_rating', [ratingInstanceData]);

      const updatedUserBookData: any = {
        latest_user_book_rating_id: newRatingInstanceRecords[0].id,
      };

      const updatedProfileData: any = {
        [`book_rating_${rating}_count`]: userProfile[`book_rating_${rating}_count`] + 1,
      };

      const updatedBookData: any = {
        [`rating_${rating}_count`]: book[`rating_${rating}_count`] + 1,
      };

      const [
        latestUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book', updatedUserBookData, { id: userBook.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = latestUserBookRecords[0];
    }

    rating = userBook.user_book_rating.rating;

    isLoading = false;
  }
</script>

{#if session}
  {#if userBook && userBook.user_book_rating}
    <SuccessCard>
      <div class="flex flex-col gap-2 w-full">
        <p class="dark:text-white w-full">You rated this book <span class="st-font-italic">{userBook.user_book_rating.rating}/10</span></p>
        <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBook.user_book_rating.updated_at, true)}</p>
      </div>
    </SuccessCard>
  {:else if userBook && !userBook.user_book_rating && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
    <InfoCard>
      <p class="dark:text-white w-full">You can rate this book</p>
    </InfoCard>
  {:else if (userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text)) || !userBook}
    <InfoCard>
      <p class="dark:text-white">You can start rating this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
    </InfoCard>
  {/if}
  {#if userBook && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
    <div class="w-full flex flex-col gap-2 items-center">
      <p class="dark:text-white text-center text-lg st-font-bold ">{rating}</p>
      <p class="dark:text-white text-center st-font-italic">{E_Rating[rating].label}</p>
      <Slider bind:value={rating} />
    </div>
    <div class="w-full flex flex-col gap-2 items-center">
      <Button
        label={userBook.user_book_rating ? 'Update Current Rating' : 'Add Rating'}
        handleClick={async () => await handleRating()}
        isDisabled={
          isLoading ||
          (userBook.user_book_rating && userBook.user_book_rating.rating === rating)
        }
      />
      {#if userBook && userBook.user_book_rating}
        <Button
          label="Add New Rating"
          handleClick={async () => await handleAddNewRating()}
          isDisabled={
            isLoading ||
            (userBook.user_book_rating && userBook.user_book_rating.rating === rating)
          }
        />
      {/if}
    </div>
  {/if}
{:else}
  <Heading label="Sign In" />
  <InfoCard>
    <p><Link link="/sign-in" label="Sign in" /> to start managing your books</p>
  </InfoCard>
{/if}