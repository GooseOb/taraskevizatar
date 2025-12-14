<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BurgerButton from '$lib/components/BurgerButton.svelte';
	import { isMobile } from '$lib/utils/isMobile';
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
		<div class="main-area" style:--is-fullwidth={isSidebarOpen ? undefined : '0'}>
			<PageTransition axis="x" duration={500} routes={['/(new)', '/(new)/files']}>
				{@render children()}
			</PageTransition>

			<StatusLine />
		</div>
	</div>
</div>

<style>
	.app {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		:global(::selection, ::-moz-selection) {
			background: var(--secondary);
		}
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
		transition: border-radius 0.3s;
		border-radius: var(--is-fullwidth, 1rem) 0 0 0;

		@media (max-width: 768px) {
			width: 100%;
			border-radius: 1rem 1rem 0 0;
		}
		:global(.page) {
			transition: border-radius 0.3s;
			border-radius: 0 0 0 var(--is-fullwidth, 1rem);
			flex: 1;
			@media (max-width: 768px) {
				border-radius: 0;
			}
		}
	}
</style>
