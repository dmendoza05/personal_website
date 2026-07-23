<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		HEADER_EXPANDED_CORNER_NOTCH_PX,
		HEADER_EXPANDED_MARGIN_PX,
		HEADER_TRANSITION_EASE,
		HEADER_TRANSITION_MS
	} from './header-state';

	const NAV_NOTCH_INSET_RATIO = 0.2;
	const FALLBACK_CLIP = 'polygon(0 0, 1px 0, 1px 1px, 1px 1px, 1px 1px, 0 1px, 0 1px, 0 1px)';

	let {
		revealed = false,
		content,
		height,
		transitionMs = HEADER_TRANSITION_MS,
		transitionEase = HEADER_TRANSITION_EASE,
		children
	}: {
		revealed?: boolean;
		content: HTMLElement | undefined;
		height: string;
		transitionMs?: number;
		transitionEase?: string;
		children: Snippet;
	} = $props();

	let shapeEl: HTMLDivElement;
	// Default = expanded (inset + 4 corner notches). Custom = nav bottom tab.
	let clipPathExpanded = $state(FALLBACK_CLIP);
	let clipPathNav = $state(FALLBACK_CLIP);
	let borderPathExpanded = $state("path('M0 0H1V1H0Z')");
	let borderPathNav = $state("path('M0 0H1V1H0Z')");
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
		const parsedHeight = height.endsWith('px') ? Number.parseFloat(height) : Number.NaN;
		const navNotchBottomYPx = Number.isFinite(parsedHeight) ? parsedHeight : contentRect.height;
		if (!shapeRect.width || !contentRect.width || !navNotchBottomYPx) return;

		const w = shapeRect.width;
		const h = shapeRect.height;

		// Expanded: inset from viewport + chamfered corners (8 points).
		const margin = HEADER_EXPANDED_MARGIN_PX;
		const left = margin;
		const right = w - margin;
		const top = margin;
		const bottom = h - margin;
		const notch = Math.min(
			HEADER_EXPANDED_CORNER_NOTCH_PX,
			Math.max(0, (right - left) / 4),
			Math.max(0, (bottom - top) / 4)
		);

		clipPathExpanded = `polygon(${left + notch}px ${top}px, ${right - notch}px ${top}px, ${right}px ${top + notch}px, ${right}px ${bottom - notch}px, ${right - notch}px ${bottom}px, ${left + notch}px ${bottom}px, ${left}px ${bottom - notch}px, ${left}px ${top + notch}px)`;
		borderPathExpanded = `path('M${left + notch} ${top}L${right - notch} ${top}L${right} ${top + notch}L${right} ${bottom - notch}L${right - notch} ${bottom}L${left + notch} ${bottom}L${left} ${bottom - notch}L${left} ${top + notch}Z')`;

		// Nav: full-bleed bar with center bottom tab (same 8-point order for morph).
		const contentLeft = contentRect.left - shapeRect.left;
		const navNotchLeftPx = contentLeft + contentRect.width * NAV_NOTCH_INSET_RATIO;
		const navNotchRightPx = contentLeft + contentRect.width * (1 - NAV_NOTCH_INSET_RATIO);
		const navBarMiddleYPx = navNotchBottomYPx / 2;
		const diagonalRun = Math.max(0, navNotchBottomYPx - navBarMiddleYPx);
		const navDiagonalLeftPx = Math.max(0, navNotchLeftPx - diagonalRun);
		const navDiagonalRightPx = Math.min(w, navNotchRightPx + diagonalRun);

		clipPathNav = `polygon(0 0, ${w}px 0, ${w}px ${navBarMiddleYPx}px, ${navDiagonalRightPx}px ${navBarMiddleYPx}px, ${navNotchRightPx}px ${navNotchBottomYPx}px, ${navNotchLeftPx}px ${navNotchBottomYPx}px, ${navDiagonalLeftPx}px ${navBarMiddleYPx}px, 0 ${navBarMiddleYPx}px)`;
		borderPathNav = `path('M0 0L${w} 0L${w} ${navBarMiddleYPx}L${navDiagonalRightPx} ${navBarMiddleYPx}L${navNotchRightPx} ${navNotchBottomYPx}L${navNotchLeftPx} ${navNotchBottomYPx}L${navDiagonalLeftPx} ${navBarMiddleYPx}L0 ${navBarMiddleYPx}Z')`;

		svgViewBox = `0 0 ${w} ${h}`;
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
				class:header-border-nav={revealed}
				class="header-border"
				fill="none"
				stroke="var(--svg-shape-stroke-color)"
				stroke-width="var(--svg-shape-stroke-width)"
				vector-effect="non-scaling-stroke"
				style:--header-transition-ms="{transitionMs}ms"
				style:--header-transition-ease={transitionEase}
				style:--header-border-expanded={borderPathExpanded}
				style:--header-border-nav={borderPathNav}
			/>
		</svg>
		<div
			bind:this={shapeEl}
			class:header-shape-nav={revealed}
			class="header-shape w-dvw bg-glass"
			style:--header-transition-ms="{transitionMs}ms"
			style:--header-transition-ease={transitionEase}
			style:--header-clip-expanded={clipPathExpanded}
			style:--header-clip-nav={clipPathNav}
		>
			{@render children()}
		</div>
	</div>
</header>
