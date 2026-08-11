<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import AnimatedWords from '$lib/components/AnimatedWords.svelte';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import TabsController from '$lib/components/tabs/TabsController.svelte';
	import ExperienceTabContent from './_components/ExperienceTabContent.svelte';
	import ProficiencyTabContent from './_components/ProficiencyTabContent.svelte';
	import { resume } from '$lib/data/resume';
</script>

<svelte:head>
	<title>{m.about_title()} | {site.name}</title>
	<meta name="description" content={m.about_description()} />
</svelte:head>

<div class="space-y-8 px-4 sm:px-6 relative z-10">
	<div>
		<AnimatedWords class="text-xs leading-relaxed sm:text-sm text-white">
			{resume.summary}
		</AnimatedWords>
	</div>

	<TabsController id="about" label={m.about_title()} defaultTab="experience">
		{#snippet tabs()}
			<Tab id="experience" label={m.resume_experience()} />
			<Tab id="proficiency" label={m.resume_proficiency()} />
		{/snippet}

		<ExperienceTabContent />
		<ProficiencyTabContent />
	</TabsController>
</div>
