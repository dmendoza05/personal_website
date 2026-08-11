<script lang="ts">
	import type { Pathname } from '$app/types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onDestroy, onMount } from 'svelte';
	import { createTimeline, stagger, type Timeline } from 'animejs';
	import Logo from '$lib/components/Logo.svelte';
	import NewsBanner from '$lib/components/NewsBanner.svelte';
	import { HEADER_TRANSITION_MS } from '$lib/components/header/constants';
	import { site } from '$lib/data/site';
	import { m } from '$lib/paraglide/messages.js';

	const FADE_MS = 600;
	const ROUTES_STAGGER_MS = 80;

	const routes: { href: Pathname; label: () => string }[] = [
		{ href: '/about', label: () => m.nav_about() },
		// Hide this for now: { href: '/works', label: () => m.nav_works() },
		{ href: '/blog', label: () => m.nav_blog() }
	];

	const socials = [
		{
			href: site.links.github,
			label: 'GitHub',
			path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
		},
		{
			href: site.links.linkedin,
			label: 'LinkedIn',
			path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
		}
	] as const;

	const fadeUp = {
		opacity: [0, 1],
		translateY: [-12, 0],
		delay: stagger(ROUTES_STAGGER_MS),
		duration: HEADER_TRANSITION_MS,
		ease: 'outCubic'
	};

	const fadeDown = {
		opacity: [1, 0],
		translateY: [0, -12],
		delay: stagger(ROUTES_STAGGER_MS),
		duration: HEADER_TRANSITION_MS,
		ease: 'inCubic'
	};

	let newsReady = $state(false);
	let logo: Logo;
	let sectionEl: HTMLElement | undefined = $state();
	let navList: HTMLUListElement | undefined = $state();
	let socialList: HTMLUListElement | undefined = $state();
	let timeline: Timeline | undefined;
	let logoSvg: SVGSVGElement | undefined;
	let routeItems: NodeListOf<HTMLElement> | undefined;
	let socialItems: NodeListOf<HTMLElement> | undefined;
	let exiting = false;

	onMount(() => {
		if (!sectionEl || !navList || !socialList) return;

		logoSvg = sectionEl.querySelector<SVGSVGElement>('svg[data-state]') ?? undefined;
		routeItems = navList.querySelectorAll<HTMLElement>(':scope > li');
		socialItems = socialList.querySelectorAll<HTMLElement>(':scope > li');
		if (!logoSvg || !routeItems.length || !socialItems.length) return;

		if (prefersReducedMotion()) {
			logoSvg.style.opacity = '1';
			for (const item of [...routeItems, ...socialItems]) {
				item.style.opacity = '1';
				item.style.transform = 'none';
			}
			logo.toFullname();
			newsReady = true;
			return;
		}

		logoSvg.style.opacity = '0';

		timeline = createTimeline();
		timeline
			.add(logoSvg, {
				opacity: [0, 1],
				duration: FADE_MS,
				ease: 'outCubic'
			})
			.call(() => logo.toFullname())
			.call(() => {
				newsReady = true;
			}, `+=${HEADER_TRANSITION_MS}`)
			.add(routeItems, fadeUp, '<')
			.add(socialItems, fadeUp);
	});

	onDestroy(() => {
		timeline?.pause();
	});

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}

	function onRouteClick(event: MouseEvent, href: Pathname) {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
			return;
		}

		event.preventDefault();
		void playExitThenNavigate(href);
	}

	function playExitThenNavigate(href: Pathname) {
		if (exiting) return;
		exiting = true;

		const path = resolve(href);

		if (prefersReducedMotion() || !logoSvg || !routeItems || !socialItems) {
			newsReady = false;
			void goto(path);
			return;
		}

		timeline?.pause();

		timeline = createTimeline({
			onComplete: () => {
				void goto(path);
			}
		});

		timeline
			.add(socialItems, fadeDown)
			.add(routeItems, fadeDown)
			.call(() => {
				newsReady = false;
				logo.toInitials();
			})
			.add(
				logoSvg,
				{
					opacity: [1, 0],
					duration: FADE_MS,
					ease: 'inCubic'
				},
				`+=${HEADER_TRANSITION_MS}`
			);
	}
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<div class="flex h-full min-h-0 flex-1 flex-col">
	<section
		bind:this={sectionEl}
		class="flex flex-1 flex-col items-center justify-center gap-12 px-4"
		aria-label={site.name}
	>
		<Logo
			bind:this={logo}
			initial="initials"
			duration={HEADER_TRANSITION_MS}
			height={99}
			class="opacity-0 motion-reduce:opacity-100 text-foreground"
		/>

		<nav aria-label="Primary">
			<ul
				bind:this={navList}
				class="flex flex-col items-center gap-5 md:flex-row md:gap-8"
			>
				{#each routes as route (route.href)}
					<li class="opacity-0 motion-reduce:opacity-100">
						<a
							href={resolve(route.href)}
							class="bartle text-md font-medium tracking-wide text-muted transition-colors hover:text-foreground"
							onclick={(event) => onRouteClick(event, route.href)}
						>
							{route.label()}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<ul bind:this={socialList} class="flex flex-row items-center gap-10">
			{#each socials as social (social.href)}
				<li class="opacity-0 motion-reduce:opacity-100">
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex text-muted transition-colors hover:text-foreground"
						aria-label={social.label}
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d={social.path} />
						</svg>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	{#if newsReady}
		<NewsBanner />
	{/if}
</div>
