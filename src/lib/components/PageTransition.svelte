<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import type { RouteId } from '$app/types';
	import { fly } from 'svelte/transition';

	const {
		children,
		axis,
		duration,
		routes,
	}: {
		children: () => any;
		axis: 'x' | 'y';
		routes: RouteId[];
		duration?: number;
	} = $props();

	let key = $state(false);
	let isForward = $state(true);

	beforeNavigate(({ from, to }) => {
		if (!from || !to) return;
		const fromRoute = from.route.id!;
		const toRoute = to.route.id!;

		let fromIndex = routes.findLastIndex((route) => fromRoute.startsWith(route));
		let toIndex = routes.findLastIndex((route) => toRoute.startsWith(route));

		if (fromIndex !== toIndex && fromIndex !== -1 && toIndex !== -1) {
			key = !key;
			isForward = toIndex > fromIndex;
		}
	});
</script>

<div class="base">
	{#key key}
		<div
			in:fly={{
				opacity: 1,
				duration,
				[axis]: isForward ? '100%' : '-100%',
			}}
			out:fly={{
				opacity: 1,
				duration,
				[axis]: isForward ? '-100%' : '100%',
			}}
			class="content"
		>
			{@render children()}
		</div>
	{/key}
</div>

<style>
	.base {
		position: relative;
		height: 100%;
		width: 100%;
	}

	.content {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		display: flex;
		overflow: hidden;
	}
</style>
