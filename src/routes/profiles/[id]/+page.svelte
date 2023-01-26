<script lang="ts">
  // components
  import Heading from 'src/components/Heading.svelte';
  import Link from 'src/components/Link.svelte';
  import Card from 'src/components/Card.svelte';

  // data
  export let data: { item: any };
</script>

<Heading label={`Profile ${data.item.id}`} />
<Card>
  <Link
    label="Books"
    link={`/profiles/${data.item.id}/books`}
  />
</Card>