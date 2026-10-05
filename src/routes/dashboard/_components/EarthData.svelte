<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { type DashboardCountry, type DashboardResponse } from '$lib/dashboard';
	import EarthGlobe from '$lib/components/earth/EarthGlobe.svelte';
	import { loadCountries } from '$lib/components/earth/vector-earth';
	import { countryLookupKey } from './earth-countries';
	import CountriesPanel from './CountriesPanel.svelte';
	import GlobeControls from './GlobeControls.svelte';

	type LoadStatus = 'loading' | 'ready' | 'error';

	let spinning = $state(true);
	let size = $state(1 / 1.2);
	let globeHovered = $state(false);
	let hovered = $state('');
	let selected = $state('');
	let focusName = $state('');
	let focusRequest = $state(0);
	let countries = $state<DashboardCountry[]>([]);
	let status = $state<LoadStatus>('loading');
	let errorMessage = $state('');

	onMount(() => {
		void load();
	});

	const activeName = $derived(hovered || selected);

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
	<div
		class="absolute inset-0"
		role="group"
		onpointerenter={showControls}
		onpointerleave={hideControls}
	>
		<EarthGlobe bind:spinning bind:size {focusName} {focusRequest} onCountry={setCountry} />
		{#if globeHovered}
			<GlobeControls bind:spinning bind:size />
		{/if}
	</div>

	<section
		class="absolute right-4 bottom-4 left-4 z-10 flex max-h-[min(42vh,22rem)] flex-col overflow-hidden border border-border bg-card/95 text-foreground backdrop-blur-sm md:top-4 md:right-4 md:bottom-auto md:left-auto md:w-88 md:max-h-[calc(100%-2rem)]"
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
