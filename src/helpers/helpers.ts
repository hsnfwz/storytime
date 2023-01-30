import { dev } from '$app/environment';

const formatText = (text: string) => {
  let _text: string = '';
  
  if (text) {
    _text = text.replace(/\s+/g, ' ').trim();
  }
  
  return _text;
}

const formatFileName = (text: string, id: number, includeFileType: boolean = false) => {
  let _text: string = '';

  if (text) {
    _text = text.replace(/[^A-Za-z0-9\s]/g,'').replace(/\s+/g, ' ').trim().split(' ').join('-').toLowerCase();

    if (includeFileType) {
      _text = `${_text}-${id}.webp`;
    } else {
      _text = `${_text}-${id}`;
    }
  }
  
  return _text;
}

const formatDate = (date: any, includeTime: boolean = false) => {
  const options: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }

  if (includeTime) {
    options.hour = 'numeric';
    options.minute = 'numeric';
    options.second = 'numeric';
    options.timeZoneName = 'short';
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  
  return formattedDate;
}

function dateIsValid(dateStr: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateStr);
}

const groupBy = (data: any, key: any) => {
  const groupedData: any = data.reduce(function(previousValue: any, currentValue: any) {
    (previousValue[currentValue[key]] = previousValue[currentValue[key]] || []).push(currentValue);
    return previousValue;
  }, {});

  return groupedData;
};

const sortBy = (data: any, column: string, ascending: boolean = false) => {
  const sortedData: any = data.sort((a: any, b: any) => {
    if (a[column] < b[column]) {
      if (ascending) {
        return -1;
      } else {
        return 1;
      }
    }

    if (a[column] > b[column]) {
      if (ascending) {
        return 1;
      } else {
        return -1;
      }
    }

    return 0;
  });

  return sortedData;
}

const getItemTotalRatings = (item: any) => {
  const total: number = item.rating_0_count + item.rating_1_count + item.rating_2_count + item.rating_3_count + item.rating_4_count + item.rating_5_count + item.rating_6_count + item.rating_7_count + item.rating_8_count + item.rating_9_count + item.rating_10_count;

  return total;
}

const getItemRatingsAverage = (item: any) => {
  let average: number = +((0*(item.rating_0_count) + 1*(item.rating_1_count) + 2*(item.rating_2_count) + 3*(item.rating_3_count) + 4*(item.rating_4_count) + 5*(item.rating_5_count) + 6*(item.rating_6_count) + 7*(item.rating_7_count) + 8*(item.rating_8_count) + 9*(item.rating_9_count) + 10*(item.rating_10_count)) / getItemTotalRatings(item)).toFixed(1);
  
  if (isNaN(average)) average = 0;

  return average;
}

const getProfileTotalRatings = (profile: any) => {
  const total: number = profile.book_rating_0_count + profile.book_rating_1_count + profile.book_rating_2_count + profile.book_rating_3_count + profile.book_rating_4_count + profile.book_rating_5_count + profile.book_rating_6_count + profile.book_rating_7_count + profile.book_rating_8_count + profile.book_rating_9_count + profile.book_rating_10_count;

  return total;
}

const getProfileRatingsAverage = (profile: any) => {
  let average: number = +((0*(profile.book_rating_0_count) + 1*(profile.book_rating_1_count) + 2*(profile.book_rating_2_count) + 3*(profile.book_rating_3_count) + 4*(profile.book_rating_4_count) + 5*(profile.book_rating_5_count) + 6*(profile.book_rating_6_count) + 7*(profile.book_rating_7_count) + 8*(profile.book_rating_8_count) + 9*(profile.book_rating_9_count) + 10*(profile.book_rating_10_count)) / getProfileTotalRatings(profile)).toFixed(1);
  
  if (isNaN(average)) average = 0;

  return average;
}

const getDateDifference = (date1: any, date2: any = new Date().setHours(0)) => {
  const utcDate1 = Date.parse(formatDate(date1));
  const utcDate2 = Date.parse(formatDate(date2));

  const differenceTime = utcDate2 - utcDate1;
  const differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));
  // const differenceTime = Math.abs(utcDate1 - utcDate2);
  const differenceDaysAbs = Math.abs(differenceDays);

  // interpretation for release date
  // if differenceDays > 0, the book is released/passed its release date
  // if differenceDays = 0, the book is released
  // if differenceDays < 0, the book is not released

  // interpretation for date range
  // if differenceDays > 0, valid date range
  // if differenceDays = 0, valid date range
  // if differenceDays < 0, invalid date range

  return {
    differenceDays,
    differenceDaysAbs,
  };
}

const getCurrentEnvironment = () => {
  let currentEnvironment: string = '';

  if (dev) {
    currentEnvironment = 'dev';
  } else {
    currentEnvironment = 'prod';
  }

  return currentEnvironment;
}

export {
  formatText,
  formatFileName,
  dateIsValid,
  groupBy,
  sortBy,
  formatDate,
  getItemTotalRatings,
  getItemRatingsAverage,
  getProfileTotalRatings,
  getProfileRatingsAverage,
  getDateDifference,
  getCurrentEnvironment,
};