<script lang="ts">
  // svelte
  import { onMount, tick } from 'svelte';

  // api
  import { getRecords } from 'src/api/database';

  // components
  import Link from 'src/components/Link.svelte';
  import Button from 'src/components/Button.svelte';
  import Card from 'src/components/Card.svelte';

  // props
  let profiles: any = [];

  onMount(async () => {
    const _profiles: any = sessionStorage.getItem('profiles');

    if (_profiles) {
      profiles = JSON.parse(_profiles);
    } else {
      profiles = await getRecords(
        'profile',
        '*',
        undefined,
        {
          column: 'created_at',
          ascending: false
        },
        {
          from: 0,
          to: 23,
        }
      );

      sessionStorage.setItem('profiles', JSON.stringify(profiles));
    }

    await tick();
    const profilesScrollY: any = sessionStorage.getItem('profiles-scroll-y');
    if (profilesScrollY) {
      const _profilesScrollY: any = JSON.parse(profilesScrollY);
      window.scrollTo(0, _profilesScrollY);
    }
  });
</script>

<div class={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4`}>
  {#each profiles as profile}
    <Card>
      <p class="dark:text-white text-center st-font-bold">Profile {profile.id}</p>
      <p class="dark:text-white text-center">Joined {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(profile.created_at))}</p>
      <Link
        label="View Profile"
        link={`/profiles/${profile.id}`}
      />
    </Card>
  {/each}
</div>

<Button
  label="Show More"
  handleClick={async () => {
    const limit = 23;
    const from = profiles.length;
    const to = profiles.length + limit;

    const _profiles = await getRecords(
      'profile',
      '*',
      undefined,
      {
        column: 'created_at',
        ascending: false
      },
      {
        from,
        to,
      }
    );

    profiles = [...profiles, ..._profiles];

    sessionStorage.setItem('profiles', JSON.stringify(profiles));
  }}
  isDisabled={profiles.length === 0 || profiles.length % 24 !== 0}
/>