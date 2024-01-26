<script lang="ts">
  // svelte
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords, increment } from 'src/api/database';

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
  export let bookEdition: any;
  export let userBookEdition: any;

  // state
  let isLoading: boolean = false;
  let review: string = userBookEdition ? userBookEdition.user_book_edition_review ? userBookEdition.user_book_edition_review.review : '' : '';

  onMount(() => {
    // grab records for timeline
  });

  const handleAddNewReview = async () => {
    const userBookEditionReviewData: any = {
      user_id: session.user.id,
      book_edition_id: bookEdition.id,
      review,
    };

    const newUserBookEditionReviewRecords = await insertRecords('user_book_edition_review', [userBookEditionReviewData], '*');

    const updatedUserBookEditionData: any = {
      latest_user_book_edition_review_id: newUserBookEditionReviewRecords[0].id,
    };

    const latestUserBookEditionRecords = await updateRecords('user_book_edition', updatedUserBookEditionData, { id: userBookEdition.id }, `id`);

    userBookEdition.latest_user_book_edition_review_id = newUserBookEditionReviewRecords[0].id;
    userBookEdition.user_book_edition_review = newUserBookEditionReviewRecords[0];
  }

  const handleReview = async () => {
    isLoading = true;

    if (userBookEdition && userBookEdition.user_book_edition_review) {
      const updatedUserBookEditionReviewData: any = {
        updated_at: new Date(),
        review,
      }

      const latestUserBookEditionReviewRecords = await updateRecords('user_book_edition_review', updatedUserBookEditionReviewData, { id: userBookEdition.latest_user_book_edition_review_id }, `*`);

      userBookEdition.user_book_edition_review = latestUserBookEditionReviewRecords[0];
    } else if (userBookEdition && !userBookEdition.user_book_edition_review) {
      const userBookEditionReviewData: any = {
        user_id: session.user.id,
        book_edition_id: bookEdition.id,
        review,
      };

      const newUserBookEditionReviewRecords = await insertRecords('user_book_edition_review', [userBookEditionReviewData], '*');

      const updatedUserBookEditionData: any = {
        latest_user_book_edition_review_id: newUserBookEditionReviewRecords[0].id,
      };

      const [
        latestUserBookEditionRecords,
        latestUserProfileRecords,
        latestBookEditionRecords,
        latestBookRecords,
      ] = await Promise.all([
        updateRecords('user_book_edition', updatedUserBookEditionData, { id: userBookEdition.id }, 'id'),
        increment('user_profile', userProfile.id, 'book_edition_review_count', 1),
        increment('book_edition', bookEdition.id, 'review_count', 1),
        increment('book', bookEdition.book.id, 'total_book_edition_review_count', 1),
      ]);
      
      userProfile.book_edition_review_count = latestUserProfileRecords[0].increment_column_value;
      
      bookEdition.review_count = latestBookEditionRecords[0].increment_column_value;
      
      bookEdition.book.total_book_edition_review_count = latestBookRecords[0].increment_column_value;

      userBookEdition.latest_user_book_edition_review_id = newUserBookEditionReviewRecords[0].id,
      userBookEdition.user_book_edition_review = newUserBookEditionReviewRecords[0];
    }

    review = userBookEdition.user_book_edition_review.review;

    isLoading = false;
  }
</script>

{#if session}
  {#if userBookEdition && userBookEdition.user_book_edition_review}
    <SuccessCard>
      <div class="flex flex-col gap-2 w-full">
        <p class="dark:text-white w-full">You reviewed this book</p>
        <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_edition_review.updated_at, true)}</p>
      </div>
    </SuccessCard>
  {:else if userBookEdition && !userBookEdition.user_book_edition_review && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)}
    <InfoCard>
      <p class="dark:text-white w-full">You can review this book</p>
    </InfoCard>
  {:else if ((userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text)) || !userBookEdition)}
    <InfoCard>
      <p class="dark:text-white w-full">You can start reviewing this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
    </InfoCard>
  {/if}
  {#if userBookEdition && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)}
    <div class="w-full flex flex-col gap-2">
      <TextareaInput
        placeholder="Review (max. 4000 characters)"
        maxLength={4000}
        bind:value={review}
      />
    </div>
    <div class="w-full flex flex-col gap-2 items-center">
      <Button
        label={userBookEdition.user_book_edition_review ? 'Update Current Review' : 'Add Review'}
        handleClick={async () => await handleReview()}
        isDisabled={
          isLoading ||
          (userBookEdition.user_book_edition_review && userBookEdition.user_book_edition_review.review === review) ||
          (!userBookEdition.user_book_edition_review && !review)
        }
      />
      {#if userBookEdition && userBookEdition.user_book_edition_review}
        <Button
          label="Add New Review"
          handleClick={async () => await handleAddNewReview()}
          isDisabled={
            isLoading ||
            (userBookEdition.user_book_edition_review && userBookEdition.user_book_edition_review.review === review)
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