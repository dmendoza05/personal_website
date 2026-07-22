/** Below Tailwind `sm` (40rem / 640px). */
export const SM_VIEWPORT_QUERY = '(max-width: 639px)';

/** Tailwind `md` and up (48rem / 768px) — expanded header is one-third viewport. */
export const MD_VIEWPORT_QUERY = '(min-width: 768px)';

/** Keep height, logo, shape, and layout offset transitions in sync. */
export const HEADER_TRANSITION_MS = 500;
/** Matches animejs `inOutCubic` used by the logo morph. */
export const HEADER_TRANSITION_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
export const HEADER_TRANSITION = `height ${HEADER_TRANSITION_MS}ms ${HEADER_TRANSITION_EASE}`;

export type HeaderState = 'expanded' | 'nav' | 'compact';

export const HEADER_LOGO_HEIGHT = {
	expanded: 75,
	nav: 40,
	compact: 35
} as const satisfies Record<HeaderState, number>;

/** Expanded header: gap from viewport edge to shape edge. */
export const HEADER_EXPANDED_MARGIN_PX = 25;
/** Expanded header: chamfer size on each corner. */
export const HEADER_EXPANDED_CORNER_NOTCH_PX = 28;

/** Expanded height fallback; runtime uses px via `expandedHeaderHeightPx()`. */
export const HEADER_HEIGHT_EXPANDED = '100dvh';

export const HEADER_HEIGHT = {
	expanded: HEADER_HEIGHT_EXPANDED,
	nav: '125px',
	compact: '75px'
} as const satisfies Record<HeaderState, string>;

export function resolveHeaderState(pathname: string, isSmViewport: boolean): HeaderState {
	if (pathname === '/') return 'expanded';
	return isSmViewport ? 'compact' : 'nav';
}
