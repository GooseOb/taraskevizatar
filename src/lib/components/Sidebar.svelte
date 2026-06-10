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
						<label class="plugin-field">
							<span class="plugin-field-title">{element.title}</span>
							<input
								type="text"
								value={element.getValue()}
								oninput={(e) => element.setValue((e.target as HTMLInputElement).value)}
							/>
						</label>
					{:else if element.type === 'textarea'}
						<label class="plugin-field">
							<span class="plugin-field-title">{element.title}</span>
							<textarea oninput={(e) => element.setValue((e.target as HTMLTextAreaElement).value)}
								>{element.getValue()}</textarea
							>
						</label>
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
	}

	a {
		margin: 0.75rem auto;
	}

	.plugin-field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem;
		background: var(--tertiary-light);
		border-radius: 0.75rem;
	}

	.plugin-field-title {
		font-weight: bold;
		font-size: 0.9em;
	}

	.plugin-field :global(input),
	.plugin-field :global(textarea) {
		border-radius: 0.5rem;
		border: 2px solid var(--tertiary-dark);
		color: var(--fg);
		background-color: var(--anti-fg);
		padding: 0.4em;
		font-family: inherit;
		font-size: inherit;
		resize: vertical;
	}

	.plugin-field :global(textarea) {
		min-height: 3em;
	}
</style>
