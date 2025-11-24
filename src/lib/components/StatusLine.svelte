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
	}
</style>
