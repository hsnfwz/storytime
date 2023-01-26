// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

// helpers
import { sortBy, getCurrentEnvironment } from 'src/helpers/helpers';

// enums
import E_BookStatus from 'src/enums/E_BookStatus';

export async function load({ url, params }: any) {
  // status filter
  let currentStatus = url.searchParams.get('status') || E_BookStatus.ALL.url;
  const words = currentStatus.split('-');
  const _words = words.map((word: string) => {
    const firstChar = word[0].toUpperCase();
    const remainingChars = word.substring(1);
    const _word = firstChar + remainingChars;
    return _word;
  });
  currentStatus = _words.join(' ');

  // page filter
  const currentPage = +url.searchParams.get('page') || 1;
  const maxPageItemsCount: number = 24;
  const from: number = (currentPage - 1) * maxPageItemsCount;
  const to: number = from + (maxPageItemsCount - 1);

  const { id } = params;

  let match: any;

  if (currentStatus !== E_BookStatus.ALL.text) {
    match = {
      profile_id: id,
      [`${getCurrentEnvironment()}_status_instance.status`]: currentStatus,
    }
  } else {
    match = {
      profile_id: id,
    }
  }

  const profileBooks: any = await getRecords(
    'profile_book',
    `*, ${getCurrentEnvironment()}_book(id, title, release_date), ${getCurrentEnvironment()}_status_instance!inner(*)`,
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

  if (!profileBooks) throw error(404, 'Not Found');

  const books: any = profileBooks.map((profileBook: any) => profileBook[`${getCurrentEnvironment()}_book`]);
  const items: any = sortBy(books, 'release_date', false);

  return {
    items,
    currentPage,
    maxPageItemsCount,
    currentStatus,
  };
}