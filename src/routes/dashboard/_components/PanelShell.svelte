<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PANEL_SHELL_MS, PANEL_SHELL_STAGGER_MS, prefersReducedMotion } from './panel-motion';

	let {
		class: className = '',
		shell = 0,
		label,
		children
	}: {
		class?: string;
		shell?: number;
		label: string;
		children: Snippet;
	} = $props();

	const EASE = 'cubic-bezier(0.33, 1, 0.68, 1)';

	let frame = $state<HTMLDivElement>();
	let sectionEl = $state<HTMLElement>();

	$effect(() => {
		const node = frame;
		const shellEl = sectionEl;
		const index = shell;
		if (!node || !shellEl) return;

		if (prefersReducedMotion()) return;

		const entranceAt = performance.now();
		const startAt = index * PANEL_SHELL_STAGGER_MS;
		const endAt = startAt + PANEL_SHELL_MS;
		let animation: Animation | undefined;
		let generation = 0;
		let target = -1;
		let primed = false;

		const grow = (next: number, delay: number, duration: number) => {
			const from = shellEl.getBoundingClientRect().height;
			shellEl.style.height = `${from}px`;
			animation?.cancel();
			if (duration < 16 || Math.abs(from - next) <= 1) {
				shellEl.style.height = `${next}px`;
				return;
			}

			const id = ++generation;
			animation = shellEl.animate([{ height: `${from}px` }, { height: `${next}px` }], {
				duration,
				delay,
				easing: EASE,
				fill: 'forwards'
			});
			animation.onfinish = () => {
				if (id !== generation || !shellEl.isConnected) return;
				shellEl.style.height = `${next}px`;
				animation?.cancel();
				animation = undefined;
			};
		};

		const apply = () => {
			const next = contentHeight(shellEl, node);
			if (Math.abs(next - target) <= 1) return;
			target = next;

			const elapsed = performance.now() - entranceAt;
			if (elapsed < endAt - 16) {
				const delay = Math.max(0, startAt - elapsed);
				grow(next, delay, endAt - Math.max(elapsed, startAt));
				return;
			}

			grow(next, 0, 500);
		};

		shellEl.style.height = '0px';
		const observer = new ResizeObserver(() => {
			if (!primed) return;
			apply();
		});
		observer.observe(node);
		const kick = requestAnimationFrame(() => {
			primed = true;
			apply();
		});

		return () => {
			observer.disconnect();
			cancelAnimationFrame(kick);
			generation += 1;
			animation?.cancel();
		};
	});

	function contentHeight(shellEl: HTMLElement, node: HTMLElement): number {
		const style = getComputedStyle(shellEl);
		const border =
			Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth);
		const next = Math.ceil(node.offsetHeight + (Number.isFinite(border) ? border : 0));
		const max = Number.parseFloat(style.maxHeight);
		return Number.isFinite(max) ? Math.min(next, Math.ceil(max)) : next;
	}
</script>

<section
	bind:this={sectionEl}
	class="panel-shell {className}"
	style:--shell={shell}
	aria-label={label}
>
	<div bind:this={frame}>
		{@render children()}
	</div>
</section>
