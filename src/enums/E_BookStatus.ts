const E_BookStatus = Object.freeze({
  'TRACKING': {
    text: 'Tracking',
    url: 'tracking',
    table_column: 'tracking',
  },
  'READING': {
    text: 'Reading',
    url: 'reading',
    table_column: 'reading',
  },
  'TO_READ': {
    text: 'To Read',
    url: 'to-read',
    table_column: 'to_read',
  },
  'READ': {
    text: 'Read',
    url: 'read',
    table_column: 'read',
  },
  'DNF': {
    text: 'DNF',
    url: 'dnf',
    table_column: 'dnf',
  }
});

export default E_BookStatus;