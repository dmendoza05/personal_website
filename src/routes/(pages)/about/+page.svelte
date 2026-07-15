<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resume } from '$lib/data/resume';
	import { site } from '$lib/data/site';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ResumeSection from '$lib/components/ResumeSection.svelte';
</script>

<svelte:head>
	<title>{m.about_title()} | {site.name}</title>
	<meta name="description" content={m.about_description()} />
</svelte:head>

<SectionHeading title={m.about_title()} description={m.about_description()} />

<section class="mb-10 space-y-4 sm:mb-14">
	<p class="text-sm leading-relaxed text-muted sm:text-base">{m.about_bio()}</p>
	<p class="text-sm leading-relaxed text-muted sm:text-base">
		{resume.title} · {resume.location}
	</p>
</section>

<ResumeSection />
