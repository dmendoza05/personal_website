import { and, asc, desc, eq, gte, lte } from 'drizzle-orm';
import type {
	DashboardCountry,
	DashboardDevice,
	DashboardResponse,
	DashboardTimeseriesPoint,
	DashboardTopPage
} from '$lib/dashboard';
import { normalizeDevices } from '$lib/dashboard';
import { getDb } from './index';
import { analyticsDaily, analyticsDimensions, analyticsRollups } from './schema';
import { getTopPages } from './pageviews';
import { rollupWindowBounds, utcToday, type RollupWindow } from '../analytics/dates';
import { assembleDashboardResponse, type DashboardQuery } from '../analytics/dashboard-query';

export {
	parseDashboardQuery,
	DashboardQueryError,
	assembleDashboardResponse
} from '../analytics/dashboard-query';
export type { DashboardQuery } from '../analytics/dashboard-query';

function asDayString(value: unknown): string {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	return String(value);
}

async function loadTimeseries(start: string, end: string): Promise<DashboardTimeseriesPoint[]> {
	const db = getDb();
	const rows = await db
		.select({
			day: analyticsDaily.day,
			uniqueVisitors: analyticsDaily.uniqueVisitors,
			pageVisits: analyticsDaily.pageVisits
		})
		.from(analyticsDaily)
		.where(and(gte(analyticsDaily.day, start), lte(analyticsDaily.day, end)))
		.orderBy(asc(analyticsDaily.day));

	return rows.map((row) => ({
		date: asDayString(row.day),
		uniqueVisitors: row.uniqueVisitors,
		pageVisits: row.pageVisits
	}));
}

async function loadRollup(window: RollupWindow) {
	const db = getDb();
	const [row] = await db.select().from(analyticsRollups).where(eq(analyticsRollups.window, window));
	return row ?? null;
}

async function latestFetchedAt(start: string, end: string): Promise<Date | null> {
	const db = getDb();
	const [row] = await db
		.select({ fetchedAt: analyticsDaily.fetchedAt })
		.from(analyticsDaily)
		.where(and(gte(analyticsDaily.day, start), lte(analyticsDaily.day, end)))
		.orderBy(desc(analyticsDaily.fetchedAt))
		.limit(1);

	return row?.fetchedAt ?? null;
}

async function loadCountries(window: RollupWindow = '7d'): Promise<DashboardCountry[]> {
	const db = getDb();
	const rows = await db
		.select({
			country: analyticsDimensions.key,
			requests: analyticsDimensions.value
		})
		.from(analyticsDimensions)
		.where(and(eq(analyticsDimensions.window, window), eq(analyticsDimensions.kind, 'country')))
		.orderBy(desc(analyticsDimensions.value))
		.limit(8);

	return rows.map((row) => ({ country: row.country, requests: row.requests }));
}

async function loadDevices(window: RollupWindow = '7d'): Promise<DashboardDevice[]> {
	const db = getDb();
	const rows = await db
		.select({
			device: analyticsDimensions.key,
			requests: analyticsDimensions.value
		})
		.from(analyticsDimensions)
		.where(and(eq(analyticsDimensions.window, window), eq(analyticsDimensions.kind, 'device')));

	return normalizeDevices(rows);
}

async function loadBreakdowns(): Promise<{
	topPages: DashboardTopPage[];
	countries: DashboardCountry[];
	devices: DashboardDevice[];
}> {
	const topPages = await getTopPages(8).catch(() => [] as DashboardTopPage[]);

	try {
		const [countries, devices] = await Promise.all([loadCountries(), loadDevices()]);
		return { topPages, countries, devices };
	} catch {
		return { topPages, countries: [], devices: normalizeDevices([]) };
	}
}

export async function getDashboardPayload(query: DashboardQuery): Promise<DashboardResponse> {
	const lifetime = await loadRollup('lifetime');
	const lifetimeUnique = lifetime?.uniqueVisitors ?? null;
	const breakdowns = await loadBreakdowns();

	if (query.kind === 'custom') {
		const timeseries = await loadTimeseries(query.start, query.end);
		const fetchedAt = (await latestFetchedAt(query.start, query.end)) ?? lifetime?.fetchedAt ?? null;
		return assembleDashboardResponse({
			window: 'custom',
			start: query.start,
			end: query.end,
			timeseries,
			rangeUnique: null,
			lifetimeUnique,
			fetchedAt,
			...breakdowns
		});
	}

	if (query.window === 'lifetime') {
		const timeseries = await loadTimeseries('0001-01-01', '9999-12-31');
		const start = timeseries[0]?.date ?? (lifetime ? asDayString(lifetime.startDay) : utcToday());
		const end = timeseries.at(-1)?.date ?? (lifetime ? asDayString(lifetime.endDay) : utcToday());
		const fetchedAt = lifetime?.fetchedAt ?? (await latestFetchedAt(start, end));
		return assembleDashboardResponse({
			window: 'lifetime',
			start,
			end,
			timeseries,
			rangeUnique: lifetimeUnique,
			lifetimeUnique,
			fetchedAt,
			...breakdowns
		});
	}

	const rollup = await loadRollup(query.window);
	const bounds = rollup
		? { start: asDayString(rollup.startDay), end: asDayString(rollup.endDay) }
		: rollupWindowBounds(query.window, utcToday());
	const timeseries = await loadTimeseries(bounds.start, bounds.end);
	const fetchedAt = rollup?.fetchedAt ?? (await latestFetchedAt(bounds.start, bounds.end));

	return assembleDashboardResponse({
		window: query.window,
		start: bounds.start,
		end: bounds.end,
		timeseries,
		rangeUnique: rollup?.uniqueVisitors ?? null,
		lifetimeUnique,
		fetchedAt,
		...breakdowns
	});
}
