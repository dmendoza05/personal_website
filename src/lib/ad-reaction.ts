export type AdVote = 'up' | 'down';

export async function sendAdReaction(vote: AdVote, path: string): Promise<boolean> {
	try {
		const response = await fetch('/api/ad-reaction', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ vote, path }),
			keepalive: true
		});

		return response.ok;
	} catch {
		return false;
	}
}
