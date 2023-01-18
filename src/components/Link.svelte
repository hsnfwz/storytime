<script lang="ts">
  // props
  export let label: string;
  export let link: string;
</script>

<a
  href={link}
  class="st-font-bold hover:text-sky-500 transition-all decoration-sky-500 underline"
>
  {label}
</a>