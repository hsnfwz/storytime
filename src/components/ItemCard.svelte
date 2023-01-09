<script lang="ts">
  // interfaces
  import type I_Book from '$interfaces/I_Book';

  // api
  import { getPublicUrl } from '$api/storage';

  // helpers
  import { formatFileName } from '$helpers/helpers';

  // props
  export let item: I_Book;
</script>

<img
  src={getPublicUrl('book-covers', `${formatFileName(item.title, item.id)}/${formatFileName(item.title, item.id, true)}`)}
  alt={item.title}
  width="320px"
  height=""
  class="rounded-lg"
/>