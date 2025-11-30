<script lang="ts">
	import SettingsCard from './SettingsCard.svelte';
	import { pipelines } from 'taraskevizer';
	import { taraskPlainTextConfig } from '$lib/state.svelte';
	import { setSnackbar } from '$lib/state.old.svelte';
	import { getCreateUniqueTextFileURL, readFileAsText } from '$lib/fileUtils';
	import { delay } from '$lib/delay';

	const createTextFileURL = getCreateUniqueTextFileURL();

	let file: File | null = $state(null);

	let href = $derived(
		file
			? readFileAsText(file).then((text) => {
					setSnackbar('Апрацоўка файлу...', 5000);
					return delay(1).then(() =>
						createTextFileURL(
							pipelines.tarask(text, $taraskPlainTextConfig).replace(/\s([\n\t])\s/g, '$1')
						)
					);
				})
			: Promise.resolve('#')
	);

	$effect(() => {
		href.then((val) => {
			if (val !== '#') {
				setSnackbar('Файл гатовы да спампоўкі', 5000);
			}
		});
	});
</script>

<SettingsCard title="Канвэртацыя файлу">
	<button class="upload" tabindex="-1">
		<label title="Файл ня выбраны" data-title="Файл выбраны">
			<input
				type="file"
				tabindex="0"
				onchange={({ currentTarget }) => {
					file = currentTarget.files![0];
					currentTarget.value = '';
				}}
			/>
			запампаваць
		</label>
	</button>
	{#await href then href}
		{#if href !== '#'}
			<button tabindex="-1">
				<a class="download" {href} download="tarask-{file?.name}"> спампаваць </a>
			</button>
		{/if}
	{/await}
</SettingsCard>

<style>
	input {
		position: absolute;
		visibility: hidden;
	}

	.upload.upload {
		padding: 0;
	}

	label {
		display: block;
		cursor: pointer;
		padding: 0.5em 1em;
	}

	.download {
		font: inherit;
		color: inherit;
	}
</style>
