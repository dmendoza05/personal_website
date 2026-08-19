import { describe, expect, it } from 'vitest';
import {
	BACKFILL_DAYS,
	backfillChunks,
	eachUtcDay,
	inclusiveWindow,
	isUtcDay,
	rollupWindowBounds,
	shiftUtcDay,
	utcToday
} from './dates';

describe('isUtcDay', () => {
	it('accepts valid calendar dates', () => {
		expect(isUtcDay('2026-08-13')).toBe(true);
		expect(isUtcDay('2024-02-29')).toBe(true);
	});

	it('rejects invalid dates', () => {
		expect(isUtcDay('2026-13-01')).toBe(false);
		expect(isUtcDay('2026-08-32')).toBe(false);
		expect(isUtcDay('08-13-2026')).toBe(false);
		expect(isUtcDay('')).toBe(false);
	});
});

describe('inclusiveWindow', () => {
	it('includes the end day in the count', () => {
		expect(inclusiveWindow('2026-08-13', 7)).toEqual({ start: '2026-08-07', end: '2026-08-13' });
		expect(inclusiveWindow('2026-08-13', 1)).toEqual({ start: '2026-08-13', end: '2026-08-13' });
	});
});

describe('rollupWindowBounds', () => {
	it('maps named windows to inclusive UTC ranges', () => {
		expect(rollupWindowBounds('7d', '2026-08-13')).toEqual({ start: '2026-08-07', end: '2026-08-13' });
		expect(rollupWindowBounds('30d', '2026-08-13')).toEqual({ start: '2026-07-15', end: '2026-08-13' });
		expect(rollupWindowBounds('90d', '2026-08-13').end).toBe('2026-08-13');
		expect(rollupWindowBounds('lifetime', '2026-08-13')).toEqual({
			start: shiftUtcDay('2026-08-13', -(365 - 1)),
			end: '2026-08-13'
		});
	});
});

describe('backfillChunks', () => {
	it('covers 365 days in 90-day chunks without gaps', () => {
		const end = '2026-08-13';
		const chunks = backfillChunks(end);
		expect(chunks[0]?.start).toBe(inclusiveWindow(end, BACKFILL_DAYS).start);
		expect(chunks.at(-1)?.end).toBe(end);

		for (let index = 1; index < chunks.length; index += 1) {
			expect(chunks[index]?.start).toBe(shiftUtcDay(chunks[index - 1]?.end ?? '', 1));
		}
	});
});

describe('utcToday', () => {
	it('uses the UTC calendar day', () => {
		expect(utcToday(new Date('2026-08-13T03:15:00.000Z'))).toBe('2026-08-13');
		expect(utcToday(new Date('2026-08-13T23:59:59.000Z'))).toBe('2026-08-13');
	});
});

describe('eachUtcDay', () => {
	it('lists inclusive days and fills empty windows', () => {
		expect(eachUtcDay('2026-08-12', '2026-08-13')).toEqual(['2026-08-12', '2026-08-13']);
		expect(eachUtcDay('2026-08-13', '2026-08-12')).toEqual([]);
	});
});
