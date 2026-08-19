export const UTC_DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const ROLLUP_WINDOWS = ['7d', '30d', '90d', 'lifetime'] as const;
export type RollupWindow = (typeof ROLLUP_WINDOWS)[number];

export const ROLLUP_DAY_COUNTS: Record<RollupWindow, number> = {
	'7d': 7,
	'30d': 30,
	'90d': 90,
	lifetime: 365
};

export const BACKFILL_DAYS = 365;
export const BACKFILL_CHUNK_DAYS = 90;
export const INCREMENTAL_DAYS = 2;

export function formatUtcDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function utcToday(now = new Date()): string {
	return formatUtcDate(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())));
}

export function isUtcDay(value: string): boolean {
	if (!UTC_DAY_PATTERN.test(value)) return false;
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return formatUtcDate(date) === value;
}

/** Inclusive UTC days from `start` through `end`, capped to avoid unbounded lifetime fills. */
export function eachUtcDay(start: string, end: string, maxDays = 400): string[] {
	if (!isUtcDay(start) || !isUtcDay(end) || start > end) return [];

	const days: string[] = [];
	for (let day = start; day <= end; day = shiftUtcDay(day, 1)) {
		days.push(day);
		if (days.length >= maxDays) break;
	}
	return days;
}

export function shiftUtcDay(day: string, deltaDays: number): string {
	const [year, month, date] = day.split('-').map(Number);
	const next = new Date(Date.UTC(year, month - 1, date));
	next.setUTCDate(next.getUTCDate() + deltaDays);
	return formatUtcDate(next);
}

/** Inclusive window of `dayCount` days ending on `endDay`. */
export function inclusiveWindow(endDay: string, dayCount: number): { start: string; end: string } {
	return {
		start: shiftUtcDay(endDay, -(dayCount - 1)),
		end: endDay
	};
}

export function rollupWindowBounds(window: RollupWindow, endDay: string): { start: string; end: string } {
	return inclusiveWindow(endDay, ROLLUP_DAY_COUNTS[window]);
}

export function backfillChunks(
	endDay: string,
	totalDays = BACKFILL_DAYS,
	chunkDays = BACKFILL_CHUNK_DAYS
): Array<{ start: string; end: string }> {
	const { start: earliest } = inclusiveWindow(endDay, totalDays);
	const chunks: Array<{ start: string; end: string }> = [];
	let cursor = earliest;

	while (cursor <= endDay) {
		const tentativeEnd = shiftUtcDay(cursor, chunkDays - 1);
		const end = tentativeEnd < endDay ? tentativeEnd : endDay;
		chunks.push({ start: cursor, end });
		cursor = shiftUtcDay(end, 1);
	}

	return chunks;
}
