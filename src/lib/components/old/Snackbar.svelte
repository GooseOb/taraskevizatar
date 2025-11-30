<script>
	import { cancelHiding, hideWithTimeout, snackbar } from '$lib/state.old.svelte';
	import { fade } from 'svelte/transition';
</script>

{#if snackbar.visible}
	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<div
		role="status"
		transition:fade
		id="snackbar"
		onmouseover={cancelHiding}
		onmouseleave={hideWithTimeout}
	>
		{@html snackbar.value}
	</div>
{/if}

<style>
	div {
		background: var(--4);
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		transition: 0.6s;
		text-align: center;
		z-index: 2;

		@media (max-width: 650px) {
			left: 50%;
			transform: translateX(-50%);
			padding: 0.5rem 10%;
			width: 60vw;
		}

		:global {
			.demo {
				background-color: var(--3);
				padding: 0.2rem;
				border-radius: 0.4rem;
			}
		}
	}
</style>
