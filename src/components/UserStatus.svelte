<script lang="ts">
  // svelte
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords, incrementAndDecrement, increment, increment2, increment3, increment2AndDecrement, increment3AndDecrement } from 'src/api/database';

  // helpers
  import { getDateDifference, formatDate, formatTableColumn } from 'src/helpers/helpers';

  // enums
  import E_BookStatus from 'src/enums/E_BookStatus';

  // components
  import Heading from 'src/components/Heading.svelte';
  import SuccessCard from 'src/components/SuccessCard.svelte';
  import Button from 'src/components/Button.svelte';
  import InfoCard from 'src/components/InfoCard.svelte';
  import ErrorCard from 'src/components/ErrorCard.svelte';
  import DatePicker from 'src/components/DatePicker.svelte';
  import Link from 'src/components/Link.svelte';
  
  // data
  const session: any = $page.data.session;

  // props
  export let userProfile: any;
  export let bookEdition: any;
  export let userBookEdition: any;

  console.log('userProfile', userProfile);
  console.log('bookEdition', bookEdition);
  console.log('userBookEdition', userBookEdition);

  // state
  let isLoading: boolean = false;

  const dateDifference = getDateDifference(bookEdition.release_date);

  let today: any = new Date();
  today.setHours(0);

  let startYear: number = today.getUTCFullYear();
  let startMonth: number = today.getUTCMonth() + 1;
  let startDay: number = today.getUTCDate();

  let endYear: number = today.getUTCFullYear();
  let endMonth: number = today.getUTCMonth() + 1;
  let endDay: number = today.getUTCDate();

  if (userBookEdition && userBookEdition.user_book_edition_status.status !== E_BookStatus.TO_READ.text) {
    if (userBookEdition.user_book_edition_status.start_date) {
      startYear = new Date(userBookEdition.user_book_edition_status.start_date).getUTCFullYear();
      startMonth = new Date(userBookEdition.user_book_edition_status.start_date).getUTCMonth() + 1;
      startDay = new Date(userBookEdition.user_book_edition_status.start_date).getUTCDate();
    }
  }
  
  if (userBookEdition && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)) {
    if (userBookEdition.user_book_edition_status.end_date) {
      endYear = new Date(userBookEdition.user_book_edition_status.end_date).getUTCFullYear();
      endMonth = new Date(userBookEdition.user_book_edition_status.end_date).getUTCMonth() + 1;
      endDay = new Date(userBookEdition.user_book_edition_status.end_date).getUTCDate();
    }
  }

  let showInvalidDateRangeError: boolean = false;

  $: {
    if (showInvalidDateRangeError) setTimeout(() => showInvalidDateRangeError = false, 2000);
  }

  onMount(() => {
    // grab records for timeline
  });

  const handleUpdateUserBookEdition = async () => {
    isLoading = true;

    const _dateDifference: any = getDateDifference(new Date(startYear, startMonth-1, startDay), new Date(endYear, endMonth-1, endDay));

    if (_dateDifference.differenceDays < 0) {
      showInvalidDateRangeError = true;
      isLoading = false;
      return;
    }

    const userBookEditionStatus: string = userBookEdition.user_book_edition_status.status;

    if (userBookEditionStatus === E_BookStatus.READING.text) {
      const updatedUserBookEditionStatusData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
      };

      const latestUserBookEditionStatusRecords = await updateRecords('user_book_edition_status', [updatedUserBookEditionStatusData], { id: userBookEdition.latest_user_book_edition_status_id });

      userBookEdition.user_book_edition_status = latestUserBookEditionStatusRecords[0];
    } else if (userBookEditionStatus === E_BookStatus.READ.text) {
      const updatedUserBookEditionReadData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const updatedUserBookEditionStatusData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const [
        latestUserBookEditionReadRecords,
        latestUserBookEditionStatusRecords
      ] = await Promise.all([
        updateRecords('user_book_edition_read', [updatedUserBookEditionReadData], { id: userBookEdition.latest_user_book_edition_read_id }),
        updateRecords('user_book_edition_status', [updatedUserBookEditionStatusData], { id: userBookEdition.latest_user_book_edition_status_id }),
      ]);

      userBookEdition.user_book_edition_read = latestUserBookEditionReadRecords[0];
      userBookEdition.user_book_edition_status = latestUserBookEditionStatusRecords[0];
    } else if (userBookEditionStatus === E_BookStatus.DNF.text) {
      const updatedUserBookEditionStatusData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const latestUserBookEditionStatusRecords = await updateRecords('user_book_edition_status', [updatedUserBookEditionStatusData], { id: userBookEdition.latest_user_book_edition_status_id });

      userBookEdition.user_book_edition_status = latestUserBookEditionStatusRecords[0];
    }

    isLoading = false;
  }

  const handleStatus = async (status: string) => {
    isLoading = true;

    const _today: any = new Date();
    _today.setHours(0);

    if (userBookEdition) {
      const userBookEditionStatusData: any = {
        user_id: session.user.id,
        book_edition_id: bookEdition.id,
        status,
      };

      if (status === E_BookStatus.READING.text) {
        userBookEditionStatusData.start_date = _today;
      } else if (status === E_BookStatus.READ.text) {
        userBookEditionStatusData.start_date = userBookEdition.user_book_edition_status.status === E_BookStatus.READING.text ? userBookEdition.user_book_edition_status.start_date : new Date(startYear, startMonth-1, startDay);
        userBookEditionStatusData.end_date = new Date(endYear, endMonth-1, endDay);
      } else if (status === E_BookStatus.DNF.text) {
        userBookEditionStatusData.start_date = userBookEdition.user_book_edition_status.status === E_BookStatus.READING.text ? userBookEdition.user_book_edition_status.start_date : new Date(startYear, startMonth-1, startDay);
        userBookEditionStatusData.end_date = new Date(endYear, endMonth-1, endDay);
      }

      const newUserBookEditionStatusRecords = await insertRecords('user_book_edition_status', [userBookEditionStatusData], '*');

      const updatedUserBookEditionData: any = {
        latest_user_book_edition_status_id: newUserBookEditionStatusRecords[0].id,
      };

      if (status === E_BookStatus.READ.text) {
        if (userBookEdition.book_edition_read_count === 0) {
          const [
            latestUserBookEditionRecords1,
            latestUserBookEditionRecords2,
            latestUserProfileRecords,
            latestBookEditionRecords,
            latestBookRecords,
          ] = await Promise.all([
            updateRecords('user_book_edition', [updatedUserBookEditionData], { id: userBookEdition.id }, 'id'),
            increment('user_book_edition', userBookEdition.id, 'book_edition_read_count', 1),
            increment3AndDecrement('user_profile', userProfile.id, `book_edition_status_${formatTableColumn(status)}_count`, 1, 'book_edition_unique_read_count', 1, 'book_edition_read_count', 1, `book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
            increment3AndDecrement('book_edition', bookEdition.id, `status_${formatTableColumn(status)}_count`, 1, `unique_read_count`, 1, `read_count`, 1, `status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
            increment3AndDecrement('book', bookEdition.book_id, `total_book_edition_status_${formatTableColumn(status)}_count`, 1, `total_book_edition_unique_read_count`, 1, `total_book_edition_read_count`, 1, `total_book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
          ]);

          /* todo: make a new object entirely, then pass it in to state, to avoid all these rerenders - do the same for user review and user rating */
          userProfile[`book_edition_status_${formatTableColumn(status)}_count`] = latestUserProfileRecords[0].increment_column_value_1;
          userProfile.book_edition_unique_read_count = latestUserProfileRecords[0].increment_column_value_2;
          userProfile.book_edition_read_count = latestUserProfileRecords[0].increment_column_value_3;
          userProfile[`book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestUserProfileRecords[0].decrement_column_value;

          bookEdition[`status_${formatTableColumn(status)}_count`] = latestBookEditionRecords[0].increment_column_value_1;
          bookEdition.unique_read_count = latestBookEditionRecords[0].increment_column_value_2;
          bookEdition.read_count = latestBookEditionRecords[0].increment_column_value_3;
          bookEdition[`status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestBookEditionRecords[0].decrement_column_value;

          bookEdition.book[`total_book_edition_status_${formatTableColumn(status)}_count`] = latestBookRecords[0].increment_column_value_1;
          bookEdition.book.total_book_edition_unique_read_count = latestBookRecords[0].increment_column_value_2;
          bookEdition.book.total_book_edition_read_count = latestBookRecords[0].increment_column_value_3;
          bookEdition.book[`total_book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestBookRecords[0].decrement_column_value;

          userBookEdition.latest_user_book_edition_status_id = newUserBookEditionStatusRecords[0].id;
          userBookEdition.user_book_edition_status = newUserBookEditionStatusRecords[0];
          userBookEdition.book_edition_read_count = latestUserBookEditionRecords2[0].increment_column_value;
        } else {
          const [
            latestUserBookEditionRecords1,
            latestUserBookEditionRecords2,
            latestUserProfileRecords,
            latestBookEditionRecords,
            latestBookRecords,
          ] = await Promise.all([
            updateRecords('user_book_edition', [updatedUserBookEditionData], { id: userBookEdition.id }, 'id'),
            increment('user_book_edition', userBookEdition.id, 'book_edition_read_count', 1),
            increment2AndDecrement('user_profile', userProfile.id, `book_edition_status_${formatTableColumn(status)}_count`, 1, 'book_edition_read_count', 1, `book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
            increment2AndDecrement('book_edition', bookEdition.id, `status_${formatTableColumn(status)}_count`, 1, `read_count`, 1, `status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
            increment2AndDecrement('book', bookEdition.book_id, `total_book_edition_status_${formatTableColumn(status)}_count`, 1, `total_book_edition_read_count`, 1, `total_book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
          ]);

          /* todo: make a new object entirely, then pass it in to state, to avoid all these rerenders - do the same for user review and user rating */
          userProfile[`book_edition_status_${formatTableColumn(status)}_count`] = latestUserProfileRecords[0].increment_column_value_1;
          userProfile.book_edition_read_count = latestUserProfileRecords[0].increment_column_value_2;
          userProfile[`book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestUserProfileRecords[0].decrement_column_value;

          bookEdition[`status_${formatTableColumn(status)}_count`] = latestBookEditionRecords[0].increment_column_value_1;
          bookEdition.read_count = latestBookEditionRecords[0].increment_column_value_2;
          bookEdition[`status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestBookEditionRecords[0].decrement_column_value;

          bookEdition.book[`total_book_edition_status_${formatTableColumn(status)}_count`] = latestBookRecords[0].increment_column_value_1;
          bookEdition.book.total_book_edition_read_count = latestBookRecords[0].increment_column_value_2;
          bookEdition.book[`total_book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestBookRecords[0].decrement_column_value;

          userBookEdition.latest_user_book_edition_status_id = newUserBookEditionStatusRecords[0].id;
          userBookEdition.user_book_edition_status = newUserBookEditionStatusRecords[0];
          userBookEdition.book_edition_read_count = latestUserBookEditionRecords2[0].increment_column_value;
        }
      } else {
        const [
          latestUserBookEditionRecords,
          latestUserProfileRecords,
          latestBookEditionRecords,
          latestBookRecords,
        ] = await Promise.all([
          updateRecords('user_book_edition', [updatedUserBookEditionData], { id: userBookEdition.id }, 'id'),
          incrementAndDecrement('user_profile', userProfile.id, `book_edition_status_${formatTableColumn(status)}_count`, 1, `book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
          incrementAndDecrement('book_edition', bookEdition.id, `status_${formatTableColumn(status)}_count`, 1, `status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
          incrementAndDecrement('book', bookEdition.book_id, `total_book_edition_status_${formatTableColumn(status)}_count`, 1, `total_book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`, 1),
        ]);

        /* todo: make a new object entirely, then pass it in to state, to avoid all these rerenders - do the same for user review and user rating */
        userProfile[`book_edition_status_${formatTableColumn(status)}_count`] = latestUserProfileRecords[0].increment_column_value;
        userProfile[`book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestUserProfileRecords[0].decrement_column_value;
        
        bookEdition[`status_${formatTableColumn(status)}_count`] = latestBookEditionRecords[0].increment_column_value;
        bookEdition[`status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestBookEditionRecords[0].decrement_column_value;
        
        bookEdition.book[`total_book_edition_status_${formatTableColumn(status)}_count`] = latestBookRecords[0].increment_column_value;
        bookEdition.book[`total_book_edition_status_${formatTableColumn(userBookEdition.user_book_edition_status.status)}_count`] = latestBookRecords[0].decremented_column_value;

        userBookEdition.latest_user_book_edition_status_id = newUserBookEditionStatusRecords[0].id;
        userBookEdition.user_book_edition_status = newUserBookEditionStatusRecords[0];
      }
    } else {
      const userBookEditionStatusData: any = {
        user_id: session.user.id,
        book_edition_id: bookEdition.id,
        status,
      };

      if (status === E_BookStatus.READING.text) {
        userBookEditionStatusData.start_date = _today;
      } else if (status === E_BookStatus.READ.text) {
        userBookEditionStatusData.start_date = new Date(startYear, startMonth-1, startDay);
        userBookEditionStatusData.end_date = new Date(endYear, endMonth-1, endDay);
      } else if (status === E_BookStatus.DNF.text) {
        userBookEditionStatusData.start_date = new Date(startYear, startMonth-1, startDay);
        userBookEditionStatusData.end_date = new Date(endYear, endMonth-1, endDay);
      }

      const newUserBookEditionStatusRecords = await insertRecords('user_book_edition_status', [userBookEditionStatusData], '*');

      const userBookEditionData: any = {
        user_id: session.user.id,
        book_edition_id: bookEdition.id,
        latest_user_book_edition_status_id: newUserBookEditionStatusRecords[0].id,
      };

      if (status === E_BookStatus.READ.text) {
        userBookEditionData.book_edition_read_count = 1;
      }

      if (status === E_BookStatus.READ.text) {
        const [
          newUserBookEditionRecords,
          latestUserProfileRecords,
          latestBookEditionRecords,
          latestBookRecords,
        ] = await Promise.all([
          insertRecords('user_book_edition', [userBookEditionData], `*`),
          increment3('user_profile', userProfile.id, `book_edition_status_${formatTableColumn(status)}_count`, 1, `book_edition_unique_read_count`, 1, `book_edition_read_count`, 1),
          increment3('book_edition', bookEdition.id, `status_${formatTableColumn(status)}_count`, 1, `unique_read_count`, 1, `read_count`, 1),
          increment3('book', bookEdition.book_id, `total_book_edition_status_${formatTableColumn(status)}_count`, 1, `total_book_edition_unique_read_count`, 1, `total_book_edition_read_count`, 1),
        ]);

        /* todo: make a new object entirely, then pass it in to state, to avoid all these rerenders - do the same for user review and user rating */
        userProfile[`book_edition_status_${formatTableColumn(status)}_count`] = latestUserProfileRecords[0].increment_column_value_1;
        userProfile.book_edition_unique_read_count = latestUserProfileRecords[0].increment_column_value_2;
        userProfile.book_edition_read_count = latestUserProfileRecords[0].increment_column_value_3;
        
        bookEdition[`status_${formatTableColumn(status)}_count`] = latestBookEditionRecords[0].increment_column_value_1;
        bookEdition.unique_read_count = latestBookEditionRecords[0].increment_column_value_2;
        bookEdition.read_count = latestBookEditionRecords[0].increment_column_value_3;
        
        bookEdition.book[`total_book_edition_status_${formatTableColumn(status)}_count`] = latestBookRecords[0].increment_column_value_1;
        bookEdition.book.total_book_edition_unique_read_count = latestBookRecords[0].increment_column_value_2;
        bookEdition.book.total_book_edition_read_count = latestBookRecords[0].increment_column_value_3;

        userBookEdition = newUserBookEditionRecords[0];
        userBookEdition.user_book_edition_status = newUserBookEditionStatusRecords[0];
      } else {
        const [
          newUserBookEditionRecords,
          latestUserProfileRecords,
          latestBookEditionRecords,
          latestBookRecords,
        ] = await Promise.all([
          insertRecords('user_book_edition', [userBookEditionData], `*`),
          increment('user_profile', userProfile.id, `book_edition_status_${formatTableColumn(status)}_count`, 1),
          increment('book_edition', bookEdition.id, `status_${formatTableColumn(status)}_count`, 1),
          increment('book', bookEdition.book_id, `total_book_edition_status_${formatTableColumn(status)}_count`, 1),
        ]);

        /* todo: make a new object entirely, then pass it in to state, to avoid all these rerenders - do the same for user review and user rating */
        userProfile[`book_edition_status_${formatTableColumn(status)}_count`] = latestUserProfileRecords[0].increment_column_value;
        
        bookEdition[`status_${formatTableColumn(status)}_count`] = latestBookEditionRecords[0].increment_column_value;
        
        bookEdition.book[`total_book_edition_status_${formatTableColumn(status)}_count`] = latestBookRecords[0].increment_column_value;

        userBookEdition = newUserBookEditionRecords[0];
        userBookEdition.user_book_edition_status = newUserBookEditionStatusRecords[0];
      }
    }

    startYear = _today.getUTCFullYear();
    startMonth = _today.getUTCMonth() + 1;
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = _today.getUTCMonth() + 1;
    endDay = _today.getUTCDate();

    isLoading = false;
  }
</script>

{#if session}
  {#if userBookEdition}
    <SuccessCard>
      <div class="w-full flex flex-col gap-2">
        <p class="dark:text-white w-full">You marked this bookEdition as <span class="st-font-italic">{userBookEdition.user_book_edition_status.status}</span></p>
        <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBookEdition.user_book_edition_status.updated_at, true)}</p>
      </div>
    </SuccessCard>
  {:else}
    <InfoCard>
      <p class="dark:text-white w-full">You can mark a status for this bookEdition</p>
    </InfoCard>
  {/if}
  <div class="flex flex-col md:flex-row gap-2 w-full">
    <Button
      label={E_BookStatus.TRACKING.text}
      handleClick={async () => await handleStatus(E_BookStatus.TRACKING.text)}
      isSelected={userBookEdition && userBookEdition.user_book_edition_status.status === E_BookStatus.TRACKING.text}
      isDisabled={isLoading}
    />
    <Button
      label={E_BookStatus.TO_READ.text}
      handleClick={async () => await handleStatus(E_BookStatus.TO_READ.text)}
      isSelected={userBookEdition && userBookEdition.user_book_edition_status.status === E_BookStatus.TO_READ.text}
      isDisabled={isLoading}
    />
    {#if userProfile && (dateDifference?.differenceDays >= 0)}
      <Button
        label={E_BookStatus.READING.text}
        handleClick={async () => await handleStatus(E_BookStatus.READING.text)}
        isSelected={userBookEdition && userBookEdition.user_book_edition_status.status === E_BookStatus.READING.text}
        isDisabled={isLoading}
      />
      <Button
        label={E_BookStatus.READ.text}
        handleClick={async () => await handleStatus(E_BookStatus.READ.text)}
        isSelected={userBookEdition && userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text}
        isDisabled={isLoading}
      />
      <Button
        label={E_BookStatus.DNF.text}
        handleClick={async () => await handleStatus(E_BookStatus.DNF.text)}
        isSelected={userBookEdition && userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text}
        isDisabled={isLoading}
      />
    {/if}
  </div>
  {#if userProfile && (dateDifference?.differenceDays < 0)}
    <InfoCard>
      <p class="dark:text-white">You can start marking this bookEdition as <span class="st-font-italic">{E_BookStatus.READING.text}</span>, <span class="st-font-italic">{E_BookStatus.READ.text}</span>, or <span class="st-font-italic">{E_BookStatus.DNF.text}</span> after publication</p>
    </InfoCard>
  {/if}
  {#if userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.TRACKING.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.TO_READ.text)}
    <DatePicker
      label="Start Date"
      bind:year={startYear}
      bind:month={startMonth}
      bind:day={startDay}
      bind:showError={showInvalidDateRangeError}
    />
  {/if}
  {#if userBookEdition && (userBookEdition.user_book_edition_status.status === E_BookStatus.READ.text || userBookEdition.user_book_edition_status.status === E_BookStatus.DNF.text)}
    <DatePicker
      label="End Date"
      bind:year={endYear}
      bind:month={endMonth}
      bind:day={endDay}
      bind:showError={showInvalidDateRangeError}
    />
  {/if}
  {#if (userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.TRACKING.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.TO_READ.text))}
    {#if showInvalidDateRangeError}
      <ErrorCard>
        <p>{userBookEdition.user_book_edition_status.status === E_BookStatus.READING.text ? 'Start date cannot be after current date' : 'Start date cannot be after end date'}</p>
      </ErrorCard>
    {/if}
  {/if}
  {#if userBookEdition && (userBookEdition.user_book_edition_status.status !== E_BookStatus.TRACKING.text && userBookEdition.user_book_edition_status.status !== E_BookStatus.TO_READ.text)}
    <Button
      label="Update Status"
      handleClick={async () => await handleUpdateUserBookEdition()}
      isDisabled={
        (userBookEdition.user_book_edition_status.status === E_BookStatus.READING.text && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(userBookEdition.user_book_edition_status.start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth-1, startDay))) ||
        (userBookEdition.user_book_edition_status.status !== E_BookStatus.READING.text && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(userBookEdition.user_book_edition_status.start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth-1, startDay)) &&
        (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(userBookEdition.user_book_edition_status.end_date)) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(endYear, endMonth-1, endDay)))) ||
        showInvalidDateRangeError ||
        isLoading
      }
    />
  {/if}
{:else}
  <Heading label="Sign In" />
  <InfoCard>
    <p><Link link="/sign-in" label="Sign in" /> to start managing your books</p>
  </InfoCard>
{/if}