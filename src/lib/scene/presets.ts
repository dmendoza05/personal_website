export type ScenePreset = 'fade' | 'fadeUp' | 'fadeDown' | 'scale';

export type ScenePhase = 'enter' | 'exit';

export interface SceneMotion {
	opacity: [number, number];
	translateY?: [number, number];
	scale?: [number, number];
}

export interface ScenePresetConfig {
	duration: number;
	ease: {
		enter: string;
		exit: string;
	};
	enter: SceneMotion;
	exit: SceneMotion;
}

const FADE: SceneMotion = {
	opacity: [0, 1]
};

const FADE_UP: SceneMotion = {
	opacity: [0, 1],
	translateY: [16, 0]
};

const FADE_DOWN: SceneMotion = {
	opacity: [0, 1],
	translateY: [-16, 0]
};

const SCALE: SceneMotion = {
	opacity: [0, 1],
	scale: [0.97, 1]
};

export const DEFAULT_SCENE_PRESET: ScenePreset = 'fadeUp';

export const SCENE_PRESETS: Record<ScenePreset, ScenePresetConfig> = {
	fade: {
		duration: 280,
		ease: { enter: 'outCubic', exit: 'inCubic' },
		enter: FADE,
		exit: { opacity: [1, 0] }
	},
	fadeUp: {
		duration: 320,
		ease: { enter: 'outCubic', exit: 'inCubic' },
		enter: FADE_UP,
		exit: { opacity: [1, 0], translateY: [0, -12] }
	},
	fadeDown: {
		duration: 320,
		ease: { enter: 'outCubic', exit: 'inCubic' },
		enter: FADE_DOWN,
		exit: { opacity: [1, 0], translateY: [0, 12] }
	},
	scale: {
		duration: 300,
		ease: { enter: 'outCubic', exit: 'inCubic' },
		enter: SCALE,
		exit: { opacity: [1, 0], scale: [1, 0.97] }
	}
};

export function resolveScenePreset(preset: ScenePreset = DEFAULT_SCENE_PRESET): ScenePresetConfig {
	return SCENE_PRESETS[preset] ?? SCENE_PRESETS[DEFAULT_SCENE_PRESET];
}
