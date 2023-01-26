<script lang="ts">
  // components
  import Heading from 'src/components/Heading.svelte';
  import Paginator from 'src/components/Paginator.svelte';
  import ProfileItemGrid from 'src/components/ProfileItemGrid.svelte';
  import StatusSelector from 'src/components/StatusSelector.svelte';

  // data
  export let data: {
    items: any,
    currentPage: number,
    maxPageItemsCount: number,
    currentStatus: string,
    item: any,
  };
</script>

<Heading label={`Profile ${data.item.id} Books`} />
<StatusSelector
  currentStatus={data.currentStatus}
  bookStatusToReadCount={data.item.book_status_to_read_count}
  bookStatusReadingCount={data.item.book_status_reading_count}
  bookStatusReadCount={data.item.book_status_read_count}
  bookStatusDNFCount={data.item.book_status_dnf_count}
/>
<ProfileItemGrid items={data.items} />
<Paginator
  currentPage={data.currentPage}
  maxPageItemsCount={data.maxPageItemsCount}
  currentItemsCount={data.items.length}
/>