<script lang="ts">
	import { slide } from 'svelte/transition';

	let {
		title,
		details,
		open: open = $bindable(),
	}: {
		title: () => any;
		details: () => any;
		open?: boolean;
	} = $props();
</script>

<div>
	<label class="title">
		{@render title()}
		<input class="checkbox" type="checkbox" bind:checked={open} />
	</label>
	{#if open}
		<div transition:slide>
			{@render details()}
		</div>
	{/if}
</div>

<style>
	.title {
		cursor: pointer;
		padding: 0.5em 1em;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
	}
	.checkbox {
		appearance: none;
		position: relative;
		width: 12px;
		margin: 0 8px;
	}

	.checkbox::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid var(--fg);
		transition: transform 0.2s ease;
	}

	.checkbox:checked::after {
		transform: translate(-50%, -50%) rotate(180deg); /* Flip to point up */
	}
</style>
