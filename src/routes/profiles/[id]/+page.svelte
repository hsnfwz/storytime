<script lang="ts">
  // components
  import ItemGrid from '$components/ItemGrid.svelte';

  // data
  export let data: {
    profileBooks: any,
    books: any,
  }
</script>

<ItemGrid items={data.books} />