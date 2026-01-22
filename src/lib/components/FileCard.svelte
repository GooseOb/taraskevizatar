<script lang="ts">
	import Accordion from './Accordion.svelte';
	import Loader from './Loader.svelte';
	import DownloadIcon from '$lib/icons/DownloadIcon.svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import { getOnDownload } from '$lib/onDownload';
	import Button from './Button.svelte';

	const {
		name,
		value,
		onRemove,
	}: {
		name: string;
		value: string | null;
		onRemove?: () => void;
	} = $props();

	let open = $state(false);
</script>

<div class="wrapper" class:open>
	{#if value === null}
		<Accordion bind:open>
			{#snippet title()}
				<span class="title">
					{name}
				</span>
				<Loader />
			{/snippet}

			<div class="loading-container">
				<Loader />
			</div>
		</Accordion>
	{:else}
		<Accordion bind:open>
			{#snippet title()}
				<span class="title">
					{name}
				</span>
				<div class="actions">
					<Button icon onclick={getOnDownload(name, value)} title="Спампаваць файл">
						<DownloadIcon />
					</Button>
					<Button icon onclick={onRemove} title="Выдаліць">
						<CloseIcon />
					</Button>
				</div>
			{/snippet}

			<pre class="content">{value}</pre>
		</Accordion>
	{/if}
</div>

<style>
	.content {
		white-space: pre-wrap;
		word-break: break-word;
		padding: 0.5em;
		&::selection,
		&::-moz-selection {
			background: var(--primary) !important;
		}
	}

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		padding-right: 0.5rem;
	}

	.title {
		margin-right: auto;
		cursor: auto;
	}

	.wrapper {
		background-color: var(--anti-fg);
		border-radius: 0.5rem;
		:global(.accordion-title) {
			border-radius: 0.5rem;
			border: var(--tertiary) solid 2px;
			background-color: var(--secondary);
			transition: background-color 0.2s ease;

			&:hover,
			&:focus-visible {
				background-color: var(--secondary-dark);
			}

			&:has(:global(.icon):hover),
			&:has(:global(.icon):focus) {
				background-color: var(--secondary);
			}
			::selection,
			::-moz-selection {
				background: var(--primary);
			}
		}
	}
</style>
