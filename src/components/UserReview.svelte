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

  // components
  import Heading from 'src/components/Heading.svelte';
  import Button from 'src/components/Button.svelte';
  import InfoCard from 'src/components/InfoCard.svelte';
  import Link from 'src/components/Link.svelte';
  import SuccessCard from 'src/components/SuccessCard.svelte';
  import TextareaInput from 'src/components/TextareaInput.svelte';

  // data
  const session: any = $page.data.session;

  // props
  export let userProfile: any;
  export let userBook: any;
  export let book: any;

  // state
  let isLoading: boolean = false;
  let review: string = userBook ? userBook.user_book_review ? userBook.user_book_review.review : '' : '';

  onMount(() => {
    // grab records for timeline
  });

  const handleAddNewReview = async () => {
    const reviewInstanceData: any = {
      user_id: session.user.id,
      book_id: book.id,
      review,
    };

    const newReviewInstanceRecords = await insertRecords('user_book_review', [reviewInstanceData]);

    const updatedUserBookData: any = {
      latest_user_book_review_id: newReviewInstanceRecords[0].id,
    };

    const [
      latestUserBookRecords,
    ] = await Promise.all([
      updateRecords('user_book', updatedUserBookData, { id: userBook.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
    ]);

    userBook = latestUserBookRecords[0];
  }

  const handleReview = async () => {
    isLoading = true;

    if (userBook && userBook.user_book_review) {
      const updatedReviewData: any = {
        updated_at: new Date(),
        review,
      }

      const [
        latestUserBookReviewRecords,
      ] = await Promise.all([
        updateRecords('user_book_review', updatedReviewData, { id: userBook.latest_user_book_review_id }, `*`),
      ]);

      userBook.user_book_review = latestUserBookReviewRecords[0];
    } else if (userBook && !userBook.user_book_review) {
      const reviewInstanceData: any = {
        user_id: session.user.id,
        book_id: book.id,
        review,
      };

      const newReviewInstanceRecords = await insertRecords('user_book_review', [reviewInstanceData]);

      const updatedUserBookData: any = {
        latest_user_book_review_id: newReviewInstanceRecords[0].id,
      };

      const updatedProfileData: any = {
        book_review_count: userProfile.book_review_count + 1,
      };

      const updatedBookData: any = {
        review_count: book.review_count + 1,
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

    review = userBook.user_book_review.review;

    isLoading = false;
  }
</script>

{#if session}
  {#if userBook && userBook.user_book_review}
    <SuccessCard>
      <div class="flex flex-col gap-2 w-full">
        <p class="dark:text-white w-full">You reviewed this book</p>
        <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBook.user_book_review.updated_at, true)}</p>
      </div>
    </SuccessCard>
  {:else if userBook && !userBook.user_book_review && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
    <InfoCard>
      <p class="dark:text-white w-full">You can review this book</p>
    </InfoCard>
  {:else if ((userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text)) || !userBook)}
    <InfoCard>
      <p class="dark:text-white w-full">You can start reviewing this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
    </InfoCard>
  {/if}
  {#if userBook && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
    <div class="w-full flex flex-col gap-2">
      <TextareaInput
        placeholder="Review (max. 4000 characters)"
        maxLength={4000}
        bind:value={review}
      />
    </div>
    <div class="w-full flex flex-col gap-2 items-center">
      <Button
        label={userBook.user_book_review ? 'Update Current Review' : 'Add Review'}
        handleClick={async () => await handleReview()}
        isDisabled={
          isLoading ||
          (userBook.user_book_review && userBook.user_book_review.review === review) ||
          (!userBook.user_book_review && !review)
        }
      />
      {#if userBook && userBook.user_book_review}
        <Button
          label="Add New Review"
          handleClick={async () => await handleAddNewReview()}
          isDisabled={
            isLoading ||
            (userBook.user_book_review && userBook.user_book_review.review === review)
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