<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BurgerButton from '$lib/components/BurgerButton.svelte';
	import { isMobile } from '$lib/isMobile';
	import StatusLine from '$lib/components/StatusLine.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';

	const { children } = $props();

	let isSidebarOpen = $state(!isMobile());
</script>

<div class="app">
	<Header>
		<BurgerButton bind:open={isSidebarOpen} />
	</Header>
	<div class="workspace">
		<Sidebar bind:open={isSidebarOpen} />
		<div class="main-area">
			<PageTransition axis="x" duration={500} routes={['/(new)', '/(new)/files']}>
				{@render children()}
			</PageTransition>

			<!-- TODO: fix overlapping -->
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
		background-color: var(--primary);
		display: flex;
		height: 100%;
		overflow: hidden;
	}

	.main-area {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: var(--secondary);
		border-radius: 1rem 0 0 0;

		@media (max-width: 768px) {
			width: 100%;
			border-radius: 1rem 1rem 0 0;
		}
	}
</style>
