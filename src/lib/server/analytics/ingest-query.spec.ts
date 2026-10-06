import { describe, expect, it } from 'vitest';
import {
	COUNTRY_PAGEVIEWS_QUERY,
	DEVICES_QUERY,
	DIMENSIONS_QUERY,
	INCREMENTAL_QUERY,
	TIMESERIES_QUERY,
	filterPointsFrom,
	parseDailyPoints,
	parseDimensionRows,
	parseRollupUniques,
	sumDailyUniques,
	uniquesLookMerged,
	type IngestGraphqlPayload
} from './ingest-query';

const payload: IngestGraphqlPayload = {
	data: {
		viewer: {
			zones: [
				{
					timeseries: [
						{
							dimensions: { date: '2026-08-11' },
							uniq: { visitors: 10 },
							sum: { pageViews: 40 }
						},
						{
							dimensions: { date: '2026-08-12' },
							uniq: { visitors: 8 },
							sum: { pageViews: 22 }
						},
						{
							dimensions: { date: '2026-08-13' },
							uniq: { visitors: 12 },
							sum: { pageViews: 30 }
						}
					],
					unique7d: [{ uniq: { visitors: 24 } }],
					unique30d: [{ uniq: { visitors: 80 } }],
					unique90d: [{ uniq: { visitors: 200 } }],
					uniqueLifetime: [{ uniq: { visitors: 400 } }]
				}
			]
		}
	}
};

describe('parseDimensionRows', () => {
	it('sums country requests across days and buckets device types', () => {
		const rows = parseDimensionRows({
			data: {
				viewer: {
					zones: [
						{
							countries: [
								{
									sum: {
										countryMap: [
											{ clientCountryName: 'United States', requests: 12 },
											{ clientCountryName: 'Mexico', requests: 0 }
										]
									}
								},
								{
									sum: {
										countryMap: [
											{ clientCountryName: 'United States', requests: 8 },
											{ clientCountryName: 'Mexico', requests: 4 }
										]
									}
								}
							],
							devices: [
								{ sum: { requests: 12 }, dimensions: { clientDeviceType: 'desktop' } },
								{ sum: { requests: 5 }, dimensions: { clientDeviceType: 'tablet' } }
							]
						}
					]
				}
			}
		});

		expect(rows).toEqual([
			{ kind: 'country', key: 'United States', value: 20 },
			{ kind: 'country', key: 'Mexico', value: 4 },
			{ kind: 'device', key: 'desktop', value: 12 },
			{ kind: 'device', key: 'other', value: 5 }
		]);
	});

	it('estimates device requests from sampled adaptive groups', () => {
		const rows = parseDimensionRows({
			data: {
				viewer: {
					zones: [
						{
							devices: [
								{
									count: 10,
									avg: { sampleInterval: 1 },
									dimensions: { clientDeviceType: 'desktop' }
								},
								{
									count: 4,
									avg: { sampleInterval: 2 },
									dimensions: { clientDeviceType: 'mobile' }
								},
								{
									count: 1,
									avg: { sampleInterval: 1 },
									dimensions: { clientDeviceType: 'tablet' }
								}
							]
						}
					]
				}
			}
		});

		expect(rows).toEqual([
			{ kind: 'device', key: 'desktop', value: 10 },
			{ kind: 'device', key: 'mobile', value: 8 },
			{ kind: 'device', key: 'other', value: 1 }
		]);
	});

	it('sums page views for each country, including countries with no requests', () => {
		const rows = parseDimensionRows({
			data: {
				viewer: {
					zones: [
						{
							countries: [
								{
									dimensions: { clientCountryName: 'United States' },
									sum: { requests: 12, pageViews: 3 }
								},
								{
									dimensions: { clientCountryName: 'United States' },
									sum: { requests: 8, pageViews: 2 }
								},
								{
									dimensions: { clientCountryName: 'Mexico' },
									sum: { requests: 0, pageViews: 4 }
								}
							]
						}
					]
				}
			}
		});

		expect(rows).toEqual([
			{ kind: 'country', key: 'United States', value: 20 },
			{ kind: 'country_pageview', key: 'United States', value: 5 },
			{ kind: 'country_pageview', key: 'Mexico', value: 4 }
		]);
	});

	it('estimates country page views from sampled html responses', () => {
		const rows = parseDimensionRows({
			data: {
				viewer: {
					zones: [
						{
							countries: [
								{
									dimensions: { clientCountryName: 'US' },
									sum: { requests: 20 }
								}
							],
							countryPageViews: [
								{
									dimensions: { clientCountryName: 'US' },
									count: 4,
									avg: { sampleInterval: 1 }
								},
								{
									dimensions: { clientCountryName: 'MX' },
									count: 2,
									avg: { sampleInterval: 3 }
								}
							]
						}
					]
				}
			}
		});

		expect(rows).toEqual([
			{ kind: 'country', key: 'US', value: 20 },
			{ kind: 'country_pageview', key: 'US', value: 4 },
			{ kind: 'country_pageview', key: 'MX', value: 6 }
		]);
	});
});

