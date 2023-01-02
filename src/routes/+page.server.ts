// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from '$api/database';

export async function load() {
  const books: any = await getRecords('book', 'id, title, release_date', undefined, { column: 'release_date', options: { ascending: false } });

  if (!books) throw error(404, 'Not Found');

  return { books };
}

export const prerender = false;