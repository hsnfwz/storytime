<script lang="ts">
  // props
  export let value: number;

  const increment = () => {
    value = value + 1;

    if (value > 10) value = 10;
  }

  const decrement = () => {
    value = value - 1;

    if (value < 0) value = 0;
  }
</script>

<div class="slider-container">
  <input
    type="range"
    min="0"
    max="10"
    value="5"
    class="slider"
    id="slider"
    on:input={(e) => value = e.target.value}
  />
</div>