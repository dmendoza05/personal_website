<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import {
		filterProjects,
		projectSkillIds,
		projectTypes,
		projects,
		type ProjectType,
		type WorksFilter
	} from '$lib/data/projects';
	import type { SkillId } from '$lib/data/skills';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import WorksFilters from './_components/WorksFilters.svelte';

	const skillOptions = projectSkillIds(projects);
	const typeOptions = projectTypes.map((type) => type.id);

	let query = $state('');
	let selectedSkills = $state<SkillId[]>([]);
	let selectedTypes = $state<ProjectType[]>([]);
	let hasSource = $state(false);

	const visibleProjects = $derived(
		filterProjects(projects, {
			query,
			skills: selectedSkills,
			types: selectedTypes,
			hasSource
		} satisfies WorksFilter)
	);
</script>

<svelte:head>
	<title>{m.works_title()} | {site.name}</title>
	<meta name="description" content={m.works_description()} />
</svelte:head>

<div class="relative z-10 space-y-8 px-4 py-8 sm:px-6">
	<WorksFilters
		bind:query
		skills={skillOptions}
		types={typeOptions}
		bind:selectedSkills
		bind:selectedTypes
		bind:hasSource
	/>

	{#if visibleProjects.length === 0}
		<p class="text-sm text-muted rajdhani">{m.works_empty()}</p>
	{:else}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each visibleProjects as project (project.slug)}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}
</div>
