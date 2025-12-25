<script lang="ts">
	import ThemePicker from '../ThemePicker.svelte';
</script>

<header>
	<div>
		<h1>Тарашкевізатар</h1>
	</div>
	<ThemePicker />
</header>

<style>
	header {
		height: 4rem;
		display: flex;
		align-items: center;
		padding: 0 1rem;
		background-color: var(--primary);
		font-size: 1rem;
		box-shadow: #0004 0 0 20px;

		@media (max-width: 360px) {
			font-size: 0.85rem;
		}
	}
</style>
