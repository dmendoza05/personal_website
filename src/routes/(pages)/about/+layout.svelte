<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ResumeSection from './_components/ResumeSection.svelte';
	import SkillsSection from './_components/SkillsSection.svelte';

	let { children } = $props();

	type Tab = 'experience' | 'skills';

	const tabs: { id: Tab; label: () => string }[] = [
		{ id: 'experience', label: () => m.resume_experience() },
		{ id: 'skills', label: () => m.resume_skills() }
	];

	let activeTab = $state<Tab>('experience');
</script>

<SectionHeading title={m.about_title()} description={m.about_description()} />

<div class="mb-6 sm:mb-8">
	<div
		role="tablist"
		aria-label={m.about_title()}
		class="flex gap-1 border-b border-border"
	>
		{#each tabs as tab (tab.id)}
			{@const active = activeTab === tab.id}
			<button
				type="button"
				role="tab"
				aria-selected={active}
				aria-controls="about-tab-panel"
				id="about-tab-{tab.id}"
				onclick={() => (activeTab = tab.id)}
				class="relative -mb-px px-3 py-2 text-sm font-medium transition-colors {active
					? 'border-b-2 border-accent text-accent'
					: 'border-b-2 border-transparent text-muted hover:text-foreground'}"
			>
				{tab.label()}
			</button>
		{/each}
	</div>
</div>

<div id="about-tab-panel" role="tabpanel" aria-labelledby="about-tab-{activeTab}">
	{#if activeTab === 'experience'}
		<ResumeSection />
	{:else}
		<SkillsSection />
	{/if}
</div>

{@render children()}
