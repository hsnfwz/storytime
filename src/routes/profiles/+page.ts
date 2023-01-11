// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

export async function load({ url }: any) {
  const page = url.searchParams.get('page') || 1;

  const limit: number = 47;
  const from: number = (page - 1) * (limit + 1);
  const to: number = page * limit;

  const profiles: any = await getRecords(
    'profile',
    'id, created_at, book_total_status_count, book_reading_status_count, book_want_to_read_status_count, book_read_status_count, book_did_not_finish_status_count',
    undefined,
    {
      column: 'created_at',
      ascending: false
    },
    {
      from,
      to,
    }
  );

  if (!profiles) throw error(404, 'Not Found');

  return { profiles, pageNumber: +page };
}