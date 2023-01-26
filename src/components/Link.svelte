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
  class={`hover:text-slate-600 transition-all decoration-slate-600 underline decoration-2 dark:text-white dark:hover:text-slate-600 ${isSelected ? 'text-slate-600 dark:text-slate-600 no-underline pointer-events-none cursor-default' : ''}`}
>
  {label}
</a>