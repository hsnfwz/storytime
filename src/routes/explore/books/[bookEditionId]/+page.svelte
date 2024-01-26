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
  let bookEdition: any = data.bookEdition;
  let userBookEdition: any = data.userBookEdition;
  let userBookEditionTags: any = data.userBookEditionTags;
  let userBookEditionTagBookEditions: any = data.userBookEditionTagBookEditions;

  // state
  let isLoading: boolean = false;

  const dateDifference = getDateDifference(bookEdition.release_date);

  let showUserStatus: boolean = false;
  let showUserTags: boolean = false;
  let showUserRating: boolean = false;
  let showUserReview: boolean = false;
  let showDeleteUserBook: boolean = false;

  let deleteConfirmation: string = '';

  const handleDeleteUserBook = async () => {
    isLoading = true;

    const userBookStatus: string = userBookEdition.user_book_edition_status.status;

    let profileCountAttribute: string = '';
    let profileCountValue: number = 0;

    let bookCountAttribute: string = '';
    let bookCountValue: number = 0;

    if (userBookStatus === E_BookStatus.TRACKING.text) {
      profileCountAttribute = 'book_status_tracking_count';
      profileCountValue = userProfile.book_status_tracking_count - 1;
      bookCountAttribute = 'status_tracking_count';
      bookCountValue = bookEdition.status_tracking_count - 1;
    } else if (userBookStatus === E_BookStatus.READING.text) {
      profileCountAttribute = 'book_status_reading_count';
      profileCountValue = userProfile.book_status_reading_count - 1;
      bookCountAttribute = 'status_reading_count';
      bookCountValue = bookEdition.status_reading_count - 1;
    } else if (userBookStatus === E_BookStatus.TO_READ.text) {
      profileCountAttribute = 'book_status_to_read_count';
      profileCountValue = userProfile.book_status_to_read_count - 1;
      bookCountAttribute = 'status_to_read_count';
      bookCountValue = bookEdition.status_to_read_count - 1;
    } else if (userBookStatus === E_BookStatus.READ.text) {
      profileCountAttribute = 'book_status_read_count';
      profileCountValue = userProfile.book_status_read_count - 1;
      bookCountAttribute = 'status_read_count';
      bookCountValue = bookEdition.status_read_count - 1;
    } else if (userBookStatus === E_BookStatus.DNF.text) {
      profileCountAttribute = 'book_status_dnf_count';
      profileCountValue = userProfile.book_status_dnf_count - 1;
      bookCountAttribute = 'status_dnf_count';
      bookCountValue = bookEdition.status_dnf_count - 1;
    }

    const hasRead = userBookEdition.read_count > 0;
    const hasRated = userBookEdition.user_book_edition_rating;
    const hasReviewed = userBookEdition.user_book_edition_review;

    const updatedProfileData = {
      [profileCountAttribute]: profileCountValue,
    };

    const updatedBookData = {
      [bookCountAttribute]: bookCountValue,
    };

    if (hasRead) {
      updatedProfileData['book_unique_read_count'] = userProfile.book_unique_read_count - 1;
      updatedBookData['unique_read_count'] = bookEdition.unique_read_count - 1;
      updatedBookData['read_count'] = bookEdition.read_count - userBookEdition.read_count;
    }

    if (hasRated) {
      updatedProfileData[`book_rating_${userBookEdition.user_book_edition_rating.rating}_count`] = userProfile[`book_rating_${userBookEdition.user_book_edition_rating.rating}_count`] - 1;
      updatedBookData[`rating_${userBookEdition.user_book_edition_rating.rating}_count`] = bookEdition[`rating_${userBookEdition.user_book_edition_rating.rating}_count`] - 1;
    }

    if (hasReviewed) {
      updatedProfileData['book_review_count'] = userProfile.book_review_count - 1;
      updatedBookData['review_count'] = bookEdition.review_count - 1;
    }

    await deleteRecords('user_book', { id: userBookEdition.id });
    await Promise.all([
      deleteRecords('user_book_edition_status', { user_id: session.user.id, book_id: bookEdition.id }),
      deleteRecords('user_book_edition_rating', { user_id: session.user.id, book_id: bookEdition.id }),
      deleteRecords('user_book_edition_review', { user_id: session.user.id, book_id: bookEdition.id }),
    ]);
    const [
      updatedProfileRecords,
      updatedBookRecords,
    ] = await Promise.all([
      updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
      updateRecords('bookEdition', updatedBookData, { id: bookEdition.id }),
    ]);

    userProfile = updatedProfileRecords[0];
    bookEdition = updatedBookRecords[0];
    userBookEdition = undefined;

    deleteConfirmation = '';

    isLoading = false;
  }
