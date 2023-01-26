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
        body.classList.add('touch-none');
        // body.classList.add('overflow-hidden');
        // body.classList.add('relative');
      } else {
        body.classList.remove('overflow-hidden');
        body.classList.remove('touch-none');
        // body.classList.remove('relative');
      }
    }
  });
</script>

{#if showModal}
  <div class="w-full h-screen flex justify-center fixed top-0 left-0 z-50 bg-black/50">
    <div class="w-full h-screen md:max-w-[800px] md:max-h-min md:h-min flex flex-col self-start gap-4 md:m-4 p-4 md:rounded bg-slate-100 dark:bg-slate-800 overflow-auto">
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