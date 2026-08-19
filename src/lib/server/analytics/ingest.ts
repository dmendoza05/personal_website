import { neon } from '@neondatabase/serverless';
import { and, count, eq } from 'drizzle-orm';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { analyticsDaily, analyticsDimensions, analyticsRollups } from '../db/schema';
import {
	BACKFILL_DAYS,
	INCREMENTAL_DAYS,
	ROLLUP_WINDOWS,
	backfillChunks,
	inclusiveWindow,
	rollupWindowBounds,
	shiftUtcDay,
	utcToday,
	type RollupWindow
} from './dates';
import {
	INCREMENTAL_QUERY,
	TIMESERIES_QUERY,
	DIMENSIONS_QUERY,
	filterPointsFrom,
	parseDailyPoints,
	parseDimensionRows,
	parseRollupUniques,
	postCloudflareGraphql,
	sumDailyUniques,
	uniquesLookMerged,
	type DailyPoint,
	type DimensionRow,
	type IngestFetch
} from './ingest-query';

export type IngestAnalyticsOptions = {
	databaseUrl: string;
	token: string;
	zoneId: string;
	fetchFn?: IngestFetch;
	now?: Date;
};

export type IngestAnalyticsResult = {
	backfilledDays: number;
	upsertedDays: number;
	rollupsStored: boolean;
	uniquesMerged: boolean | null;
	dimensionsStored: boolean;
};

const ingestSchema = { analyticsDaily, analyticsRollups, analyticsDimensions };
type IngestDb = NeonHttpDatabase<typeof ingestSchema>;

function createIngestDb(databaseUrl: string): IngestDb {
	return drizzle(neon(databaseUrl), { schema: ingestSchema });
}

async function fetchTimeseries(
	options: IngestAnalyticsOptions,
	start: string,
	end: string
): Promise<DailyPoint[]> {
	const payload = await postCloudflareGraphql({
		token: options.token,
		query: TIMESERIES_QUERY,
		variables: { zoneTag: options.zoneId, start, end },
		fetchFn: options.fetchFn
	});
	return parseDailyPoints(payload);
}

async function backfillDaily(
	db: IngestDb,
	options: IngestAnalyticsOptions,
	endDay: string,
	fetchedAt: Date
): Promise<number> {
	let backfilledDays = 0;

	for (const chunk of backfillChunks(endDay, BACKFILL_DAYS)) {
		const points = await fetchTimeseries(options, chunk.start, chunk.end);
		if (points.length === 0) continue;
		await upsertDailyPoints(db, points, fetchedAt);
		backfilledDays += points.length;
	}

	return backfilledDays;
}

async function runBatch(
	db: IngestDb,
	queries: Array<Parameters<IngestDb['batch']>[0][number]>
): Promise<void> {
	if (queries.length === 0) return;
	await db.batch(queries as [(typeof queries)[0], ...(typeof queries)[0][]]);
}

async function upsertDailyPoints(
	db: IngestDb,
	points: DailyPoint[],
	fetchedAt: Date
): Promise<void> {
	await runBatch(
		db,
		points.map((point) =>
			db
				.insert(analyticsDaily)
				.values({
					day: point.date,
					uniqueVisitors: point.uniqueVisitors,
					pageVisits: point.pageVisits,
					fetchedAt
				})
				.onConflictDoUpdate({
					target: analyticsDaily.day,
					set: {
						uniqueVisitors: point.uniqueVisitors,
						pageVisits: point.pageVisits,
						fetchedAt
					}
				})
		)
	);
}

async function upsertRollups(
	db: IngestDb,
	endDay: string,
	uniques: Partial<Record<RollupWindow, number>>,
	fetchedAt: Date
): Promise<void> {
	const rows = ROLLUP_WINDOWS.flatMap((window) => {
		const uniqueVisitors = uniques[window];
		if (typeof uniqueVisitors !== 'number') return [];
		const { start, end } = rollupWindowBounds(window, endDay);
		return [{ window, startDay: start, endDay: end, uniqueVisitors, fetchedAt }];
	});

	await runBatch(
		db,
		rows.map((row) =>
			db
				.insert(analyticsRollups)
				.values({
					window: row.window,
					startDay: row.startDay,
					endDay: row.endDay,
					uniqueVisitors: row.uniqueVisitors,
					fetchedAt
				})
				.onConflictDoUpdate({
					target: analyticsRollups.window,
					set: {
						startDay: row.startDay,
						endDay: row.endDay,
						uniqueVisitors: row.uniqueVisitors,
						fetchedAt
					}
				})
		)
	);
}

