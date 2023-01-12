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

const formatDate = (date: any) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(date));

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

const getTotalRatings = (item: any) => {
  const total: number = item.rating_0_count + item.rating_1_count + item.rating_2_count + item.rating_3_count + item.rating_4_count + item.rating_5_count + item.rating_6_count + item.rating_7_count + item.rating_8_count + item.rating_9_count + item.rating_10_count;

  return total;
}

const getRatingsAverage = (item: any) => {
  let average: number = +((0*(item.rating_0_count) + 1*(item.rating_1_count) + 2*(item.rating_2_count) + 3*(item.rating_3_count) + 4*(item.rating_4_count) + 5*(item.rating_5_count) + 6*(item.rating_6_count) + 7*(item.rating_7_count) + 8*(item.rating_8_count) + 9*(item.rating_9_count) + 10*(item.rating_10_count)) / getTotalRatings(item)).toFixed(1);
  
  if (isNaN(average)) average = 0;

  return average;
}

const getDateDifference = (date: any) => {
  const today = new Date().setHours(0,0,0,0);

  const utcToday = Date.parse(formatDate(today));
  const utcDate = Date.parse(formatDate(date));

  const differenceTime = Math.abs(utcToday - utcDate);
  const differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));

  if (utcToday < utcDate) {
    return {
      differenceDays,
      afterDate: false,
    };
  } else {
    return {
      differenceDays,
      afterDate: true,
    };
  }
}

export {
  formatText,
  formatFileName,
  dateIsValid,
  groupBy,
  sortBy,
  formatDate,
  getTotalRatings,
  getRatingsAverage,
  getDateDifference,
};