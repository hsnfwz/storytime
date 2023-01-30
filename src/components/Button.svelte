<script lang="ts">
  // props
  export let label: string = 'Button';
  export let handleClick: any;
  export let isDisabled: boolean = false;
  export let isSelected: boolean = false;
</script>

<button
  class={`flex justify-center items-center w-full p-1 st-font-bold rounded border-2 hover:bg-slate-300 hover:border-slate-300 dark:hover:bg-slate-600 dark:hover:border-slate-600 dark:text-white disabled:opacity-50 disabled:pointer-events-none transition-all ${isSelected ? 'border-slate-600 bg-slate-600 text-white pointer-events-none cursor-default' : 'border-slate-300 dark:border-slate-600'}`}
  type="button"
  on:click={handleClick()}
  disabled={isDisabled}
>
  {label}
</button>