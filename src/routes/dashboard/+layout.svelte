<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Header from '$lib/components/header/Header.svelte';
	import ResumeDownloadButton from '$lib/components/header/ResumeDownloadButton.svelte';
	import MainContent from '$lib/components/MainContent.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { children } = $props();

	const hudControl =
		'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors bartle';

	const dashboardActive = $derived(page.url.pathname.startsWith('/dashboard'));
</script>

<Header>
	{#snippet left()}
		<a
			href={resolve('/')}
			class="{hudControl} text-muted hover:border-accent hover:text-accent hover:bg-accent/25"
			aria-label={m.nav_home()}
		>
			<svg
				class="h-4 w-4 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			<span class="hidden sm:inline">{m.nav_home()}</span>
		</a>
	{/snippet}
	{#snippet center()}
		<nav aria-label={m.dashboard_title()}>
			<a
				href={resolve('/dashboard')}
				class="{hudControl} {dashboardActive
					? 'text-accent'
					: 'text-muted hover:border-accent hover:text-accent'}"
				aria-current={dashboardActive ? 'page' : undefined}
			>
				{m.dashboard_title()}
			</a>
		</nav>
	{/snippet}
	{#snippet right()}
		<ResumeDownloadButton />
	{/snippet}
</Header>

<MainContent>
	{@render children()}
</MainContent>
