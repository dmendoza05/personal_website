<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { getSkill } from '$lib/data/skills';
	import SkillLogo from '$lib/components/SkillLogo.svelte';

	let { project }: { project: Project } = $props();

	const chip =
		'inline-flex h-9 items-center gap-1.5 border border-border bg-card/70 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted rajdhani transition-colors';
</script>

<article
	class="flex h-full flex-col border border-border bg-card/95 text-foreground backdrop-blur-sm"
>
	<div class="flex h-full flex-col p-3">
		<h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-foreground rajdhani">
			{project.title}
		</h3>
		<p class="mt-2 flex-1 text-sm leading-relaxed text-muted rajdhani">{project.description}</p>

		<ul class="mt-3 flex flex-wrap gap-1">
			{#each project.tags as tag (tag)}
				<li class="{chip} pointer-events-none">
					<SkillLogo id={tag} class="size-3 shrink-0" />
					{getSkill(tag).label}
				</li>
			{/each}
		</ul>

		{#if project.href || project.repo}
			<div class="mt-3 flex flex-wrap gap-1">
				{#if project.href}
					<a
						href={project.href}
						target="_blank"
						rel="noopener noreferrer"
						class="{chip} hover:border-accent/60 hover:text-foreground"
					>
						Live demo
					</a>
				{/if}
				{#if project.repo}
					<a
						href={project.repo}
						target="_blank"
						rel="noopener noreferrer"
						class="{chip} hover:border-accent/60 hover:text-foreground"
					>
						Source
					</a>
				{/if}
			</div>
		{/if}
	</div>
</article>
