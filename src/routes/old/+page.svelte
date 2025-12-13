<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Settings from '$lib/components/old/Settings.svelte';
	import Snackbar from '$lib/components/old/Snackbar.svelte';
	import Header from '$lib/components/old/Header.svelte';
	import OfficialTextCard from '$lib/components/old/OfficialTextCard.svelte';
	import ClassicTextCard from '$lib/components/old/ClassicTextCard.svelte';
	import { setSnackbar } from '$lib/state.old.svelte';

	navigator.serviceWorker.ready.then((sw) => {
		sw.addEventListener('updatefound', () => {
			const newSW = sw.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					if (navigator.serviceWorker.controller) {
						setSnackbar('Каб бачыць апошнюю вэрсію, перазагрузіце старонку', 10_000);
						newSW.postMessage({ type: 'SKIP_WAITING' });
					}
				}
			});
		});
	});

	let areSettingsOpen = $state(true);
</script>

<div class="page">
	<Header />

	<main>
		<div class="card">
			<OfficialTextCard />
			<ClassicTextCard bind:areSettingsOpen />
		</div>

		<Settings open={areSettingsOpen} />
	</main>

	<Footer />
</div>
<Snackbar />

<style>
	.page {
		/* TODO: why does it help and what to replace it with */
		display: table;

		:global {
			:focus {
				outline: none;
			}

			::selection,
			::-moz-selection {
				background: var(--2);
			}
		}
	}
	main {
		height: 80%;
		width: 85%;
		margin: 0 auto;

		@media (max-width: 650px) {
			width: 100%;
		}
	}

	.card {
		display: flex;
		margin: 2rem 0;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: #0004 0 0 20px;

		@media (max-width: 650px) {
			flex-direction: column;
		}
	}
</style>
