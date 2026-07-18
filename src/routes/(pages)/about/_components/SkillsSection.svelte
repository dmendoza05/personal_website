<script lang="ts">
	import { resume } from '$lib/data/resume';
	import { getSkill } from '$lib/data/skills';
	import SkillLogo from '$lib/components/SkillLogo.svelte';
</script>

<div class="flex flex-wrap gap-2">
	{#each resume.skills as skillId (skillId)}
		<span
			class="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-foreground"
		>
			<SkillLogo id={skillId} class="size-3.5 shrink-0 text-foreground" />
			{getSkill(skillId).label}
		</span>
	{/each}
</div>
