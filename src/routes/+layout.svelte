<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import { initPreferences } from '$lib/preferences';
	import InYourAreaAd from '$lib/components/InYourAreaAd.svelte';
	import DotsBackground from '$lib/components/DotsBackground.svelte';
	import VerticalBannerAds from '$lib/components/VerticalBannerAds.svelte';

	let { children, data } = $props();

	onMount(() => {
		const stopPreferences = initPreferences();

		return () => {
			stopPreferences();
		};
	});

	afterNavigate(({ to }) => {
		// afterNavigate also runs during SSR; only track views in the browser
		if (!browser) return;

		const path = to?.url.pathname;
		if (!path) return;

		void fetch('/api/pageview', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ path }),
			keepalive: true
		}).catch(() => {});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="relative z-10 h-dvh w-dvw overflow-hidden">
	{@render children()}
	<InYourAreaAd milesFromLa={data.milesFromLa} />
	{#if deLocalizeUrl(page.url).pathname !== '/'}
		<VerticalBannerAds />
	{/if}
	<DotsBackground />
</div>
