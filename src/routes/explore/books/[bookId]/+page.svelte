<script lang="ts">
  // api
  import { deleteRecords, updateRecords } from 'src/api/database';

  // enums
  import E_BookStatus from 'src/enums/E_BookStatus';

  // components
  import ItemCard from 'src/components/ItemCard.svelte';
  import Card from 'src/components/Card.svelte';
  import Button from 'src/components/Button.svelte';
  import InfoCard from 'src/components/InfoCard.svelte';
  import Link from 'src/components/Link.svelte';
  import Heading from 'src/components/Heading.svelte';
  import UserStatus from 'src/components/UserStatus.svelte';
  import UserRating from 'src/components/UserRating.svelte';
  import UserReview from 'src/components/UserReview.svelte';
  import SuccessCard from 'src/components/SuccessCard.svelte';
  import ArrowDownButton from 'src/components/ArrowDownButton.svelte';
  import TextInput from 'src/components/TextInput.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';
  import WarningCard from 'src/components/WarningCard.svelte';
  import ArrowUpButton from 'src/components/ArrowUpButton.svelte';
  import UserTags from 'src/components/UserTags.svelte';

  // helpers
  import { formatDate, getItemRatingsAverage, getItemTotalRatings, getDateDifference } from 'src/helpers/helpers';

  // data
  export let data: any;

  let session: any = data.session;
  let userProfile: any = data.userProfile;
  let userBook: any = data.userBook;
  let book: any = data.book;
  let userBookTags: any = data.userBookTags;
  let userBookTagBooks: any = data.userBookTagBooks;

  // state
  let isLoading: boolean = false;

  const dateDifference = getDateDifference(book.release_date);

  let showUserStatus: boolean = false;
  let showUserTags: boolean = false;
  let showUserRating: boolean = false;
  let showUserReview: boolean = false;
  let showDeleteUserBook: boolean = false;

  let deleteConfirmation: string = '';

  const handleDeleteUserBook = async () => {
    isLoading = true;

    const userBookStatus: string = userBook.user_book_status.status;

    let profileCountAttribute: string = '';
    let profileCountValue: number = 0;

    let bookCountAttribute: string = '';
    let bookCountValue: number = 0;

    if (userBookStatus === E_BookStatus.TRACKING.text) {
      profileCountAttribute = 'book_status_tracking_count';
      profileCountValue = userProfile.book_status_tracking_count - 1;
      bookCountAttribute = 'status_tracking_count';
      bookCountValue = book.status_tracking_count - 1;
    } else if (userBookStatus === E_BookStatus.READING.text) {
      profileCountAttribute = 'book_status_reading_count';
      profileCountValue = userProfile.book_status_reading_count - 1;
      bookCountAttribute = 'status_reading_count';
      bookCountValue = book.status_reading_count - 1;
    } else if (userBookStatus === E_BookStatus.TO_READ.text) {
      profileCountAttribute = 'book_status_to_read_count';
      profileCountValue = userProfile.book_status_to_read_count - 1;
      bookCountAttribute = 'status_to_read_count';
      bookCountValue = book.status_to_read_count - 1;
    } else if (userBookStatus === E_BookStatus.READ.text) {
      profileCountAttribute = 'book_status_read_count';
      profileCountValue = userProfile.book_status_read_count - 1;
      bookCountAttribute = 'status_read_count';
      bookCountValue = book.status_read_count - 1;
    } else if (userBookStatus === E_BookStatus.DNF.text) {
      profileCountAttribute = 'book_status_dnf_count';
      profileCountValue = userProfile.book_status_dnf_count - 1;
      bookCountAttribute = 'status_dnf_count';
      bookCountValue = book.status_dnf_count - 1;
    }

    const hasRead = userBook.read_count > 0;
    const hasRated = userBook.user_book_rating;
    const hasReviewed = userBook.user_book_review;

    const updatedProfileData = {
      [profileCountAttribute]: profileCountValue,
    };

    const updatedBookData = {
      [bookCountAttribute]: bookCountValue,
    };

    if (hasRead) {
      updatedProfileData['book_unique_read_count'] = userProfile.book_unique_read_count - 1;
      updatedBookData['unique_read_count'] = book.unique_read_count - 1;
      updatedBookData['read_count'] = book.read_count - userBook.read_count;
    }

    if (hasRated) {
      updatedProfileData[`book_rating_${userBook.user_book_rating.rating}_count`] = userProfile[`book_rating_${userBook.user_book_rating.rating}_count`] - 1;
      updatedBookData[`rating_${userBook.user_book_rating.rating}_count`] = book[`rating_${userBook.user_book_rating.rating}_count`] - 1;
    }

    if (hasReviewed) {
      updatedProfileData['book_review_count'] = userProfile.book_review_count - 1;
      updatedBookData['review_count'] = book.review_count - 1;
    }

    await deleteRecords('user_book', { id: userBook.id });
    await Promise.all([
      deleteRecords('user_book_read', { user_id: session.user.id, book_id: book.id }),
      deleteRecords('user_book_status', { user_id: session.user.id, book_id: book.id }),
      deleteRecords('user_book_rating', { user_id: session.user.id, book_id: book.id }),
      deleteRecords('user_book_review', { user_id: session.user.id, book_id: book.id }),
    ]);
    const [
      updatedProfileRecords,
      updatedBookRecords,
    ] = await Promise.all([
      updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
      updateRecords('book', updatedBookData, { id: book.id }),
    ]);

    userProfile = updatedProfileRecords[0];
    book = updatedBookRecords[0];
    userBook = undefined;

    deleteConfirmation = '';

    isLoading = false;
  }
