<script lang="ts">
  // components
  import Card from 'src/components/Card.svelte';
  import Heading from 'src/components/Heading.svelte';
  import Paginator from 'src/components/Paginator.svelte';
  import MasonryGrid from 'src/components/MasonryGrid.svelte';

  // data
  export let data: any;
</script>

<Card>
  <Heading label="Books" />
</Card>
<MasonryGrid items={data.books} />
<Card>
  <Paginator
    currentPage={data.currentPage}
    maxPageItemsCount={data.maxPageItemsCount}
    currentItemsCount={data.books.length}
  />
</Card>