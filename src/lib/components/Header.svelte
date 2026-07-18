<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import Logo from '$lib/components/Logo.svelte';
	import { m } from '$lib/paraglide/messages.js';

	const navItems: { href: Pathname; label: () => string }[] = [
		{ href: '/works', label: () => m.nav_works() },
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/blog', label: () => m.nav_blog() }
	];

	const COLLAPSED_HEIGHT = 150;

	let menuOpen = $state(false);
	let logo: Logo;
	let navList: HTMLUListElement;

	afterNavigate(() => {
		menuOpen = false;
	});

	onMount(() => {
		logo.toFullname();
	});

	const isHome = $derived(page.url.pathname === '/');
	const headerHeight = $derived(isHome ? '100dvh' : `${COLLAPSED_HEIGHT}px`);

	function isActive(href: Pathname) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function onLogoComplete() {
		const items = navList.querySelectorAll<HTMLElement>(':scope > li');
		if (!items.length) return;

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

<header id="header" class="fixed top-0 z-50 w-dvw border-b border-border backdrop-blur-xs">
	<div
		class="relative flex w-dvw flex-col items-center justify-center px-4 transition-[height] duration-500 ease-in-out motion-reduce:transition-none sm:px-6"
		style="height: {headerHeight}; padding-top: 2rem; padding-bottom: 2rem; gap: 1.5rem;"
	>
		<a href={resolve('/')} aria-label="Home" class="inline-block">
			<Logo
				bind:this={logo}
				initial="initials"
				class="h-[42px] w-auto text-white"
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
</header>

<div
	class="shrink-0 transition-[height] duration-500 ease-in-out motion-reduce:transition-none"
	style="height: {headerHeight}"
	aria-hidden="true"
></div>
