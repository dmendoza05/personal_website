<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import LineChart from '$lib/components/analytics/LineChart.svelte';
	import { dashboardSearchParams, type ChartRange, type DashboardResponse } from '$lib/dashboard';
	import CountUp from './CountUp.svelte';
	import { PANEL_COUNT_MS, prefersReducedMotion, type PanelPhase } from './panel-motion';
	import RangeButtons from './RangeButtons.svelte';

	type LoadStatus = 'loading' | 'ready' | 'error';

	let { phase = 'content' }: { phase?: PanelPhase } = $props();

	let range = $state<ChartRange>('week');
	let status = $state<LoadStatus>('loading');
	let errorMessage = $state('');
	let data = $state<DashboardResponse | null>(null);
	let chartOn = $state(false);

	onMount(() => {
		void load(range);
	});

	const timeseries = $derived(data?.timeseries ?? []);
	const total = $derived(
		data?.range.uniqueVisitors ?? timeseries.reduce((sum, point) => sum + point.uniqueVisitors, 0)
	);
	const showBody = $derived(phase === 'content');

	$effect(() => {
		if (chartOn || !showBody || !data || timeseries.length === 0) return;

		const timer = setTimeout(
			() => {
				chartOn = true;
			},
			prefersReducedMotion() ? 0 : PANEL_COUNT_MS
		);

		return () => clearTimeout(timer);
	});

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
	<p
		class="panel-label text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani {phase ===
		'shell'
			? ''
			: 'is-in'}"
	>
		{m.dashboard_stat_unique_visitors()}
	</p>
	<p
		class="panel-piece mt-1 text-2xl font-bold tracking-tight text-foreground orbitron {showBody
			? 'is-in'
			: ''}"
	>
		{#if data}
			<CountUp value={total} active={showBody} />
		{:else}
			—
		{/if}
	</p>

	<div class="mt-3 h-28 min-h-0 sm:h-32">
		{#if status === 'error'}
			<p class="panel-piece text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
				{errorMessage}
			</p>
			<button
				type="button"
				class="panel-piece mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent rajdhani {showBody
					? 'is-in'
					: ''}"
				style:--piece="1"
				onclick={() => load(range)}
			>
				{m.dashboard_retry()}
			</button>
		{:else if !data}
			<p class="panel-piece text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
				{m.dashboard_loading()}
			</p>
		{:else if timeseries.length === 0}
			<p class="panel-piece text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
				{m.dashboard_empty()}
			</p>
		{:else if chartOn}
			<div class="panel-piece is-in h-full {status === 'loading' ? 'opacity-60' : ''}">
				<LineChart
					labels={timeseries.map((point) => point.date)}
					values={timeseries.map((point) => point.uniqueVisitors)}
					valueLabel={m.dashboard_stat_unique_visitors()}
				/>
			</div>
		{/if}
	</div>

	<div class="mt-3">
		<RangeButtons
			{range}
			compact
			animateIn={showBody}
			enterDelay={PANEL_COUNT_MS + 280}
			onRangeChange={load}
		/>
	</div>
</div>
