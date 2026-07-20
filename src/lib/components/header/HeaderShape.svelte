<script lang="ts">
	import type { Snippet } from 'svelte';

	const NOTCH_INSET_RATIO = 0.2;

	let {
		revealed = false,
		content,
		nav,
		children
	}: {
		revealed?: boolean;
		content: HTMLElement | undefined;
		nav: HTMLElement | undefined;
		children: Snippet;
	} = $props();

	let shapeEl: HTMLDivElement;
	let navNotchLeft = $state('20%');
	let navNotchRight = $state('80%');
	let navDiagonalLeft = $state('20%');
	let navDiagonalRight = $state('80%');
	let navBarMiddleY = $state('50%');
	let navNotchBottomY = $state('100%');

	$effect(() => {
		const shape = shapeEl;
		const contentEl = content;
		const navEl = nav;
		if (!shape || !contentEl || !navEl) return;

		let animationFrame = 0;

		function scheduleShapeUpdate() {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(updateHeaderShape);
		}

		const observer = new ResizeObserver(scheduleShapeUpdate);
		observer.observe(shape);
		observer.observe(contentEl);
		observer.observe(navEl);
		scheduleShapeUpdate();

		return () => {
			cancelAnimationFrame(animationFrame);
			observer.disconnect();
		};
	});

	function updateHeaderShape() {
		if (!content || !nav) return;

		const shapeRect = shapeEl.getBoundingClientRect();
		const contentRect = content.getBoundingClientRect();
		const navRect = nav.getBoundingClientRect();
		if (!shapeRect.width || !shapeRect.height || !contentRect.width) return;

		const contentLeft = contentRect.left - shapeRect.left;
		const navNotchLeftPx = contentLeft + contentRect.width * NOTCH_INSET_RATIO;
		const navNotchRightPx = contentLeft + contentRect.width * (1 - NOTCH_INSET_RATIO);
		const navBarMiddleYPx = shapeRect.height / 2;
		const navNotchBottomYPx =
			navRect.height > 0
				? Math.min(shapeRect.height, navRect.bottom - shapeRect.top)
				: shapeRect.height;
		const diagonalRun = Math.max(0, navNotchBottomYPx - navBarMiddleYPx);

		navNotchLeft = `${navNotchLeftPx}px`;
		navNotchRight = `${navNotchRightPx}px`;
		navDiagonalLeft = `${Math.max(0, navNotchLeftPx - diagonalRun)}px`;
		navDiagonalRight = `${Math.min(shapeRect.width, navNotchRightPx + diagonalRun)}px`;
		navBarMiddleY = `${navBarMiddleYPx}px`;
		navNotchBottomY = `${navNotchBottomYPx}px`;
	}
</script>

<header id="header" class="header-outline fixed top-0 z-50 w-dvw">
	<div
		bind:this={shapeEl}
		class:header-shape-custom={revealed}
		class="header-shape w-dvw bg-background/60 backdrop-blur-xs"
		style:--nav-notch-left={navNotchLeft}
		style:--nav-notch-right={navNotchRight}
		style:--nav-diagonal-left={navDiagonalLeft}
		style:--nav-diagonal-right={navDiagonalRight}
		style:--nav-bar-middle-y={navBarMiddleY}
		style:--nav-notch-bottom-y={navNotchBottomY}
	>
		{@render children()}
	</div>
</header>

<style>
	/* Border can't follow a clip-path, so trace the shaped edge with a drop-shadow instead. */
	.header-outline {
		filter: drop-shadow(0 1px 0 var(--border));
	}

	.header-shape {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%, 0 100%, 0 100%, 0 100%);
		transition: clip-path 500ms ease-in-out;
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
		.header-shape {
			transition: none;
		}
	}
</style>