async function upsertDimensions(
	db: IngestDb,
	window: RollupWindow,
	rows: DimensionRow[],
	fetchedAt: Date
): Promise<void> {
	await db
		.delete(analyticsDimensions)
		.where(and(eq(analyticsDimensions.window, window), eq(analyticsDimensions.kind, 'country')));
	await db
		.delete(analyticsDimensions)
		.where(and(eq(analyticsDimensions.window, window), eq(analyticsDimensions.kind, 'device')));

	if (rows.length === 0) return;

	await runBatch(
		db,
		rows.map((row) =>
			db
				.insert(analyticsDimensions)
				.values({
					window,
					kind: row.kind,
					key: row.key,
					value: row.value,
					fetchedAt
				})
				.onConflictDoUpdate({
					target: [
						analyticsDimensions.window,
						analyticsDimensions.kind,
						analyticsDimensions.key
					],
					set: {
						value: row.value,
						fetchedAt
					}
				})
		)
	);
}

async function ingestDimensions(
	db: IngestDb,
	options: IngestAnalyticsOptions,
	start: string,
	end: string,
	fetchedAt: Date
): Promise<boolean> {
	try {
		const payload = await postCloudflareGraphql({
			token: options.token,
			query: DIMENSIONS_QUERY,
			variables: { zoneTag: options.zoneId, start, end },
			fetchFn: options.fetchFn
		});
		const rows = parseDimensionRows(payload);
		await upsertDimensions(db, '7d', rows, fetchedAt);
		return rows.length > 0;
	} catch (error) {
		console.warn('[analytics-ingest] Skipping country/device dimensions', {
			error: error instanceof Error ? error.message : String(error)
		});
		return false;
	}
}

export async function ingestAnalytics(
	options: IngestAnalyticsOptions
): Promise<IngestAnalyticsResult> {
	const { databaseUrl, token, zoneId } = options;
	if (!databaseUrl) throw new Error('DATABASE_URL is not set');
	if (!token) throw new Error('CF_ANALYTICS_TOKEN is not set');
	if (!zoneId) throw new Error('CF_ZONE_ID is not set');

	const db = createIngestDb(databaseUrl);
	const endDay = utcToday(options.now);
	const fetchedAt = options.now ?? new Date();

	const [countRow] = await db.select({ value: count() }).from(analyticsDaily);
	const existingDays = Number(countRow?.value ?? 0);

	let backfilledDays = 0;
	if (existingDays === 0) {
		backfilledDays = await backfillDaily(db, options, endDay, fetchedAt);
	}

	const seriesWindow = inclusiveWindow(endDay, 7);
	const upsertMinDay = shiftUtcDay(endDay, -(INCREMENTAL_DAYS - 1));
	const bounds7d = rollupWindowBounds('7d', endDay);
	const bounds30d = rollupWindowBounds('30d', endDay);
	const bounds90d = rollupWindowBounds('90d', endDay);
	const boundsLifetime = rollupWindowBounds('lifetime', endDay);

	const payload = await postCloudflareGraphql({
		token,
		query: INCREMENTAL_QUERY,
		variables: {
			zoneTag: zoneId,
			seriesStart: seriesWindow.start,
			end: endDay,
			start7d: bounds7d.start,
			start30d: bounds30d.start,
			start90d: bounds90d.start,
			startLifetime: boundsLifetime.start
		},
		fetchFn: options.fetchFn
	});

	const seriesPoints = parseDailyPoints(payload);
	const pointsToUpsert = filterPointsFrom(seriesPoints, upsertMinDay);
	await upsertDailyPoints(db, pointsToUpsert, fetchedAt);

	const rollupUniques = parseRollupUniques(payload);
	const dailySum7d = sumDailyUniques(seriesPoints);
	const unique7d = rollupUniques['7d'];
	const uniquesMerged =
		typeof unique7d === 'number' ? uniquesLookMerged(dailySum7d, unique7d) : null;
	const rollupsStored = uniquesMerged === true;

	if (rollupsStored) {
		await upsertRollups(db, endDay, rollupUniques, fetchedAt);
	} else if (unique7d !== undefined) {
		console.warn(
			'[analytics-ingest] Skipping rollups; window unique is not lower than the 7d daily sum',
			{ dailySum7d, unique7d }
		);
	}

	const dimensionsStored = await ingestDimensions(db, options, bounds7d.start, endDay, fetchedAt);

	return {
		backfilledDays,
		upsertedDays: pointsToUpsert.length,
		rollupsStored,
		uniquesMerged,
		dimensionsStored
	};
}
