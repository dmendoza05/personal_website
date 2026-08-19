<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { formatDashboardNumber, truncateMiddle, type DashboardTopPage } from '$lib/dashboard';
	import HudModule from './HudModule.svelte';

	let {
		pages,
		loading = false,
		errorMessage = '',
		onRetry
	}: {
		pages: DashboardTopPage[];
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
	} = $props();

	const maxViews = $derived(Math.max(0, ...pages.map((page) => page.views)));
</script>

<HudModule {loading} {errorMessage} {onRetry}>
	<p class="flex h-12 shrink-0 items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
		{m.dashboard_top_pages()}
	</p>
	<div class="min-h-0 flex-1 overflow-hidden">
		{#if pages.length === 0}
			<p class="text-2xl font-bold tracking-tight text-foreground orbitron">0</p>
		{:else}
			<ul class="flex h-full flex-col justify-between gap-1">
				{#each pages as page (page.path)}
					<li class="min-w-0">
						<div class="flex items-baseline justify-between gap-2">
							<p class="truncate text-xs text-foreground rajdhani" title={page.path}>
								{truncateMiddle(page.path)}
							</p>
							<p class="shrink-0 text-xs text-muted orbitron">{formatDashboardNumber(page.views)}</p>
						</div>
						<div class="mt-1 h-1 w-full bg-accent/40">
							<div
								class="h-full bg-accent"
								style:width="{maxViews > 0 ? (page.views / maxViews) * 100 : 0}%"
							></div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</HudModule>
