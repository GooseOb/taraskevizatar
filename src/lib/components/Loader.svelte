<script lang="ts">
	const {
		size = 40,
		color = 'currentColor',
		label = 'Loading...',
	}: {
		size?: number;
		color?: string;
		label?: string;
	} = $props();
</script>

<span
	role="status"
	aria-live="polite"
	class="spinner"
	style:width="{size}px"
	style:height="{size}px"
>
	<svg viewBox="0 0 50 50" width={size} height={size} aria-hidden="true" focusable="false">
		<circle
			cx="25"
			cy="25"
			r="20"
			fill="none"
			stroke={color}
			stroke-width="4"
			stroke-opacity="0.15"
		/>
		<path
			d="M45 25a20 20 0 00-6-14"
			stroke={color}
			stroke-width="4"
			stroke-linecap="round"
			fill="none"
			stroke-linejoin="round"
		/>
	</svg>
	<span class="sr-only">{label}</span>
</span>

<style>
	.spinner {
		display: inline-block;
		vertical-align: middle;
		animation: rotate 1s linear infinite;
	}

	.spinner svg {
		display: block;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	/* visually hidden accessible label */
	.sr-only {
		position: absolute !important;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}
</style>
