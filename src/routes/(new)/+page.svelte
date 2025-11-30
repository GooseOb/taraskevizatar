<script lang="ts">
	import StatusLine from '$lib/components/StatusLine.svelte';
	import TextCard from '$lib/components/TextCard.svelte';
	import { outputText, taraskText } from '$lib/state.svelte';
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
	$inspect($taraskText, 'taraskText');
	$inspect($outputText, 'outputText');
</script>

<div>
	<TextCard title="Клясычны">
		<textarea bind:value={$taraskText} placeholder="Тэкст" class="textfield"></textarea>
	</TextCard>
	<TextCard title="Афіцыйны">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<output
			class="textfield"
			contenteditable={false}
			use:initInteractiveTags
			onclick={onOutputClick}>{@html $outputText}</output
		>
	</TextCard>
	<StatusLine />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		height: 100%;
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