</script>

<div class="flex flex-col items-center sm:flex-row sm:justify-center sm:items-start gap-4">
  <div class="w-full sm:max-w-[200px] flex flex-col gap-4">
    <ItemCard item={book} />
    <HorizontalDivider />
    <Card>
      <Heading label="Links" />
      <div class="flex flex-col gap-2">
        <Link link="/" label="Purchase" />
        <Link link="/" label="Community" />
        <Link link="/" label="Statistics" />
      </div>
    </Card>
  </div>
  <div class="w-full flex flex-col items-center gap-4 sm:max-w-[800px]">
    <Card>
      <Heading label={book.title} />
      <div class="w-full flex flex-col gap-2">
        {#if dateDifference?.differenceDays < 0}
          <p class="w-full dark:text-white">
            Expected Publication {formatDate(book.release_date)} ({dateDifference.differenceDaysAbs === 1 ? `${dateDifference.differenceDaysAbs} day` : `${dateDifference.differenceDaysAbs} days`})
          </p>
        {:else}
          <p class="w-full dark:text-white">
            Published {formatDate(book.release_date)}
          </p>
        {/if}
        {#if getItemTotalRatings(book) !== 0}
          <p class="w-full dark:text-white">{getItemRatingsAverage(book)} / 10</p>
        {/if}
      </div>
      <div class="w-full flex flex-col gap-2">
        <p class="w-full dark:text-white">{getItemTotalRatings(book) === 1 ? `${getItemTotalRatings(book)} rating`: `${getItemTotalRatings(book)} ratings`}</p>
        <p class="w-full dark:text-white">{book.review_count ===  1 ? `${book.review_count} review` : `${book.review_count} reviews`}</p>
        <p class="w-full dark:text-white">{book.book_tag_count ===  1 ? `${book.book_tag_count} tag` : `${book.book_tag_count} tags`}</p>
        <p class="w-full dark:text-white">{book.status_tracking_count} tracking</p>
        <p class="w-full dark:text-white">{book.status_to_read_count} to read</p>
        <p class="w-full dark:text-white">{book.status_reading_count} reading</p>
        <p class="w-full dark:text-white">{book.status_read_count} read</p>
        <p class="w-full dark:text-white">{book.status_dnf_count} dnf</p>
        <p class="w-full dark:text-white">{book.unique_read_count === 1 ? `${book.unique_read_count} unique read` : `${book.unique_read_count} unique reads`}</p>
        <p class="w-full dark:text-white">{book.read_count === 1 ? `${book.read_count} total read` : `${book.read_count} total reads`}</p>
      </div>
    </Card>
    <HorizontalDivider />
    {#if session}
      <Card>
        <div class="w-full flex justify-between gap-2">
          <Heading label="Your Status" />
          {#if showUserStatus}
            <ArrowUpButton handleClick={() => showUserStatus = false} />
          {:else}
            <ArrowDownButton handleClick={() => showUserStatus = true} />
          {/if}
        </div>
        {#if !showUserStatus && userBook}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You marked this book as <span class="st-font-italic">{userBook.user_book_status.status}</span></p>
              <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBook.user_book_status.updated_at, true)}</p>
            </div>
          </SuccessCard>
        {:else if !showUserStatus && !userBook}
          <InfoCard>
            <p class="dark:text-white w-full">You can mark a status for this book</p>
          </InfoCard>
        {/if}
        {#if showUserStatus}
          <UserStatus
            bind:userProfile
            bind:userBook
            bind:book
          />
        {/if}
      </Card>
      <Card>
        <div class="w-full flex justify-between gap-2">
          <Heading label="Your Tags" />
          {#if showUserTags}
            <ArrowUpButton
              handleClick={() => showUserTags = false}
              isDisabled={!userBook}
            />
          {:else}
            <ArrowDownButton
              handleClick={() => showUserTags = true}
              isDisabled={!userBook}
            />
          {/if}
        </div>
        {#if !showUserTags && userBook && userBookTagBooks.length > 0}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You tagged this book {userBookTagBooks.length} {userBookTagBooks.length === 1 ? 'time' : 'times'}</p>
              <!-- <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBook.user_book_rating.updated_at, true)}</p> -->
            </div>
          </SuccessCard>
        {:else if !showUserTags && userBook && userBookTagBooks.length === 0}
          <InfoCard>
            <p class="dark:text-white w-full">You can tag this book</p>
          </InfoCard>
        {:else if !showUserTags && !userBook}
          <InfoCard>
            <p class="dark:text-white w-full">You can start tagging this book after marking a status</p>
          </InfoCard>
        {/if}
        {#if showUserTags}
          <UserTags
            bind:userProfile
            bind:userBook
            bind:book
            bind:userBookTags
            bind:userBookTagBooks
          />
        {/if}
      </Card>
      <Card>
        <div class="w-full flex justify-between gap-2">
          <Heading label="Your Rating" />
          {#if showUserRating}
            <ArrowUpButton
              handleClick={() => showUserRating = false}
              isDisabled={!userBook || (userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text))}
            />
          {:else}
            <ArrowDownButton
              handleClick={() => showUserRating = true}
              isDisabled={!userBook || (userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text))}
            />
          {/if}
        </div>
        {#if !showUserRating && userBook && userBook.user_book_rating}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You rated this book <span class="st-font-italic">{userBook.user_book_rating.rating}/10</span></p>
              <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBook.user_book_rating.updated_at, true)}</p>
            </div>
          </SuccessCard>
        {:else if !showUserRating && userBook && !userBook.user_book_rating && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
          <InfoCard>
            <p class="dark:text-white w-full">You can rate this book</p>
          </InfoCard>
        {:else if !showUserRating && ((userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text)) || !userBook)}
          <InfoCard>
            <p class="dark:text-white w-full">You can start rating this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
          </InfoCard>
        {/if}
        {#if showUserRating}
          <UserRating
            bind:userProfile
            bind:userBook
            bind:book
          />
        {/if}
      </Card>
      <Card>
        <div class="w-full flex justify-between gap-2">
          <Heading label="Your Review" />
          {#if showUserReview}
            <ArrowUpButton
              handleClick={() => showUserReview = false}
              isDisabled={!userBook || (userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text))}
            />
          {:else}
            <ArrowDownButton
              handleClick={() => showUserReview = true}
              isDisabled={!userBook || (userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text))}
            />
          {/if}
        </div>
        {#if !showUserReview && userBook && userBook.user_book_review}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You reviewed this book</p>
              <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBook.user_book_review.updated_at, true)}</p>
            </div>
          </SuccessCard>
        {:else if !showUserReview && userBook && !userBook.user_book_review && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
          <InfoCard>
            <p class="dark:text-white w-full">You can review this book</p>
          </InfoCard>
        {:else if !showUserReview && ((userBook && (userBook.user_book_status.status !== E_BookStatus.READ.text && userBook.user_book_status.status !== E_BookStatus.DNF.text)) || !userBook)}
          <InfoCard>
            <p class="dark:text-white w-full">You can start reviewing this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
          </InfoCard>
        {/if}
        {#if showUserReview}
          <UserReview
            bind:userProfile
            bind:userBook
            bind:book
          />
        {/if}
      </Card>
      {#if userBook}
        <HorizontalDivider />
        <Card>
          <div class="w-full flex justify-between gap-2">
            <Heading label="Delete Book" />
            {#if showDeleteUserBook}
              <ArrowUpButton handleClick={() => showDeleteUserBook = false} />
            {:else}
              <ArrowDownButton handleClick={() => showDeleteUserBook = true} />
            {/if}
          </div>
          {#if showDeleteUserBook}
            <WarningCard>
              <p class="dark:text-white">This action cannot be undone. This will permanently delete your book and all associated statuses, ratings, reviews, reads, and tags.</p>
            </WarningCard>
            <div class="w-full flex flex-col gap-2">
              <label for="">* Please type <span class="st-font-bold">Delete Book</span> to confirm.</label>
              <TextInput
                placeholder="Delete Book"
                bind:value={deleteConfirmation}
              />
              <Button
                label="Delete Book"
                handleClick={async () => await handleDeleteUserBook()}
                isDisabled={
                  isLoading ||
                  (deleteConfirmation !== 'Delete Book')
                }
              />
            </div>
          {/if}
        </Card>
      {/if}
    {:else}
      <Card>
        <Heading label="Sign In" />
        <InfoCard>
          <p><Link link="/sign-in" label="Sign in" /> to start managing your books</p>
        </InfoCard>
      </Card>
    {/if}
  </div>
</div>