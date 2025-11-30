<script lang="ts">
	import { slide } from 'svelte/transition';

	let {
		title,
		children,
		open: open = $bindable(),
	}: {
		title: () => any;
		children: () => any;
		open?: boolean;
	} = $props();

	const id = `accordion-${Math.random().toString(36)}`;
</script>

<div>
	<label class="accordion-title" for={id}>
		{@render title()}
		<input class="checkbox" type="checkbox" bind:checked={open} {id} />
	</label>
	{#if open}
		<div transition:slide>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.accordion-title {
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

		&::after {
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

		&:checked::after {
			transform: translate(-50%, -50%) rotate(180deg); /* Flip to point up */
		}
	}
</style>
