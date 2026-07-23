import { animate, type JSAnimation } from 'animejs';
import {
	DEFAULT_SCENE_PRESET,
	resolveScenePreset,
	type SceneMotion,
	type ScenePhase,
	type ScenePreset
} from './presets';

export type SceneHandler = (el: HTMLElement) => void | Promise<void>;

export interface SceneControllerOptions {
	preset?: ScenePreset;
	duration?: number;
}

export interface SceneController {
	/** Bind the animated element (or pass it to enter/exit directly). */
	setTarget: (el: HTMLElement | null) => void;
	/** Svelte attachment: `<div {@attach scene.attach}>`. */
	attach: (el: HTMLElement) => () => void;
	enter: SceneHandler;
	exit: SceneHandler;
}

function prefersReducedMotion(): boolean {
	return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function applyMotionStyles(el: HTMLElement, motion: SceneMotion, end: 'from' | 'to') {
	const index = end === 'from' ? 0 : 1;
	el.style.opacity = String(motion.opacity[index]);

	const transforms: string[] = [];
	if (motion.translateY) transforms.push(`translateY(${motion.translateY[index]}px)`);
	if (motion.scale) transforms.push(`scale(${motion.scale[index]})`);
	el.style.transform = transforms.length ? transforms.join(' ') : '';
}

function clearMotionStyles(el: HTMLElement) {
	el.style.opacity = '';
	el.style.transform = '';
}

function motionToAnimeParams(motion: SceneMotion): Record<string, [number, number]> {
	const params: Record<string, [number, number]> = {
		opacity: motion.opacity
	};
	if (motion.translateY) params.translateY = motion.translateY;
	if (motion.scale) params.scale = motion.scale;
	return params;
}

/**
 * Play a one-shot enter/exit animation on an element.
 * Safe to await — returns after the animation completes (or immediately if reduced motion).
 */
export async function playScene(
	el: HTMLElement,
	phase: ScenePhase,
	options: SceneControllerOptions = {}
): Promise<void> {
	const config = resolveScenePreset(options.preset ?? DEFAULT_SCENE_PRESET);
	const motion = config[phase];
	const duration = options.duration ?? config.duration;

	if (prefersReducedMotion()) {
		applyMotionStyles(el, motion, 'to');
		if (phase === 'enter') clearMotionStyles(el);
		return;
	}

	if (phase === 'enter') applyMotionStyles(el, motion, 'from');

	const animation = animate(el, {
		...motionToAnimeParams(motion),
		duration,
		ease: config.ease[phase]
	});

	await animation;

	if (phase === 'enter') clearMotionStyles(el);
}

export function sceneEnter(
	el: HTMLElement,
	preset: ScenePreset = DEFAULT_SCENE_PRESET,
	duration?: number
): Promise<void> {
	return playScene(el, 'enter', { preset, duration });
}

export function sceneExit(
	el: HTMLElement,
	preset: ScenePreset = DEFAULT_SCENE_PRESET,
	duration?: number
): Promise<void> {
	return playScene(el, 'exit', { preset, duration });
}

/**
 * Stateful controller for a single scene root.
 * Prefer this when the same element is entered/exited repeatedly (tabs, page shell).
 */
export function createSceneController(options: SceneControllerOptions = {}): SceneController {
	let target: HTMLElement | null = null;
	let running: JSAnimation | null = null;

	function setTarget(el: HTMLElement | null) {
		target = el;
	}

	function attach(el: HTMLElement) {
		setTarget(el);
		return () => {
			if (target === el) setTarget(null);
		};
	}

	async function run(phase: ScenePhase, el?: HTMLElement) {
		const node = el ?? target;
		if (!node) return;

		running?.pause();
		running = null;

		const config = resolveScenePreset(options.preset ?? DEFAULT_SCENE_PRESET);
		const motion = config[phase];
		const duration = options.duration ?? config.duration;

		if (prefersReducedMotion()) {
			applyMotionStyles(node, motion, 'to');
			if (phase === 'enter') clearMotionStyles(node);
			return;
		}

		if (phase === 'enter') applyMotionStyles(node, motion, 'from');

		const animation = animate(node, {
			...motionToAnimeParams(motion),
			duration,
			ease: config.ease[phase]
		});
		running = animation;

		await animation;

		if (running === animation) running = null;
		if (phase === 'enter') clearMotionStyles(node);
	}

	return {
		setTarget,
		attach,
		enter: (el) => run('enter', el),
		exit: (el) => run('exit', el)
	};
}
