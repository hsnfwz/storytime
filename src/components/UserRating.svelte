<script lang="ts">
  // svelte
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords } from 'src/api/database';

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

  const handleRating = async () => {
    isLoading = true;

    if (userBook && userBook.user_book_rating) {
      // ... edit
    } else if (userBook && !userBook.user_book_rating) {
      const ratingInstanceData: any = {
        user_id: session.user.id,
        book_id: book.id,
        rating,
      };

      const newRatingInstanceRecords = await insertRecords('user_book_rating', [ratingInstanceData]);

      // profile book
      const updatedUserBookData: any = {
        latest_user_book_rating_id: newRatingInstanceRecords[0].id,
      };

      // profile
      const updatedProfileData: any = {
        [`book_rating_${rating}_count`]: userProfile[`book_rating_${rating}_count`] + 1,
      };

      // book
      const updatedBookData: any = {
        [`rating_${rating}_count`]: book[`rating_${rating}_count`] + 1,
      };

      const [
        latestuserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book', updatedUserBookData, { id: userBook.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = latestuserBookRecords[0];
    }

    rating = userBook.user_book_rating.rating;

    isLoading = false;
  }
</script>

{#if session}
  {#if userBook && userBook.user_book_rating}
    <SuccessCard>
      <p class="dark:text-white w-full">You rated this book <span class="st-font-italic">{userBook.user_book_rating.rating}/10</span></p>
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
      <Button
        label={userBook.user_book_rating ? 'Update Rating' : 'Add Rating'}
        handleClick={async () => await handleRating()}
        isDisabled={
          isLoading ||
          (userBook.user_book_rating && userBook.user_book_rating.rating === rating)
        }
      />
    </div>
  {/if}
{:else}
  <Heading label="Sign In" />
  <InfoCard>
    <p><Link link="/sign-in" label="Sign in" /> to start managing your books</p>
  </InfoCard>
{/if}