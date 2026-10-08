import { describe, expect, it } from 'vitest';
import { summarizeAdVotes } from './ad-reactions';

describe('summarizeAdVotes', () => {
	it('groups likes and dislikes by ad and keeps catalog order', () => {
		expect(
			summarizeAdVotes([
				{ ad: 'data-and-analytics', vote: 'down', total: 2 },
				{ ad: 'i-need-a-job', vote: 'up', total: '4' },
				{ ad: 'i-need-a-job', vote: 'down', total: 1 },
				{ ad: 'retired-ad', vote: 'up', total: 3 }
			])
		).toEqual({
			likes: 7,
			dislikes: 3,
			ads: [
				{ id: 'i-need-a-job', name: 'I Need a Job', likes: 4, dislikes: 1 },
				{ id: 'data-and-analytics', name: 'Data and Analytics', likes: 0, dislikes: 2 },
				{ id: 'retired-ad', name: 'retired-ad', likes: 3, dislikes: 0 }
			]
		});
	});

	it('returns zeros when there are no votes', () => {
		expect(summarizeAdVotes([])).toEqual({ likes: 0, dislikes: 0, ads: [] });
	});
});
