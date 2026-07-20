<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import Logo from '$lib/components/Logo.svelte';
	import HeaderShape from './HeaderShape.svelte';
	import { headerOffsetForState } from './header-height';
	import {
		HEADER_HEIGHT,
		HEADER_LOGO_HEIGHT,
		resolveHeaderState,
		SM_VIEWPORT_QUERY
	} from './header-state';
	import { m } from '$lib/paraglide/messages.js';

	const navItems: { href: Pathname; label: () => string }[] = [
		{ href: '/works', label: () => m.nav_works() },
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/blog', label: () => m.nav_blog() }
	];

	let menuOpen = $state(false);
	let shapeRevealed = $state(false);
	let isSmViewport = $state(false);
	let logoReady = $state(false);
	let logo: Logo;
	let navList: HTMLUListElement | undefined = $state();
	let headerContent: HTMLDivElement | undefined = $state();

	afterNavigate(() => {
		menuOpen = false;
	});

	onMount(() => {
		const mediaQuery = window.matchMedia(SM_VIEWPORT_QUERY);
		isSmViewport = mediaQuery.matches;
		logoReady = true;

		function onViewportChange() {
			isSmViewport = mediaQuery.matches;
		}

		mediaQuery.addEventListener('change', onViewportChange);

		return () => {
			mediaQuery.removeEventListener('change', onViewportChange);
		};
	});

	const headerState = $derived(resolveHeaderState(page.url.pathname, isSmViewport));
	const logoHeight = $derived(HEADER_LOGO_HEIGHT[headerState]);
	const headerOffset = $derived(headerOffsetForState(headerState));
	const headerSizeStyle = $derived(
		headerState === 'expanded'
			? `min-height: ${HEADER_HEIGHT.expanded.min}; max-height: ${HEADER_HEIGHT.expanded.max};`
			: `height: ${headerOffset};`
	);

	$effect(() => {
		if (!logoReady) return;

		if (headerState === 'compact') {
			const wasAlreadyInitials = logo.getState() === 'initials-default';
			logo.toInitials();
			// Already initials: no animation runs, so reveal the header UI now.
			if (wasAlreadyInitials) onLogoComplete();
			return;
		}

		logo.toFullname();
	});

	function isActive(href: Pathname) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function onLogoComplete() {
		if (shapeRevealed) return;
		shapeRevealed = true;

		const items = navList?.querySelectorAll<HTMLElement>(':scope > li');
		if (!items?.length) return;

		if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
			items.forEach((item) => {
				item.style.opacity = '1';
				item.style.transform = 'none';
			});
			return;
		}

		animate(items, {
			opacity: [0, 1],
			translateY: [-12, 0],
			delay: stagger(80),
			duration: 500,
			ease: 'outCubic'
		});
	}
</script>

<HeaderShape revealed={shapeRevealed} content={headerContent} nav={navList}>
	<div
		bind:this={headerContent}
		class="relative mx-auto flex w-full max-w-full flex-col items-center justify-center px-4 transition-[height,min-height,max-height] duration-500 ease-in-out motion-reduce:transition-none sm:px-6 md:max-w-4xl lg:max-w-7xl"
		style="{headerSizeStyle} padding-top: 1rem; padding-bottom: 1rem; gap: 1.5rem;"
	>
		<a
			href={resolve('/')}
			aria-label="Home"
			class="inline-block transition-[height] duration-500 ease-in-out motion-reduce:transition-none"
			style:height="{logoHeight}px"
		>
			<Logo
				bind:this={logo}
				initial="initials"
				class="h-full w-auto text-white"
				oncomplete={onLogoComplete}
			/>
		</a>

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
			<ul
				bind:this={navList}
				class="flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-1 lg:gap-2 bartle"
			>
				{#each navItems as item (item.href)}
					<li class="opacity-0 motion-reduce:opacity-100">
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
</HeaderShape>
