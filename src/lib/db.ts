import { createClient } from '@supabase/auth-helpers-sveltekit';

// env
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl: string = PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);