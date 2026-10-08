import { describe, expect, it } from 'vitest';
import { loadCountries } from '$lib/components/earth/vector-earth';
import {
	countriesMatch,
	countryAcronym,
	countryCode,
	countryFlag,
	findGlobeCountry
} from './country-codes';

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

	it('accepts an ISO code stored by analytics', () => {
		expect(countryCode('DE')).toBe('DE');
		expect(countryCode('DO')).toBe('DO');
		expect(countryCode('us')).toBe('US');
	});
});

describe('countryFlag', () => {
	it('builds a flag emoji from the country code', () => {
		expect(countryFlag('Mexico')).toBe('🇲🇽');
		expect(countryFlag('DE')).toBe('🇩🇪');
	});
});

describe('countryAcronym', () => {
	it('uses the country code when one exists', () => {
		expect(countryAcronym('Japan')).toBe('JP');
		expect(countryAcronym('DE')).toBe('DE');
		expect(countryAcronym('DO')).toBe('DO');
	});

	it('falls back to initials when there is no code', () => {
		expect(countryAcronym('Somaliland')).toBe('SOM');
		expect(countryAcronym('N. Cyprus')).toBe('NC');
	});
});

describe('findGlobeCountry', () => {
	it('matches an analytics ISO code to the globe name', () => {
		const globe = loadCountries();

		expect(findGlobeCountry(globe, 'DE')?.name).toBe('Germany');
		expect(findGlobeCountry(globe, 'US')?.name).toBe('United States of America');
		expect(findGlobeCountry(globe, 'NL')?.name).toBe('Netherlands');
		expect(findGlobeCountry(globe, 'United States')?.name).toBe('United States of America');
	});

	it('treats an ISO code and its globe name as the same country', () => {
		expect(countriesMatch('DE', 'Germany')).toBe(true);
		expect(countriesMatch('Germany', 'DE')).toBe(true);
		expect(countriesMatch('US', 'France')).toBe(false);
	});
});
