<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import Page from '$lib/components/page/Page.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import TimeseriesChart from '$lib/components/analytics/TimeseriesChart.svelte';
	import CountriesChart from '$lib/components/analytics/CountriesChart.svelte';
	import type { AnalyticsRange, AnalyticsResponse, AnalyticsTotals } from '$lib/analytics';
	import CyberBox from './_components/CyberBox.svelte';
	import StatBox from './_components/StatBox.svelte';

	type LoadStatus = 'loading' | 'ready' | 'error';

	const EMPTY_TOTALS: AnalyticsTotals = {
		requests: 0,
		pageViews: 0,
		visitors: 0,
		bandwidthBytes: 0,
		threats: 0
	};

	let range = $state<AnalyticsRange>('7d');
	let status = $state<LoadStatus>('loading');
	let errorMessage = $state('');
	let data = $state<AnalyticsResponse | null>(null);

	onMount(() => {
		void loadAnalytics(range);
	});

	const totals = $derived(data?.totals ?? EMPTY_TOTALS);
	const timeseries = $derived(data?.timeseries ?? []);
	const topCountries = $derived(data?.topCountries ?? []);

	function rangeButtonClass(targetRange: AnalyticsRange): string {
		return `w-full rounded-sm border px-3 py-2 text-sm uppercase tracking-[0.2em] transition-colors rajdhani sm:w-auto lg:w-full ${
			range === targetRange
				? 'border-accent bg-accent text-accent-foreground'
				: 'border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground'
		}`;
	}

	async function loadAnalytics(nextRange: AnalyticsRange) {
		range = nextRange;
		status = 'loading';
		errorMessage = '';

		try {
			const response = await fetch(`/api/analytics?range=${nextRange}`);
			const payload = (await response.json()) as AnalyticsResponse | { error?: string };

			if (!response.ok) {
				throw new Error('error' in payload && payload.error ? payload.error : m.dashboard_error());
			}

			data = payload as AnalyticsResponse;
			status = 'ready';
		} catch (error) {
			data = null;
			status = 'error';
			errorMessage = error instanceof Error ? error.message : m.dashboard_error();
		}
	}

	function formatNumber(value: number | null | undefined): string {
		return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value ?? 0);
	}
</script>

<svelte:head>
	<title>{m.dashboard_title()} | {site.name}</title>
	<meta name="description" content={m.dashboard_description()} />
</svelte:head>

<div class="grid gap-6 lg:grid-cols-[minmax(220px,20%)_minmax(0,1fr)] lg:items-start">
</div>
