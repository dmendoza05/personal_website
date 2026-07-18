<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import TabsController from '$lib/components/tabs/TabsController.svelte';

	let { children } = $props();
</script>

<SectionHeading title={m.works_title()} description={m.works_description()} />

<TabsController id="works" label={m.works_title()} defaultTab="projects">
	{#snippet tabs()}
		<Tab id="projects" label={m.works_tab_projects()} />
	{/snippet}

	{@render children()}
</TabsController>
