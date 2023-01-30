// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

// helpers
import { sortBy } from 'src/helpers/helpers';

export async function load({ url, params }: any) {
  let currentStatus = url.searchParams.get('status') || 'all';
  const words = currentStatus.split('-');
  const _words = words.map((word: string) => {
    const firstChar = word[0].toUpperCase();
    const remainingChars = word.substring(1);
    const _word = firstChar + remainingChars;
    return _word;
  });
  currentStatus = _words.join(' ');

  const currentPage = +url.searchParams.get('page') || 1;
  const maxPageItemsCount: number = 24;
  const from: number = (currentPage - 1) * maxPageItemsCount;
  const to: number = from + (maxPageItemsCount - 1);

  const { userId } = params;

  let match: any;

  if (currentStatus !== 'All') {
    match = {
      user_id: userId,
      ['user_book_status.status']: currentStatus,
    }
  } else {
    match = {
      user_id: userId,
    }
  }

  const userBooks: any = await getRecords(
    'user_book',
    `*, book(*), user_book_status!inner(*)`,
    match,
    {
      column: 'created_at',
      ascending: false
    },
    {
      from,
      to,
    }
  );

  if (!userBooks) throw error(404, 'Not Found');

  const books: any = userBooks.map((userBook: any) => userBook.book);
  const sortedBooks: any = sortBy(books, 'release_date', false);

  return {
    books: sortedBooks,
    currentPage,
    maxPageItemsCount,
    currentStatus,
  };
}