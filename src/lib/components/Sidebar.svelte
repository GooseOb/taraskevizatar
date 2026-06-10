<script lang="ts">
	import AccordionPicker from './AccordionPicker.svelte';
	import Footer from './Footer.svelte';
	import Navigation from './Navigation.svelte';
	import { isMobile } from '$lib/utils/isMobile';
	import ContactsCard from './ContactsCard.svelte';
	import { resolve } from '$app/paths';
	import { taraskConfig } from '$lib/store/config';
	import { plugins } from '$lib/plugins';
	import PluginsAccordion from './PluginsAccordion.svelte';
	import { currentPipeline, pipelinesList } from '$lib/store/pipelines';
	import type { PickerOption } from '$lib/types';
	import { alphabetOptions } from '$lib/alphabets';
	import SettingsAccordion from './SettingsAccordion.svelte';

	let {
		open = $bindable(),
	}: {
		open: boolean;
	} = $props();

	const iToJ = [
		{ label: 'Ніколі', value: 'never' },
		{ label: 'Выпадкова', value: 'random' },
		{ label: 'Заўсёды', value: 'always' },
	] satisfies PickerOption<string>[];
	const hToG = [
		{ label: 'Не', value: false },
		{ label: 'Так', value: true },
	] satisfies PickerOption<boolean>[];
	const ignoreCaps = [
		{ label: 'Не', value: false },
		{ label: 'Так', value: true },
	] satisfies PickerOption<boolean>[];
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<aside
	class:open
	onclick={isMobile()
		? (e) => {
				if ((e.target as HTMLElement).closest('a')) {
					open = false;
				}
			}
		: undefined}
>
	<Navigation />
	<div class="content">
		<div class="pickers">
			<AccordionPicker title="Пайплайн" options={$pipelinesList} bind:value={$currentPipeline} />
			<AccordionPicker title="Альфабэт" options={alphabetOptions} bind:value={$taraskConfig.abc}
			></AccordionPicker>
			<AccordionPicker title="і > й пасьля галосных" options={iToJ} bind:value={$taraskConfig.j}
			></AccordionPicker>
			<AccordionPicker title="Адразу г > ґ" options={hToG} bind:value={$taraskConfig.g}
			></AccordionPicker>
			<AccordionPicker
				title="Ігнараваць caps"
				options={ignoreCaps}
				bind:value={$taraskConfig.doEscapeCapitalized}
			></AccordionPicker>
			{#each $plugins as plugin (plugin.name)}
				{#each plugin.getUI() as element (element.title)}
					{#if element.type === 'picker'}
						<AccordionPicker
							title={element.title}
							options={element.options}
							bind:value={element.getValue, element.setValue}
						/>
					{:else if element.type === 'textinput'}
						<SettingsAccordion title={element.title}>
							<div style:display="flex">
								<input
									class="plugin-field"
									type="text"
									bind:value={element.getValue, element.setValue}
								/>
							</div>
						</SettingsAccordion>
					{:else if element.type === 'textarea'}
						<SettingsAccordion title={element.title}>
							<div style:display="flex">
								<textarea class="plugin-field" bind:value={element.getValue, element.setValue}
								></textarea>
							</div>
						</SettingsAccordion>
					{/if}
				{/each}
			{/each}
			<PluginsAccordion />
		</div>
		<ContactsCard />
		<a href={resolve('/old')}> Перайсьці да старой вэрсіі </a>
		<Footer />
	</div>
</aside>

<style>
	aside {
		width: 0;
		min-width: 0;
		height: 100%;
		background-color: var(--secondary);
		display: flex;
		flex-direction: column;
		white-space: nowrap;
		transition: 0.3s;
		overflow-x: hidden;
		z-index: 1;
		:global {
			::selection,
			::-moz-selection {
				background: var(--primary) !important;
			}
		}

		&.open {
			min-width: 250px;
			width: 20%;
		}

		@media (max-width: 768px) {
			position: absolute;
			&.open {
				width: 100%;
			}
		}
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		overflow-y: auto;
	}

	.pickers {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 0.5rem;
		:global {
			textarea,
			input {
				font-size: 0.9rem;
				border-radius: 0.5rem;
				border: 2px solid var(--tertiary-dark);
				color: var(--fg);
				background-color: var(--anti-fg);
			}
		}
	}

	a {
		margin: 0.75rem auto;
	}

	.plugin-field.plugin-field {
		width: 100%;
		padding: 0.5rem;
		border-radius: 0 0 1rem 1rem;
		resize: vertical;
	}
</style>
