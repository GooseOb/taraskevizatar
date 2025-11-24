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
		isOpen = $bindable(true),
		compare = (a, b) => a === b
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
		isOpen?: boolean;
	} &
		// Cannot directly compare reactive `value` to a static `options[number].value`
		(TOptionValue extends object ? Compare : Partial<Compare>) = $props();

	let selectedOption = $state(options.find((opt) => compare(opt.value, value))!);
	let activeElement: HTMLElement | undefined = $state();
	const setInitialActiveElement = (node: HTMLElement, isActive: boolean) => {
		if (isActive) activeElement = node;
	};
</script>

<Accordion bind:isOpen>
	{#snippet title()}
		<div class="title">
			{titleValue}
			{#if !isOpen && value !== undefined}
				<span class="badge" transition:fade={{ duration: 200 }}>
					{selectedOption.label}
					{#if selectedOption.note?.include}
						{selectedOption.note.label}
					{/if}
				</span>
			{/if}
		</div>
	{/snippet}
	{#snippet details()}
		<ul>
			{#each options as option}
				<li>
					<label class="option" use:setInitialActiveElement={compare(option.value, value)}>
						<input
							type="radio"
							name={titleValue}
							class="radio"
							value={option.label + (option.note?.label || '')}
							onchange={(e) => {
								selectedOption = option;
								value = option.value as TValue;
								activeElement = e.currentTarget.parentElement as HTMLElement;
							}}
						/>
						{option.label}
						{option.note?.label}
					</label>
				</li>
			{/each}
			<AnimationElement {activeElement} />
		</ul>
	{/snippet}
</Accordion>

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
	:global(.title) {
		background-color: var(--tertiary);
	}
</style>
