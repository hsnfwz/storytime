<script lang="ts">
  // props
  export let value: string = '';
  export let placeholder: string = '';
  export let maxLength: number;
</script>

<input
  placeholder={placeholder}
  class={`p-1 box-border w-full rounded border border-neutral-100 bg-neutral-100 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600`}
  type="text"
  value={value}
  maxlength={maxLength}
/>