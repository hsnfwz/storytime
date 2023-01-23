<script lang="ts">
  // enums
  import E_BookStatus from '$enums/E_BookStatus';

  // components
  import Link from '$components/Link.svelte';
  import Card from '$components/Card.svelte';

  // props
  export let currentStatus: string = '';
</script>

<Card>
  <div class={`grid sm:grid-flow-col gap-4 justify-center text-center`}>
    <Link 
      label={E_BookStatus.ALL.text}
      link={`?status=${E_BookStatus.ALL.url}`}
      isSelected={currentStatus === E_BookStatus.ALL.text}
    />
    <Link 
      label={E_BookStatus.TO_READ.text}
      link={`?status=${E_BookStatus.TO_READ.url}`}
      isSelected={currentStatus === E_BookStatus.TO_READ.text}
    />
    <Link 
      label={E_BookStatus.READING.text}
      link={`?status=${E_BookStatus.READING.url}`}
      isSelected={currentStatus === E_BookStatus.READING.text}
    />
    <Link 
      label={E_BookStatus.READ.text}
      link={`?status=${E_BookStatus.READ.url}`}
      isSelected={currentStatus === E_BookStatus.READ.text}
    />
    <Link 
      label={E_BookStatus.DNF.text}
      link={`?status=${E_BookStatus.DNF.url}`}
      isSelected={currentStatus === E_BookStatus.DNF.text}
    />
  </div>
</Card>