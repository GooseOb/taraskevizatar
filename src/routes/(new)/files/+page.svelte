<script lang="ts">
	import { pipelines } from 'taraskevizer';
	import { files, taraskPlainTextConfig, type FileData } from '$lib/state.svelte';
	import FileCard from '$lib/components/FileCard.svelte';
	import { status } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
	import { ofNewFiles } from '$lib/numeral-helpers';

	async function handleFiles(e: Event) {
		const fileList = (e.target as HTMLInputElement).files;
		if (!fileList || fileList.length === 0) return;

		const newEntries: FileData[] = Array.from(fileList, ({ name }) => ({
			name,
			raw: null,
			value: null,
		}));

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
	}
</script>

<div class="page">
	<label class="upload">
		<input type="file" multiple onchange={handleFiles} />
		Запампаваць файлы
	</label>
	{#each $files as { name, value }, i}
		<div in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
			<FileCard
				{name}
				{value}
				onRemove={() => {
					$files.splice(i, 1);
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

	.upload {
		cursor: pointer;
		font-weight: bold;
		padding: 0.5rem 1rem;
		text-align: center;
		border-radius: 1rem;
		background-color: var(--primary);
		transition: background-color 0.2s ease;

		&:hover,
		&:has(input:focus-visible) {
			background-color: var(--primary-dark);
		}
	}
</style>
