// svelte
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

// api
import { getRecords } from '$api/database';

// helpers
import { sortBy } from '$helpers/helpers';

export async function load({ url, params }: any) {
  const currentPage = +url.searchParams.get('page') || 1;
  const maxPageItemsCount: number = 47;
  const from: number = (currentPage - 1) * (maxPageItemsCount + 1);
  const to: number = currentPage * maxPageItemsCount;

  const { id } = params;

  let currentEnv: string = '';

  if (dev) {
    currentEnv = 'dev';
  } else {
    currentEnv = 'prod';
  }

  const profiles: any = await getRecords(
    'profile',
    'id, created_at, book_total_count, book_reading_count, book_want_to_read_count, book_read_count, book_did_not_finish_count',
    {
      id
    }
  );

  if (!profiles || !profiles[0]) throw error(404, 'Not Found');

  const profileBooks: any = await getRecords(
    'profile_book',
    `id, profile_id, book_id, status, ${currentEnv}_book (id, title, release_date)`,
    {
      profile_id: id
    },
    undefined,
    {
      from,
      to,
    }
  );

  if (!profileBooks) throw error(404, 'Not Found');

  const books: any = profileBooks.map((profileBook: any) => profileBook[`${currentEnv}_book`]);
  const items: any = sortBy(books, 'release_date', false);

  return {
    profile: profiles[0],
    items,
    currentPage,
    maxPageItemsCount,
  };
}