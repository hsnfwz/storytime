<script lang="ts">
  // components
  import Card from 'src/components/Card.svelte';
  import Heading from 'src/components/Heading.svelte';
  import Link from 'src/components/Link.svelte';
</script>

<div class="w-full max-w-[800px] m-auto">
  <Card>
    <Heading label="Explore" />
    <div class="self-start">
      <Link label="Books" link="/explore/books" />
    </div>
  </Card>
</div>