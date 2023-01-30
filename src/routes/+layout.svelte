<script lang="ts">
  // css
  import './global.css';

  // svelte
  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';

  // supabase
  import { supabaseClient } from '$lib/db';

  // components
  import Nav from 'src/components/Nav.svelte';
  import Footer from 'src/components/Footer.svelte';

  onMount(() => {
    const {
      data: {
        subscription
      }
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidate('supabase:auth');
    })

    return () => {
      subscription.unsubscribe();
    }
  });

  onMount(() => {
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
  });
</script>

<!-- VERSION 2 FEATURES/FIXES -->
<!-- todo: sync status and page number together -->

<!-- todo: collections -->

<!-- todo: status, rating, review, read timelines -->
<!-- todo: allow user to create another read instance -->
<!-- todo: allow user to delete read, rating, and review instance -->

<!-- todo: make date input more robust -->
<!-- todo: filter, sort, search -->

<!-- todo: authors, stats -->
<!-- todo: films, games, series_title, series_entry, synopsis -->
<!-- todo: editions (cover, page count, isbn, release date) ? -->

<!-- todo: turn theme changer into svelte store -->

<!-- VERSION 3 FEATURES/FIXES -->
<!-- todo: option to import any csv files (similar to IFTA Fuel Card) -->
<!-- todo: account display name and username -->
<!-- todo: convert sign in form to svelte form -->
<!-- todo: handle timezones -->

<!-- BEFORE RELEASE -->
<!-- todo: log all data that is being fetched in each url and test by switching pages to see how many requests we make each time, then we will figure out how to reduce requests from there (i.e. caching, look up pros and cons and what to consider) -->
<!-- todo: update supabase RLS -->
<!-- todo: look into cleanup (to avoid memory leaks) for svelte subcription functions -->

<main class="flex flex-col gap-4 mt-4 mb-[58px] sm:mt-0 sm:mb-0">
  <Nav />
  <div class="flex flex-col gap-4 mx-4">
    <slot />
  </div>
  <Footer />
</main>