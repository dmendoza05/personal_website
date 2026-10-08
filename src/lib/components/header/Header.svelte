<script lang="ts">
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { createTimeline, type Timeline } from 'animejs';
	import Logo from '$lib/components/Logo.svelte';
	import HeaderMenu from './HeaderMenu.svelte';
	import ResumeDownloadButton from './ResumeDownloadButton.svelte';
	import {
		HEADER_HEIGHT,
		HEADER_LOGO_HEIGHT,
		HEADER_TRANSITION,
		HEADER_TRANSITION_MS,
		LOGO_FADE_IN,
		NAV_ICON_PATHS,
		NAV_ITEMS,
		ROUTE_FADE_UP,
		resolveHeaderState,
		SM_VIEWPORT_QUERY
	} from './constants';

	let {
		left,
		center,
		right
	}: {
		left?: Snippet;
		center?: Snippet;
		right?: Snippet;
	} = $props();

	let isSmViewport = $state(false);
	let logo: Logo;
	let logoEl: HTMLAnchorElement | undefined = $state();
	let navList: HTMLUListElement | undefined = $state();
	let timeline: Timeline | undefined;
	let routeItems: NodeListOf<HTMLElement> | undefined;
	let entered = false;

	onMount(() => {
		const mediaQuery = window.matchMedia(SM_VIEWPORT_QUERY);
		isSmViewport = mediaQuery.matches;

		function onViewportChange() {
			isSmViewport = mediaQuery.matches;
		}

		mediaQuery.addEventListener('change', onViewportChange);
		if (!left) playEntry();

		return () => {
			mediaQuery.removeEventListener('change', onViewportChange);
		};
	});

	onDestroy(() => {
		timeline?.pause();
	});

	const headerState = $derived(resolveHeaderState(isSmViewport));
	const isCompact = $derived(headerState === 'compact');
	const logoHeight = $derived(HEADER_LOGO_HEIGHT[headerState]);
	const headerHeight = $derived(HEADER_HEIGHT[headerState]);

	const navLinkBase = $derived(
		`inline-flex items-center justify-center rounded-md transition-colors ${
			isCompact ? 'h-10 w-10' : 'px-3 py-1.5 text-sm font-medium'
		}`
	);

	$effect(() => {
		if (!entered || left) return;

		if (isCompact) {
			logo.toInitials();
			return;
		}

		logo.toFullname();
	});

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}

	function isActive(href: Pathname) {
		return page.url.pathname.startsWith(href);
	}

	function navLinkClass(active = false) {
		const tone = active
			? 'bg-accent/10 text-accent'
			: 'text-muted hover:bg-card hover:text-foreground md:hover:bg-transparent';
		return `${navLinkBase} ${tone}`;
	}

	function cacheRouteItems() {
		routeItems = navList?.querySelectorAll<HTMLElement>(':scope > li');
		return Boolean(logoEl && routeItems?.length);
	}

	function revealInstant() {
		if (!logoEl || !routeItems) return;

		logoEl.style.opacity = '1';
		logoEl.style.transform = 'none';
		for (const item of routeItems) {
			item.style.opacity = '1';
			item.style.transform = 'none';
		}
	}

	function playEntry() {
		if (!cacheRouteItems() || !logoEl || !routeItems) return;

		if (prefersReducedMotion()) {
			revealInstant();
			if (!isCompact) logo.toFullname();
			entered = true;
			return;
		}

		logoEl.style.opacity = '0';

		timeline = createTimeline({
			onComplete: () => {
				entered = true;
			}
		});

		timeline
			.add(logoEl, LOGO_FADE_IN)
			.call(() => {
				if (!isCompact) logo.toFullname();
			})
			.add(routeItems, ROUTE_FADE_UP);
	}

	function onHomeClick(event: MouseEvent) {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
			return;
		}

		event.preventDefault();
		void goto(resolve('/'));
	}
</script>

{#snippet strokeIcon(path: string, className: string)}
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d={path} />
	</svg>
{/snippet}

{#snippet siteLogo()}
	<a
		bind:this={logoEl}
		href={resolve('/')}
		aria-label="Home"
		class="inline-block shrink-0 opacity-0 motion-reduce:opacity-100"
		style:height="{logoHeight}px"
		style:transition={HEADER_TRANSITION}
		onclick={onHomeClick}
	>
		<Logo
			bind:this={logo}
			initial="initials"
			duration={HEADER_TRANSITION_MS}
			height={logoHeight}
			class="text-foreground"
		/>
	</a>
{/snippet}

{#snippet siteNav()}
	<nav id="site-nav" class="shrink-0 max-md:hidden">
		<ul
			bind:this={navList}
			class="flex items-center bartle {isCompact
				? 'flex-row justify-end gap-0.5'
				: 'flex-row justify-end gap-1 lg:gap-2'}"
		>
			{#each NAV_ITEMS as item (item.href)}
				<li class="opacity-0 motion-reduce:opacity-100">
					<a
						href={resolve(item.href)}
						class={navLinkClass(isActive(item.href))}
						aria-label={isCompact ? item.label() : undefined}
					>
						{#if isCompact}
							{@render strokeIcon(NAV_ICON_PATHS[item.icon], 'h-5 w-5')}
						{:else}
							{item.label()}
						{/if}
					</a>
				</li>
			{/each}
			<li class="opacity-0 motion-reduce:opacity-100">
				<ResumeDownloadButton />
			</li>
		</ul>
	</nav>
{/snippet}

<header
	id="header"
	class="relative z-20"
	style:height={headerHeight}
	style:transition={HEADER_TRANSITION}
>
	<div
		class="mx-auto grid h-full w-full max-w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 md:max-w-4xl lg:max-w-7xl"
	>
		<div class="min-w-0 justify-self-start">
			{@render (left ?? siteLogo)()}
		</div>
		<div class="justify-self-center">
			{@render center?.()}
		</div>
		<div class="flex min-w-0 items-center justify-self-end gap-2">
			{@render (right ?? siteNav)()}
			<HeaderMenu />
		</div>
	</div>
</header>
