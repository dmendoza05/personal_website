<script lang="ts">
	import { getSkill, type SkillId } from '$lib/data/skills';
	import SkillLogo from '$lib/components/SkillLogo.svelte';

	type SkillTier = {
		id: string;
		label: string;
		color: string;
		skills: SkillId[];
	};

	const tiers: SkillTier[] = [
		{
			id: 'mastered',
			label: 'Could teach a class on this',
			color: '#ff7f7f',
			skills: ['html', 'css']
		},
		{
			id: 'comfortable',
			label: 'Comfortable using it everyday',
			color: '#ffbf7f',
			skills: ['flutter', 'javascript', 'typescript', 'dart', 'angular','git']
		},
		{
			id: 'professional',
			label: 'Used it on the job',
			color: '#ffdf7f',
			skills: ['php', 'python', 'bash']
		},
		{
			id: 'hobby',
			label: 'Hobby projects only',
			color: '#ffff7f',
			skills: ['nodejs', 'postgresql', 'mongodb', 'ruby', 'wordpress']
		},
		{
			id: 'playground',
			label: 'Used CodePen or another playground with it',
			color: '#bfff7f',
			skills: [  'react', ]
		},
		{
			id: 'learn',
			label: 'Would love to learn ',
			color: '#7fbfff',
			skills: ['rust', 'go']
		}
	];
</script>

<div
	class="overflow-hidden rounded-sm border border-neutral-700 bg-neutral-900"
	role="list"
	aria-label="Proficiency tiers"
>
	{#each tiers as tier (tier.id)}
		<div
			class="flex min-h-16 border-b border-neutral-700 last:border-b-0"
			role="listitem"
			aria-label={tier.label}
		>
			<div
				class="flex w-32 shrink-0 items-center justify-center px-2 text-center text-[0.65rem] font-bold leading-snug text-neutral-900 sm:w-40 sm:text-sm"
				style:background-color={tier.color}
			>
				{tier.label}
			</div>
			<ul class="m-0 flex flex-1 list-none flex-wrap content-center gap-2 p-2">
				{#each tier.skills as skillId (skillId)}
					<li
						class="inline-flex items-center gap-1.5 rounded-sm bg-neutral-800 px-2.5 py-1 text-sm text-neutral-100"
					>
						<SkillLogo id={skillId} class="size-3.5 shrink-0 text-neutral-100" />
						{getSkill(skillId).label}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
