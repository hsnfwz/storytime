<script lang="ts">
  // props
  export let value: number;
</script>

<div class="flex flex-col gap-2 justify-center items-center rounded-full w-full">
  <input
    class="slider-light dark:slider-dark"
    type="range"
    min="0"
    max="10"
    value={value}
    on:input={(e) => value = +e.target.value}
  />
  <div class="w-full grid grid-cols-11">
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 0 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 0}
    >
      0
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 1 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 1}
    >
      1
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 2 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 2}
    >
      2
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 3 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 3}
    >
      3
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 4 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 4}
    >
      4
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 5 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 5}
    >
      5
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 6 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 6}
    >
      6
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 7 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 7}
    >
      7
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 8 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 8}
    >
      8
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 9 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 9}
    >
      9
    </button>
    <button
      type="button"
      class={`w-full text-center dark:text-white rounded-full py-2 ${value === 10 ? 'rounded-full bg-neutral-100 dark:bg-slate-600' : ''}`}
      on:click={() => value = 10}
    >
    10</button>
  </div>
</div>