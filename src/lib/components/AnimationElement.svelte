<script lang="ts">
	let animationElement: HTMLElement;
	const { activeElement }: { activeElement?: HTMLElement } = $props();

	$effect(() => {
		let height = 0;
		let top = 0;
		if (activeElement) {
			const rect = activeElement.getBoundingClientRect();
			const parentRect = animationElement.parentElement!.getBoundingClientRect();
			height = rect.height;
			top = rect.top - parentRect.top;
		}
		animationElement.style.height = height + 'px';
		animationElement.style.top = top + 'px';
	});
</script>

<span bind:this={animationElement}></span>

<style>
	span {
		position: absolute;
		bottom: 0;
		width: 100%;
		background-color: var(--secondary-dark);
		transition: all 0.2s ease-out;
		z-index: 0;
	}
</style>
