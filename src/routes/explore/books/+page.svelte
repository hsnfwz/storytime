<script lang="ts">
  // components
  import Card from 'src/components/Card.svelte';
  import Heading from 'src/components/Heading.svelte';
  import Paginator from 'src/components/Paginator.svelte';
  import MasonryGrid from 'src/components/MasonryGrid.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';

  // data
  export let data: any;
</script>

<Heading label="Books" />
<HorizontalDivider />
<MasonryGrid items={data.books} />
<HorizontalDivider />
<Paginator
  currentPage={data.currentPage}
  maxPageItemsCount={data.maxPageItemsCount}
  currentItemsCount={data.books.length}
/>