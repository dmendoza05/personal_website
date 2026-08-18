import { describe, expect, it } from 'vitest';
import { assembleDashboardResponse, parseDashboardQuery } from './dashboard-query';

describe('parseDashboardQuery', () => {
	it('defaults to 7d', () => {
		expect(parseDashboardQuery(new URLSearchParams())).toEqual({ kind: 'preset', window: '7d' });
		expect(parseDashboardQuery(new URLSearchParams('range=bogus'))).toEqual({
			kind: 'preset',
			window: '7d'
		});
	});

	it('accepts named presets', () => {
		expect(parseDashboardQuery(new URLSearchParams('range=30d'))).toEqual({
			kind: 'preset',
			window: '30d'
		});
		expect(parseDashboardQuery(new URLSearchParams('range=90d'))).toEqual({
			kind: 'preset',
			window: '90d'
		});
		expect(parseDashboardQuery(new URLSearchParams('range=lifetime'))).toEqual({
			kind: 'preset',
			window: 'lifetime'
		});
	});

	it('parses custom from/to', () => {
		expect(parseDashboardQuery(new URLSearchParams('from=2026-08-01&to=2026-08-13'))).toEqual({
			kind: 'custom',
			start: '2026-08-01',
			end: '2026-08-13'
		});
	});

	it('rejects invalid custom ranges', () => {
		expect(() => parseDashboardQuery(new URLSearchParams('from=2026-08-13&to=2026-08-01'))).toThrow(
			/Invalid from\/to/
		);
		expect(() => parseDashboardQuery(new URLSearchParams('from=nope&to=2026-08-01'))).toThrow(
			/Invalid from\/to/
		);
	});
});

describe('assembleDashboardResponse', () => {
	const timeseries = [
		{ date: '2026-08-12', uniqueVisitors: 8, pageVisits: 22 },
		{ date: '2026-08-13', uniqueVisitors: 12, pageVisits: 30 }
	];

	it('sums page visits for presets and keeps range uniques', () => {
		const result = assembleDashboardResponse({
			window: '7d',
			start: '2026-08-07',
			end: '2026-08-13',
			timeseries,
			rangeUnique: 18,
			lifetimeUnique: 400,
			fetchedAt: new Date('2026-08-13T06:00:00.000Z')
		});

		expect(result.lifetimeUniqueVisitors).toBe(400);
		expect(result.range).toEqual({
			window: '7d',
			start: '2026-08-07',
			end: '2026-08-13',
			uniqueVisitors: 18,
			pageVisits: 52,
			fetchedAt: '2026-08-13T06:00:00.000Z'
		});
		expect(result.timeseries).toHaveLength(7);
		expect(result.timeseries[0]).toEqual({
			date: '2026-08-07',
			uniqueVisitors: 0,
			pageVisits: 0
		});
		expect(result.timeseries.at(-1)).toEqual(timeseries[1]);
		expect(result.devices).toEqual([
			{ device: 'desktop', requests: 0 },
			{ device: 'mobile', requests: 0 },
			{ device: 'other', requests: 0 }
		]);
	});

	it('leaves custom unique visitors null', () => {
		const result = assembleDashboardResponse({
			window: 'custom',
			start: '2026-08-12',
			end: '2026-08-13',
			timeseries,
			rangeUnique: null,
			lifetimeUnique: 400,
			fetchedAt: null
		});

		expect(result.range.uniqueVisitors).toBeNull();
		expect(result.range.pageVisits).toBe(52);
		expect(result.range.fetchedAt).toBe('');
	});
});
