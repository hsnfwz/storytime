import { writable } from 'svelte/store';

// interfaces
import type I_Profile from '$interfaces/I_Profile';

export const profile = writable<I_Profile | undefined>();