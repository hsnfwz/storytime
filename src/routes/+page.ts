// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

export async function load({ url }: any) {
  const page = url.searchParams.get('page') || 1;

  const limit: number = 47;
  const from: number = (page - 1) * (limit + 1);
  const to: number = page * limit;

  const books: any = await getRecords(
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

  if (!books) throw error(404, 'Not Found');

  return { books, pageNumber: +page };
}