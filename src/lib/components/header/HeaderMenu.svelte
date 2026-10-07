<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';

	type MenuLink = {
		href: Pathname;
		label: () => string;
	};

	const navigation: MenuLink[] = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/works', label: () => m.nav_works() }
	];

	const data: MenuLink[] = [{ href: '/dashboard', label: () => m.dashboard_title() }];

	let open = $state(false);
	let root: HTMLDivElement | undefined = $state();

	function isCurrent(href: Pathname) {
		const current = page.url.pathname.replace(/\/$/, '') || '/';
		const target = resolve(href).replace(/\/$/, '') || '/';

		if (target === '/' || /^\/[a-z]{2}$/.test(target)) return current === target;

		return current === target || current.startsWith(`${target}/`);
	}

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	function onPointerDown(event: PointerEvent) {
		if (!root?.contains(event.target as Node)) open = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false;
	}
</script>

<svelte:window onpointerdown={onPointerDown} onkeydown={onKeydown} />

<div bind:this={root} class="relative">
	<button
		type="button"
		class="inline-flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-accent"
		aria-label={open ? m.menu_close() : m.menu_open()}
		aria-expanded={open}
		aria-haspopup="menu"
		aria-controls="header-menu"
		onclick={toggle}
	>
		<svg
			class="h-5 w-5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			{#if open}
				<path stroke-linecap="round" d="M6 6l12 12M6 18L18 6" />
			{:else}
				<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
			{/if}
		</svg>
	</button>

	{#if open}
		<div
			id="header-menu"
			role="menu"
			class="absolute right-0 z-30 mt-2 min-w-44 border border-border bg-card/95 py-2 backdrop-blur-sm"
		>
			<div role="group" aria-labelledby="header-menu-navigation">
				<p id="header-menu-navigation" class="px-3 pb-1 text-xs text-muted">
					{m.menu_navigation()}
				</p>
				<ul>
					{#each navigation as item (item.href)}
						<li>
							<a
								href={resolve(item.href)}
								role="menuitem"
								class="block py-1.5 pr-3 pl-6 text-sm rajdhani {isCurrent(item.href)
									? 'text-accent'
									: 'text-muted hover:text-foreground'}"
								aria-current={isCurrent(item.href) ? 'page' : undefined}
								onclick={close}
							>
								{item.label()}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<hr class="my-2 border-border" />

			<div role="group" aria-labelledby="header-menu-data">
				<p id="header-menu-data" class="px-3 pb-1 text-xs text-muted">{m.menu_data()}</p>
				<ul>
					{#each data as item (item.href)}
						<li>
							<a
								href={resolve(item.href)}
								role="menuitem"
								class="block py-1.5 pr-3 pl-6 text-sm rajdhani {isCurrent(item.href)
									? 'text-accent'
									: 'text-muted hover:text-foreground'}"
								aria-current={isCurrent(item.href) ? 'page' : undefined}
								onclick={close}
							>
								{item.label()}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>
