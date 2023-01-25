<script lang="ts">
  // props
  export let label: string;
  export let link: string;
  export let handleClick: any = undefined;
  export let isSelected: boolean = false;
</script>

<a
  href={link}
  on:click={handleClick}
  class={`hover:text-sky-500 transition-all decoration-sky-500 underline decoration-2 dark:text-white dark:hover:text-sky-500 ${isSelected ? 'text-sky-500 dark:text-sky-500 no-underline pointer-events-none cursor-default' : ''}`}
>
  {label}
</a>