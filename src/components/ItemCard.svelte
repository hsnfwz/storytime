<script lang="ts">
  //svelte
  import { onMount } from 'svelte';

  // interfaces
  import type I_Book from '$interfaces/I_Book';

  // api
  import { getPublicUrl } from '$api/storage';

  // helpers
  import { formatFileName } from '$helpers/helpers';

  // props
  export let item: I_Book;

  onMount(() => {
    const imgContainer = document.querySelector('.img-container');

    if (imgContainer) {
      let img = document.createElement('img');
      img.src = getPublicUrl('book-covers', `${formatFileName(item.title, item.id)}/${formatFileName(item.title, item.id, true)}`);
      img.alt = item.title;
      img.width = 300;
      img.classList.add('rounded-lg');

      img.onload = () => {
        imgContainer.appendChild(img);
      }

      img.onerror = () => {
        let div = document.createElement('div');
        div.classList.add('w-[300px]');
        div.classList.add('h-[400px]');
        div.classList.add('bg-slate-700');
        div.classList.add('rounded-lg');
        imgContainer.appendChild(div);
      }
    }
  });
</script>

<div class="img-container"></div>