<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { formatDashboardNumber } from '$lib/dashboard';

	let {
		value = null,
		loading = false,
		errorMessage = '',
		onRetry
	}: {
		value?: number | null;
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
	} = $props();

	const TICK_MS = 700;

	let displayed = $state(0);

	$effect(() => {
		if (loading || errorMessage) return;

		const target = Math.max(0, Math.round(value ?? 0));
		if (prefersReducedMotion() || target === 0) {
			displayed = target;
			return;
		}

		displayed = 0;
		const start = performance.now();
		let frame = 0;

		const step = (now: number) => {
			const progress = Math.min((now - start) / TICK_MS, 1);
			displayed = Math.round(target * progress);
			if (progress < 1) frame = requestAnimationFrame(step);
		};

		frame = requestAnimationFrame(step);

		return () => cancelAnimationFrame(frame);
	});

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}
</script>

<div class="p-3">
	<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
		{m.dashboard_stat_all_time_uniques()}
	</p>
	{#if errorMessage}
		<p class="mt-2 text-xs text-muted rajdhani">{errorMessage}</p>
		{#if onRetry}
			<button
				type="button"
				class="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent rajdhani"
				onclick={onRetry}
			>
				{m.dashboard_retry()}
			</button>
		{/if}
	{:else}
		<p class="mt-1 text-2xl font-bold tracking-tight text-foreground orbitron">
			{loading ? '—' : formatDashboardNumber(displayed)}
		</p>
	{/if}
</div>
