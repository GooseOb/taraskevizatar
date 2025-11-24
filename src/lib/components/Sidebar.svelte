<script lang="ts">
	import { slide } from 'svelte/transition';
	import AccordionPicker from './AccordionPicker.svelte';
	import type { ComponentProps } from 'svelte';
	import { taraskConfig } from '$lib/state.svelte';
	import { dicts } from 'taraskevizer';
	import Footer from './Footer.svelte';

	type Options = ComponentProps<typeof AccordionPicker>['options'];

	const alphabets = [
		{ label: 'Кірылічны', value: dicts.alphabets.cyrillic },
		{ label: 'Лацінскі', value: dicts.alphabets.latin },
		{
			label: 'Арабскі',
			value: dicts.alphabets.arabic,
			note: { label: '(не стандартызаваны)' }
		},
		{
			label: 'Лацінскі',
			value: dicts.alphabets.latinJi,
			note: { label: '(зь ji)', include: true }
		}
	] satisfies Options;
	const iToJ = [
		{ label: 'Ніколі', value: 'never' },
		{ label: 'Выпадкова', value: 'random' },
		{ label: 'Заўсёды', value: 'always' }
	] satisfies Options;
	const hToG = [
		{ label: 'Не', value: false },
		{ label: 'Так', value: true }
	] satisfies Options;
	const ignoreCaps = [
		{ label: 'Не', value: false },
		{ label: 'Так', value: true }
	] satisfies Options;
</script>

<aside
	in:slide={{
		axis: 'x',
		duration: 300
	}}
	out:slide={{
		axis: 'x',
		duration: 300
	}}
>
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
	<Footer />
</aside>

<style>
	aside {
		width: 20%;
		height: 100%;
		background-color: var(--secondary);

		@media (max-width: 768px) {
			position: absolute;
			width: 100%;
		}
	}
</style>
