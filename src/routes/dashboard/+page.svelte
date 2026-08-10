<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import Page from '$lib/components/page/Page.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Card from '$lib/components/card/Card.svelte';
	import TimeseriesChart from '$lib/components/analytics/TimeseriesChart.svelte';
	import CountriesChart from '$lib/components/analytics/CountriesChart.svelte';
	import type { AnalyticsRange, AnalyticsResponse } from '$lib/analytics';

	type LoadStatus = 'loading' | 'ready' | 'error';

	let range = $state<AnalyticsRange>('7d');
	let status = $state<LoadStatus>('loading');
	let errorMessage = $state('');
	let data = $state<AnalyticsResponse | null>(null);

	onMount(() => {
		void loadAnalytics(range);
	});

	const stats = $derived(
		data
			? [
					{ label: m.dashboard_stat_pageviews(), value: formatNumber(data.totals.pageViews) },
					{ label: m.dashboard_stat_visitors(), value: formatNumber(data.totals.visitors) },
					{ label: m.dashboard_stat_requests(), value: formatNumber(data.totals.requests) },
					{ label: m.dashboard_stat_bandwidth(), value: formatBandwidth(data.totals.bandwidthBytes) },
					{ label: m.dashboard_stat_threats(), value: formatNumber(data.totals.threats) }
				]
			: []
	);

	async function loadAnalytics(nextRange: AnalyticsRange) {
		range = nextRange;
		status = 'loading';
		errorMessage = '';

		try {
			const response = await fetch(`/api/analytics?range=${nextRange}`);
			const payload = (await response.json()) as AnalyticsResponse | { error?: string };

			if (!response.ok) {
				throw new Error(
					'error' in payload && payload.error ? payload.error : m.dashboard_error()
				);
			}

			data = payload as AnalyticsResponse;
			status = 'ready';
		} catch (error) {
			data = null;
			status = 'error';
			errorMessage = error instanceof Error ? error.message : m.dashboard_error();
		}
	}

	function formatNumber(value: number): string {
		return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
	}

	function formatBandwidth(bytes: number): string {
		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex += 1;
		}

		return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: size >= 10 ? 0 : 1 }).format(size)} ${units[unitIndex]}`;
	}
</script>

<svelte:head>
	<title>{m.dashboard_title()} | {site.name}</title>
	<meta name="description" content={m.dashboard_description()} />
</svelte:head>

<Page>
	<SectionHeading id="dashboard" title={m.dashboard_title()} description={m.dashboard_description()} />

	<div class="mb-6 flex flex-wrap items-center gap-2 sm:mb-8">
		<button
			type="button"
			class="rounded-sm border border-border px-3 py-1.5 text-sm uppercase tracking-wide transition-colors rajdhani {range === '7d'
				? 'border-accent bg-accent text-accent-foreground'
				: 'bg-card text-muted hover:text-foreground'}"
			aria-pressed={range === '7d'}
			onclick={() => void loadAnalytics('7d')}
		>
			{m.dashboard_range_7d()}
		</button>
		<button
			type="button"
			class="rounded-sm border border-border px-3 py-1.5 text-sm uppercase tracking-wide transition-colors rajdhani {range === '30d'
				? 'border-accent bg-accent text-accent-foreground'
				: 'bg-card text-muted hover:text-foreground'}"
			aria-pressed={range === '30d'}
			onclick={() => void loadAnalytics('30d')}
		>
			{m.dashboard_range_30d()}
		</button>
	</div>

	{#if status === 'loading'}
		<p class="text-muted rajdhani">{m.dashboard_loading()}</p>
	{:else if status === 'error'}
		<div class="border border-border bg-card px-4 py-3 text-sm text-foreground rajdhani" role="alert">
			<p>{errorMessage}</p>
			<button
				type="button"
				class="mt-3 text-accent underline-offset-2 hover:underline"
				onclick={() => void loadAnalytics(range)}
			>
				{m.dashboard_retry()}
			</button>
		</div>
	{:else if data}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
			{#each stats as stat (stat.label)}
				<Card>
					<p class="text-xs uppercase tracking-[0.2em] text-muted rajdhani">{stat.label}</p>
					<p class="mt-2 text-2xl font-bold tracking-tight text-foreground orbitron sm:text-3xl">
						{stat.value}
					</p>
				</Card>
			{/each}
		</div>

		<div class="mt-6 grid gap-6 lg:grid-cols-5">
			<section class="lg:col-span-3">
				<Card>
					<h2 class="mb-4 text-lg font-bold uppercase tracking-wide orbitron">
						{m.dashboard_chart_traffic()}
					</h2>
					{#if data.timeseries.length === 0}
						<p class="text-sm text-muted rajdhani">{m.dashboard_empty()}</p>
					{:else}
						<TimeseriesChart
							points={data.timeseries}
							pageViewsLabel={m.dashboard_stat_pageviews()}
							requestsLabel={m.dashboard_stat_requests()}
						/>
					{/if}
				</Card>
			</section>

			<section class="lg:col-span-2">
				<Card>
					<h2 class="mb-4 text-lg font-bold uppercase tracking-wide orbitron">
						{m.dashboard_chart_countries()}
					</h2>
					{#if data.topCountries.length === 0}
						<p class="text-sm text-muted rajdhani">{m.dashboard_empty()}</p>
					{:else}
						<CountriesChart
							countries={data.topCountries}
							requestsLabel={m.dashboard_stat_requests()}
						/>
					{/if}
				</Card>
			</section>
		</div>
	{/if}
</Page>
