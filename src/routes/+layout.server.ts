// supabase
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load = async (event: any) => {
  return {
    session: await getServerSession(event),
  }
}