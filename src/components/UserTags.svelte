<script lang="ts">
  // svelte
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords, deleteRecords } from 'src/api/database';

  // helpers
  import { formatDate, formatUrl } from 'src/helpers/helpers';

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
  import MinusButton from 'src/components/MinusButton.svelte';
  import PlusButton from 'src/components/PlusButton.svelte';

  // data
  const session: any = $page.data.session;

  // props
  export let userProfile: any;
  export let bookEdition: any;
  export let userBookEdition: any;
  export let userBookEditionTags: any;
  export let userBookEditionTagBookEditions: any;

  // state
  let isLoading: boolean = false;
  let userBookTagIds = userBookEditionTagBookEditions.map((userBookTagBook: any) => userBookTagBook.user_book_tag_id);


  /* todo: 4 counts and 2 instance counts */


  const handleAddToCollection = async (userBookTag: any) => {
    isLoading = true;

    const userBookTagBookData: any = {
      user_id: session.user.id,
      book_id: bookEdition.id,
      user_book_tag_id: userBookTag.id,
    }

    // const bookTagData: any = {

    // }

    const updatedUserBookTagData: any = {
      count: userBookTag.count + 1,
    };

    // const updatedProfileData: any = {
    //   user_book_tag_count: userProfile.user_book_tag_count + 1,
    // };

    // const updatedBookData: any = {
    //   book_tag_count: bookEdition.book_tag_count + 1,
    // };

    const [
      newUserBookTagBookRecords,
      latestUserBookTagRecords
    ] = await Promise.all([
      insertRecords('user_book_tag_book', [userBookTagBookData]),
      updateRecords('user_book_tag', [updatedUserBookTagData], { id: userBookTag.id }),
      // updateRecords('user_profile', [updatedProfileData], { id: userProfile.id }),
      // updateRecords('bookEdition', [updatedBookData], { id: bookEdition.id }),
    ]);

    const index = userBookEditionTags.findIndex((previousUserBookTag: any) => previousUserBookTag.id === userBookTag.id);
    userBookEditionTags[index] = latestUserBookTagRecords[0];
    userBookTagIds = [ ...userBookTagIds, userBookTag.id ];
    userBookEditionTagBookEditions = [ ...userBookEditionTagBookEditions, newUserBookTagBookRecords[0] ];

    isLoading = false;
  }

  const handleRemoveFromCollection = async (userBookTag: any) => {
    isLoading = true;

    const updatedUserBookTagData: any = {
      count: userBookTag.count - 1,
    };

    const [
      deletedUserBookTagBookRecords,
      latestUserBookTagRecords
    ] = await Promise.all([
      deleteRecords('user_book_tag_book', { user_book_tag_id: userBookTag.id, book_id: bookEdition.id }),
      updateRecords('user_book_tag', [updatedUserBookTagData], { id: userBookTag.id }),
    ]);

    const index = userBookEditionTags.findIndex((previousUserBookTag: any) => previousUserBookTag.id === userBookTag.id);
    userBookEditionTags[index] = latestUserBookTagRecords[0];
    userBookTagIds = userBookTagIds.filter((userBookTagId: number) => userBookTagId !== userBookTag.id);
    userBookEditionTagBookEditions = userBookEditionTagBookEditions.filter((userBookTagBook: any) => userBookTagBook.id !== deletedUserBookTagBookRecords[0].id);

    isLoading = false;
  }
</script>

{#if session}
  {#if userBookEdition && userBookEditionTagBookEditions.length > 0}
    <SuccessCard>
      <div class="w-full flex flex-col gap-2">
        <p class="dark:text-white w-full">You tagged this book {userBookEditionTagBookEditions.length} {userBookEditionTagBookEditions.length === 1 ? 'time' : 'times'}</p>
        <!-- <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_rating.updated_at, true)}</p> -->
      </div>
    </SuccessCard>
  {:else if userBookEdition && userBookEditionTagBookEditions.length === 0}
    <InfoCard>
      <p class="dark:text-white w-full">You can tag this book</p>
    </InfoCard>
  {:else if !userBookEdition}
    <InfoCard>
      <p class="dark:text-white w-full">You can start tagging this book after marking a status</p>
    </InfoCard>
  {/if}
  {#if userBookEdition && userBookEditionTags.length > 0}
    <div class="w-full flex flex-col gap-2">
      {#each userBookEditionTags as userBookTag}
        <div class="w-full flex justify-between gap-2 items-center">
          {#if userBookTagIds.indexOf(userBookTag.id) !== -1}
            <SuccessCard>
              <Link
                label={`${userBookTag.name} (${userBookTag.count})`}
                link={`/profiles/${session.user.id}/book-tags?tag=${formatUrl(userBookTag.name)}`}
              />
            </SuccessCard>
            <MinusButton
              handleClick={async () => await handleRemoveFromCollection(userBookTag)}
              isDisabled={isLoading}
            />
          {:else}
            <Link
              label={`${userBookTag.name} (${userBookTag.count})`}
              link={`/profiles/${session.user.id}/book-tags?tag=${formatUrl(userBookTag.name)}`}
            />
            <PlusButton
              handleClick={async () => await handleAddToCollection(userBookTag)}
              isDisabled={isLoading}
            />
          {/if}
        </div>
      {/each}
    </div>
  {:else if userBookEdition && userBookEditionTags.length === 0}
    <p class="w-full dark:text-white">You have no tags</p>
  {/if}
{/if}