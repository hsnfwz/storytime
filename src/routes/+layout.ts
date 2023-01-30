// supabase
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load = async (event: any) => {
  const { session } = await getSupabase(event);
  
  return {
    session,
  }
}