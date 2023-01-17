<script lang="ts">
  // props
  export let profiles: any;
</script>

{#if profiles.length === 0}
  <p class="dark:text-white text-center">Empty</p>
{:else}
  <div class="flex flex-col gap-4">
    {#each profiles as profile}
      <div class="flex flex-col items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded p-4">
        <p class="dark:text-white st-font-bold">Profile {profile.id}</p>
        <p class="dark:text-white">Joined {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(profile.created_at))}</p>
        <a
          href={`/profiles/${profile.id}`}
          class="text-blue-500"
        >
          View Profile
        </a>
      </div>
    {/each}
  </div>
{/if}