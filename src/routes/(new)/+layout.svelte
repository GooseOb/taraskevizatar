<script lang="ts">
	import './global.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BurgerButton from '$lib/components/BurgerButton.svelte';
	import { isMobile } from '$lib/isMobile';

	const { children } = $props();

	let isSidebarOpen = $state(!isMobile());
</script>

<div class="app">
	<Header>
		<BurgerButton bind:isOpen={isSidebarOpen} />
	</Header>
	<div class="workspace">
		{#if isSidebarOpen}
			<Sidebar />
		{/if}
		<main>
			{@render children()}
		</main>
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
	}
	main {
		width: 100%;
		min-height: 0;
		overflow: hidden;
	}
</style>
