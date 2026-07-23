import { describe, expect, it } from 'vitest';
import { DEFAULT_SCENE_PRESET, resolveScenePreset, SCENE_PRESETS } from './presets';

describe('resolveScenePreset', () => {
	it('returns the default fadeUp preset', () => {
		expect(resolveScenePreset()).toBe(SCENE_PRESETS[DEFAULT_SCENE_PRESET]);
	});

	it('returns a named preset', () => {
		expect(resolveScenePreset('scale')).toBe(SCENE_PRESETS.scale);
		expect(resolveScenePreset('scale').enter.scale).toEqual([0.97, 1]);
	});
});
