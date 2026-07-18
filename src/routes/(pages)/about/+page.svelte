<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
</script>

<svelte:head>
	<title>{m.about_title()} | {site.name}</title>
	<meta name="description" content={m.about_description()} />
</svelte:head>
