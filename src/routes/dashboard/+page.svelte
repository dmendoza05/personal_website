<script lang="ts">
	import './_components/panel-motion.css';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import EarthData from './_components/EarthData.svelte';
</script>

<svelte:head>
	<title>{m.dashboard_title()} | {site.name}</title>
	<meta name="description" content={m.dashboard_description()} />
</svelte:head>

<div class="relative h-[calc(100dvh-5.75rem)] w-full">
	<EarthData />
</div>
