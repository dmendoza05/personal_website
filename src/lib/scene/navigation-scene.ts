import { browser } from '$app/environment';
import { onNavigate } from '$app/navigation';
import {
	createSceneController,
	type SceneController,
	type SceneControllerOptions
} from './scene-controller';
import { DEFAULT_SCENE_PRESET } from './presets';

export interface NavigationSceneOptions extends SceneControllerOptions {
	/**
	 * When true, also animate when only the query string changes.
	 * Leave false so tab switches can own their own scene animation.
	 */
	includeSearch?: boolean;
}

/**
 * Wire animejs exit → swap → enter around SvelteKit navigations.
 * Call once from the root layout with a getter for the page scene root element.
 */
export function initNavigationScene(
	getRoot: () => HTMLElement | null | undefined,
	options: NavigationSceneOptions = {}
): SceneController {
	const controller = createSceneController({
		preset: options.preset ?? DEFAULT_SCENE_PRESET,
		duration: options.duration
	});

	if (!browser) return controller;

	const includeSearch = options.includeSearch ?? false;

	onNavigate((navigation) => {
		const from = navigation.from?.url;
		const to = navigation.to?.url;
		if (!from || !to) return;
		if (from.pathname === to.pathname && (!includeSearch || from.search === to.search)) return;

		const root = getRoot();
		if (!root) return;

		controller.setTarget(root);

		return new Promise<void>((resolve) => {
			void (async () => {
				await controller.exit(root);
				resolve();
				await navigation.complete;
				await controller.enter(root);
			})();
		});
	});

	return controller;
}
