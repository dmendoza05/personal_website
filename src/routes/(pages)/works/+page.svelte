<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { getNavigatingFrom } from '$lib/navigating-from';
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
	import { WORK_HERO_NAME, startWorkHeroTransition, workSlug } from '$lib/work-hero-transition';
	import WorksFilters from './_components/WorksFilters.svelte';

	const skillOptions = projectSkillIds(projects);
	const typeOptions = projectTypes.map((type) => type.id);
	const returningSlug = workSlug(getNavigatingFrom());
	const ENTER_MS = 320;
	const STAGGER_MS = 80;

	let query = $state('');
	let selectedSkills = $state<SkillId[]>([]);
	let selectedTypes = $state<ProjectType[]>([]);
	let hasSource = $state(false);
	let animateIntro = $state(true);
	let searchExiting = $state(false);
	let pageEl = $state<HTMLElement>();

	onMount(() => {
		if (prefersReducedMotion()) {
			animateIntro = false;
			return;
		}

		const root = pageEl;
		if (!root) return;

		const expected = root.querySelectorAll('.works-search, .works-card').length;
		if (expected === 0) {
			animateIntro = false;
			return;
		}

		let finished = 0;

		function onAnimationEnd(event: AnimationEvent) {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			if (!target.classList.contains('works-search') && !target.classList.contains('works-card')) {
				return;
			}

			finished += 1;
			if (finished < expected) return;

			animateIntro = false;
			root?.removeEventListener('animationend', onAnimationEnd);
		}

		root.addEventListener('animationend', onAnimationEnd);

		const count = root.querySelectorAll('.works-card').length;
		const timeout = setTimeout(
			() => {
				animateIntro = false;
			},
			ENTER_MS + Math.max(0, count - 1) * STAGGER_MS + ENTER_MS + 50
		);

		return () => {
			clearTimeout(timeout);
			root.removeEventListener('animationend', onAnimationEnd);
		};
	});

	onNavigate(async (navigation) => {
		const slug = workSlug(navigation.to?.url.pathname ?? '');
		if (!slug || prefersReducedMotion() || searchExiting) return;

		searchExiting = true;
		animateIntro = false;
		await tick();

		const search = pageEl?.querySelector('.works-search');
		if (search instanceof HTMLElement) {
			await waitForAnimation(search, ENTER_MS);
		}

		markHero(slug);
		return startWorkHeroTransition(navigation.complete);
	});

	const visibleProjects = $derived(
		filterProjects(projects, {
			query,
			skills: selectedSkills,
			types: selectedTypes,
			hasSource
		} satisfies WorksFilter)
	);

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}

	function markHero(slug: string) {
		const root = pageEl;
		if (!root) return;

		for (const el of root.querySelectorAll('[data-work-hero]')) {
			if (!(el instanceof HTMLElement)) continue;
			el.style.viewTransitionName = el.dataset.workHero === slug ? WORK_HERO_NAME : '';
		}
	}

	function waitForAnimation(element: HTMLElement, durationMs: number): Promise<void> {
		return new Promise((resolve) => {
			const timeout = setTimeout(finish, durationMs + 50);

			function finish() {
				clearTimeout(timeout);
				element.removeEventListener('animationend', onEnd);
				resolve();
			}

			function onEnd(event: AnimationEvent) {
				if (event.target !== element) return;
				finish();
			}

			element.addEventListener('animationend', onEnd);
		});
	}
</script>

<svelte:head>
	<title>{m.works_title()} | {site.name}</title>
	<meta name="description" content={m.works_description()} />
</svelte:head>

<div
	bind:this={pageEl}
	class="relative z-10 h-[calc(100dvh-64px)] space-y-8 overflow-y-auto px-4 py-8 scrollbar-none [-ms-overflow-style:none] md:h-[calc(100dvh-80px)] sm:px-6 [&::-webkit-scrollbar]:hidden {animateIntro
		? 'works-intro'
		: ''}"
	style:--works-enter-ms="{ENTER_MS}ms"
	style:--works-stagger-ms="{STAGGER_MS}ms"
>
	<div class="works-search" class:works-search-exit={searchExiting}>
		<WorksFilters
			bind:query
			skills={skillOptions}
			types={typeOptions}
			bind:selectedSkills
			bind:selectedTypes
			bind:hasSource
		/>
	</div>

	{#if visibleProjects.length === 0}
		<p class="text-sm text-muted rajdhani">{m.works_empty()}</p>
	{:else}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each visibleProjects as project, index (project.slug)}
				<div class="works-card h-full" style:--work-index={index}>
					<ProjectCard {project} sharedHero={project.slug === returningSlug} />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.works-intro .works-search {
		animation: works-search-in var(--works-enter-ms) cubic-bezier(0.33, 1, 0.68, 1) both;
	}

	.works-intro .works-card {
		animation: works-card-in var(--works-enter-ms) cubic-bezier(0.33, 1, 0.68, 1) both;
		animation-delay: calc(var(--works-enter-ms) + var(--work-index, 0) * var(--works-stagger-ms));
	}

	.works-search-exit {
		animation: works-search-out var(--works-enter-ms) cubic-bezier(0.32, 0, 0.67, 0) both;
	}

	@keyframes works-search-in {
		from {
			opacity: 0;
			transform: translateY(-16px);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes works-search-out {
		from {
			opacity: 1;
			transform: none;
		}

		to {
			opacity: 0;
			transform: translateY(-16px);
		}
	}

	@keyframes works-card-in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.works-intro .works-search,
		.works-intro .works-card,
		.works-search-exit {
			animation: none;
		}
	}
</style>
