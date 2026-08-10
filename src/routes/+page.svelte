<script lang="ts">
	import { site } from '$lib/data/site';
	import LogoBanner from '$lib/components/LogoBanner.svelte';
	import NewsBanner from '$lib/components/NewsBanner.svelte';

	let newsReady = $state(false);
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<div class="flex h-full min-h-0 flex-1 flex-col">
	<LogoBanner oncomplete={() => (newsReady = true)} />
	{#if newsReady}
		<NewsBanner />
	{/if}
</div>
