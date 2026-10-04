const MAP_WIDTH = 2048;
const MAP_HEIGHT = 1024;

export interface VectorEarthStyle {
	ocean: string;
	land: string;
	coast: string;
	grid: string;
	highlight: string;
	coastWidth: number;
	gridWidth: number;
}

type LonLat = [number, number];
type Ring = LonLat[];

interface CountryFeature {
	properties?: { name?: string };
	geometry: {
		type: string;
		coordinates: Ring[] | Ring[][];
	};
}

export interface Country {
	name: string;
	polygons: Ring[][];
	minLon: number;
	maxLon: number;
	minLat: number;
	maxLat: number;
	area: number;
}

function project(lon: number, lat: number): [number, number] {
	const x = ((lon + 180) / 360) * MAP_WIDTH;
	const y = ((90 - lat) / 180) * MAP_HEIGHT;
	return [x, y];
}

function polygonsOf(type: string, coordinates: Ring[] | Ring[][]): Ring[][] {
	if (type === 'MultiPolygon') return coordinates as Ring[][];
	return [coordinates as Ring[]];
}

function traceRing(context: CanvasRenderingContext2D, ring: Ring) {
	let open = false;

	for (let index = 0; index < ring.length; index += 1) {
		const [lon, lat] = ring[index];
		const [x, y] = project(lon, lat);

		if (!open) {
			context.moveTo(x, y);
			open = true;
			continue;
		}

		const [previousLon] = ring[index - 1];
		if (Math.abs(lon - previousLon) > 180) {
			context.moveTo(x, y);
			continue;
		}

		context.lineTo(x, y);
	}

	context.closePath();
}

function parseHex(color: string): [number, number, number] | null {
	const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color.trim());
	if (!match) return null;

	const hex = match[1];
	const full = hex.length === 3 ? hex.replace(/./g, (digit) => digit + digit) : hex;
	const value = Number.parseInt(full, 16);
	return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mixHex(from: string, to: string, amount: number): string {
	const start = parseHex(from);
	const end = parseHex(to);
	if (!start || !end) return from;

	const channel = (left: number, right: number) => Math.round(left + (right - left) * amount);
	return `#${[channel(start[0], end[0]), channel(start[1], end[1]), channel(start[2], end[2])]
		.map((value) => value.toString(16).padStart(2, '0'))
		.join('')}`;
}

function countryFill(name: string, style: VectorEarthStyle): string {
	let hash = 0;
	for (let index = 0; index < name.length; index += 1) {
		hash = (hash * 33 + name.charCodeAt(index)) >>> 0;
	}

	return mixHex(style.land, style.coast, (hash % 5) * 0.12);
}

function ringContains(ring: Ring, lon: number, lat: number): boolean {
	let inside = false;

	for (
		let index = 0, previous = ring.length - 1;
		index < ring.length;
		previous = index, index += 1
	) {
		const [currentLon, currentLat] = ring[index];
		const [previousLon, previousLat] = ring[previous];
		const crosses = currentLat > lat !== previousLat > lat;
		if (!crosses) continue;

		const edgeLon =
			((previousLon - currentLon) * (lat - currentLat)) / (previousLat - currentLat) + currentLon;
		if (lon < edgeLon) inside = !inside;
	}

	return inside;
}

function polygonContains(polygon: Ring[], lon: number, lat: number): boolean {
	if (polygon.length === 0 || !ringContains(polygon[0], lon, lat)) return false;

	for (let index = 1; index < polygon.length; index += 1) {
		if (ringContains(polygon[index], lon, lat)) return false;
	}

	return true;
}

export async function loadCountries(): Promise<Country[]> {
	const response = await fetch('/earth/countries.geojson');
	if (!response.ok) throw new Error('Failed to load country map');

	const collection = (await response.json()) as { features: CountryFeature[] };
	const countries: Country[] = [];

	for (const feature of collection.features) {
		const name = feature.properties?.name;
		if (!name) continue;

		const polygons = polygonsOf(feature.geometry.type, feature.geometry.coordinates);
		let minLon = Infinity;
		let maxLon = -Infinity;
		let minLat = Infinity;
		let maxLat = -Infinity;

		for (const polygon of polygons) {
			for (const ring of polygon) {
				for (const [lon, lat] of ring) {
					minLon = Math.min(minLon, lon);
					maxLon = Math.max(maxLon, lon);
					minLat = Math.min(minLat, lat);
					maxLat = Math.max(maxLat, lat);
				}
			}
		}

		countries.push({
			name,
			polygons,
			minLon,
			maxLon,
			minLat,
			maxLat,
			area: (maxLon - minLon) * (maxLat - minLat)
		});
	}

	countries.sort((left, right) => right.area - left.area);
	return countries;
}

export function findCountry(countries: Country[], lon: number, lat: number): string | null {
	let match: Country | null = null;

	for (const country of countries) {
		const crossesDateline = country.maxLon - country.minLon > 180;
		if (
			!crossesDateline &&
			(lon < country.minLon || lon > country.maxLon || lat < country.minLat || lat > country.maxLat)
		) {
			continue;
		}

		const contains = country.polygons.some((polygon) => polygonContains(polygon, lon, lat));
		if (!contains) continue;

		if (!match || country.area < match.area) match = country;
	}

	return match?.name ?? null;
}

export function createEarthCanvas(): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = MAP_WIDTH;
	canvas.height = MAP_HEIGHT;
	return canvas;
}

export function drawVectorEarthMap(
	context: CanvasRenderingContext2D,
	style: VectorEarthStyle,
	countries: Country[],
	activeName: string | null
) {
	context.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
	context.fillStyle = style.ocean;
	context.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

	context.strokeStyle = style.grid;
	context.lineWidth = style.gridWidth;
	context.beginPath();
	for (let lon = -150; lon <= 150; lon += 30) {
		const [x] = project(lon, 0);
		context.moveTo(x, 0);
		context.lineTo(x, MAP_HEIGHT);
	}
	for (let lat = -60; lat <= 60; lat += 30) {
		const [, y] = project(0, lat);
		context.moveTo(0, y);
		context.lineTo(MAP_WIDTH, y);
	}
	context.stroke();

	context.lineJoin = 'round';
	context.lineCap = 'round';

	for (const country of countries) {
		context.fillStyle =
			country.name === activeName ? style.highlight : countryFill(country.name, style);
		for (const polygon of country.polygons) {
			context.beginPath();
			for (const ring of polygon) traceRing(context, ring);
			context.fill('evenodd');
		}
	}

	context.strokeStyle = style.coast;
	context.lineWidth = style.coastWidth;
	context.beginPath();
	for (const country of countries) {
		for (const polygon of country.polygons) {
			for (const ring of polygon) traceRing(context, ring);
		}
	}
	context.stroke();
}
