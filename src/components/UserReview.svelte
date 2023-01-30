<script lang="ts">
  // svelte
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords } from 'src/api/database';

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

  const handleReview = async () => {
    isLoading = true;

    if (userBook && userBook.user_book_review) {
      // ... edit
    } else if (userBook && !userBook.user_book_review) {
      // review instance
      const reviewInstanceData: any = {
        user_id: session.user.id,
        book_id: book.id,
        review,
      };

      const newReviewInstanceRecords = await insertRecords('user_book_review', [reviewInstanceData]);

      // profile book
      const updatedUserBookData: any = {
        latest_user_book_review_id: newReviewInstanceRecords[0].id,
      };

      // profile
      const updatedProfileData: any = {
        book_review_count: userProfile.book_review_count + 1,
      };

      // book
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
      <p class="dark:text-white w-full">You reviewed this book</p>
    </SuccessCard>
  {:else if userBook && !userBook.user_book_review && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
    <InfoCard>
      <p class="dark:text-white w-full">You can review this book</p>
    </InfoCard>
  {:else if ((userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text)) || !userBook)}
    <InfoCard>
      <p class="dark:text-white">You can start reviewing this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
    </InfoCard>
  {/if}
  {#if userBook && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
    <div class="w-full flex flex-col gap-2">
      <TextareaInput
        placeholder="Review (max. 4000 characters)"
        maxLength={4000}
        bind:value={review}
      />
      <Button
        label={userBook.user_book_review ? 'Update Review' : 'Add Review'}
        handleClick={async () => await handleReview()}
        isDisabled={
          isLoading ||
          (userBook.user_book_review && userBook.user_book_review.review === review) ||
          (!userBook.user_book_review && !review)
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