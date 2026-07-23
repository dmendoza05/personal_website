<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import { projects } from '$lib/data/projects';
	import type { SceneHandler, ScenePreset } from '$lib/scene';

	interface Props {
		preset?: ScenePreset;
		onenter?: SceneHandler;
		onexit?: SceneHandler;
	}

	let { preset, onenter, onexit }: Props = $props();
</script>

<TabContent id="projects" {preset} {onenter} {onexit}>
	<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
		{#each projects as project (project.slug)}
			<ProjectCard {project} />
		{/each}
	</div>
</TabContent>
