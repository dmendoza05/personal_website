<script lang="ts">
	import type { Snippet } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import CyberBox from './CyberBox.svelte';

	let {
		loading = false,
		errorMessage = '',
		onRetry,
		children
	}: {
		loading?: boolean;
		errorMessage?: string;
		onRetry?: () => void;
		children: Snippet;
	} = $props();
</script>

<div class="relative h-full min-h-0">
	<CyberBox
		class="h-full"
		contentClass="relative flex h-full min-h-0 w-full flex-col p-4 {loading ? 'opacity-60' : ''}"
	>
		{@render children()}
	</CyberBox>

	{#if errorMessage}
		<div
			class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 px-4 text-center"
		>
			<p class="text-xs text-muted rajdhani sm:text-sm">{errorMessage}</p>
			{#if onRetry}
				<button
					type="button"
					class="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent rajdhani"
					onclick={onRetry}
				>
					{m.dashboard_retry()}
				</button>
			{/if}
		</div>
	{/if}
</div>
