<script lang="ts">
  // svelte
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // helpers
  import { sortBy } from 'src/helpers/helpers';

  // api
  import { insertRecords } from 'src/api/database';

  // components
  import Card from 'src/components/Card.svelte';
  import Heading from 'src/components/Heading.svelte';
  import Paginator from 'src/components/Paginator.svelte';
  import MasonryGrid from 'src/components/MasonryGrid.svelte';
  import Button from 'src/components/Button.svelte';
  import TextInput from 'src/components/TextInput.svelte';
  import WarningCard from 'src/components/WarningCard.svelte';
  import HorizontalDivider from 'src/components/HorizontalDivider.svelte';

  // data
  export let data: any;

  // state
  let isLoading: boolean = false;
  let tags: any = data.userBookTags;
  let tagName: string = '';

  let tagExists: boolean = false;

  $: {
    if (tagExists) setTimeout(() => tagExists = false, 2000);
  }

  const handleAddUserBookTag = async () => {
    isLoading = true;

    if (tags.findIndex((tag: any) => tag.name === tagName) !== -1) {
      tagExists = true;
      isLoading = false;
      return;
    }

    const newUserBookTagData: any = {
      user_id: $page.data.session.user.id,
      name: tagName,
    };

    const newUserBookTagRecords: any = await insertRecords('user_book_tag', [newUserBookTagData], '*');

    tags = sortBy([...tags, newUserBookTagRecords[0]], 'name', true);

    tagName = '';

    isLoading = false;
  }
</script>

<Heading label={`Profile ${data.userProfile.id} Tags`} />
<HorizontalDivider />
{#if tagExists}
  <WarningCard>
    <p class="w-full dark:text-white">Tag already exists.</p>
  </WarningCard>
{/if}
<div class="w-full flex flex-col gap-2">
  <label for="">Tag</label>
  <TextInput
    placeholder="Tag (max. 40 characters)"
    bind:value={tagName}
    maxLength={40}
  />
  <Button
    label="Add Tag"
    handleClick={async () => await handleAddUserBookTag()}
    isDisabled={isLoading || tagName === ''}
  />
</div>
<div class="flex flex-col sm:flex-row gap-2">
  <Button
    label={`All (${data.userProfile.user_book_tag_count})`}
    isSelected={data.currentStatus === 'All'}
    handleClick={() => goto(`?tag=all&page=${data.currentPage}`, { replaceState: true })}
    isDisabled={isLoading}
  />
  {#each tags as tag}
    <Button
      label={`${tag.name} (${tag.count})`}
      isSelected={data.currentStatus === 'All'}
      handleClick={() => goto(`?tag=${tag.name}&page=${data.currentPage}`, { replaceState: true })}
      isDisabled={isLoading}
    />
  {/each}
</div>