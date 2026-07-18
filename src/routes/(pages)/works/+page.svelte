<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import ProjectsTabContent from './_components/ProjectsTabContent.svelte';
</script>

<svelte:head>
	<title>{m.works_title()} | {site.name}</title>
	<meta name="description" content={m.works_description()} />
</svelte:head>

<ProjectsTabContent />
