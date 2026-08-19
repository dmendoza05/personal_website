<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import { createSceneController } from '$lib/scene';
	import { projects } from '$lib/data/projects';

	const scene = createSceneController();
</script>

<TabContent id="projects" onenter={scene.enter} onexit={scene.exit}>
	<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
		{#each projects as project (project.slug)}
			<ProjectCard {project} />
		{/each}
	</div>
</TabContent>
