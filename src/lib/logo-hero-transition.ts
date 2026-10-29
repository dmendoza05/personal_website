export const LOGO_HERO_NAME = 'logo-hero';

export type LogoHeroMode = 'fullname' | 'initials';
export type LogoHeroDirection = 'to-header' | 'to-home';

let mode: LogoHeroMode = 'initials';
let heroDone: Promise<void> = Promise.resolve();

export function logoHeroModeFrom(state: string): LogoHeroMode {
	return state.startsWith('fullname') ? 'fullname' : 'initials';
}

export function setLogoHeroMode(next: LogoHeroMode) {
	mode = next;
}

export function getLogoHeroMode(): LogoHeroMode {
	return mode;
}

export function isHomePath(pathname: string): boolean {
	return normalizePath(pathname) === '/';
}

/** Routes whose header shows the site logo that shares the home hero. */
export function isLogoHeroPath(pathname: string): boolean {
	const path = normalizePath(pathname);
	return path === '/dashboard' || /^\/(about|works|blog)(\/|$)/.test(path);
}

export function canLogoHero(): boolean {
	return (
		!prefersReducedMotion() && typeof document !== 'undefined' && !!document.startViewTransition
	);
}

export function whenLogoHeroFinished(): Promise<void> {
	return heroDone;
}

export function startLogoHeroTransition(
	complete: Promise<void>,
	direction: LogoHeroDirection
): Promise<void> | void {
	if (!canLogoHero()) return;

	let settle = () => {};
	heroDone = new Promise<void>((resolve) => {
		settle = resolve;
	});

	return new Promise((resolve) => {
		const update = async () => {
			resolve();
			await complete;
		};

		let transition: ViewTransition;
		try {
			transition = document.startViewTransition({
				update,
				types: [direction === 'to-header' ? 'logo-to-header' : 'logo-to-home']
			});
		} catch {
			try {
				transition = document.startViewTransition(update);
			} catch {
				settle();
				resolve();
				return;
			}
		}

		transition.finished.then(
			() => settle(),
			() => settle()
		);
	});
}

function normalizePath(pathname: string): string {
	if (!pathname) return '';
	const path = pathname.replace(/\/$/, '');
	return path || '/';
}

function prefersReducedMotion(): boolean {
	return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
