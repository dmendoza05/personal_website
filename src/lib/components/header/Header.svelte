<script lang="ts">
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import Logo from '$lib/components/Logo.svelte';
	import HeaderShape from './HeaderShape.svelte';
	import type { HeaderShapeMode } from './HeaderShape.svelte';
	import { headerOffsetForState } from './header-height';
	import { getExpandedHeaderHeight } from './header-expanded-height.svelte';
	import {
		HEADER_EXPANDED_MARGIN_PX,
		HEADER_LOGO_HEIGHT,
		HEADER_TRANSITION,
		HEADER_TRANSITION_MS,
		resolveHeaderState,
		SM_VIEWPORT_QUERY
	} from './header-state';
	import { m } from '$lib/paraglide/messages.js';

	type NavIcon = 'works' | 'about' | 'blog';

	const navItems: { href: Pathname; label: () => string; icon: NavIcon }[] = [
		{ href: '/works', label: () => m.nav_works(), icon: 'works' },
		{ href: '/about', label: () => m.nav_about(), icon: 'about' },
		{ href: '/blog', label: () => m.nav_blog(), icon: 'blog' }
	];

	let shapeRevealed = $state(false);
	let isSmViewport = $state(false);
	let logoReady = $state(false);
	let logo: Logo;
	let navList: HTMLUListElement | undefined = $state();
	let headerContent: HTMLDivElement | undefined = $state();

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
	const isCompact = $derived(headerState === 'compact');
	const logoHeight = $derived(HEADER_LOGO_HEIGHT[headerState]);
	const headerOffset = $derived(
		headerOffsetForState(headerState, getExpandedHeaderHeight())
	);
	const shapeMode = $derived.by((): HeaderShapeMode => {
		if (!shapeRevealed || headerState === 'expanded') return 'expanded';
		if (headerState === 'compact') return 'rect';
		return 'nav';
	});
	const contentPadding = $derived(
		headerState === 'expanded' ? `${HEADER_EXPANDED_MARGIN_PX}px` : isCompact ? '0' : '1rem 0'
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
			duration: HEADER_TRANSITION_MS,
			ease: 'outCubic'
		});
	}
</script>

<HeaderShape
	mode={shapeMode}
	content={headerContent}
	height={headerOffset}
	transitionMs={HEADER_TRANSITION_MS}
>
	<div
		bind:this={headerContent}
		class="relative mx-auto flex w-full max-w-full px-4 sm:px-6 md:max-w-4xl lg:max-w-7xl {isCompact
			? 'flex-row items-center justify-between'
			: 'flex-col items-center justify-center'}"
		style:height={headerOffset}
		style:padding={contentPadding}
		style:gap={isCompact ? '0.75rem' : '1.5rem'}
		style:transition="{HEADER_TRANSITION}, padding {HEADER_TRANSITION_MS}ms"
	>
		<a
			href={resolve('/')}
			aria-label="Home"
			class="inline-block shrink-0 ml-8 md:ml-0"
			style:height="{logoHeight}px"
			style:transition={HEADER_TRANSITION}
		>
			<Logo
				bind:this={logo}
				initial="initials"
				duration={HEADER_TRANSITION_MS}
				class="h-full w-auto text-white"
				oncomplete={onLogoComplete}
			/>
		</a>

		<nav id="site-nav" class={isCompact ? 'shrink-0' : 'w-full'}>
			<ul
				bind:this={navList}
				class="flex items-center bartle {isCompact
					? 'flex-row justify-end gap-0.5'
					: 'flex-col gap-1 md:flex-row md:justify-center md:gap-1 lg:gap-2'}"
			>
				{#each navItems as item (item.href)}
					<li class="opacity-0 motion-reduce:opacity-100">
						<a
							href={resolve(item.href)}
							class="inline-flex items-center justify-center rounded-md transition-colors {isCompact
								? 'h-10 w-10'
								: 'px-3 py-2.5 text-sm font-medium md:py-1.5'} {isActive(item.href)
								? 'bg-accent/10 text-accent'
								: 'text-muted hover:bg-card hover:text-foreground md:hover:bg-transparent'}"
							aria-label={isCompact ? item.label() : undefined}
						>
							{#if isCompact}
								<svg
									class="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									{#if item.icon === 'works'}
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
										/>
									{:else if item.icon === 'about'}
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									{:else}
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									{/if}
								</svg>
							{:else}
								{item.label()}
							{/if}
						</a>
					</li>
				{/each}
				<li class="opacity-0 motion-reduce:opacity-100">
					<a
						href="/resume.pdf"
						download="Daniel_Mendoza_Resume.pdf"
						class="inline-flex items-center justify-center rounded-md transition-colors {isCompact
							? 'h-10 w-10'
							: 'gap-1.5 px-3 py-2.5 text-sm font-medium md:py-1.5'} text-muted hover:bg-card hover:text-foreground md:hover:bg-transparent"
						aria-label={isCompact ? m.resume_title() : undefined}
					>
						{#if isCompact}
							<svg
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
								/>
							</svg>
						{:else}
							{m.resume_title()}
							<svg
								class="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
								/>
							</svg>
						{/if}
					</a>
				</li>
			</ul>
		</nav>
	</div>
</HeaderShape>
