<script lang="ts">
	let animationElement: HTMLElement = $state()!;

	const {
		color,
		elements,
		activeIndex,
	}: {
		color?: string;
		elements: HTMLElement[];
		activeIndex: number;
	} = $props();

	const parentRect = $derived(animationElement!.parentElement!.getBoundingClientRect());

	const rects = $derived(elements.map((el) => el.getBoundingClientRect()));

	$effect(() => {
		const { height, width, top, left } = rects[activeIndex];
		Object.assign(animationElement!.style, {
			height: `${height}px`,
			width: `${width}px`,
			top: `${top - parentRect.top}px`,
			left: `${left - parentRect.left}px`,
		});
	});
</script>

<span bind:this={animationElement} style:background-color={color}></span>

<style>
	span {
		position: absolute;
		background-color: var(--secondary-dark);
		transition: all 0.2s ease-out;
	}
</style>
