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
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 0 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>0</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 1 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>1</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 2 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>2</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 3 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>3</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 4 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>4</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 5 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>5</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 6 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>6</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 7 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>7</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 8 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>8</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 9 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>9</p>
    <p class={`w-full text-center dark:text-white rounded-full py-2 ${value === 10 ? 'rounded-full bg-white dark:bg-neutral-800' : ''}`}>10</p>
  </div>
</div>