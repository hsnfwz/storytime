// svelte
import { error } from '@sveltejs/kit';

// supabase
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// api
import { getRecords } from 'src/api/database';

export async function load(event: any) {
  const { bookEditionId } = event.params;

  const bookEditions: any = await getRecords(
    'book_edition',
    '*, book(*)',
    {
      id: bookEditionId,
    }
  );

  if (!bookEditions || !bookEditions[0]) throw error(404, 'Not Found');

  let userProfile: any;
  let userBookEdition: any;
  let userBookEditionTags: any;
  let userBookEditionTagBookEditions: any;

  const { session } = await getSupabase(event);

	if (session) {
    const [
      userProfileRecords,
      userBookEditionRecords,
      userBookEditionTagRecords,
      userBookEditionTagBookRecords
    ] = await Promise.all([
      getRecords(
        'user_profile',
        '*',
        {
          user_id: session.user.id,
        }
      ),
      getRecords(
        'user_book_edition',
        '*, user_book_edition_status(*), user_book_edition_rating(*), user_book_edition_review(*)',
        {
          user_id: session.user.id,
          book_edition_id: bookEditionId,
        }
      ),
      getRecords(
        'user_book_edition_tag',
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
        'user_book_edition_tag_book_edition',
        `*`,
        {
          user_id: session.user.id,
          book_edition_id: bookEditionId,
        },
      )
    ]);

    userProfile = userProfileRecords[0];
		userBookEdition = userBookEditionRecords[0];
    userBookEditionTags = userBookEditionTagRecords;
    userBookEditionTagBookEditions = userBookEditionTagBookRecords;
	}

  return {
    userProfile,
    userBookEdition,
    userBookEditionTags,
    userBookEditionTagBookEditions,
    bookEdition: bookEditions[0],
  };
}