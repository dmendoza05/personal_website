<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { animate, splitText, stagger, type JSAnimation, type TextSplitter } from 'animejs';

	let {
		as = 'p',
		autoStart = true,
		children,
		class: className = '',
		duration = 100,
		loop = false,
		staggerMs = 20
	}: {
		as?: keyof HTMLElementTagNameMap;
		autoStart?: boolean;
		children: Snippet;
		class?: string;
		duration?: number;
		loop?: boolean;
		staggerMs?: number;
	} = $props();

	let el: HTMLElement | undefined = $state();
	let split: TextSplitter | undefined;
	let animation: JSAnimation | undefined;
	let ready = false;
	let pendingStart = false;

	onMount(() => {
		if (!el || prefersReducedMotion()) {
			ready = true;
			return;
		}

		const { words } = (split = splitText(el, {
			words: { wrap: 'clip' }
		}));

		animation = animate(words, {
			y: loop
				? [{ to: ['100%', '0%'] }, { to: '-100%', delay: 750, ease: 'in(3)' }]
				: [{ to: ['100%', '0%'] }, { to: '0%', delay: 750, ease: 'in(3)' }],
			duration,
			ease: 'easeInOut',
			delay: stagger(staggerMs),
			loop,
			autoplay: autoStart
		});

		ready = true;
		if (pendingStart) animation.play();
	});

	onDestroy(() => {
		animation?.pause();
		split?.revert();
	});

	/** Start (or resume) the word animation. No-op when reduced motion is preferred. */
	export function start() {
		if (prefersReducedMotion()) return;
		if (!ready || !animation) {
			pendingStart = true;
			return;
		}
		animation.play();
	}

	/** Restart the word animation from the beginning. */
	export function restart() {
		if (prefersReducedMotion()) return;
		if (!ready || !animation) {
			pendingStart = true;
			return;
		}
		animation.restart();
	}

	/** Pause a running animation. */
	export function pause() {
		pendingStart = false;
		animation?.pause();
	}

	function prefersReducedMotion(): boolean {
		return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	}
</script>

<svelte:element this={as} bind:this={el} class={className}>
	{@render children()}
</svelte:element>
