<script lang="ts">
	let {
		title,
		children,
	}: {
		title: string;
		children: () => any;
	} = $props();
</script>

<div class="card">
	<div class="title">{title}</div>
	{@render children()}
</div>

<style>
	.card {
		flex: 1;
		max-height: 50%;
		display: flex;
		flex-direction: column;

		:global(.textfield) {
			height: 100%;
			resize: none;
			padding: 0.25em;
			font-family: inherit;
			font-size: inherit;
			background: var(--anti-fg);
			border: none;
			overflow: auto;

			&:focus {
				outline: none;
			}
		}
	}

	.title {
		font-weight: bold;
		padding: 0.5em 1em;
		background-color: var(--primary-dark);
	}
</style>
