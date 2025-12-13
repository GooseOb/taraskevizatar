<script lang="ts">
	import { theme } from '$lib/store/theme';
	import LightThemeIcon from '$lib/icons/LightThemeIcon.svelte';
	import DarkThemeIcon from '$lib/icons/DarkThemeIcon.svelte';

	const values = [
		{ label: 'Сьветлая', value: '0', Icon: LightThemeIcon },
		{ label: 'Цёмная', value: '2', Icon: DarkThemeIcon },
	] as const;
</script>

<div class="picker">
	{#each values as { label, value, Icon }}
		{@const checked = $theme === value}
		<label class="item" title={label}>
			<input type="checkbox" {checked} onchange={() => theme.set(checked ? '1' : value)} />
			<div class="icon">
				<Icon />
			</div>
		</label>
	{/each}
</div>

<style>
	.picker {
		font-size: 1rem;
		display: flex;
		background-color: var(--bg);
		margin-left: auto;
		border-radius: 1rem;
		overflow: hidden;
		height: 2rem;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		cursor: pointer;
		transition: background-color 0.2s;
		position: relative;
	}

	input {
		position: absolute;
		opacity: 0;
		inset: 0;
		cursor: pointer;
	}

	.icon {
		color: var(--fg);
		width: 1.4rem;
		height: 1.4rem;
		transition:
			opacity 0.2s,
			transform 0.2s;
		opacity: 0.8;
	}

	.item:hover {
		background-color: #0002;
	}

	.item:hover .icon {
		opacity: 1;
	}

	input:checked + .icon {
		opacity: 1;
		transform: scale(1.05);
	}

	input:checked ~ .icon {
		opacity: 1;
	}

	.item:has(input:checked) {
		background-color: var(--4);
	}
</style>
