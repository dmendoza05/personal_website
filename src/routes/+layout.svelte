<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { setNavigatingFrom } from '$lib/navigating-from';
	import { initPreferences } from '$lib/preferences';
	import DotsBackground from '$lib/components/DotsBackground.svelte';

	let { children } = $props();

	onMount(() => {
		const stopPreferences = initPreferences();

		return () => {
			stopPreferences();
		};
	});

	beforeNavigate(({ from }) => {
		setNavigatingFrom(from?.url.pathname ?? '');
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
	<DotsBackground />
</div>
