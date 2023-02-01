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
    bodyElement?.classList.add('dark:bg-slate-900');
  });
</script>

<!-- VERSION 2 FEATURES/FIXES -->
<!-- todo: hide rating score, rating count and reviews count by default, let user click to view it -->
<!-- todo: create 18px (heading), 16px (body/subheading) and 14px (body) text components -->
<!-- todo: editions: author, title, series title, series entry, cover, publish date, page count, edition title, edition series title, edition series entry, isbn 10, isbn 13, format, language, publisher, description -->

<!-- todo: before updating counts for book, we need to get the latest count and ensure no other user has updated it before we update it. one way to do this is to subcribe to the book, but there is still a chance the data becomes inconsistent. maybe for book, we need to use count()  -->
<!-- todo:
  - ADD TO COLLECTION: insert book_tag record if tag does not exist and update count, otherwise only update count
  - REMOVE FROM COLLECTION: update count, otherwise delete book_tag record if count reaches 0
  - how do we keep track of all (unique) tagged books for a user?
-->
<!-- todo: create views for user_book_view and user_book_tag_book_view -->
<!-- todo: delete tags and update associated counts on delete book -->

<!-- VERSION 3 FEATURES/FIXES -->
<!-- todo: make date input more robust -->
<!-- todo: filter, sort, search -->
<!-- todo: statistics -->
<!-- todo: status, rating, review, read timelines -->
<!-- todo: allow user to create another read instance -->
<!-- todo: allow user to delete read, rating, and review instance -->
<!-- todo: maybe link a user to their unique and all status books, all tags, all ratings, and all reviews -->
<!-- todo: profile display name -->
<!-- todo: profile timezone -->
<!-- todo: films, games -->
<!-- todo: option to import any csv files (similar to IFTA Fuel Card) -->

<!-- BEFORE RELEASE -->
<!-- todo: update supabase RLS -->
<!-- todo: look into cacheing? -->
<!-- todo: it appears postgres handle concurrent transactions automatically, but test just in case -->

<main class="flex flex-col gap-4 mt-4 mb-[33px] sm:mt-0 sm:mb-0">
  <Nav />
  <div class="flex flex-col gap-4 mx-4">
    <slot />
  </div>
  <Footer />
</main>