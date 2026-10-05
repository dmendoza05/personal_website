<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	let {
		spinning = $bindable(true),
		size = $bindable(1 / 1.2)
	}: {
		spinning?: boolean;
		size?: number;
	} = $props();

	const MIN_SIZE = 0.5;
	const MAX_SIZE = 0.9;

	let showSize = $state(false);

	function setSize(event: Event) {
		const next = Number((event.currentTarget as HTMLInputElement).value);
		if (Number.isFinite(next)) size = next;
	}

	function closeSize() {
		showSize = false;
	}
</script>

<!--  -->
<section
	class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 border border-border bg-card/95 p-2 text-foreground backdrop-blur-sm"
	aria-label={m.dashboard_globe_size()}
>
	<button
		type="button"
		class="inline-flex h-9 w-9 shrink-0 items-center justify-center border {spinning
			? 'border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground'
			: 'border-accent bg-accent text-accent-foreground'}"
		aria-label={spinning ? m.dashboard_globe_pause() : m.dashboard_globe_spin()}
		aria-pressed={!spinning}
		onclick={() => (spinning = !spinning)}
	>
		{#if spinning}
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<rect x="6" y="6" width="12" height="12" rx="1" />
			</svg>
		{:else}
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M8 5v14l11-7z" />
			</svg>
		{/if}
	</button>

	<button
		type="button"
		class="h-9 shrink-0 border px-3 text-xs font-semibold uppercase tracking-[0.2em] rajdhani {showSize
			? 'border-accent bg-accent text-accent-foreground'
			: 'border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground'}"
		aria-pressed={showSize}
		onclick={() => (showSize = !showSize)}
	>
		{m.dashboard_globe_size()}
	</button>

	{#if showSize}
		<input
			class="w-36 accent-accent"
			type="range"
			min={MIN_SIZE}
			max={MAX_SIZE}
			step="0.005"
			value={size}
			aria-label={m.dashboard_globe_size()}
			oninput={setSize}
		/>
		<button
			type="button"
			class="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground"
			aria-label={m.dashboard_globe_close()}
			onclick={closeSize}
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>
	{/if}
</section>
