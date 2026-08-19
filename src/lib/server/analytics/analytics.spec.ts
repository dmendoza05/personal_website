import { describe, expect, it } from 'vitest';
import { buildAnalyticsResponse, parseRange } from './index';

describe('parseRange', () => {
	it('defaults to 7d', () => {
		expect(parseRange(null)).toBe('7d');
		expect(parseRange('bogus')).toBe('7d');
	});

	it('accepts 30d', () => {
		expect(parseRange('30d')).toBe('30d');
	});
});

describe('buildAnalyticsResponse', () => {
	it('aggregates totals and maps countries', () => {
		const result = buildAnalyticsResponse(
			{
				data: {
					viewer: {
						zones: [
							{
								timeseries: [
									{
										dimensions: { date: '2026-08-01' },
										sum: { requests: 10, pageViews: 4, bytes: 1000, threats: 1 },
										uniq: { visitors: 3 }
									},
									{
										dimensions: { date: '2026-08-02' },
										sum: { requests: 20, pageViews: 6, bytes: 2000, threats: 0 },
										uniq: { visitors: 5 }
									}
								],
								countries: [
									{
										dimensions: { clientCountryName: 'United States' },
										sum: { requests: 25 }
									},
									{
										dimensions: { clientCountryName: 'Mexico' },
										sum: { requests: 5 }
									}
								]
							}
						]
					}
				}
			},
			'7d',
			'2026-08-01',
			'2026-08-02'
		);

		expect(result.totals).toEqual({
			requests: 30,
			pageViews: 10,
			visitors: 8,
			bandwidthBytes: 3000,
			threats: 1
		});
		expect(result.timeseries).toHaveLength(2);
		expect(result.topCountries).toEqual([
			{ country: 'United States', requests: 25 },
			{ country: 'Mexico', requests: 5 }
		]);
	});
});
