<script lang="ts">
  // props
  export let handleClick: any;
  export let isDisabled: boolean = false;
</script>

<button
  class={`p-1 flex justify-center items-center rounded border-2 border-slate-300 hover:bg-slate-300 hover:border-slate-300 dark:border-slate-600 dark:hover:bg-slate-600 hover:dark:border-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-all group`}
  type="button"
  on:click={handleClick()}
  disabled={isDisabled}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    class="w-5 h-5 fill-slate-300 dark:fill-slate-600 group-hover:fill-white transition-all"
  >
    <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
  </svg>
</button>