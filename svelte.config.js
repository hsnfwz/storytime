import { resolve } from 'path';

// svelte
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'src/components': resolve('./src/components'),
			'src/interfaces': resolve('./src/interfaces'),
			'src/stores': resolve('./src/stores'),
			'src/api': resolve('./src/api'),
			'src/helpers': resolve('./src/helpers'),
			'src/enums': resolve('./src/enums'),
    }
	}
};

export default config;