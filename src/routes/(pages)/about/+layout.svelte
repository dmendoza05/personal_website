<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import TabsController from '$lib/components/tabs/TabsController.svelte';
	import ExperienceTabContent from './_components/ExperienceTabContent.svelte';
	import SkillsTabContent from './_components/SkillsTabContent.svelte';

	let { children } = $props();
</script>

<SectionHeading title={m.about_title()} description={m.about_description()} />

<TabsController id="about" label={m.about_title()} defaultTab="experience">
	{#snippet tabs()}
		<Tab id="experience" label={m.resume_experience()} />
		<Tab id="skills" label={m.resume_skills()} />
	{/snippet}

	<ExperienceTabContent />
	<SkillsTabContent />
</TabsController>

{@render children()}
