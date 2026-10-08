import { browser } from '$app/environment';

export type AdVote = 'up' | 'down';

const STORAGE_KEY = 'fake-ad-votes';

function isVote(value: unknown): value is AdVote {
	return value === 'up' || value === 'down';
}

function readStoredAdVotes(): Record<string, AdVote> {
	if (!browser) return {};

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};

		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object') return {};

		const votes: Record<string, AdVote> = {};
		for (const [adId, vote] of Object.entries(parsed)) {
			if (isVote(vote)) votes[adId] = vote;
		}
		return votes;
	} catch {
		return {};
	}
}

export function readStoredAdVote(adId: string): AdVote | null {
	return readStoredAdVotes()[adId] ?? null;
}

export function writeStoredAdVote(adId: string, vote: AdVote): void {
	if (!browser) return;

	try {
		const votes = readStoredAdVotes();
		votes[adId] = vote;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
	} catch {
		// Quota / private mode — keep the in-memory vote.
	}
}

export async function sendAdReaction(vote: AdVote, path: string, ad: string): Promise<boolean> {
	try {
		const response = await fetch('/api/ad-reaction', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ vote, path, ad }),
			keepalive: true
		});

		return response.ok;
	} catch {
		return false;
	}
}
