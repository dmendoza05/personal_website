<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import LineChart from '$lib/components/analytics/LineChart.svelte';
	import {
		dashboardSearchParams,
		formatDashboardNumber,
		type ChartRange,
		type DashboardResponse
	} from '$lib/dashboard';
	import RangeButtons from './RangeButtons.svelte';

	type LoadStatus = 'loading' | 'ready' | 'error';

	let range = $state<ChartRange>('week');
	let status = $state<LoadStatus>('loading');
	let errorMessage = $state('');
	let data = $state<DashboardResponse | null>(null);

	onMount(() => {
		void load(range);
	});

	const timeseries = $derived(data?.timeseries ?? []);
	const total = $derived(
		data?.range.uniqueVisitors ??
			timeseries.reduce((sum, point) => sum + point.uniqueVisitors, 0)
	);

	async function load(nextRange: ChartRange) {
		range = nextRange;
		status = 'loading';
		errorMessage = '';

		try {
			const response = await fetch(`/api/dashboard?${dashboardSearchParams(nextRange)}`);
			const payload = (await response.json()) as DashboardResponse | { error?: string };

			if (!response.ok) {
				throw new Error('error' in payload && payload.error ? payload.error : m.dashboard_error());
			}

			data = payload as DashboardResponse;
			status = 'ready';
		} catch (error) {
			status = 'error';
			errorMessage = error instanceof Error ? error.message : m.dashboard_error();
		}
	}
</script>

<div class="flex flex-col p-3">
	<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
		{m.dashboard_stat_unique_visitors()}
	</p>
	<p class="mt-1 text-2xl font-bold tracking-tight text-foreground orbitron">
		{data ? formatDashboardNumber(total) : '—'}
	</p>

	<div class="mt-3 h-28 min-h-0 sm:h-32">
		{#if status === 'error'}
			<p class="text-xs text-muted rajdhani">{errorMessage}</p>
			<button
				type="button"
				class="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent rajdhani"
				onclick={() => load(range)}
			>
				{m.dashboard_retry()}
			</button>
		{:else if !data}
			<p class="text-xs text-muted rajdhani">{m.dashboard_loading()}</p>
		{:else if timeseries.length === 0}
			<p class="text-xs text-muted rajdhani">{m.dashboard_empty()}</p>
		{:else}
			<div class="h-full {status === 'loading' ? 'opacity-60' : ''}">
				<LineChart
					labels={timeseries.map((point) => point.date)}
					values={timeseries.map((point) => point.uniqueVisitors)}
					valueLabel={m.dashboard_stat_unique_visitors()}
				/>
			</div>
		{/if}
	</div>

	<div class="mt-3">
		<RangeButtons {range} compact onRangeChange={load} />
	</div>
</div>
