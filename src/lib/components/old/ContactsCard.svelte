<script lang="ts">
	import { contactLinks } from '$lib/contacts';
	import SettingsCard from './SettingsCard.svelte';
</script>

<SettingsCard title="Для памылак і прапановаў">
	{#each contactLinks as { value, label }}
		<a href={value} target="_blank" rel="noopener noreferrer">
			<button tabindex="-1">{label}</button>
		</a>
	{/each}
</SettingsCard>
