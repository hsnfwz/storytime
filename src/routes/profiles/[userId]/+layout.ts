// svelte
import { error } from '@sveltejs/kit';

// api
import { getRecords } from 'src/api/database';

export async function load({ params }: any) {
  const { userId } = params;

  const userProfiles: any = await getRecords(
    'user_profile',
    '*',
    {
      user_id: userId,
    }
  );

  if (!userProfiles || !userProfiles[0]) throw error(404, 'Not Found');

  return {
    userProfile: userProfiles[0],
  };
}