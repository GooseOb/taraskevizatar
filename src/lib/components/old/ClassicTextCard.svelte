<script lang="ts">
	import CopyIcon from '$lib/icons/CopyIcon.svelte';
	import EditIcon from '$lib/icons/EditIcon.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
	import TextCard from './TextCard.svelte';
	import { syncScroll } from '$lib/actions/syncScroll.svelte';
	import { parentUse } from '$lib/actions/parentUse';
	import { outputTextLength } from '$lib/store/text';
	import { setSnackbar } from '$lib/store/snackbar.old.svelte';
	import { output } from '$lib/actions/output.svelte';

	let {
		areSettingsOpen = $bindable(),
	}: {
		areSettingsOpen: boolean;
	} = $props();

	let contenteditable = $state(false);
	let element: HTMLElement = $state()!;

	const onCopy = async () => {
		await navigator.clipboard.writeText(element.innerText);
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
</script>

<TextCard title="Клясычны" counterValue={$outputTextLength}>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<output
		bind:this={element}
		class="textfield"
		use:output
		use:parentUse(syncScroll)
		{contenteditable}
	></output>
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
