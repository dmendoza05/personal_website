<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageShape from './PageShape.svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<PageShape>
	<div class="w-full mt-8 px-4 py-4 sm:px-6 sm:py-6 lg:py-6">
		{@render children()}
	</div>
</PageShape>
