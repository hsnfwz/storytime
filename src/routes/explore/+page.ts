// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

export async function load({ url }: any) {
  const currentPage = +url.searchParams.get('page') || 1;
  const maxPageItemsCount: number = 47;
  const from: number = (currentPage - 1) * (maxPageItemsCount + 1);
  const to: number = currentPage * maxPageItemsCount;

  const items: any = await getRecords(
    'book',
    'id, title, release_date',
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

  if (!items) throw error(404, 'Not Found');

  return {
    items,
    currentPage,
    maxPageItemsCount,
  };
}