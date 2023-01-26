<script lang="ts">
  // svelte
  import { page } from '$app/stores';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Link from 'src/components/Link.svelte';
  import Paginator from 'src/components/Paginator.svelte';
  import ProfileItemGrid from 'src/components/ProfileItemGrid.svelte';
  import StatusSelector from 'src/components/StatusSelector.svelte';
  import Card from 'src/components/Card.svelte';

  // data
  export let data: {
    bookCollections: any,
    item: any,
  };
</script>

<Heading label={`Profile ${data.item.id} Book Collections`} />
{#if data.bookCollections.length === 0}
  <Card>
    <p>No Collections</p>
  </Card>
{:else}
  <Card>
    <div class="grid grid-flow-col gap-4">
      {#each data.bookCollections as bookCollection}
      <Link label={`${bookCollection.title} (${bookCollection.total_count})`} link={`${$page.url.pathname}/${bookCollection.id}`} />
      {/each}
    </div>
  </Card>
{/if}