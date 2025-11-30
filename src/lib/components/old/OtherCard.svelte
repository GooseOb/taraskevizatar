<script lang="ts">
	import { setSnackbar } from '$lib/state.old.svelte';
	import SettingsCard from './SettingsCard.svelte';

	const onDeleteAllData = async () => {
		localStorage.clear();
		const cacheNames = await caches.keys();

		if (cacheNames.length) {
			await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
			setSnackbar('Кэш, тэкст і налады выдалены');
		} else {
			setSnackbar('Кэш ужо пусты', 2500);
		}
	};
</script>

<SettingsCard title="Іншае">
	<button onclick={onDeleteAllData}>выдаліць усе зьвесткі</button>
</SettingsCard>
