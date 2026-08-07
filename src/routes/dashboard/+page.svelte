<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
</script>

<svelte:head>
	<title>{m.dashboard_title()} | {site.name}</title>
	<meta name="description" content={m.dashboard_description()} />
</svelte:head>

<div class="flex h-screen items-center justify-center">
<!-- add an emoji of a construction -->
	
	<h1 class="text-4xl font-bold"><span class="text-4xl">🚧</span> Under Construction <span class="text-4xl">🚧</span></h1>
</div>