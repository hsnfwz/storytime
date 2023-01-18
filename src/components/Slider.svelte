<script lang="ts">
  // props
  export let value: number;
</script>

<div class="flex flex-col gap-2 w-full">
  <input
    class="slider-light dark:slider-dark"
    type="range"
    min="0"
    max="10"
    value={value}
    on:input={(e) => value = +e.target.value}
  />
  <div class="flex justify-center">
    <p class="w-full text-center">0</p>
    <p class="w-full text-center">1</p>
    <p class="w-full text-center">2</p>
    <p class="w-full text-center">3</p>
    <p class="w-full text-center">4</p>
    <p class="w-full text-center">5</p>
    <p class="w-full text-center">6</p>
    <p class="w-full text-center">7</p>
    <p class="w-full text-center">8</p>
    <p class="w-full text-center">9</p>
    <p class="w-full text-center">10</p>
  </div>
</div>