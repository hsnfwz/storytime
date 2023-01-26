<script lang="ts">
  // components
  import Heading from 'src/components/Heading.svelte';
  import Paginator from 'src/components/Paginator.svelte';
  import ProfileItemGrid from 'src/components/ProfileItemGrid.svelte';
  import StatusSelector from 'src/components/StatusSelector.svelte';

  // data
  export let data: {
    bookCollection: any,
    bookCollectionBooks: any,
    item: any,
  };
</script>

<Heading label={`Profile ${data.item.id} Book Collection: ${data.bookCollection.title}`} />
<ProfileItemGrid items={data.bookCollectionBooks} />
<!-- <Paginator
  currentPage={data.currentPage}
  maxPageItemsCount={data.maxPageItemsCount}
  currentItemsCount={data.items.length}
/> -->