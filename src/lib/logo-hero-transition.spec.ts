import { describe, expect, it } from 'vitest';
import { isHomePath, isLogoHeroPath, logoHeroModeFrom } from './logo-hero-transition';

describe('logoHeroModeFrom', () => {
	it('reads the settled or playing logo mode', () => {
		expect(logoHeroModeFrom('fullname-default')).toBe('fullname');
		expect(logoHeroModeFrom('fullname-playing')).toBe('fullname');
		expect(logoHeroModeFrom('initials-default')).toBe('initials');
		expect(logoHeroModeFrom('initials-playing')).toBe('initials');
	});
});

describe('isHomePath', () => {
	it('matches the home page only', () => {
		expect(isHomePath('/')).toBe(true);
		expect(isHomePath('')).toBe(false);
		expect(isHomePath('/about')).toBe(false);
	});
});

describe('isLogoHeroPath', () => {
	it('matches pages that show the header logo', () => {
		expect(isLogoHeroPath('/about')).toBe(true);
		expect(isLogoHeroPath('/about/')).toBe(true);
		expect(isLogoHeroPath('/works')).toBe(true);
		expect(isLogoHeroPath('/works/personal-website')).toBe(true);
		expect(isLogoHeroPath('/blog')).toBe(true);
		expect(isLogoHeroPath('/blog/note')).toBe(true);
		expect(isLogoHeroPath('/dashboard')).toBe(true);
	});

	it('skips pages without the shared header logo', () => {
		expect(isLogoHeroPath('/')).toBe(false);
		expect(isLogoHeroPath('')).toBe(false);
		expect(isLogoHeroPath('/dashboard/extra')).toBe(false);
	});
});
