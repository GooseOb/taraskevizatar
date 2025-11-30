<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Settings from '$lib/components/old/Settings.svelte';
	import Snackbar from '$lib/components/old/Snackbar.svelte';
	import Header from '$lib/components/old/Header.svelte';
	import OfficialTextCard from '$lib/components/old/OfficialTextCard.svelte';
	import ClassicTextCard from '$lib/components/old/ClassicTextCard.svelte';
	import { outputText, taraskText } from '$lib/state.svelte.ts';
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

<Header />

<main>
	<div class="card">
		<OfficialTextCard bind:value={$taraskText} />
		<ClassicTextCard value={$outputText} bind:areSettingsOpen />
	</div>

	<Settings open={areSettingsOpen} />
</main>

<Footer />

<Snackbar />

<style>
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

	:global {
		html {
			color: #000;
			--bg: #ddf;
			--1: #b9f;
			--2: #ff8;
			--3: #fd8;
			--4: #b5f;
			--btn-hover: #00000008;
			--link: #28f;
			--link-hover: #26f;
			--scrollbar-bg: #0002;
			--scrollbar: #0004;
			--scrollbar-hover: #0005;
		}

		html.dark {
			color: #eee;
			--bg: #113;
			--1: #338;
			--2: #222;
			--3: #111;
			--4: #739;
			--btn-hover: #ffffff08;
			--scrollbar-bg: #444;
			--scrollbar: #666;
			--scrollbar-hover: #777;

			.icon-btns > button,
			.checkbox {
				filter: invert(1);
			}
		}

		body {
			background-color: var(--bg);
			/* display: flex; */
			/* flex-direction: column; */
			/* justify-content: center; */
		}

		:focus {
			outline: none;
		}

		::selection,
		::-moz-selection {
			background: var(--2);
		}
	}
</style>
