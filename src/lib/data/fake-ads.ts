export const fakeAdTypes = ['vertical-banner', 'horizontal-banner', 'thumbnail'] as const;

export type FakeAdType = (typeof fakeAdTypes)[number];

export type FakeAd = {
	id: string;
	type: FakeAdType;
	name: string;
	asset: string;
};

export const fakeAds = [
	{
		id: 'i-need-a-job',
		type: 'vertical-banner',
		name: 'I Need a Job',
		asset: '/posters/ineedajob.gif'
	},
	{
		id: 'data-and-analytics',
		type: 'thumbnail',
		name: 'Data and Analytics',
		asset: '/posters/data-and-analytics.png'
	}
] as const satisfies readonly FakeAd[];

export type FakeAdId = (typeof fakeAds)[number]['id'];

export function isFakeAdId(value: unknown): value is FakeAdId {
	return typeof value === 'string' && fakeAds.some((ad) => ad.id === value);
}

export function fakeAdName(id: string): string {
	return fakeAds.find((ad) => ad.id === id)?.name ?? id;
}
