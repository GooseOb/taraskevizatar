<script lang="ts">
	let {
		title,
		// value = $bindable(''),
		children,
		placeholder = ''
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
	<!-- <textarea bind:value class="textfield" {placeholder}></textarea> -->
</div>

<style>
	.card {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.title {
		width: 100%;
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
		&:focus {
			outline: none;
		}
	}
</style>
