<script lang="ts">
	import { getOutputPlaceholder } from '$lib/alphabets';
	import StatusLine from '$lib/components/StatusLine.svelte';
	import TextCard from '$lib/components/TextCard.svelte';
	import { taraskConfig, taraskText } from '$lib/state.svelte';
	import { createInteractiveTags, pipelines } from 'taraskevizer';

	const outputValue = $derived(
		pipelines.tarask($taraskText, $taraskConfig) || getOutputPlaceholder($taraskConfig.abc)
	);

	const interactiveTags = createInteractiveTags();
	const initInteractiveTags = (node: Element) => {
		$effect(() => {
			if (outputValue) interactiveTags.update(node);
		});
	};
	const onOutputClick = (e: Event) => {
		interactiveTags.tryAlternate(e.target as Element);
	};
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
			onclick={onOutputClick}>{@html outputValue}</output
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
