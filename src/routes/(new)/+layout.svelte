<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BurgerButton from '$lib/components/BurgerButton.svelte';
	import { isMobile } from '$lib/isMobile';
	import StatusLine from '$lib/components/StatusLine.svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';

	const { children } = $props();
	const ANIMATION_DURATION = 500;
	$inspect(page.url.pathname);

	$effect(() => {
		document.documentElement.style.height = '100%';
		document.body.style.height = '100%';
		return () => {
			document.documentElement.style.height = '';
			document.body.style.height = '';
		};
	});

	let isSidebarOpen = $state(!isMobile());
</script>

<div class="app">
	<Header>
		<BurgerButton bind:open={isSidebarOpen} />
	</Header>
	<div class="workspace">
		<Sidebar bind:open={isSidebarOpen} />
		<div class="main-area">
			<div class="main">
				{#key page.url.pathname}
					{@const navigationDirection = page.url.pathname === '/files' ? 'forward' : 'backward'}
					<main
						in:fly={{
							opacity: 1,
							x: navigationDirection === 'forward' ? '100%' : '-100%',
							duration: ANIMATION_DURATION,
						}}
						out:fly={{
							opacity: 1,
							x: navigationDirection === 'forward' ? '-100%' : '100%',
							duration: ANIMATION_DURATION,
						}}
					>
						{@render children()}
					</main>
				{/key}
			</div>

			<StatusLine />
		</div>
	</div>
</div>

<style>
	.app {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.workspace {
		display: flex;
		height: 100%;
		overflow: hidden;
	}

	.main-area {
		display: flex;
		flex-direction: column;
		width: 80%;
		min-height: 0;
		overflow: hidden;
		background-color: var(--primary);
		@media (max-width: 768px) {
			width: 100%;
		}
	}

	.main {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;

		border-radius: 1rem 1rem 0 0;
		@media (min-width: 769px) {
			border-radius: 1rem 0 0 0;
		}
	}

	main {
		width: 100%;
		height: 100%;
		position: absolute;

		overflow: auto;
	}
</style>
