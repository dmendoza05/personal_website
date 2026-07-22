import { MD_VIEWPORT_QUERY } from './header-state';

/** Shared so Header height and main padding-top stay in sync. */
let expandedHeight = $state('100dvh');

export function getExpandedHeaderHeight(): string {
	return expandedHeight;
}

/** Call from layout `onMount`; returns cleanup. */
export function initExpandedHeaderHeight(): () => void {
	function sync() {
		const viewportHeight = window.innerHeight;
		const isMdUp = window.matchMedia(MD_VIEWPORT_QUERY).matches;
		expandedHeight = `${isMdUp ? viewportHeight / 3 : viewportHeight}px`;
	}

	sync();

	const mdQuery = window.matchMedia(MD_VIEWPORT_QUERY);
	mdQuery.addEventListener('change', sync);
	window.addEventListener('resize', sync);

	return () => {
		mdQuery.removeEventListener('change', sync);
		window.removeEventListener('resize', sync);
	};
}
