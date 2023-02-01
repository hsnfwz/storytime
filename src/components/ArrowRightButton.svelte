<script lang="ts">
  // props
  export let handleClick: any;
  export let isDisabled: boolean = false;
</script>

<button
  class={`p-1 flex justify-center items-center border border-slate-400 dark:border-slate-700 disabled:opacity-50 disabled:pointer-events-none rounded`}
  type="button"
  on:click={handleClick()}
  disabled={isDisabled}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-slate-400 dark:fill-slate-600">
    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
  </svg>
</button>