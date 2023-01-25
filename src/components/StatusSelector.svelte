<script lang="ts">
  // svelte
  import { page } from '$app/stores';

  // enums
  import E_BookStatus from '$enums/E_BookStatus';

  // components
  import Link from '$components/Link.svelte';
  import Card from '$components/Card.svelte';

  // props
  export let currentStatus: string = '';
  export let bookStatusToReadCount: number;
  export let bookStatusReadingCount: number;
  export let bookStatusReadCount: number;
  export let bookStatusDNFCount: number;

  const bookStatusAllCount: number = bookStatusToReadCount + bookStatusReadingCount + bookStatusReadCount + bookStatusDNFCount;
</script>

<Card>
  <div class={`grid sm:grid-flow-col gap-4 justify-center text-center`}>
    <Link 
      label={`${E_BookStatus.ALL.text} (${bookStatusAllCount})`}
      link={`?status=${E_BookStatus.ALL.url}`}
      isSelected={currentStatus === E_BookStatus.ALL.text}
    />
    <Link 
      label={`${E_BookStatus.TO_READ.text} (${bookStatusToReadCount})`}
      link={`?status=${E_BookStatus.TO_READ.url}`}
      isSelected={currentStatus === E_BookStatus.TO_READ.text}
    />
    <Link 
      label={`${E_BookStatus.READING.text} (${bookStatusReadingCount})`}
      link={`?status=${E_BookStatus.READING.url}`}
      isSelected={currentStatus === E_BookStatus.READING.text}
    />
    <Link 
      label={`${E_BookStatus.READ.text} (${bookStatusReadCount})`}
      link={`?status=${E_BookStatus.READ.url}`}
      isSelected={currentStatus === E_BookStatus.READ.text}
    />
    <Link 
      label={`${E_BookStatus.DNF.text} (${bookStatusDNFCount})`}
      link={`?status=${E_BookStatus.DNF.url}`}
      isSelected={currentStatus === E_BookStatus.DNF.text}
    />
    <Link 
      label="Collections"
      link={`${$page.url.pathname}/collections`}
    />
  </div>
</Card>