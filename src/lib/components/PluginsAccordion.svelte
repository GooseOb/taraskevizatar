<script lang="ts">
	import { plugins } from '$lib/plugins';
	import SettingsAccordion from './SettingsAccordion.svelte';
</script>

<SettingsAccordion title="Плагіны">
	{#snippet badge()}
		{$plugins.length}
	{/snippet}
	<div class="item">
		<strong>Дадаць плагін</strong>
		<p>Спасылка: <input type="text" /></p>
		<label><input type="checkbox" /> Абнаўляць аўтаматычна </label>
		<p>Код: <textarea></textarea></p>
	</div>
	{#each $plugins as { description, name } (name)}
		<div class="item">
			<strong>{name}</strong>
			<p class="description">{description}</p>
			<p>Спасылка: <input type="text" /></p>
			<label><input type="checkbox" /> Абнаўляць аўтаматычна </label>
			<p>Код: <textarea></textarea></p>
		</div>
	{/each}
</SettingsAccordion>

<style>
	.item {
		padding: 0.5rem;
	}

	.description {
		white-space: pre-wrap;
	}
</style>
