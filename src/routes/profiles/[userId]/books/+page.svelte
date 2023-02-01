<script lang="ts">
  // svelte
  import { goto } from '$app/navigation';

  // enums
  import E_BookStatus from 'src/enums/E_BookStatus';

  // components
  import Card from 'src/components/Card.svelte';
  import Heading from 'src/components/Heading.svelte';
  import Paginator from 'src/components/Paginator.svelte';
  import MasonryGrid from 'src/components/MasonryGrid.svelte';
  import Button from 'src/components/Button.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';

  // data
  export let data: any;

  // state
  const bookStatusAllCount: number = data.userProfile.book_status_tracking_count + data.userProfile.book_status_to_read_count + data.userProfile.book_status_reading_count + data.userProfile.book_status_read_count + data.userProfile.book_status_dnf_count;
</script>

<Heading label={`Profile ${data.userProfile.id} Books`} />
<div class="flex flex-col sm:flex-row gap-2">
  <Button
    label={`All (${bookStatusAllCount})`}
    isSelected={data.currentStatus === 'All'}
    handleClick={() => goto(`?status=all&page=${data.currentPage}`, { replaceState: true })}
  />
  <Button
    label={`${E_BookStatus.TRACKING.text} (${data.userProfile.book_status_tracking_count})`}
    isSelected={data.currentStatus === E_BookStatus.TRACKING.text}
    handleClick={() => goto(`?status=${E_BookStatus.TRACKING.url}&page=${data.currentPage}`, { replaceState: true })}
  />
  <Button
    label={`${E_BookStatus.TO_READ.text} (${data.userProfile.book_status_to_read_count})`}
    isSelected={data.currentStatus === E_BookStatus.TO_READ.text}
    handleClick={() => goto(`?status=${E_BookStatus.TO_READ.url}&page=${data.currentPage}`, { replaceState: true })}
  />
  <Button
    label={`${E_BookStatus.READING.text} (${data.userProfile.book_status_reading_count})`}
    isSelected={data.currentStatus === E_BookStatus.READING.text}
    handleClick={() => goto(`?status=${E_BookStatus.READING.url}&page=${data.currentPage}`, { replaceState: true })}
  />
  <Button
    label={`${E_BookStatus.READ.text} (${data.userProfile.book_status_read_count})`}
    isSelected={data.currentStatus === E_BookStatus.READ.text}
    handleClick={() => goto(`?status=${E_BookStatus.READ.url}&page=${data.currentPage}`, { replaceState: true })}
  />
  <Button
    label={`${E_BookStatus.DNF.text} (${data.userProfile.book_status_dnf_count})`}
    isSelected={data.currentStatus === E_BookStatus.DNF.text}
    handleClick={() => goto(`?status=${E_BookStatus.DNF.url}&page=${data.currentPage}`, { replaceState: true })}
  />
</div>
<MasonryGrid items={data.books} />
<Paginator
  currentPage={data.currentPage}
  maxPageItemsCount={data.maxPageItemsCount}
  currentItemsCount={data.books.length}
/>