<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { initPreferences } from '$lib/preferences';

	let { children } = $props();

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

{@render children()}
