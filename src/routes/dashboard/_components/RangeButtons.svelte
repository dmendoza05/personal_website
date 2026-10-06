<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { CHART_RANGES, type ChartRange } from '$lib/dashboard';
	import { PANEL_STAGGER_MS } from './panel-motion';

	let {
		range,
		onRangeChange,
		compact = false,
		animateIn = false,
		enterDelay = 0
	}: {
		range: ChartRange;
		onRangeChange: (range: ChartRange) => void;
		compact?: boolean;
		animateIn?: boolean;
		enterDelay?: number;
	} = $props();

	function rangeLabel(target: ChartRange): string {
		if (target === 'week') return m.dashboard_range_week();
		if (target === 'month') return m.dashboard_range_month();
		if (target === 'year') return m.dashboard_range_year();
		return m.dashboard_range_all();
	}

	function rangeButtonClass(target: ChartRange): string {
		const size = compact
			? 'h-9 px-1 text-[0.65rem] tracking-[0.08em] whitespace-nowrap'
			: 'h-12 px-2 text-xs tracking-[0.2em]';

		return `w-full rounded-sm border text-center font-semibold uppercase leading-none transition-colors rajdhani ${size} ${
			range === target
				? 'border-accent bg-accent text-accent-foreground'
				: 'border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground'
		}`;
	}
</script>

<div
	class={compact
		? 'grid shrink-0 grid-cols-4 gap-1'
		: 'grid h-24 shrink-0 grid-cols-2 gap-2 sm:h-12 sm:grid-cols-4'}
>
	{#each CHART_RANGES as targetRange, index (targetRange)}
		<button
			type="button"
			class="{rangeButtonClass(targetRange)} {animateIn ? 'panel-piece is-in' : ''}"
			style:--piece-delay={animateIn ? `${enterDelay + index * PANEL_STAGGER_MS}ms` : undefined}
			onclick={() => onRangeChange(targetRange)}
		>
			{rangeLabel(targetRange)}
		</button>
	{/each}
</div>
