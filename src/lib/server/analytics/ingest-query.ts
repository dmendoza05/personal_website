import type { RollupWindow } from './dates';
import { bucketDevice } from '../../dashboard';

export const CLOUDFLARE_GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

export type DailyPoint = {
	date: string;
	uniqueVisitors: number;
	pageVisits: number;
};

type GraphqlGroup = {
	sum?: { pageViews?: number | null; requests?: number | null } | null;
	uniq?: { visitors?: number | null } | null;
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
        uniq { visitors }
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
        uniq { visitors }
        sum { pageViews }
        dimensions { date }
      }
      unique7d: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $start7d, date_leq: $end }
      ) {
        uniq { visitors }
      }
      unique30d: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $start30d, date_leq: $end }
      ) {
        uniq { visitors }
      }
      unique90d: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $start90d, date_leq: $end }
      ) {
        uniq { visitors }
      }
      uniqueLifetime: httpRequests1dGroups(
        limit: 1
        filter: { date_geq: $startLifetime, date_leq: $end }
      ) {
        uniq { visitors }
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
        limit: 8
        filter: { date_geq: $start, date_leq: $end }
        orderBy: [sum_requests_DESC]
      ) {
        sum { requests }
        dimensions { clientCountryName }
      }
      devices: httpRequests1dGroups(
        limit: 10
        filter: { date_geq: $start, date_leq: $end }
        orderBy: [sum_requests_DESC]
      ) {
        sum { requests }
        dimensions { clientDeviceType }
      }
    }
  }
}
`;

function num(value: number | null | undefined): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : 0;
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
			uniqueVisitors: num(group.uniq?.visitors),
			pageVisits: num(group.sum?.pageViews)
		}))
		.filter((point) => point.date.length > 0);
}

export function parseRangeUnique(groups: GraphqlGroup[] | null | undefined): number | null {
	const visitors = groups?.[0]?.uniq?.visitors;
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

export type DimensionKind = 'country' | 'device';

export type DimensionRow = {
	kind: DimensionKind;
	key: string;
	value: number;
};

export function parseDimensionRows(payload: IngestGraphqlPayload): DimensionRow[] {
	const zone = payload.data?.viewer?.zones?.[0];
	if (!zone) return [];

	const countries = (zone.countries ?? [])
		.map((group) => ({
			kind: 'country' as const,
			key: group.dimensions?.clientCountryName?.trim() || 'Unknown',
			value: num(group.sum?.requests)
		}))
		.filter((row) => row.value > 0)
		.slice(0, 8);

	const deviceTotals: Record<string, number> = {};
	for (const group of zone.devices ?? []) {
		const key = bucketDevice(group.dimensions?.clientDeviceType ?? '');
		deviceTotals[key] = (deviceTotals[key] ?? 0) + num(group.sum?.requests);
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
