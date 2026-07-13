<script lang="ts">
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';

	const navItems: { href: Pathname; label: () => string }[] = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/projects', label: () => m.nav_projects() },
		{ href: '/resume', label: () => m.nav_resume() },
		{ href: '/blog', label: () => m.nav_blog() }
	];

	function isActive(href: Pathname) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<header class="border-b border-border bg-background/80 backdrop-blur-sm">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
		<a href={resolve('/')} class="text-lg font-semibold tracking-tight text-foreground hover:text-accent">
			{m.site_name()}
		</a>

		<nav class="flex items-center gap-1 sm:gap-2">
			{#each navItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors {isActive(item.href)
						? 'bg-accent/10 text-accent'
						: 'text-muted hover:text-foreground'}"
				>
					{item.label()}
				</a>
			{/each}
		</nav>
	</div>
</header>
