<script lang="ts">
	import { fade } from 'svelte/transition';
	import Accordion from './Accordion.svelte';

	let {
		title: titleValue,
		open = $bindable(true),
		children,
		badge,
	}: {
		title: string;
		open?: boolean;
		children: () => any;
		badge?: () => any;
	} = $props();
</script>

<div class="wrapper">
	<Accordion bind:open>
		{#snippet title()}
			<div class="title">
				{titleValue}
				{#if !open && badge}
					<div class="badge" transition:fade={{ duration: 200 }}>
						{@render badge()}
					</div>
				{/if}
			</div>
		{/snippet}
		{@render children()}
	</Accordion>
</div>

<style>
	.title {
		display: flex;
		width: 100%;
	}
	.badge {
		background-color: var(--tertiary-light);
		border-radius: 12px;
		font-size: 0.8em;
		padding: 2px 8px;
		margin-left: auto;
	}
	.wrapper {
		background-color: var(--tertiary-light);
		border-radius: 1rem;
		overflow: hidden;
		:global(.accordion-title) {
			background-color: var(--tertiary-dark);
			border-radius: 1rem;
			transition: 0.2s ease;
			:global {
				::selection,
				::-moz-selection {
					background: var(--secondary) !important;
				}
			}

			&.open {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			&:hover,
			&:focus-visible {
				background-color: var(--tertiary-dark-hover);
			}
		}
	}
</style>
