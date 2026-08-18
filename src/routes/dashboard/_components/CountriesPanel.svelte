<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import CountriesChart from '$lib/components/analytics/CountriesChart.svelte';
	import type { DashboardCountry } from '$lib/dashboard';
	import HudModule from './HudModule.svelte';

	let {
		countries,
		loading = false,
		errorMessage = '',
		onRetry
	}: {
		countries: DashboardCountry[];
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
	} = $props();
</script>

<HudModule {loading} {errorMessage} {onRetry}>
	<p class="flex h-12 shrink-0 items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
		{m.dashboard_chart_countries()}
	</p>
	<div class="min-h-0 flex-1">
		<CountriesChart {countries} requestsLabel={m.dashboard_stat_requests()} />
	</div>
</HudModule>
