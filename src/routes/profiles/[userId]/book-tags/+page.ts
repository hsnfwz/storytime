// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

export async function load({ url, params }: any) {
  const { userId } = params;

  const userBookTags: any = await getRecords(
    'user_book_tag',
    `*`,
    {
      user_id: userId,
    },
    {
      column: 'name',
      ascending: true,
    },
  );

  if (!userBookTags) throw error(404, 'Not Found');

  return {
    userBookTags,
  };
}