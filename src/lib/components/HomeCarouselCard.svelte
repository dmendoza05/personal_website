<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { site } from '$lib/data/site';
	import { m } from '$lib/paraglide/messages.js';

	type Slide = {
		id: string;
		href: Pathname;
		label: () => string;
		detail?: () => string;
	};

	let {
		class: className = '',
		element = $bindable(),
		onNavigate
	}: {
		class?: string;
		element?: HTMLElement;
		onNavigate?: (event: MouseEvent, href: Pathname) => void;
	} = $props();

	const artwork = '/whats-new/data-analytics.png';

	const INTERVAL_MS = 5600;
	const SWIPE_PX = 40;

	const domain = site.url.replace(/^https?:\/\//, '');

	const slides: Slide[] = [
		{
			id: 'analytics',
			href: '/dashboard',
			label: () => m.home_analytics_card()
		},
		// {
		// 	id: 'detail',
		// 	href: '/dashboard',
		// 	label: () => m.dashboard_description(),
		// 	detail: () => m.dashboard_description()
		// }
	];

	let index = $state(0);
	let stopped = $state(false);
	let pointerPaused = $state(false);
	let focusPaused = $state(false);
	let reduceMotion = $state(false);
	let viewport = $state<HTMLElement>();

	let tracking = false;
	let dragStart = 0;
	let dragMoved = false;
	let suppressClick = false;

	onMount(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = query.matches;

		function onMotionChange() {
			reduceMotion = query.matches;
		}

		query.addEventListener('change', onMotionChange);

		const region = element;
		const view = viewport;

		region?.addEventListener('mouseenter', pauseForPointer);
		region?.addEventListener('mouseleave', resumeForPointer);
		region?.addEventListener('focusin', pauseForFocus);
		region?.addEventListener('focusout', onFocusOut);
		region?.addEventListener('keydown', onKeydown);
		view?.addEventListener('pointerdown', onPointerDown);
		view?.addEventListener('pointermove', onPointerMove);
		view?.addEventListener('pointerup', onPointerUp);
		view?.addEventListener('pointercancel', onPointerCancel);

		const timer = window.setInterval(() => {
			if (slides.length < 2 || reduceMotion || stopped || pointerPaused || focusPaused) return;
			show(index + 1);
		}, INTERVAL_MS);

		return () => {
			query.removeEventListener('change', onMotionChange);
			region?.removeEventListener('mouseenter', pauseForPointer);
			region?.removeEventListener('mouseleave', resumeForPointer);
			region?.removeEventListener('focusin', pauseForFocus);
			region?.removeEventListener('focusout', onFocusOut);
			region?.removeEventListener('keydown', onKeydown);
			view?.removeEventListener('pointerdown', onPointerDown);
			view?.removeEventListener('pointermove', onPointerMove);
			view?.removeEventListener('pointerup', onPointerUp);
			view?.removeEventListener('pointercancel', onPointerCancel);
			window.clearInterval(timer);
		};
	});

	function pauseForPointer() {
		pointerPaused = true;
	}

	function resumeForPointer() {
		pointerPaused = false;
	}

	function pauseForFocus() {
		focusPaused = true;
	}

	function show(nextIndex: number) {
		index = (nextIndex + slides.length) % slides.length;
	}

	function previous() {
		show(index - 1);
	}

	function nextSlide() {
		show(index + 1);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

		event.preventDefault();
		if (event.key === 'ArrowLeft') previous();
		else nextSlide();
	}

	function onFocusOut(event: FocusEvent) {
		const next = event.relatedTarget;
		if (next instanceof Node && element?.contains(next)) return;
		focusPaused = false;
	}

	function onPointerDown(event: PointerEvent) {
		if (event.button !== 0) return;
		tracking = true;
		dragStart = event.clientX;
		dragMoved = false;
	}

	function onPointerMove(event: PointerEvent) {
		if (!tracking) return;
		if (Math.abs(event.clientX - dragStart) > 8) dragMoved = true;
	}

	function onPointerUp(event: PointerEvent) {
		if (!tracking) return;
		const delta = event.clientX - dragStart;
		tracking = false;
		if (!dragMoved) return;

		suppressClick = true;
		if (delta > SWIPE_PX) previous();
		else if (delta < -SWIPE_PX) nextSlide();
	}

	function onPointerCancel() {
		tracking = false;
		dragMoved = false;
	}

	function onSlideClick(event: MouseEvent, href: Pathname) {
		if (suppressClick) {
			event.preventDefault();
			suppressClick = false;
			return;
		}

		if (
			!onNavigate ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			event.button !== 0
		) {
			return;
		}

		event.preventDefault();
		onNavigate(event, href);
	}
