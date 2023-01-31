<script lang="ts">
  // svelte
  import { applyAction, enhance } from '$app/forms';
  import { page } from '$app/stores';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Card from 'src/components/Card.svelte';
  import Link from 'src/components/Link.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';

  // form
  export let form: any;

  // state
  let isLoading: boolean = false;
  let email: string = form?.values?.email ?? '';

  const signIn = () => {
    isLoading = true;

    return async ({ result }: any) => {
			isLoading = false;
			await applyAction(result);
		};
  }
</script>

<Heading label="Sign In" />
<HorizontalDivider />
{#if !$page.data.session}
  {#if form?.error}
    <div class="dark:text-white">{form.error}</div>
  {/if}
  {#if form?.message}
    <div class="dark:text-white">{form.message}</div>
  {/if}
  <form
    method="post"
    use:enhance={signIn}
    class="w-full flex flex-col gap-2"
  >
    <div class="flex flex-col gap-2">
      <label for="email" class={`${form?.error ? 'text-red-500' : 'dark:text-white'}`}>* Email</label>
      <input
        id="email"
        type="email"
        name="email"
        bind:value={email}
        autoComplete="off"
        class={`${form?.error ? 'border-red-500' : 'dark:border-slate-600'} p-1 box-border border w-full rounded dark:bg-slate-600`}
        placeholder="Email"
      />
    </div>
    <button
      class={`flex justify-center w-full p-1 st-font-bold rounded border-2 hover:bg-slate-400 hover:border-slate-400 dark:hover:bg-slate-600 dark:hover:border-slate-600 dark:text-white disabled:opacity-50 disabled:pointer-events-none transition-all border-slate-400 dark:border-slate-600`}
      type="submit"
      disabled={isLoading || email === ''}
    >
      Sign In
    </button>
  </form>
  <p class="dark:text-white">By signing in, you agree to our <Link label="Terms of Service" link="/terms-of-service" /></p>
{:else}
  <p class="dark:text-white">You are signed in!</p>
{/if}