<script lang="ts">
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import { createSceneController } from '$lib/scene';
	import { getSkill, type SkillId } from '$lib/data/skills';
	import SkillLogo from '$lib/components/SkillLogo.svelte';

	type SkillTier = {
		id: string;
		label: string;
		color: string;
		skills: SkillId[];
	};

	const scene = createSceneController();

	const tiers: SkillTier[] = [
		{
			id: 'comfortable',
			label: 'Comfortable using it everyday',
			color: '#ff7f7f',
			skills: ['html', 'css', 'flutter', 'javascript', 'typescript', 'dart', 'git']
		},
		{
			id: 'professionally-plus',
			label: 'Used it on the job (but better)',
			color: '#ffbf7f',
			skills: ['litjs', 'angular', 'bash']
		},
		{
			id: 'professionally',
			label: 'Used it on the job',
			color: '#ffdf7f',
			skills: [
				'docker',
				'php',
				'python',
				'phaserjs',
				'pixijs',
				'unity',
				'csharp',
				'grpc',
				'nodejs',
				'aws',
				'snowflake',
				'datadog'
			]
		},
		{
			id: 'hobby',
			label: 'Hobby projects only',
			color: '#ffff7f',
			skills: ['postgresql', 'mongodb', 'ruby', 'wordpress', 'flameengine']
		},
		{
			id: 'playground',
			label: 'Used CodePen or another playground with it',
			color: '#bfff7f',
			skills: ['react']
		},
		{
			id: 'learn',
			label: 'Would love to learn',
			color: '#7fbfff',
			skills: ['rust', 'go', 'haskell', 'graphql']
		}
	];
</script>

<TabContent id="proficiency" onenter={scene.enter} onexit={scene.exit}>
	<div class="grid gap-3" role="list" aria-label="Proficiency tiers">
		{#each tiers as tier (tier.id)}
			<div role="listitem">
				<article class="border border-border bg-card/95 p-4 text-foreground backdrop-blur-sm sm:p-5">
					<div class="flex items-center gap-2">
						<span
							class="size-2.5 shrink-0"
							style:background-color={tier.color}
							aria-hidden="true"
						></span>
						<h3 class="text-xs font-bold uppercase leading-snug text-foreground sm:text-sm">
							{tier.label}
						</h3>
					</div>
					<ul class="mt-3 flex list-none flex-wrap gap-2">
						{#each tier.skills as skillId (skillId)}
							<li
								class="inline-flex items-center gap-1.5 border border-border bg-background/50 px-2.5 py-1 text-sm text-foreground"
							>
								<SkillLogo id={skillId} class="size-3.5 shrink-0" />
								{getSkill(skillId).label}
							</li>
						{/each}
					</ul>
				</article>
			</div>
		{/each}
	</div>
</TabContent>
