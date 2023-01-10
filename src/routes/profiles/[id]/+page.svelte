<script lang="ts">
  // svelte
  import { onMount } from 'svelte';

  // state
  let profile: any;

  onMount(() => {
    const viewProfile: any = sessionStorage.getItem('view-profile');

    if (viewProfile) {
      profile = JSON.parse(viewProfile);
    }
  });
</script>

{#if profile}
  <div class="flex flex-col items-center gap-4">
    <h1 class="dark:text-white text-center font-bold text-2xl">Profile {profile.id}</h1>
    <a
      href={`/profiles/${profile.id}/books`}
      class="text-blue-500"
    >
      View Books
    </a>
  </div>
{/if}