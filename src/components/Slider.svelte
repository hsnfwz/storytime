<script lang="ts">
  // components
  import Button from '$components/Button.svelte';

  // props
  export let value: number;
</script>

<!-- <div class="flex flex-col gap-2 justify-center items-center rounded-full w-full"> -->
  <!-- <input
    class="slider-light dark:slider-dark"
    type="range"
    min="0"
    max="10"
    value={value}
    on:input={(e) => value = +e.target.value}
  /> -->
  <div class="w-full grid grid-cols-11 gap-2">
    <Button
      label="0"
      handleClick={() => value = 0}
      isSelected={value === 0}
    />
    <Button
      label="1"
      handleClick={() => value = 1}
      isSelected={value === 1}
    />
    <Button
      label="2"
      handleClick={() => value = 2}
      isSelected={value === 2}
    />
    <Button
      label="3"
      handleClick={() => value = 3}
      isSelected={value === 3}
    />
    <Button
      label="4"
      handleClick={() => value = 4}
      isSelected={value === 4}
    />
    <Button
      label="5"
      handleClick={() => value = 5}
      isSelected={value === 5}
    />
    <Button
      label="6"
      handleClick={() => value = 6}
      isSelected={value === 6}
    />
    <Button
      label="7"
      handleClick={() => value = 7}
      isSelected={value === 7}
    />
    <Button
      label="8"
      handleClick={() => value = 8}
      isSelected={value === 8}
    />
    <Button
      label="9"
      handleClick={() => value = 9}
      isSelected={value === 9}
    />
    <Button
      label="10"
      handleClick={() => value = 10}
      isSelected={value === 10}
    />
  </div>
<!-- </div> -->