</script>

<div class="flex flex-col items-center sm:flex-row sm:justify-center sm:items-start gap-4">
  <div class="w-full sm:max-w-[250px] flex flex-col gap-4">
    <ItemCard item={bookEdition} />
    <!-- <HorizontalDivider /> -->
    <!-- <Card>
      <Heading label="Links" />
      <div class="flex flex-col gap-2">
        <Link link="/" label="Purchase" />
        <Link link="/" label="Community" />
        <Link link="/" label="Statistics" />
      </div>
    </Card> -->
  </div>
  <div class="w-full flex flex-col items-center gap-4 sm:max-w-[750px]">
    <Card>
      <Heading label={bookEdition.title} />
      <div class="w-full flex flex-col gap-2">
        {#if dateDifference?.differenceDays < 0}
          <p class="w-full dark:text-white">
            Expected Publication {formatDate(bookEdition.release_date)} ({dateDifference.differenceDaysAbs === 1 ? `${dateDifference.differenceDaysAbs} day` : `${dateDifference.differenceDaysAbs} days`})
          </p>
        {:else}
          <p class="w-full dark:text-white">
            Published {formatDate(bookEdition.release_date)}
          </p>
        {/if}
        {#if getItemTotalRatings(bookEdition) !== 0}
          <p class="w-full dark:text-white">{getItemRatingsAverage(bookEdition)} / 10</p>
        {/if}
      </div>
      <div class="w-full flex flex-col gap-2">
        <p class="w-full dark:text-white">{getItemTotalRatings(bookEdition) === 1 ? `${getItemTotalRatings(bookEdition)} rating`: `${getItemTotalRatings(bookEdition)} ratings`}</p>
        <p class="w-full dark:text-white">{bookEdition.review_count ===  1 ? `${bookEdition.review_count} review` : `${bookEdition.review_count} reviews`}</p>
        <p class="w-full dark:text-white">{bookEdition.tag_count ===  1 ? `${bookEdition.tag_count} tag` : `${bookEdition.tag_count} tags`}</p>
        <p class="w-full dark:text-white">{bookEdition.status_tracking_count} tracking</p>
        <p class="w-full dark:text-white">{bookEdition.status_to_read_count} to read</p>
        <p class="w-full dark:text-white">{bookEdition.status_reading_count} reading</p>
        <p class="w-full dark:text-white">{bookEdition.status_read_count} read</p>
        <p class="w-full dark:text-white">{bookEdition.status_dnf_count} dnf</p>
        <p class="w-full dark:text-white">{bookEdition.unique_read_count === 1 ? `${bookEdition.unique_read_count} edition unique read` : `${bookEdition.unique_read_count} edition unique reads`}</p>
        <p class="w-full dark:text-white">{bookEdition.read_count === 1 ? `${bookEdition.read_count} edition total read` : `${bookEdition.read_count} edition total reads`}</p>
        <p class="w-full dark:text-white">{bookEdition.book.total_book_edition_unique_read_count === 1 ? `${bookEdition.book.total_book_edition_unique_read_count} all editions unique read` : `${bookEdition.book.total_book_edition_unique_read_count} all editions unique reads`}</p>
        <p class="w-full dark:text-white">{bookEdition.book.total_book_edition_read_count === 1 ? `${bookEdition.book.total_book_edition_read_count} all editions total read` : `${bookEdition.book.total_book_edition_read_count} all editions total reads`}</p>
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
        {#if !showUserStatus && userBookEdition}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You marked this bookEdition as <span class="st-font-italic">{userBookEdition.user_book_edition_status.status}</span></p>
              <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_edition_status.updated_at, true)}</p>
            </div>
          </SuccessCard>
        {:else if !showUserStatus && !userBookEdition}
          <InfoCard>
            <p class="dark:text-white w-full">You can mark a status for this bookEdition</p>
          </InfoCard>
        {/if}
        {#if showUserStatus}
          <UserStatus
            bind:userProfile
            bind:userBookEdition
            bind:bookEdition
          />
        {/if}
      </Card>
      <Card>
        <div class="w-full flex justify-between gap-2">
          <Heading label="Your Tags" />
          {#if showUserTags}
            <ArrowUpButton
              handleClick={() => showUserTags = false}
              isDisabled={!userBookEdition}
            />
          {:else}
            <ArrowDownButton
              handleClick={() => showUserTags = true}
              isDisabled={!userBookEdition}
            />
          {/if}
        </div>
        {#if !showUserTags && userBookEdition && userBookEditionTagBookEditions.length > 0}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You tagged this bookEdition {userBookEditionTagBookEditions.length} {userBookEditionTagBookEditions.length === 1 ? 'time' : 'times'}</p>
              <!-- <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_edition_rating.updated_at, true)}</p> -->
            </div>
          </SuccessCard>
        {:else if !showUserTags && userBookEdition && userBookEditionTagBookEditions.length === 0}
          <InfoCard>
            <p class="dark:text-white w-full">You can tag this bookEdition</p>
          </InfoCard>
        {:else if !showUserTags && !userBookEdition}
          <InfoCard>
            <p class="dark:text-white w-full">You can start tagging this bookEdition after marking a status</p>
          </InfoCard>
        {/if}
        {#if showUserTags}
          <UserTags
            bind:userProfile
            bind:userBookEdition
            bind:bookEdition
            bind:userBookEditionTags
            bind:userBookEditionTagBookEditions
          />
        {/if}
      </Card>
      <Card>
        <div class="w-full flex justify-between gap-2">
          <Heading label="Your Rating" />
          {#if showUserRating}
            <ArrowUpButton
              handleClick={() => showUserRating = false}
              isDisabled={!userBookEdition || (userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text))}
            />
          {:else}
            <ArrowDownButton
              handleClick={() => showUserRating = true}
              isDisabled={!userBookEdition || (userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text))}
            />
          {/if}
        </div>
        {#if !showUserRating && userBookEdition && userBookEdition.user_book_edition_rating}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You rated this bookEdition <span class="st-font-italic">{userBookEdition.user_book_edition_rating.rating}/10</span></p>
              <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_edition_rating.updated_at, true)}</p>
            </div>
          </SuccessCard>
        {:else if !showUserRating && userBookEdition && !userBookEdition.user_book_edition_rating && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)}
          <InfoCard>
            <p class="dark:text-white w-full">You can rate this bookEdition</p>
          </InfoCard>
        {:else if !showUserRating && ((userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text)) || !userBookEdition)}
          <InfoCard>
            <p class="dark:text-white w-full">You can start rating this bookEdition after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
          </InfoCard>
        {/if}
        {#if showUserRating}
          <UserRating
            bind:userProfile
            bind:userBookEdition
            bind:bookEdition
          />
        {/if}
      </Card>
      <Card>
        <div class="w-full flex justify-between gap-2">
          <Heading label="Your Review" />
          {#if showUserReview}
            <ArrowUpButton
              handleClick={() => showUserReview = false}
              isDisabled={!userBookEdition || (userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text))}
            />
          {:else}
            <ArrowDownButton
              handleClick={() => showUserReview = true}
              isDisabled={!userBookEdition || (userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text))}
            />
          {/if}
        </div>
        {#if !showUserReview && userBookEdition && userBookEdition.user_book_edition_review}
          <SuccessCard>
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white w-full">You reviewed this bookEdition</p>
              <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_edition_review.updated_at, true)}</p>
            </div>
          </SuccessCard>
        {:else if !showUserReview && userBookEdition && !userBookEdition.user_book_edition_review && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)}
          <InfoCard>
            <p class="dark:text-white w-full">You can review this bookEdition</p>
          </InfoCard>
        {:else if !showUserReview && ((userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.READ.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.DNF.text)) || !userBookEdition)}
          <InfoCard>
            <p class="dark:text-white w-full">You can start reviewing this bookEdition after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
          </InfoCard>
        {/if}
        {#if showUserReview}
          <UserReview
            bind:userProfile
            bind:userBookEdition
            bind:bookEdition
          />
        {/if}
      </Card>
      {#if userBookEdition}
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
              <p class="dark:text-white">This action cannot be undone. This will permanently delete your bookEdition and all associated statuses, ratings, reviews, reads, and tags</p>
            </WarningCard>
            <div class="w-full flex flex-col gap-2">
              <label for="">* Please type <span class="st-font-bold">Delete Book</span> to confirm</label>
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