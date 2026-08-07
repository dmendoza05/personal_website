<script lang="ts">
	import { site } from '$lib/data/site';
	import NewsBanner from '$lib/components/NewsBanner.svelte';
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<NewsBanner />
