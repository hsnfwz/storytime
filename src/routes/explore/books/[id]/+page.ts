// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

export async function load({ params }: any) {
  const { id } = params;

  const items: any = await getRecords(
    'book',
    'id, title, release_date',
    {
      id
    }
  );

  if (!items || !items[0]) throw error(404, 'Not Found');

  return { item: items[0] };
}