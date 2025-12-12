<script lang="ts">
	import SettingsCard from './SettingsCard.svelte';
	import { pipelines } from 'taraskevizer';
	import { files, taraskPlainTextConfig } from '$lib/state.svelte';
	import { setSnackbar } from '$lib/state.old.svelte';
	import { delay } from '$lib/delay';
	import { getOnDownload } from '$lib/on-download';

	const onFileChange = ({ currentTarget }: { currentTarget: HTMLInputElement }) => {
		const file = currentTarget.files![0];

		$files[0] = {
			name: file.name,
			raw: null,
			value: null,
		};

		file.text().then((text) => {
			$files[0].raw = text;
			setSnackbar('Апрацоўка файлу...', 5000);
			delay(1).then(() => {
				const result = pipelines
					.tarask($files[0].raw!, $taraskPlainTextConfig)
					.replace(/\s([\n\t])\s/g, '$1');
				$files[0].value = result;
				setSnackbar('Файл гатовы да спампоўкі', 5000);
			});
		});
		currentTarget.value = '';
	};
</script>

<SettingsCard title="Канвэртацыя файлу">
	<button class="upload" tabindex="-1">
		<label title={$files[0] ? 'Файл выбраны' : 'Файл ня выбраны'}>
			<input type="file" tabindex="0" onchange={onFileChange} />
			запампаваць
		</label>
	</button>
	{#if $files[0]?.value}
		{@const { name, value } = $files[0]}
		<button onclick={getOnDownload('tarask-' + name, value!)}> спампаваць </button>
	{/if}
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
</style>
