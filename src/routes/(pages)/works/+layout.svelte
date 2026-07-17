<script lang="ts">
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import SectionHeading from '$lib/components/SectionHeading.svelte';

	let { children } = $props();

	const tabs: { href: Pathname; label: () => string }[] = [
		{ href: '/works', label: () => m.works_tab_projects() }
	];

	function isActive(href: Pathname) {
		const path = page.url.pathname;
		if (href === '/works') return path === '/works';
		return path === href || path.startsWith(`${href}/`);
	}
</script>

<SectionHeading title={m.works_title()} description={m.works_description()} />

<div class="mb-6 sm:mb-8">
	<div
		role="tablist"
		aria-label={m.works_title()}
		class="flex gap-1 border-b border-border"
	>
		{#each tabs as tab (tab.href)}
			{@const active = isActive(tab.href)}
			<a
				href={resolve(tab.href)}
				role="tab"
				aria-selected={active}
				class="relative -mb-px px-3 py-2 text-sm font-medium transition-colors {active
					? 'border-b-2 border-accent text-accent'
					: 'border-b-2 border-transparent text-muted hover:text-foreground'}"
			>
				{tab.label()}
			</a>
		{/each}
	</div>
</div>

{@render children()}
