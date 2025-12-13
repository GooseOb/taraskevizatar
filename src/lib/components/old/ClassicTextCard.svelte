<script lang="ts">
	import CopyIcon from '$lib/icons/CopyIcon.svelte';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
	import TextCard from './TextCard.svelte';
	import { isArabic } from '$lib/alphabets';
	import { syncScroll } from '$lib/sync-scroll.svelte';
	import { parentUse } from '$lib/parent-use';
	import { initInteractiveTags } from '$lib/interactive-tags';
	import { outputText } from '$lib/store/text';
	import { setSnackbar } from '$lib/store/snackbar.old.svelte';
	import { taraskConfig } from '$lib/store/config';

	let {
		areSettingsOpen = $bindable(),
	}: {
		areSettingsOpen: boolean;
	} = $props();

	let contenteditable = $state(false);
	let element: HTMLElement = $state()!;

	const onCopy = async () => {
		await navigator.clipboard.writeText($outputText);
		setSnackbar('Скапіявана');
	};

	const onEdit = () => {
		contenteditable = !contenteditable;
		if (contenteditable) {
			setSnackbar('Рэдагаваньне уключана');
			setTimeout(() => {
				element.focus();
			});
		} else {
			setSnackbar('Рэдагаваньне выключана');
		}
	};

	let counterValue = $state(0);
	$effect(() =>
		outputText.subscribe(() => {
			queueMicrotask(() => {
				counterValue = element?.innerText.length ?? 0;
			});
		})
	);
</script>

<TextCard title="Клясычны" {counterValue}>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<output
		bind:this={element}
		class="textfield"
		style:font-family={isArabic($taraskConfig.abc) ? 'NotoSansArabic' : 'inherit'}
		use:initInteractiveTags
		use:parentUse(syncScroll)
		{contenteditable}>{@html $outputText}</output
	>
	{#snippet iconButtons()}
		<button onclick={onCopy} title="Капіяваць">
			<CopyIcon />
		</button>
		<label title={areSettingsOpen ? 'Закрыць налады' : 'Адкрыць налады'}>
			<input type="checkbox" bind:checked={areSettingsOpen} title="Налады" />
			<SettingsIcon />
		</label>
		<button onclick={onEdit} title={contenteditable ? 'Спыніць рэдагаваньне' : 'Рэдагаваць'}>
			<EditIcon />
		</button>
	{/snippet}
</TextCard>

<style>
	input {
		appearance: none;
	}
	[contenteditable] {
		outline: none;
	}

	:global {
		tarF {
			color: #090;
		}

		tarL,
		tarH {
			cursor: pointer;
			color: #95f;
		}
	}
</style>
