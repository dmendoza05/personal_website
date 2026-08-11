import type { Pathname } from '$app/types';
import { stagger } from 'animejs';
import { m } from '$lib/paraglide/messages.js';

/** Below Tailwind `md` (48rem / 768px) — compact icon header. */
export const SM_VIEWPORT_QUERY = '(max-width: 767px)';

/** Keep logo morph and staggered nav fades in sync. */
export const HEADER_TRANSITION_MS = 500;
/** Matches animejs `inOutCubic` used by the logo morph. */
export const HEADER_TRANSITION_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
export const HEADER_TRANSITION = `height ${HEADER_TRANSITION_MS}ms ${HEADER_TRANSITION_EASE}`;

export const FADE_MS = 600;
export const ROUTES_STAGGER_MS = 80;

export type HeaderState = 'nav' | 'compact';
export type NavIcon = 'works' | 'about' | 'blog';

export const HEADER_LOGO_HEIGHT = {
	nav: 40,
	compact: 35
} as const satisfies Record<HeaderState, number>;

export const HEADER_HEIGHT = {
	nav: '80px',
	compact: '64px'
} as const satisfies Record<HeaderState, string>;

export const NAV_ICON_PATHS: Record<NavIcon | 'resume', string> = {
	works:
		'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
	about: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
	blog: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
	resume: 'M12 3v12m0 0l-4-4m4 4l4-4M5 21h14'
};

export const NAV_ITEMS: { href: Pathname; label: () => string; icon: NavIcon }[] = [
	// hide this for now: { href: '/works', label: () => m.nav_works(), icon: 'works' },
	{ href: '/about', label: () => m.nav_about(), icon: 'about' },
	// hide this for now: { href: '/blog', label: () => m.nav_blog(), icon: 'blog' }
];

export const ROUTE_FADE_UP = {
	opacity: [0, 1],
	translateY: [-12, 0],
	delay: stagger(ROUTES_STAGGER_MS),
	duration: HEADER_TRANSITION_MS,
	ease: 'outCubic'
};

export const ROUTE_FADE_DOWN = {
	opacity: [1, 0],
	translateY: [0, -12],
	delay: stagger(ROUTES_STAGGER_MS),
	duration: HEADER_TRANSITION_MS,
	ease: 'inCubic'
};

export const LOGO_FADE_IN = {
	opacity: [0, 1],
	translateY: [-12, 0],
	duration: FADE_MS,
	ease: 'outCubic'
};

export const LOGO_FADE_OUT = {
	opacity: [1, 0],
	translateY: [0, -12],
	duration: FADE_MS,
	ease: 'inCubic'
};

export function resolveHeaderState(isSmViewport: boolean): HeaderState {
	return isSmViewport ? 'compact' : 'nav';
}
