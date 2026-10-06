import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	PANEL_COUNT_MS,
	PANEL_LABEL_MS,
	PANEL_SHELL_MS,
	PANEL_SHELL_STAGGER_MS,
	runCountUp,
	schedulePanelPhases
} from './panel-motion';

describe('schedulePanelPhases', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('reveals the shell, then the label, then the content', () => {
		vi.useFakeTimers();
		const phases: string[] = [];
		schedulePanelPhases((phase) => phases.push(phase));

		expect(phases).toEqual(['shell']);
		vi.advanceTimersByTime(PANEL_SHELL_MS);
		expect(phases).toEqual(['shell', 'label']);
		vi.advanceTimersByTime(PANEL_LABEL_MS);
		expect(phases).toEqual(['shell', 'label', 'content']);
	});

	it('waits out the card stagger before the later panels continue', () => {
		vi.useFakeTimers();
		const phases: string[] = [];
		schedulePanelPhases((phase) => phases.push(phase), 2);

		vi.advanceTimersByTime(PANEL_SHELL_MS);
		expect(phases).toEqual(['shell']);
		vi.advanceTimersByTime(2 * PANEL_SHELL_STAGGER_MS);
		expect(phases).toEqual(['shell', 'label']);
	});
});

describe('runCountUp', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('reaches the target within the count duration', () => {
		let now = 0;
		const frames: FrameRequestCallback[] = [];
		vi.stubGlobal('performance', { now: () => now });
		vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
			frames.push(callback);
			return frames.length;
		});
		vi.stubGlobal('cancelAnimationFrame', () => {});

		const values: number[] = [];
		runCountUp(90, (value) => values.push(value));
		expect(values).toEqual([0]);

		now = PANEL_COUNT_MS / 2;
		frames.shift()?.(now);
		expect(values.at(-1)).toBe(45);

		now = PANEL_COUNT_MS;
		frames.shift()?.(now);
		expect(values.at(-1)).toBe(90);
		expect(frames).toHaveLength(0);
	});
});
