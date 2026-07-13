<script lang="ts">
	import type { Project } from '$lib/data/projects';

	let { project }: { project: Project } = $props();
</script>

<article class="flex flex-col rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
	<h3 class="text-lg font-semibold text-foreground">{project.title}</h3>
	<p class="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

	<div class="mt-4 flex flex-wrap gap-2">
		{#each project.tags as tag (tag)}
			<span class="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
				{tag}
			</span>
		{/each}
	</div>

	<div class="mt-4 flex gap-4">
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
