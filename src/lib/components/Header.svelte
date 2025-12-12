<script lang="ts">
	import ThemePicker from './old/ThemePicker.svelte';

	const {
		children,
	}: {
		children?: () => any;
	} = $props();
</script>

<header>
	{@render children?.()}
	<span>Тарашкевізатар</span>
	<ThemePicker />
</header>

<style>
	header {
		background-color: var(--primary);
		height: 3rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.25rem 1rem;
		font-size: 1.6rem;
		font-weight: bold;
	}
</style>
