<script lang="ts">
	import type { Snippet } from 'svelte';

	let { left, right }: { left: Snippet; right: Snippet } = $props();
</script>

<div class="ad-spaces">
	<aside class="ad-space ad-space--left" aria-label="Left advertisement">
		{@render left()}
	</aside>
	<aside class="ad-space ad-space--right" aria-label="Right advertisement">
		{@render right()}
	</aside>
</div>

<style>
	.ad-spaces {
		display: contents;
	}

	.ad-space {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 1rem;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		max-width: 100%;
		padding-block: 1rem;
		container-type: inline-size;
		overflow: hidden;
		pointer-events: none;
		animation: ad-space-in 300ms ease 400ms both;
	}

	@keyframes ad-space-in {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ad-space {
			animation: none;
		}
	}

	.ad-space--left {
		grid-column: 1;
		grid-row: 1;
		align-items: flex-end;
	}

	.ad-space--right {
		grid-column: 3;
		grid-row: 1;
		align-items: flex-start;
	}

	.ad-space--left > :global(*) {
		margin-right: 0.75rem;
	}

	.ad-space--right > :global(*) {
		margin-left: 0.75rem;
	}
</style>
