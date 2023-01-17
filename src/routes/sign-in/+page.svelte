<script lang="ts">
  // svelte
  import { dev } from '$app/environment';

  // config
  import supabase from '$config/supabase';

  // stores
  import { session } from '$stores/SessionStore';

  // state
  let currentSession: any;
  let email: string = '';
  let showSuccessMessage: boolean = false;
  let showErrorMessage: boolean = false;

  session.subscribe((value) => currentSession = value);

  const handleSubmit = async () => {
    if (email.length < 3) {
      showErrorMessage = true;
    } else {
      showSuccessMessage = true;

      let options: any;

      if (dev) options = { emailRedirectTo: 'http://localhost:5173' };

      await supabase.auth.signInWithOtp({ email, options });
    }
  }

  $: {
    if (showErrorMessage) setTimeout(() => showErrorMessage = false, 2000);
  }
</script>

<div class="flex flex-col items-center gap-4">
  <h1 class="dark:text-white st-font-bold text-xl text-center">Sign In</h1>
  {#if currentSession}
    <p class="darK:text-white text-center">You are already signed in!</p>
  {:else}
    {#if showSuccessMessage}
      <div class="flex flex-col gap-4 w-60">
        <p class="dark:text-white text-center">
          We sent an email to you at <span class="st-font-bold dark:text-white">{email}</span>. It has a magic link that will sign you in.
        </p>
      </div>
    {:else}
      <form class="flex flex-col gap-4 w-60 bg-neutral-100 dark:bg-neutral-900 p-4 rounded">
        <div class="flex flex-col gap-2">
          <label for="user-email" class={`${showErrorMessage ? 'text-red-500' : 'dark:text-white'}`}>* Email</label>
          <input
            id="user-email"
            type="email"
            autoComplete="off"
            bind:value={email}
            class={`${showErrorMessage ? 'border-red-500' : 'border-white'} p-2 box-border border w-full rounded`}
            placeholder="Email"
          />
        </div>
        {#if showErrorMessage}
          <p class="text-red-500">Email must be between 3 and 320 characters</p>
        {/if}
        <button
          class="rounded px-4 py-2 bg-blue-500 text-white st-font-bold disabled:opacity-50"
          on:click={async () => await handleSubmit()}
          disabled={showErrorMessage}
        >
          Sign In
        </button>
        <p class="dark:text-white">By signing in, you agree to our <a class="text-blue-500" href="/terms-and-conditions">Terms and Conditions.</a></p>
      </form>
    {/if}
  {/if}
</div>