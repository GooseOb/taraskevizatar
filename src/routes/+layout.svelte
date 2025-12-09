<script lang="ts">
	import './global.scss';
	import PageTransition from '$lib/components/PageTransition.svelte';

	const {
		children,
	}: {
		children: () => any;
	} = $props();
</script>

<PageTransition axis="y" duration={400} routes={['/(new)', '/old']}>
	{@render children()}
</PageTransition>
