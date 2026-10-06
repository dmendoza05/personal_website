import { describe, expect, it } from 'vitest';
import { countryAcronym, countryCode, countryFlag } from './country-codes';

describe('countryCode', () => {
	it('maps analytics names and globe names to the same code', () => {
		expect(countryCode('United States')).toBe('US');
		expect(countryCode('United States of America')).toBe('US');
		expect(countryCode('Czech Republic')).toBe('CZ');
		expect(countryCode('Czechia')).toBe('CZ');
		expect(countryCode('Dem. Rep. Congo')).toBe('CD');
		expect(countryCode("Côte d'Ivoire")).toBe('CI');
		expect(countryCode('Singapore')).toBe('SG');
	});

	it('returns an empty code when the country is not in the list', () => {
		expect(countryCode('Somaliland')).toBe('');
		expect(countryCode('')).toBe('');
	});
});

describe('countryFlag', () => {
	it('builds a flag emoji from the country code', () => {
		expect(countryFlag('Mexico')).toBe('🇲🇽');
	});
});

describe('countryAcronym', () => {
	it('uses the country code when one exists', () => {
		expect(countryAcronym('Japan')).toBe('JP');
	});

	it('falls back to initials when there is no code', () => {
		expect(countryAcronym('Somaliland')).toBe('SOM');
		expect(countryAcronym('N. Cyprus')).toBe('NC');
	});
});
