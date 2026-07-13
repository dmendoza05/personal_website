<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { projects } from '$lib/data/projects';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { site } from '$lib/data/site';
</script>

<svelte:head>
	<title>{m.projects_title()} | {site.name}</title>
	<meta name="description" content={m.projects_description()} />
</svelte:head>

<SectionHeading title={m.projects_title()} description={m.projects_description()} />

<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
	{#each projects as project (project.slug)}
		<ProjectCard {project} />
	{/each}
</div>
