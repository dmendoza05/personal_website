<script lang="ts">
	const DOT_GAP = 22;
	const BASE_RADIUS = 1;
	const MAX_RADIUS = 3.25;
	const INFLUENCE = 130;
	const PULL = 0.12;
	const LERP = 0.18;
	const INTRO_SWEEP = 900;
	const INTRO_FADE = 320;

	let canvasEl: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (!canvasEl) return;

		const canvas = canvasEl;
		const parentEl = canvas.parentElement;
		if (!parentEl) return;
		const parent: HTMLElement = parentEl;

		const rawCtx = canvas.getContext('2d');
		if (!rawCtx) return;
		const ctx: CanvasRenderingContext2D = rawCtx;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		let width = 0;
		let height = 0;
		let pointerX = -9999;
		let pointerY = -9999;
		let targetX = -9999;
		let targetY = -9999;
		let introStart = 0;
		let rafId = 0;
		let active = true;

		function localPoint(event: PointerEvent) {
			const rect = canvas.getBoundingClientRect();
			return {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};
		}

		function startIntro() {
			introStart = reducedMotion ? -Infinity : performance.now();
		}

		function resize() {
			const nextWidth = parent.clientWidth;
			const nextHeight = parent.clientHeight;
			if (nextWidth === width && nextHeight === height && width > 0) return;

			width = nextWidth;
			height = nextHeight;
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			startIntro();
		}

		function draw() {
			if (!active) return;

			if (!reducedMotion) {
				pointerX += (targetX - pointerX) * LERP;
				pointerY += (targetY - pointerY) * LERP;
			}

			ctx.clearRect(0, 0, width, height);

			const fg =
				getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#171717';
			ctx.fillStyle = fg;

			const cols = Math.max(1, Math.floor(width / DOT_GAP) + 1);
			const rows = Math.max(1, Math.floor(height / DOT_GAP) + 1);
			const offsetX = (width - (cols - 1) * DOT_GAP) / 2;
			const offsetY = (height - (rows - 1) * DOT_GAP) / 2;
			const reacting = !reducedMotion && targetX > -9000;
			const now = performance.now();
			const diagonal = Math.max(1, cols + rows - 2);

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const delay = ((col + row) / diagonal) * INTRO_SWEEP;
					const introT = Math.min(1, Math.max(0, (now - introStart - delay) / INTRO_FADE));
					if (introT <= 0) continue;

					const intro = introT * introT * (3 - 2 * introT);
					let x = offsetX + col * DOT_GAP;
					let y = offsetY + row * DOT_GAP;
					let radius = BASE_RADIUS * intro;
					let alpha = 0.22 * intro;

					if (reacting) {
						const dx = pointerX - x;
						const dy = pointerY - y;
						const dist = Math.hypot(dx, dy);

						if (dist < INFLUENCE) {
							const t = 1 - dist / INFLUENCE;
							const ease = t * t * (3 - 2 * t);
							radius = (BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * ease) * intro;
							alpha = (0.22 + 0.55 * ease) * intro;
							x += dx * PULL * ease;
							y += dy * PULL * ease;
						}
					}

					ctx.globalAlpha = alpha;
					ctx.beginPath();
					ctx.arc(x, y, radius, 0, Math.PI * 2);
					ctx.fill();
				}
			}

			ctx.globalAlpha = 1;
			rafId = requestAnimationFrame(draw);
		}

		function onPointerEnter(event: PointerEvent) {
			const { x, y } = localPoint(event);
			targetX = x;
			targetY = y;
			pointerX = x;
			pointerY = y;
		}

		function onPointerMove(event: PointerEvent) {
			const { x, y } = localPoint(event);
			targetX = x;
			targetY = y;
		}

		function onPointerLeave() {
			targetX = -9999;
			targetY = -9999;
		}

		resize();
		draw();

		const observer = new ResizeObserver(resize);
		observer.observe(parent);
		parent.addEventListener('pointerenter', onPointerEnter);
		parent.addEventListener('pointermove', onPointerMove);
		parent.addEventListener('pointerleave', onPointerLeave);

		return () => {
			active = false;
			cancelAnimationFrame(rafId);
			observer.disconnect();
			parent.removeEventListener('pointerenter', onPointerEnter);
			parent.removeEventListener('pointermove', onPointerMove);
			parent.removeEventListener('pointerleave', onPointerLeave);
		};
	});
</script>

<canvas
	bind:this={canvasEl}
	class="pointer-events-none absolute inset-0 z-0 h-full w-full"
	aria-hidden="true"
></canvas>
