<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		buildCardShapePaths,
		resolveCardNotches,
		type CardNotchCorner,
		type CardNotches
	} from '$lib/components/card/card-notches';

	let {
		notches = 'all',
		notchSize,
		active = false,
		class: className = '',
		contentClass = 'w-full px-4 py-4 sm:px-5 sm:py-5',
		children
	}: {
		notches?: CardNotches;
		notchSize?: number;
		active?: boolean;
		class?: string;
		contentClass?: string;
		children: Snippet;
	} = $props();

	const FALLBACK_CLIP = 'polygon(0 0, 1px 0, 1px 1px, 0 1px)';
	const FALLBACK_BORDER = 'M0 0H1V1H0Z';
	const CORNER_CLASS: Record<CardNotchCorner, string> = {
		'top-left': 'card-notch-indicator-tl',
		'top-right': 'card-notch-indicator-tr',
		'bottom-left': 'card-notch-indicator-bl',
		'bottom-right': 'card-notch-indicator-br'
	};

	let shapeEl: HTMLDivElement;
	let clipPath = $state(FALLBACK_CLIP);
	let borderPath = $state(FALLBACK_BORDER);
	let svgViewBox = $state('0 0 1 1');
	let resolvedNotchSize = $state(16);

	const cornerList = $derived(resolveCardNotches(notches));

	$effect(() => {
		const shape = shapeEl;
		if (!shape) return;

		void notches;
		void notchSize;

		let animationFrame = 0;

		function scheduleShapeUpdate() {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(updateShape);
		}

		const observer = new ResizeObserver(scheduleShapeUpdate);
		observer.observe(shape);
		scheduleShapeUpdate();

		return () => {
			cancelAnimationFrame(animationFrame);
			observer.disconnect();
		};
	});

	function resolvedNotchPx() {
		if (typeof notchSize === 'number' && Number.isFinite(notchSize)) {
			return notchSize;
		}

		const raw = getComputedStyle(shapeEl).getPropertyValue('--card-notch-size');
		const parsed = Number.parseFloat(raw);
		return Number.isFinite(parsed) ? parsed : 16;
	}

	function updateShape() {
		const shapeRect = shapeEl.getBoundingClientRect();
		if (!shapeRect.width || !shapeRect.height) return;

		const width = shapeRect.width;
		const height = shapeRect.height;
		const nextNotch = Math.min(resolvedNotchPx(), width * 0.25, height * 0.25);
		const corners = resolveCardNotches(notches);
		const paths = buildCardShapePaths(width, height, nextNotch, corners);

		resolvedNotchSize = nextNotch;
		clipPath = paths.clipPath;
		borderPath = paths.borderPath;
		svgViewBox = `0 0 ${width} ${height}`;
	}
</script>

<div
	class="card-root relative w-full {className}"
	class:card-active={active}
	style:--card-notch-size-resolved="{resolvedNotchSize}px"
>
	<svg
		class="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
		viewBox={svgViewBox}
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<path
			d={borderPath}
			fill="none"
			stroke="var(--svg-shape-stroke-color)"
			stroke-width="var(--svg-shape-stroke-width)"
			vector-effect="non-scaling-stroke"
		/>
	</svg>

	{#each cornerList as corner (corner)}
		<span class="card-notch-indicator {CORNER_CLASS[corner]}" aria-hidden="true"></span>
	{/each}

	<div bind:this={shapeEl} class="card-shape w-full bg-glass" style:--card-clip={clipPath}>
		<div class={contentClass}>
			{@render children()}
		</div>
	</div>
</div>
