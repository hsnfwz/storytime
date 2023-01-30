<script lang="ts">
  // components
  import Card from 'src/components/Card.svelte';
  import Heading from 'src/components/Heading.svelte';
  import Link from 'src/components/Link.svelte';
</script>

<div class="w-full max-w-[800px] m-auto">
  <Card>
    <Heading label="Explore" />
    <Link label="Books" link="/explore/books" />
  </Card>
</div>