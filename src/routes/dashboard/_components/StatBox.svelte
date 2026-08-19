<script lang="ts">
	import CyberBox from './CyberBox.svelte';

	let {
		label,
		value
	}: {
		label: string;
		value: string | number | null;
	} = $props();

	const displayValue = $derived(value ?? '0');
</script>

<CyberBox class="h-full" contentClass="flex h-full w-full flex-col justify-center p-4">
	<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted rajdhani">{label}</p>
	<p class="mt-2 text-2xl font-bold tracking-tight text-foreground orbitron sm:text-3xl">
		{displayValue}
	</p>
</CyberBox>
