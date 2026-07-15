import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { recordPageView } from '$lib/server/db/pageviews';
import type { RequestHandler } from './$types';

const PATH_PATTERN = /^\/[a-zA-Z0-9/_-]*$/;

export const POST: RequestHandler = async ({ request }) => {
	const mode = request.headers.get('sec-fetch-mode');
	if (mode === 'navigate') {
		return json({ ok: false }, { status: 400 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false }, { status: 400 });
	}

	const path =
		typeof body === 'object' && body !== null && 'path' in body
			? String((body as { path: unknown }).path)
			: '';

	if (!path || path.length > 512 || !PATH_PATTERN.test(path)) {
		return json({ ok: false }, { status: 400 });
	}

	if (!env.DATABASE_URL) {
		return json({ ok: true });
	}

	try {
		await recordPageView(path);
		return json({ ok: true });
	} catch {
		return json({ ok: false }, { status: 500 });
	}
};
