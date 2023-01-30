// helpers
import { getCurrentEnvironment } from 'src/helpers/helpers';

// supabase
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// svelte
import { fail } from '@sveltejs/kit';

export const actions = {
	async default(event: any) {
		const { request, url } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();
		const email = formData.get('email') as string;

    let options: any;
    const currentEnvironment: string = getCurrentEnvironment();

    if (currentEnvironment === 'dev') options = { emailRedirectTo: 'http://localhost:5173' };
    
		const { error } = await supabaseClient.auth.signInWithOtp({
			email,
			options,
		});

		if (error) {
			return fail(400, {
				error: error.message,
				values: { email }
			});
		}

		return {
			success: true,
			message: 'Please check your email for a magic link to sign in.'
		};
	}
};