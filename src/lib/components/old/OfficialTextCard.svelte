<script lang="ts">
	import { dynamicHeight } from '$lib/fix-input-height';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import CopyIcon from '$lib/icons/CopyIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';
	import { getNextPrompt } from '$lib/prompts';
	import { setSnackbar } from '$lib/store/snackbar.old.svelte';
	import { clearDefaultText, taraskText } from '$lib/store/text';
	import { syncScroll } from '$lib/sync-scroll.svelte';
	import TextCard from './TextCard.svelte';

	let element: HTMLTextAreaElement = $state()!;

	const onCopy = async () => {
		await navigator.clipboard.writeText($taraskText);
		setSnackbar('Скапіявана');
	};

	const onClear = () => {
		$taraskText = '';
	};

	const onInfo = () => {
		setSnackbar(getNextPrompt());
	};
</script>

<svelte:window
	onkeyup={(e) => {
		if (e.ctrlKey && e.code === 'KeyA') {
			element.focus();
			element.select();
		}
	}}
/>
<TextCard title="Афіцыйны" counterValue={$taraskText.length}>
	<!-- svelte-ignore a11y_autofocus -->
	<textarea
		use:dynamicHeight
		use:syncScroll
		use:clearDefaultText
		bind:this={element}
		class="textfield"
		placeholder="Тэкст"
		style:height="519px"
		bind:value={$taraskText}
	></textarea>
	{#snippet iconButtons()}
		<button onclick={onCopy} title="Капіяваць">
			<CopyIcon />
		</button>
		<button onclick={onClear} title="Ачысьціць">
			<CloseIcon />
		</button>
		<button onclick={onInfo} title="Інфармацыя">
			<InfoIcon />
		</button>
	{/snippet}
</TextCard>

<style>
	textarea {
		background: transparent;
		color: inherit;
		border: none;
		font: inherit;
		resize: none;
		outline: none;

		&::selection,
		&::-moz-selection {
			background: var(--1);
		}
	}
</style>
