import { dev } from '$app/environment';
import { milesFromLosAngeles, nearestMile } from '$lib/distance-from-la';

type VisitorCf = {
	latitude?: string;
	longitude?: string;
};

let cachedDevMiles: number | null | undefined;

function coordinate(value: unknown): number | null {
	const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
	return Number.isFinite(parsed) ? parsed : null;
}

function coordinatesFrom(latitude: unknown, longitude: unknown) {
	const lat = coordinate(latitude);
	const lon = coordinate(longitude);
	if (lat == null || lon == null) return null;
	if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
	return { latitude: lat, longitude: lon };
}

async function lookupDevMiles(): Promise<number | null> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 2000);

	try {
		const response = await fetch('https://get.geojs.io/v1/ip/geo.json', {
			signal: controller.signal
		});
		if (!response.ok) return null;

		const body: unknown = await response.json();
		if (typeof body !== 'object' || body === null) return null;

		const coords = coordinatesFrom(
			(body as { latitude?: unknown }).latitude,
			(body as { longitude?: unknown }).longitude
		);
		if (!coords) return null;

		return nearestMile(milesFromLosAngeles(coords.latitude, coords.longitude));
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

/**
 * Miles from downtown Los Angeles, rounded.
 * Production uses the Cloudflare visitor location on the request.
 * Local dev has no visitor coordinates, so it looks up this machine's public IP once.
 */
export async function milesFromVisitor(cf: VisitorCf | undefined): Promise<number | null> {
	const fromCloudflare = coordinatesFrom(cf?.latitude, cf?.longitude);
	if (fromCloudflare) {
		return nearestMile(milesFromLosAngeles(fromCloudflare.latitude, fromCloudflare.longitude));
	}

	if (!dev) return null;
	if (cachedDevMiles !== undefined) return cachedDevMiles;

	const miles = await lookupDevMiles();
	if (miles != null) cachedDevMiles = miles;
	return miles;
}
