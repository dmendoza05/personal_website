<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { projects } from '$lib/data/projects';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { site } from '$lib/data/site';
</script>

<svelte:head>
	<title>{m.works_title()} | {site.name}</title>
	<meta name="description" content={m.works_description()} />
</svelte:head>

<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
	{#each projects as project (project.slug)}
		<ProjectCard {project} />
	{/each}
</div>
