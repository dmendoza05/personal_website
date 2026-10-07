<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import ResumeDownloadButton from '$lib/components/header/ResumeDownloadButton.svelte';
	import {
		HEADER_LOGO_HEIGHT,
		HEADER_TRANSITION_MS,
		SM_VIEWPORT_QUERY
	} from '$lib/components/header/constants';
	import MainContent from '$lib/components/MainContent.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { children } = $props();

	const hudControl =
		'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors bartle';

	let isSmViewport = $state(false);
	let logo: Logo | undefined = $state();

	onMount(() => {
		const mediaQuery = window.matchMedia(SM_VIEWPORT_QUERY);
		isSmViewport = mediaQuery.matches;

		function onViewportChange() {
			isSmViewport = mediaQuery.matches;
		}

		mediaQuery.addEventListener('change', onViewportChange);

		return () => {
			mediaQuery.removeEventListener('change', onViewportChange);
		};
	});

	const dashboardActive = $derived(page.url.pathname.startsWith('/dashboard'));
	const logoHeight = $derived(isSmViewport ? HEADER_LOGO_HEIGHT.compact : HEADER_LOGO_HEIGHT.nav);

	$effect(() => {
		if (!logo) return;

		if (isSmViewport) {
			logo.toInitials();
			return;
		}

		logo.toFullname();
	});
</script>

<Header>
	{#snippet left()}
		<a href={resolve('/')} aria-label={m.nav_home()} class="inline-block shrink-0">
			<Logo
				bind:this={logo}
				initial="initials"
				duration={HEADER_TRANSITION_MS}
				height={logoHeight}
				class="text-foreground"
			/>
		</a>
	{/snippet}
	{#snippet right()}
		<ResumeDownloadButton />
	{/snippet}
</Header>

<MainContent>
	{@render children()}
</MainContent>
