<script lang="ts">
	import { contactLinks } from '$lib/contacts';
</script>

<div class="card">
	<div class="title">Для памылак і прапановаў</div>
	<div class="content">
		{#each contactLinks as { value, label }}
			<a class={label.toLowerCase()} href={value} target="_blank" rel="noopener noreferrer">
				<button tabindex="-1">{label}</button>
			</a>
		{/each}
	</div>
</div>

<style>
	.card {
		padding: 0 1em;
	}
	.title {
		font-weight: bold;
		text-align: center;
	}

	.content {
		display: flex;
		gap: 0.5em;
		margin-top: 0.5em;
	}

	button {
		width: 100%;
		height: 100%;
		border: none;
		background: none;
		cursor: pointer;
		font-weight: bold;
	}

	a {
		width: 100%;
		border-radius: 0.25rem;
		padding: 0.25em;
		border: var(--fg) 1px solid;
		transition: background-color 0.2s;
		&:focus {
			outline: none;
		}
	}

	.github {
		background-color: #24292e;
		color: white;
		&:hover,
		&:focus {
			background-color: #3b4045;
		}
	}
	.telegram {
		background-color: #0088cc;
		color: white;
		&:hover,
		&:focus {
			background-color: #00aaff;
		}
	}
</style>
