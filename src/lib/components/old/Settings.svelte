<script lang="ts">
	import { dicts } from 'taraskevizer';
	import type { ComponentProps } from 'svelte';
	import Selector from '$lib/components/old/Selector.svelte';
	import SettingsCard from '$lib/components/old/SettingsCard.svelte';
	import FileConversionCard from '$lib/components/old/FileConversionCard.svelte';
	import ContactsCard from './ContactsCard.svelte';
	import OtherCard from './OtherCard.svelte';
	import { taraskConfig } from '$lib/store/config';
	import { previousPathname } from '$lib/store/pathname';

	let { open }: { open: boolean } = $props();

	type Options = ComponentProps<typeof Selector>['options'];

	const alphabets = [
		{ label: 'кірылічны', value: dicts.alphabets.cyrillic },
		{ label: 'лацінскі', value: dicts.alphabets.latin },
		{
			label: 'арабскі',
			value: dicts.alphabets.arabic,
			note: '(не стандартызаваны)',
		},
		{
			label: 'лацінскі',
			value: dicts.alphabets.latinJi,
			note: '(зь ji)',
		},
	] satisfies Options;
	const iToJ = [
		{ label: 'ніколі', value: 'never' },
		{ label: 'выпадкова', value: 'random' },
		{ label: 'заўсёды', value: 'always' },
	] satisfies Options;
	const hToG = [
		{ label: 'не', value: false },
		{ label: 'так', value: true },
	] satisfies Options;
	const ignoreCaps = [
		{ label: 'не', value: false },
		{ label: 'так', value: true },
	] satisfies Options;
</script>

<ul class:open>
	<Selector title="Альфабэт" options={alphabets} bind:value={$taraskConfig.abc} />
	<Selector title="і > й пасьля галосных" options={iToJ} bind:value={$taraskConfig.j} />
	<Selector title="Адразу г > ґ" options={hToG} bind:value={$taraskConfig.g} />
	<Selector
		title="Ігнараваць caps"
		options={ignoreCaps}
		bind:value={$taraskConfig.doEscapeCapitalized}
	/>
	<FileConversionCard />
	<ContactsCard />
	<OtherCard />
	<SettingsCard title="Перайсьці да новай вэрсіі">
		<a href={$previousPathname}>
			<button tabindex="-1">тык</button>
		</a>
	</SettingsCard>
</ul>

<style>
	ul {
		overflow: hidden;
		transition: max-height 0.3s ease;
		display: flex;
		max-height: 0;
		flex-wrap: wrap;

		@media (max-width: 360px) {
			font-size: 0.9em;
		}

		&.open {
			max-height: 50rem;
		}
	}
</style>
