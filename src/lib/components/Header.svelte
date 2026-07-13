<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';

	const navItems: { href: Pathname; label: () => string }[] = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/projects', label: () => m.nav_projects() },
		{ href: '/resume', label: () => m.nav_resume() },
		{ href: '/blog', label: () => m.nav_blog() }
	];

	let menuOpen = $state(false);

	afterNavigate(() => {
		menuOpen = false;
	});

	function isActive(href: Pathname) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
</script>

<header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
	<div class="relative mx-auto flex md:max-w-4xl max-w-full lg:max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
		<a
			href={resolve('/')}
			class="shrink-0 text-base font-semibold tracking-tight text-foreground transition-colors hover:text-accent sm:text-lg"
		>
			{m.site_name()}
		</a>

		<button
			type="button"
			class="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-card md:hidden"
			aria-expanded={menuOpen}
			aria-controls="site-nav"
			onclick={toggleMenu}
		>
			<span class="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
			{#if menuOpen}
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
				</svg>
			{:else}
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
				</svg>
			{/if}
		</button>

		<nav
			id="site-nav"
			class="absolute inset-x-0 top-full border-b border-border bg-background px-4 py-3 shadow-sm md:static md:inset-auto md:flex md:border-0 md:bg-transparent md:p-0 md:shadow-none {menuOpen
				? 'block'
				: 'hidden md:block'}"
		>
			<ul class="flex flex-col gap-1 md:flex-row md:items-center md:gap-1 lg:gap-2">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={resolve(item.href)}
							class="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors md:py-1.5 {isActive(item.href)
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
