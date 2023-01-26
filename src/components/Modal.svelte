<script lang="ts">
  // svelte
  import { afterUpdate } from 'svelte';

  // components
  import Card from 'src/components/Card.svelte';
  import Heading from 'src/components/Heading.svelte';
  import Button from 'src/components/Button.svelte';
  import XButton from 'src/components/XButton.svelte';

  // props
  export let showModal: boolean = false;
  export let label: string = '';
  export let handleSubmit: any;
  export let handleCancel: any;

  afterUpdate(() => {
    const body = document.querySelector('body');

    if (body) {
      if (showModal) {
        body.classList.add('overflow-hidden');
      } else {
        body.classList.remove('overflow-hidden');
      }
    }
  });
</script>

{#if showModal}
  <div class="w-full h-screen flex justify-center fixed top-0 left-0 z-50 bg-black/50">
    <div class="w-full max-w-[800px] max-h-min flex flex-col self-start gap-4 m-8 p-4 rounded bg-slate-100 dark:bg-slate-800">
      <div class="w-full flex justify-between items-center">
        <Heading label={label} />
        <XButton handleClick={handleCancel} />
      </div>
      <slot />
      <div class="w-full flex justify-end">
        <div class="flex gap-2">
          <Button
            label="Submit"
            handleClick={handleSubmit}
          />
          <Button
            label="Cancel"
            handleClick={handleCancel}
          />
        </div>
      </div>
    </div>
  </div>
{/if}