// svelte
import { error } from '@sveltejs/kit';

// supabase
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// api
import { getRecords } from 'src/api/database';

export async function load(event: any) {
  const { bookId } = event.params;

  const books: any = await getRecords(
    'book',
    '*',
    {
      id: bookId,
    }
  );

  if (!books || !books[0]) throw error(404, 'Not Found');

  let userProfile: any;
  let userBook: any;
  let userBookTags: any;
  let userBookTagBooks: any;

  const { session } = await getSupabase(event);

	if (session) {
    const [
      userProfileRecords,
      userBookRecords,
      userBookTagRecords,
      userBookTagBookRecords
    ] = await Promise.all([
      getRecords(
        'user_profile',
        '*',
        {
          user_id: session.user.id,
        }
      ),
      getRecords(
        'user_book',
        '*, user_book_status(*), user_book_rating(*), user_book_review(*), user_book_read(*)',
        {
          user_id: session.user.id,
          book_id: bookId,
        }
      ),
      getRecords(
        'user_book_tag',
        `*`,
        {
          user_id: session.user.id,
        },
        {
          column: 'name',
          ascending: true,
        },
      ),
      getRecords(
        'user_book_tag_book',
        `*`,
        {
          user_id: session.user.id,
          book_id: bookId,
        },
      )
    ]);

    userProfile = userProfileRecords[0];
		userBook = userBookRecords[0];
    userBookTags = userBookTagRecords;
    userBookTagBooks = userBookTagBookRecords;
	}

  return {
    userProfile,
    userBook,
    userBookTags,
    userBookTagBooks,
    book: books[0],
  };
}