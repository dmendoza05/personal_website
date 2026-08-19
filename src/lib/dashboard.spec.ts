import { describe, expect, it } from 'vitest';
import {
	bucketDevice,
	formatDashboardNumber,
	normalizeDevices,
	truncateMiddle
} from './dashboard';

describe('truncateMiddle', () => {
	it('leaves short paths unchanged', () => {
		expect(truncateMiddle('/about', 28)).toBe('/about');
	});

	it('ellipsizes the middle of long paths', () => {
		expect(truncateMiddle('/blog/a-very-long-slug-name', 16)).toBe('/blog/a-…ug-name');
	});
});

describe('bucketDevice', () => {
	it('maps known device classes and folds the rest into other', () => {
		expect(bucketDevice('desktop')).toBe('desktop');
		expect(bucketDevice('Mobile')).toBe('mobile');
		expect(bucketDevice('tablet')).toBe('other');
		expect(bucketDevice('')).toBe('other');
	});
});

describe('normalizeDevices', () => {
	it('always returns desktop, mobile, and other', () => {
		expect(normalizeDevices([{ device: 'tablet', requests: 4 }])).toEqual([
			{ device: 'desktop', requests: 0 },
			{ device: 'mobile', requests: 0 },
			{ device: 'other', requests: 4 }
		]);
	});
});

describe('formatDashboardNumber', () => {
	it('treats missing values as zero', () => {
		expect(formatDashboardNumber(null)).toBe('0');
		expect(formatDashboardNumber(undefined)).toBe('0');
		expect(formatDashboardNumber(12)).toBe('12');
	});
});
