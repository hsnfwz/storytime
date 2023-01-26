// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

export async function load({ url, params }: any) {
  const bookCollections: any = await getRecords(
    'book_collection',
    `*`,
    {
      profile_id: params.id,
    },
    {
      column: 'title',
      ascending: true
    },
  );

  if (!bookCollections) throw error(404, 'Not Found');

  return {
    bookCollections,
  };
}