export type CardNotchCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type CardNotchPreset =
	| CardNotchCorner
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'all';

export type CardNotches = CardNotchPreset | CardNotchPreset[];

const PRESET_CORNERS: Record<CardNotchPreset, readonly CardNotchCorner[]> = {
	'top-left': ['top-left'],
	'top-right': ['top-right'],
	'bottom-left': ['bottom-left'],
	'bottom-right': ['bottom-right'],
	top: ['top-left', 'top-right'],
	bottom: ['bottom-left', 'bottom-right'],
	left: ['top-left', 'bottom-left'],
	right: ['top-right', 'bottom-right'],
	all: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
};

export function resolveCardNotches(notches: CardNotches): CardNotchCorner[] {
	const presets = Array.isArray(notches) ? notches : [notches];
	const corners = new Set<CardNotchCorner>();

	for (const preset of presets) {
		for (const corner of PRESET_CORNERS[preset]) {
			corners.add(corner);
		}
	}

	return [...corners];
}

export function buildCardShapePaths(
	width: number,
	height: number,
	notch: number,
	corners: readonly CardNotchCorner[]
): { clipPath: string; borderPath: string } {
	const has = new Set(corners);
	const points: [number, number][] = [];

	if (has.has('top-left')) {
		points.push([notch, 0]);
	} else {
		points.push([0, 0]);
	}

	if (has.has('top-right')) {
		points.push([width - notch, 0], [width, notch]);
	} else {
		points.push([width, 0]);
	}

	if (has.has('bottom-right')) {
		points.push([width, height - notch], [width - notch, height]);
	} else {
		points.push([width, height]);
	}

	if (has.has('bottom-left')) {
		points.push([notch, height], [0, height - notch]);
	} else {
		points.push([0, height]);
	}

	if (has.has('top-left')) {
		points.push([0, notch]);
	}

	const clipPath = `polygon(${points.map(([x, y]) => `${x}px ${y}px`).join(', ')})`;
	const borderPath = `M${points.map(([x, y]) => `${x} ${y}`).join('L')}Z`;

	return { clipPath, borderPath };
}
