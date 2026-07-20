/** Below Tailwind `sm` (40rem / 640px). */
export const SM_VIEWPORT_QUERY = '(max-width: 639px)';

export type HeaderState = 'expanded' | 'nav' | 'compact';

export const HEADER_LOGO_HEIGHT = {
	expanded: 75,
	nav: 40,
	compact: 35
} as const satisfies Record<HeaderState, number>;

export const HEADER_HEIGHT = {
	expanded: {
		min: '10dvh',
		max: '25dvh'
	},
	nav: '125px',
	compact: '75px'
} as const;

export function resolveHeaderState(pathname: string, isSmViewport: boolean): HeaderState {
	if (pathname === '/') return 'expanded';
	return isSmViewport ? 'compact' : 'nav';
}
