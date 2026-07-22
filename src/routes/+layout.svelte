<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DotsBackground from '$lib/components/DotsBackground.svelte';
	import { headerOffsetForPath } from '$lib/components/header/header-height';
	import { getExpandedHeaderHeight, initExpandedHeaderHeight } from '$lib/components/header/header-expanded-height.svelte';
	import {
		HEADER_TRANSITION_EASE,
		HEADER_TRANSITION_MS,
		SM_VIEWPORT_QUERY
	} from '$lib/components/header/header-state';

	let { children } = $props();

	let isSmViewport = $state(false);

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

	onMount(() => {
		const smQuery = window.matchMedia(SM_VIEWPORT_QUERY);
		isSmViewport = smQuery.matches;
		const stopExpandedHeight = initExpandedHeaderHeight();

		function onSmViewportChange() {
			isSmViewport = smQuery.matches;
		}

		smQuery.addEventListener('change', onSmViewportChange);

		return () => {
			smQuery.removeEventListener('change', onSmViewportChange);
			stopExpandedHeight();
		};
	});

	const headerOffset = $derived(
		headerOffsetForPath(page.url.pathname, isSmViewport, getExpandedHeaderHeight())
	);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="relative z-10 flex h-dvh w-dvw flex-col overflow-hidden">
	<DotsBackground />
	<Header />

	<main
		class="mx-auto min-h-dvh w-full max-w-full flex-1 overflow-scroll px-4 pb-8 sm:px-6 sm:pb-12 md:max-w-4xl lg:max-w-7xl lg:pb-16"
		style:padding-top={headerOffset}
		style:transition="padding-top {HEADER_TRANSITION_MS}ms {HEADER_TRANSITION_EASE}"
	>
		{@render children()}
	</main>

	<Footer />
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
