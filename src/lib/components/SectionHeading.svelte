<script lang="ts">
	import { slide } from 'svelte/transition';
	import {
		getPreferences,
		isSectionDescriptionOpen,
		setSectionDescriptionOpen
	} from '$lib/preferences';

	let {
		id,
		title,
		description
	}: {
		id: string;
		title: string;
		description?: string;
	} = $props();

	const preferences = getPreferences();

	const descriptionOpen = $derived(isSectionDescriptionOpen(preferences, id));
	const descriptionDomId = $derived(`section-description-${id}`);

	function toggleDescription() {
		setSectionDescriptionOpen(id, !descriptionOpen);
	}
</script>

<div class="mb-6 sm:mb-8 bar">
	<div class="flex items-start justify-between gap-3">
		<h1
			class="text-2xl font-bold tracking-tight text-foreground sm:text-5xl orbitron bold uppercase"
		>
			{title}

			{#if description}
				<button
					type="button"
					class="mt-1 inline-flex h-9 shrink-0 items-center justify-center text-muted transition-colors hover:text-foreground sm:mt-2"
					aria-expanded={descriptionOpen}
					aria-controls={descriptionDomId}
					onclick={toggleDescription}
				>
					<span class="sr-only">{descriptionOpen ? 'Hide description' : 'Show description'}</span>
					<svg
						class="h-5 w-5 transition-transform duration-200 {descriptionOpen ? 'rotate-180' : ''}"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
					</svg>
				</button>
			{/if}
		</h1>
	</div>

	{#if description && descriptionOpen}
		<p
			id={descriptionDomId}
			class="mt-2 text-lg leading-relaxed text-muted sm:text-lg rajdhani"
			transition:slide={{ duration: 200 }}
		>
			<span class="backdrop-blur-">{description}</span>
		</p>
	{/if}
</div>
