<script>
	import { getStatus } from '$lib/state.svelte';
</script>

<div>{getStatus()}</div>

<style>
	div {
		display: flex;
		align-items: center;
		height: 1em;
		width: 100%;
		padding: 0.5em;
		background-color: var(--tertiary);
		border-radius: 1rem 0 0 0;
		z-index: 1;
	}
</style>
