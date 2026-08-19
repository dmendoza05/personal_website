import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IngestFetch, IngestGraphqlPayload } from './ingest-query';
import { INCREMENTAL_QUERY, TIMESERIES_QUERY, DIMENSIONS_QUERY } from './ingest-query';
import { backfillChunks, inclusiveWindow, rollupWindowBounds } from './dates';

const mocks = vi.hoisted(() => ({
	dayCount: 0,
	batch: vi.fn(async () => [])
}));

vi.mock('drizzle-orm/neon-http', () => ({
	drizzle: () => ({
		select: () => ({
			from: async () => [{ value: mocks.dayCount }]
		}),
		insert: () => ({
			values: () => ({
				onConflictDoUpdate: () => ({ kind: 'upsert' })
			})
		}),
		delete: () => ({
			where: async () => []
		}),
		batch: mocks.batch
	})
}));

vi.mock('@neondatabase/serverless', () => ({
	neon: () => ({})
}));

import { ingestAnalytics } from './ingest';

function graphqlPayload(unique7d: number): IngestGraphqlPayload {
	return {
		data: {
			viewer: {
				zones: [
					{
						timeseries: [
							{
								dimensions: { date: '2026-08-12' },
								uniq: { visitors: 10 },
								sum: { pageViews: 20 }
							},
							{
								dimensions: { date: '2026-08-13' },
								uniq: { visitors: 12 },
								sum: { pageViews: 30 }
							}
						],
						unique7d: [{ uniq: { visitors: unique7d } }],
						unique30d: [{ uniq: { visitors: 80 } }],
						unique90d: [{ uniq: { visitors: 200 } }],
						uniqueLifetime: [{ uniq: { visitors: 400 } }]
					}
				]
			}
		}
	};
}

function jsonResponse(payload: IngestGraphqlPayload): Response {
	return new Response(JSON.stringify(payload), { status: 200 });
}

type GraphqlRequest = { query?: string; variables?: Record<string, string> };

function mockFetch(unique7d: number) {
	return vi.fn<IngestFetch>(async () => jsonResponse(graphqlPayload(unique7d)));
}

function graphqlRequest(init: RequestInit | undefined): GraphqlRequest {
	return JSON.parse(String(init?.body ?? '{}')) as GraphqlRequest;
}

describe('ingestAnalytics', () => {
	beforeEach(() => {
		mocks.dayCount = 1;
		mocks.batch.mockClear();
	});

	it('backfills 90-day chunks then upserts the last 2 UTC days', async () => {
		mocks.dayCount = 0;
		const fetchFn = mockFetch(18);

		const result = await ingestAnalytics({
			databaseUrl: 'postgres://example',
			token: 'token',
			zoneId: 'zone',
			fetchFn,
			now: new Date('2026-08-13T06:00:00.000Z')
		});

		const timeseriesCalls = fetchFn.mock.calls.filter(
			([, init]) => graphqlRequest(init).query === TIMESERIES_QUERY
		);
		const incrementalCalls = fetchFn.mock.calls.filter(
			([, init]) => graphqlRequest(init).query === INCREMENTAL_QUERY
		);

		expect(timeseriesCalls).toHaveLength(backfillChunks('2026-08-13').length);
		expect(incrementalCalls).toHaveLength(1);
		expect(
			fetchFn.mock.calls.filter(([, init]) => graphqlRequest(init).query === DIMENSIONS_QUERY)
		).toHaveLength(1);
		expect(graphqlRequest(incrementalCalls[0]?.[1]).variables).toMatchObject({
			seriesStart: inclusiveWindow('2026-08-13', 7).start,
			end: '2026-08-13',
			start7d: rollupWindowBounds('7d', '2026-08-13').start,
			start30d: rollupWindowBounds('30d', '2026-08-13').start,
			start90d: rollupWindowBounds('90d', '2026-08-13').start,
			startLifetime: rollupWindowBounds('lifetime', '2026-08-13').start
		});
		expect(result.backfilledDays).toBe(backfillChunks('2026-08-13').length * 2);
		expect(result.upsertedDays).toBe(2);
		expect(result.uniquesMerged).toBe(true);
		expect(result.rollupsStored).toBe(true);
	});

	it('skips history refetch when daily rows already exist', async () => {
		const fetchFn = mockFetch(18);

		const result = await ingestAnalytics({
			databaseUrl: 'postgres://example',
			token: 'token',
			zoneId: 'zone',
			fetchFn,
			now: new Date('2026-08-13T06:00:00.000Z')
		});

		expect(fetchFn).toHaveBeenCalledTimes(2);
		expect(result.backfilledDays).toBe(0);
		expect(result.upsertedDays).toBe(2);
		expect(result.rollupsStored).toBe(true);
		expect(mocks.batch).toHaveBeenCalledTimes(2);
	});

	it('does not store rollups when the window unique equals the daily sum', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const fetchFn = mockFetch(22);

		const result = await ingestAnalytics({
			databaseUrl: 'postgres://example',
			token: 'token',
			zoneId: 'zone',
			fetchFn,
			now: new Date('2026-08-13T06:00:00.000Z')
		});

		expect(result.uniquesMerged).toBe(false);
		expect(result.rollupsStored).toBe(false);
		expect(mocks.batch).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});
