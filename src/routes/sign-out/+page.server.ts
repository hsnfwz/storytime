// svelte
import { redirect } from '@sveltejs/kit';

// supabase
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const actions = {
	async default(event: any) {
		const { supabaseClient } = await getSupabase(event);

		await supabaseClient.auth.signOut();
    
		throw redirect(303, '/');
	}
};