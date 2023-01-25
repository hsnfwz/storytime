<script lang="ts">
  // components
  import Heading from '$components/Heading.svelte';
  import Paginator from '$components/Paginator.svelte';
  import ProfileItemGrid from '$components/ProfileItemGrid.svelte';
  import StatusSelector from '$components/StatusSelector.svelte';

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