<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import ExperienceTabContent, { employers } from './_components/ExperienceTabContent.svelte';
	import ProficiencyTabContent from './_components/ProficiencyTabContent.svelte';
	import { resume } from '$lib/data/resume';

	const ENTER_MS = 400;
	const STAGGER_MS = 100;
	const experienceOffset = 1;
	const proficiencyOffset = experienceOffset + 1 + employers.length;

	let animateIntro = $state(true);
	let pageEl = $state<HTMLElement>();

	onMount(() => {
		if (prefersReducedMotion()) {
			animateIntro = false;
			return;
		}

		const root = pageEl;
		if (!root) return;

		const expected = root.querySelectorAll('.about-block').length;
		if (expected === 0) {
			animateIntro = false;
			return;
		}

		let finished = 0;

		function onAnimationEnd(event: AnimationEvent) {
			const target = event.target;
			if (!(target instanceof HTMLElement) || !target.classList.contains('about-block')) return;

			finished += 1;
			if (finished < expected) return;

			animateIntro = false;
			root.removeEventListener('animationend', onAnimationEnd);
		}

		root.addEventListener('animationend', onAnimationEnd);

		const timeout = setTimeout(
			() => {
				animateIntro = false;
			},
			ENTER_MS + Math.max(0, expected - 1) * STAGGER_MS + ENTER_MS + 50
		);

		return () => {
			clearTimeout(timeout);
			root.removeEventListener('animationend', onAnimationEnd);
		};
	});

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}
</script>

<svelte:head>
	<title>{m.about_title()} | {site.name}</title>
	<meta name="description" content={m.about_description()} />
</svelte:head>

<div
	bind:this={pageEl}
	class="relative z-10 h-[calc(100dvh-64px)] space-y-8 overflow-y-auto px-4 py-6 scrollbar-none [-ms-overflow-style:none] md:h-[calc(100dvh-80px)] sm:px-6 sm:py-8 [&::-webkit-scrollbar]:hidden {animateIntro
		? 'about-intro'
		: ''}"
	style:--about-enter-ms="{ENTER_MS}ms"
	style:--about-stagger-ms="{STAGGER_MS}ms"
>
	<div
		class="about-block border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5"
		style:--about-index={0}
	>
		<p class="text-sm leading-relaxed text-foreground">{resume.summary}</p>
	</div>

	<ExperienceTabContent fadeOffset={experienceOffset} />
	<ProficiencyTabContent fadeOffset={proficiencyOffset} />
</div>

<style>
	.about-intro :global(.about-block) {
		animation: about-fade-in var(--about-enter-ms) cubic-bezier(0.33, 1, 0.68, 1) both;
		animation-delay: calc(var(--about-base, 0ms) + var(--about-index, 0) * var(--about-stagger-ms));
	}

	@keyframes about-fade-in {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.about-intro :global(.about-block) {
			animation: none;
		}
	}
</style>
