<script lang="ts">
	import { slide } from 'svelte/transition';

	let {
		title,
		children,
		open: openValue = $bindable(),
	}: {
		title: () => any;
		children: () => any;
		open?: boolean;
	} = $props();

	const ANIMATION_DURATION = 400;

	let timeoutId: ReturnType<typeof setTimeout>;
	$effect(() => {
		clearTimeout(timeoutId);
		if (openValue) {
			open = true;
		} else {
			timeoutId = setTimeout(() => {
				open = false;
			}, ANIMATION_DURATION);
		}
		return () => {
			clearTimeout(timeoutId);
		};
	});

	let open = $state(openValue);

	const id = `accordion-${Math.random().toString(36)}`;
</script>

<div class="accordion">
	<label class="accordion-title" for={id} class:open>
		{@render title()}
		<input class="checkbox" type="checkbox" bind:checked={openValue} {id} />
	</label>
	{#if openValue}
		<div transition:slide={{ duration: ANIMATION_DURATION }}>
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

	.accordion:has(.checkbox:focus-visible) .accordion-title {
		border: 2px solid var(--fg);
	}

	.checkbox {
		appearance: none;
		position: relative;
		width: 12px;
		margin: 0 8px;

		&:focus-visible {
			outline: none;
		}

		&::after {
			content: '';
			cursor: pointer;
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
