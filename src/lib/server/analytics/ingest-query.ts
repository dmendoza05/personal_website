import type { RollupWindow } from './dates';
import { bucketDevice } from '../../dashboard';

export const CLOUDFLARE_GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

export type DailyPoint = {
	date: string;
	uniqueVisitors: number;
	pageVisits: number;
};

type CountryMapEntry = {
	clientCountryName?: string | null;
	requests?: number | null;
	pageViews?: number | null;
};

type GraphqlGroup = {
	count?: number | null;
	avg?: { sampleInterval?: number | null } | null;
	sum?: {
		pageViews?: number | null;
		requests?: number | null;
		countryMap?: CountryMapEntry[] | null;
	} | null;
	uniq?: { uniques?: number | null; visitors?: number | null } | null;
	dimensions?: {
		date?: string | null;
		clientCountryName?: string | null;
		clientDeviceType?: string | null;
	} | null;
};

export type IngestGraphqlPayload = {
	data?: {
		viewer?: {
			zones?: Array<{
				timeseries?: GraphqlGroup[] | null;
				unique7d?: GraphqlGroup[] | null;
				unique30d?: GraphqlGroup[] | null;
				unique90d?: GraphqlGroup[] | null;
				uniqueLifetime?: GraphqlGroup[] | null;
				countries?: GraphqlGroup[] | null;
				countryPageViews?: GraphqlGroup[] | null;
				devices?: GraphqlGroup[] | null;
			}> | null;
		} | null;
	} | null;
	errors?: Array<{ message?: string }> | null;
};

export const TIMESERIES_QUERY = `
query ($zoneTag: String!, $start: Date!, $end: Date!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      timeseries: httpRequests1dGroups(
        limit: 100
        filter: { date_geq: $start, date_leq: $end }
        orderBy: [date_ASC]
      ) {
        uniq { uniques }
        sum { pageViews }
        dimensions { date }
      }
    }
  }
}
`;

export const INCREMENTAL_QUERY = `
query (
  $zoneTag: String!
  $seriesStart: Date!
  $end: Date!
  $start7d: Date!
  $start30d: Date!
  $start90d: Date!
  $startLifetime: Date!
) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      timeseries: httpRequests1dGroups(
        limit: 10
        filter: { date_geq: $seriesStart, date_leq: $end }
        orderBy: [date_ASC]
      ) {
        uniq { uniques }
        sum { pageViews }
        dimensions { date }
      }
      unique7d: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $start7d, date_leq: $end }
      ) {
        uniq { uniques }
      }
      unique30d: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $start30d, date_leq: $end }
      ) {
        uniq { uniques }
      }
      unique90d: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $start90d, date_leq: $end }
      ) {
        uniq { uniques }
      }
      uniqueLifetime: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $startLifetime, date_leq: $end }
      ) {
        uniq { uniques }
      }
    }
  }
}
`;

export const DIMENSIONS_QUERY = `
query ($zoneTag: String!, $start: Date!, $end: Date!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      countries: httpRequests1dGroups(
        limit: 1000
        filter: { date_geq: $start, date_leq: $end }
        orderBy: [sum_requests_DESC]
      ) {
        sum {
          requests
        }
        dimensions {
          clientCountryName
        }
      }
    }
  }
}
`;

/**
 * Daily `httpRequests1dGroups.pageViews` is a zone total and stays empty when
 * grouped by country. Page views are successful HTML responses, which adaptive
 * groups can count per country.
 */
export const COUNTRY_PAGEVIEWS_QUERY = `
query ($zoneTag: String!, $start: Time!, $end: Time!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      countryPageViews: httpRequestsAdaptiveGroups(
        limit: 1000
        filter: {
          datetime_geq: $start
          datetime_lt: $end
          requestSource: "eyeball"
          edgeResponseContentTypeName: "html"
          edgeResponseStatus: 200
        }
        orderBy: [count_DESC]
      ) {
        count
        avg { sampleInterval }
        dimensions { clientCountryName }
      }
    }
  }
}
`;

/** Daily groups have no device dimension. Adaptive groups can group requests by device type. */
export const DEVICES_QUERY = `
query ($zoneTag: String!, $start: Time!, $end: Time!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      devices: httpRequestsAdaptiveGroups(
        limit: 15
        filter: {
          datetime_geq: $start
          datetime_lt: $end
          requestSource: "eyeball"
        }
        orderBy: [count_DESC]
      ) {
        count
        avg { sampleInterval }
        dimensions { clientDeviceType }
      }
    }
  }
}
`;

function num(value: number | null | undefined): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** Adaptive `count` is sampled; multiply by `sampleInterval` to estimate the total. */
function sampledCount(
	count: number | null | undefined,
	sampleInterval: number | null | undefined
): number {
	const events = num(count);
	if (events <= 0) return 0;
	const interval = num(sampleInterval);
	return Math.round(events * (interval > 0 ? interval : 1));
}

export function graphqlErrorMessage(payload: IngestGraphqlPayload): string | null {
	if (!payload.errors?.length) return null;
	return (
		payload.errors.map((error) => error.message ?? 'Unknown error').join('; ') ||
		'Cloudflare GraphQL error'
	);
}

