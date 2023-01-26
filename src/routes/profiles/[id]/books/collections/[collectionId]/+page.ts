// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

// helpers
import { getCurrentEnvironment, sortBy } from 'src/helpers/helpers';

export async function load({ url, params }: any) {
  const bookCollectionBooks: any = await getRecords(
    'book_collection_book',
    `id, ${getCurrentEnvironment()}_book(id, title, release_date)`,
    {
      book_collection_id: params.collectionId,
    },
  );

  if (!bookCollectionBooks) throw error(404, 'Not Found');

  const books: any = bookCollectionBooks.map((bookCollectionBook: any) => bookCollectionBook[`${getCurrentEnvironment()}_book`]);
  const items: any = sortBy(books, 'release_date', false);

  return {
    bookCollectionBooks: items,
  };
}