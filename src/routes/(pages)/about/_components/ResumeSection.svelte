<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resume } from '$lib/data/resume';
</script>

<section class="space-y-8 sm:space-y-10">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div class="min-w-0 flex-1">
			<h2 class="text-xl font-semibold text-foreground sm:text-2xl">{m.resume_title()}</h2>
			<p class="mt-1 text-sm text-muted sm:text-base">{resume.title}</p>
			<p class="mt-0.5 text-sm text-muted">{resume.location}</p>
		</div>
		<a
			href="/resume.pdf"
			download
			class="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:w-auto sm:py-2"
		>
			{m.resume_download_pdf()}
		</a>
	</div>

	<div>
		<p class="text-sm leading-relaxed text-muted sm:text-base">{resume.summary}</p>
	</div>

	<div>
		<h3 class="mb-4 text-lg font-semibold text-foreground">{m.resume_experience()}</h3>
		<div class="space-y-6">
			{#each resume.experience as job (job.role + job.period)}
				<div class="border-l-2 border-accent/30 pl-4">
					<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
						<h4 class="font-semibold text-foreground">{job.role}</h4>
						<span class="shrink-0 text-sm text-muted">{job.period}</span>
					</div>
					<p class="text-sm text-muted">
						{job.company}{#if job.location} · {job.location}{/if}
					</p>
					{#if job.bullets.length > 0}
						<ul class="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
							{#each job.bullets as bullet (bullet)}
								<li>{bullet}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div>
		<h3 class="mb-4 text-lg font-semibold text-foreground">{m.resume_education()}</h3>
		<div class="space-y-4">
			{#each resume.education as edu (edu.school + edu.period)}
				<div>
					<h4 class="font-semibold text-foreground">{edu.degree}</h4>
					<p class="text-sm text-muted">{edu.school} · {edu.period}</p>
				</div>
			{/each}
		</div>
	</div>

	<div>
		<h3 class="mb-4 text-lg font-semibold text-foreground">{m.resume_languages()}</h3>
		<div class="space-y-2">
			{#each resume.languages as lang (lang.name)}
				<div class="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
					<span class="font-medium text-foreground">{lang.name}</span>
					<span class="text-sm text-muted">{lang.proficiency}</span>
				</div>
			{/each}
		</div>
	</div>
</section>
