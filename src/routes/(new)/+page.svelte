<script lang="ts">
	import { isArabic } from '$lib/alphabets';
	import TextCard from '$lib/components/TextCard.svelte';
	import { outputText, taraskConfig, taraskText } from '$lib/state.svelte';
	import { syncScroll } from '$lib/sync-scroll.svelte';
	import { createInteractiveTags } from 'taraskevizer';

	const interactiveTags = createInteractiveTags();
	const initInteractiveTags = (node: Element) => {
		outputText.subscribe(() => {
			interactiveTags.update(node);
		});
	};
	const onOutputClick = (e: Event) => {
		interactiveTags.tryAlternate(e.target as Element);
	};
</script>

<div>
	<TextCard title="Клясычны">
		<textarea class="textfield" bind:value={$taraskText} placeholder="Тэкст" use:syncScroll
		></textarea>
	</TextCard>
	<TextCard title="Афіцыйны">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<output
			class="textfield"
			contenteditable={false}
			style="font-family: {isArabic($taraskConfig.abc) ? 'NotoSansArabic' : 'inherit'};"
			use:initInteractiveTags
			use:syncScroll
			onclick={onOutputClick}>{@html $outputText}</output
		>
	</TextCard>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.textfield {
		color: inherit;
	}

	output :global {
		tarF {
			color: #090;
		}
		tarL,
		tarH {
			cursor: pointer;
			color: #95f;
		}
	}
</style>
