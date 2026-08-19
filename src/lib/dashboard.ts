export type DashboardRange = '7d' | '30d' | '90d' | 'lifetime';

export type ChartRange = 'week' | 'month' | 'year' | 'all';

export const CHART_RANGES: ChartRange[] = ['week', 'month', 'year', 'all'];

export const DEVICE_KEYS = ['desktop', 'mobile', 'other'] as const;

export type DeviceKey = (typeof DEVICE_KEYS)[number];

export function dashboardSearchParams(range: ChartRange, now = new Date()): string {
	if (range === 'week') return 'range=7d';
	if (range === 'month') return 'range=30d';
	if (range === 'all') return 'range=lifetime';

	const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
		.toISOString()
		.slice(0, 10);
	return `from=${to.slice(0, 4)}-01-01&to=${to}`;
}

export type DashboardTimeseriesPoint = {
	date: string;
	uniqueVisitors: number;
	pageVisits: number;
};

export type DashboardTopPage = {
	path: string;
	views: number;
};

export type DashboardCountry = {
	country: string;
	requests: number;
};

export type DashboardDevice = {
	device: DeviceKey;
	requests: number;
};

export type DashboardResponse = {
	lifetimeUniqueVisitors: number | null;
	range: {
		window: DashboardRange | 'custom';
		start: string;
		end: string;
		uniqueVisitors: number | null;
		pageVisits: number;
		fetchedAt: string;
	};
	timeseries: DashboardTimeseriesPoint[];
	topPages: DashboardTopPage[];
	countries: DashboardCountry[];
	devices: DashboardDevice[];
};

export function formatDashboardNumber(value: number | null | undefined): string {
	return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value ?? 0);
}

export function truncateMiddle(value: string, max = 28): string {
	if (value.length <= max) return value;
	const inner = Math.max(max - 1, 1);
	const head = Math.ceil(inner / 2);
	const tail = Math.floor(inner / 2);
	return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function bucketDevice(value: string): DeviceKey {
	const normalized = value.trim().toLowerCase();
	if (normalized === 'desktop') return 'desktop';
	if (normalized === 'mobile') return 'mobile';
	return 'other';
}

export function normalizeDevices(rows: Array<{ device: string; requests: number }>): DashboardDevice[] {
	const totals: Record<DeviceKey, number> = { desktop: 0, mobile: 0, other: 0 };
	for (const row of rows) {
		totals[bucketDevice(row.device)] += row.requests;
	}
	return DEVICE_KEYS.map((device) => ({ device, requests: totals[device] }));
}

export function formatFetchedAt(iso: string, locale?: string): string {
	if (!iso) return '';
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat(locale, {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'UTC'
	}).format(date);
}
