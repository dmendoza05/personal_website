/** Downtown Los Angeles. */
const LOS_ANGELES = { latitude: 34.0522, longitude: -118.2437 };

const EARTH_RADIUS_MILES = 3958.8;

export function milesBetween(
	from: { latitude: number; longitude: number },
	to: { latitude: number; longitude: number }
): number {
	const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
	const latitudeDelta = toRadians(to.latitude - from.latitude);
	const longitudeDelta = toRadians(to.longitude - from.longitude);
	const fromLatitude = toRadians(from.latitude);
	const toLatitude = toRadians(to.latitude);
	const haversine =
		Math.sin(latitudeDelta / 2) ** 2 +
		Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

	return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(haversine)));
}

export function milesFromLosAngeles(latitude: number, longitude: number): number {
	return milesBetween({ latitude, longitude }, LOS_ANGELES);
}

export function nearestMile(miles: number): number {
	if (!Number.isFinite(miles) || miles < 0) return 0;
	return Math.round(miles);
}

/** Copy for “Daniel is… {phrase} away!” Unknown locations keep the original gag. */
export function awayPhrase(miles: number | null): string {
	if (miles == null) return '1 mile';

	const nearest = nearestMile(miles);
	if (nearest <= 0) return 'less than a mile';
	if (nearest === 1) return '1 mile';
	return `${nearest.toLocaleString('en-US')} miles`;
}
