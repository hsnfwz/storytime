<script lang="ts">
  // svelte
  import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Card from 'src/components/Card.svelte';

  const signOut = () => {
		return async ({ result }: any) => {
			await invalidateAll();
			applyAction(result);
		};
	};
</script>

<div class="w-full m-auto max-w-[800px]">
  <Card>
    <Heading label="Sign Out" />
    {#if $page.data.session}
      <form
        method="post"
        use:enhance={signOut}
        class="w-full flex flex-col gap-2"
      >
        <button
          class={`flex justify-center w-full p-1 st-font-bold rounded border-2 hover:bg-slate-300 hover:border-slate-300 dark:hover:bg-slate-600 dark:hover:border-slate-600 dark:text-white disabled:opacity-50 disabled:pointer-events-none transition-all border-slate-300 dark:border-slate-600`}
          type="submit"
        >
          Sign Out
        </button>
      </form>
    {/if}
  </Card>
</div>