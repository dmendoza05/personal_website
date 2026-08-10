<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { HEADER_TRANSITION_MS } from '$lib/components/header/header-state';
	import { site } from '$lib/data/site';

	let {
		oncomplete
	}: {
		oncomplete?: () => void;
	} = $props();

	let logo: Logo;

	onMount(() => {
		logo.toFullname();
	});
</script>

<section
	class="flex flex-1 items-center justify-center px-4"
	aria-label={site.name}
>
	<Logo
		bind:this={logo}
		initial="initials"
		duration={HEADER_TRANSITION_MS}
		class="h-16 w-auto text-foreground sm:h-20 md:h-[4.75rem]"
		{oncomplete}
	/>
</section>
