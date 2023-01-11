<script lang="ts">
  // svelte
  import { enhance } from '$app/forms';

  // stores
  import { profile } from '$stores/ProfileStore';

  // form
  export let form: {
    message: string,
    isTitleFail: boolean,
    isReleaseDateFail: boolean,
    isCoverFileFail: boolean,
    isUploadFail: boolean,
    isUploadSuccess: boolean,
  } | undefined;

  // state
  let currentProfile: any = undefined;
  let coverFilePath: string = '';
  let isSubmitDisabled: boolean = false;

  profile.subscribe((value) => currentProfile = value);

  $: {
    if (form?.message) setTimeout(() => form = undefined, 2000);
  }
</script>

<div class="flex flex-col gap-8 items-center">
  <h1 class="dark:text-white text-center text-2xl st-font-bold">Upload</h1>
  {#if currentProfile && currentProfile.is_contributor}
    <form
      class="flex flex-col gap-4 w-60 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg"
      method="post"
      enctype="multipart/form-data"
      use:enhance
      on:reset={() => coverFilePath = ''}
      on:submit={() => form?.message ? isSubmitDisabled = true : isSubmitDisabled = false}
    >
      <div class="flex flex-col gap-2">
        <label for="title" class={`${form?.message && form?.isTitleFail ? 'text-red-500' : 'dark:text-white'}`}>* Title</label>
        <input
          class={`${form?.isTitleFail ? 'border-red-500' : 'border-white'} p-2 box-border border-2 w-full rounded`}
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          autoComplete="off"
        />
        {#if form?.message && form?.isTitleFail}
          <p class="text-red-500">{form.message}</p>
        {/if}
      </div>
      <div class="flex flex-col gap-2">
        <label for="releaseDate" class={`${form?.message && form?.isReleaseDateFail ? 'text-red-500' : 'dark:text-white'}`}>* Release Date</label>
        <input
          class={`${form?.isReleaseDateFail ? 'border-red-500' : 'border-white'} p-2 box-border border-2 w-full rounded`}
          id="releaseDate"
          name="releaseDate"
          type="text"
          placeholder="YYYY-MM-DD"
          autoComplete="off"
        />
        {#if form?.message && form?.isReleaseDateFail}
          <p class="text-red-500">{form.message}</p>
        {/if}
      </div>
      <div class="flex flex-col gap-2">
        <p class={`${form?.message && form?.isCoverFileFail ? 'text-red-500' : 'dark:text-white'}`}>* Cover File</p>
        <label for="coverFile" class="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis p-2 bg-blue-500 text-white rounded">{coverFilePath || 'WEBP'}</label>
        <input
          class="hidden"
          id="coverFile"
          name="coverFile"
          type="file"
          accept="image/webp"
          bind:value={coverFilePath}
        />
        {#if form?.message && form?.isCoverFileFail}
          <p class="text-red-500">{form.message}</p>
        {/if}
      </div>
      <div class="flex gap-4">
        <button type="reset" class="st-font-bold w-full rounded px-4 py-2 bg-red-500 text-white">Reset</button>
        <button type="submit" class="st-font-bold w-full rounded px-4 py-2 bg-green-500 text-white disabled:opacity-50" disabled={form?.message ? true : false}>Submit</button>
      </div>
      {#if form?.message && (form?.isUploadSuccess || form?.isUploadFail)}
        <p class="dark:text-white text-center">{form?.message}</p>
      {/if}
    </form>
  {:else}
    <p class="dark:text-white text-center">Become a contributor to start uploading</p>
  {/if}
</div>