</script>

<section
	bind:this={element}
	class="home-carousel {className}"
	aria-roledescription="carousel"
	aria-label={m.home_carousel_label()}
>
	<div bind:this={viewport} class="home-carousel__viewport">
		<div class="home-carousel__track" style:transform="translateX(-{index * 100}%)">
			{#each slides as slide, slideIndex (slide.id)}
				<a
					class="home-carousel__slide"
					href={resolve(slide.href)}
					aria-label={slide.label()}
					aria-hidden={slideIndex === index ? undefined : true}
					tabindex={slideIndex === index ? undefined : -1}
					onclick={(event) => onSlideClick(event, slide.href)}
				>
					<img class="home-carousel__art" src={artwork} alt="" draggable="false" />
					{#if slide.detail}
						<span class="home-carousel__veil">
							<span class="home-carousel__kicker rajdhani">{m.home_analytics_kicker()}</span>
							<span class="home-carousel__detail varela">{slide.detail()}</span>
							<span class="home-carousel__pill rajdhani">{domain}</span>
						</span>
					{/if}
				</a>
			{/each}
		</div>
	</div>

	<div class="home-carousel__controls">
		<button
			type="button"
			class="home-carousel__nav"
			aria-label={m.home_carousel_previous()}
			onclick={previous}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M14.5 6.5 9 12l5.5 5.5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		<div class="home-carousel__dots">
			{#each slides as slide, slideIndex (slide.id)}
				<button
					type="button"
					class="home-carousel__dot"
					aria-label={slide.label()}
					aria-current={slideIndex === index ? 'true' : undefined}
					onclick={() => show(slideIndex)}
				></button>
			{/each}
		</div>

		<button type="button" class="home-carousel__nav" aria-label={m.home_carousel_next()} onclick={nextSlide}>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M9.5 6.5 15 12l-5.5 5.5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		<button
			type="button"
			class="home-carousel__pause motion-reduce:hidden"
			aria-label={stopped ? m.home_carousel_play() : m.home_carousel_pause()}
			onclick={() => (stopped = !stopped)}
		>
			{#if stopped}
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M9 7.5v9l8-4.5-8-4.5Z" fill="currentColor" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M8 7h3v10H8V7Zm5 0h3v10h-3V7Z" fill="currentColor" />
				</svg>
			{/if}
		</button>
	</div>
</section>

<style>
	.home-carousel {
		position: relative;
		z-index: 20;
		width: 10rem;
		border: 1px solid color-mix(in srgb, white 22%, transparent);
		background: #05070d;
		box-shadow: 0 16px 40px rgb(0 0 0 / 45%);
		color: white;
	}

	.home-carousel:hover,
	.home-carousel:has(:focus-visible) {
		border-color: var(--accent);
	}

	.home-carousel__viewport {
		overflow: hidden;
		touch-action: pan-y;
	}

	.home-carousel__track {
		display: flex;
		transition: transform 500ms cubic-bezier(0.33, 1, 0.68, 1);
	}

	.home-carousel__slide {
		position: relative;
		display: block;
		flex: 0 0 100%;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}

	.home-carousel__slide:focus-visible {
		outline: none;
	}

	.home-carousel__art {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
	}

	.home-carousel__veil {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		inset: 0;
		padding: 1rem 0.85rem 2.35rem;
		background: #05070d;
		text-align: center;
	}

	.home-carousel__kicker {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		line-height: 1.25;
		text-transform: uppercase;
	}

	.home-carousel__pill {
		padding: 0.15rem 0.55rem;
		border-radius: 999px;
		background: white;
		color: black;
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.home-carousel__detail {
		max-width: 14rem;
		font-size: 0.78rem;
		line-height: 1.35;
	}

	.home-carousel__controls {
		position: absolute;
		z-index: 2;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.15rem;
		padding: 0.85rem 0.2rem 0.2rem;
		background: linear-gradient(to top, rgb(0 0 0 / 55%), transparent);
	}

	.home-carousel__nav,
	.home-carousel__pause {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: white;
		cursor: pointer;
	}

	.home-carousel__nav svg,
	.home-carousel__pause svg {
		width: 0.9rem;
		height: 0.9rem;
	}

	.home-carousel__dots {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.home-carousel__dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.home-carousel__dot::after {
		display: block;
		width: 0.38rem;
		height: 0.38rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 45%);
		content: '';
	}

	.home-carousel__dot[aria-current='true']::after {
		background: white;
	}

	@media (min-width: 48rem) {
		.home-carousel {
			width: 12rem;
		}
	}

	@media (max-height: 45rem) {
		.home-carousel {
			width: 7.25rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.home-carousel__track {
			transition: none;
		}
	}
</style>
