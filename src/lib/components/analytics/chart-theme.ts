import { colorWithAlpha } from './chart-colors';

export function formatChartDate(
	isoDay: string,
	locale: string | undefined,
	options: Intl.DateTimeFormatOptions
): string {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay);
	if (!match) return isoDay;

	const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
	return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(date);
}

export function readChartTheme() {
	const styles = getComputedStyle(document.documentElement);
	const accent = styles.getPropertyValue('--accent').trim() || '#3b82f6';
	const muted = styles.getPropertyValue('--muted').trim() || '#a3a3a3';
	const foreground = styles.getPropertyValue('--fg').trim() || '#fafafa';
	const card = styles.getPropertyValue('--card').trim() || '#171717';
	const locale = document.documentElement.lang || undefined;

	return {
		accent,
		muted,
		foreground,
		card,
		locale,
		grid: colorWithAlpha(muted, 0.12),
		tooltipBorder: colorWithAlpha(muted, 0.25),
		hoverFill: colorWithAlpha(muted, 0.12),
		lineFill: colorWithAlpha(accent, 0.15),
		countryFill: colorWithAlpha(accent, 0.7)
	};
}

export function chartTooltip(theme: ReturnType<typeof readChartTheme>) {
	return {
		backgroundColor: theme.card,
		titleColor: theme.foreground,
		bodyColor: theme.muted,
		borderColor: theme.tooltipBorder,
		borderWidth: 1,
		cornerRadius: 8,
		displayColors: true,
		boxWidth: 8,
		boxHeight: 8,
		boxPadding: 4,
		padding: 10,
		titleFont: { family: 'Rajdhani, sans-serif', size: 13, weight: 'bold' as const },
		bodyFont: { family: 'Rajdhani, sans-serif', size: 13 }
	};
}
