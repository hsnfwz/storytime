<script lang="ts">
  // props
  export let label: string = 'Button';
  export let handleClick: any;
  export let isDisabled: boolean = false;
  export let isSelected: boolean = false;
</script>

<button
  class={`flex gap-2 justify-center w-full p-2 st-font-bold rounded border hover:bg-neutral-200 hover:border-neutral-200 dark:hover:bg-slate-500 dark:hover:border-slate-500 dark:text-white disabled:opacity-50 disabled:pointer-events-none transition-all ${isSelected ? 'border-sky-500 bg-transparent pointer-events-none' : 'bg-neutral-100 border-neutral-100 dark:bg-slate-600 dark:border-slate-600'}`}
  type="button"
  on:click={handleClick()}
  disabled={isDisabled}
>
  {label}
</button>