describe('parseDailyPoints', () => {
	it('maps unique visitors and page visits', () => {
		expect(parseDailyPoints(payload)).toEqual([
			{ date: '2026-08-11', uniqueVisitors: 10, pageVisits: 40 },
			{ date: '2026-08-12', uniqueVisitors: 8, pageVisits: 22 },
			{ date: '2026-08-13', uniqueVisitors: 12, pageVisits: 30 }
		]);
	});

	it('throws when the zone is missing', () => {
		expect(() => parseDailyPoints({ data: { viewer: { zones: [] } } })).toThrow(
			'No zone analytics data returned'
		);
	});
});

describe('parseRollupUniques', () => {
	it('reads each named window unique', () => {
		expect(parseRollupUniques(payload)).toEqual({
			'7d': 24,
			'30d': 80,
			'90d': 200,
			lifetime: 400
		});
	});
});

describe('uniquesLookMerged', () => {
	it('is true when the window unique is below the daily sum', () => {
		expect(uniquesLookMerged(30, 24)).toBe(true);
		expect(uniquesLookMerged(30, 30)).toBe(false);
		expect(uniquesLookMerged(0, 0)).toBe(false);
	});
});

describe('filterPointsFrom', () => {
	it('keeps points on or after the min day', () => {
		const points = parseDailyPoints(payload);
		expect(filterPointsFrom(points, '2026-08-12')).toEqual([
			{ date: '2026-08-12', uniqueVisitors: 8, pageVisits: 22 },
			{ date: '2026-08-13', uniqueVisitors: 12, pageVisits: 30 }
		]);
	});
});

describe('sumDailyUniques', () => {
	it('sums daily unique counts', () => {
		expect(sumDailyUniques(parseDailyPoints(payload))).toBe(30);
	});
});

describe('GraphQL documents', () => {
	it('fetches daily uniques and page visits without requests or bandwidth', () => {
		expect(TIMESERIES_QUERY).toContain('uniq { uniques }');
		expect(TIMESERIES_QUERY).toContain('sum { pageViews }');
		expect(TIMESERIES_QUERY).toContain('dimensions { date }');
		expect(TIMESERIES_QUERY).not.toMatch(/\brequests\b/);
		expect(TIMESERIES_QUERY).not.toMatch(/\bbytes\b/);
	});

	it('loads timeseries and preset uniques in one incremental document', () => {
		expect(INCREMENTAL_QUERY).toContain('timeseries: httpRequests1dGroups');
		expect(INCREMENTAL_QUERY).toContain('unique7d: httpRequests1dGroups');
		expect(INCREMENTAL_QUERY).toContain('unique30d: httpRequests1dGroups');
		expect(INCREMENTAL_QUERY).toContain('unique90d: httpRequests1dGroups');
		expect(INCREMENTAL_QUERY).toContain('uniqueLifetime: httpRequests1dGroups');

		const uniqueSection = INCREMENTAL_QUERY.slice(INCREMENTAL_QUERY.indexOf('unique7d:'));
		expect(uniqueSection).not.toContain('dimensions');
	});

	it('loads country requests from daily groups and page views from html responses', () => {
		expect(DIMENSIONS_QUERY).toContain('clientCountryName');
		expect(DIMENSIONS_QUERY).toContain('requests');
		expect(DIMENSIONS_QUERY).not.toContain('pageViews');
		expect(DIMENSIONS_QUERY).not.toContain('clientDeviceType');

		expect(COUNTRY_PAGEVIEWS_QUERY).toContain('httpRequestsAdaptiveGroups');
		expect(COUNTRY_PAGEVIEWS_QUERY).toContain('edgeResponseContentTypeName: "html"');
		expect(COUNTRY_PAGEVIEWS_QUERY).toContain('edgeResponseStatus: 200');
		expect(COUNTRY_PAGEVIEWS_QUERY).toContain('requestSource: "eyeball"');
		expect(COUNTRY_PAGEVIEWS_QUERY).toContain('sampleInterval');
		expect(COUNTRY_PAGEVIEWS_QUERY).toContain('clientCountryName');

		expect(DEVICES_QUERY).toContain('httpRequestsAdaptiveGroups');
		expect(DEVICES_QUERY).toContain('clientDeviceType');
		expect(DEVICES_QUERY).toContain('sampleInterval');
		expect(DEVICES_QUERY).toContain('requestSource: "eyeball"');
	});
});
