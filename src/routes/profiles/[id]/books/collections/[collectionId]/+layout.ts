// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

export async function load({ url, params }: any) {
  const bookCollections: any = await getRecords(
    'book_collection',
    `*`,
    {
      id: params.collectionId,
    },
  );

  if (!bookCollections) throw error(404, 'Not Found');

  return {
    bookCollection: bookCollections[0],
  };
}