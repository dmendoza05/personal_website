<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { createTimeline, type Timeline } from 'animejs';
	import { m } from '$lib/paraglide/messages.js';

	let {
		onEnterStart,
		onEnterCompletes,
		onExitStart,
		onExitComplete,
		onRouteClick
	}: {
		onEnterStart?: () => void;
		onEnterCompletes?: () => void;
		onExitStart?: () => void;
		onExitComplete?: () => void;
		onRouteClick?: (event: MouseEvent) => void;
	} = $props();

	const PHASE_MS = 1000;
	const LABEL_FROM_Y = 16;
	const SEQUENCE_MS = PHASE_MS * 2;

	let labelEl: HTMLElement | undefined = $state();
	let trackEl: HTMLElement | undefined = $state();
	let entered = $state(false);
	let timeline: Timeline | undefined;

	onMount(() => {
		void playEnter();
	});

	onDestroy(() => {
		timeline?.pause();
	});

	const text = $derived(m.home_news_banner());
	const copies = $derived(Array.from({ length: 8 }, () => text));

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}

	function clearMotionInlineStyles() {
		if (labelEl) {
			labelEl.style.opacity = '';
			labelEl.style.transform = '';
		}
		if (trackEl) {
			trackEl.style.opacity = '';
			trackEl.style.width = '';
			trackEl.style.flex = '';
		}
	}

	function finishEnter() {
		clearMotionInlineStyles();
		entered = true;
		onEnterCompletes?.();
	}

	/**
	 * Enter animation (2s total; skipped when prefers-reduced-motion):
	 * 0. Initial — `.news-banner__label` opacity 0; `.news-banner__track` width 0 and opacity 0
	 * 1. 0–1s — label fades in from bottom (opacity + translateY)
	 * 2. 1–2s — track expands width to remaining space (and fades in)
	 *
	 * Exit animation — reverse of enter:
	 * 1. 0–1s — track collapses width to 0 (and fades out)
	 * 2. 1–2s — label fades out to bottom (opacity + translateY)
	 */
	function playEnter() {
		onEnterStart?.();

		if (!labelEl || !trackEl || prefersReducedMotion()) {
			finishEnter();
			return;
		}

		const row = labelEl.parentElement;
		const targetWidth = Math.max(0, (row?.clientWidth ?? 0) - labelEl.offsetWidth);

		labelEl.style.opacity = '0';
		labelEl.style.transform = `translateY(${LABEL_FROM_Y}px)`;
		trackEl.style.opacity = '0';
		trackEl.style.width = '0px';
		trackEl.style.flex = '0 0 auto';

		timeline = createTimeline({
			onComplete: finishEnter
		});

		timeline.add(labelEl, {
			opacity: [0, 1],
			translateY: [LABEL_FROM_Y, 0],
			duration: PHASE_MS,
			ease: 'outCubic'
		});

		timeline.add(trackEl, {
			opacity: [0, 1],
			width: ['0px', `${targetWidth}px`],
			duration: PHASE_MS,
			ease: 'outCubic'
		});
	}

	function playExit() {
		onExitStart?.();

		if (!labelEl || !trackEl || prefersReducedMotion()) {
			clearMotionInlineStyles();
			entered = false;
			onExitComplete?.();
			return;
		}

		timeline?.pause();

		const currentWidth = trackEl.getBoundingClientRect().width;
		trackEl.style.flex = '0 0 auto';
		trackEl.style.width = `${currentWidth}px`;
		trackEl.style.opacity = '1';
		labelEl.style.opacity = '1';
		labelEl.style.transform = 'translateY(0px)';

		timeline = createTimeline({
			onComplete: () => {
				clearMotionInlineStyles();
				entered = false;
				onExitComplete?.();
			}
		});

		timeline.add(trackEl, {
			opacity: [1, 0],
			width: [`${currentWidth}px`, '0px'],
			duration: PHASE_MS,
			ease: 'inCubic'
		});

		timeline.add(labelEl, {
			opacity: [1, 0],
			translateY: [0, LABEL_FROM_Y],
			duration: PHASE_MS,
			ease: 'inCubic'
		});
	}

	/** Custom outro so Svelte waits for the reverse animejs sequence before unmounting. */
	function bannerExit(_node: HTMLElement) {
		void playExit();
		return {
			duration: !labelEl || !trackEl || prefersReducedMotion() ? 0 : SEQUENCE_MS
		};
	}
