<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<div class="mb-6 sm:mb-8">
	<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
	{#if description}
		<p class="mt-2 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
	{/if}
</div>
