<script lang="ts">
	import AccordionPicker from './AccordionPicker.svelte';
	import type { ComponentProps } from 'svelte';
	import { taraskConfig } from '$lib/state.svelte';
	import { dicts } from 'taraskevizer';
	import Footer from './Footer.svelte';
	import Navigation from './Navigation.svelte';
	import { isMobile } from '$lib/isMobile';
	import ContactsCard from './ContactsCard.svelte';

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
			note: { label: '(не стандартызаваны)', small: true },
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
	onclick={isMobile()
		? (e) => {
				if ((e.target as HTMLElement).closest('a')) {
					open = false;
				}
			}
		: undefined}
>
	<Navigation />
	<div class="pickers">
		<AccordionPicker title="Альфабэт" options={alphabets} bind:value={$taraskConfig.abc}
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
	</div>
	<ContactsCard />
	<a href="/old"> Перайсьці да старой вэрсіі </a>
	<Footer />
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

	.pickers {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 0.5rem;
	}

	a {
		margin: 0.75rem auto;
	}
</style>
