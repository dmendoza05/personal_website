import countriesGeoJson from './countries.geojson?raw';

const MAP_WIDTH = 2048;
const MAP_HEIGHT = 1024;

export interface VectorEarthStyle {
	ocean: string;
	land: string;
	highlight: string;
	dotGap: number;
	dotSize: number;
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
	longitude: number;
	latitude: number;
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

interface LandDot {
	x: number;
	y: number;
	country: number;
}

let cachedDots: LandDot[] | null = null;
let cachedGap = -1;

function landDots(countries: Country[], gap: number): LandDot[] {
	if (cachedDots && cachedGap === gap) return cachedDots;

	const mask = document.createElement('canvas');
	mask.width = MAP_WIDTH;
	mask.height = MAP_HEIGHT;
	const maskContext = mask.getContext('2d', { willReadFrequently: true });
	if (!maskContext) return [];

	maskContext.fillStyle = '#000';
	maskContext.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

	for (let index = 0; index < countries.length; index += 1) {
		const id = index + 1;
		maskContext.fillStyle = `rgb(255 ${(id >> 8) & 255} ${id & 255})`;
		for (const polygon of countries[index].polygons) {
			maskContext.beginPath();
			for (const ring of polygon) traceRing(maskContext, ring);
			maskContext.fill('evenodd');
		}
	}

	const pixels = maskContext.getImageData(0, 0, MAP_WIDTH, MAP_HEIGHT).data;
	const dots: LandDot[] = [];
	const step = Math.max(2, gap);

	for (let y = step / 2; y < MAP_HEIGHT; y += step) {
		const lat = 90 - (y / MAP_HEIGHT) * 180;
		const latScale = Math.max(0.28, Math.cos((lat * Math.PI) / 180));
		const stepX = step / latScale;

		for (let x = stepX / 2; x < MAP_WIDTH; x += stepX) {
			const offset = (Math.floor(y) * MAP_WIDTH + Math.floor(x)) * 4;
			if (pixels[offset] !== 255) continue;

			const id = ((pixels[offset + 1] << 8) | pixels[offset + 2]) - 1;
			if (id < 0 || id >= countries.length) continue;
			dots.push({ x, y, country: id });
		}
	}

	cachedDots = dots;
	cachedGap = gap;
	return dots;
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

function wrapLongitude(longitude: number): number {
	let value = longitude;
	while (value > 180) value -= 360;
	while (value < -180) value += 360;
	return value;
}

/** Walk the ring so a dateline crossing stays continuous for the centroid. */
function unwrapLongitudes(ring: Ring): Array<{ lon: number; lat: number }> {
	if (ring.length === 0) return [];

	const points: Array<{ lon: number; lat: number }> = [];
	let offset = 0;
	let previous = ring[0][0];

	for (const [lon, lat] of ring) {
		let adjusted = lon + offset;
		while (adjusted - previous > 180) {
			offset -= 360;
			adjusted = lon + offset;
		}
		while (previous - adjusted > 180) {
			offset += 360;
			adjusted = lon + offset;
		}
		points.push({ lon: adjusted, lat });
		previous = adjusted;
	}

	return points;
}

function ringFocus(ring: Ring): { longitude: number; latitude: number; area: number } {
	const points = unwrapLongitudes(ring);
	if (points.length === 0) return { longitude: 0, latitude: 0, area: 0 };

	let crossSum = 0;
	let centerLon = 0;
	let centerLat = 0;

	for (
		let index = 0, previous = points.length - 1;
		index < points.length;
		previous = index, index += 1
	) {
		const start = points[previous];
		const end = points[index];
		const cross = start.lon * end.lat - end.lon * start.lat;
		crossSum += cross;
		centerLon += (start.lon + end.lon) * cross;
		centerLat += (start.lat + end.lat) * cross;
	}

	const area = crossSum / 2;
	if (Math.abs(area) < 1e-6) {
		const longitude = points.reduce((sum, point) => sum + point.lon, 0) / points.length;
		const latitude = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
		return { longitude: wrapLongitude(longitude), latitude, area: 0 };
	}

	return {
		longitude: wrapLongitude(centerLon / (6 * area)),
		latitude: centerLat / (6 * area),
		area: Math.abs(area)
	};
}

function countryFocus(polygons: Ring[][]): { longitude: number; latitude: number } {
	let best = { longitude: 0, latitude: 0, area: -1 };

	for (const polygon of polygons) {
		if (polygon.length === 0) continue;
		const focus = ringFocus(polygon[0]);
		if (focus.area > best.area) best = focus;
	}

	return {
		longitude: best.longitude,
		latitude: Math.min(90, Math.max(-90, best.latitude))
	};
}

/** Yaw and pitch that bring a longitude/latitude to the center of the globe. */
export function countryView(
	longitude: number,
	latitude: number,
	maxPitch = Math.PI / 2 - 0.08
): { yaw: number; pitch: number } {
	return {
		yaw: -Math.PI / 2 - (longitude * Math.PI) / 180,
		pitch: Math.min(maxPitch, Math.max(-maxPitch, (latitude * Math.PI) / 180))
	};
}

let cachedCountries: Country[] | null = null;

export function loadCountries(): Country[] {
	if (cachedCountries) return cachedCountries;

	const collection = JSON.parse(countriesGeoJson) as { features: CountryFeature[] };
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

		const focus = countryFocus(polygons);
		countries.push({
			name,
			polygons,
			minLon,
			maxLon,
			minLat,
			maxLat,
			area: (maxLon - minLon) * (maxLat - minLat),
			longitude: focus.longitude,
			latitude: focus.latitude
		});
	}

	countries.sort((left, right) => right.area - left.area);
	cachedCountries = countries;
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

	const dots = landDots(countries, style.dotGap);
	const radius = Math.max(0.5, style.dotSize);
	const activeIndex = activeName
		? countries.findIndex((country) => country.name === activeName)
		: -1;

	context.beginPath();
	for (const dot of dots) {
		if (dot.country === activeIndex) continue;
		context.moveTo(dot.x + radius, dot.y);
		context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
	}
	context.fillStyle = style.land;
	context.fill();

	if (activeIndex === -1) return;

	context.beginPath();
	for (const dot of dots) {
		if (dot.country !== activeIndex) continue;
		context.moveTo(dot.x + radius, dot.y);
		context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
	}
	context.fillStyle = style.highlight;
	context.fill();
}
