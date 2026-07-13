<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
	{#if description}
		<p class="mt-2 text-muted">{description}</p>
	{/if}
</div>
