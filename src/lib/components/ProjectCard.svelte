<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getProjectType, type Project } from '$lib/data/projects';
	import { getSkill } from '$lib/data/skills';
	import SkillLogo from '$lib/components/SkillLogo.svelte';

	let { project }: { project: Project } = $props();

	const chip =
		'inline-flex h-9 items-center gap-1.5 border border-border bg-card/70 text-xs font-semibold uppercase tracking-[0.14em] text-muted rajdhani transition-colors';

	let expanded = $state(false);

	const type = $derived(getProjectType(project.type));
	const detailsDomId = $derived(`project-details-${project.slug}`);

	function showDetails() {
		expanded = true;
	}
</script>

<article
	class="group flex h-full flex-col overflow-hidden border border-border bg-card/95 text-foreground backdrop-blur-sm"
>
	{#if project.thumbnail}
		<div class="shrink-0 overflow-hidden">
			<img
				src={project.thumbnail}
				alt=""
				class="aspect-video w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
			/>
		</div>
	{:else}
		<div
			class="flex aspect-video w-full shrink-0 items-center justify-center border-b border-border bg-background/40"
		>
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
				{m.works_thumbnail_placeholder()}
			</p>
		</div>
	{/if}

	<div class="flex min-h-0 flex-1 flex-col p-3">
		<h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-foreground rajdhani">
			{project.title}
		</h3>
		<p
			class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani"
		>
			<svg
				class="size-4 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d={type.icon} />
			</svg>
			{type.label}
		</p>
		<div
			id={detailsDomId}
			class="flex min-h-0 flex-1 flex-col {expanded ? '' : 'max-sm:hidden'}"
		>
			<p class="mt-2 text-sm leading-relaxed text-muted rajdhani">{project.description}</p>

			<ul class="mt-3 flex flex-wrap gap-1">
				{#each project.tags as tag (tag)}
					<li class="{chip} pointer-events-none w-9 justify-center sm:w-auto sm:px-2">
						<SkillLogo id={tag} class="size-4 shrink-0 sm:size-3" />
						<span class="hidden sm:inline">{getSkill(tag).label}</span>
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
							class="{chip} px-2 hover:border-accent/60 hover:text-foreground"
						>
							Live demo
						</a>
					{/if}
					{#if project.repo}
						<a
							href={project.repo}
							target="_blank"
							rel="noopener noreferrer"
							class="{chip} px-2 hover:border-accent/60 hover:text-foreground"
						>
							Source
						</a>
					{/if}
				</div>
			{/if}
		</div>
		{#if !expanded}
			<button
				type="button"
				class="mt-auto self-start pt-2 text-sm font-semibold text-muted rajdhani transition-colors hover:text-foreground sm:hidden"
				aria-expanded="false"
				aria-controls={detailsDomId}
				onclick={showDetails}
			>
				Learn more
			</button>
		{/if}
	</div>
</article>
