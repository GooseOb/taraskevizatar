<script lang="ts">
	import { isArabic } from '$lib/alphabets';
	import TextCard from '$lib/components/TextCard.svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import CopyIcon from '$lib/icons/CopyIcon.svelte';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import { initInteractiveTags } from '$lib/actions/interactiveTags';
	import { clearDefaultText, outputText, taraskText } from '$lib/store/text';
	import { syncScroll } from '$lib/actions/syncScroll.svelte';
	import { taraskConfig } from '$lib/store/config';
	import { status } from '$lib/store/status';
	import { avoidVirtualKeyboard } from '$lib/actions/avoidVirtualKeyboard.svelte';

	let contenteditable = $state(false);

	let outputElement = $state<HTMLElement>();

	let classicCharCount = $state(0);
	$effect(() =>
		outputText.subscribe(() => {
			queueMicrotask(() => {
				classicCharCount = outputElement?.innerText.length ?? 0;
			});
		})
	);
</script>

<div class="page" use:avoidVirtualKeyboard>
	<TextCard title="Афіцыйны" count={$taraskText.length}>
		<textarea
			class="textfield"
			bind:value={$taraskText}
			placeholder="Тэкст"
			use:syncScroll
			use:clearDefaultText
		></textarea>
		{#snippet buttons()}
			<button
				class="action-button"
				title="Капіяваць"
				onclick={() => {
					navigator.clipboard.writeText($taraskText);
					$status = 'Скапіявана';
				}}
			>
				<CopyIcon />
			</button>
			<button
				class="action-button"
				title="Ачысьціць"
				onclick={() => {
					$taraskText = '';
				}}
			>
				<CloseIcon />
			</button>
		{/snippet}
	</TextCard>
	<TextCard title="Клясычны" count={classicCharCount}>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<output
			class="textfield"
			bind:this={outputElement}
			{contenteditable}
			style:font-family={isArabic($taraskConfig.abc) ? 'NotoSansArabic' : 'inherit'}
			use:initInteractiveTags
			use:syncScroll>{@html $outputText}</output
		>
		{#snippet buttons()}
			<button
				class="action-button"
				title="Капіяваць"
				onclick={() => {
					navigator.clipboard.writeText(outputElement!.innerText);
					$status = 'Скапіявана';
				}}
			>
				<CopyIcon />
			</button>
			<button
				class="action-button"
				title={contenteditable ? 'Спыніць рэдагаваньне' : 'Рэдагаваць'}
				onclick={() => {
					contenteditable = !contenteditable;
					$status = contenteditable ? 'Рэдагаваньне ўключана' : 'Рэдагаваньне выключана';
				}}
			>
				<EditIcon />
			</button>
		{/snippet}
	</TextCard>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;

		:global {
			.card:nth-child(2) {
				background: var(--secondary);
				.title {
					transition: border-radius 0.3s;
					border-radius: var(--is-fullwidth, 1rem) 0 0 0;
				}
			}
		}
	}

	.textfield {
		color: inherit;
	}

	output :global {
		tarF {
			color: #090;
		}
		tarL,
		tarH {
			cursor: pointer;
			color: #95f;
		}
	}

	.action-button {
		cursor: pointer;
		width: 1.5rem;
		height: 1.5rem;
		background-color: var(--tertiary);
		color: var(--fg);
		border: none;
		border-radius: 0.25rem;
		transition: background-color 0.2s ease;

		&:hover,
		&:focus-visible {
			background-color: var(--tertiary-dark);
		}
	}
</style>
