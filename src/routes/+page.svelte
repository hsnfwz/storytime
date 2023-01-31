<script lang="ts">
  // components
  import Heading from 'src/components/Heading.svelte';
  import Card from 'src/components/Card.svelte';
  import InfoCard from 'src/components/InfoCard.svelte';
  import Link from 'src/components/Link.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';

  // data
  export let data: {
    profile: any,
  };
</script>

<Heading label="Home" />
<HorizontalDivider />
{#if data.profile}
  <p class="dark:text-white">Welcome back Profile {data.profile.id}!</p>
{:else}
  <InfoCard>
    <p><Link link="/sign-in" label="Sign in" /> to start managing your books</p>
  </InfoCard>
{/if}