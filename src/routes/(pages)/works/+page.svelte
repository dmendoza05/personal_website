<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import Page from '$lib/components/page/Page.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import TabsController from '$lib/components/tabs/TabsController.svelte';
	import ProjectsTabContent from './_components/ProjectsTabContent.svelte';
</script>

<svelte:head>
	<title>{m.works_title()} | {site.name}</title>
	<meta name="description" content={m.works_description()} />
</svelte:head>

<Page>
	<SectionHeading title={m.works_title()} description={m.works_description()} />

	<TabsController id="works" label={m.works_title()} defaultTab="projects">
		{#snippet tabs()}
			<Tab id="projects" label={m.works_tab_projects()} />
		{/snippet}

		<ProjectsTabContent />
	</TabsController>
</Page>
