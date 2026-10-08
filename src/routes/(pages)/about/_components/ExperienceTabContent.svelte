<script lang="ts" module>
	import { resume, type Experience } from '$lib/data/resume';

	export type EmployerGroup = {
		company: string;
		location?: string;
		jobs: Experience[];
	};

	export function groupByEmployer(jobs: Experience[]): EmployerGroup[] {
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

	export const employers = groupByEmployer(resume.experience);
</script>

<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	let { fadeOffset = 0 }: { fadeOffset?: number } = $props();
</script>

<section style:--about-base="calc(var(--about-stagger-ms) * {fadeOffset})">
	<div>
		<h3
			class="about-block mb-4 text-lg font-semibold text-foreground"
			style:--about-index={0}
		>
			{m.resume_history()}
		</h3>
		<div class="space-y-8">
			{#each employers as employer, index (employer.company + employer.jobs[0].period)}
				<article
					class="about-block border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5"
					style:--about-index={index + 1}
				>
						<h4 class="font-semibold text-foreground">
							{employer.company}{#if employer.location}
								<span class="font-normal text-muted"> · {employer.location}</span>
							{/if}
						</h4>
						<ol class="mt-5">
							{#each employer.jobs as job, index (job.role + job.period)}
								<li class="relative pl-6 {index < employer.jobs.length - 1 ? 'pb-8' : ''}">
									{#if index < employer.jobs.length - 1}
										<span
											class="absolute top-2.5 -bottom-2.5 left-0 w-px -translate-x-1/2 bg-muted"
											aria-hidden="true"
										></span>
									{/if}
									<span
										class="absolute top-1.5 left-0 size-2 -translate-x-1/2 rounded-full bg-foreground"
										aria-hidden="true"
									></span>
									<div
										class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
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
								</li>
							{/each}
						</ol>
					</article>
				{/each}
			</div>
		</div>
	</section>
