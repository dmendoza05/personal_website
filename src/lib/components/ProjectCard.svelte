<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { getSkill } from '$lib/data/skills';
	import Card from '$lib/components/card/Card.svelte';
	import SkillLogo from '$lib/components/SkillLogo.svelte';

	let { project }: { project: Project } = $props();
</script>

<Card class="h-full" notches={['top-right', 'bottom-left', 'bottom-right']}>
	<article class="flex h-full flex-col">
		<h3 class="text-base font-semibold text-foreground sm:text-lg">{project.title}</h3>
		<p class="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

		<div class="mt-4 flex flex-wrap gap-2">
			{#each project.tags as tag (tag)}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
				>
					<SkillLogo id={tag} class="size-3 shrink-0 text-accent" />
					{getSkill(tag).label}
				</span>
			{/each}
		</div>

		<div class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
			{#if project.href}
				<a
					href={project.href}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-accent hover:underline"
				>
					Live demo
				</a>
			{/if}
			{#if project.repo}
				<a
					href={project.repo}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-accent hover:underline"
				>
					Source
				</a>
			{/if}
		</div>
	</article>
</Card>
