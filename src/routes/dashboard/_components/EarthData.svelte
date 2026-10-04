<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import {
		formatDashboardNumber,
		type DashboardCountry,
		type DashboardResponse
	} from '$lib/dashboard';
	import { countryLookupKey, findCountryStats } from './earth-countries';
	import EarthGlobe from './EarthGlobe.svelte';

	type LoadStatus = 'loading' | 'ready' | 'error';

	let hovered = $state('');
	let countries = $state<DashboardCountry[]>([]);
	let status = $state<LoadStatus>('loading');
	let errorMessage = $state('');
	let listEl = $state<HTMLDivElement>();

	onMount(() => {
		void load();
	});

	const hoveredKey = $derived(countryLookupKey(hovered));
	const active = $derived(hovered ? findCountryStats(countries, hovered) : null);

	$effect(() => {
		if (!hoveredKey || !listEl) return;
		listEl.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
	});

	function setCountry(name: string) {
		hovered = name;
	}

	function isActive(entry: DashboardCountry): boolean {
		return hoveredKey !== '' && countryLookupKey(entry.country) === hoveredKey;
	}

	async function load() {
		status = 'loading';
		errorMessage = '';

		try {
			const response = await fetch('/api/dashboard?range=7d');
			const payload = (await response.json()) as DashboardResponse | { error?: string };

			if (!response.ok) {
				throw new Error('error' in payload && payload.error ? payload.error : m.dashboard_error());
			}

			countries = (payload as DashboardResponse).countries.map((entry) => ({
				country: entry.country,
				requests: entry.requests,
				pageViews: entry.pageViews ?? 0
			}));
			status = 'ready';
		} catch (error) {
			status = 'error';
			errorMessage = error instanceof Error ? error.message : m.dashboard_error();
		}
	}
</script>

<div class="relative h-full w-full">
	<EarthGlobe onCountry={setCountry} />

	<section
		class="absolute right-4 bottom-4 left-4 z-10 flex max-h-[min(42vh,22rem)] flex-col overflow-hidden border border-border bg-card/95 text-foreground backdrop-blur-sm md:top-4 md:right-4 md:bottom-auto md:left-auto md:w-88 md:max-h-[calc(100%-2rem)]"
		aria-label={m.dashboard_chart_countries()}
	>
		<p class="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
			{m.dashboard_chart_countries()}
		</p>

		{#if hovered}
			<div class="border-b border-border px-3 py-3">
				<p class="text-sm font-semibold">{hovered}</p>
				<div class="mt-2 grid grid-cols-2 gap-3">
					<div>
						<p class="text-xs uppercase tracking-[0.16em] text-muted rajdhani">
							{m.dashboard_stat_requests()}
						</p>
						<p class="text-xl font-bold orbitron">{formatDashboardNumber(active?.requests ?? 0)}</p>
					</div>
					<div>
						<p class="text-xs uppercase tracking-[0.16em] text-muted rajdhani">
							{m.dashboard_stat_pageviews()}
						</p>
						<p class="text-xl font-bold orbitron">
							{formatDashboardNumber(active?.pageViews ?? 0)}
						</p>
					</div>
				</div>
			</div>
		{/if}

		{#if status === 'loading'}
			<p class="px-3 py-4 text-xs text-muted rajdhani">{m.dashboard_loading()}</p>
		{:else if status === 'error'}
			<div class="px-3 py-4">
				<p class="text-xs text-muted rajdhani">{errorMessage}</p>
				<button
					type="button"
					class="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent rajdhani"
					onclick={load}
				>
					{m.dashboard_retry()}
				</button>
			</div>
		{:else if countries.length === 0}
			<p class="px-3 py-4 text-xs text-muted rajdhani">{m.dashboard_empty()}</p>
		{:else}
			<div class="min-h-0 flex-1 overflow-y-auto" bind:this={listEl}>
				<table class="w-full text-left text-xs">
					<thead class="sticky top-0 bg-card">
						<tr>
							<th class="px-3 py-2 font-semibold uppercase tracking-[0.16em] text-muted rajdhani">
								<span class="sr-only">{m.dashboard_chart_countries()}</span>
							</th>
							<th
								class="px-3 py-2 text-right font-semibold uppercase tracking-[0.16em] text-muted rajdhani"
							>
								{m.dashboard_stat_requests()}
							</th>
							<th
								class="px-3 py-2 text-right font-semibold uppercase tracking-[0.16em] text-muted rajdhani"
							>
								{m.dashboard_stat_pageviews()}
							</th>
						</tr>
					</thead>
					<tbody>
						{#each countries as entry (entry.country)}
							<tr
								data-active={isActive(entry) ? 'true' : undefined}
								class={isActive(entry) ? 'bg-accent/10 font-semibold' : undefined}
							>
								<td class="px-3 py-1.5">{entry.country}</td>
								<td class="px-3 py-1.5 text-right orbitron">
									{formatDashboardNumber(entry.requests)}
								</td>
								<td class="px-3 py-1.5 text-right orbitron">
									{formatDashboardNumber(entry.pageViews)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>
