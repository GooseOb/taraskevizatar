<script lang="ts">
	let animationElement: HTMLElement;
	const props: {
		color?: string;
	} & (
		| {
				activeElement: HTMLElement | undefined;
		  }
		| {
				findActive: (el: HTMLElement) => HTMLElement | null;
		  }
	) = $props();

	let element: HTMLElement | null | undefined = null;

	$effect(() => {
		let height = 0;
		let width = 0;
		let top = 0;
		let left = 0;
		element =
			'activeElement' in props
				? props.activeElement
				: props.findActive(animationElement.parentElement!);
		if (element) {
			const rect = element.getBoundingClientRect();
			const parentRect = animationElement.parentElement!.getBoundingClientRect();
			height = rect.height;
			width = rect.width;
			top = rect.top - parentRect.top;
			left = rect.left - parentRect.left;
		}
		animationElement.style.height = height + 'px';
		animationElement.style.width = width + 'px';
		animationElement.style.top = top + 'px';
		animationElement.style.left = left + 'px';
	});
</script>

<span bind:this={animationElement} style={props.color ? `background-color: ${props.color}` : ''}
></span>

<style>
	span {
		position: absolute;
		background-color: var(--secondary-dark);
		transition: all 0.2s ease-out;
	}
</style>
