// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

// helpers
import { sortBy } from '$helpers/helpers';

export async function load({ params }: any) {
  const { id } = params;

  const profileBooks: any = await getRecords('profile_book', 'id, profile_id, book_id, status, book (id, title, release_date)', { profile_id: id });

  if (!profileBooks) throw error(404, 'Not Found');

  const books: any = profileBooks.map((profileBook: any) => profileBook.book);
  const sortedBooks: any = sortBy(books, 'release_date', false);

  return { profileBooks, books: sortedBooks };
}