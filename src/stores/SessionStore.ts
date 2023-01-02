import { writable } from 'svelte/store';

export const session = writable<{ userId: string } | undefined>();