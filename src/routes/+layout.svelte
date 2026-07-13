<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	afterNavigate(({ to }) => {
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

<div class="flex min-h-screen flex-col">
	<Header />

	<main class="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
		{@render children()}
	</main>

	<Footer />
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
