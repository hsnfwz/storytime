<script lang="ts">
  // svelte
  import { page } from '$app/stores';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Link from 'src/components/Link.svelte';
  import Card from 'src/components/Card.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';

  // data
  export let data: any;

  const bookStatusAllCount: number = data.userProfile.book_status_tracking_count + data.userProfile.book_status_to_read_count + data.userProfile.book_status_reading_count + data.userProfile.book_status_read_count + data.userProfile.book_status_dnf_count;
</script>

<Heading label={`Profile ${data.userProfile.id}`} />
<HorizontalDivider />
<Link
  label={`Books (${bookStatusAllCount})`}
  link={`/profiles/${$page.data.session.user.id}/books`}
/>
<Link
  label={`Book Tags (${data.userProfile.user_book_tag_count})`}
  link={`/profiles/${$page.data.session.user.id}/book-tags`}
/>