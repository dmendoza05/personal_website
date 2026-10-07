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

<div
	class="relative z-10 h-[calc(100dvh-64px)] space-y-8 overflow-y-auto px-4 py-6 scrollbar-none [-ms-overflow-style:none] md:h-[calc(100dvh-80px)] sm:px-6 sm:py-8 [&::-webkit-scrollbar]:hidden"
>
	<div class="border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5">
		<AnimatedWords class="text-sm leading-relaxed text-foreground">
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
