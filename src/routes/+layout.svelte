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
    const theme = localStorage.getItem('theme') || '';

    let _theme: string = 'dark';

    if (theme === 'light') _theme = '';

    if (_theme) {
      const htmlElement = document.querySelector('html');
      htmlElement?.classList.add(_theme);
    }

    const bodyElement = document.querySelector('body');
    bodyElement?.classList.add('bg-white');
    bodyElement?.classList.add('dark:bg-black');

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



<!-- VERSION 2 FEATURES/FIXES -->


<!-- todo: filter, sort, search -->
<!-- todo: queue, reviews, rankings -->
<!-- todo: cookies notice to users, saying that they agree to cookies when using our site (for their better experience!) -->


<!-- VERSION 3 FEATURES/FIXES -->

<!-- todo: authors, shelves (tags), stats, social features, newsletter, recommendations -->
<!-- todo: film, games, music, series_title, series_entry, synopsis -->
<!-- todo: update RLS -->
<!-- todo: option to import any csv files (similar to IFTA Fuel Card) -->
<!-- todo: editions (cover, page count, isbn, release date) ? -->
<!-- todo: detect user device as pc or not, if not, disable hover effects if any -->
<!-- todo: name and username -->
<!-- todo: convert sign in form to svelte form -->


{#if !isLoading}
  <main class="flex flex-col gap-4">
    <Nav />
    <div class="ml-2 mr-2 mt-4 mb-4">
      <slot />
    </div>
  </main>
{:else}
  <p class="dark:text-white text-center">Loading...</p>
{/if}