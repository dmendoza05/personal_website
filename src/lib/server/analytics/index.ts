import type {
	AnalyticsCountry,
	AnalyticsRange,
	AnalyticsResponse,
	AnalyticsTimeseriesPoint,
	AnalyticsTotals
} from '$lib/analytics';
import { inclusiveWindow, utcToday } from './dates';

export type {
	AnalyticsCountry,
	AnalyticsRange,
	AnalyticsResponse,
	AnalyticsTimeseriesPoint,
	AnalyticsTotals
} from '$lib/analytics';

type GraphqlGroup = {
	sum?: {
		requests?: number | null;
		pageViews?: number | null;
		bytes?: number | null;
		threats?: number | null;
	} | null;
	uniq?: {
		visitors?: number | null;
	} | null;
	dimensions?: {
		date?: string | null;
		clientCountryName?: string | null;
	} | null;
};

type GraphqlPayload = {
	data?: {
		viewer?: {
			zones?: Array<{
				timeseries?: GraphqlGroup[] | null;
				countries?: GraphqlGroup[] | null;
			}> | null;
		} | null;
	} | null;
	errors?: Array<{ message?: string }> | null;
};

const GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

const ANALYTICS_QUERY = `
query ($zoneTag: String!, $start: Date!, $end: Date!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      timeseries: httpRequests1dGroups(
        limit: 60
        filter: { date_geq: $start, date_leq: $end }
        orderBy: [date_ASC]
      ) {
        sum {
          requests
          pageViews
          bytes
          threats
        }
        uniq {
          visitors
        }
        dimensions {
          date
        }
      }
      countries: httpRequests1dGroups(
        limit: 10
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

export function parseRange(value: string | null): AnalyticsRange {
	return value === '30d' ? '30d' : '7d';
}

export function dateBoundsForRange(range: AnalyticsRange): { start: string; end: string } {
	const days = range === '30d' ? 30 : 7;
	return inclusiveWindow(utcToday(), days);
}

function num(value: number | null | undefined): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function buildAnalyticsResponse(
	payload: GraphqlPayload,
	range: AnalyticsRange,
	start: string,
	end: string
): AnalyticsResponse {
	const zone = payload.data?.viewer?.zones?.[0];
	if (!zone) {
		throw new Error('No zone analytics data returned');
	}

	const timeseries: AnalyticsTimeseriesPoint[] = (zone.timeseries ?? []).map((group) => ({
		date: group.dimensions?.date ?? '',
		pageViews: num(group.sum?.pageViews),
		requests: num(group.sum?.requests),
		visitors: num(group.uniq?.visitors),
		bandwidthBytes: num(group.sum?.bytes),
		threats: num(group.sum?.threats)
	}));

	const totals = timeseries.reduce<AnalyticsTotals>(
		(acc, point) => ({
			requests: acc.requests + point.requests,
			pageViews: acc.pageViews + point.pageViews,
			visitors: acc.visitors + point.visitors,
			bandwidthBytes: acc.bandwidthBytes + point.bandwidthBytes,
			threats: acc.threats + point.threats
		}),
		{ requests: 0, pageViews: 0, visitors: 0, bandwidthBytes: 0, threats: 0 }
	);

	const topCountries: AnalyticsCountry[] = (zone.countries ?? [])
		.map((group) => ({
			country: group.dimensions?.clientCountryName?.trim() || 'Unknown',
			requests: num(group.sum?.requests)
		}))
		.filter((entry) => entry.requests > 0);

	return { range, start, end, totals, timeseries, topCountries };
}

export async function fetchCloudflareAnalytics(options: {
	token: string;
	zoneId: string;
	range: AnalyticsRange;
	fetchFn?: typeof fetch;
}): Promise<AnalyticsResponse> {
	const { token, zoneId, range, fetchFn = fetch } = options;
	const { start, end } = dateBoundsForRange(range);

	const response = await fetchFn(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: ANALYTICS_QUERY,
			variables: { zoneTag: zoneId, start, end }
		})
	});

	if (!response.ok) {
		throw new Error(`Cloudflare GraphQL HTTP ${response.status}`);
	}

	const payload = (await response.json()) as GraphqlPayload;

	if (payload.errors?.length) {
		const message = payload.errors.map((error) => error.message ?? 'Unknown error').join('; ');
		throw new Error(message || 'Cloudflare GraphQL error');
	}

	return buildAnalyticsResponse(payload, range, start, end);
}
