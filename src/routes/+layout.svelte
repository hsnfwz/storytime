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
  import Footer from '$components/Footer.svelte';

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
    bodyElement?.classList.add('bg-neutral-100');
    bodyElement?.classList.add('dark:bg-slate-900');

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
        '*',
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

<!-- todo: add a shortcut for creating another read or rating instance, and update related data accordingly -->
<!-- todo: confirm dialog when user clicks remove button -->
<!-- todo: loading screens everywhere ! -->
<!-- todo: queue, rankings, lists -->
<!-- todo: nav bar on bottom (for mobile only) and make it sticky (for mobile and desktop) -->
<!-- todo: filter, sort, search -->

<!-- VERSION 3 FEATURES/FIXES -->
<!-- todo: authors, shelves (tags), stats, social features, newsletter, recommendations -->
<!-- todo: film, games, music, series_title, series_entry, synopsis -->
<!-- todo: option to import any csv files (similar to IFTA Fuel Card) -->
<!-- todo: editions (cover, page count, isbn, release date) ? -->
<!-- todo: detect user device as pc or not, if not, disable hover effects if any -->
<!-- todo: name and username -->
<!-- todo: convert sign in form to svelte form -->

<!-- BEFORE RELEASE -->
<!-- todo: log all data that is being fetched in each url and test by switching pages to see how many requests we make each time, then we will figure out how to reduce requests from there (i.e. caching, look up pros and cons and what to consider) -->
<!-- todo: update supabase RLS -->
<!-- todo: look into cleanup (to avoid memory leaks) for svelte subcription functions -->


{#if !isLoading}
  <main class="flex flex-col gap-4 mt-4 mb-[58px] sm:mt-0 sm:mb-0">
    <Nav />
    <div class="mx-4">
      <slot />
    </div>
    <Footer />
  </main>
{:else}
  <p class="dark:text-white text-center">Loading...</p>
{/if}