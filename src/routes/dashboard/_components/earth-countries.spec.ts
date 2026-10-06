import { describe, expect, it } from 'vitest';
import type { DashboardCountry } from '$lib/dashboard';
import { findCountryStats } from './earth-countries';

const countries: DashboardCountry[] = [
	{ country: 'United States', requests: 20, pageViews: 5 },
	{ country: 'Czech Republic', requests: 4, pageViews: 1 },
	{ country: 'Democratic Republic of the Congo', requests: 2, pageViews: 1 },
	{ country: "Côte d'Ivoire", requests: 3, pageViews: 2 }
];

describe('findCountryStats', () => {
	it('matches a country by its analytics name', () => {
		expect(findCountryStats(countries, 'United States')).toEqual(countries[0]);
	});

	it('matches globe names to analytics names', () => {
		expect(findCountryStats(countries, 'United States of America')).toEqual(countries[0]);
		expect(findCountryStats(countries, 'Czechia')).toEqual(countries[1]);
		expect(findCountryStats(countries, 'Dem. Rep. Congo')).toEqual(countries[2]);
		expect(findCountryStats(countries, "Cote d'Ivoire")).toEqual(countries[3]);
	});

	it('returns null when the country has no analytics row', () => {
		expect(findCountryStats(countries, '')).toBeNull();
		expect(findCountryStats(countries, 'Antarctica')).toBeNull();
	});
});
