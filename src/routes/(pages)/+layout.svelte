<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { headerOffsetForPath } from '$lib/components/header/header-height';
	import {
		getExpandedHeaderHeight,
		initExpandedHeaderHeight
	} from '$lib/components/header/header-expanded-height.svelte';
	import {
		HEADER_TRANSITION_EASE,
		HEADER_TRANSITION_MS,
		SM_VIEWPORT_QUERY
	} from '$lib/components/header/header-state';

	let { children } = $props();

	let isSmViewport = $state(false);

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

<Header />

<main
	class="mx-auto min-h-dvh w-full max-w-full flex-1 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16"
	style:padding-top={headerOffset}
	style:transition="padding-top {HEADER_TRANSITION_MS}ms {HEADER_TRANSITION_EASE}"
>
	<div class="mx-auto max-w-full md:max-w-4xl lg:max-w-7xl">
		{@render children()}
	</div>
</main>
<Footer />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
