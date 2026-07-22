<script lang="ts">
	import type { Snippet } from 'svelte';
	import { HEADER_TRANSITION_MS } from './header-state';

	const NOTCH_INSET_RATIO = 0.2;

	let {
		revealed = false,
		content,
		height,
		transitionMs = HEADER_TRANSITION_MS,
		children
	}: {
		revealed?: boolean;
		content: HTMLElement | undefined;
		height: string;
		transitionMs?: number;
		children: Snippet;
	} = $props();

	let shapeEl: HTMLDivElement;
	let navNotchLeft = $state('20%');
	let navNotchRight = $state('80%');
	let navDiagonalLeft = $state('20%');
	let navDiagonalRight = $state('80%');
	let navBarMiddleY = $state('50%');
	let navNotchBottomY = $state('100%');
	let borderPathFlat = $state("path('M0 0H1V1H0Z')");
	let borderPathNotched = $state("path('M0 0H1V1H0Z')");
	let svgViewBox = $state('0 0 1 1');

	$effect(() => {
		const shape = shapeEl;
		const contentEl = content;
		if (!shape || !contentEl) return;

		// Re-run when the target header height changes.
		void height;

		let animationFrame = 0;

		function scheduleShapeUpdate() {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(updateHeaderShape);
		}

		const observer = new ResizeObserver(scheduleShapeUpdate);
		observer.observe(shape);
		observer.observe(contentEl);
		scheduleShapeUpdate();

		return () => {
			cancelAnimationFrame(animationFrame);
			observer.disconnect();
		};
	});

	function updateHeaderShape() {
		if (!content) return;

		const shapeRect = shapeEl.getBoundingClientRect();
		const contentRect = content.getBoundingClientRect();
		const navNotchBottomYPx = Number.parseFloat(height);
		if (!shapeRect.width || !contentRect.width || !navNotchBottomYPx) return;

		const w = shapeRect.width;
		const h = shapeRect.height;
		const contentLeft = contentRect.left - shapeRect.left;
		const navNotchLeftPx = contentLeft + contentRect.width * NOTCH_INSET_RATIO;
		const navNotchRightPx = contentLeft + contentRect.width * (1 - NOTCH_INSET_RATIO);
		const navBarMiddleYPx = navNotchBottomYPx / 2;
		const diagonalRun = Math.max(0, navNotchBottomYPx - navBarMiddleYPx);
		const navDiagonalLeftPx = Math.max(0, navNotchLeftPx - diagonalRun);
		const navDiagonalRightPx = Math.min(w, navNotchRightPx + diagonalRun);

		navNotchLeft = `${navNotchLeftPx}px`;
		navNotchRight = `${navNotchRightPx}px`;
		navDiagonalLeft = `${navDiagonalLeftPx}px`;
		navDiagonalRight = `${navDiagonalRightPx}px`;
		navBarMiddleY = `${navBarMiddleYPx}px`;
		navNotchBottomY = height;

		svgViewBox = `0 0 ${w} ${h}`;
		// Same point count/order as clip-path so CSS can interpolate `d` with the reveal.
		borderPathFlat = `path('M0 0L${w} 0L${w} ${h}L${w} ${h}L${w} ${h}L0 ${h}L0 ${h}L0 ${h}Z')`;
		borderPathNotched = `path('M0 0L${w} 0L${w} ${navBarMiddleYPx}L${navDiagonalRightPx} ${navBarMiddleYPx}L${navNotchRightPx} ${navNotchBottomYPx}L${navNotchLeftPx} ${navNotchBottomYPx}L${navDiagonalLeftPx} ${navBarMiddleYPx}L0 ${navBarMiddleYPx}Z')`;
	}
</script>

<header id="header" class="fixed top-0 z-50 w-dvw">
	<div class="relative w-dvw">
		<!-- Stroke sits outside clip-path so it isn't cropped; sibling so filter isn't needed. -->
		<svg
			class="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
			viewBox={svgViewBox}
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<path
				class:header-border-custom={revealed}
				class="header-border"
				fill="none"
				stroke="var(--border)"
				stroke-width="1"
				vector-effect="non-scaling-stroke"
				style:--header-transition-ms="{transitionMs}ms"
				style:--header-border-flat={borderPathFlat}
				style:--header-border-notched={borderPathNotched}
			/>
		</svg>
		<div
			bind:this={shapeEl}
			class:header-shape-custom={revealed}
			class="header-shape w-dvw bg-glass"
			style:--header-transition-ms="{transitionMs}ms"
			style:--nav-notch-left={navNotchLeft}
			style:--nav-notch-right={navNotchRight}
			style:--nav-diagonal-left={navDiagonalLeft}
			style:--nav-diagonal-right={navDiagonalRight}
			style:--nav-bar-middle-y={navBarMiddleY}
			style:--nav-notch-bottom-y={navNotchBottomY}
		>
			{@render children()}
		</div>
	</div>
</header>

<style>
	.header-border {
		d: var(--header-border-flat);
		transition: d var(--header-transition-ms, 500ms) ease-in-out;
	}

	.header-border-custom {
		d: var(--header-border-notched);
	}

	.header-shape {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%, 0 100%, 0 100%, 0 100%);
		transition: clip-path var(--header-transition-ms, 500ms) ease-in-out;
	}

	.header-shape-custom {
		clip-path: polygon(
			0 0,
			100% 0,
			100% var(--nav-bar-middle-y),
			var(--nav-diagonal-right) var(--nav-bar-middle-y),
			var(--nav-notch-right) var(--nav-notch-bottom-y),
			var(--nav-notch-left) var(--nav-notch-bottom-y),
			var(--nav-diagonal-left) var(--nav-bar-middle-y),
			0 var(--nav-bar-middle-y)
		);
	}

	@media (prefers-reduced-motion: reduce) {
		.header-border,
		.header-shape {
			transition: none;
		}
	}
</style>
