<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();

	let shapeEl: HTMLDivElement;
	let pageTrNotchX = $state('100%');
	let pageTrNotchY = $state('0%');
	let pageBlNotchX = $state('0%');
	let pageBlNotchY = $state('100%');
	let borderPath = $state('M0 0H1V1H0Z');
	let svgViewBox = $state('0 0 1 1');

	$effect(() => {
		const shape = shapeEl;
		if (!shape) return;

		let animationFrame = 0;

		function scheduleShapeUpdate() {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(updatePageShape);
		}

		const observer = new ResizeObserver(scheduleShapeUpdate);
		observer.observe(shape);
		scheduleShapeUpdate();

		return () => {
			cancelAnimationFrame(animationFrame);
			observer.disconnect();
		};
	});

	function pageNotchSizePx() {
		const raw = getComputedStyle(shapeEl).getPropertyValue('--page-notch-size');
		const parsed = Number.parseFloat(raw);
		return Number.isFinite(parsed) ? parsed : 28;
	}

	function updatePageShape() {
		const shapeRect = shapeEl.getBoundingClientRect();
		if (!shapeRect.width || !shapeRect.height) return;

		const w = shapeRect.width;
		const h = shapeRect.height;
		const notch = Math.min(pageNotchSizePx(), w * 0.15, h * 0.15);
		const trNotchX = w - notch;
		const blNotchX = notch;
		const blNotchY = h - notch;

		pageTrNotchX = `${trNotchX}px`;
		pageTrNotchY = `${notch}px`;
		pageBlNotchX = `${blNotchX}px`;
		pageBlNotchY = `${blNotchY}px`;

		svgViewBox = `0 0 ${w} ${h}`;
		borderPath = `M0 0L${trNotchX} 0L${w} ${notch}L${w} ${h}L${blNotchX} ${h}L0 ${blNotchY}Z`;
	}
</script>

<div class="relative w-full">
	<!-- Stroke sits outside clip-path so it isn't cropped; sibling so filter isn't needed. -->
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
	<div
		bind:this={shapeEl}
		class="page-shape w-full bg-glass"
		style:--page-tr-notch-x={pageTrNotchX}
		style:--page-tr-notch-y={pageTrNotchY}
		style:--page-bl-notch-x={pageBlNotchX}
		style:--page-bl-notch-y={pageBlNotchY}
	>
		{@render children()}
	</div>
</div>