export function parseDailyPoints(payload: IngestGraphqlPayload): DailyPoint[] {
	const zone = payload.data?.viewer?.zones?.[0];
	if (!zone) {
		throw new Error('No zone analytics data returned');
	}

	return (zone.timeseries ?? [])
		.map((group) => ({
			date: group.dimensions?.date ?? '',
			uniqueVisitors: num(group.uniq?.uniques ?? group.uniq?.visitors),
			pageVisits: num(group.sum?.pageViews)
		}))
		.filter((point) => point.date.length > 0);
}

export function parseRangeUnique(groups: GraphqlGroup[] | null | undefined): number | null {
	const visitors = groups?.[0]?.uniq?.uniques ?? groups?.[0]?.uniq?.visitors;
	if (typeof visitors !== 'number' || !Number.isFinite(visitors)) return null;
	return visitors;
}

export function parseRollupUniques(
	payload: IngestGraphqlPayload
): Partial<Record<RollupWindow, number>> {
	const zone = payload.data?.viewer?.zones?.[0];
	if (!zone) return {};

	const values: Partial<Record<RollupWindow, number>> = {};
	const unique7d = parseRangeUnique(zone.unique7d);
	const unique30d = parseRangeUnique(zone.unique30d);
	const unique90d = parseRangeUnique(zone.unique90d);
	const uniqueLifetime = parseRangeUnique(zone.uniqueLifetime);

	if (unique7d !== null) values['7d'] = unique7d;
	if (unique30d !== null) values['30d'] = unique30d;
	if (unique90d !== null) values['90d'] = unique90d;
	if (uniqueLifetime !== null) values.lifetime = uniqueLifetime;

	return values;
}

export function sumDailyUniques(points: DailyPoint[]): number {
	return points.reduce((total, point) => total + point.uniqueVisitors, 0);
}

/** True when the window unique is lower than the sum of daily uniques (repeat visitors). */
export function uniquesLookMerged(dailySum: number, rangeUnique: number): boolean {
	return rangeUnique >= 0 && dailySum > 0 && rangeUnique < dailySum;
}

export function filterPointsFrom(points: DailyPoint[], minDay: string): DailyPoint[] {
	return points.filter((point) => point.date >= minDay);
}

export type DimensionKind = 'country' | 'country_pageview' | 'device';

export type DimensionRow = {
	kind: DimensionKind;
	key: string;
	value: number;
};

export function parseDimensionRows(payload: IngestGraphqlPayload): DimensionRow[] {
	const zone = payload.data?.viewer?.zones?.[0];
	if (!zone) return [];

	const countryTotals = new Map<string, { requests: number; pageViews: number }>();
	for (const group of zone.countries ?? []) {
		const entries = group.sum?.countryMap?.length
			? group.sum.countryMap
			: [
					{
						clientCountryName: group.dimensions?.clientCountryName,
						requests: group.sum?.requests,
						pageViews: group.sum?.pageViews
					}
				];

		for (const entry of entries) {
			const requests = num(entry.requests);
			const pageViews = num(entry.pageViews);
			if (requests <= 0 && pageViews <= 0) continue;
			const key = entry.clientCountryName?.trim() || 'Unknown';
			const current = countryTotals.get(key) ?? { requests: 0, pageViews: 0 };
			current.requests += requests;
			current.pageViews += pageViews;
			countryTotals.set(key, current);
		}
	}

	for (const group of zone.countryPageViews ?? []) {
		const pageViews = sampledCount(group.count, group.avg?.sampleInterval);
		if (pageViews <= 0) continue;
		const key = group.dimensions?.clientCountryName?.trim() || 'Unknown';
		const current = countryTotals.get(key) ?? { requests: 0, pageViews: 0 };
		current.pageViews += pageViews;
		countryTotals.set(key, current);
	}

	const countries: DimensionRow[] = [...countryTotals.entries()]
		.sort(
			(left, right) =>
				right[1].requests - left[1].requests || right[1].pageViews - left[1].pageViews
		)
		.flatMap(([key, total]) => {
			const rows: DimensionRow[] = [];
			if (total.requests > 0) rows.push({ kind: 'country', key, value: total.requests });
			if (total.pageViews > 0) rows.push({ kind: 'country_pageview', key, value: total.pageViews });
			return rows;
		});

	const deviceTotals: Record<string, number> = {};
	for (const group of zone.devices ?? []) {
		const key = bucketDevice(group.dimensions?.clientDeviceType ?? '');
		const requests =
			num(group.sum?.requests) || sampledCount(group.count, group.avg?.sampleInterval);
		if (requests <= 0) continue;
		deviceTotals[key] = (deviceTotals[key] ?? 0) + requests;
	}

	const devices: DimensionRow[] = (['desktop', 'mobile', 'other'] as const)
		.map((key) => ({
			kind: 'device' as const,
			key,
			value: deviceTotals[key] ?? 0
		}))
		.filter((row) => row.value > 0);

	return [...countries, ...devices];
}

export type IngestFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function postCloudflareGraphql(options: {
	token: string;
	query: string;
	variables: Record<string, string>;
	fetchFn?: IngestFetch;
}): Promise<IngestGraphqlPayload> {
	const { token, query, variables, fetchFn = fetch } = options;
	const response = await fetchFn(CLOUDFLARE_GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`Cloudflare GraphQL HTTP ${response.status}`);
	}

	const payload = (await response.json()) as IngestGraphqlPayload;
	const message = graphqlErrorMessage(payload);
	if (message) {
		throw new Error(message);
	}

	return payload;
}
