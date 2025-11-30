<script lang="ts" generics="TOptionValue, TValue extends TOptionValue">
	import { fade } from 'svelte/transition';
	import Accordion from './Accordion.svelte';
	import AnimationElement from './AnimationElement.svelte';

	type Compare = {
		compare: (a: TOptionValue, b: TOptionValue) => boolean;
	};

	let {
		title: titleValue,
		options,
		value = $bindable(),
		open = $bindable(true),
		compare = (a, b) => a === b,
	}: {
		title: string;
		options: readonly {
			label: string;
			value: TOptionValue;
			note?: {
				label: string;
				include?: boolean;
			};
		}[];
		value: TValue;
		open?: boolean;
	} &
		// Cannot directly compare reactive `value` to a static `options[number].value`
		(TOptionValue extends object ? Compare : Partial<Compare>) = $props();

	let selectedOption = $state(options.find((opt) => compare(opt.value, value))!);
	let selectedOptionIndex = $state(0);
	const optionElements: HTMLElement[] = $state([]);
</script>

<div class="picker">
	<Accordion bind:open>
		{#snippet title()}
			<div class="title">
				{titleValue}
				{#if !open && value !== undefined}
					<span class="badge" transition:fade={{ duration: 200 }}>
						{selectedOption.label}
						{#if selectedOption.note?.include}
							{selectedOption.note.label}
						{/if}
					</span>
				{/if}
			</div>
		{/snippet}
		<ul>
			{#each options as option, i}
				<li>
					<label class="option" bind:this={optionElements[i]}>
						<input
							type="radio"
							name={titleValue}
							class="radio"
							value={option.label + (option.note?.label || '')}
							onchange={() => {
								selectedOption = option;
								value = option.value as TValue;
								selectedOptionIndex = i;
							}}
						/>
						{option.label}
						{option.note?.label}
					</label>
				</li>
			{/each}
			<AnimationElement elements={optionElements} activeIndex={selectedOptionIndex} />
		</ul>
	</Accordion>
</div>

<style>
	.radio {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		pointer-events: none;
	}
	.option {
		position: relative;
		display: flex;
		align-items: center;
		padding: 8px 16px;
		cursor: pointer;
		transition: background-color 0.2s ease;
		z-index: 10;
		&:has(.radio:focus-visible) {
			outline: 2px solid var(--primary-dark);
		}
	}
	.badge {
		background-color: var(--secondary-dark);
		border-radius: 12px;
		font-size: 0.8em;
		padding: 2px 8px;
	}
	ul {
		position: relative;
	}
	.picker {
		:global(.accordion-title) {
			background-color: var(--tertiary);
		}
	}
</style>
