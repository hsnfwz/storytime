<script lang="ts">
  // props
  export let value: string = '';
  export let placeholder: string = '';
  export let maxLength: number | undefined = undefined;
</script>

<textarea
  rows="8"
  maxlength={maxLength}
  class={`resize-none p-1 box-border w-full rounded border border-neutral-100 bg-neutral-100 dark:border-slate-600 dark:bg-slate-600 dark:text-white`}
  placeholder={placeholder}
  bind:value={value}
/>