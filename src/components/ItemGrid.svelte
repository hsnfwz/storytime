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
    const generateMasonryGrid = (columns: any, items: any) => {
      const containerElement: any = document.querySelector('#masonry-grid-container');

      if (containerElement) {
        containerElement.innerHTML = '';

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
          div.id = `column-${i}`;

          columnItems.forEach((item: any, index: any) => {
            let itemDiv = document.createElement('div');
            itemDiv.classList.add('masonry-grid-item-container');

            let img = document.createElement('img');
            img.classList.add('masonry-grid-item-image');
            img.src = getPublicUrl('book-covers', `${formatFileName(item.title, item.id)}/${formatFileName(item.title, item.id, true)}`);
            img.alt = item.title;

            const link = document.createElement('a');
            link.href = `/books/${item.id}`;
            link.append(img);
            itemDiv.append(link);
            div.appendChild(itemDiv);
          });

          containerElement.appendChild(div);
        }
      }
    }

    let previousScreenSize = window.innerWidth;

    window.addEventListener('resize', () => {
      if (window.innerWidth < 640 && previousScreenSize >= 640) {
        generateMasonryGrid(2, items);
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024 && (previousScreenSize < 640 || previousScreenSize >= 1024)) {
        generateMasonryGrid(4, items);
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1536 && (previousScreenSize < 1024 || previousScreenSize >= 1536)) {
        generateMasonryGrid(6, items);
      } else if (window.innerWidth >= 1536 && previousScreenSize < 1536) {
        generateMasonryGrid(8, items);
      }

      previousScreenSize = window.innerWidth;
    });

    if (previousScreenSize < 640) {
      generateMasonryGrid(2, items);
    } else if (previousScreenSize >= 640 && previousScreenSize < 1024) {
      generateMasonryGrid(4, items);
    } else if (previousScreenSize >= 1024 && previousScreenSize < 1536) {
      generateMasonryGrid(6, items);
    } else {
      generateMasonryGrid(8, items);
    }
  });
</script>

{#if items.length === 0}
  <p class="dark:text-white text-center">Empty</p>
{:else}
  <div id="masonry-grid-container"></div>
{/if}