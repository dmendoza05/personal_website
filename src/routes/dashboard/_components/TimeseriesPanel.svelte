<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ChartRange } from '$lib/dashboard';
	import HudModule from './HudModule.svelte';
	import RangeButtons from './RangeButtons.svelte';

	let {
		title,
		range,
		loading = false,
		errorMessage = '',
		onRangeChange,
		onRetry,
		children
	}: {
		title: string;
		range: ChartRange;
		loading?: boolean;
		errorMessage?: string;
		onRangeChange: (range: ChartRange) => void;
		onRetry: () => void;
		children: Snippet;
	} = $props();
</script>

<HudModule {loading} {errorMessage} {onRetry}>
	<p class="flex h-12 shrink-0 items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
		{title}
	</p>
	<RangeButtons {range} {onRangeChange} />
	<div class="min-h-0 flex-1 pt-2">
		{@render children()}
	</div>
</HudModule>
