<script lang="ts">
  // props
  export let label: string = 'Button';
  export let handleClick: any = undefined;
  export let isDisabled: boolean = false;
  export let isSelected: boolean = false;
  export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
</script>

<button
  class={`flex justify-center items-center w-full p-1 rounded border border-slate-400 dark:border-slate-700 dark:text-white disabled:opacity-50 disabled:pointer-events-none st-font-bold ${isSelected ? 'bg-slate-400 dark:bg-slate-700 pointer-events-none' : ''}`}
  type={type}
  on:click={handleClick()}
  disabled={isDisabled}
>
  {label}
</button>