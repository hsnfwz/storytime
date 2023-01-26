<script lang="ts">
  // api
  import { insertRecords, updateRecords, getRecords, deleteRecords } from 'src/api/database';

  // stores
  import { profile } from 'src/stores/ProfileStore';

  // enums
  import E_BookStatus from 'src/enums/E_BookStatus';
  import E_Rating from 'src/enums/E_Rating';

  // interfaces
  import type I_Profile from 'src/interfaces/I_Profile';

  // components
  import ItemCard from 'src/components/ItemCard.svelte';
  import DatePicker from 'src/components/DatePicker.svelte';
  import Slider from 'src/components/Slider.svelte';
  import Card from 'src/components/Card.svelte';
  import Button from 'src/components/Button.svelte';
  import InfoCard from 'src/components/InfoCard.svelte';
  import SuccessCard from 'src/components/SuccessCard.svelte';
  import ErrorCard from 'src/components/ErrorCard.svelte';
  import Link from 'src/components/Link.svelte';
  import Heading from 'src/components/Heading.svelte';
  import PlusButton from 'src/components/PlusButton.svelte';
  import MinusButton from 'src/components/MinusButton.svelte';
  import VerticalDivider from 'src/components/VerticalDivider.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';
  import EditButton from 'src/components/EditButton.svelte';
  import Modal from 'src/components/Modal.svelte';
  import TextareaInput from 'src/components/TextareaInput.svelte';
  import TextInput from 'src/components/TextInput.svelte';

  // helpers
  import { formatDate, getItemRatingsAverage, getItemTotalRatings, getDateDifference, getCurrentEnvironment } from 'src/helpers/helpers';

  // data
  export let data: { item: any };

  // state
  let currentProfile: I_Profile | undefined;
  let profileBook: any;

  let showInvalidDateRangeError: boolean = false;
  let isLoading: boolean = false;

  $: {
    if (showInvalidDateRangeError) setTimeout(() => showInvalidDateRangeError = false, 2000);
  }

  let today: any = new Date();
  today.setHours(0);

  let startYear: number = today.getUTCFullYear();
  let startMonth: number = today.getUTCMonth() + 1;
  let startDay: number = today.getUTCDate();

  let endYear: number = today.getUTCFullYear();
  let endMonth: number = today.getUTCMonth() + 1;
  let endDay: number = today.getUTCDate();

  let rating: number = 5;
  let review: string = '';

  let bookCollections: any = [];
  let bookCollectionIds: any = [];

  let isFollowing: boolean = false;
  let bookCollectionTitle: string = '';
  let bookCollectionDescription: string = '';

  let expandStatusCard: boolean = false;
  let expandCollectionsCard: boolean = false;
  let expandRatingCard: boolean = false;
  let expandReviewCard: boolean = false;

  let showStatusModal: boolean = false;
  let showCollectionsModal: boolean = false;
  let showRatingModal: boolean = false;
  let showReviewModal: boolean = false;

  const dateDifference = getDateDifference(data.item.release_date);

  profile.subscribe(async (value) => {
    if (!currentProfile && value) {
      const [
        bookCollectionRecords,
        bookCollectionBookRecords,
        profileBookRecords,
      ] = await Promise.all([
        getRecords(
          'book_collection',
          `id, title, total_count`,
          {
            profile_id: value.id,
          },
          {
            column: 'title',
            ascending: true
          },
        ),
        getRecords(
          'book_collection_book',
          `id, book_collection_id`,
          {
            profile_id: value.id,
            book_id: data.item.id,
          },
        ),
        getRecords(
          'profile_book',
          `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`,
          {
            profile_id: value.id,
            book_id: data.item.id,
          },
        ),
      ]);

      bookCollections = bookCollectionRecords;
      bookCollectionIds = bookCollectionBookRecords.map((bookCollectionBook: any) => bookCollectionBook.book_collection_id);

      if (profileBookRecords[0]) {
        profileBook = profileBookRecords[0];

        if (profileBook[`${getCurrentEnvironment()}_rating_instance`]) {
          rating = profileBook[`${getCurrentEnvironment()}_rating_instance`].rating;
        }

        if (profileBook[`${getCurrentEnvironment()}_review_instance`]) {
          review = profileBook[`${getCurrentEnvironment()}_review_instance`].review;
        }

        if (profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.TO_READ.text) {
          if (profileBook[`${getCurrentEnvironment()}_status_instance`].start_date) {
            startYear = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date).getUTCFullYear();
            startMonth = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date).getUTCMonth() + 1;
            startDay = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date).getUTCDate();
          }
        }
        
        if ((profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ.text) || (profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF.text)) {
          if (profileBook[`${getCurrentEnvironment()}_status_instance`].end_date) {
            endYear = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date).getUTCFullYear();
            endMonth = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date).getUTCMonth() + 1;
            endDay = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date).getUTCDate();
          }
        }
      }
      
      currentProfile = value;
    } else if (currentProfile) {
      currentProfile = value;
    }
  });

  const handleAddToCollection = async (bookCollection: any) => {
    isLoading = true;

    const bookCollectionBookData: any = {
      profile_id: currentProfile.id,
      book_id: data.item.id,
      book_collection_id: bookCollection.id,
    }

    const updatedBookCollectionData: any = {
      total_count: bookCollection.total_count + 1,
    };

    const [
      newBookCollectionBookRecords,
      latestBookCollectionRecords
    ] = await Promise.all([
      insertRecords('book_collection_book', [bookCollectionBookData]),
      updateRecords('book_collection', [updatedBookCollectionData], { id: bookCollection.id }),
    ]);

    const index = bookCollections.findIndex((previousBookCollection: any) => previousBookCollection.id === bookCollection.id);
    bookCollections[index] = latestBookCollectionRecords[0];
    bookCollectionIds = [ ...bookCollectionIds, bookCollection.id ];

    isLoading = false;
  }

  const handleRemoveFromCollection = async (bookCollection: any) => {
    isLoading = true;

    const updatedBookCollectionData: any = {
      total_count: bookCollection.total_count - 1,
    };

    const [
      deletedBookCollectionBookRecords,
      latestBookCollectionRecords
    ] = await Promise.all([
      deleteRecords('book_collection_book', { book_collection_id: bookCollection.id, book_id: data.item.id }),
      updateRecords('book_collection', [updatedBookCollectionData], { id: bookCollection.id }),
    ]);

    const index = bookCollections.findIndex((previousBookCollection: any) => previousBookCollection.id === bookCollection.id);
    bookCollections[index] = latestBookCollectionRecords[0];
    bookCollectionIds = bookCollectionIds.filter((bookCollectionBookId: number) => bookCollectionBookId !== bookCollection.id);

    isLoading = false;
  }

  const handleUpdateProfileBook = async () => {
    isLoading = true;

    const _dateDifference: any = getDateDifference(new Date(startYear, startMonth-1, startDay), new Date(endYear, endMonth-1, endDay));

    if (_dateDifference.differenceDays < 0) {
      showInvalidDateRangeError = true;
      isLoading = false;
      return;
    }

    const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

    if (profileBookStatus === E_BookStatus.READING.text) {
      // status instance
      const updatedStatusInstanceData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
      };

      const latestStatusInstanceRecords = await updateRecords('status_instance', [updatedStatusInstanceData], { id: profileBook.latest_status_instance_id });

      profileBook[`${getCurrentEnvironment()}_status_instance`] = latestStatusInstanceRecords[0];
    } else if (profileBookStatus === E_BookStatus.READ.text) {
      // read instance
      const updatedReadInstanceData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      // status instance
      const updatedStatusInstanceData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const [
        latestReadInstanceRecords,
        latestStatusInstanceRecords
      ] = await Promise.all([
        updateRecords('read_instance', [updatedReadInstanceData], { id: profileBook.latest_read_instance_id }),
        updateRecords('status_instance', [updatedStatusInstanceData], { id: profileBook.latest_status_instance_id }),
      ]);

      profileBook[`${getCurrentEnvironment()}_read_instance`] = latestReadInstanceRecords[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = latestStatusInstanceRecords[0];
    } else if (profileBookStatus === E_BookStatus.DNF.text) {
      // status instance
      const updatedStatusInstanceData: any = {
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const latestStatusInstanceRecords = await updateRecords('status_instance', [updatedStatusInstanceData], { id: profileBook.latest_status_instance_id });

      profileBook[`${getCurrentEnvironment()}_status_instance`] = latestStatusInstanceRecords[0];
    }

    isLoading = false;
  }

  const handleDeleteProfileBook = async () => {
    isLoading = true;

    const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

    let profileCountAttribute: string = '';
    let profileCountValue: number = 0;

    let bookCountAttribute: string = '';
    let bookCountValue: number = 0;

    if (profileBookStatus === E_BookStatus.READING.text) {
      profileCountAttribute = 'book_status_reading_count';
      profileCountValue = currentProfile.book_status_reading_count - 1;
      bookCountAttribute = 'status_reading_count';
      bookCountValue = data.item.status_reading_count - 1;
    } else if (profileBookStatus === E_BookStatus.TO_READ.text) {
      profileCountAttribute = 'book_status_to_read_count';
      profileCountValue = currentProfile.book_status_to_read_count - 1;
      bookCountAttribute = 'status_to_read_count';
      bookCountValue = data.item.status_to_read_count - 1;
    } else if (profileBookStatus === E_BookStatus.READ.text) {
      profileCountAttribute = 'book_status_read_count';
      profileCountValue = currentProfile.book_status_read_count - 1;
      bookCountAttribute = 'status_read_count';
      bookCountValue = data.item.status_read_count - 1;
    } else if (profileBookStatus === E_BookStatus.DNF.text) {
      profileCountAttribute = 'book_status_dnf_count';
      profileCountValue = currentProfile.book_status_dnf_count - 1;
      bookCountAttribute = 'status_dnf_count';
      bookCountValue = data.item.status_dnf_count - 1;
    }

    const hasRead = profileBook.read_count > 0;
    const hasRated = profileBook[`${getCurrentEnvironment()}_rating_instance`];
    const hasReviewed = profileBook[`${getCurrentEnvironment()}_review_instance`];

    const updatedProfileData = {
      [profileCountAttribute]: profileCountValue,
      book_unique_read_count: hasRead ? currentProfile.book_unique_read_count - 1 : currentProfile.book_unique_read_count,
      [`book_rating_${rating}_count`]: hasRated ? currentProfile[`book_rating_${rating}_count`] - 1 : currentProfile[`book_rating_${rating}_count`],
      book_review_count: hasReviewed ? currentProfile.book_review_count - 1 : currentProfile.book_review_count,
    };

    const updatedBookData = {
      [bookCountAttribute]: bookCountValue,
      unique_read_count: hasRead ? data.item.unique_read_count - 1 : data.item.unique_read_count,
      read_count: hasRead ? data.item.read_count - profileBook.read_count : data.item.read_count,
      [`rating_${rating}_count`]: hasRated ? data.item[`rating_${rating}_count`] - 1 : data.item[`rating_${rating}_count`],
      review_count: hasReviewed ? data.item.review_count - 1 : data.item.review_count,
    };

    await deleteRecords('profile_book', { id: profileBook.id });
    await Promise.all([
      deleteRecords('read_instance', { profile_id: currentProfile.id, book_id: data.item.id }),
      deleteRecords('status_instance', { profile_id: currentProfile.id, book_id: data.item.id }),
      deleteRecords('rating_instance', { profile_id: currentProfile.id, book_id: data.item.id }),
      deleteRecords('review_instance', { profile_id: currentProfile.id, book_id: data.item.id }),
    ]);
    const [
      updatedProfileRecord,
      updatedBookRecord,
    ] = await Promise.all([
      updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
      updateRecords('book', updatedBookData, { id: data.item.id }),
    ]);

    profile.set(updatedProfileRecord[0]);
    data.item = updatedBookRecord[0];
    profileBook = undefined;

    const _today: any = new Date();
    _today.setHours(0);
    
    startYear = _today.getUTCFullYear();
    startMonth = _today.getUTCMonth() + 1;
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = _today.getUTCMonth() + 1;
    endDay = _today.getUTCDate();

    rating = 5;
    review = '';

    isLoading = false;
  }

  const handleToReadStatus = async (status: string) => {
    isLoading = true;

    const _today: any = new Date();
    _today.setHours(0);

    if (profileBook) {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
      };

      const newStatusInstanceRecord = await insertRecords('status_instance', [statusInstanceData]);

      // profile book
      const updatedProfileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
      };

      const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (profileBookStatus === E_BookStatus.READING.text) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READ.text) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.DNF.text) {
        minusProfileAttribute = 'book_status_dnf_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_dnf_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      }

      // profile
      const updatedProfileData: any = {
        book_status_to_read_count: currentProfile.book_status_to_read_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      // book
      const updatedBookData: any = {
        status_to_read_count: data.item.status_to_read_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }, `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = latestProfileBookRecords[0];
    } else {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
      };

      const newStatusInstanceRecord = await insertRecords('status_instance', [statusInstanceData]);

      // profile book
      const profileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
      };

      // profile
      const updatedProfileData: any = {
        book_status_to_read_count: currentProfile.book_status_to_read_count + 1,
      };

      // book
      const updatedBookData: any = {
        status_to_read_count: data.item.status_to_read_count + 1,
      };

      const [
        newProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData], `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = newProfileBookRecords[0];
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

    if (profileBook) {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: _today,
      };

      const newStatusInstanceRecord = await insertRecords('status_instance', [statusInstanceData]);

      // profile book
      const updatedProfileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
      };

      const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (profileBookStatus === E_BookStatus.TO_READ.text) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READ.text) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.DNF.text) {
        minusProfileAttribute = 'book_status_dnf_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_dnf_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      }

      // profile
      const updatedProfileData: any = {
        book_status_reading_count: currentProfile.book_status_reading_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      // book
      const updatedBookData: any = {
        status_reading_count: data.item.status_reading_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }, `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = latestProfileBookRecords[0];
    } else {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: _today,
      };

      const newStatusInstanceRecord = await insertRecords('status_instance', [statusInstanceData]);

      // profile book
      const profileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
      };

      // profile
      const updatedProfileData: any = {
        book_status_reading_count: currentProfile.book_status_reading_count + 1,
      };

      // book
      const updatedBookData: any = {
        status_reading_count: data.item.status_reading_count + 1,
      };

      const [
        newProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData], `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = newProfileBookRecords[0];
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

    if (profileBook) {
      // read instance
      const readInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        start_date: profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING.text ? profileBook[`${getCurrentEnvironment()}_status_instance`].start_date : new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING.text ? profileBook[`${getCurrentEnvironment()}_status_instance`].start_date : new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const [
        newReadInstanceRecord,
        newStatusInstanceRecord
      ] = await Promise.all([
        insertRecords('read_instance', [readInstanceData]),
        insertRecords('status_instance', [statusInstanceData]),
      ]);

      // profile book
      const updatedProfileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
        latest_read_instance_id: newReadInstanceRecord[0].id,
        read_count: profileBook.read_count + 1,
      };

      const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (profileBookStatus === E_BookStatus.TO_READ.text) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READING.text) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.DNF.text) {
        minusProfileAttribute = 'book_status_dnf_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_dnf_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      }

      // profile
      const updatedProfileData: any = {
        book_unique_read_count: profileBook.read_count === 0 ? currentProfile.book_unique_read_count + 1 : currentProfile.book_unique_read_count,
        book_status_read_count: currentProfile.book_status_read_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      // book
      const updatedBookData: any = {
        read_count: data.item.read_count + 1,
        unique_read_count: profileBook.read_count === 0 ? data.item.unique_read_count + 1 : data.item.unique_read_count,
        status_read_count: data.item.status_read_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }, `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = latestProfileBookRecords[0];
    } else {
      // read instance
      const readInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const [
        newReadInstanceRecord,
        newStatusInstanceRecord
      ] = await Promise.all([
        insertRecords('read_instance', [readInstanceData]),
        insertRecords('status_instance', [statusInstanceData]),
      ]);

      // profile book
      const profileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
        latest_read_instance_id: newReadInstanceRecord[0].id,
        read_count: 1,
      };

      // profile
      const updatedProfileData: any = {
        book_unique_read_count: currentProfile.book_unique_read_count + 1,
        book_status_read_count: currentProfile.book_status_read_count + 1,
      };

      // book
      const updatedBookData: any = {
        read_count: data.item.read_count + 1,
        unique_read_count: data.item.unique_read_count + 1,
        status_read_count: data.item.status_read_count + 1,
      };

      const [
        newProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData], `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = newProfileBookRecords[0];
    }

    isLoading = false;
  }

  const handleDNFStatus = async (status: string) => {
    isLoading = true;

    if (profileBook) {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING.text ? profileBook[`${getCurrentEnvironment()}_status_instance`].start_date : new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const newStatusInstanceRecord = await insertRecords('status_instance', [statusInstanceData]);

      // profile book
      const updatedProfileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
      };

      const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

      let minusProfileAttribute: string = '';
      let minusProfileCount: number = 0;

      let minusBookAttribute: string = '';
      let minusBookCount: number = 0;

      if (profileBookStatus === E_BookStatus.TO_READ.text) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READING.text) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READ.text) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      }

      // profile
      const updatedProfileData: any = {
        book_status_dnf_count: currentProfile.book_status_dnf_count + 1,
        [minusProfileAttribute]: minusProfileCount,
      };

      // book
      const updatedBookData: any = {
        status_dnf_count: data.item.status_dnf_count + 1,
        [minusBookAttribute]: minusBookCount,
      };

      const [
        latestProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }, `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = latestProfileBookRecords[0];
    } else {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: new Date(startYear, startMonth-1, startDay),
        end_date: new Date(endYear, endMonth-1, endDay),
      };

      const newStatusInstanceRecord = await insertRecords('status_instance', [statusInstanceData]);

      // profile book
      const profileBookData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        latest_status_instance_id: newStatusInstanceRecord[0].id,
      };

      // profile
      const updatedProfileData: any = {
        book_status_dnf_count: currentProfile.book_status_dnf_count + 1,
      };

      // book
      const updatedBookData: any = {
        status_dnf_count: data.item.status_dnf_count + 1,
      };

      const [
        newProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData], `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = newProfileBookRecords[0];
    }

    isLoading = false;
  }

  const handleRatingInstance = async () => {
    isLoading = true;

    if (profileBook && profileBook[`${getCurrentEnvironment()}_rating_instance`]) {
      // ...
    } else if (profileBook && !profileBook[`${getCurrentEnvironment()}_rating_instance`]) {
      // rating instance
      const ratingInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        rating,
      };

      const newRatingInstanceRecords = await insertRecords('rating_instance', [ratingInstanceData]);

      // profile book
      const updatedProfileBookData: any = {
        latest_rating_instance_id: newRatingInstanceRecords[0].id,
      };

      // profile
      const updatedProfileData: any = {
        [`book_rating_${rating}_count`]: currentProfile[`book_rating_${rating}_count`] + 1,
      };

      // book
      const updatedBookData: any = {
        [`rating_${rating}_count`]: data.item[`rating_${rating}_count`] + 1,
      };

      const [
        latestProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('profile_book', updatedProfileBookData, { id: profileBook.id }, `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = latestProfileBookRecords[0];
    }

    rating = profileBook[`${getCurrentEnvironment()}_rating_instance`].rating;

    isLoading = false;
  }

  const handleReviewInstance = async () => {
    isLoading = true;

    if (profileBook && profileBook[`${getCurrentEnvironment()}_review_instance`]) {
      // ...
    } else if (profileBook && !profileBook[`${getCurrentEnvironment()}_review_instance`]) {
      // review instance
      const reviewInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        review,
      };

      const newReviewInstanceRecords = await insertRecords('review_instance', [reviewInstanceData]);

      // profile book
      const updatedProfileBookData: any = {
        latest_review_instance_id: newReviewInstanceRecords[0].id,
      };

      // profile
      const updatedProfileData: any = {
        book_review_count: currentProfile.book_review_count + 1,
      };

      // book
      const updatedBookData: any = {
        review_count: data.item.review_count + 1,
      };

      const [
        latestProfileBookRecords,
        latestProfileRecords,
        latestBookRecords
      ] = await Promise.all([
        updateRecords('profile_book', updatedProfileBookData, { id: profileBook.id }, `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_read_instance (*), ${getCurrentEnvironment()}_rating_instance (*), ${getCurrentEnvironment()}_review_instance (*)`),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecords[0];
      profile.set(latestProfileRecords[0]);
      profileBook = latestProfileBookRecords[0];
    }

    review = profileBook[`${getCurrentEnvironment()}_review_instance`].review;

    isLoading = false;
  }

  const handleTrackingStatus = async (status: string) => {
    console.log(status);
  }
</script>

<div class="flex flex-col items-center md:flex-row md:justify-center md:items-start gap-4">
  <div class="w-full md:max-w-[300px]">
    <ItemCard item={data.item} />
  </div>
  <VerticalDivider />
  <div class="w-full flex flex-col items-center gap-4 md:max-w-[600px]">
    <Card>
      <Heading label={data.item.title} />
      <div class="w-full flex flex-col gap-2">
        {#if dateDifference?.differenceDays < 0}
          <p class="w-full dark:text-white">
            Expected Publication {formatDate(data.item.release_date)} ({dateDifference.differenceDaysAbs === 1 ? `${dateDifference.differenceDaysAbs} day` : `${dateDifference.differenceDaysAbs} days`})
          </p>
        {:else}
          <p class="w-full dark:text-white">
            Published {formatDate(data.item.release_date)}
          </p>
        {/if}
        {#if getItemTotalRatings(data.item) !== 0}
          <p class="w-full dark:text-white">{getItemRatingsAverage(data.item)} / 10</p>
        {/if}
      </div>
      <div class="w-full flex flex-col gap-2">
        <p class="w-full dark:text-white">{getItemTotalRatings(data.item) === 1 ? `${getItemTotalRatings(data.item)} rating`: `${getItemTotalRatings(data.item)} ratings`}</p>
        <p class="w-full dark:text-white">{data.item.review_count ===  1 ? `${data.item.review_count} review` : `${data.item.review_count} reviews`}</p>
        <p class="w-full dark:text-white">{data.item.status_to_read_count === 1 ? `${data.item.status_to_read_count} to read status` : `${data.item.status_to_read_count} to read statuses`}</p>
        <p class="w-full dark:text-white">{data.item.status_reading_count === 1 ? `${data.item.status_reading_count} reading status` : `${data.item.status_reading_count} reading statuses`}</p>
        <p class="w-full dark:text-white">{data.item.status_read_count === 1 ? `${data.item.status_read_count} read status` : `${data.item.status_read_count} read statuses`}</p>
        <p class="w-full dark:text-white">{data.item.status_dnf_count === 1 ? `${data.item.status_dnf_count} dnf status` : `${data.item.status_dnf_count} dnf statuses`}</p>
        <p class="w-full dark:text-white">{data.item.unique_read_count === 1 ? `${data.item.unique_read_count} unique read` : `${data.item.unique_read_count} unique reads`}</p>
        <p class="w-full dark:text-white">{data.item.read_count === 1 ? `${data.item.read_count} total read` : `${data.item.read_count} total reads`}</p>
      </div>
    </Card>
    <HorizontalDivider />
    <Card>
      <Heading label="More Info" />
      <div class="w-full flex flex-col gap-2">
        <Link link="/" label="Ratings" />
        <Link link="/" label="Reviews" />
        <Link link="/" label="Discussions" />
        <Link link="/" label="Statistics" />
      </div>
    </Card>
  </div>
  <VerticalDivider />
  {#if currentProfile}
    <div class="w-full flex flex-col gap-4 md:max-w-[300px]">
      <Card>
        <div class="w-full flex justify-between items-center">
          <Heading label="Status" />
          <EditButton handleClick={() => showStatusModal = true} />
        </div>
        <Modal
          label="Status"
          showModal={showStatusModal}
          handleSubmit={() => showStatusModal = false}
          handleCancel={() => showStatusModal = false}
        >
          {#if profileBook}
            <SuccessCard>
              <p class="dark:text-white">
                You marked this book as <span class="st-font-italic">{profileBook[`${getCurrentEnvironment()}_status_instance`].status}</span>
              </p>
            </SuccessCard>
          {/if}
          <div class="flex flex-col gap-2 w-full">
            <Button
              label={E_BookStatus.TRACKING.text}
              handleClick={async () => await handleTrackingStatus(E_BookStatus.TRACKING.text)}
              isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.TRACKING.text}
              isDisabled={isLoading}
            />
            <Button
              label={E_BookStatus.TO_READ.text}
              handleClick={async () => await handleToReadStatus(E_BookStatus.TO_READ.text)}
              isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.TO_READ.text}
              isDisabled={isLoading}
            />
            {#if currentProfile && (dateDifference?.differenceDays >= 0)}
              <Button
                label={E_BookStatus.READING.text}
                handleClick={async () => await handleReadingStatus(E_BookStatus.READING.text)}
                isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING.text}
                isDisabled={isLoading}
              />
              <Button
                label={E_BookStatus.READ.text}
                handleClick={async () => await handleReadStatus(E_BookStatus.READ.text)}
                isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ.text}
                isDisabled={isLoading}
              />
              <Button
                label={E_BookStatus.DNF.text}
                handleClick={async () => await handleDNFStatus(E_BookStatus.DNF.text)}
                isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF.text}
                isDisabled={isLoading}
              />
            {/if}
          </div>
          {#if currentProfile && (dateDifference?.differenceDays < 0)}
            <InfoCard>
              <p class="dark:text-white">You can start marking this book as <span class="st-font-italic">{E_BookStatus.READING.text}</span>, <span class="st-font-italic">{E_BookStatus.READ.text}</span>, or <span class="st-font-italic">{E_BookStatus.DNF.text}</span> after publication</p>
            </InfoCard>
          {/if}
          {#if (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.TO_READ.text)}
            <DatePicker
              label="Start Date"
              bind:year={startYear}
              bind:month={startMonth}
              bind:day={startDay}
              bind:showError={showInvalidDateRangeError}
            />
          {/if}
          {#if (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ.text) || (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF.text)}
            <DatePicker
              label="End Date"
              bind:year={endYear}
              bind:month={endMonth}
              bind:day={endDay}
              bind:showError={showInvalidDateRangeError}
            />
          {/if}
          {#if (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.TO_READ.text)}
            {#if showInvalidDateRangeError}
              <ErrorCard>
                <p>{profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING.text ? 'Start date cannot be after current date' : 'Start date cannot be after end date'}</p>
              </ErrorCard>
            {/if}
          {/if}
          {#if profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.TO_READ.text}
            <Button
              label="Update Status"
              handleClick={async () => await handleUpdateProfileBook()}
              isDisabled={
                (profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING.text && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth-1, startDay))) ||
                (profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.READING.text && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth-1, startDay)) &&
                (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date)) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(endYear, endMonth-1, endDay)))) ||
                showInvalidDateRangeError ||
                isLoading
              }
            />
          {/if}
        </Modal>
      </Card>
      <Card>
        <div class="w-full flex justify-between items-center">
          <Heading label="Collections" />
          <EditButton handleClick={() => showCollectionsModal = true} />
        </div>
        <Modal
          label="Collections"
          showModal={showCollectionsModal}
          handleSubmit={() => showCollectionsModal = false}
          handleCancel={() => showCollectionsModal = false}
        >
          {#if bookCollectionIds.length > 0}
            <SuccessCard>
              <p>You added this book to {bookCollectionIds.length} {bookCollectionIds.length === 1 ? 'collection' : 'collections'}</p>
            </SuccessCard>
          {/if}
          {#if profileBook}
            <div class="flex flex-col gap-2">
              <TextInput
                placeholder="Title (max. 40 characters)"
                bind:value={bookCollectionTitle}
                maxLength={40}
              />
              <TextareaInput
                placeholder="Description (max. 400 characters)"
                maxLength={400}
                bind:value={bookCollectionDescription}
              />
              <Button
                label="Add Collection"
                handleClick={async () => console.log(bookCollectionTitle)}
                isDisabled={
                  isLoading ||
                  (bookCollectionTitle === '')
                }
              />
            </div>
            <div class="w-full grid gap-2">
              {#each bookCollections as bookCollection}
                <div class="flex gap-2 items-center">
                  {#if bookCollectionIds.indexOf(bookCollection.id) !== -1}
                    <SuccessCard>
                      <p class="flex-grow">{bookCollection.title} ({bookCollection.total_count})</p>
                    </SuccessCard>
                    <MinusButton handleClick={async () => await handleRemoveFromCollection(bookCollection)} isDisabled={isLoading} />
                  {:else}
                    <p class="flex-grow">{bookCollection.title} ({bookCollection.total_count})</p>
                    <PlusButton handleClick={async () => await handleAddToCollection(bookCollection)} isDisabled={isLoading} />
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <InfoCard>
              <p class="dark:text-white">You can start adding this book to your collections after marking a status</p>
            </InfoCard>
          {/if}
        </Modal>
      </Card>
      <Card>
        <div class="w-full flex justify-between items-center">
          <Heading label="Rating" />
          <EditButton handleClick={() => showRatingModal = true} />
        </div>
        <Modal
          label="Rating"
          showModal={showRatingModal}
          handleSubmit={() => showRatingModal = false}
          handleCancel={() => showRatingModal = false}
        >
          {#if profileBook && ((profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ.text) || (profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF.text))}
            {#if profileBook[`${getCurrentEnvironment()}_rating_instance`]}
              <SuccessCard>
                <p class="dark:text-white">You rated this book <span class="st-font-italic">{profileBook[`${getCurrentEnvironment()}_rating_instance`].rating}/10</span></p>
              </SuccessCard>
            {/if}
            <div class="w-full flex flex-col gap-2 items-center">
              <p class="dark:text-white text-center text-lg st-font-bold ">{rating}</p>
              <p class="dark:text-white text-center st-font-italic">{E_Rating[rating].label}</p>
              <Slider bind:value={rating} />
              <Button
                label={profileBook[`${getCurrentEnvironment()}_rating_instance`] ? 'Update Rating' : 'Add Rating'}
                handleClick={async () => await handleRatingInstance()}
                isDisabled={
                  isLoading ||
                  (profileBook[`${getCurrentEnvironment()}_rating_instance`] &&
                  profileBook[`${getCurrentEnvironment()}_rating_instance`].rating === rating)
                }
              />
            </div>
          {:else}
            <InfoCard>
              <p class="dark:text-white">You can start rating this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
            </InfoCard>
          {/if}
        </Modal>
      </Card>
      <Card>
        <div class="w-full flex justify-between items-center">
          <Heading label="Review" />
          <EditButton handleClick={() => showReviewModal = true} />
        </div>
        <Modal
          label="Review"
          showModal={showReviewModal}
          handleSubmit={() => showReviewModal = false}
          handleCancel={() => showReviewModal = false}
        >
          {#if profileBook && ((profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ.text) || (profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF.text))}
            {#if profileBook[`${getCurrentEnvironment()}_review_instance`]}
              <SuccessCard>
                <p class="dark:text-white">You reviewed this book</p>
              </SuccessCard>
            {/if}
            <div class="flex flex-col gap-2">
              <TextareaInput
                placeholder="Review (max. 4000 characters)"
                maxLength={4000}
                bind:value={review}
              />
              <Button
                label={profileBook[`${getCurrentEnvironment()}_review_instance`] ? 'Update Review' : 'Add Review'}
                handleClick={async () => await handleReviewInstance()}
                isDisabled={
                  isLoading ||
                  (profileBook[`${getCurrentEnvironment()}_review_instance`] && profileBook[`${getCurrentEnvironment()}_review_instance`].review === review) ||
                  (!profileBook[`${getCurrentEnvironment()}_review_instance`] && !review)
                }
              />
            </div>
          {:else}
            <InfoCard>
              <p class="dark:text-white">You can start reviewing this book after marking it as <span class="st-font-italic">{E_BookStatus.READ.text}</span> or <span class="st-font-italic">{E_BookStatus.DNF.text}</span></p>
            </InfoCard>
          {/if}
        </Modal>
      </Card>
      {#if profileBook}
        <HorizontalDivider />
        <Card>
          <Heading label="Remove Book" />
          <Button
            label="Remove Book"
            handleClick={async () => await handleDeleteProfileBook()}
            isDisabled={isLoading}
          />
        </Card>
      {/if}
    </div>
  {:else}
    <div class="w-full md:max-w-[300px]">
      <Card>
        <Heading label="Sign In" />
        <InfoCard>
          <p><Link link="/sign-in" label="Sign in" /> to start managing your books</p>
        </InfoCard>
      </Card>
    </div>
  {/if}
</div>