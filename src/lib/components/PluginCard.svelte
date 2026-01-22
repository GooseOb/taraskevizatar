<script lang="ts">
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import type { PluginValue } from '$lib/plugins';
	import Button from './Button.svelte';
	import { pluginData } from '$lib/store/plugins';

	const {
		url: urlVal,
		code: codeVal,
		value,
	}: {
		url: string;
		code: string;
		value?: PluginValue | null;
	} = $props();

	let url = $derived(urlVal);
	let code = $derived(codeVal);
</script>

<div class="item">
	<span class="title">
		<span>{value?.name || urlVal}</span>
		<Button
			icon="1.5rem"
			title="Выдаліць"
			onclick={() => {
				pluginData.update((data) => data.filter((p) => p.url !== urlVal || p.code !== codeVal));
				value?.unload?.();
			}}
		>
			<CloseIcon />
		</Button>
	</span>
	<p class="description">{value?.description}</p>
	<p>Спасылка: <input type="text" bind:value={url} /></p>
	<p>Код: <textarea bind:value={code}></textarea></p>
	<Button
		onclick={() => {
			pluginData.update((data) => {
				const plugin = data.find((p) => p.url === urlVal && p.code === codeVal);
				if (plugin) {
					plugin.requested = false;
					plugin.imported = false;
					plugin.url = url;
					plugin.code = code;
				}

				return data;
			});
		}}>Абнавіць</Button
	>
</div>

<style>
	@import '$lib/styles/plugins.css';
</style>
