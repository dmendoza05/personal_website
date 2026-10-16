<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import { isWorksIndex, startWorkHeroTransition, WORK_HERO_NAME } from '$lib/work-hero-transition';
	import { getProjectType, type ProjectLinkKind } from '$lib/data/projects';
	import { getSkill } from '$lib/data/skills';
	import SkillLogo from '$lib/components/SkillLogo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const chip =
		'inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-2.5 py-1 text-sm text-foreground';

	onNavigate((navigation) => {
		const path = navigation.to?.url.pathname ?? '';
		if (!isWorksIndex(path) || prefersReducedMotion()) return;
		return startWorkHeroTransition(navigation.complete);
	});

	const project = $derived(data.project);
	const type = $derived(getProjectType(project.type));

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}

	function formatDate(dateStr: string) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function linkLabel(kind: ProjectLinkKind) {
		if (kind === 'source') return m.works_link_source();
		if (kind === 'store') return m.works_link_store();
		return m.works_link_live();
	}
</script>

<svelte:head>
	<title>{project.title} | {site.name}</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div
	class="relative z-10 flex h-[calc(100dvh-64px)] flex-col px-4 md:h-[calc(100dvh-80px)] sm:px-6"
>
	<a
		href={resolve('/works')}
		class="shrink-0 pt-6 text-sm font-semibold text-muted hover:text-foreground sm:pt-8"
	>
		← {m.works_back()}
	</a>

	<div
		class="min-h-0 flex-1 overflow-y-auto pt-4 pb-6 scrollbar-none [-ms-overflow-style:none] sm:pb-8 [&::-webkit-scrollbar]:hidden"
	>
		<div
			class="grid grid-cols-1 items-stretch overflow-hidden border border-border md:grid-cols-[65%_35%] lg:grid-cols-[75%_25%]"
		>
			{#if project.thumbnail}
				<div class="min-w-0" style:view-transition-name={WORK_HERO_NAME}>
					<img src={project.thumbnail} alt="" class="aspect-video h-full w-full object-cover" />
				</div>
			{:else}
				<div class="flex aspect-video h-full w-full items-center justify-center bg-background/40">
					<p class="text-sm text-muted">{m.works_thumbnail_placeholder()}</p>
				</div>
			{/if}

			<section
				class="flex flex-col border-t border-border bg-card/95 p-4 backdrop-blur-sm md:border-t-0 md:border-l sm:p-5"
			>
				<h2 id="work-stack" class="text-lg font-semibold text-foreground">
					{m.works_stack()}
				</h2>
				<ul class="mt-3 flex flex-wrap gap-2">
					{#each project.tags as tag (tag)}
						<li class="{chip} pointer-events-none">
							<SkillLogo id={tag} class="size-3.5 shrink-0" />
							{getSkill(tag).label}
						</li>
					{/each}
				</ul>

				{#if project.links.length > 0}
					<section class="mt-6" aria-labelledby="work-links">
						<h2 id="work-links" class="text-lg font-semibold text-foreground">
							{m.works_links()}
						</h2>
						<ul class="mt-3 flex flex-wrap gap-2">
							{#each project.links as link (`${link.kind}-${link.href}`)}
								<li>
									<a
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										class="{chip} transition-colors hover:border-accent/60"
									>
										{linkLabel(link.kind)}
									</a>
								</li>
							{/each}
						</ul>
					</section>
				{/if}
			</section>
		</div>

		<article
			class="mt-6 border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5"
		>
			<header>
				<h1 class="text-lg font-semibold text-foreground">{project.title}</h1>
				<div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
					<time class="text-sm text-muted" datetime={project.date}>
						{m.works_posted()}
						{formatDate(project.date)}
					</time>
					<p class="inline-flex items-center gap-1.5 text-sm text-muted">
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
				</div>
				<p class="mt-3 text-sm leading-relaxed text-foreground">{project.description}</p>
			</header>

			{#if data.articleHtml}
				<div
					class="mt-8 space-y-3 border-t border-border pt-8 text-sm leading-relaxed text-foreground [&_a]:text-accent [&_a]:underline [&_code]:rounded-sm [&_code]:bg-background/40 [&_code]:px-1 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-4"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html data.articleHtml}
				</div>
			{/if}
		</article>
	</div>
</div>
