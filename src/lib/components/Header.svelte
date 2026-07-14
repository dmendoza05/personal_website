<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { createTimeline, onScroll } from 'animejs';
	import { m } from '$lib/paraglide/messages.js';

	const navItems: { href: Pathname; label: () => string }[] = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/projects', label: () => m.nav_projects() },
		{ href: '/resume', label: () => m.nav_resume() },
		{ href: '/blog', label: () => m.nav_blog() }
	];

	const EXPANDED_SIZE = '100dvh';
	const COLLAPSED_HEIGHT = 80;
	const SCRUB_DISTANCE = 350;

	let menuOpen = $state(false);
	let innerEl: HTMLDivElement | undefined = $state();
	let logoEl: SVGSVGElement | undefined = $state();

	afterNavigate(() => {
		menuOpen = false;
	});

	onMount(() => {
		if (!innerEl || !logoEl) return;

		const timeline = createTimeline({
			defaults: { ease: 'linear' },
			autoplay: onScroll({
				target: document.body,
				enter: 'top top',
				leave: `top+=${SCRUB_DISTANCE} top`,
				sync: 0.15
			})
		})
			.add(
				innerEl,
				{
					minHeight: [EXPANDED_SIZE, `${COLLAPSED_HEIGHT}px`],
					paddingTop: ['2rem', '0.75rem'],
					paddingBottom: ['2rem', '0.75rem'],
					gap: ['1.5rem', '0.375rem']
				},
				0
			)
			.add(logoEl, { scale: [1, 0.75] }, 0)
			.init();

		return () => {
			timeline.revert();
		};
	});

	function isActive(href: Pathname) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
</script>

<header class="sticky top-0 z-50 w-dvw border-b border-border bg-background/80 backdrop-blur-sm">
	<div
		bind:this={innerEl}
		class="relative flex w-dvw flex-col items-center justify-center px-4 sm:px-6"
		style="min-height: {EXPANDED_SIZE}; padding-top: 2rem; padding-bottom: 2rem; gap: 1.5rem;"
	>
		<svg
			bind:this={logoEl}
			id="logo"
			class="origin-center"
			xmlns="http://www.w3.org/2000/svg"
			width="147"
			height="35"
			viewBox="0 0 147 35"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M69 0V33L57.75 21.75M57.75 21.75L46.5 10.5H74V33L80.6987 8V33L88.2013 5V33L98.5 21.75H146.5M57.75 21.75H0"
				stroke="currentColor"
				stroke-width="3"
				stroke-linejoin="round"
			/>
		</svg>

		<button
			type="button"
			class="absolute top-3 right-4 inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-card sm:right-6 md:hidden"
			aria-expanded={menuOpen}
			aria-controls="site-nav"
			onclick={toggleMenu}
		>
			<span class="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
			{#if menuOpen}
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
				</svg>
			{:else}
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
				</svg>
			{/if}
		</button>

		<nav id="site-nav" class="w-full {menuOpen ? 'block' : 'hidden md:block'}">
			<ul class="flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-1 lg:gap-2">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={resolve(item.href)}
							class="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors md:py-1.5 {isActive(
								item.href
							)
								? 'bg-accent/10 text-accent'
								: 'text-muted hover:bg-card hover:text-foreground md:hover:bg-transparent'}"
						>
							{item.label()}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>
