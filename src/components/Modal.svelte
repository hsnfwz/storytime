<script lang="ts">
  // svelte
  import { afterUpdate } from 'svelte';

  // components
  import Heading from 'src/components/Heading.svelte';
  import Button from 'src/components/Button.svelte';
  import XButton from 'src/components/XButton.svelte';

  // props
  export let showModal: boolean = false;
  export let label: string = '';
  export let handleSubmit: any;
  export let handleCancel: any;

  // state
  let scrollPosition: number = 0;

  afterUpdate(() => {
    const body = document.querySelector('body');

    if (body) {
      if (showModal) {
        scrollPosition = window.scrollY;
        body.classList.add('fixed');
        body.classList.add('top-0');
        body.classList.add('left-0');
        body.classList.add('bottom-0');
        body.classList.add('right-0');
      } else {
        body.classList.remove('fixed');
        body.classList.remove('top-0');
        body.classList.remove('left-0');
        body.classList.remove('bottom-0');
        body.classList.remove('right-0');
        window.scrollTo(0, scrollPosition);
      }
    }
  });
</script>

{#if showModal}
  <div class="w-full h-full flex justify-center fixed top-0 left-0 z-50 bg-black/50 overflow-auto">
    <div class="w-full h-min md:max-w-[800px] flex flex-col self-start gap-4 md:m-4 p-4 md:rounded bg-slate-100 dark:bg-slate-800">
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