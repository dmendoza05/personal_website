<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AdSpaces from '$lib/components/AdSpaces.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import InYourAreaAd from '$lib/components/InYourAreaAd.svelte';
	import VerticalBannerAds from '$lib/components/VerticalBannerAds.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	let { children } = $props();

	const milesFromLa = $derived(
		(page.data as { milesFromLa?: number | null }).milesFromLa ?? null
	);
</script>

<Header />

<!-- keep this for now for reference

<main
	class="mx-auto min-h-dvh w-full max-w-full flex-1 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16"
	style:padding-top={headerOffset}
	style:transition="padding-top {HEADER_TRANSITION_MS}ms {HEADER_TRANSITION_EASE}"
>
	<div class="mx-auto max-w-full md:max-w-4xl lg:max-w-7xl">
		{@render children()}
	</div>
</main> -->

<main class="page-main">
	<div class="page-main__content">
		{@render children()}
	</div>
	<AdSpaces>
		{#snippet left()}
			<VerticalBannerAds side="left" />
		{/snippet}
		{#snippet right()}
			<InYourAreaAd milesFromLa={milesFromLa} />
			<VerticalBannerAds side="right" />
		{/snippet}
	</AdSpaces>
</main>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<style>
	.page-main {
		position: relative;
		z-index: 10;
		display: grid;
		width: 100%;
		grid-template-columns: minmax(0, 1fr) min(100%, 100%) minmax(0, 1fr);
	}

	.page-main__content {
		grid-column: 2;
		grid-row: 1;
		min-width: 0;
	}

	@media (min-width: 48rem) {
		.page-main {
			grid-template-columns: minmax(0, 1fr) min(100%, 56rem) minmax(0, 1fr);
		}
	}

	@media (min-width: 64rem) {
		.page-main {
			grid-template-columns: minmax(0, 1fr) min(100%, 80rem) minmax(0, 1fr);
		}
	}
</style>
