<script>
	import { BUILD_INFO } from '$lib/buildInfo';
</script>

<footer>
	<p style:padding-bottom="1em">{@html BUILD_INFO}</p>
	<p>
		Базуецца на
		<a target="_blank" href="https://knihi.com/storage/pravapis2005.html"> БКП-2005 </a>
	</p>
	<p>(c) 2021-{__CURRENT_YEAR__} GooseOb</p>
</footer>

<style>
	footer {
		padding: 1rem;
		text-align: center;
		margin-top: auto;
		white-space: wrap;
	}
</style>
