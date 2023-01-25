<script lang="ts">
  // props
  export let handleClick: any;
  export let isDisabled: boolean = false;
</script>

<button
  class={`p-1 flex justify-center items-center rounded border-2 border-sky-500 hover:bg-sky-500 hover:border-sky-500 disabled:opacity-50 disabled:pointer-events-none transition-all group`}
  type="button"
  on:click={handleClick()}
  disabled={isDisabled}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-sky-500 group-hover:fill-white transition-all">
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
</button>