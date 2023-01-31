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

<!-- todo: maybe link a user to their unique and all status books, all tags, all ratings, and all reviews -->
<!-- todo: create 18px (heading), 16px (body/subheading) and 14px (body) text components -->
<!-- todo: turn theme changer into svelte store (make sure to cleaup up on destroy) -->

<!-- todo:
  ADD TO COLLECTION: insert book_tag record if tag does not exist and update count, otherwise only update count

  REMOVE FROM COLLECTION: update count, otherwise delete book_tag record if count reaches 0

  how do we keep track of all (unique) tagged books for a user?
-->
<!-- todo: create views for user_book_view and user_book_tag_book_view -->
<!-- todo: delete tags and update associated counts on delete book -->

<!-- todo: editions -->
<!-- todo: make date input more robust -->



<!-- VERSION 3 FEATURES/FIXES -->

<!-- todo: filter, sort, search -->
<!-- todo: statistics -->
<!-- todo: authors -->

<!-- todo: status, rating, review, read timelines -->
<!-- todo: allow user to create another read instance -->
<!-- todo: allow user to delete read, rating, and review instance -->

<!-- todo: profile display name -->
<!-- todo: profile timezone -->
<!-- todo: films, games -->

<!-- todo: option to import any csv files (similar to IFTA Fuel Card) -->



<!-- BEFORE RELEASE -->

<!-- todo: update supabase RLS -->
<!-- todo: look into cacheing? -->
<!-- todo: it appears postgres handle concurrent transactions automatically, but test just in case -->

<main class="flex flex-col gap-4 mt-4 mb-[58px] sm:mt-0 sm:mb-0">
  <Nav />
  <div class="flex flex-col gap-4 mx-4">
    <slot />
  </div>
  <Footer />
</main>