/** Convert #rgb / #rrggbb to rgba(); otherwise return the color unchanged. */
export function colorWithAlpha(color: string, alpha: number): string {
	if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
		const hex =
			color.length === 4
				? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
				: color;
		const r = Number.parseInt(hex.slice(1, 3), 16);
		const g = Number.parseInt(hex.slice(3, 5), 16);
		const b = Number.parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
	return color;
}
