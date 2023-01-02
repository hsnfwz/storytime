<script lang="ts">
  // svelte
  import { afterUpdate } from 'svelte';

  // storage
  import { getPublicUrl } from '$api/storage';

  // helpers
  import { formatFileName } from '$helpers/helpers';

  // props
  export let items: any;

  afterUpdate(() => {
    if (items.length !== 0) {
      const container = document.querySelector('.masonry-grid-container');

      const generateMasonryGrid = (columns: any, items: any) => {
        container.innerHTML = '';

        let columnWrappers = {};

        for (let i = 0; i < columns; i++) {
          columnWrappers[`column${i}`] = [];
        }

        for (let i = 0; i < items.length; i++) {
          const column = i % columns;
          columnWrappers[`column${column}`].push(items[i]);
        }

        for (let i = 0; i < columns; i++) {
          let columnItems = columnWrappers[`column${i}`];

          let div = document.createElement('div');
          div.classList.add('masonry-grid-column');

          columnItems.forEach(item => {
            let itemDiv = document.createElement('div');
            itemDiv.classList.add('masonry-grid-item-container');

            let img = document.createElement('img');
            img.classList.add('masonry-grid-item-image');
            img.src = getPublicUrl(`book-covers/${formatFileName(item.title, item.id)}`);
            img.alt = item.title;

            const link = document.createElement('a');
            link.href = `/books/${item.id}`;
            link.append(img);
            itemDiv.append(link);
            div.appendChild(itemDiv);
          });

          container.appendChild(div);
        }
      }

      let previousScreenSize = window.innerWidth;

      window.addEventListener('resize', () => {
        if (window.innerWidth < 600 && previousScreenSize >= 600) {
          generateMasonryGrid(1, items);
        } else if (window.innerWidth >= 600 && window.innerWidth < 1000 && (previousScreenSize < 600 || previousScreenSize >= 1000)) {
          generateMasonryGrid(2, items);
        } else if (window.innerWidth >= 1000 && previousScreenSize < 1000) {
          generateMasonryGrid(8, items);
        }

        previousScreenSize = window.innerWidth;
      })

      if (previousScreenSize < 600) {
        generateMasonryGrid(1, items);
      } else if (previousScreenSize >= 600 && previousScreenSize < 1000) {
        generateMasonryGrid(2, items);
      } else {
        generateMasonryGrid(8, items);
      }
    }
  });
</script>

{#if items.length === 0}
  <p class="text-center">Empty</p>
{:else}
  <div class="masonry-grid-container"></div>
{/if}