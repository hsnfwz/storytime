// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

// lib
import { supabaseClient } from '$lib/db';

export async function load({ url }: any) {
  const currentPage = +url.searchParams.get('page') || 1;
  const maxPageItemsCount: number = 24;
  const from: number = (currentPage - 1) * maxPageItemsCount;
  const to: number = from + (maxPageItemsCount - 1);

  /* todo: maybe it is better to save the default edition id in book table, and query book with join to book_edition */
  const { data: bookEditions, error: bookEditionsError }: any = await supabaseClient.from('book_edition').select('*, book(*)').is('is_default_edition', true);

  // const bookEditions: any = await getRecords(
  //   'book_edition',
  //   `*`,
  //   undefined,
  //   {
  //     column: 'release_date',
  //     ascending: false
  //   },
  //   {
  //     from,
  //     to,
  //   }
  // );

  if (!bookEditions) throw error(404, 'Not Found');

  return {
    bookEditions,
    currentPage,
    maxPageItemsCount,
  };
}