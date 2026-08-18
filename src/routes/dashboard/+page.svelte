<script lang="ts">
	import '$lib/styles/dashboard-grid.css';
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import LineChart from '$lib/components/analytics/LineChart.svelte';
	import BarChart from '$lib/components/analytics/BarChart.svelte';
	import {
		dashboardSearchParams,
		formatDashboardNumber,
		formatFetchedAt,
		normalizeDevices,
		type ChartRange,
		type DashboardCountry,
		type DashboardDevice,
		type DashboardResponse,
		type DashboardTopPage
	} from '$lib/dashboard';
	import CountriesPanel from './_components/CountriesPanel.svelte';
	import DevicesBreakdown from './_components/DevicesBreakdown.svelte';
	import StatBox from './_components/StatBox.svelte';
	import TimeseriesPanel from './_components/TimeseriesPanel.svelte';
	import TopPagesList from './_components/TopPagesList.svelte';

	type LoadStatus = 'loading' | 'ready' | 'error';

	let uniquesRange = $state<ChartRange>('week');
	let visitsRange = $state<ChartRange>('week');
	let uniquesStatus = $state<LoadStatus>('loading');
	let visitsStatus = $state<LoadStatus>('loading');
	let uniquesError = $state('');
	let visitsError = $state('');
	let uniquesData = $state<DashboardResponse | null>(null);
	let visitsData = $state<DashboardResponse | null>(null);

	const breakdownSource = $derived(uniquesData ?? visitsData);
	const topPages = $derived<DashboardTopPage[]>(breakdownSource?.topPages ?? []);
	const countries = $derived<DashboardCountry[]>(breakdownSource?.countries ?? []);
	const devices = $derived<DashboardDevice[]>(
		breakdownSource?.devices?.length ? breakdownSource.devices : normalizeDevices([])
	);
	const lastUpdated = $derived(newestFetchedAt(uniquesData, visitsData));
	const lastUpdatedLabel = $derived(lastUpdated ? formatFetchedAt(lastUpdated) : '');

	const uniquesTimeseries = $derived(uniquesData?.timeseries ?? []);
	const visitsTimeseries = $derived(visitsData?.timeseries ?? []);
	const uniqueTotal = $derived(
		uniquesData?.range.uniqueVisitors ??
			uniquesTimeseries.reduce((sum, point) => sum + point.uniqueVisitors, 0)
	);
	const visitTotal = $derived(visitsData?.range.pageVisits ?? 0);
	const lifetimeUniques = $derived(
		uniquesData?.lifetimeUniqueVisitors ?? visitsData?.lifetimeUniqueVisitors ?? 0
	);

	onMount(() => {
		void loadUniques(uniquesRange);
		void loadVisits(visitsRange);
	});

	async function fetchDashboard(range: ChartRange): Promise<DashboardResponse> {
		const response = await fetch(`/api/dashboard?${dashboardSearchParams(range)}`);
		const payload = (await response.json()) as DashboardResponse | { error?: string };

		if (!response.ok) {
			throw new Error('error' in payload && payload.error ? payload.error : m.dashboard_error());
		}

		return payload as DashboardResponse;
	}

	async function loadUniques(nextRange: ChartRange) {
		uniquesRange = nextRange;
		uniquesStatus = 'loading';
		uniquesError = '';

		try {
			uniquesData = await fetchDashboard(nextRange);
			uniquesStatus = 'ready';
		} catch (error) {
			uniquesStatus = 'error';
			uniquesError = error instanceof Error ? error.message : m.dashboard_error();
		}
	}

	async function loadVisits(nextRange: ChartRange) {
		visitsRange = nextRange;
		visitsStatus = 'loading';
		visitsError = '';

		try {
			visitsData = await fetchDashboard(nextRange);
			visitsStatus = 'ready';
		} catch (error) {
			visitsStatus = 'error';
			visitsError = error instanceof Error ? error.message : m.dashboard_error();
		}
	}

	function newestFetchedAt(
		left: DashboardResponse | null,
		right: DashboardResponse | null
	): string {
		const stamps = [left?.range.fetchedAt, right?.range.fetchedAt].filter(
			(value): value is string => Boolean(value)
		);
		if (stamps.length === 0) return '';
		return stamps.reduce((latest, stamp) => (stamp > latest ? stamp : latest));
	}

	function retryBreakdowns() {
		void loadUniques(uniquesRange);
		void loadVisits(visitsRange);
	}
