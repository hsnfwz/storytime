<script lang="ts">
  // components
  import Modal from 'src/components/Modal.svelte';
  import Button from 'src/components/Button.svelte';

  // state
  let showModal: boolean = false;
</script>


<div class="flex flex-col gap-4 items-center">
  <h1 class="dark:text-white text-center st-font-bold text-xl">Home</h1>

  <Button label="Show Modal" handleClick={() => showModal = true} />

  <Modal
    label="Test Modal"
    handleSubmit={() => showModal = false}
    handleCancel={() => showModal = false}
    {showModal}
  >
    <h1 class="w-full">Hello</h1>
  </Modal>
</div>