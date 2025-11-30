<script lang="ts">
	import './global.scss';

	const {
		children,
	}: {
		children: () => any;
	} = $props();
</script>

{@render children()}
