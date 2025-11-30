<script lang="ts">
	import { page } from '$app/state';
	import AnimationElement from './AnimationElement.svelte';

	const elements: HTMLAnchorElement[] = $state([]);
</script>

<nav>
	<a href="/" bind:this={elements[0]}>Тэкст</a>
	<a href="/files" bind:this={elements[1]}>Файлы</a>
	<AnimationElement
		{elements}
		activeIndex={elements.findIndex(({ href }) => href === page.url.pathname)}
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
