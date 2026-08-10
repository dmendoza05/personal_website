import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import {
	fetchCloudflareAnalytics,
	parseRange,
	type AnalyticsRange,
	type AnalyticsResponse
} from '$lib/server/analytics';
import type { RequestHandler } from './$types';

const CACHE_TTL_MS = 10 * 60 * 1000;
const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
};

function analyticsHeaders(extra: HeadersInit = {}): Headers {
	return new Headers({
		'Content-Type': 'application/json',
		...CORS_HEADERS,
		...extra
	});
}

function cacheKeyForRange(range: AnalyticsRange): Request {
	return new Request(`https://analytics.cache/api/analytics?range=${range}`);
}

function getCache(platform: App.Platform | undefined): Cache | undefined {
	const storage = platform?.caches as (CacheStorage & { default: Cache }) | undefined;
	return storage?.default;
}

function readSecrets(platform: App.Platform | undefined): {
	token: string | undefined;
	zoneId: string | undefined;
} {
	const platformEnv = platform?.env as
		| { CF_ANALYTICS_TOKEN?: string; CF_ZONE_ID?: string }
		| undefined;

	return {
		token: env.CF_ANALYTICS_TOKEN ?? platformEnv?.CF_ANALYTICS_TOKEN,
		zoneId: env.CF_ZONE_ID ?? platformEnv?.CF_ZONE_ID
	};
}

function isFresh(response: Response): boolean {
	const fetchedAt = Number(response.headers.get('X-Fetched-At'));
	if (!Number.isFinite(fetchedAt)) return false;
	return Date.now() - fetchedAt < CACHE_TTL_MS;
}

export const OPTIONS: RequestHandler = async () =>
	new Response(null, {
		status: 204,
		headers: analyticsHeaders()
	});

export const GET: RequestHandler = async ({ url, platform }) => {
	const range = parseRange(url.searchParams.get('range'));
	const cache = getCache(platform);
	const key = cacheKeyForRange(range);

	if (cache) {
		const cached = await cache.match(key);
		if (cached && isFresh(cached)) {
			const body = await cached.text();
			return new Response(body, {
				status: 200,
				headers: analyticsHeaders({
					'X-Cache': 'HIT',
					'X-Fetched-At': cached.headers.get('X-Fetched-At') ?? ''
				})
			});
		}
	}

	const { token, zoneId } = readSecrets(platform);

	if (!token || !zoneId) {
		return json(
			{ error: 'Analytics is not configured (missing CF_ANALYTICS_TOKEN or CF_ZONE_ID)' },
			{ status: 500, headers: CORS_HEADERS }
		);
	}

	try {
		const data: AnalyticsResponse = await fetchCloudflareAnalytics({ token, zoneId, range });
		const fetchedAt = String(Date.now());
		const body = JSON.stringify(data);
		const headers = analyticsHeaders({
			'Cache-Control': `public, max-age=${Math.floor(CACHE_TTL_MS / 1000)}`,
			'X-Cache': 'MISS',
			'X-Fetched-At': fetchedAt
		});
		const response = new Response(body, { status: 200, headers });

		if (cache) {
			await cache.put(key, response.clone());
		}

		return response;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to fetch analytics';
		return json({ error: message }, { status: 500, headers: CORS_HEADERS });
	}
};
