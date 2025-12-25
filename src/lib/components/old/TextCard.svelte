<script lang="ts">
	const {
		title,
		counterValue,
		children,
		iconButtons,
	}: {
		title: string;
		counterValue: number;
		children: () => any;
		iconButtons: () => any;
	} = $props();
</script>

<div class="card">
	<header>{title}</header>
	<div class="textfield-cont">
		{@render children()}
	</div>
	<footer>
		<div class="icon-btns">
			{@render iconButtons()}
		</div>
		<div class="counter">{counterValue}</div>
	</footer>
</div>

<style>
	.icon-btns > :global(*) {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		&:last-child {
			margin-left: auto;
		}
	}

	.card {
		width: 50%;
		position: relative;

		@media (max-width: 650px) {
			width: 100%;
		}

		&:first-child {
			background-color: var(--secondary-dark);
		}

		&:last-child {
			background-color: var(--secondary);
		}
	}

	header {
		font-size: 1.5rem;
		padding: 0.8rem;
		padding-left: 1.8rem;
		font-weight: bold;
		background-color: var(--primary);
		display: flex;
		flex-direction: row;
	}

	footer {
		display: flex;
		bottom: 0;
		width: 100%;
		position: absolute;
		height: 2.6rem;
		user-select: none;
		padding: 0.2rem 2rem;
		font-weight: bold;

		:global {
			button,
			label {
				margin-right: 1rem;
				background-color: #0000;
				border: none;
				background-repeat: no-repeat;
				background-position: center;
				background-size: 100%;
				width: 2rem;
				height: 100%;
				cursor: pointer;
				transition: opacity 0.2s ease;
				opacity: 0.8;

				&:hover,
				&:focus {
					opacity: 1;
				}
			}

			label:has(input:focus) {
				opacity: 1;
			}
		}
	}

	.icon-btns {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.counter {
		margin: auto 4rem auto auto;
	}

	.textfield-cont {
		max-height: 60vh;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		font-size: 1.2rem;
		min-height: 4rem;
		word-break: break-word;
		margin-bottom: 3rem;

		:global {
			.textfield {
				padding: 1rem;
			}
			::selection,
			::-moz-selection {
				background: var(--primary) !important;
			}
		}
	}
</style>
