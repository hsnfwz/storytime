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
  let slotContainer: any;
  let isSlotContainerOverflow: boolean = false;

  afterUpdate(() => {
    if (slotContainer && (slotContainer.clientHeight < slotContainer.scrollHeight)) {
      isSlotContainerOverflow = true;
    } else {
      isSlotContainerOverflow = false;
    }

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

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        showModal = false;
        handleCancel();
      }
    });

    window.addEventListener('resize', (e) => {
      if (slotContainer && (slotContainer.clientHeight < slotContainer.scrollHeight)) {
        isSlotContainerOverflow = true;
      } else {
        isSlotContainerOverflow = false;
      }
    });
  });
</script>

{#if showModal}
  <div class="w-full h-full flex justify-center fixed top-0 left-0 z-50 bg-black/75 p-4">

    <div class="w-full max-w-[800px] h-full flex flex-col gap-4 p-4 rounded bg-slate-100 dark:bg-slate-800">

      <div class="w-full flex justify-between items-center">
        <Heading label={label} />
        <XButton handleClick={handleCancel} />
      </div>

      <div bind:this={slotContainer} class={`flex flex-col gap-4 h-full ${isSlotContainerOverflow ? 'pr-4' : 'pr-0'} overflow-auto`}>
        <slot />
      </div>

      <div class="flex gap-2 self-end">
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
{/if}