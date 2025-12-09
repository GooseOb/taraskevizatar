<script lang="ts">
	import FileCard from '$lib/components/FileCard.svelte';
	import { setStatus } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
	const files: { value: File; isProcessed: boolean }[] = $state([]);

	let processedCount = $derived(
		files.reduce((count, file) => count + (file.isProcessed ? 1 : 0), 0)
	);

	$effect(() => {
		if (files.length === 0) return;
		if (processedCount === files.length) {
			setStatus('Апрацоўка файлаў завершана.');
		} else {
			setStatus('Апрацоўка файлаў... [' + processedCount + '/' + files.length + ']');
		}
	});
</script>

<div class="page">
	<label class="upload">
		<input
			type="file"
			multiple
			onchange={({ currentTarget }) => {
				if (!currentTarget.files) return;
				for (const file of currentTarget.files) {
					files.push({ value: file, isProcessed: false });
				}
				currentTarget.value = '';
			}}
		/>
		Запампаваць файлы
	</label>
	{#each files as file, i (file)}
		<div in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
			<FileCard
				file={file.value}
				afterProcess={() => {
					file.isProcessed = true;
				}}
				onRemove={() => {
					files.splice(i, 1);
				}}
			/>
		</div>
	{/each}
</div>

<style>
	.page {
		height: 100%;
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
