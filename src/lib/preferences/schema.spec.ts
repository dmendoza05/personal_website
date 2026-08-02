import { describe, expect, it } from 'vitest';
import {
	DEFAULT_PREFERENCES,
	DEFAULT_SECTION_DESCRIPTION_OPEN,
	isSectionDescriptionOpen,
	parsePreferences,
	serializePreferences
} from './schema';

describe('parsePreferences', () => {
	it('returns defaults for null or empty input', () => {
		expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
		expect(parsePreferences('')).toEqual(DEFAULT_PREFERENCES);
	});

	it('returns defaults for invalid JSON', () => {
		expect(parsePreferences('{')).toEqual(DEFAULT_PREFERENCES);
		expect(parsePreferences('[]')).toEqual(DEFAULT_PREFERENCES);
	});

	it('parses per-section toggles and ignores invalid entries', () => {
		expect(
			parsePreferences(
				JSON.stringify({
					sectionDescriptionsOpen: { about: false, blog: true, bad: 'yes' },
					extra: 1
				})
			)
		).toEqual({
			sectionDescriptionsOpen: { about: false, blog: true }
		});
	});

	it('falls back when sectionDescriptionsOpen has the wrong type', () => {
		expect(parsePreferences(JSON.stringify({ sectionDescriptionsOpen: false }))).toEqual(
			DEFAULT_PREFERENCES
		);
	});
});

describe('serializePreferences', () => {
	it('round-trips through parsePreferences', () => {
		const next = { sectionDescriptionsOpen: { about: false, works: true } };
		expect(parsePreferences(serializePreferences(next))).toEqual(next);
	});
});

describe('isSectionDescriptionOpen', () => {
	it('defaults to open when a section has no saved value', () => {
		expect(isSectionDescriptionOpen(DEFAULT_PREFERENCES, 'about')).toBe(
			DEFAULT_SECTION_DESCRIPTION_OPEN
		);
	});

	it('returns the saved value when present', () => {
		expect(
			isSectionDescriptionOpen({ sectionDescriptionsOpen: { about: false } }, 'about')
		).toBe(false);
	});
});
