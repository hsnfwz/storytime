// svelte
import { error } from '@sveltejs/kit';

// supabase
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// api
import { getRecords } from 'src/api/database';

export const load = async (event: any) => {
	const { session } = await getSupabase(event);

	if (session) {
		const profiles: any = await getRecords(
			'user_profile',
			'*',
			{
				user_id: session.user.id
			}
		);

		if (!profiles || !profiles[0]) throw error(404, 'Not Found');

		return {
			profile: profiles[0],
		};
	}

	return {
		profile: undefined,
	}
};