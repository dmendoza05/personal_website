<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import CountUp from './CountUp.svelte';
	import type { PanelPhase } from './panel-motion';

	let {
		likes = null,
		dislikes = null,
		loading = false,
		errorMessage = '',
		onRetry,
		phase = 'content'
	}: {
		likes?: number | null;
		dislikes?: number | null;
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
		phase?: PanelPhase;
	} = $props();

	const showBody = $derived(phase === 'content');
</script>

<div class="p-3">
	<p
		class="panel-label text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani {phase ===
		'shell'
			? ''
			: 'is-in'}"
	>
		{m.dashboard_stat_ad_votes()}
	</p>
	{#if errorMessage}
		<p class="panel-piece mt-2 text-xs text-muted rajdhani {showBody ? 'is-in' : ''}">
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
	{:else}
		<div class="panel-piece mt-2 grid grid-cols-2 gap-3 {showBody ? 'is-in' : ''}">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
					{m.dashboard_stat_ad_likes()}
				</p>
				<p class="mt-1 text-2xl font-bold tracking-tight text-foreground orbitron">
					{#if loading}
						—
					{:else}
						<CountUp value={likes ?? 0} active={showBody} />
					{/if}
				</p>
			</div>
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
					{m.dashboard_stat_ad_dislikes()}
				</p>
				<p class="mt-1 text-2xl font-bold tracking-tight text-foreground orbitron">
					{#if loading}
						—
					{:else}
						<CountUp value={dislikes ?? 0} active={showBody} />
					{/if}
				</p>
			</div>
		</div>
	{/if}
</div>
