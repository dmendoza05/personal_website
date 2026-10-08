import { count } from 'drizzle-orm';
import { fakeAdName, fakeAds } from '$lib/data/fake-ads';
import type { DashboardAdVote } from '$lib/dashboard';
import { getDb } from './index';
import { adReactions } from './schema';

export type AdVote = 'up' | 'down';

export type AdVoteTotals = {
	likes: number;
	dislikes: number;
	ads: DashboardAdVote[];
};

export function summarizeAdVotes(
	rows: Array<{ ad: string; vote: string; total: number | string }>
): AdVoteTotals {
	const byAd = new Map<string, DashboardAdVote>();
	let likes = 0;
	let dislikes = 0;

	for (const row of rows) {
		const total = Number(row.total);
		if (!Number.isFinite(total)) continue;

		const entry = byAd.get(row.ad) ?? {
			id: row.ad,
			name: fakeAdName(row.ad),
			likes: 0,
			dislikes: 0
		};

		if (row.vote === 'up') {
			entry.likes += total;
			likes += total;
		} else if (row.vote === 'down') {
			entry.dislikes += total;
			dislikes += total;
		}

		byAd.set(row.ad, entry);
	}

	const order = new Map<string, number>(fakeAds.map((ad, index) => [ad.id, index]));
	const ads = [...byAd.values()].sort((left, right) => {
		const leftOrder = order.get(left.id) ?? fakeAds.length;
		const rightOrder = order.get(right.id) ?? fakeAds.length;
		return leftOrder - rightOrder || left.name.localeCompare(right.name);
	});

	return { likes, dislikes, ads };
}

export async function recordAdReaction(input: { ad: string; vote: AdVote; path: string }) {
	const db = getDb();
	await db.insert(adReactions).values({
		ad: input.ad,
		vote: input.vote,
		path: input.path
	});
}

/** All-time thumbs-up and thumbs-down totals, grouped by the ad that was voted on. */
export async function getAdVoteTotals(): Promise<AdVoteTotals> {
	const db = getDb();
	const rows = await db
		.select({
			ad: adReactions.ad,
			vote: adReactions.vote,
			total: count()
		})
		.from(adReactions)
		.groupBy(adReactions.ad, adReactions.vote);

	return summarizeAdVotes(rows);
}
