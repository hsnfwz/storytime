<script lang="ts">
  // svelte
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords, increment, incrementAndDecrement } from 'src/api/database';

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
  export let userBookEdition: any;
  export let bookEdition: any;

  // state
  let isLoading: boolean = false;
  let rating: number = userBookEdition ? userBookEdition.user_book_edition_rating ? userBookEdition.user_book_edition_rating.rating : 5 : 5;

  onMount(() => {
    // grab records for timeline
  });

  const handleAddNewRating = async () => {
    const userBookEditionRatingData: any = {
      user_id: session.user.id,
      book_edition_id: bookEdition.id,
      rating,
    };

    const newUserBookEditionRatingRecords = await insertRecords('user_book_edition_rating', [userBookEditionRatingData], '*');

    const updatedUserBookEditionData: any = {
      latest_user_book_edition_rating_id: newUserBookEditionRatingRecords[0].id,
    };

    const [
      latestUserBookEditionRecords,
      latestUserProfileRecords,
      latestBookEditionRecords,
      latestBookRecords,
    ] = await Promise.all([
      updateRecords('user_book_edition', updatedUserBookEditionData, { id: userBookEdition.id }, 'id'),
      incrementAndDecrement('user_profile', userProfile.id, `book_edition_rating_${rating}_count`, 1, `book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`, 1),
      incrementAndDecrement('book_edition', bookEdition.id, `rating_${rating}_count`, 1, `rating_${userBookEdition.user_book_edition_rating.rating}_count`, 1),
      incrementAndDecrement('book', bookEdition.book.id, `total_book_edition_rating_${rating}_count`, 1, `total_book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`, 1),
    ]);
    userProfile[`book_edition_rating_${rating}_count`] = latestUserProfileRecords[0].increment_column_value;
    userProfile[`book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`] = latestUserProfileRecords[0].decrement_column_value;
    
    bookEdition[`rating_${rating}_count`] = latestBookEditionRecords[0].increment_column_value;
    bookEdition[`rating_${userBookEdition.user_book_edition_rating.rating}_count`] = latestBookEditionRecords[0].decrement_column_value;
    
    bookEdition.book[`total_book_edition_rating_${rating}_count`] = latestBookRecords[0].increment_column_value;
    bookEdition.book[`total_book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`] = latestBookRecords[0].decremented_column_value;
    
    userBookEdition.latest_user_book_edition_rating_id = newUserBookEditionRatingRecords[0].id,
    userBookEdition.user_book_edition_rating = newUserBookEditionRatingRecords[0];
  }

  const handleRating = async () => {
    isLoading = true;

    if (userBookEdition && userBookEdition.user_book_edition_rating) {
      const updatedUserBookEditionRatingData: any = {
        updated_at: new Date(),
        rating,
      }

      const [
        latestUserBookEditionRatingRecords,
        latestUserProfileRecords,
        latestBookEditionRecords,
        latestBookRecords,
      ] = await Promise.all([
        updateRecords('user_book_edition_rating', updatedUserBookEditionRatingData, { id: userBookEdition.latest_user_book_edition_rating_id }, `*`),
        incrementAndDecrement('user_profile', userProfile.id, `book_edition_rating_${rating}_count`, 1, `book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`, 1),
        incrementAndDecrement('book_edition', bookEdition.id, `rating_${rating}_count`, 1, `rating_${userBookEdition.user_book_edition_rating.rating}_count`, 1),
        incrementAndDecrement('book', bookEdition.book.id, `total_book_edition_rating_${rating}_count`, 1, `total_book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`, 1),
      ]);

      userProfile[`book_edition_rating_${rating}_count`] = latestUserProfileRecords[0].increment_column_value;
      userProfile[`book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`] = latestUserProfileRecords[0].decrement_column_value;
      
      bookEdition[`rating_${rating}_count`] = latestBookEditionRecords[0].increment_column_value;
      bookEdition[`rating_${userBookEdition.user_book_edition_rating.rating}_count`] = latestBookEditionRecords[0].decrement_column_value;
      
      bookEdition.book[`total_book_edition_rating_${rating}_count`] = latestBookRecords[0].increment_column_value;
      bookEdition.book[`total_book_edition_rating_${userBookEdition.user_book_edition_rating.rating}_count`] = latestBookRecords[0].decremented_column_value;

      userBookEdition.user_book_edition_rating = latestUserBookEditionRatingRecords[0];
    } else if (userBookEdition && !userBookEdition.user_book_edition_rating) {
      const userBookEditionRatingData: any = {
        user_id: session.user.id,
        book_edition_id: bookEdition.id,
        rating,
      };

      const newUserBookEditionRatingRecords = await insertRecords('user_book_edition_rating', [userBookEditionRatingData], '*');

      const updatedUserBookEditionData: any = {
        latest_user_book_edition_rating_id: newUserBookEditionRatingRecords[0].id,
      };

      const [
        latestUserBookEditionRecords,
        latestUserProfileRecords,
        latestBookEditionRecords,
        latestBookRecords,
      ] = await Promise.all([
        updateRecords('user_book_edition', updatedUserBookEditionData, { id: userBookEdition.id }, 'id'),
        increment('user_profile', userProfile.id, `book_edition_rating_${rating}_count`, 1),
        increment('book_edition', bookEdition.id, `rating_${rating}_count`, 1),
        increment('book', bookEdition.book.id, 'total_book_edition_rating_count', 1),
      ]);
      userProfile.book_edition_rating_count = latestUserProfileRecords[0].increment_column_value;
      
      bookEdition[`rating_${rating}_count`] = latestBookEditionRecords[0].increment_column_value;
      
      bookEdition.book.total_book_edition_rating_count = latestBookRecords[0].increment_column_value;

      userBookEdition.latest_user_book_edition_rating_id = newUserBookEditionRatingRecords[0].id,
      userBookEdition.user_book_edition_rating = newUserBookEditionRatingRecords[0];
    }

    rating = userBookEdition.user_book_edition_rating.rating;

    isLoading = false;
  }
