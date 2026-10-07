import { describe, expect, it } from 'vitest';
import { awayPhrase, milesFromLosAngeles, nearestMile } from './distance-from-la';

describe('milesFromLosAngeles', () => {
	it('is zero at downtown Los Angeles', () => {
		expect(milesFromLosAngeles(34.0522, -118.2437)).toBe(0);
	});

	it('puts Glendale a few miles away', () => {
		expect(nearestMile(milesFromLosAngeles(34.137, -118.2376))).toBe(6);
	});

	it('puts New York about 2,446 miles away', () => {
		expect(nearestMile(milesFromLosAngeles(40.7128, -74.006))).toBe(2446);
	});
});

describe('awayPhrase', () => {
	it('keeps the gag when the location is unknown', () => {
		expect(awayPhrase(null)).toBe('1 mile');
	});

	it('says less than a mile under half a mile', () => {
		expect(awayPhrase(0.2)).toBe('less than a mile');
	});

	it('uses the singular for one mile', () => {
		expect(awayPhrase(1.2)).toBe('1 mile');
	});

	it('formats longer distances with a thousands separator', () => {
		expect(awayPhrase(2445.6)).toBe('2,446 miles');
	});
});
