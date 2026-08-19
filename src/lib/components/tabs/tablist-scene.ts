import { createTimeline, stagger, type Timeline } from 'animejs';

export const TAB_STAGGER_MS = 80;
export const TAB_DURATION_MS = 320;
export const TAB_BORDER_DURATION_MS = 280;

export function getTablistParts(root: HTMLElement) {
	return {
		border: root.querySelector<HTMLElement>('[data-tablist-border]'),
		tabs: root.querySelectorAll<HTMLElement>('[role="tab"]')
	};
}

function prefersReducedMotion(): boolean {
	return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function revealTablist(root: HTMLElement) {
	const { border, tabs } = getTablistParts(root);

	for (const tab of tabs) {
		tab.style.opacity = '1';
		tab.style.transform = 'none';
	}

	if (border) border.style.transform = 'scaleX(1)';
}

export function playTablistEnter(
	root: HTMLElement,
	onTimeline?: (timeline: Timeline) => void
): Promise<void> {
	if (prefersReducedMotion()) {
		revealTablist(root);
		return Promise.resolve();
	}

	const { border, tabs } = getTablistParts(root);

	if (!tabs.length && !border) return Promise.resolve();

	return playTimeline(onTimeline, (timeline) => {
		if (tabs.length) {
			timeline.add(tabs, {
				opacity: [0, 1],
				translateY: [-12, 0],
				delay: stagger(TAB_STAGGER_MS),
				duration: TAB_DURATION_MS,
				ease: 'outCubic'
			});
		}

		if (border) {
			timeline.add(border, {
				scaleX: [0, 1],
				duration: TAB_BORDER_DURATION_MS,
				ease: 'outCubic'
			});
		}
	});
}

export function playTablistExit(
	root: HTMLElement,
	onTimeline?: (timeline: Timeline) => void
): Promise<void> {
	if (prefersReducedMotion()) return Promise.resolve();

	const { border, tabs } = getTablistParts(root);

	if (!tabs.length && !border) return Promise.resolve();

	return playTimeline(onTimeline, (timeline) => {
		if (border) {
			timeline.add(border, {
				scaleX: 0,
				duration: TAB_BORDER_DURATION_MS,
				ease: 'inCubic'
			});
		}

		if (tabs.length) {
			timeline.add(Array.from(tabs).reverse(), {
				opacity: 0,
				translateY: -12,
				delay: stagger(TAB_STAGGER_MS),
				duration: TAB_DURATION_MS,
				ease: 'inCubic'
			});
		}
	});
}

function playTimeline(
	onTimeline: ((timeline: Timeline) => void) | undefined,
	build: (timeline: Timeline) => void
): Promise<void> {
	return new Promise((resolve) => {
		const timeline = createTimeline({
			onComplete: () => resolve()
		});

		onTimeline?.(timeline);
		build(timeline);
	});
}
