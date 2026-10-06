import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { RESUME_DOWNLOAD_PATH, recordPageView } from '$lib/server/db/pageviews';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	if (request.headers.get('sec-fetch-mode') === 'navigate') {
		return json({ ok: false }, { status: 400 });
	}

	if (!env.DATABASE_URL) {
		return json({ ok: true });
	}

	try {
		await recordPageView(RESUME_DOWNLOAD_PATH);
		return json({ ok: true });
	} catch {
		return json({ ok: false }, { status: 500 });
	}
};
