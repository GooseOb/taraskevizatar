<script lang="ts">
	import { page } from '$app/state';
	import AnimationElement from './AnimationElement.svelte';

	const elements: HTMLAnchorElement[] = $state([]);
	const links = [
		{ href: '/', label: 'Тэкст' },
		{ href: '/files', label: 'Файлы' },
	];
</script>

<div class="wrapper">
	<nav>
		{#each links as { href, label }, index}
			<a {href} bind:this={elements[index]}>{label}</a>
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
	}
</style>
