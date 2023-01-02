// svelte
import { error } from '@sveltejs/kit';

// enums
import E_BookStatus from '$enums/E_BookStatus';

// api
import { getRecords } from '$api/database';

// helpers
import { sortBy } from '$helpers/helpers';

export async function load({ params }: any) {
  const { id, status } = params;

  let _status: string = '';

  if (status === E_BookStatus.READING.url) {
    _status = E_BookStatus.READING.text;
  } else if (status === E_BookStatus.WANT_TO_READ.url) {
    _status = E_BookStatus.WANT_TO_READ.text;
  } else if (status === E_BookStatus.READ.url) {
    _status = E_BookStatus.READ.text;
  } else if (status === E_BookStatus.DID_NOT_FINISH.url) {
    _status = E_BookStatus.DID_NOT_FINISH.text;
  }

  const profileBooks: any = await getRecords('profile_book', 'id, profile_id, book_id, status, book (id, title, release_date)', { profile_id: id, status: _status });

  if (!profileBooks) throw error(404, 'Not Found');

  const books: any = profileBooks.map((profileBook: any) => profileBook.book);
  const sortedBooks: any = sortBy(books, 'release_date', false);

  return { profileBooks, books: sortedBooks };
}

export const prerender = false;