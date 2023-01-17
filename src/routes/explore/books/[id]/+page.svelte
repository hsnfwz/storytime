<script lang="ts">
  // api
  import { insertRecords, updateRecords, getRecords, deleteRecords } from '$api/database';

  // stores
  import { profile } from '$stores/ProfileStore';

  // enums
  import E_BookStatus from '$enums/E_BookStatus';
  import E_Rating from '$enums/E_Rating';

  // interfaces
  import type I_Profile from '$interfaces/I_Profile';

  // components
  import ItemCard from '$components/ItemCard.svelte';
  import DatePicker from '$components/DatePicker.svelte';
  import Slider from '$components/Slider.svelte';
  import Card from '$components/Card.svelte';
  import Button from '$components/Button.svelte';

  // helpers
  import { formatDate, getItemRatingsAverage, getItemTotalRatings, getProfileTotalRatings, getDateDifference, getCurrentEnvironment } from '$helpers/helpers';

  // data
  export let data: { item: any };

  // state
  let currentProfile: I_Profile | undefined;
  let profileBook: any;

  let showInvalidDateRangeError: boolean = false;

  $: {
    if (showInvalidDateRangeError) setTimeout(() => showInvalidDateRangeError = false, 3000);
  }

  let today: any = new Date();
  today.setHours(0);

  let startYear: number = today.getUTCFullYear();
  let startMonth: { monthName: string, monthNumber: number } = {
    monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(today),
    monthNumber: today.getUTCMonth(),
  }
  let startDay: number = today.getUTCDate();

  let endYear: number = today.getUTCFullYear();
  let endMonth: { monthName: string, monthNumber: number } = {
    monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(today),
    monthNumber: today.getUTCMonth(),
  }
  let endDay: number = today.getUTCDate();

  let rating: number = 5;
  let review: string = '';

  const dateDifference = getDateDifference(data.item.release_date);
  
  // todo: add a shortcut for creating another read or rating instance, and update related data accordingly
  // todo: loading screens
  // todo: confirm dialog when user clicks remove button
  // update rating/review

  profile.subscribe(async (value) => {
    if (!currentProfile && value) {
      const profileBooks: any = await getRecords(
        'profile_book',
        `*, ${getCurrentEnvironment()}_status_instance (*), ${getCurrentEnvironment()}_rating_instance (*)`,
        {
          profile_id: value.id,
          book_id: data.item.id,
        },
      );

      if (profileBooks[0]) {
        profileBook = profileBooks[0];

        if (profileBook[`${getCurrentEnvironment()}_rating_instance`]) {
          rating = profileBook[`${getCurrentEnvironment()}_rating_instance`].rating;
          review = profileBook[`${getCurrentEnvironment()}_rating_instance`].review;
        }

        if (profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.TO_READ) {
          if (profileBook[`${getCurrentEnvironment()}_status_instance`].start_date) {
            startYear = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date).getUTCFullYear();
            startMonth = {
              monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date)),
              monthNumber: new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date).getUTCMonth(),
            }
            startDay = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date).getUTCDate();
          }
        }
        
        if ((profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ) || (profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF)) {
          if (profileBook[`${getCurrentEnvironment()}_status_instance`].end_date) {
            endYear = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date).getUTCFullYear();
            endMonth = {
              monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date)),
              monthNumber: new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date).getUTCMonth(),
            }
            endDay = new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date).getUTCDate();
          }
        }
      }
      
      currentProfile = value;
    } else if (currentProfile) {
      currentProfile = value;
    }
  });

  const handleUpdateProfileBook = async () => {
    const _dateDifference: any = getDateDifference(new Date(startYear, startMonth.monthNumber, startDay), new Date(endYear, endMonth.monthNumber, endDay));

    console.log(_dateDifference);

    if (_dateDifference.differenceDays < 0) {
      showInvalidDateRangeError = true;
      return;
    }

    const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

    if (profileBookStatus === E_BookStatus.READING) {
      // status instance
      const updatedStatusInstanceData: any = {
        start_date: new Date(startYear, startMonth.monthNumber, startDay),
      };

      const latestStatusInstanceRecord = await updateRecords('status_instance', [updatedStatusInstanceData], { id: profileBook.latest_status_instance_id });

      profileBook[`${getCurrentEnvironment()}_status_instance`] = latestStatusInstanceRecord[0];
    } else if (profileBookStatus === E_BookStatus.READ) {
      // read instance
      const updatedReadInstanceData: any = {
        start_date: new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
      };

      // status instance
      const updatedStatusInstanceData: any = {
        start_date: new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
      };

      const [
        latestReadInstanceRecord,
        latestStatusInstanceRecord
      ] = await Promise.all([
        updateRecords('read_instance', [updatedReadInstanceData], { id: profileBook.latest_read_instance_id }),
        updateRecords('status_instance', [updatedStatusInstanceData], { id: profileBook.latest_status_instance_id }),
      ]);

      profileBook[`${getCurrentEnvironment()}_read_instance`] = latestReadInstanceRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = latestStatusInstanceRecord[0];
    } else if (profileBookStatus === E_BookStatus.DNF) {
      // status instance
      const updatedStatusInstanceData: any = {
        start_date: new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
      };

      const latestStatusInstanceRecord = await updateRecords('status_instance', [updatedStatusInstanceData], { id: profileBook.latest_status_instance_id });

      profileBook[`${getCurrentEnvironment()}_status_instance`] = latestStatusInstanceRecord[0];
    }
  }

  const handleDeleteProfileBook = async () => {
    const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

    let profileCountAttribute: string = '';
    let profileCountValue: number = 0;

    let bookCountAttribute: string = '';
    let bookCountValue: number = 0;

    if (profileBookStatus === E_BookStatus.READING) {
      profileCountAttribute = 'book_status_reading_count';
      profileCountValue = currentProfile.book_status_reading_count - 1;
      bookCountAttribute = 'status_reading_count';
      bookCountValue = data.item.status_reading_count - 1;
    } else if (profileBookStatus === E_BookStatus.TO_READ) {
      profileCountAttribute = 'book_status_to_read_count';
      profileCountValue = currentProfile.book_status_to_read_count - 1;
      bookCountAttribute = 'status_to_read_count';
      bookCountValue = data.item.status_to_read_count - 1;
    } else if (profileBookStatus === E_BookStatus.READ) {
      profileCountAttribute = 'book_status_read_count';
      profileCountValue = currentProfile.book_status_read_count - 1;
      bookCountAttribute = 'status_read_count';
      bookCountValue = data.item.status_read_count - 1;
    } else if (profileBookStatus === E_BookStatus.DNF) {
      profileCountAttribute = 'book_status_dnf_count';
      profileCountValue = currentProfile.book_status_dnf_count - 1;
      bookCountAttribute = 'status_dnf_count';
      bookCountValue = data.item.status_dnf_count - 1;
    }

    let updatedProfileData: any;
    let updatedBookData: any;

    if (profileBook.read_count > 0) {
      if (getProfileTotalRatings(currentProfile) > 0) {
        updatedProfileData = {
          [`book_rating_${rating}_count`]: currentProfile[`book_rating_${rating}_count`] - 1,
          [profileCountAttribute]: profileCountValue,
          book_unique_read_count: currentProfile.book_unique_read_count - 1,
        };

        updatedBookData = {
          [`rating_${rating}_count`]: data.item[`rating_${rating}_count`] - 1,
          [bookCountAttribute]: bookCountValue,
          unique_read_count: data.item.unique_read_count - 1,
          read_count: data.item.read_count - profileBook.read_count,
        };
      } else {
        updatedProfileData = {
          [profileCountAttribute]: profileCountValue,
          book_unique_read_count: currentProfile.book_unique_read_count - 1,
        };

        updatedBookData = {
          [bookCountAttribute]: bookCountValue,
          unique_read_count: data.item.unique_read_count - 1,
          read_count: data.item.read_count - profileBook.read_count,
        };
      }
    } else {
      updatedProfileData = {
        [profileCountAttribute]: profileCountValue,
      };

      updatedBookData = {
        [bookCountAttribute]: bookCountValue,
      };
    }

    await deleteRecords('profile_book', { id: profileBook.id });
    await Promise.all([
      deleteRecords('read_instance', { profile_id: currentProfile.id, book_id: data.item.id }),
      deleteRecords('status_instance', { profile_id: currentProfile.id, book_id: data.item.id }),
      deleteRecords('rating_instance', { profile_id: currentProfile.id, book_id: data.item.id }),
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
    startMonth = {
      monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(_today),
      monthNumber: _today.getUTCMonth(),
    }
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = {
      monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(_today),
      monthNumber: _today.getUTCMonth(),
    }
    endDay = _today.getUTCDate();

    rating = 5;
    review = '';
  }

  const handleToReadStatus = async (status: string) => {
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

      if (profileBookStatus === E_BookStatus.READING) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READ) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.DNF) {
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
        latestProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = latestProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
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
        newProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData]),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = newProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
    }

    startYear = _today.getUTCFullYear();
    startMonth = {
      monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(_today),
      monthNumber: _today.getUTCMonth(),
    }
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = {
      monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(_today),
      monthNumber: _today.getUTCMonth(),
    }
    endDay = _today.getUTCDate();
  }

  const handleReadingStatus = async (status: string) => {
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

      if (profileBookStatus === E_BookStatus.TO_READ) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READ) {
        minusProfileAttribute = 'book_status_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.DNF) {
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
        latestProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = latestProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
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
        newProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData]),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = newProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
    }

    startYear = _today.getUTCFullYear();
    startMonth = {
      monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(_today),
      monthNumber: _today.getUTCMonth(),
    }
    startDay = _today.getUTCDate();

    endYear = _today.getUTCFullYear();
    endMonth = {
      monthName: new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(_today),
      monthNumber: _today.getUTCMonth(),
    }
    endDay = _today.getUTCDate();
  }

  const handleReadStatus = async (status: string) => {
    if (profileBook) {
      // read instance
      const readInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        start_date: profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING ? profileBook[`${getCurrentEnvironment()}_status_instance`].start_date : new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
      };

      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING ? profileBook[`${getCurrentEnvironment()}_status_instance`].start_date : new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
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

      if (profileBookStatus === E_BookStatus.TO_READ) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READING) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.DNF) {
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
        latestProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = latestProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_read_instance`] = newReadInstanceRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
    } else {
      // read instance
      const readInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        start_date: new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
      };

      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
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
        newProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData]),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = newProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_read_instance`] = newReadInstanceRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
    }
  }

  const handleDNFStatus = async (status: string) => {
    if (profileBook) {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING ? profileBook[`${getCurrentEnvironment()}_status_instance`].start_date : new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
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

      if (profileBookStatus === E_BookStatus.TO_READ) {
        minusProfileAttribute = 'book_status_to_read_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_to_read_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READING) {
        minusProfileAttribute = 'book_status_reading_count';
        minusProfileCount = currentProfile[minusProfileAttribute] - 1;
        minusBookAttribute = 'status_reading_count';
        minusBookCount = data.item[minusBookAttribute] - 1;
      } else if (profileBookStatus === E_BookStatus.READ) {
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
        latestProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = latestProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
    } else {
      // status instance
      const statusInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        status,
        start_date: new Date(startYear, startMonth.monthNumber, startDay),
        end_date: new Date(endYear, endMonth.monthNumber, endDay),
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
        newProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        insertRecords('profile_book', [profileBookData]),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      profileBook = newProfileBookRecord[0];
      profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
    }
  }

  const handleRatingInstance = async () => {
    if (profileBook && profileBook[`${getCurrentEnvironment()}_rating_instance`]) {
      // now, are we updating a current instance, or adding another new instance ?

      // // status instance
      // const statusInstanceData: any = {
      //   profile_id: currentProfile.id,
      //   book_id: data.item.id,
      //   status,
      // };

      // const newStatusInstanceRecord = await insertRecords('status_instance', [statusInstanceData]);

      // // profile book
      // const updatedProfileBookData: any = {
      //   profile_id: currentProfile.id,
      //   book_id: data.item.id,
      //   latest_status_instance_id: newStatusInstanceRecord[0].id,
      // };

      // const profileBookStatus: string = profileBook[`${getCurrentEnvironment()}_status_instance`].status;

      // let minusProfileAttribute: string = '';
      // let minusProfileCount: number = 0;

      // let minusBookAttribute: string = '';
      // let minusBookCount: number = 0;

      // if (profileBookStatus === E_BookStatus.READING) {
      //   minusProfileAttribute = 'book_status_reading_count';
      //   minusProfileCount = currentProfile[minusProfileAttribute] - 1;
      //   minusBookAttribute = 'status_reading_count';
      //   minusBookCount = data.item[minusBookAttribute] - 1;
      // } else if (profileBookStatus === E_BookStatus.READ) {
      //   minusProfileAttribute = 'book_status_read_count';
      //   minusProfileCount = currentProfile[minusProfileAttribute] - 1;
      //   minusBookAttribute = 'status_read_count';
      //   minusBookCount = data.item[minusBookAttribute] - 1;
      // } else if (profileBookStatus === E_BookStatus.DNF) {
      //   minusProfileAttribute = 'book_status_dnf_count';
      //   minusProfileCount = currentProfile[minusProfileAttribute] - 1;
      //   minusBookAttribute = 'status_dnf_count';
      //   minusBookCount = data.item[minusBookAttribute] - 1;
      // }

      // // profile
      // const updatedProfileData: any = {
      //   book_status_to_read_count: currentProfile.book_status_to_read_count + 1,
      //   [minusProfileAttribute]: minusProfileCount,
      // };

      // // book
      // const updatedBookData: any = {
      //   status_to_read_count: data.item.status_to_read_count + 1,
      //   [minusBookAttribute]: minusBookCount,
      // };

      // const [
      //   latestProfileBookRecord,
      //   latestProfileRecord,
      //   latestBookRecord
      // ] = await Promise.all([
      //   updateRecords('profile_book', [updatedProfileBookData], { profile_id: currentProfile.id, book_id: data.item.id }),
      //   updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
      //   updateRecords('book', updatedBookData, { id: data.item.id }),
      // ]);

      // data.item = latestBookRecord[0];
      // profile.set(latestProfileRecord[0]);
      // profileBook = latestProfileBookRecord[0];
      // profileBook[`${getCurrentEnvironment()}_status_instance`] = newStatusInstanceRecord[0];
    } else if (profileBook && !profileBook[`${getCurrentEnvironment()}_rating_instance`]) {
      // rating instance
      const ratingInstanceData: any = {
        profile_id: currentProfile.id,
        book_id: data.item.id,
        rating,
        review,
      };

      const newRatingInstanceRecord = await insertRecords('rating_instance', [ratingInstanceData]);

      // profile book
      const updatedProfileBookData: any = {
        latest_rating_instance_id: newRatingInstanceRecord[0].id,
      };

      // profile
      const updatedProfileData: any = {
        [`book_rating_${rating}_count`]: currentProfile[`book_rating_${rating}_count`] + 1,
        book_review_count: review ? currentProfile.book_review_count + 1 : currentProfile.book_review_count,
      };

      // book
      const updatedBookData: any = {
        [`rating_${rating}_count`]: data.item[`rating_${rating}_count`] + 1,
        review_count: review ? data.item.review_count + 1 : data.item.review_count,
      };

      const [
        latestProfileBookRecord,
        latestProfileRecord,
        latestBookRecord
      ] = await Promise.all([
        updateRecords('profile_book', updatedProfileBookData, { id: profileBook.id }),
        updateRecords('profile', updatedProfileData, { id: currentProfile.id }),
        updateRecords('book', updatedBookData, { id: data.item.id }),
      ]);

      data.item = latestBookRecord[0];
      profile.set(latestProfileRecord[0]);
      // profileBook = latestProfileBookRecord[0]; //todo: don't do this until you allow yourself to specify which attributes to fetch from updating/inserting records
      profileBook[`${getCurrentEnvironment()}_rating_instance`] = newRatingInstanceRecord[0];
    }

    rating = profileBook[`${getCurrentEnvironment()}_rating_instance`].rating;
    review = profileBook[`${getCurrentEnvironment()}_rating_instance`].review;
  }
</script>

<div class="flex flex-col items-center md:flex-row md:justify-center md:items-start gap-4">
  <div class="w-full flex flex-col items-center gap-4 md:max-w-[300px]">
    <ItemCard item={data.item} />
    <Card>
      <h1 class="w-full dark:text-white st-font-bold text-xl text-center">{data.item.title}</h1>
      {#if dateDifference?.differenceDays < 0}
        <p class="w-full text-center dark:text-white">
          Expected Publication {formatDate(data.item.release_date)} ({dateDifference.differenceDaysAbs === 1 ? `${dateDifference.differenceDaysAbs} day` : `${dateDifference.differenceDaysAbs} days`})
        </p>
      {:else}
        <p class="w-full text-center dark:text-white">
          Published {formatDate(data.item.release_date)}
        </p>
      {/if}
      {#if getItemTotalRatings(data.item) !== 0}
        <p class="w-full text-center dark:text-white">{getItemRatingsAverage(data.item)} / 10</p>
      {/if}
      <p class="w-full text-center dark:text-white">{getItemTotalRatings(data.item) === 1 ? `${getItemTotalRatings(data.item)} rating`: `${getItemTotalRatings(data.item)} ratings`}</p>
      <p class="w-full text-center dark:text-white">{data.item.review_count ===  1 ? `${data.item.review_count} review` : `${data.item.review_count} reviews`}</p>
      <p class="w-full text-center dark:text-white">{data.item.status_to_read_count === 1 ? `${data.item.status_to_read_count} to read status` : `${data.item.status_to_read_count} to read statuses`}</p>
      <p class="w-full text-center dark:text-white">{data.item.status_reading_count === 1 ? `${data.item.status_reading_count} reading status` : `${data.item.status_reading_count} reading statuses`}</p>
      <p class="w-full text-center dark:text-white">{data.item.status_read_count === 1 ? `${data.item.status_read_count} read status` : `${data.item.status_read_count} read statuses`}</p>
      <p class="w-full text-center dark:text-white">{data.item.status_dnf_count === 1 ? `${data.item.status_dnf_count} dnf status` : `${data.item.status_dnf_count} dnf statuses`}</p>
      <p class="w-full text-center dark:text-white">{data.item.unique_read_count === 1 ? `${data.item.unique_read_count} unique read` : `${data.item.unique_read_count} unique reads`}</p>
      <p class="w-full text-center dark:text-white">{data.item.read_count === 1 ? `${data.item.read_count} total read` : `${data.item.read_count} total reads`}</p>
    </Card>
  </div>
  <div class="w-full flex flex-col gap-4 md:max-w-[500px]">
    <Card>
      <h1 class="w-full dark:text-white st-font-bold text-xl text-center">Status</h1>
      {#if currentProfile && (dateDifference?.differenceDays < 0)}
        <Button
          label={E_BookStatus.TO_READ}
          handleClick={async () => await handleToReadStatus(E_BookStatus.TO_READ)}
          isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.TO_READ}
        />
        <div class="flex flex-col gap-2">
          <p class="w-full text-center dark:text-white">You can start marking this book as <span class="st-font-italic">{E_BookStatus.READING}</span> on publication day</p>
          <p class="w-full text-center dark:text-white">You can start marking this book as <span class="st-font-italic">{E_BookStatus.READ}</span> or <span class="st-font-italic">{E_BookStatus.DNF}</span> 3 days after publication day</p>
        </div>
      {/if}
      {#if currentProfile && (dateDifference?.differenceDays >= 0) && (dateDifference?.differenceDays <= 3)}
        <div class="flex gap-2 w-full">
          <Button
            label={E_BookStatus.TO_READ}
            handleClick={async () => await handleToReadStatus(E_BookStatus.TO_READ)}
            isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.TO_READ}
          />
          <Button
            label={E_BookStatus.READING}
            handleClick={async () => await handleReadingStatus(E_BookStatus.READING)}
            isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING}
          />
        </div>
        <p class="w-full text-center dark:text-white">You can start marking this book as <span class="st-font-italic">{E_BookStatus.READ}</span> or <span class="st-font-italic">{E_BookStatus.DNF}</span> 3 days after publication day</p>
      {/if}
      {#if currentProfile && (dateDifference?.differenceDays > 3)}
        <div class="flex flex-col gap-4 w-full">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <Button
              label={E_BookStatus.TO_READ}
              handleClick={async () => await handleToReadStatus(E_BookStatus.TO_READ)}
              isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.TO_READ}
            />
            <Button
              label={E_BookStatus.READING}
              handleClick={async () => await handleReadingStatus(E_BookStatus.READING)}
              isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING}
            />
            <Button
              label={E_BookStatus.READ}
              handleClick={async () => await handleReadStatus(E_BookStatus.READ)}
              isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ}
            />
            <Button
              label={E_BookStatus.DNF}
              handleClick={async () => await handleDNFStatus(E_BookStatus.DNF)}
              isSelected={profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF}
            />
          </div>
          {#if (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING) || (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ) || (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF)}
            <DatePicker
              label="Start Date"
              bind:year={startYear}
              bind:month={startMonth}
              bind:day={startDay}
              bind:showError={showInvalidDateRangeError}
              errorMessage="Start Date cannot be after End Date"
            />
          {/if}
          {#if (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ) || (profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF)}
            <DatePicker
              label="End Date"
              bind:year={endYear}
              bind:month={endMonth}
              bind:day={endDay}
              bind:showError={showInvalidDateRangeError}
              errorMessage="End Date cannot be before Start Date"
            />
          {/if}
          {#if profileBook && profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.TO_READ}
            <Button
              label="Update Status"
              handleClick={async () => await handleUpdateProfileBook()}
              isDisabled={
                (profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READING && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth.monthNumber, startDay))) ||
                (profileBook[`${getCurrentEnvironment()}_status_instance`].status !== E_BookStatus.READING && (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].start_date))) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(startYear, startMonth.monthNumber, startDay)) &&
                (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(profileBook[`${getCurrentEnvironment()}_status_instance`].end_date)) === new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(endYear, endMonth.monthNumber, endDay)))) ||
                showInvalidDateRangeError
              }
            />
          {/if}
        </div>
      {/if}
    </Card>
    <Card>
      {#if profileBook && ((profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.READ) || (profileBook[`${getCurrentEnvironment()}_status_instance`].status === E_BookStatus.DNF))}
        <h1 class="w-full dark:text-white st-font-bold text-xl text-center">Rating/Review</h1>
        <div class="w-full flex flex-col gap-2">
          <p class="dark:text-white">Rating</p>
          <div class="flex flex-col gap-4 items-center">
            <div class="w-full flex flex-col gap-2">
              <p class="dark:text-white text-center text-xl st-font-bold ">{rating}</p>
              <p class="dark:text-white text-center st-font-italic">{E_Rating[rating].label}</p>
            </div>
            <Slider bind:value={rating} />
          </div>
        </div>
        <div class="w-full flex flex-col gap-2">
          <label for="review" class="dark:text-white">Review</label>
          <textarea
            rows="10"
            maxlength="4000"
            class={`resize-none p-2 box-border w-full rounded border border-neutral-100 bg-neutral-100 dark:border-slate-600 dark:bg-slate-600 dark:text-white`}
            placeholder="Write a review (maximum 4000 characters)"
            bind:value={review}
          />
        </div>
        <Button
          label={profileBook[`${getCurrentEnvironment()}_rating_instance`] ? 'Update Rating/Review' : 'Add Rating/Review'}
          handleClick={async () => await handleRatingInstance()}
          isDisabled={
            profileBook[`${getCurrentEnvironment()}_rating_instance`] &&
            profileBook[`${getCurrentEnvironment()}_rating_instance`].rating === rating &&
            profileBook[`${getCurrentEnvironment()}_rating_instance`].review === review
          }
        />
      {:else}
        <p class="w-full text-center dark:text-white">You can start rating this book after marking it as <span class="st-font-italic">{E_BookStatus.READ}</span> or <span class="st-font-italic">{E_BookStatus.DNF}</span></p>
      {/if}
    </Card>
    {#if profileBook}
      <Card>
        <h1 class="w-full dark:text-white st-font-bold text-xl text-center">Danger Zone</h1>
        <Button
          label="Remove Book"
          handleClick={async () => await handleDeleteProfileBook()}
        />
      </Card>
    {/if}
    {#if !currentProfile}
      <Card>
        <p class="w-full text-center dark:text-white"><a href='/sign-in' class="text-sky-500">Sign in</a> to start managing your books</p>
      </Card>
    {/if}
  </div>
</div>