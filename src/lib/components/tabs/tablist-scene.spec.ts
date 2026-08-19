import { afterEach, describe, expect, it, vi } from 'vitest';
import { getTablistParts, playTablistEnter, playTablistExit, revealTablist } from './tablist-scene';

function fakeRoot(tabs: unknown[], border: unknown) {
	return {
		querySelector: (selector: string) => (selector === '[data-tablist-border]' ? border : null),
		querySelectorAll: (selector: string) => (selector === '[role="tab"]' ? tabs : [])
	} as unknown as HTMLElement;
}

describe('tablist-scene', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('finds tabs and the tablist border', () => {
		const border = { id: 'border' };
		const tabs = [{ id: 'a' }, { id: 'b' }];

		expect(getTablistParts(fakeRoot(tabs, border))).toEqual({ border, tabs });
	});

	it('reveals tabs and the border', () => {
		const tab = { style: { opacity: '', transform: '' } };
		const border = { style: { transform: '' } };

		revealTablist(fakeRoot([tab], border));

		expect(tab.style.opacity).toBe('1');
		expect(tab.style.transform).toBe('none');
		expect(border.style.transform).toBe('scaleX(1)');
	});

	it('enters immediately when reduced motion is preferred', async () => {
		vi.stubGlobal('matchMedia', () => ({ matches: true }));

		const tab = { style: { opacity: '', transform: '' } };
		const border = { style: { transform: '' } };

		await playTablistEnter(fakeRoot([tab], border));

		expect(tab.style.opacity).toBe('1');
		expect(border.style.transform).toBe('scaleX(1)');
	});

	it('exits immediately when reduced motion is preferred', async () => {
		vi.stubGlobal('matchMedia', () => ({ matches: true }));

		await expect(playTablistExit(fakeRoot([], null))).resolves.toBeUndefined();
	});
});
