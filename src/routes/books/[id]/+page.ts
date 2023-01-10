// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

export async function load({ params }: any) {
  const { id } = params;

  const books: any = await getRecords(
    'book',
    'id, title, release_date',
    {
      id
    },
    {
      column: 'release_date',
      ascending: false
    }
  );

  if (!books) throw error(404, 'Not Found');

  return { books };
}