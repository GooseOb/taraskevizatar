<script lang="ts">
	import CopyIcon from '$lib/icons/CopyIcon.svelte';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
	import { createInteractiveTags } from 'taraskevizer';
	import TextCard from './TextCard.svelte';
	import { setSnackbar } from '$lib/state.old.svelte';
	import { taraskConfig } from '$lib/state.svelte';
	import { isArabic } from '$lib/alphabets';
	import { syncScroll } from '$lib/sync-scroll.svelte';
	import { parentUse } from '$lib/parent-use';

	let {
		value,
		areSettingsOpen = $bindable(),
	}: {
		value: string;
		areSettingsOpen: boolean;
	} = $props();

	let contenteditable = $state(false);
	let element: HTMLElement = $state()!;

	const onCopy = async () => {
		await navigator.clipboard.writeText(value);
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

	const interactiveTags = createInteractiveTags();
	$effect(() => {
		if (value) 0;
		interactiveTags.update(element);
		counterValue = element.textContent.length;
	});
	const onOutputClick = (e: Event) => {
		interactiveTags.tryAlternate(e.target as Element);
	};
</script>

<TextCard title="Клясычны" {counterValue}>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<output
		bind:this={element}
		id="output"
		class="textfield"
		style="font-family: {isArabic($taraskConfig.abc) ? 'NotoSansArabic' : 'inherit'};"
		onclick={onOutputClick}
		use:parentUse(syncScroll)
		{contenteditable}>{@html value}</output
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
