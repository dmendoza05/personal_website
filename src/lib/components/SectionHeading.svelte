<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<div class="mb-6 sm:mb-8 bar">
	<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-5xl orbitron bold uppercase">{title}</h1>
	{#if description}
		<p class="mt-2 text-lg leading-relaxed text-muted sm:text-lg rajdhani">
			<span class="backdrop-blur-">{description}</span>
		</p>
	{/if}
</div>
