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

	const getRect = (el: HTMLElement) => el.getBoundingClientRect();

	let parentRect = $derived(getRect(animationElement.parentElement!));
	let rects = $derived(elements.map(getRect));

	$effect(() => {
		new ResizeObserver(() => {
			parentRect = getRect(animationElement.parentElement!);
			rects = elements.map(getRect);
		}).observe(animationElement.parentElement!);
	});

	$effect(() => {
		const { height, width, top, left } = rects[activeIndex];
		Object.assign(animationElement.style, {
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
