<script lang="ts">
	import type { Snippet } from 'svelte';

	let { left, right }: { left: Snippet; right: Snippet } = $props();
</script>

<div class="side-rails">
	<aside class="side-rail side-rail--left" aria-label="Left column">
		{@render left()}
	</aside>
	<aside class="side-rail side-rail--right" aria-label="Right column">
		{@render right()}
	</aside>
</div>

<style>
	.side-rails {
		display: contents;
	}

	.side-rail {
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
		animation: side-rail-in 300ms ease 400ms both;
	}

	@keyframes side-rail-in {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.side-rail {
			animation: none;
		}
	}

	.side-rail--left {
		grid-column: 1;
		grid-row: 1;
		align-items: flex-end;
	}

	.side-rail--right {
		grid-column: 3;
		grid-row: 1;
		align-items: flex-start;
	}

	.side-rail--left > :global(*) {
		margin-right: 0.75rem;
	}

	.side-rail--right > :global(*) {
		margin-left: 0.75rem;
	}
</style>
