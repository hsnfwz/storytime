<script lang="ts">
  // props
  export let value: string = '';
  export let placeholder: string = '';
  export let maxLength: number;
</script>

<textarea
  rows="8"
  maxlength={maxLength}
  class={`resize-none p-1 box-border w-full rounded border border-neutral-100 bg-neutral-100 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600`}
  placeholder={placeholder}
  value={value}
/>