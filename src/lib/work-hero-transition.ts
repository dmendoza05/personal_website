export const WORK_HERO_NAME = 'work-hero';

export function workSlug(pathname: string): string | null {
	const match = pathname.match(/(?:^|\/)works\/([^/]+)\/?$/);
	if (!match?.[1]) return null;
	return decodeURIComponent(match[1]);
}

export function isWorksIndex(pathname: string): boolean {
	return /(?:^|\/)works\/?$/.test(pathname);
}

export function startWorkHeroTransition(complete: Promise<void>): Promise<void> | void {
	if (prefersReducedMotion() || !document.startViewTransition) return;

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await complete;
		});
	});
}

function prefersReducedMotion(): boolean {
	return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
