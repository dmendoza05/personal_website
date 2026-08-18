<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { CHART_RANGES, type ChartRange } from '$lib/dashboard';

	let {
		range,
		onRangeChange
	}: {
		range: ChartRange;
		onRangeChange: (range: ChartRange) => void;
	} = $props();

	function rangeLabel(target: ChartRange): string {
		if (target === 'week') return m.dashboard_range_week();
		if (target === 'month') return m.dashboard_range_month();
		if (target === 'year') return m.dashboard_range_year();
		return m.dashboard_range_all();
	}

	function rangeButtonClass(target: ChartRange): string {
		return `h-12 w-full rounded-sm border px-2 text-center text-xs font-semibold uppercase leading-tight tracking-[0.2em] transition-colors rajdhani ${
			range === target
				? 'border-accent bg-accent text-accent-foreground'
				: 'border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground'
		}`;
	}
</script>

<div class="grid h-24 shrink-0 grid-cols-2 gap-2 sm:h-12 sm:grid-cols-4">
	{#each CHART_RANGES as targetRange (targetRange)}
		<button type="button" class={rangeButtonClass(targetRange)} onclick={() => onRangeChange(targetRange)}>
			{rangeLabel(targetRange)}
		</button>
	{/each}
</div>
