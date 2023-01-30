<script lang="ts">
  // svelte
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // api
  import { insertRecords, updateRecords } from 'src/api/database';

  // helpers
  import { getDateDifference, formatDate } from 'src/helpers/helpers';

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
  export let userBook: any;
  export let book: any;

  // state
  let isLoading: boolean = false;

  const dateDifference = getDateDifference(book.release_date);

  let today: any = new Date();
  today.setHours(0);

  let startYear: number = today.getUTCFullYear();
  let startMonth: number = today.getUTCMonth() + 1;
  let startDay: number = today.getUTCDate();

  let endYear: number = today.getUTCFullYear();
  let endMonth: number = today.getUTCMonth() + 1;
  let endDay: number = today.getUTCDate();

  if (userBook && userBook.user_book_status.status !== E_BookStatus.TO_READ.text) {
    if (userBook.user_book_status.start_date) {
      startYear = new Date(userBook.user_book_status.start_date).getUTCFullYear();
      startMonth = new Date(userBook.user_book_status.start_date).getUTCMonth() + 1;
      startDay = new Date(userBook.user_book_status.start_date).getUTCDate();
    }
  }
  
  if (userBook && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)) {
    if (userBook.user_book_status.end_date) {
      endYear = new Date(userBook.user_book_status.end_date).getUTCFullYear();
      endMonth = new Date(userBook.user_book_status.end_date).getUTCMonth() + 1;
      endDay = new Date(userBook.user_book_status.end_date).getUTCDate();
    }
  }

  let showInvalidDateRangeError: boolean = false;

  $: {
    if (showInvalidDateRangeError) setTimeout(() => showInvalidDateRangeError = false, 2000);
  }

  onMount(() => {
    // grab records for timeline
  });

  const handleUpdateUserBook = async () => {
    isLoading = true;

    const _dateDifference: any = getDateDifference(new Date(startYear, startMonth-1, startDay), new Date(endYear, endMonth-1, endDay));

    if (_dateDifference.differenceDays < 0) {
      showInvalidDateRangeError = true;
      isLoading = false;
      return;
    }

    const userBookStatus: string = userBook.user_book_status.status;

    if (userBookStatus === E_BookStatus.READING.text) {
      const updatedUserBookStatusData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
      };

      const latestUserBookStatusRecords = await updateRecords('user_book_status', [updatedUserBookStatusData], { id: userBook.latest_user_book_status_id });

      userBook.user_book_status = latestUserBookStatusRecords[0];
    } else if (userBookStatus === E_BookStatus.READ.text) {
      const updatedUserBookReadData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const updatedUserBookStatusData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const [
        latestUserBookReadRecords,
        latestUserBookStatusRecords
      ] = await Promise.all([
        updateRecords('user_book_read', [updatedUserBookReadData], { id: userBook.latest_user_book_read_id }),
        updateRecords('user_book_status', [updatedUserBookStatusData], { id: userBook.latest_user_book_status_id }),
      ]);

      userBook.user_book_read = latestUserBookReadRecords[0];
      userBook.user_book_status = latestUserBookStatusRecords[0];
    } else if (userBookStatus === E_BookStatus.DNF.text) {
      const updatedUserBookStatusData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const latestUserBookStatusRecords = await updateRecords('user_book_status', [updatedUserBookStatusData], { id: userBook.latest_user_book_status_id });

      userBook.user_book_status = latestUserBookStatusRecords[0];
    }

    isLoading = false;
  }

  const handleTrackingStatus = async (status: string) => {
    isLoading = true;

    const _today: any = new Date();
    _today.setHours(0);

    if (userBook) {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const updatedUserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const userBookStatus: string = userBook.user_book_status.status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (userBookStatus === E_BookStatus.READING.text) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.READ.text) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.DNF.text) {
        minusProfileAttribute = 'book_status_dnf_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_dnf_count';
        minusBookCount = book[minusBookAttribute] - 1;
      }

      const updatedProfileData: any = {
        book_status_to_read_count: userProfile.book_status_to_read_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      const updatedBookData: any = {
        status_to_read_count: book.status_to_read_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book', [updatedUserBookData], { user_id: session.user.id, book_id: book.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = latestUserBookRecords[0];
    } else {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const UserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const updatedProfileData: any = {
        book_status_to_read_count: userProfile.book_status_to_read_count + 1,
      };

      const updatedBookData: any = {
        status_to_read_count: book.status_to_read_count + 1,
      };

      const [
        newUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('user_book', [UserBookData], `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = newUserBookRecords[0];
    }

    startYear = _today.getUTCFullYear();
    startMonth = _today.getUTCMonth() + 1;
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = _today.getUTCMonth() + 1;
    endDay = _today.getUTCDate();

    isLoading = false;
  }

  const handleToReadStatus = async (status: string) => {
    isLoading = true;

    const _today: any = new Date();
    _today.setHours(0);

    if (userBook) {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const updatedUserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const userBookStatus: string = userBook.user_book_status.status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (userBookStatus === E_BookStatus.TO_READ.text) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.READING.text) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.READ.text) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.DNF.text) {
        minusProfileAttribute = 'book_status_dnf_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_dnf_count';
        minusBookCount = book[minusBookAttribute] - 1;
      }

      const updatedProfileData: any = {
        book_status_tracking_count: userProfile.book_status_tracking_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      const updatedBookData: any = {
        status_tracking_count: book.status_tracking_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book', [updatedUserBookData], { user_id: session.user.id, book_id: book.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = latestUserBookRecords[0];
    } else {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const UserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const updatedProfileData: any = {
        book_status_tracking_count: userProfile.book_status_tracking_count + 1,
      };

      const updatedBookData: any = {
        status_tracking_count: book.status_tracking_count + 1,
      };

      const [
        newUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('user_book', [UserBookData], `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = newUserBookRecords[0];
    }

    startYear = _today.getUTCFullYear();
    startMonth = _today.getUTCMonth() + 1;
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = _today.getUTCMonth() + 1;
    endDay = _today.getUTCDate();

    isLoading = false;
  }

  const handleReadingStatus = async (status: string) => {
    isLoading = true;

    const _today: any = new Date();
    _today.setHours(0);

    if (userBook) {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
        start_date: _today,
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const updatedUserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const userBookStatus: string = userBook.user_book_status.status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (userBookStatus === E_BookStatus.TRACKING.text) {
        minusProfileAttribute = 'book_status_tracking_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_tracking_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.TO_READ.text) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.READ.text) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.DNF.text) {
        minusProfileAttribute = 'book_status_dnf_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_dnf_count';
        minusBookCount = book[minusBookAttribute] - 1;
      }

      const updatedProfileData: any = {
        book_status_reading_count: userProfile.book_status_reading_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      const updatedBookData: any = {
        status_reading_count: book.status_reading_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book', [updatedUserBookData], { user_id: session.user.id, book_id: book.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = latestUserBookRecords[0];
    } else {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
        start_date: _today,
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const UserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const updatedProfileData: any = {
        book_status_reading_count: userProfile.book_status_reading_count + 1,
      };

      const updatedBookData: any = {
        status_reading_count: book.status_reading_count + 1,
      };

      const [
        newUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('user_book', [UserBookData], `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = newUserBookRecords[0];
    }

    startYear = _today.getUTCFullYear();
    startMonth = _today.getUTCMonth() + 1;
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = _today.getUTCMonth() + 1;
    endDay = _today.getUTCDate();

    isLoading = false;
  }

  const handleReadStatus = async (status: string) => {
    isLoading = true;

    if (userBook) {
      const UserBookreadData: any = {
        user_id: session.user.id,
        book_id: book.id,
        start_date: userBook.user_book_status.status === E_BookStatus.READING.text ? userBook.user_book_status.start_date : new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
        start_date: userBook.user_book_status.status === E_BookStatus.READING.text ? userBook.user_book_status.start_date : new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const [
        newUserBookReadRecord,
        newUserBookStatusRecord
      ] = await Promise.all([
        insertRecords('user_book_read', [UserBookreadData]),
        insertRecords('user_book_status', [UserBookstatusData]),
      ]);

      const updatedUserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
        latest_user_book_read_id: newUserBookReadRecord[0].id,
        read_count: userBook.read_count + 1,
      };

      const userBookStatus: string = userBook.user_book_status.status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (userBookStatus === E_BookStatus.TRACKING.text) {
        minusProfileAttribute = 'book_status_tracking_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_tracking_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.TO_READ.text) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.READING.text) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.DNF.text) {
        minusProfileAttribute = 'book_status_dnf_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_dnf_count';
        minusBookCount = book[minusBookAttribute] - 1;
      }

      const updatedProfileData: any = {
        book_unique_read_count: userBook.read_count === 0 ? userProfile.book_unique_read_count + 1 : userProfile.book_unique_read_count,
        book_status_read_count: userProfile.book_status_read_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      const updatedBookData: any = {
        read_count: book.read_count + 1,
        unique_read_count: userBook.read_count === 0 ? book.unique_read_count + 1 : book.unique_read_count,
        status_read_count: book.status_read_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book', [updatedUserBookData], { user_id: session.user.id, book_id: book.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = latestUserBookRecords[0];
    } else {
      const UserBookreadData: any = {
        user_id: session.user.id,
        book_id: book.id,
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const [
        newUserBookReadRecord,
        newUserBookStatusRecord
      ] = await Promise.all([
        insertRecords('user_book_read', [UserBookreadData]),
        insertRecords('user_book_status', [UserBookstatusData]),
      ]);

      const UserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
        latest_user_book_read_id: newUserBookReadRecord[0].id,
        read_count: 1,
      };

      const updatedProfileData: any = {
        book_unique_read_count: userProfile.book_unique_read_count + 1,
        book_status_read_count: userProfile.book_status_read_count + 1,
      };

      const updatedBookData: any = {
        read_count: book.read_count + 1,
        unique_read_count: book.unique_read_count + 1,
        status_read_count: book.status_read_count + 1,
      };

      const [
        newUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('user_book', [UserBookData], `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = newUserBookRecords[0];
    }

    isLoading = false;
  }

  const handleDNFStatus = async (status: string) => {
    isLoading = true;

    if (userBook) {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
        start_date: userBook.user_book_status.status === E_BookStatus.READING.text ? userBook.user_book_status.start_date : new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const updatedUserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const userBookStatus: string = userBook.user_book_status.status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (userBookStatus === E_BookStatus.TRACKING.text) {
        minusProfileAttribute = 'book_status_tracking_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_tracking_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.TO_READ.text) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.READING.text) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = book[minusBookAttribute] - 1;
      } else if (userBookStatus === E_BookStatus.READ.text) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = userProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = book[minusBookAttribute] - 1;
      }

      const updatedProfileData: any = {
        book_status_dnf_count: userProfile.book_status_dnf_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      const updatedBookData: any = {
        status_dnf_count: book.status_dnf_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('user_book', [updatedUserBookData], { user_id: session.user.id, book_id: book.id }, `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = latestUserBookRecords[0];
    } else {
      const UserBookstatusData: any = {
        user_id: session.user.id,
        book_id: book.id,
        status,
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const newUserBookStatusRecord = await insertRecords('user_book_status', [UserBookstatusData]);

      const UserBookData: any = {
        user_id: session.user.id,
        book_id: book.id,
        latest_user_book_status_id: newUserBookStatusRecord[0].id,
      };

      const updatedProfileData: any = {
        book_status_dnf_count: userProfile.book_status_dnf_count + 1,
      };

      const updatedBookData: any = {
        status_dnf_count: book.status_dnf_count + 1,
      };

      const [
        newUserBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('user_book', [UserBookData], `*, user_book_status(*), user_book_read(*), user_book_rating(*), user_book_review(*)`),
        updateRecords('user_profile', updatedProfileData, { id: userProfile.id }),
        updateRecords('book', updatedBookData, { id: book.id }),
      ]);

      book = latestBookRecords[0];
      userProfile = latestProfileRecords[0];
      userBook = newUserBookRecords[0];
    }

    isLoading = false;
  }
</script>

{#if session}
  {#if userBook}
    <SuccessCard>
      <div class="w-full flex flex-col gap-2">
        <p class="dark:text-white w-full">You marked this book as <span class="st-font-italic">{userBook.user_book_status.status}</span></p>
        <p class="dark:text-white text-sm w-full">Last updated {formatDate(userBook.user_book_status.updated_at, true)}</p>
      </div>
    </SuccessCard>
  {:else}
    <InfoCard>
      <p class="dark:text-white w-full">You can mark a status for this book</p>
    </InfoCard>
  {/if}
  <div class="flex flex-col md:flex-row gap-2 w-full">
    <Button
      label={E_BookStatus.TRACKING.text}
      handleClick={async () => await handleTrackingStatus(E_BookStatus.TRACKING.text)}
      isSelected={userBook && userBook.user_book_status.status === E_BookStatus.TRACKING.text}
      isDisabled={isLoading}
    />
    <Button
      label={E_BookStatus.TO_READ.text}
      handleClick={async () => await handleToReadStatus(E_BookStatus.TO_READ.text)}
      isSelected={userBook && userBook.user_book_status.status === E_BookStatus.TO_READ.text}
      isDisabled={isLoading}
    />
    {#if userProfile && (dateDifference?.differenceDays >= 0)}
      <Button
        label={E_BookStatus.READING.text}
        handleClick={async () => await handleReadingStatus(E_BookStatus.READING.text)}
        isSelected={userBook && userBook.user_book_status.status === E_BookStatus.READING.text}
        isDisabled={isLoading}
      />
      <Button
        label={E_BookStatus.READ.text}
        handleClick={async () => await handleReadStatus(E_BookStatus.READ.text)}
        isSelected={userBook && userBook.user_book_status.status === E_BookStatus.READ.text}
        isDisabled={isLoading}
      />
      <Button
        label={E_BookStatus.DNF.text}
        handleClick={async () => await handleDNFStatus(E_BookStatus.DNF.text)}
        isSelected={userBook && userBook.user_book_status.status === E_BookStatus.DNF.text}
        isDisabled={isLoading}
      />
    {/if}
  </div>
  {#if userProfile && (dateDifference?.differenceDays < 0)}
    <InfoCard>
      <p class="dark:text-white">You can start marking this book as <span class="st-font-italic">{E_BookStatus.READING.text}</span>, <span class="st-font-italic">{E_BookStatus.READ.text}</span>, or <span class="st-font-italic">{E_BookStatus.DNF.text}</span> after publication</p>
    </InfoCard>
  {/if}
  {#if (userBook && userBook.user_book_status.status !== E_BookStatus.TO_READ.text)}
    <DatePicker
      label="Start Date"
      bind:year={startYear}
      bind:month={startMonth}
      bind:day={startDay}
      bind:showError={showInvalidDateRangeError}
    />
  {/if}
  {#if userBook && (userBook.user_book_status.status === E_BookStatus.READ.text || userBook.user_book_status.status === E_BookStatus.DNF.text)}
    <DatePicker
      label="End Date"
      bind:year={endYear}
      bind:month={endMonth}
      bind:day={endDay}
      bind:showError={showInvalidDateRangeError}
    />
  {/if}
  {#if (userBook && userBook.user_book_status.status !== E_BookStatus.TO_READ.text)}
    {#if showInvalidDateRangeError}
      <ErrorCard>
        <p>{userBook.user_book_status.status === E_BookStatus.READING.text ? 'Start date cannot be after current date' : 'Start date cannot be after end date'}</p>
      </ErrorCard>
    {/if}
  {/if}
  {#if userBook && userBook.user_book_status.status !== E_BookStatus.TO_READ.text}
    <Button
      label="Update Status"
      handleClick={async () => await handleUpdateUserBook()}
      isDisabled={
        (userBook.user_book_status.status === E_BookStatus.READING.text && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(userBook.user_book_status.start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth-1, startDay))) ||
        (userBook.user_book_status.status !== E_BookStatus.READING.text && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(userBook.user_book_status.start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth-1, startDay)) &&
        (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(userBook.user_book_status.end_date)) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(endYear, endMonth-1, endDay)))) ||
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