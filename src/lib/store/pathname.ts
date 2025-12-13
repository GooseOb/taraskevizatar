import { writable } from 'svelte/store';
import { resolve } from '$app/paths';

export const previousPathname = writable<string>(resolve('/'));
