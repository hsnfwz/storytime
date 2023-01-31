<script lang="ts">
  // props
  export let handleClick: any;
  export let isDisabled: boolean = false;
</script>

<button
class={`p-1 flex justify-center items-center rounded border-2 border-slate-400 hover:bg-slate-400 hover:border-slate-400 dark:border-slate-600 dark:hover:bg-slate-600 hover:dark:border-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-all group`}
  type="button"
  on:click={handleClick()}
  disabled={isDisabled}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    class="w-5 h-5 fill-slate-400 dark:fill-slate-600 group-hover:fill-white transition-all"
  >
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
  </svg>  
</button>