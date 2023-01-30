<script lang="ts">
  // svelte
  import { page } from '$app/stores';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Link from 'src/components/Link.svelte';
  import Card from 'src/components/Card.svelte';

  // data
  export let data: { userProfile: any };
</script>

<Card>
  <Heading label={`Profile ${data.userProfile.id}`} />
  <Link
    label="Books"
    link={`/profiles/${$page.data.session.user.id}/books`}
  />
</Card>