<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import Page from '$lib/components/page/Page.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import TabsController from '$lib/components/tabs/TabsController.svelte';
	import ExperienceTabContent from './_components/ExperienceTabContent.svelte';
	import SkillsTabContent from './_components/SkillsTabContent.svelte';
</script>

<svelte:head>
	<title>{m.about_title()} | {site.name}</title>
	<meta name="description" content={m.about_description()} />
</svelte:head>

<Page>
	<SectionHeading title={m.about_title()} description={m.about_description()} />

	<TabsController id="about" label={m.about_title()} defaultTab="experience">
		{#snippet tabs()}
			<Tab id="experience" label={m.resume_experience()} />
			<Tab id="skills" label={m.resume_skills()} />
		{/snippet}

		<ExperienceTabContent />
		<SkillsTabContent />
	</TabsController>
</Page>
