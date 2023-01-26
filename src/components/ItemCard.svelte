<script lang="ts">
  // interfaces
  import type I_Book from 'src/interfaces/I_Book';

  // api
  import { getPublicUrl } from 'src/api/storage';

  // helpers
  import { formatFileName } from 'src/helpers/helpers';

  // props
  export let item: I_Book;
</script>

<img
  src={getPublicUrl('book-covers', `${formatFileName(item.title, item.id)}/${formatFileName(item.title, item.id, true)}`)}
  alt={item.title}
  class="w-full h-full rounded"
/>