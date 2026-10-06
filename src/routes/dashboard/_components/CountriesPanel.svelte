<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { formatDashboardNumber, type DashboardCountry } from '$lib/dashboard';
	import CountUp from './CountUp.svelte';
	import { countryAcronym, countryFlag } from './country-codes';
	import { countryLookupKey } from './earth-countries';
	import type { PanelPhase } from './panel-motion';

	type CountryMetric = 'pageViews' | 'requests';

	let {
		countries,
		loading = false,
		errorMessage = '',
		onRetry,
		activeName = '',
		onSelect,
		phase = 'content'
	}: {
		countries: DashboardCountry[];
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
		activeName?: string;
		onSelect?: (country: string) => void;
		phase?: PanelPhase;
	} = $props();

	const METRICS: CountryMetric[] = ['pageViews', 'requests'];
	const MAX_VISIBLE_COUNTRIES = 8;
	/** Matches the `h-9` country row. */
	const COUNTRY_ROW_REM = 2.25;

	let metric = $state<CountryMetric>('pageViews');
	let listEl = $state<HTMLDivElement>();

	const activeKey = $derived(countryLookupKey(activeName));
	const showBody = $derived(phase === 'content');
	const listed = $derived(
		countries
			.filter((entry) => entry[metric] > 0)
			.sort(
				(left, right) => right[metric] - left[metric] || left.country.localeCompare(right.country)
			)
	);

	$effect(() => {
		if (!activeKey || !listEl) return;
		listEl.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
	});

	function metricLabel(target: CountryMetric): string {
		if (target === 'pageViews') return m.dashboard_tab_pageviews();
		return m.dashboard_tab_requests();
	}

	function tabClass(target: CountryMetric): string {
		return `h-9 w-full border px-2 text-xs font-semibold uppercase tracking-[0.14em] rajdhani ${
			metric === target
				? 'border-accent bg-accent text-accent-foreground'
				: 'border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground'
		}`;
	}

	function isActive(entry: DashboardCountry): boolean {
		return activeKey !== '' && countryLookupKey(entry.country) === activeKey;
	}

	function choose(entry: DashboardCountry) {
		onSelect?.(entry.country);
	}
</script>

<div class="flex flex-col">
	<p
		class="panel-label px-3 pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani {phase ===
		'shell'
			? ''
			: 'is-in'}"
	>
		{m.dashboard_chart_countries()}
	</p>

	{#if loading}
		<p class="panel-piece px-3 py-4 text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
			{m.dashboard_loading()}
		</p>
	{:else if errorMessage}
		<div class="panel-piece px-3 py-4 {showBody ? 'is-in' : ''}">
			<p class="text-xs text-muted rajdhani">{errorMessage}</p>
			{#if onRetry}
				<button
					type="button"
					class="panel-piece mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent rajdhani {showBody
						? 'is-in'
						: ''}"
					style:--piece="1"
					onclick={onRetry}
				>
					{m.dashboard_retry()}
				</button>
			{/if}
		</div>
	{:else}
		<div
			class="grid grid-cols-2 gap-2 px-3 pt-3"
			role="tablist"
			aria-label={m.dashboard_chart_countries()}
		>
			{#each METRICS as target, index (target)}
				<button
					type="button"
					role="tab"
					class="panel-piece {tabClass(target)} {showBody ? 'is-in' : ''}"
					style:--piece={index}
					aria-selected={metric === target}
					onclick={() => (metric = target)}
				>
					{metricLabel(target)}
				</button>
			{/each}
		</div>

		{#if listed.length === 0}
			<p
				class="panel-piece px-3 py-4 text-xs text-muted rajdhani {showBody ? 'is-in' : ''}"
				style:--piece="2"
			>
				{m.dashboard_empty()}
			</p>
		{:else}
			<div
				class="country-list mt-2"
				style:--country-list-max="{MAX_VISIBLE_COUNTRIES * COUNTRY_ROW_REM}rem"
				bind:this={listEl}
			>
				<ul>
					{#each listed as entry, index (entry.country)}
						{@const amount = entry[metric]}
						{@const active = isActive(entry)}
						<li class="panel-piece {showBody ? 'is-in' : ''}" style:--piece={index + 2}>
							<button
								type="button"
								data-active={active ? 'true' : undefined}
								class="flex h-9 w-full shrink-0 items-center gap-3 px-3 text-left text-xs {active
									? 'bg-accent/10 font-semibold'
									: 'hover:bg-accent/5'}"
								aria-pressed={active}
								aria-label={`${entry.country} ${formatDashboardNumber(amount)}`}
								title={entry.country}
								onclick={() => choose(entry)}
							>
								<span
									class="inline-block w-6 text-center text-base leading-none"
									aria-hidden="true"
								>
									{countryFlag(entry.country)}
								</span>
								<span class="tracking-[0.14em]">{countryAcronym(entry.country)}</span>
								<span class="ml-auto orbitron">
									<CountUp value={amount} active={showBody} />
								</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}
</div>

<style>
	.country-list {
		max-height: min(var(--country-list-max), calc(75vh - 6rem));
		overflow-y: auto;
	}
</style>
