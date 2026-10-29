<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import {
		canLogoHero,
		getLogoHeroMode,
		isHomePath,
		logoHeroModeFrom,
		LOGO_HERO_NAME,
		setLogoHeroMode,
		startLogoHeroTransition,
		whenLogoHeroFinished
	} from '$lib/logo-hero-transition';
	import { getNavigatingFrom } from '$lib/navigating-from';
	import ResumeDownloadButton from '$lib/components/header/ResumeDownloadButton.svelte';
	import {
		HEADER_LOGO_HEIGHT,
		HEADER_TRANSITION_MS,
		SM_VIEWPORT_QUERY
	} from '$lib/components/header/constants';
	import MainContent from '$lib/components/MainContent.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { children } = $props();

	const fromLogoHero = isHomePath(getNavigatingFrom()) && canLogoHero();

	let isSmViewport = $state(false);
	let logo: Logo | undefined = $state();

	onMount(() => {
		const mediaQuery = window.matchMedia(SM_VIEWPORT_QUERY);
		isSmViewport = mediaQuery.matches;

		function onViewportChange() {
			isSmViewport = mediaQuery.matches;
		}

		mediaQuery.addEventListener('change', onViewportChange);
		if (fromLogoHero) {
			void whenLogoHeroFinished().then(() => logo?.toFullname());
		}

		return () => {
			mediaQuery.removeEventListener('change', onViewportChange);
		};
	});

	onNavigate((navigation) => {
		if (!logo) return;

		const to = navigation.to?.url.pathname ?? '';
		if (!isHomePath(to) || !canLogoHero()) return;

		setLogoHeroMode(logoHeroModeFrom(logo.getState()));
		return startLogoHeroTransition(navigation.complete, 'to-home');
	});

	const logoHeight = $derived(isSmViewport ? HEADER_LOGO_HEIGHT.compact : HEADER_LOGO_HEIGHT.nav);

	$effect(() => {
		if (!logo || fromLogoHero) return;

		logo.toFullname();
	});
</script>

<Header>
	{#snippet left()}
		<a href={resolve('/')} aria-label={m.nav_home()} class="flex w-fit max-w-full items-center">
			<Logo
				bind:this={logo}
				initial={fromLogoHero ? getLogoHeroMode() : 'initials'}
				duration={HEADER_TRANSITION_MS}
				height={logoHeight}
				transitionName={LOGO_HERO_NAME}
				class="text-foreground"
			/>
		</a>
	{/snippet}
	{#snippet right()}
		<ResumeDownloadButton class="max-md:hidden" />
	{/snippet}
</Header>

<MainContent>
	{@render children()}
</MainContent>
