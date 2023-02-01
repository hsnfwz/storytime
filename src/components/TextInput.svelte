<script lang="ts">
  // props
  export let value: string = '';
  export let placeholder: string = '';
  export let maxLength: number | undefined = undefined;
</script>

<input
  placeholder={placeholder}
  class={`p-1 box-border w-full border border-slate-400 dark:border-slate-700 dark:text-white dark:bg-transparent rounded`}
  type="text"
  bind:value={value}
  maxlength={maxLength}
/>