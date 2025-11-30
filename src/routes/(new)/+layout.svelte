<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BurgerButton from '$lib/components/BurgerButton.svelte';
	import { isMobile } from '$lib/isMobile';
	import StatusLine from '$lib/components/StatusLine.svelte';

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
			<main>
				{@render children()}
			</main>
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
		@media (max-width: 768px) {
			width: 100%;
		}
	}
	main {
		height: 100%;
		overflow: auto;
	}

	:global {
		html,
		body {
			height: 100%;
		}
	}
</style>
