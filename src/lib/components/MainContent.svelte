<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import AdSpaces from '$lib/components/fake-ads/AdSpaces.svelte';
	import DashboardBanner from '$lib/components/fake-ads/DashboardBanner.svelte';
	import VerticalBannerAds from '$lib/components/fake-ads/VerticalBannerAds.svelte';

	let { children }: { children: Snippet } = $props();

	const showDashboardBanner = $derived(!page.url.pathname.startsWith('/dashboard'));
</script>

<main class="main-content">
	<div class="main-content__content">
		{@render children()}
	</div>
	<AdSpaces>
		{#snippet left()}
			{#if showDashboardBanner}
				<DashboardBanner />
			{/if}
			<VerticalBannerAds side="left" />
		{/snippet}
		{#snippet right()}
			<VerticalBannerAds side="right" />
		{/snippet}
	</AdSpaces>
</main>

<style>
	.main-content {
		position: relative;
		z-index: 10;
		display: grid;
		grid-template-columns: minmax(0, 1fr) min(100%, 100%) minmax(0, 1fr);
		width: 100%;
	}

	.main-content__content {
		grid-column: 2;
		grid-row: 1;
		min-width: 0;
	}

	@media (min-width: 48rem) {
		.main-content {
			grid-template-columns: minmax(0, 1fr) min(100%, 56rem) minmax(0, 1fr);
		}
	}

	@media (min-width: 64rem) {
		.main-content {
			grid-template-columns: minmax(0, 1fr) min(100%, 80rem) minmax(0, 1fr);
		}
	}
</style>
