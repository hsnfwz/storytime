<script lang="ts">
  // api
  import { getPublicUrl } from 'src/api/storage';

  // helpers
  import { formatFileName } from 'src/helpers/helpers';

  // props
  export let item: any;
</script>

<img
  src={getPublicUrl('book-covers', `${formatFileName(item.title, item.id)}/${formatFileName(item.title, item.id, true)}`)}
  alt={item.title}
  class="w-full h-full rounded"
/>