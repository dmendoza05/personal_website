<script lang="ts">
	import type { DashboardAdVote } from '$lib/dashboard';
	import { m } from '$lib/paraglide/messages.js';
	import CountUp from './CountUp.svelte';
	import type { PanelPhase } from './panel-motion';

	let {
		likes = null,
		dislikes = null,
		ads = [],
		loading = false,
		errorMessage = '',
		onRetry,
		phase = 'content'
	}: {
		likes?: number | null;
		dislikes?: number | null;
		ads?: DashboardAdVote[];
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
	{:else if loading || ads.length === 0}
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
	{:else}
		<div class="mt-2 flex flex-col gap-3">
			{#each ads as ad, index (ad.id)}
				<div class="panel-piece {showBody ? 'is-in' : ''}" style:--piece={index}>
					<p class="text-sm font-semibold text-foreground rajdhani">{ad.name}</p>
					<div class="mt-2 grid grid-cols-2 gap-3">
						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
								{m.dashboard_stat_ad_likes()}
							</p>
							<p class="mt-1 text-2xl font-bold tracking-tight text-foreground orbitron">
								<CountUp value={ad.likes} active={showBody} />
							</p>
						</div>
						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">
								{m.dashboard_stat_ad_dislikes()}
							</p>
							<p class="mt-1 text-2xl font-bold tracking-tight text-foreground orbitron">
								<CountUp value={ad.dislikes} active={showBody} />
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
