<script lang="ts">
	import { isMobile } from '$lib/utils/isMobile';
	import { status } from '$lib/store/status';
	import { fade } from 'svelte/transition';

	let visible = $state(!isMobile());

	if (isMobile()) {
		let timeout: ReturnType<typeof setTimeout>;
		status.subscribe((value) => {
			clearTimeout(timeout);
			if (value) visible = true;
			timeout = setTimeout(() => {
				visible = false;
			}, 3000);
		});
	}
</script>

{#if visible}
	<div transition:fade>{$status}</div>
{/if}

<style>
	div {
		display: flex;
		align-items: center;
		height: 1em;
		width: 100%;
		padding: 0.5em;
		background-color: var(--tertiary);
		transition: border-radius 0.3s;
		border-radius: var(--is-fullwidth, 1rem) 0 0 0;
		z-index: 1;

		@media (max-width: 768px) {
			height: auto;
			position: fixed;
			text-align: center;
			border-radius: 1rem;
			width: max-content;
			bottom: 1rem;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
