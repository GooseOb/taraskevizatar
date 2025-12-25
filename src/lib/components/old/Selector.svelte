<script lang="ts" generics="T">
	import AnimationElement from '../AnimationElement.svelte';
	import SettingsCard from './SettingsCard.svelte';

	let {
		title,
		options,
		value = $bindable(),
	}: {
		title: string;
		options: { label: string; value: T; note?: string }[];
		value?: T;
	} = $props();

	let optionElements: HTMLElement[] = $state([]);
</script>

<SettingsCard {title}>
	{#each options as option, i}
		<button
			bind:this={optionElements[i]}
			onclick={() => {
				value = option.value;
			}}
			>{option.label}
			{#if option.note}
				<div class="small">{option.note}</div>
			{/if}
		</button>
	{/each}
	<AnimationElement
		elements={optionElements}
		activeIndex={options.findIndex((opt) => opt.value === value)}
		color="var(--secondary-dark)"
	/>
</SettingsCard>

<style>
	.small {
		pointer-events: none;
		font-size: 0.8rem;
		white-space: nowrap;
	}
</style>
