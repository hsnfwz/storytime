// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

export async function load({ params }: any) {
  const { id } = params;

  const items: any = await getRecords(
    'book',
    '*',
    {
      id
    }
  );

  if (!items || !items[0]) throw error(404, 'Not Found');

  return { item: items[0] };
}