</script>

<aside
	class="news-banner fixed inset-x-0 bottom-0 z-50 text-white"
	class:news-banner--entered={entered}
	aria-label={text}
	out:bannerExit
>
	<div class="flex items-stretch justify-center">
		<span
			bind:this={labelEl}
			class="news-banner__label flex shrink-0 items-center justify-center px-3 py-2 sm:px-4"
			aria-hidden="true"
		>
			<svg
				class="h-5 w-5 sm:h-6 sm:w-6"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<!-- antenna -->
				<path
					d="M12 3v3"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<circle cx="12" cy="2.25" r="1.25" fill="currentColor" />
				<!-- head -->
				<rect
					x="5.5"
					y="6"
					width="13"
					height="9"
					rx="2"
					stroke="currentColor"
					stroke-width="1.75"
				/>
				<!-- eyes -->
				<circle cx="9.25" cy="10.25" r="1.35" fill="currentColor" />
				<circle cx="14.75" cy="10.25" r="1.35" fill="currentColor" />
				<!-- mouth -->
				<path
					d="M9 13.25h6"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<!-- body -->
				<path
					d="M8.5 15v2.5c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V15"
					stroke="currentColor"
					stroke-width="1.75"
				/>
				<!-- arms -->
				<path
					d="M5.5 10.5H3.75c-.55 0-1 .45-1 1v3"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<path
					d="M18.5 10.5h1.75c.55 0 1 .45 1 1v3"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<!-- feet -->
				<path
					d="M9.5 18.5v2.25M14.5 18.5v2.25"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
			</svg>
		</span>

		<a
			bind:this={trackEl}
			href={resolve('/dashboard')}
			class="news-banner__track relative min-w-0 cursor-pointer overflow-hidden flex border-t border-white/10 bg-black/30 backdrop-blur-sm"
			aria-label={m.dashboard_title()}
			onclick={onRouteClick}
		>
			<div class="news-banner__marquee flex w-max" aria-hidden="true">
				{#each [0, 1] as set (set)}
					<div class="flex shrink-0 items-center">
						{#each copies as copy, i (`${set}-${i}`)}
							<span
								class="whitespace-nowrap px-6 text-sm font-semibold uppercase tracking-[0.35em] rajdhani sm:text-base"
							>
								{copy}
							</span>
							<span class="text-white/40">◆</span>
						{/each}
					</div>
				{/each}
			</div>
		</a>
	</div>
</aside>

<style>
	.news-banner__label {
		background: var(--accent);
		color: var(--accent-fg);
		opacity: 0;
		transform: translateY(16px);
	}

	.news-banner__track {
		flex: 0 0 auto;
		width: 0;
		opacity: 0;
	}

	.news-banner--entered .news-banner__label {
		opacity: 1;
		transform: none;
	}

	.news-banner--entered .news-banner__track {
		flex: 1 1 0%;
		width: auto;
		opacity: 1;
	}

	.news-banner__track::before,
	.news-banner__track::after {
		content: '';
		pointer-events: none;
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 1;
		width: 2.5rem;
	}

	.news-banner__track::before {
		left: 0;
		background: linear-gradient(to right, rgb(0 0 0 / 0.6), transparent);
	}

	.news-banner__track::after {
		right: 0;
		background: linear-gradient(to left, rgb(0 0 0 / 0.6), transparent);
	}

	.news-banner__marquee {
		animation: news-banner-ltr 28s linear infinite;
	}

	@keyframes news-banner-ltr {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.news-banner__label {
			opacity: 1;
			transform: none;
		}

		.news-banner__track {
			flex: 1 1 0%;
			width: auto;
			opacity: 1;
		}

		.news-banner__marquee {
			animation: none;
			transform: none;
		}
	}
</style>