</script>

{#if session}
  {#if userBookEdition && userBookEdition.user_book_edition_rating}
    <SuccessCard>
      <div class="flex flex-col gap-2 w-full">
        <p class="dark:text-white w-full">You rated this bookEdition <span class="st-font-italic">{userBookEdition.user_book_edition_rating.rating}/10</span></p>
        <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_edition_rating.updated_at, true)}</p>
      </div>
    </SuccessCard>
  {:else if userBookEdition && !userBookEdition.user_book_edition_rating && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)}
    <InfoCard>
      <p class="dark:text-white w-full">You can rate this bookEdition</p>
    </InfoCard>
  {:else if (userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text)) || !userBookEdition}
    <InfoCard>
      <p class="dark:text-white w-full">You can start rating this bookEdition after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
    </InfoCard>
  {/if}
  {#if userBookEdition && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)}
    <div class="w-full flex flex-col gap-2 items-center">
      <p class="dark:text-white text-center text-lg st-font-bold ">{rating}</p>
      <p class="dark:text-white text-center st-font-italic">{E_Rating[rating].label}</p>
      <Slider bind:value={rating} />
    </div>
    <div class="w-full flex flex-col gap-2 items-center">
      <Button
        label={userBookEdition.user_book_edition_rating ? 'Update Current Rating' : 'Add Rating'}
        handleClick={async () => await handleRating()}
        isDisabled={
          isLoading ||
          (userBookEdition.user_book_edition_rating && userBookEdition.user_book_edition_rating.rating === rating)
        }
      />
      {#if userBookEdition && userBookEdition.user_book_edition_rating}
        <Button
          label="Add New Rating"
          handleClick={async () => await handleAddNewRating()}
          isDisabled={
            isLoading ||
            (userBookEdition.user_book_edition_rating && userBookEdition.user_book_edition_rating.rating === rating)
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