</script>

<svelte:head>
	<title>{m.dashboard_title()} | {site.name}</title>
	<meta name="description" content={m.dashboard_description()} />
</svelte:head>

<div class="dashboard-grid">
	{#if lastUpdatedLabel}
		<p
			class="dashboard-module col-span-12 row-span-2 flex items-center text-xs text-muted rajdhani sm:text-sm"
			style:--enter-delay="0"
		>
			{m.dashboard_last_updated({ time: lastUpdatedLabel })}
		</p>
		<div class="col-span-12 row-span-1" aria-hidden="true"></div>
	{/if}

	<div class="dashboard-module col-span-12 row-span-6 sm:col-span-4" style:--enter-delay="1">
		<StatBox label={m.dashboard_stat_lifetime_uniques()} value={formatDashboardNumber(lifetimeUniques)} />
	</div>
	<div class="dashboard-module col-span-12 row-span-6 sm:col-span-4" style:--enter-delay="2">
		<StatBox label={m.dashboard_stat_unique_visitors()} value={formatDashboardNumber(uniqueTotal)} />
	</div>
	<div class="dashboard-module col-span-12 row-span-6 sm:col-span-4" style:--enter-delay="3">
		<StatBox label={m.dashboard_stat_page_visits()} value={formatDashboardNumber(visitTotal)} />
	</div>

	<div class="col-span-12 row-span-1" aria-hidden="true"></div>

	<div
		class="dashboard-module col-span-12 row-span-25 sm:row-span-22 md:col-span-6"
		style:--enter-delay="4"
	>
		<TimeseriesPanel
			title={m.dashboard_stat_unique_visitors()}
			range={uniquesRange}
			loading={uniquesStatus === 'loading'}
			errorMessage={uniquesStatus === 'error' ? uniquesError : ''}
			onRangeChange={loadUniques}
			onRetry={() => loadUniques(uniquesRange)}
		>
			<BarChart
				labels={uniquesTimeseries.map((point) => point.date)}
				values={uniquesTimeseries.map((point) => point.uniqueVisitors)}
				valueLabel={m.dashboard_stat_unique_visitors()}
			/>
		</TimeseriesPanel>
	</div>

	<div
		class="dashboard-module col-span-12 row-span-25 sm:row-span-22 md:col-span-6"
		style:--enter-delay="5"
	>
		<TimeseriesPanel
			title={m.dashboard_stat_page_visits()}
			range={visitsRange}
			loading={visitsStatus === 'loading'}
			errorMessage={visitsStatus === 'error' ? visitsError : ''}
			onRangeChange={loadVisits}
			onRetry={() => loadVisits(visitsRange)}
		>
			<LineChart
				labels={visitsTimeseries.map((point) => point.date)}
				values={visitsTimeseries.map((point) => point.pageVisits)}
				valueLabel={m.dashboard_stat_page_visits()}
			/>
		</TimeseriesPanel>
	</div>

	<div class="col-span-12 row-span-1" aria-hidden="true"></div>

	<div
		class="dashboard-module col-span-12 row-span-14 md:col-span-6 lg:col-span-4"
		style:--enter-delay="6"
	>
		<TopPagesList
			pages={topPages}
			loading={uniquesStatus === 'loading' && visitsStatus === 'loading'}
			errorMessage={uniquesStatus === 'error' && visitsStatus === 'error' ? uniquesError : ''}
			onRetry={retryBreakdowns}
		/>
	</div>
	<div
		class="dashboard-module col-span-12 row-span-14 md:col-span-6 lg:col-span-4"
		style:--enter-delay="7"
	>
		<CountriesPanel
			{countries}
			loading={uniquesStatus === 'loading' && visitsStatus === 'loading'}
			errorMessage={uniquesStatus === 'error' && visitsStatus === 'error' ? uniquesError : ''}
			onRetry={retryBreakdowns}
		/>
	</div>
	<div class="dashboard-module col-span-12 row-span-14 lg:col-span-4" style:--enter-delay="8">
		<DevicesBreakdown
			{devices}
			loading={uniquesStatus === 'loading' && visitsStatus === 'loading'}
			errorMessage={uniquesStatus === 'error' && visitsStatus === 'error' ? uniquesError : ''}
			onRetry={retryBreakdowns}
		/>
	</div>
</div>
