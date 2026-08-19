import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	DashboardQueryError,
	getDashboardPayload,
	parseDashboardQuery
} from '$lib/server/db/analytics';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	if (!env.DATABASE_URL) {
		return json({ error: 'Analytics is not configured (missing DATABASE_URL)' }, { status: 500 });
	}

	let query;
	try {
		query = parseDashboardQuery(url.searchParams);
	} catch (error) {
		if (error instanceof DashboardQueryError) {
			return json({ error: error.message }, { status: error.status });
		}
		throw error;
	}

	try {
		const payload = await getDashboardPayload(query);
		return json(payload);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to load dashboard analytics';
		return json({ error: message }, { status: 500 });
	}
};
