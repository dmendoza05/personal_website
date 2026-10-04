<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createEarthCanvas,
		drawVectorEarthMap,
		findCountry,
		loadCountries
	} from './vector-earth';

	let { onCountry }: { onCountry?: (name: string) => void } = $props();

	const globe = {
		/** How far the poles lean, in radians. `(23.4 * Math.PI) / 180` matches Earth. */
		axialTilt: (1 * Math.PI) / 180,
		/** Spin speed in radians per second. Negative turns the globe west to east. */
		rotationSpeed: -0.1,
		/** Space around the globe. `1` fills the view; higher values make it smaller. */
		margin: 1.2,
		/** Ocean fill. `transparent` shows the page behind the globe. */
		ocean: 'rgba(255, 255, 255, 0.5)',
		/** Base continent fill. Each country is a shade of this color. */
		land: '#f4efe4',
		/** Country border color. */
		coast: '#1a2332',
		/** Fill for the country under the pointer. */
		highlight: '#fff4c2',
		/** Latitude and longitude line color. */
		grid: 'rgba(255, 255, 255, 0.22)',
		/** Country border thickness, in pixels on the 2048px-wide map. */
		coastWidth: 1,
		/** Latitude and longitude line thickness, in pixels on the 2048px-wide map. */
		gridWidth: 1,
		/** Radians the globe turns when a drag crosses its full width or height. */
		dragRange: Math.PI
	};

	let canvas: HTMLCanvasElement;
	let countryName = $state('');
	let labelX = $state(0);
	let labelY = $state(0);

	onMount(() => {
		let disposed = false;
		let stop = () => {};

		void (async () => {
			const THREE = await import('three');
			const countries = await loadCountries();
			if (disposed) return;

			const map = createEarthCanvas();
			const context = map.getContext('2d');
			if (!context) return;
			const mapContext = context;

			const renderer = new THREE.WebGLRenderer({
				canvas,
				alpha: true,
				antialias: true
			});
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			renderer.setClearColor(0x000000, 0);

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
			camera.position.z = 3;

			const geometry = new THREE.SphereGeometry(1, 64, 64);
			const texture = new THREE.CanvasTexture(map);
			texture.colorSpace = THREE.SRGBColorSpace;
			texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

			let activeCountry: string | null = null;
			let hovering = false;
			let dragging = false;
			let dragX = 0;
			let dragY = 0;
			let pitch = 0;
			const maxPitch = Math.PI / 2 - 0.08;

			function paint(name: string | null) {
				drawVectorEarthMap(mapContext, globe, countries, name);
				texture.needsUpdate = true;
				renderer.render(scene, camera);
			}

			function showCountry(name: string) {
				if (name === countryName) return;
				countryName = name;
				onCountry?.(name);
			}

			const material = new THREE.MeshLambertMaterial({
				map: texture,
				transparent: true
			});
			const earth = new THREE.Mesh(geometry, material);
			const tilt = new THREE.Group();
			tilt.rotation.z = globe.axialTilt;
			tilt.add(earth);
			const view = new THREE.Group();
			view.add(tilt);
			scene.add(view);

			scene.add(new THREE.AmbientLight(0xffffff, 0.82));
			const sun = new THREE.DirectionalLight(0xffffff, 0.4);
			sun.position.set(2.5, 0.8, 4);
			scene.add(sun);

			const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			let reduceMotion = motionQuery.matches;
			let frame = 0;
			let last = performance.now();

			function resize() {
				const width = canvas.clientWidth;
				const height = canvas.clientHeight;
				if (width === 0 || height === 0) return;

				renderer.setSize(width, height, false);
				camera.aspect = width / height;

				const verticalFov = (camera.fov * Math.PI) / 180;
				const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
				const distanceForHeight = globe.margin / Math.tan(verticalFov / 2);
				const distanceForWidth = globe.margin / Math.tan(horizontalFov / 2);
				camera.position.z = Math.max(distanceForHeight, distanceForWidth);
				camera.updateProjectionMatrix();
				renderer.render(scene, camera);
			}

			const raycaster = new THREE.Raycaster();
			const pointer = new THREE.Vector2();

			function turnFromDrag(deltaX: number, deltaY: number) {
				const rect = canvas.getBoundingClientRect();
				const span = Math.min(rect.width, rect.height) || 1;
				earth.rotation.y -= (deltaX / span) * globe.dragRange;
				pitch = Math.min(maxPitch, Math.max(-maxPitch, pitch + (deltaY / span) * globe.dragRange));
				view.rotation.x = pitch;
				if (reduceMotion) renderer.render(scene, camera);
			}

			function onPointerDown(event: PointerEvent) {
				if (event.button !== 0) return;

				dragging = true;
				dragX = event.clientX;
				dragY = event.clientY;
				hovering = true;
				canvas.setPointerCapture(event.pointerId);
				canvas.style.cursor = 'grabbing';
				showCountry('');
				if (activeCountry) {
					activeCountry = null;
					paint(null);
				}
			}

			function onPointerUp(event: PointerEvent) {
				if (!dragging) return;

				dragging = false;
				canvas.style.cursor = '';
				if (canvas.hasPointerCapture(event.pointerId)) {
					canvas.releasePointerCapture(event.pointerId);
				}
				onPointerMove(event);
			}

			function onPointerMove(event: PointerEvent) {
				if (dragging) {
					turnFromDrag(event.clientX - dragX, event.clientY - dragY);
					dragX = event.clientX;
					dragY = event.clientY;
					return;
				}

				hovering = true;
				const rect = canvas.getBoundingClientRect();
				pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
				raycaster.setFromCamera(pointer, camera);

				const hit = raycaster.intersectObject(earth, false)[0];
				const uv = hit?.uv;
				const name = uv ? findCountry(countries, uv.x * 360 - 180, uv.y * 180 - 90) : null;

				if (name !== activeCountry) {
					activeCountry = name;
					paint(name);
				}

				showCountry(name ?? '');
				const parent = canvas.parentElement?.getBoundingClientRect();
				if (parent) {
					labelX = event.clientX - parent.left + 14;
					labelY = event.clientY - parent.top + 14;
				}
			}

			function onPointerLeave() {
				if (dragging) return;

				hovering = false;
				if (activeCountry) {
					activeCountry = null;
					paint(null);
				}
				showCountry('');
			}

			function tick(now: number) {
				const delta = (now - last) / 1000;
				last = now;
				if (!activeCountry && !dragging) earth.rotation.y += delta * globe.rotationSpeed;
				renderer.render(scene, camera);
				frame = requestAnimationFrame(tick);
			}

			function start() {
				cancelAnimationFrame(frame);
				if (reduceMotion) {
					renderer.render(scene, camera);
					return;
				}

				last = performance.now();
				frame = requestAnimationFrame(tick);
			}

			function onMotionChange() {
				reduceMotion = motionQuery.matches;
				start();
			}

			const observer = new ResizeObserver(resize);
			observer.observe(canvas);
			canvas.addEventListener('pointerdown', onPointerDown);
			canvas.addEventListener('pointermove', onPointerMove);
			canvas.addEventListener('pointerup', onPointerUp);
			canvas.addEventListener('pointercancel', onPointerUp);
			canvas.addEventListener('pointerleave', onPointerLeave);
			motionQuery.addEventListener('change', onMotionChange);
			paint(null);
			resize();
			start();

			stop = () => {
				cancelAnimationFrame(frame);
				observer.disconnect();
				canvas.removeEventListener('pointerdown', onPointerDown);
				canvas.removeEventListener('pointermove', onPointerMove);
				canvas.removeEventListener('pointerup', onPointerUp);
				canvas.removeEventListener('pointercancel', onPointerUp);
				canvas.removeEventListener('pointerleave', onPointerLeave);
				motionQuery.removeEventListener('change', onMotionChange);
				geometry.dispose();
				material.dispose();
				texture.dispose();
				renderer.dispose();
			};
		})();

		return () => {
			disposed = true;
			stop();
		};
	});
</script>

<canvas bind:this={canvas} class="globe" aria-label="Rotating Earth"></canvas>
{#if countryName}
	<p class="country-label" style:left="{labelX}px" style:top="{labelY}px">{countryName}</p>
{/if}

<style>
	.globe {
		position: absolute;
		display: block;
		inset: 0;
		width: 100%;
		height: 100%;
		cursor: grab;
		touch-action: none;
	}

	.country-label {
		position: absolute;
		z-index: 20;
		padding: 0.2rem 0.55rem;
		border: 1px solid var(--border);
		background: var(--card);
		color: var(--fg);
		font-size: 0.875rem;
		line-height: 1.2;
		pointer-events: none;
		white-space: nowrap;
	}
</style>
