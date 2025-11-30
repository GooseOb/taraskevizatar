<script lang="ts">
	import SettingsCard from './SettingsCard.svelte';

	const links = [
		{
			label: 'telegram',
			value: 'https://t.me/GooseOb',
		},
		{
			label: 'github',
			value: 'https://github.com/GooseOb/taraskevizatar/issues',
		},
	];
</script>

<SettingsCard title="Для памылак і прапановаў">
	{#each links as { value, label }}
		<a href={value} target="_blank" rel="noopener noreferrer">
			<button tabindex="-1">{label}</button>
		</a>
	{/each}
</SettingsCard>
