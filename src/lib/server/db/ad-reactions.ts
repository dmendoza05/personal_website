import { getDb } from './index';
import { adReactions } from './schema';

export type AdVote = 'up' | 'down';

export async function recordAdReaction(input: { vote: AdVote; path: string }) {
	const db = getDb();
	await db.insert(adReactions).values({
		vote: input.vote,
		path: input.path
	});
}
