<script lang="ts">
  // props
  export let handleClick: any;
  export let isDisabled: boolean = false;
</script>

<button
  class={`p-1 flex justify-center items-center rounded border-2 border-rose-500 hover:bg-rose-500 hover:border-rose-500 disabled:opacity-50 disabled:pointer-events-none transition-all group`}
  type="button"
  on:click={handleClick()}
  disabled={isDisabled}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-rose-500 group-hover:fill-white transition-all">
    <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
  </svg>
</button>