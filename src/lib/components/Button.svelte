<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		icon: iconr,
		children,
		...props
	}: HTMLButtonAttributes & {
		icon?: boolean | string;
	} = $props();

	const icon = $derived(iconr === true ? '2rem' : iconr);
</script>

<button style={icon ? `width:${icon};height:${icon}` : null} {...props}>
	{@render children?.()}
</button>

<style>
	button {
		box-sizing: border-box;
		display: inline-flex;
		padding: 0.25rem;
		cursor: pointer;
		color: var(--fg);
		background-color: var(--primary);
		transition: background-color 0.2s ease;
		border-radius: 0.5rem;
		border: none;
		justify-content: center;

		&:hover,
		&:focus-visible {
			background-color: var(--primary-dark);
		}
	}

	.icon {
		width: 2rem;
		height: 2rem;
	}
</style>
