<script lang="ts">
	let {
		title,
		children,
	}: {
		title: string;
		children: () => any;
	} = $props();
</script>

<li class="select">
	<div class="title">{title}</div>
	<div class="options">
		{@render children()}
	</div>
</li>

<style>
	.select {
		box-shadow: #0004 0 0 20px;
		margin: 1rem;
		height: fit-content;
		justify-content: center;
		background-color: var(--1);
		align-items: center;
		border-radius: 1rem;
		overflow: hidden;
	}

	.title {
		white-space: nowrap;
		font-size: 1rem;
		padding: 0.5rem;
		font-weight: bold;
		text-align: center;
	}

	.options {
		width: 100%;
		user-select: none;
		overflow: hidden;
		justify-content: center;
		background-color: var(--2);
		border-radius: 0 1rem 0 0;
		position: relative;
		display: flex;
		flex-wrap: wrap;

		:global {
			a {
				flex: 1;
			}

			button {
				padding: 0.5rem;
				color: inherit;
				flex: 1;
				text-align: center;
				z-index: 1;
				transition: 0.2s;
				width: 100%;
				font: inherit;
				border: none;
				background: none;
				cursor: pointer;

				&:hover,
				&:focus,
				&:focus-within {
					background-color: var(--btn-hover);
				}
			}
		}
	}
</style>
