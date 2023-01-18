<script lang="ts">
  // props
  export let value: number;
</script>

<input
  class="slider-light dark:slider-dark"
  type="range"
  min="0"
  max="10"
  value={value}
  on:input={(e) => value = +e.target.value}
/>