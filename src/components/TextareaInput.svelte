<script lang="ts">
  // props
  export let value: string = '';
  export let placeholder: string = '';
  export let maxLength: number | undefined = undefined;
</script>

<textarea
  rows="8"
  maxlength={maxLength}
  class={`resize-none p-1 box-border w-full border border-slate-400 dark:border-slate-700 dark:bg-transparent dark:text-white rounded`}
  placeholder={placeholder}
  bind:value={value}
/>