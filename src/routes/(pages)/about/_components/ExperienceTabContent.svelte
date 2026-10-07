<script lang="ts">
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import { createSceneController } from '$lib/scene';
	import { m } from '$lib/paraglide/messages.js';
	import { resume, type Experience } from '$lib/data/resume';

	type EmployerGroup = {
		company: string;
		location?: string;
		jobs: Experience[];
	};

	const scene = createSceneController();

	const employers = groupByEmployer(resume.experience);

	function groupByEmployer(jobs: Experience[]): EmployerGroup[] {
		const groups: EmployerGroup[] = [];

		for (const job of jobs) {
			const current = groups.at(-1);
			if (current?.company === job.company) {
				current.jobs.push(job);
				if (current.location !== job.location) current.location = undefined;
				continue;
			}

			groups.push({
				company: job.company,
				location: job.location,
				jobs: [job]
			});
		}

		return groups;
	}
</script>

<TabContent id="experience" onenter={scene.enter} onexit={scene.exit}>
	<section class="space-y-8 sm:space-y-10">
		<div>
			<h3 class="mb-4 text-lg font-semibold text-foreground">{m.resume_history()}</h3>
			<div class="space-y-8">
				{#each employers as employer (employer.company)}
					<div>
						<h4 class="mb-3 font-semibold text-foreground">
							{employer.company}{#if employer.location}
								<span class="font-normal text-muted"> · {employer.location}</span>
							{/if}
						</h4>
						<div class="grid gap-3 lg:grid-cols-2">
							{#each employer.jobs as job (job.role + job.period)}
								<article
									class="h-full border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5"
								>
									<div
										class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
									>
										<div>
											<h5 class="font-semibold text-foreground">{job.role}</h5>
											{#if job.employment}
												<p class="mt-0.5 text-sm text-muted">{job.employment}</p>
											{/if}
										</div>
										<span class="shrink-0 text-sm text-muted">{job.period}</span>
									</div>
									{#if !employer.location && job.location}
										<p class="mt-1 text-sm text-muted">{job.location}</p>
									{/if}
									{#if job.bullets.length > 0}
										<ul class="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
											{#each job.bullets as bullet (bullet)}
												<li>{bullet}</li>
											{/each}
										</ul>
									{/if}
								</article>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid gap-8 md:grid-cols-2 md:gap-3">
			<div>
				<h3 class="mb-4 text-lg font-semibold text-foreground">{m.resume_education()}</h3>
				<div class="space-y-3">
					{#each resume.education as edu (edu.school + edu.period)}
						<article class="border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5">
							<h4 class="font-semibold text-foreground">{edu.degree}</h4>
							<p class="mt-1 text-sm text-muted">{edu.school} · {edu.period}</p>
						</article>
					{/each}
				</div>
			</div>

			<div>
				<h3 class="mb-4 text-lg font-semibold text-foreground">{m.resume_languages()}</h3>
				<article class="border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5">
					<ul class="space-y-3">
						{#each resume.languages as lang (lang.name)}
							<li class="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
								<span class="font-medium text-foreground">{lang.name}</span>
								<span class="text-sm text-muted">{lang.proficiency}</span>
							</li>
						{/each}
					</ul>
				</article>
			</div>
		</div>
	</section>
</TabContent>
