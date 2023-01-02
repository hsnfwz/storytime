<script lang="ts">
  // supabase
  import supabase from '$config/supabase';

  // stores
  import { session } from '$stores/SessionStore';

  // state
  let currentSession: any;

  session.subscribe((value) => currentSession = value);
</script>

<div class="flex flex-col items-center gap-4">
  <h1 class="font-bold text-xl text-center">Sign Out</h1>
  {#if currentSession}
    <button
      class="px-4 py-2 bg-neutral-100 rounded font-bold"
      type="button"
      on:click={async () => await supabase.auth.signOut()}
    >
      Sign Out
    </button>
  {:else}
    <a href="/" class="text-blue-500">Home</a>
  {/if}
</div>