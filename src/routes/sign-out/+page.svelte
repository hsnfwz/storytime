<script lang="ts">
  // supabase
  import supabase from '$config/supabase';

  // stores
  import { session } from '$stores/SessionStore';

  // state
  let currentSession: any;

  session.subscribe((value) => currentSession = value);
</script>

<div class="flex flex-col items-center gap-8">
  <h1 class="dark:text-white st-font-bold text-2xl text-center">Sign Out</h1>
  {#if currentSession}
    <button
      class="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 dark:text-white rounded st-font-bold"
      type="button"
      on:click={async () => await supabase.auth.signOut()}
    >
      Sign Out
    </button>
  {:else}
    <p class="dark:text-white text-center">You are signed out!</p>
  {/if}
</div>