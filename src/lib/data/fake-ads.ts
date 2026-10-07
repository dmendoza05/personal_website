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
	}
] as const satisfies readonly FakeAd[];
