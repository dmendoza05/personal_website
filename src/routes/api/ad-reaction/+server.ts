import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { isFakeAdId } from '$lib/data/fake-ads';
import { recordAdReaction, type AdVote } from '$lib/server/db/ad-reactions';
import type { RequestHandler } from './$types';

const PATH_PATTERN = /^\/[a-zA-Z0-9/_-]*$/;

function isVote(value: unknown): value is AdVote {
	return value === 'up' || value === 'down';
}

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

	const vote =
		typeof body === 'object' && body !== null && 'vote' in body
			? (body as { vote: unknown }).vote
			: null;
	const path =
		typeof body === 'object' && body !== null && 'path' in body
			? String((body as { path: unknown }).path)
			: '';
	const ad =
		typeof body === 'object' && body !== null && 'ad' in body ? (body as { ad: unknown }).ad : null;

	if (!isVote(vote) || !isFakeAdId(ad) || !path || path.length > 512 || !PATH_PATTERN.test(path)) {
		return json({ ok: false }, { status: 400 });
	}

	if (!env.DATABASE_URL) {
		return json({ ok: true });
	}

	try {
		await recordAdReaction({ ad, vote, path });
		return json({ ok: true });
	} catch {
		return json({ ok: false }, { status: 500 });
	}
};
