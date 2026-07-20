/** Below Tailwind `sm` (40rem / 640px). */
export const SM_VIEWPORT_QUERY = '(max-width: 639px)';

/** Keep height, logo, shape, and layout offset transitions in sync. */
export const HEADER_TRANSITION_MS = 500;

export type HeaderState = 'expanded' | 'nav' | 'compact';

export const HEADER_LOGO_HEIGHT = {
	expanded: 75,
	nav: 40,
	compact: 35
} as const satisfies Record<HeaderState, number>;

export const HEADER_HEIGHT = {
	expanded: '150px',
	nav: '125px',
	compact: '75px'
} as const satisfies Record<HeaderState, string>;

export function resolveHeaderState(pathname: string, isSmViewport: boolean): HeaderState {
	if (pathname === '/') return 'expanded';
	return isSmViewport ? 'compact' : 'nav';
}
