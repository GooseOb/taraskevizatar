<script lang="ts">
	import AccordionPicker from './AccordionPicker.svelte';
	import type { ComponentProps } from 'svelte';
	import { taraskConfig } from '$lib/state.svelte';
	import { dicts } from 'taraskevizer';
	import Footer from './Footer.svelte';
	import Navigation from './Navigation.svelte';
	import { isMobile } from '$lib/isMobile';

	let {
		open = $bindable(),
	}: {
		open: boolean;
	} = $props();

	type Options = ComponentProps<typeof AccordionPicker>['options'];

	const alphabets = [
		{ label: 'Кірылічны', value: dicts.alphabets.cyrillic },
		{ label: 'Лацінскі', value: dicts.alphabets.latin },
		{
			label: 'Арабскі',
			value: dicts.alphabets.arabic,
			note: { label: '(не стандартызаваны)' },
		},
		{
			label: 'Лацінскі',
			value: dicts.alphabets.latinJi,
			note: { label: '(зь ji)', include: true },
		},
	] satisfies Options;
	const iToJ = [
		{ label: 'Ніколі', value: 'never' },
		{ label: 'Выпадкова', value: 'random' },
		{ label: 'Заўсёды', value: 'always' },
	] satisfies Options;
	const hToG = [
		{ label: 'Не', value: false },
		{ label: 'Так', value: true },
	] satisfies Options;
	const ignoreCaps = [
		{ label: 'Не', value: false },
		{ label: 'Так', value: true },
	] satisfies Options;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<aside
	class:open
	onclick={(e) => {
		if (isMobile() && (e.target as HTMLElement).closest('a')) {
			open = false;
		}
	}}
>
	<Navigation />
	<AccordionPicker
		title="Альфабэт"
		options={alphabets}
		bind:value={$taraskConfig.abc}
		compare={(a, b) => a.lower === b.lower}
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
	<a href="/old"> Перайсьці да старой вэрсіі </a>
	<Footer />
</aside>

<style>
	aside {
		width: 0;
		height: 100%;
		background-color: var(--secondary);
		display: flex;
		flex-direction: column;
		white-space: nowrap;
		transition: width 0.3s;
		overflow-x: hidden;

		&.open {
			width: 20%;
		}

		@media (max-width: 768px) {
			position: absolute;
			&.open {
				width: 100%;
			}
		}
	}

	a {
		margin: 0.75rem auto;
	}
</style>
