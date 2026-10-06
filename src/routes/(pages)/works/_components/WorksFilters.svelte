<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getProjectType, type ProjectType } from '$lib/data/projects';
	import { getSkill, type SkillId } from '$lib/data/skills';
	import SkillLogo from '$lib/components/SkillLogo.svelte';

	type MenuId = 'skills' | 'types';

	type FilterOption = {
		id: string;
		label: string;
		selected: boolean;
		icon?: string;
		skill?: SkillId;
	};

	let {
		query = $bindable(''),
		skills,
		types,
		selectedSkills = $bindable([]),
		selectedTypes = $bindable([]),
		hasSource = $bindable(false)
	}: {
		query?: string;
		skills: SkillId[];
		types: ProjectType[];
		selectedSkills?: SkillId[];
		selectedTypes?: ProjectType[];
		hasSource?: boolean;
	} = $props();

	const control =
		'flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-border bg-card/95 px-3 text-left text-sm rajdhani';
	const toggle =
		'inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-sm border px-3 text-xs font-semibold uppercase tracking-[0.14em] rajdhani transition-colors';

	let rootEl = $state<HTMLDivElement>();
	let filtersOpen = $state(false);
	let openMenu = $state<MenuId | null>(null);

	const filtersActive = $derived(
		selectedSkills.length > 0 || selectedTypes.length > 0 || hasSource
	);
	const skillOptions = $derived(
		skills.map((id) => ({
			id,
			label: getSkill(id).label,
			skill: id,
			selected: selectedSkills.includes(id)
		}))
	);
	const typeOptions = $derived(
		types.map((id) => {
			const type = getProjectType(id);
			return {
				id,
				label: type.label,
				icon: type.icon,
				selected: selectedTypes.includes(id)
			};
		})
	);

	function toggleFilters() {
		filtersOpen = !filtersOpen;
		if (!filtersOpen) openMenu = null;
	}

	function toggleMenu(menu: MenuId) {
		openMenu = openMenu === menu ? null : menu;
	}

	function toggleSkill(id: string) {
		const skill = id as SkillId;
		selectedSkills = selectedSkills.includes(skill)
			? selectedSkills.filter((entry) => entry !== skill)
			: [...selectedSkills, skill];
	}

	function toggleType(id: string) {
		const type = id as ProjectType;
		selectedTypes = selectedTypes.includes(type)
			? selectedTypes.filter((entry) => entry !== type)
			: [...selectedTypes, type];
	}

	function summary(fallback: string, options: FilterOption[]) {
		const selected = options.filter((option) => option.selected);
		if (selected.length === 0) return fallback;
		return selected.map((option) => option.label).join(', ');
	}

	function toggleClass(active: boolean) {
		return active
			? `${toggle} border-accent bg-accent text-accent-foreground`
			: `${toggle} border-border bg-card/70 text-muted hover:border-accent/60 hover:text-foreground`;
	}

	function onPointerDown(event: PointerEvent) {
		if (!rootEl?.contains(event.target as Node)) openMenu = null;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') openMenu = null;
	}
</script>

<svelte:window onpointerdown={onPointerDown} onkeydown={onKeydown} />

{#snippet menu(id: MenuId, label: string, options: FilterOption[], onToggle: (id: string) => void)}
	<div class="relative min-w-0 flex-1">
		<button
			type="button"
			class="{control} {options.some((option) => option.selected) ? 'text-foreground' : 'text-muted'}"
			aria-haspopup="listbox"
			aria-expanded={openMenu === id}
			onclick={() => toggleMenu(id)}
		>
			<span class="truncate">{summary(label, options)}</span>
			<span aria-hidden="true" class="text-xs">{openMenu === id ? '▴' : '▾'}</span>
		</button>
		{#if openMenu === id}
			<div
				class="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto border border-border bg-card/95"
				role="listbox"
				aria-label={label}
				aria-multiselectable="true"
			>
				{#each options as option (option.id)}
					<button
						type="button"
						class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] rajdhani {option.selected
							? 'bg-accent text-accent-foreground'
							: 'text-muted hover:text-foreground'}"
						role="option"
						aria-selected={option.selected}
						onclick={() => onToggle(option.id)}
					>
						{#if option.skill}
							<span class="inline-flex" aria-hidden="true">
								<SkillLogo id={option.skill} class="size-4 shrink-0" />
							</span>
						{:else if option.icon}
							<svg
								class="size-4 shrink-0"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d={option.icon} />
							</svg>
						{/if}
						{option.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div bind:this={rootEl} class="flex flex-col gap-3">
	<div class="flex items-center gap-2">
		<input
			type="search"
			bind:value={query}
			placeholder={m.works_search_placeholder()}
			aria-label={m.works_search_label()}
			class="h-9 min-w-0 flex-1 rounded-sm border border-border bg-card/95 px-3 text-sm text-foreground rajdhani placeholder:text-muted"
		/>
		<button
			type="button"
			class={toggleClass(filtersOpen)}
			aria-expanded={filtersOpen}
			aria-pressed={filtersActive}
			onclick={toggleFilters}
		>
			{m.works_filters_toggle()}
		</button>
	</div>

	{#if filtersOpen}
		<div class="flex flex-col gap-2 sm:flex-row sm:items-start">
			{#if skillOptions.length > 0}
				{@render menu('skills', m.works_filter_skills(), skillOptions, toggleSkill)}
			{/if}
			{#if typeOptions.length > 0}
				{@render menu('types', m.works_filter_type(), typeOptions, toggleType)}
			{/if}
			<button
				type="button"
				class={toggleClass(hasSource)}
				aria-pressed={hasSource}
				onclick={() => (hasSource = !hasSource)}
			>
				{m.works_filter_has_source()}
			</button>
		</div>
	{/if}
</div>
