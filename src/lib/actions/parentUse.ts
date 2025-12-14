import type { Action } from 'svelte/action';

export const parentUse =
	<TElement>(fn: Action<TElement>): Action<{ parentElement?: TElement | null }> =>
	({ parentElement }) =>
		parentElement ? fn(parentElement) : undefined;
