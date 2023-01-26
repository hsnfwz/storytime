<script lang="ts">
  // css
  import './global.css';

  // svelte
  import { onMount, onDestroy } from 'svelte';

  // api
  import { getRecords, insertRecords } from 'src/api/database';

  // stores
  import { session } from 'src/stores/SessionStore';
  import { profile } from 'src/stores/ProfileStore';

  // config
  import supabase from 'src/config/supabase';

  // components
  import Nav from 'src/components/Nav.svelte';
  import Footer from 'src/components/Footer.svelte';

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
<!-- todo: custom outline does not work on mobile -->
<!-- todo: handle tracking status and counts -->
<!-- todo: delete collection books when clikcing remove and update counts -->
<!-- todo: handle create collection -->
<!-- todo: sync status and page number together -->
<!-- todo: replace "update rating" and "update review" with add another instance -->
<!-- todo: allow user to create another read instance -->
<!-- todo: make date input more robust -->
<!-- todo: remove book confirm dialog -->
<!-- todo: loading screen when switching pages -->
<!-- todo: filter, sort, search -->
<!-- once we have rearranged nav icons, make icons bigger and easier to see when clicked -->
<!-- todo: authors, stats -->
<!-- todo: films, games, series_title, series_entry, synopsis -->
<!-- todo: editions (cover, page count, isbn, release date) ? -->

<!-- VERSION 3 FEATURES/FIXES -->
<!-- todo: option to import any csv files (similar to IFTA Fuel Card) -->
<!-- todo: account display name and username -->
<!-- todo: convert sign in form to svelte form -->

<!-- BEFORE RELEASE -->
<!-- todo: log all data that is being fetched in each url and test by switching pages to see how many requests we make each time, then we will figure out how to reduce requests from there (i.e. caching, look up pros and cons and what to consider) -->
<!-- todo: update supabase RLS -->
<!-- todo: look into cleanup (to avoid memory leaks) for svelte subcription functions -->


{#if !isLoading}
  <main class="flex flex-col gap-4 mt-4 mb-[58px] sm:mt-0 sm:mb-0">
    <Nav />
    <div class="flex flex-col gap-4 mx-4">
      <slot />
    </div>
    <Footer />
  </main>
{:else}
  <p class="dark:text-white text-center">Loading...</p>
{/if}