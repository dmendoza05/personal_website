<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resume } from '$lib/data/resume';
	import { site } from '$lib/data/site';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
</script>

<svelte:head>
	<title>{m.resume_title()} | {site.name}</title>
	<meta name="description" content={resume.summary} />
</svelte:head>

<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
	<SectionHeading title={m.resume_title()} description={resume.title} />
	<a
		href="/resume.pdf"
		download
		class="inline-flex shrink-0 items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
	>
		{m.resume_download_pdf()}
	</a>
</div>

<div class="space-y-10">
	<section>
		<p class="text-muted leading-relaxed">{resume.summary}</p>
	</section>

	<section>
		<h2 class="mb-4 text-xl font-semibold text-foreground">{m.resume_experience()}</h2>
		<div class="space-y-6">
			{#each resume.experience as job (job.company + job.period)}
				<div class="border-l-2 border-accent/30 pl-4">
					<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
						<h3 class="font-semibold text-foreground">{job.role}</h3>
						<span class="text-sm text-muted">{job.period}</span>
					</div>
					<p class="text-sm text-muted">{job.company}</p>
					<ul class="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
						{#each job.bullets as bullet (bullet)}
							<li>{bullet}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-xl font-semibold text-foreground">{m.resume_education()}</h2>
		<div class="space-y-4">
			{#each resume.education as edu (edu.school)}
				<div>
					<h3 class="font-semibold text-foreground">{edu.degree}</h3>
					<p class="text-sm text-muted">{edu.school} · {edu.period}</p>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-xl font-semibold text-foreground">{m.resume_skills()}</h2>
		<div class="flex flex-wrap gap-2">
			{#each resume.skills as skill (skill)}
				<span class="rounded-full border border-border px-3 py-1 text-sm text-foreground">
					{skill}
				</span>
			{/each}
		</div>
	</section>
</div>
