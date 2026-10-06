export const PANEL_SHELL_MS = 1000;
export const PANEL_SHELL_STAGGER_MS = 340;
export const PANEL_LABEL_MS = 400;
export const PANEL_COUNT_MS = 300;
export const PANEL_STAGGER_MS = 150;

export type PanelPhase = 'shell' | 'label' | 'content';

export function prefersReducedMotion(): boolean {
	return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Shell, then the label, then the rest of the panel. `index` staggers the slide. */
export function schedulePanelPhases(
	onPhase: (phase: PanelPhase) => void,
	index = 0
): () => void {
	if (prefersReducedMotion()) {
		onPhase('content');
		return () => {};
	}

	const delay = index * PANEL_SHELL_STAGGER_MS;
	onPhase('shell');
	const labelTimer = setTimeout(() => onPhase('label'), delay + PANEL_SHELL_MS);
	const contentTimer = setTimeout(
		() => onPhase('content'),
		delay + PANEL_SHELL_MS + PANEL_LABEL_MS
	);

	return () => {
		clearTimeout(labelTimer);
		clearTimeout(contentTimer);
	};
}

/** Count from 0 to `target` in `PANEL_COUNT_MS`. Returns a cancel function. */
export function runCountUp(target: number, onValue: (value: number) => void): () => void {
	const goal = Math.max(0, Math.round(target));
	if (prefersReducedMotion() || goal === 0) {
		onValue(goal);
		return () => {};
	}

	onValue(0);
	const start = performance.now();
	let frame = 0;

	const step = (now: number) => {
		const progress = Math.min((now - start) / PANEL_COUNT_MS, 1);
		onValue(Math.round(goal * progress));
		if (progress < 1) frame = requestAnimationFrame(step);
	};

	frame = requestAnimationFrame(step);
	return () => cancelAnimationFrame(frame);
}
