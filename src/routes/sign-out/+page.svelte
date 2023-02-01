<script lang="ts">
  // svelte
  import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Card from 'src/components/Card.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';
  import Button from 'src/components/Button.svelte';

  const signOut = () => {
		return async ({ result }: any) => {
			await invalidateAll();
			applyAction(result);
		};
	};
</script>

<Heading label="Sign Out" />
{#if $page.data.session}
  <form
    method="post"
    use:enhance={signOut}
    class="w-full flex flex-col gap-2"
  >
    <Button
      label="Sign Out"
      type="submit"
    />
  </form>
{/if}