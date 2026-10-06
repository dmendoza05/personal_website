<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import {
		formatDashboardNumber,
		formatFetchedAt,
		type DashboardCountry,
		type DashboardDevice,
		type DashboardResponse
	} from '$lib/dashboard';
	import EarthGlobe from '$lib/components/earth/EarthGlobe.svelte';
	import { loadCountries } from '$lib/components/earth/vector-earth';
	import { countryAcronym, countryCode, countryFlag } from './country-codes';
	import { countryLookupKey, findCountryStats } from './earth-countries';
	import AllTimeVisitorsPanel from './AllTimeVisitorsPanel.svelte';
	import CountriesPanel from './CountriesPanel.svelte';
	import DevicesPanel from './DevicesPanel.svelte';
	import GlobeControls from './GlobeControls.svelte';
	import VisitorsPanel from './VisitorsPanel.svelte';

	type LoadStatus = 'loading' | 'ready' | 'error';

	let spinning = $state(true);
	let size = $state(1 / 1.2);
	let globeHovered = $state(false);
	let hovered = $state('');
	let selected = $state('');
	let focusName = $state('');
	let focusRequest = $state(0);
	let countries = $state<DashboardCountry[]>([]);
	let devices = $state<DashboardDevice[]>([]);
	let lifetimeUniqueVisitors = $state<number | null>(null);
	let fetchedAt = $state('');
	let status = $state<LoadStatus>('loading');
	let errorMessage = $state('');

	onMount(() => {
		void load();
	});

	const activeName = $derived(hovered || selected);
	const lastUpdatedLabel = $derived(fetchedAt ? formatFetchedAt(fetchedAt) : '');
	const hoveredFlag = $derived(hovered ? countryFlag(hovered) : '');
	const hoveredAcronym = $derived(hovered ? countryAcronym(hovered) : '');
	const hoveredStats = $derived(
		hovered ? findCountryStats(countries, hovered, countryCode(hovered)) : null
	);
	const hoverDetails = $derived(
		hoveredStats
			? [
					{
						label: m.dashboard_tab_pageviews(),
						value: formatDashboardNumber(hoveredStats.pageViews)
					},
					{
						label: m.dashboard_tab_requests(),
						value: formatDashboardNumber(hoveredStats.requests)
					}
				]
			: []
	);

	function setCountry(name: string) {
		hovered = name;
	}

	function selectCountry(name: string) {
		selected = name;
		spinning = false;
		const match = loadCountries().find(
			(country) => countryLookupKey(country.name) === countryLookupKey(name)
		);
		if (!match) return;
		focusName = match.name;
		focusRequest += 1;
	}

	function showControls() {
		globeHovered = true;
	}

	function hideControls() {
		globeHovered = false;
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

			const dashboard = payload as DashboardResponse;
			lifetimeUniqueVisitors = dashboard.lifetimeUniqueVisitors;
			fetchedAt = dashboard.range.fetchedAt;
			countries = dashboard.countries.map((entry) => ({
				country: entry.country,
				requests: entry.requests,
				pageViews: entry.pageViews ?? 0
			}));
			devices = dashboard.devices;
			status = 'ready';
		} catch (error) {
			status = 'error';
			errorMessage = error instanceof Error ? error.message : m.dashboard_error();
		}
	}
</script>

<div class="relative h-full w-full">
	<div
		class="absolute inset-0"
		role="group"
		onpointerenter={showControls}
		onpointerleave={hideControls}
	>
		<EarthGlobe
			bind:spinning
			bind:size
			{focusName}
			{focusRequest}
			details={hoverDetails}
			flag={hoveredFlag}
			acronym={hoveredAcronym}
			onCountry={setCountry}
		/>
		{#if globeHovered}
			<GlobeControls bind:spinning bind:size />
		{/if}
	</div>

	<div
		class="absolute inset-0 z-10 overflow-y-auto p-4 md:pointer-events-none md:overflow-visible md:p-0"
	>
		<div class="flex flex-col gap-3 md:contents">
			<div
				class="flex flex-col gap-3 md:pointer-events-auto md:absolute md:top-4 md:left-4 md:w-88"
			>
				<section
					class="border border-border bg-card/95 text-foreground backdrop-blur-sm"
					aria-label={m.dashboard_stat_all_time_uniques()}
				>
					<AllTimeVisitorsPanel
						value={lifetimeUniqueVisitors}
						loading={status === 'loading'}
						errorMessage={status === 'error' ? errorMessage : ''}
						onRetry={load}
					/>
				</section>

				<section
					class="border border-border bg-card/95 text-foreground backdrop-blur-sm"
					aria-label={m.dashboard_chart_uniques()}
				>
					<VisitorsPanel />
				</section>

				<section
					class="border border-border bg-card/95 text-foreground backdrop-blur-sm"
					aria-label={m.dashboard_chart_most_used_devices()}
				>
					<DevicesPanel
						{devices}
						loading={status === 'loading'}
						errorMessage={status === 'error' ? errorMessage : ''}
						onRetry={load}
					/>
				</section>
			</div>

			<section
				class="flex max-h-[min(75vh,24rem)] flex-col overflow-hidden border border-border bg-card/95 text-foreground backdrop-blur-sm md:pointer-events-auto md:absolute md:top-4 md:right-4 md:left-auto md:max-h-[calc(100%-2rem)] md:w-88"
				aria-label={m.dashboard_chart_countries()}
			>
				<CountriesPanel
					{countries}
					loading={status === 'loading'}
					errorMessage={status === 'error' ? errorMessage : ''}
					onRetry={load}
					{activeName}
					onSelect={selectCountry}
				/>
			</section>
		</div>
	</div>

	{#if lastUpdatedLabel}
		<p
			class="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-center text-xs text-muted rajdhani"
		>
			{m.dashboard_last_updated({ time: lastUpdatedLabel })}
		</p>
	{/if}
</div>
