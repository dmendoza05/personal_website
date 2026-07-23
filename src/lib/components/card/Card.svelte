<script lang="ts">
	import type { Snippet } from 'svelte';
	import CardShape from './CardShape.svelte';
	import type { CardNotches } from './card-notches';

	let {
		notches = 'all',
		notchSize,
		active = false,
		class: className = '',
		children
	}: {
		notches?: CardNotches;
		notchSize?: number;
		active?: boolean;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<CardShape {notches} {notchSize} {active} class={className}>
	<div class="w-full px-4 py-4 sm:px-5 sm:py-5">
		{@render children()}
	</div>
</CardShape>
