const formatText = (text: string) => {
  let _text: string = '';
  
  if (text) {
    _text = text.replace(/\s+/g, ' ').trim();
  }
  
  return _text;
}

const formatFileName = (text: string, id: number) => {
  let _text: string = '';

  if (text) {
    _text = text.replace(/[^A-Za-z0-9\s]/g,'').replace(/\s+/g, ' ').trim().split(' ').join('-').toLowerCase();
    _text = `${_text}-id-${id}.webp`;
  }
  
  return _text;
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

export {
  formatText,
  formatFileName,
  dateIsValid,
  groupBy,
  sortBy,
};