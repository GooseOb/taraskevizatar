<script lang="ts">
	import { page } from '$app/state';
	import AnimationElement from './AnimationElement.svelte';
	import { resolve } from '$app/paths';
	import { preserveFocusAfterClick } from '$lib/actions/preserveFocus';

	const elements: HTMLAnchorElement[] = $state([]);
	const links = [
		{ href: resolve('/'), label: 'Тэкст' },
		{ href: resolve('/files'), label: 'Файлы' },
	];
</script>

<div class="wrapper">
	<nav>
		{#each links as { href, label }, index}
			<a {href} bind:this={elements[index]} use:preserveFocusAfterClick>{label}</a>
		{/each}
		<AnimationElement
			color="var(--secondary-dark)"
			{elements}
			activeIndex={links.findIndex(({ href }) => href === page.url.pathname)}
		/>
	</nav>
</div>

<style>
	.wrapper {
		padding: 0.5rem;
		background-color: var(--primary);
	}
	nav {
		display: flex;
		position: relative;
		background-color: var(--secondary);
		border-radius: 1rem;
		overflow: hidden;
		margin: 0.25rem;
	}
	a {
		flex: 1;
		text-align: center;
		padding: 0.5rem;
		z-index: 1;
		color: var(--fg);
		user-select: none;
		position: relative;
		outline: none;
		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: var(--primary-dark);
			transition: opacity 0.2s;
			opacity: 0;
		}
		&:focus-visible::after,
		&:hover::after {
			opacity: 0.1;
		}
	}
</style>
