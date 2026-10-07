import { count } from 'drizzle-orm';
import { getDb } from './index';
import { adReactions } from './schema';

export type AdVote = 'up' | 'down';

export type AdVoteTotals = {
	likes: number;
	dislikes: number;
};

export async function recordAdReaction(input: { vote: AdVote; path: string }) {
	const db = getDb();
	await db.insert(adReactions).values({
		vote: input.vote,
		path: input.path
	});
}

/** All-time thumbs-up and thumbs-down totals across every recorded ad vote. */
export async function getAdVoteTotals(): Promise<AdVoteTotals> {
	const db = getDb();
	const rows = await db
		.select({
			vote: adReactions.vote,
			total: count()
		})
		.from(adReactions)
		.groupBy(adReactions.vote);

	const totals: AdVoteTotals = { likes: 0, dislikes: 0 };
	for (const row of rows) {
		const total = Number(row.total);
		if (row.vote === 'up') totals.likes = total;
		else if (row.vote === 'down') totals.dislikes = total;
	}
	return totals;
}
