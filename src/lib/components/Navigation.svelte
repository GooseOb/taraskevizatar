<script lang="ts">
	import { page } from '$app/state';
	import AnimationElement from './AnimationElement.svelte';

	const elements: HTMLAnchorElement[] = $state([]);
	const links = [
		{ href: '/', label: 'Тэкст' },
		{ href: '/files', label: 'Файлы' },
	];
</script>

<nav>
	{#each links as { href, label }, index}
		<a {href} bind:this={elements[index]}>{label}</a>
	{/each}
	<AnimationElement
		{elements}
		activeIndex={links.findIndex(({ href }) => href === page.url.pathname)}
	/>
</nav>

<style>
	nav {
		display: flex;
		position: relative;
		width: 100%;
	}
	a {
		flex: 1;
		text-align: center;
		padding: 0.5rem;
		z-index: 1;
	}
</style>
