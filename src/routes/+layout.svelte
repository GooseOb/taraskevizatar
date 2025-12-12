<script lang="ts">
	import './global.scss';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import { previousPathname } from '$lib/state.svelte.ts';
	import { beforeNavigate } from '$app/navigation';

	beforeNavigate(({ from }) => {
		if (from) $previousPathname = '/taraskevizatar' + from.url.pathname;
	});

	const {
		children,
	}: {
		children: () => any;
	} = $props();
</script>

<PageTransition axis="y" duration={400} routes={['/(new)', '/old']}>
	{@render children()}
</PageTransition>
