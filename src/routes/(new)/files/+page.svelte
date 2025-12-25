<script lang="ts">
	import { pipelines } from 'taraskevizer';
	import FileCard from '$lib/components/FileCard.svelte';
	import { fade } from 'svelte/transition';
	import { ofNewFiles } from '$lib/plurals';
	import { FileData, type FileDataProcessed, files } from '$lib/store/files';
	import { taraskPlainTextConfig } from '$lib/store/config';
	import { status } from '$lib/store/status';
	import { getOnDownloadMany } from '$lib/onDownload';

	let areAllProcessed = $state(false);

	const handleFiles = async (e: Event) => {
		const fileList = (e.target as HTMLInputElement).files;
		if (!fileList || fileList.length === 0) return;

		areAllProcessed = false;

		const newEntries: FileData[] = Array.from(fileList, ({ name }) => new FileData(name));

		$files.push(...newEntries);

		let processedCount = 0;
		const total = fileList.length;

		status.set(`Апрацоўка файлаў... [0/${total}]`);

		for (let i = 0; i < fileList.length; i++) {
			const file = fileList[i];
			const text = await file.text();
			const processed = pipelines.tarask(text, $taraskPlainTextConfig);

			++processedCount;
			status.set(`Апрацоўка файлаў... [${processedCount}/${total}]`);

			files.update((current) => {
				const index = current.indexOf(newEntries[i]);

				if (index !== -1) {
					current[index].raw = text;
					current[index].value = processed;
				}

				return current;
			});
		}

		status.set(`Апрацавана: ${ofNewFiles(total)}`);

		areAllProcessed = true;
	};

	const downloadAll = $derived(
		areAllProcessed ? getOnDownloadMany($files as FileDataProcessed[]) : undefined
	);
</script>

<div class="page">
	<label class="button">
		<input type="file" multiple onchange={handleFiles} />
		Запампаваць файлы
	</label>
	{#if $files.length > 0}
		<button
			class="button"
			in:fade={{ duration: 400 }}
			out:fade={{ duration: 200 }}
			onclick={downloadAll}
			disabled={!areAllProcessed}
		>
			Спампаваць усе файлы zip архівам
		</button>
	{/if}
	{#each $files as { name, value, id }, i (id)}
		<div in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
			<FileCard
				{name}
				{value}
				onRemove={() => {
					files.update((files) => {
						files.splice(i, 1);
						return files;
					});
				}}
			/>
		</div>
	{/each}
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		overflow-y: auto;
		background-color: var(--primary-light);
	}

	input {
		position: absolute;
		width: 0;
		height: 0;
		outline: none;
	}

	.button {
		cursor: pointer;
		font-weight: bold;
		padding: 0.5rem 1rem;
		text-align: center;
		border-radius: 1rem;
		background-color: var(--primary);
		transition: background-color 0.2s ease;
		border: none;
		font-size: 1rem;
		outline: none;

		&:hover,
		&:focus-visible,
		&:has(input:focus-visible) {
			background-color: var(--primary-dark);
		}
	}
</style>
