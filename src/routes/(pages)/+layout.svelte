<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Header from '$lib/components/header/Header.svelte';
	import MainContent from '$lib/components/MainContent.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	let { children } = $props();
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

<MainContent>
	{@render children()}
</MainContent>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
