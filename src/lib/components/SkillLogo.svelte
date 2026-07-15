<script lang="ts">
	import { getSkillLogo } from '$lib/data/skill-logos';
	import { getSkill, type SkillId } from '$lib/data/skills';

	let {
		id,
		class: className = 'size-4 shrink-0'
	}: {
		id: SkillId;
		class?: string;
	} = $props();

	const skill = $derived(getSkill(id));
	const logo = $derived(getSkillLogo(id));
</script>

{#if logo}
	<svg
		class={className}
		viewBox={logo.viewBox}
		width={logo.width}
		height={logo.height}
		role="img"
		aria-label={skill.label}
	>
		<title>{skill.label}</title>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html logo.body}
	</svg>
{:else}
	<span
		class="inline-flex items-center justify-center rounded-sm bg-accent/15 text-[0.55rem] font-semibold leading-none text-accent {className}"
		aria-label={skill.label}
		title={skill.label}
	>
		{skill.label.slice(0, 1)}
	</span>
{/if}
