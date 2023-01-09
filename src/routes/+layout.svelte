<script lang="ts">
  // css
  import './global.css';

  // svelte
  import { onMount, onDestroy } from 'svelte';

  // api
  import { getRecords, insertRecords } from '$api/database';

  // stores
  import { session } from '$stores/SessionStore';
  import { profile } from '$stores/ProfileStore';

  // config
  import supabase from '$config/supabase';

  // components
  import Nav from '$components/Nav.svelte';

  // state
  let isLoading = true;
  let subscriptionAuthStateChange: any;

  onMount(async () => {
    subscriptionAuthStateChange = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        session.set(undefined);
        profile.set(undefined);
      }
    });

    const currentSession = await supabase.auth.getSession();

    if (currentSession && currentSession.data && currentSession.data.session) {
      session.set({ userId: currentSession.data.session.user.id });

      let profileRecords: any[] = await getRecords(
        'profile',
        'id, user_id, is_contributor, book_total_count, book_reading_count, book_want_to_read_count, book_read_count, book_did_not_finish_count',
        { user_id: currentSession.data.session.user.id }
      );

      if (profileRecords.length === 0) {
        profileRecords = await insertRecords('profile', [{ user_id: currentSession.data.session.user.id }]);
      }

      profile.set(profileRecords[0]);
    }

    isLoading = false;
  });

  onDestroy(() => subscriptionAuthStateChange?.data?.subscription?.unsubscribe());
</script>


<!-- VERSION 1.0 FEATURES/FIXES -->
<!-- detect user device as pc or not, if not, disable hover effects -->
<!-- todo: make home a user's books if logged in, otherwise an explore page if not -->

<!-- VERSION 2.0 FEATURES/FIXES -->
<!-- todo: limit (pagination), filter, sort, search -->
<!-- todo: film, games, music, series_title, series_entry, synopsis (maybe not, takes up a lot of space), authors, shelves (tags), queue, reviews, rankings, stats, profiles, social features, newsletter, recommendations -->
<!-- todo: update RLS -->
<!-- todo: dark mode -->
<!-- todo: option to import any csv files (similar to IFTA Fuel Card) -->
<!-- todo: find better icons -->
<!-- todo: BUG accessing profiles while signed out crashed site -->
<!-- todo: editions (cover, page count, isbn, release date) ? -->

{#if !isLoading}
  <main class="flex flex-col gap-4 bg-white min-h-screen">
  <!-- <main class="flex flex-col gap-4 bg-black min-h-screen"> -->
    <Nav />
    <div class="m-2">
      <slot />
    </div>
    <div class="w-full h-20 bg-neutral-100"></div>
    <!-- <div class="w-full h-20 bg-black"></div> -->
  </main>
{/if}