export type AnalyticsRange = '7d' | '30d';

export type AnalyticsTotals = {
	requests: number;
	pageViews: number;
	visitors: number;
	bandwidthBytes: number;
	threats: number;
};

export type AnalyticsTimeseriesPoint = {
	date: string;
	pageViews: number;
	requests: number;
	visitors: number;
	bandwidthBytes: number;
	threats: number;
};

export type AnalyticsCountry = {
	country: string;
	requests: number;
};

export type AnalyticsResponse = {
	range: AnalyticsRange;
	start: string;
	end: string;
	totals: AnalyticsTotals;
	timeseries: AnalyticsTimeseriesPoint[];
	topCountries: AnalyticsCountry[];
};
