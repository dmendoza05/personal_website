<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import {
		formatDashboardNumber,
		type DashboardDevice,
		type DeviceKey
	} from '$lib/dashboard';
	import HudModule from './HudModule.svelte';

	let {
		devices,
		loading = false,
		errorMessage = '',
		onRetry
	}: {
		devices: DashboardDevice[];
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
	} = $props();

	const total = $derived(devices.reduce((sum, entry) => sum + entry.requests, 0));

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
</script>

<HudModule {loading} {errorMessage} {onRetry}>
	<p class="flex h-12 shrink-0 items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
		{m.dashboard_chart_devices()}
	</p>
	<div class="flex min-h-0 flex-1 flex-col justify-center gap-3">
		{#each devices as entry (entry.device)}
			<div>
				<div class="flex items-baseline justify-between gap-2">
					<p class="text-xs uppercase tracking-[0.2em] text-muted rajdhani">{deviceLabel(entry.device)}</p>
					<p class="text-xs text-foreground orbitron">{formatDashboardNumber(entry.requests)}</p>
				</div>
				<div class="mt-1 h-2 w-full bg-accent/40">
					<div
						class="h-full"
						style:background-color={meterStyle(entry.device)}
						style:width="{total > 0 ? (entry.requests / total) * 100 : 0}%"
					></div>
				</div>
			</div>
		{/each}
	</div>
</HudModule>
