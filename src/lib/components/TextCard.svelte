<script lang="ts">
	let {
		title,
		// value = $bindable(''),
		children,
		placeholder = '',
	}: {
		title: string;
		// value?: string;
		children: () => any;
		placeholder?: string;
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
	}

	.title {
		font-weight: bold;
		padding: 0.5em;
	}

	:global(.textfield) {
		height: 100%;
		resize: none;
		padding: 0.25em;
		font-family: inherit;
		font-size: inherit;
		background: #fafafa;
		border: none;
		overflow: auto;

		&:focus {
			outline: none;
		}
	}
</style>
