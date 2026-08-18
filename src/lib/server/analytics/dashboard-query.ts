import type {
	DashboardCountry,
	DashboardDevice,
	DashboardRange,
	DashboardResponse,
	DashboardTimeseriesPoint,
	DashboardTopPage
} from '../../dashboard';
import { eachUtcDay, isUtcDay } from './dates';

export const DASHBOARD_RANGES: DashboardRange[] = ['7d', '30d', '90d', 'lifetime'];

export type DashboardQuery =
	| { kind: 'preset'; window: DashboardRange }
	| { kind: 'custom'; start: string; end: string };

export class DashboardQueryError extends Error {
	status = 400;
}

export function parseDashboardQuery(search: URLSearchParams): DashboardQuery {
	const from = search.get('from');
	const to = search.get('to');

	if (from !== null || to !== null) {
		if (!from || !to || !isUtcDay(from) || !isUtcDay(to) || from > to) {
			throw new DashboardQueryError('Invalid from/to dates (use YYYY-MM-DD, from <= to)');
		}
		return { kind: 'custom', start: from, end: to };
	}

	const range = search.get('range');
	if (range && DASHBOARD_RANGES.includes(range as DashboardRange)) {
		return { kind: 'preset', window: range as DashboardRange };
	}

	return { kind: 'preset', window: '7d' };
}

export function fillTimeseries(
	points: DashboardTimeseriesPoint[],
	start: string,
	end: string
): DashboardTimeseriesPoint[] {
	const days = eachUtcDay(start, end);
	if (days.length === 0) return points;

	const byDate = new Map(points.map((point) => [point.date, point]));
	return days.map(
		(date) => byDate.get(date) ?? { date, uniqueVisitors: 0, pageVisits: 0 }
	);
}

export function assembleDashboardResponse(input: {
	window: DashboardRange | 'custom';
	start: string;
	end: string;
	timeseries: DashboardTimeseriesPoint[];
	rangeUnique: number | null;
	lifetimeUnique: number | null;
	fetchedAt: Date | string | null;
	topPages?: DashboardTopPage[];
	countries?: DashboardCountry[];
	devices?: DashboardDevice[];
}): DashboardResponse {
	const timeseries = fillTimeseries(input.timeseries, input.start, input.end);
	const pageVisits = timeseries.reduce((total, point) => total + point.pageVisits, 0);
	const fetchedAt =
		input.fetchedAt instanceof Date ? input.fetchedAt.toISOString() : (input.fetchedAt ?? '');

	return {
		lifetimeUniqueVisitors: input.lifetimeUnique,
		range: {
			window: input.window,
			start: input.start,
			end: input.end,
			uniqueVisitors: input.rangeUnique,
			pageVisits,
			fetchedAt
		},
		timeseries,
		topPages: input.topPages ?? [],
		countries: input.countries ?? [],
		devices: input.devices ?? [
			{ device: 'desktop', requests: 0 },
			{ device: 'mobile', requests: 0 },
			{ device: 'other', requests: 0 }
		]
	};
}
