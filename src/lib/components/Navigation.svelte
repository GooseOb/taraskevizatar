<script>
	import { page } from '$app/state';
	import AnimationElement from './AnimationElement.svelte';
</script>

<nav>
	<a href="/">Тэкст</a>
	<a href="/files">Файлы</a>
	<AnimationElement findActive={(el) => el.querySelector(`a[href="${page.url.pathname}"]`)} />
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
