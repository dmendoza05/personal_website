<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { type DashboardDevice, type DeviceKey } from '$lib/dashboard';
	import CountUp from './CountUp.svelte';
	import type { PanelPhase } from './panel-motion';

	let {
		devices,
		loading = false,
		errorMessage = '',
		onRetry,
		phase = 'content'
	}: {
		devices: DashboardDevice[];
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
		phase?: PanelPhase;
	} = $props();

	const ranked = $derived(
		[...devices].sort(
			(left, right) => right.requests - left.requests || left.device.localeCompare(right.device)
		)
	);
	const total = $derived(devices.reduce((sum, entry) => sum + entry.requests, 0));
	const showBody = $derived(phase === 'content');

	function deviceLabel(device: DeviceKey): string {
		if (device === 'desktop') return m.dashboard_device_desktop();
		if (device === 'mobile') return m.dashboard_device_mobile();
		return m.dashboard_device_other();
	}

	function meterStyle(device: DeviceKey): string {
		if (device === 'desktop') return 'var(--accent)';
		if (device === 'mobile') return 'color-mix(in srgb, var(--accent) 55%, var(--fg))';
		return 'var(--muted)';
	}

	function share(requests: number): number {
		if (total <= 0) return 0;
		return (requests / total) * 100;
	}
</script>

<div class="p-3">
	<p
		class="panel-label text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani {phase ===
		'shell'
			? ''
			: 'is-in'}"
	>
		{m.dashboard_chart_most_used_devices()}
	</p>

	{#if loading}
		<p class="panel-piece mt-3 text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
			{m.dashboard_loading()}
		</p>
	{:else if errorMessage}
		<p class="panel-piece mt-3 text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
			{errorMessage}
		</p>
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
	{:else if ranked.length === 0 || total === 0}
		<p class="panel-piece mt-3 text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
			{m.dashboard_empty()}
		</p>
	{:else}
		<ul class="mt-3 flex flex-col gap-3">
			{#each ranked as entry, index (entry.device)}
				<li class="panel-piece {showBody ? 'is-in' : ''}" style:--piece={index}>
					<div class="flex items-baseline justify-between gap-2">
						<p class="text-xs uppercase tracking-[0.2em] text-muted rajdhani">
							{deviceLabel(entry.device)}
						</p>
						<p class="text-xs text-foreground orbitron">
							<CountUp value={entry.requests} active={showBody} />
							<span class="ml-2 text-muted">{Math.round(share(entry.requests))}%</span>
						</p>
					</div>
					<div
						class="mt-1 h-2 w-full bg-foreground/10"
						role="meter"
						aria-label={deviceLabel(entry.device)}
						aria-valuemin={0}
						aria-valuemax={total}
						aria-valuenow={entry.requests}
					>
						<div
							class="panel-meter h-full {showBody ? 'is-in' : ''}"
							style:--piece={index}
							style:width="{share(entry.requests)}%"
							style:background-color={meterStyle(entry.device)}
						></div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
