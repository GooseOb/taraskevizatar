<script lang="ts">
	import { plugins } from '$lib/plugins';
	import Button from './Button.svelte';
	import SettingsAccordion from './SettingsAccordion.svelte';
	import { pluginData } from '$lib/store/plugins';
	import PluginCard from './PluginCard.svelte';

	let url = $state('');
	let code = $state('');
	const onSubmit = () => {
		url = url.trim();
		code = code.trim();

		if (url || code) {
			pluginData.update((data) => {
				data.push({ url, code, id: Math.random() });
				return data;
			});
		}
	};
</script>

<SettingsAccordion title="Плагіны">
	{#snippet badge()}
		{$plugins.length}
	{/snippet}
	<div class="item">
		<span class="title">Дадаць плагін</span>
		<p>Спасылка: <input type="text" bind:value={url} /></p>
		<p>Спасылка будзе ўжытая каб абнаўляць код пасьля заходу на старонку</p>
		<p>Код: <textarea bind:value={code}></textarea></p>
		<Button onclick={onSubmit}>Дадаць</Button>
	</div>
	{#each $pluginData as { url, code, value } (url)}
		<PluginCard {url} {code} {value} />
	{/each}
</SettingsAccordion>

<style>
	@import '$lib/styles/plugins.css';
</style>
