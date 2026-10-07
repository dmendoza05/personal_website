export const fakeAdTypes = ['vertical-banner', 'horizontal-banner', 'thumbnail'] as const;

export type FakeAdType = (typeof fakeAdTypes)[number];

export type FakeAd = {
	type: FakeAdType;
	name: string;
	asset: string;
};

export const fakeAds = [
	{
		type: 'vertical-banner',
		name: 'I Need a Job',
		asset: '/ads/ineedajob.gif'
	},
	{
		type: 'thumbnail',
		name: 'Data and Analytics',
		asset: '/ads/data-and-analytics.png'
	}
] as const satisfies readonly FakeAd[];
