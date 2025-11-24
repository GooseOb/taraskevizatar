<script lang="ts">
	const {
		children
	}: {
		children?: () => any;
	} = $props();
</script>

<header>
	{@render children?.()}
	<span>Тарашкевізатар</span>
</header>

<style>
	header {
		background-color: var(--primary);
		height: 3rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 1rem;
		font-size: 1.6rem;
		font-weight: bold;
	}
</style>
