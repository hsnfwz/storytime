<script lang="ts">
  // components
  import Heading from '$components/Heading.svelte';
  import Paginator from '$components/Paginator.svelte';
  import ProfileItemGrid from '$components/ProfileItemGrid.svelte';
  import StatusSelector from '$components/StatusSelector.svelte';

  // data
  export let data: {
    items: any,
    currentPage: number,
    maxPageItemsCount: number,
    currentStatus: string,
  };
</script>

<Heading label={`Profile Books`} />
<StatusSelector currentStatus={data.currentStatus} />
<ProfileItemGrid items={data.items} />
<Paginator
  currentPage={data.currentPage}
  maxPageItemsCount={data.maxPageItemsCount}
  currentItemsCount={data.items.length}
/>