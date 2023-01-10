<script lang="ts">
  // data
  export let data: { item: any };
</script>

<div class="flex flex-col items-center gap-4">
  <h1 class="dark:text-white text-center font-bold text-2xl">Profile {data.item.id}</h1>
  <a
    href={`/profiles/${data.item.id}/books`}
    class="text-blue-500"
  >
    View Books
  </a>
</div>