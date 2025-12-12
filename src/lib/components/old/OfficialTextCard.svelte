<script lang="ts">
	import { dynamicHeight } from '$lib/fix-input-height';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import CopyIcon from '$lib/icons/CopyIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';
	import { getNextPrompt } from '$lib/prompts';
	import { setSnackbar } from '$lib/state.old.svelte';
	import { syncScroll } from '$lib/sync-scroll.svelte';
	import TextCard from './TextCard.svelte';

	let {
		value = $bindable(''),
	}: {
		value: string;
	} = $props();

	const onCopy = () => {
		navigator.clipboard.writeText(value);
	};
	const onClear = () => {
		value = '';
	};
	const onInfo = () => {
		setSnackbar(getNextPrompt());
	};
	let element: HTMLTextAreaElement = $state()!;
</script>

<svelte:window
	onkeyup={(e) => {
		if (e.ctrlKey && e.code === 'KeyA') {
			element.focus();
			element.select();
		}
	}}
/>
<TextCard title="Афіцыйны" counterValue={value.length}>
	<!-- svelte-ignore a11y_autofocus -->
	<textarea
		use:dynamicHeight
		use:syncScroll
		bind:this={element}
		class="textfield"
		placeholder="Тэкст"
		style="height: 519px"
		bind:value
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
