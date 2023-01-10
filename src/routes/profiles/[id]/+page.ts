// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

export async function load({ params }: any) {
  const { id } = params;

  const items: any = await getRecords(
    'profile',
    'id, created_at, book_total_count, book_reading_count, book_want_to_read_count, book_read_count, book_did_not_finish_count',
    {
      id
    }
  );

  if (!items || !items[0]) throw error(404, 'Not Found');

  return { item: items[0] };
}