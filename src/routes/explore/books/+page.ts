// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

export async function load({ url }: any) {
  const currentPage = +url.searchParams.get('page') || 1;
  const maxPageItemsCount: number = 24;
  const from: number = (currentPage - 1) * maxPageItemsCount;
  const to: number = from + (maxPageItemsCount - 1);

  const books: any = await getRecords(
    'book',
    `*`,
    undefined,
    {
      column: 'release_date',
      ascending: false
    },
    {
      from,
      to,
    }
  );

  if (!books) throw error(404, 'Not Found');

  return {
    books,
    currentPage,
    maxPageItemsCount,
  };
}