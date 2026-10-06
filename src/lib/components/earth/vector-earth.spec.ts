import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { countryView, loadCountries } from './vector-earth';

function country(name: string) {
	const match = loadCountries().find((entry) => entry.name === name);
	if (!match) throw new Error(`Missing country ${name}`);
	return match;
}

describe('loadCountries focus point', () => {
	it('places large countries on their main landmass', () => {
		const unitedStates = country('United States of America');
		expect(unitedStates.longitude).toBeGreaterThan(-125);
		expect(unitedStates.longitude).toBeLessThan(-70);
		expect(unitedStates.latitude).toBeGreaterThan(25);
		expect(unitedStates.latitude).toBeLessThan(50);

		const france = country('France');
		expect(france.longitude).toBeGreaterThan(-5);
		expect(france.longitude).toBeLessThan(10);
		expect(france.latitude).toBeGreaterThan(42);
		expect(france.latitude).toBeLessThan(51);

		const australia = country('Australia');
		expect(australia.longitude).toBeGreaterThan(110);
		expect(australia.longitude).toBeLessThan(155);
		expect(australia.latitude).toBeLessThan(-10);
		expect(australia.latitude).toBeGreaterThan(-45);
	});

	it('keeps a dateline country in the Pacific', () => {
		const fiji = country('Fiji');
		expect(Math.abs(fiji.longitude)).toBeGreaterThan(90);
		expect(fiji.latitude).toBeLessThan(0);
		expect(fiji.latitude).toBeGreaterThan(-25);
	});
});

function spherePoint(longitude: number, latitude: number): THREE.Vector3 {
	const phi = (longitude * Math.PI) / 180 + Math.PI;
	const theta = Math.PI / 2 - (latitude * Math.PI) / 180;
	const ring = Math.sin(theta);
	return new THREE.Vector3(-ring * Math.cos(phi), Math.cos(theta), ring * Math.sin(phi));
}

describe('countryView', () => {
	it('turns longitude and latitude into a front-facing view', () => {
		expect(countryView(-90, 0).yaw).toBeCloseTo(0);
		expect(countryView(0, 0).yaw).toBeCloseTo(-Math.PI / 2);
		expect(countryView(0, 0).pitch).toBeCloseTo(0);
		expect(countryView(0, 45).pitch).toBeCloseTo(Math.PI / 4);
	});

	it('places a country on the camera axis', () => {
		const unitedStates = country('United States of America');
		const { yaw, pitch } = countryView(unitedStates.longitude, unitedStates.latitude);
		const earth = new THREE.Object3D();
		earth.rotation.y = yaw;
		const view = new THREE.Object3D();
		view.rotation.x = pitch;
		view.add(earth);
		view.updateMatrixWorld(true);

		const world = spherePoint(unitedStates.longitude, unitedStates.latitude).applyMatrix4(
			earth.matrixWorld
		);
		expect(world.x).toBeCloseTo(0, 4);
		expect(world.y).toBeCloseTo(0, 4);
		expect(world.z).toBeCloseTo(1, 4);
	});
});
