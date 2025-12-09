<script lang="ts">
	let {
		title,
		children,
		buttons,
		count,
	}: {
		title: string;
		children: () => any;
		buttons: () => any;
		count: number;
	} = $props();
</script>

<div class="card">
	<div class="title">{title}</div>
	<div class="textfield-container">
		{@render children()}
	</div>
	<footer>
		{@render buttons()}
		<div class="counter">{count}</div>
	</footer>
</div>

<style>
	.card {
		flex: 1;
		max-height: 50%;
		display: flex;
		flex-direction: column;

		.textfield-container {
			flex: 1;
			display: flex;
			flex-direction: column;
			border-radius: 0 0 0 1rem;
			overflow: hidden;
		}

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

	footer {
		display: flex;
		padding: 0.25em;
		gap: 0.5em;
		background-color: var(--secondary);
	}

	.counter {
		margin-left: auto;
		font-weight: bold;
	}

	.title {
		font-weight: bold;
		padding: 0.5em 1em;
		background-color: var(--primary-dark);
	}
</style>
