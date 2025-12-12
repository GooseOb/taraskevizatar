<script lang="ts" generics="TOptionValue, TValue extends TOptionValue">
	import { fade } from 'svelte/transition';
	import Accordion from './Accordion.svelte';
	import AnimationElement from './AnimationElement.svelte';

	let {
		title: titleValue,
		options,
		value = $bindable(),
		open = $bindable(true),
	}: {
		title: string;
		options: readonly {
			label: string;
			value: TOptionValue;
			note?: {
				label: string;
				include?: boolean;
				small?: boolean;
			};
		}[];
		value: TValue;
		open?: boolean;
	} = $props();

	let selectedOptionIndex = $state(options.findIndex((opt) => opt.value === value)!);
	let selectedOption = $derived(options[selectedOptionIndex]);

	const optionElements: HTMLElement[] = $state([]);
</script>

<div class="picker">
	<Accordion bind:open>
		{#snippet title()}
			<div class="title">
				{titleValue}
				{#if !open && value !== undefined}
					<div class="badge" transition:fade={{ duration: 200 }}>
						{selectedOption.label}
						{#if selectedOption.note?.include}
							{selectedOption.note.label}
						{/if}
					</div>
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
							onchange={() => {
								selectedOption = option;
								value = option.value as TValue;
								selectedOptionIndex = i;
							}}
						/>
						{option.label}
						{#if option.note}
							{@const { small, label } = option.note}
							<span class="note" class:small>
								{label}
							</span>
						{/if}
					</label>
				</li>
			{/each}
			<AnimationElement
				elements={optionElements}
				activeIndex={selectedOptionIndex}
				color="var(--tertiary)"
			/>
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
			&:after {
				content: '<';
				margin-left: 0.5em;
			}
		}
	}
	.note {
		margin-left: 0.25em;
	}
	.small {
		font-size: 0.75em;
	}
	.title {
		display: flex;
		width: 100%;
		cursor: auto;
	}
	.badge {
		background-color: var(--tertiary-light);
		border-radius: 12px;
		font-size: 0.8em;
		padding: 2px 8px;
		margin-left: auto;
	}
	ul {
		position: relative;
		user-select: none;
	}
	.picker {
		background-color: var(--tertiary-light);
		border-radius: 1rem;
		overflow: hidden;
		:global(.accordion-title) {
			background-color: var(--tertiary-dark);
			border-radius: 1rem;
			transition: 0.2s ease;
			:global {
				::selection,
				::-moz-selection {
					background: var(--secondary) !important;
				}
			}

			&.open {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			&:hover,
			&:focus-visible {
				background-color: var(--tertiary-dark-hover);
			}
		}
	}
	.option:hover {
		background-color: var(--tertiary);
	}
</style>
